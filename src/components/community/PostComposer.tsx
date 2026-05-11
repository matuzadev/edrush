'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import { Loader2, Send, X, ImageIcon, HelpCircle, Trophy } from 'lucide-react';
import { AvatarSelector } from '@/components/AvatarSelector';
import { MentionAutocomplete } from './MentionAutocomplete';
import type { Post, PostType } from './types';

interface Props {
  /** Avatar do usuário logado (pra mostrar no composer) */
  myAvatarId?: number;
  /** Pré-popular tipo (ex.: tela final de bloco oferece criar 'result') */
  defaultPostType?: PostType;
  /** Pré-popular metadata (ex.: resultado de bloco) */
  defaultMetadata?: unknown;
  /** Pré-popular target (ex.: discussão de uma questão específica) */
  defaultTargetType?: 'question' | 'session';
  defaultTargetId?: string;
  /** Grupo onde o post será criado (se aplicável) */
  groupId?: string | null;
  groupName?: string | null;
  /** Callback após criação bem-sucedida */
  onPosted?: (post: Post) => void;
}

const POST_MAX = 500; // limite cosmético — server aceita até 2000
const MAX_PRE_RESIZE_BYTES = 10 * 1024 * 1024; // 10MB (input cru)
const RESIZE_MAX_DIM = 1200;
const RESIZE_QUALITY = 0.82;
const ACCEPTED_MIMES = 'image/jpeg,image/png,image/webp';

/**
 * Redimensiona uma imagem via canvas para no máximo 1200x1200, exporta
 * como WebP com qualidade 0.82. Retorna um Blob.
 */
async function resizeImage(file: File): Promise<Blob> {
  const dataUrl = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(typeof reader.result === 'string' ? reader.result : '');
    reader.onerror = () => reject(new Error('read_failed'));
    reader.readAsDataURL(file);
  });

  const img = await new Promise<HTMLImageElement>((resolve, reject) => {
    const el = new Image();
    el.onload = () => resolve(el);
    el.onerror = () => reject(new Error('decode_failed'));
    el.src = dataUrl;
  });

  let { width, height } = img;
  if (width > RESIZE_MAX_DIM || height > RESIZE_MAX_DIM) {
    const scale = Math.min(RESIZE_MAX_DIM / width, RESIZE_MAX_DIM / height);
    width = Math.round(width * scale);
    height = Math.round(height * scale);
  }

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('canvas_unavailable');
  ctx.drawImage(img, 0, 0, width, height);

  const blob = await new Promise<Blob | null>((resolve) => {
    canvas.toBlob(resolve, 'image/webp', RESIZE_QUALITY);
  });
  if (!blob) throw new Error('encode_failed');
  return blob;
}
const TYPE_LABEL: Record<PostType, string> = {
  text: 'Texto',
  result: 'Resultado',
  question: 'Discussão de Questão',
  news: 'Notícia',
};

