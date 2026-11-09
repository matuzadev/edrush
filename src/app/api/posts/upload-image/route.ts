import { NextRequest, NextResponse } from 'next/server';
import { put } from '@vercel/blob';
import { getAuthedUserId, userRateLimit } from '@/lib/community';

/**
 * POST /api/posts/upload-image
 *
 * Recebe FormData com campo `file` (image/jpeg|png|webp, max 5MB) e faz
 * upload para o Vercel Blob. Retorna `{ url }` da imagem hospedada.
 *
 * Validações:
 *   - Auth obrigatória
 *   - Rate limit: 10 uploads/hora por user
 *   - File size <= 5MB
 *   - MIME: image/jpeg | image/png | image/webp
 *   - Magic bytes: valida realmente PNG/JPEG/WebP (anti spoof de MIME)
 *
 * Variáveis de ambiente:
 *   - BLOB_READ_WRITE_TOKEN — gerado no dashboard da Vercel.
 *     Em prod a Vercel injeta automaticamente quando o store está
 *     vinculado ao projeto. Em dev local, defina manualmente em `.env.local`.
 */

export const runtime = 'nodejs';

const MAX_BYTES = 5 * 1024 * 1024; // 5MB
const ALLOWED_MIMES = new Set(['image/jpeg', 'image/png', 'image/webp']);

interface DetectedFormat {
  ext: 'jpg' | 'png' | 'webp';
  mime: 'image/jpeg' | 'image/png' | 'image/webp';
}

/**
 * Verifica magic bytes do buffer e retorna o formato real, ou null
 * se nenhum dos formatos suportados bater.
 */
function detectImageFormat(bytes: Uint8Array): DetectedFormat | null {
  if (bytes.length < 12) return null;

  // PNG: 89 50 4E 47
  if (
    bytes[0] === 0x89 &&
    bytes[1] === 0x50 &&
    bytes[2] === 0x4e &&
    bytes[3] === 0x47
  ) {
    return { ext: 'png', mime: 'image/png' };
  }

  // JPEG: FF D8 FF
  if (bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff) {
    return { ext: 'jpg', mime: 'image/jpeg' };
  }

  // WebP: bytes 0-3 = "RIFF", bytes 8-11 = "WEBP" (57 45 42 50)
  if (
    bytes[0] === 0x52 &&
    bytes[1] === 0x49 &&
    bytes[2] === 0x46 &&
    bytes[3] === 0x46 &&
    bytes[8] === 0x57 &&
    bytes[9] === 0x45 &&
    bytes[10] === 0x42 &&
    bytes[11] === 0x50
  ) {
    return { ext: 'webp', mime: 'image/webp' };
  }

  return null;
}

/** Gera um sufixo curto (alfanumérico) — sem dependência externa. */
function shortId(len = 10): string {
  const alphabet = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let out = '';
  for (let i = 0; i < len; i++) {
    out += alphabet[Math.floor(Math.random() * alphabet.length)];
  }
  return out;
}

export async function POST(req: NextRequest) {
  const userId = await getAuthedUserId();
  if (!userId) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }

  // Rate limit: 10 uploads/hora por user
  const rl = userRateLimit(`upload:${userId}`, 10, 3600);
  if (!rl.allowed) {
    return NextResponse.json(
      { error: 'rate_limited', retryAfter: rl.retryAfter },
      { status: 429 },
    );
  }

  // Parse FormData
  let form: FormData;
  try {
    form = await req.formData();
  } catch {
    return NextResponse.json({ error: 'invalid_form_data' }, { status: 400 });
  }

  const fileEntry = form.get('file');
  if (!fileEntry || typeof fileEntry === 'string') {
    return NextResponse.json({ error: 'file_missing' }, { status: 400 });
  }
  const file = fileEntry as File;

  // Validação de tamanho
  if (file.size <= 0) {
    return NextResponse.json({ error: 'file_empty' }, { status: 400 });
  }
  if (file.size > MAX_BYTES) {
    return NextResponse.json(
      { error: 'file_too_large', message: 'Arquivo maior que 5MB' },
      { status: 400 },
    );
  }

  // Validação MIME (declarado pelo client)
  if (!ALLOWED_MIMES.has(file.type)) {
    return NextResponse.json(
      { error: 'invalid_mime', message: 'Tipo de arquivo não suportado' },
      { status: 400 },
    );
  }

  // Lê os bytes
  let buffer: Buffer;
  try {
    const arr = await file.arrayBuffer();
    buffer = Buffer.from(arr);
  } catch {
    return NextResponse.json({ error: 'file_read_failed' }, { status: 400 });
  }

  // Validação de magic bytes — guarda real contra spoofing de MIME
  const detected = detectImageFormat(buffer);
  if (!detected) {
    return NextResponse.json(
      { error: 'invalid_image', message: 'Conteúdo não é uma imagem válida' },
      { status: 400 },
    );
  }

  // Garante que o MIME declarado bate com o conteúdo real
  if (detected.mime !== file.type) {
    return NextResponse.json(
      { error: 'mime_mismatch', message: 'MIME declarado não bate com o conteúdo' },
      { status: 400 },
    );
  }

  const filename = `posts/${userId}/${shortId(10)}.${detected.ext}`;

  try {
    const blob = await put(filename, buffer, {
      access: 'public',
      addRandomSuffix: true,
      contentType: detected.mime,
    });
    return NextResponse.json({ url: blob.url }, { status: 201 });
  } catch (error) {
    console.error('[/api/posts/upload-image] put falhou:', error);
    return NextResponse.json(
      { error: 'upload_failed', message: 'Falha ao subir imagem' },
      { status: 400 },
    );
  }
}