export function PostComposer({
  myAvatarId = 1,
  defaultPostType = 'text',
  defaultMetadata,
  defaultTargetType,
  defaultTargetId,
  groupId,
  groupName,
  onPosted,
}: Props) {
  const [expanded, setExpanded] = useState(false);
  const [text, setText] = useState('');
  const [postType] = useState<PostType>(defaultPostType);
  const [posting, setPosting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Estado de imagem
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  const charsLeft = POST_MAX - text.length;
  const canPost =
    text.trim().length > 0 && text.length <= POST_MAX && !posting && !uploading;

  // Cleanup do object URL para não vazar memória
  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const clearImage = useCallback(() => {
    setPreviewUrl((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return null;
    });
    setImageUrl(null);
    setUploading(false);
    if (fileInputRef.current) fileInputRef.current.value = '';
  }, []);

  const reset = useCallback(() => {
    setText('');
    setExpanded(false);
    setError(null);
    clearImage();
  }, [clearImage]);

  const handleFileSelected = useCallback(
    async (file: File) => {
      setError(null);

      // Validação cliente-side básica (server revalida)
      if (file.size > MAX_PRE_RESIZE_BYTES) {
        setError('Arquivo muito grande (max 10MB)');
        if (fileInputRef.current) fileInputRef.current.value = '';
        return;
      }
      if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
        setError('Formato não suportado (use JPEG, PNG ou WebP)');
        if (fileInputRef.current) fileInputRef.current.value = '';
        return;
      }

      // Preview imediato (mostra arquivo original enquanto resize/upload roda)
      const objectUrl = URL.createObjectURL(file);
      setPreviewUrl((prev) => {
        if (prev) URL.revokeObjectURL(prev);
        return objectUrl;
      });
      setImageUrl(null);
      setUploading(true);

      try {
        // Resize cliente-side -> WebP
        let blob: Blob;
        try {
          blob = await resizeImage(file);
        } catch {
          throw new Error('Falha ao processar imagem');
        }

        const form = new FormData();
        form.append('file', blob, 'upload.webp');

        const res = await fetch('/api/posts/upload-image', {
          method: 'POST',
          body: form,
        });
        if (!res.ok) {
          const data = (await res.json().catch(() => ({}))) as {
            message?: string;
            error?: string;
          };
          throw new Error(data.message ?? data.error ?? 'Falha no upload');
        }
        const data = (await res.json()) as { url?: string };
        if (!data.url) throw new Error('Resposta inválida do servidor');
        setImageUrl(data.url);
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Erro ao subir imagem');
        // Mantém preview pra usuário ver, mas zera URL hospedada
        setImageUrl(null);
      } finally {
        setUploading(false);
        if (fileInputRef.current) fileInputRef.current.value = '';
      }
    },
    [],
  );

  const submit = useCallback(async () => {
    if (!canPost) return;
    setPosting(true);
    setError(null);
    try {
      const res = await fetch('/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: text.trim(),
          postType,
          groupId: groupId ?? null,
          targetType: defaultTargetType ?? null,
          targetId: defaultTargetId ?? null,
          metadata: defaultMetadata ?? null,
          imageUrl: imageUrl ?? null,
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? 'falha ao publicar');
      }
      const data = await res.json();
      reset();
      onPosted?.(data.post);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'erro ao publicar');
    } finally {
      setPosting(false);
    }
  }, [
    canPost,
    text,
    postType,
    groupId,
    defaultTargetType,
    defaultTargetId,
    defaultMetadata,
    imageUrl,
    reset,
    onPosted,
  ]);

  if (!expanded) {
    return (
      <button
        onClick={() => setExpanded(true)}
        className="w-full text-left rounded-2xl px-5 py-4 transition-all hover:-translate-y-0.5 group"
        style={{
          background: 'linear-gradient(135deg, rgba(15,23,42,0.95), rgba(15,23,42,0.55))',
          border: '1px solid rgba(255,255,255,0.06)',
        }}
      >
        <div className="flex items-center gap-3">
          <div className="shrink-0">
            <AvatarSelector selectedId={myAvatarId} size="sm" />
          </div>
          <span className="text-sm text-slate-500 group-hover:text-slate-300 transition">
            {groupName ? `Postar em #${groupName}...` : 'O que você quer compartilhar?'}
          </span>
        </div>
      </button>
    );
  }

  return (
    <div
      className="relative overflow-hidden rounded-2xl"
      style={{
        background: 'linear-gradient(135deg, rgba(15,23,42,0.97), rgba(15,23,42,0.88))',
        border: '1px solid rgba(16,185,129,0.30)',
        boxShadow: '0 12px 32px -12px rgba(16,185,129,0.20)',
      }}
    >
      {/* Linha de gradient no topo */}
      <div
        className="absolute top-0 left-0 right-0 h-0.5 pointer-events-none"
        style={{ background: 'linear-gradient(90deg, #10b981, #06b6d4, #8b5cf6)' }}
      />

      <div className="px-5 pt-5 pb-4">
        <div className="flex items-start gap-3">
          <div className="shrink-0">
            <AvatarSelector selectedId={myAvatarId} size="sm" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              {postType === 'result' && (
                <span
                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-widest"
                  style={{
                    background: 'rgba(16,185,129,0.14)',
                    border: '1px solid rgba(16,185,129,0.40)',
                    color: '#34d399',
                  }}
                >
                  <Trophy size={10} /> Resultado
                </span>
              )}
              {postType === 'question' && (
                <span
                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-widest"
                  style={{
                    background: 'rgba(6,182,212,0.14)',
                    border: '1px solid rgba(6,182,212,0.40)',
                    color: '#22d3ee',
                  }}
                >
                  <HelpCircle size={10} /> Discussão de questão
                </span>
              )}
              {groupName && (
                <span
                  className="text-[10px] font-black uppercase tracking-widest text-emerald-300"
                >
                  em #{groupName}
                </span>
              )}
            </div>
            <div className="relative">
              <textarea
                ref={textareaRef}
                value={text}
                onChange={(e) => setText(e.target.value)}
                autoFocus
                placeholder={
                  postType === 'result'
                    ? 'Conte como foi seu bloco de estudo...'
                    : postType === 'question'
                      ? 'Compartilhe sua dúvida sobre essa questão...'
                      : 'Compartilhe algo com a comunidade...'
                }
                rows={4}
                className="w-full px-3 py-2 rounded-xl text-sm text-white placeholder-slate-600 outline-none resize-none transition"
                style={{
                  background: 'rgba(15,23,42,0.6)',
                  border: '1px solid rgba(255,255,255,0.08)',
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = '#10b981';
                  e.currentTarget.style.boxShadow = '0 0 0 2px rgba(16,185,129,0.15)';
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Escape') reset();
                  if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) submit();
                }}
              />
              <MentionAutocomplete
                textareaRef={textareaRef}
                value={text}
                onChange={setText}
              />
            </div>

            {/* Preview da imagem */}
            {previewUrl && (
              <div className="mt-3 relative inline-block">
                <div
                  className="relative rounded-xl overflow-hidden"
                  style={{
                    border: '1px solid rgba(255,255,255,0.08)',
                    maxWidth: 220,
                  }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={previewUrl}
                    alt="Pré-visualização"
                    className="block w-full h-auto"
                    style={{ maxHeight: 180, objectFit: 'cover' }}
                  />
                  {uploading && (
                    <div
                      className="absolute inset-0 flex items-center justify-center"
                      style={{ background: 'rgba(2,6,23,0.6)' }}
                    >
                      <Loader2 size={20} className="animate-spin text-emerald-400" />
                    </div>
                  )}
                </div>
                <button
                  type="button"
                  onClick={clearImage}
                  disabled={uploading}
                  className="absolute -top-2 -right-2 w-6 h-6 rounded-full flex items-center justify-center text-white transition disabled:opacity-50"
                  style={{
                    background: 'rgba(15,23,42,0.95)',
                    border: '1px solid rgba(255,255,255,0.15)',
                  }}
                  aria-label="Remover imagem"
                >
                  <X size={12} />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Banner de erro inline */}
        {error && (
          <div
            className="mt-3 px-3 py-2 rounded-lg text-[11px] font-bold"
            style={{
              background: 'rgba(244,63,94,0.10)',
              border: '1px solid rgba(244,63,94,0.30)',
              color: '#fb7185',
            }}
          >
            {error}
          </div>
        )}

        {/* Input file invisível */}
        <input
          ref={fileInputRef}
          type="file"
          accept={ACCEPTED_MIMES}
          className="hidden"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) void handleFileSelected(f);
          }}
        />

        {/* Footer */}
        <div className="flex items-center justify-between gap-3 mt-3 pt-3 border-t border-white/5">
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading || posting || !!previewUrl}
              className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-emerald-300 hover:bg-white/5 transition disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:text-slate-400 disabled:hover:bg-transparent"
              title={previewUrl ? 'Remova a imagem atual antes de adicionar outra' : 'Adicionar imagem'}
              aria-label="Adicionar imagem"
            >
              {uploading ? (
                <Loader2 size={14} className="animate-spin" />
              ) : (
                <ImageIcon size={14} />
              )}
            </button>
          </div>

          <div className="flex items-center gap-3">
            <span
              className={`text-[11px] font-mono tabular-nums ${
                charsLeft < 0 ? 'text-rose-400' : charsLeft < 50 ? 'text-amber-400' : 'text-slate-600'
              }`}
            >
              {charsLeft}
            </span>
            <button
              type="button"
              onClick={reset}
              disabled={posting}
              className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-500 hover:text-white hover:bg-white/5 transition"
              aria-label="Cancelar"
            >
              <X size={14} />
            </button>
            <button
              type="button"
              onClick={submit}
              disabled={!canPost}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-black text-slate-950 transition disabled:opacity-40 disabled:cursor-not-allowed"
              style={{
                background: 'linear-gradient(135deg, #10b981, #059669)',
                boxShadow: canPost ? '0 0 14px rgba(16,185,129,0.30)' : 'none',
              }}
            >
              {posting ? <Loader2 size={12} className="animate-spin" /> : <Send size={12} />}
              Publicar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Mantém referência para evitar warning de var não usada (constante exportada
// originalmente; preservada para compatibilidade visual).
void TYPE_LABEL;
