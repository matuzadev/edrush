// /api/groups
//   GET  → listagem paginada com filtros (concurso, search, mine).
//   POST → cria grupo + auto-add do owner como membro role=owner.
//
// Decisões importantes:
//   - SQL bruto via libsql (createClient) em vez de Drizzle, porque o schema
//     dos grupos é gerenciado pelo outro engenheiro em src/lib/db.ts e ainda
//     não foi adicionado ao @/db/schema.ts. Quando ele adicionar, podemos
//     migrar pra Drizzle sem mudar o contrato HTTP.
//   - Cursor opaco (created_at + id) para evitar offset (que degrada com
//     volume).
//   - Rate limit duplo: por IP (rateLimit) + por user (1 grupo / hora).
//   - Limite hard de 5 grupos por usuário (regra de produto).

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/auth';
import type { InValue } from '@libsql/client';
import { lsClient as client } from '@/lib/db';
import { rateLimit } from '@/lib/rate-limit';
import {
  buildGroupSlug,
  decodeGroupCursor,
  encodeGroupCursor,
  getGroupAccent,
  groupIdNanoid,
  GROUP_CREATE_LIMIT_PER_USER,
  validateGroupInput,
  type GroupListItem,
  type GroupRole,
} from '@/lib/study-groups';

const PAGE_SIZE = 20;

// Rate limit em memória pra criação de grupos (1 por hora por user).
// Em produção isso deveria ir pro Redis — replica fica unsync, mas ok pra MVP.
const createCooldown = new Map<string, number>();
const CREATE_COOLDOWN_MS = 60 * 60 * 1000;

interface GroupRow {
  id: string;
  owner_id: string;
  name: string;
  slug: string;
  description: string | null;
  concurso_slug: string | null;
  is_private: number;
  member_count: number;
  created_at: string;
  my_role: string | null;
}

function rowToListItem(row: GroupRow, currentUserId: string | null): GroupListItem {
  const isMember = row.my_role !== null || row.owner_id === currentUserId;
  // Owner sempre tem role 'owner' mesmo se a linha de members não foi lida
  // (defensivo; o seed da rota POST sempre cria a row, mas defendemos contra
  // dados legados).
  const myRole: GroupRole | null = row.owner_id === currentUserId
    ? 'owner'
    : (row.my_role as GroupRole | null);

  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    description: row.description,
    concursoSlug: row.concurso_slug,
    isPrivate: row.is_private === 1,
    memberCount: row.member_count,
    createdAt: row.created_at,
    ownerId: row.owner_id,
    isMember,
    myRole,
    accent: getGroupAccent(row.concurso_slug),
  };
}

// ─── GET ───────────────────────────────────────────────────────────────────
export async function GET(req: NextRequest) {
  const limited = rateLimit(req);
  if (limited) return limited;

  const session = await getServerSession(authOptions);
  const currentUserId = (session?.user as { id?: string } | undefined)?.id ?? null;

  const sp = req.nextUrl.searchParams;
  const cursor = decodeGroupCursor(sp.get('cursor'));
  const concurso = sp.get('concurso')?.trim() || null;
  const search = sp.get('search')?.trim() || null;
  const mine = sp.get('mine') === '1';

  if (mine && !currentUserId) {
    return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });
  }

  // Construímos SQL parametrizado. Cada filtro vira uma cláusula AND opcional.
  // O LEFT JOIN em study_group_members serve pra carregar `my_role` numa só
  // query (evita N+1 quando paginamos).
  const params: InValue[] = [];
  const where: string[] = [];

  // Cursor: created_at < ? OR (created_at = ? AND id < ?)
  // (DESC ordering)
  if (cursor) {
    where.push('(g.created_at < ? OR (g.created_at = ? AND g.id < ?))');
    params.push(cursor.createdAt, cursor.createdAt, cursor.id);
  }

  if (concurso) {
    where.push('g.concurso_slug = ?');
    params.push(concurso);
  }

  if (search) {
    where.push('(LOWER(g.name) LIKE ? OR LOWER(g.description) LIKE ?)');
    const term = `%${search.toLowerCase()}%`;
    params.push(term, term);
  }

  if (mine) {
    // Forçamos o INNER JOIN ao filtrar "meus grupos"
    where.push('m.user_id IS NOT NULL');
  }

  // Privacidade: grupos privados só aparecem se o user é membro/owner.
  // (No MVP, ainda não implementamos approval — privados ficam ocultos pra
  // não-membros mas existem.)
  if (currentUserId) {
    where.push('(g.is_private = 0 OR m.user_id IS NOT NULL OR g.owner_id = ?)');
    params.push(currentUserId);
  } else {
    where.push('g.is_private = 0');
  }

  const sql = `
    SELECT
      g.id, g.owner_id, g.name, g.slug, g.description,
      g.concurso_slug, g.is_private, g.member_count, g.created_at,
      m.role AS my_role
    FROM study_groups g
    LEFT JOIN study_group_members m
      ON m.group_id = g.id AND m.user_id = ?
    ${where.length ? 'WHERE ' + where.join(' AND ') : ''}
    ORDER BY g.created_at DESC, g.id DESC
    LIMIT ?
  `;

  // O '?' do JOIN entra ANTES dos filtros do WHERE (ordem dos placeholders).
  const finalParams: InValue[] = [currentUserId ?? '', ...params, PAGE_SIZE + 1];

  try {
    const rs = await client.execute({ sql, args: finalParams });
    const rows = rs.rows as unknown as GroupRow[];

    const hasMore = rows.length > PAGE_SIZE;
    const page = hasMore ? rows.slice(0, PAGE_SIZE) : rows;
    const groups = page.map((r) => rowToListItem(r, currentUserId));

    const nextCursor = hasMore && page.length > 0
      ? encodeGroupCursor(page[page.length - 1].created_at, page[page.length - 1].id)
      : null;

    return NextResponse.json({ groups, nextCursor });
  } catch (error) {
    console.error('Erro ao listar grupos:', error);
    return NextResponse.json(
      { error: 'Erro ao listar grupos' },
      { status: 500 },
    );
  }
}

// ─── POST ──────────────────────────────────────────────────────────────────
export async function POST(req: NextRequest) {
  const limited = rateLimit(req);
  if (limited) return limited;

  const session = await getServerSession(authOptions);
  const userId = (session?.user as { id?: string } | undefined)?.id;
  if (!userId) {
    return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });
  }

  // Cooldown de criação (1h por user)
  const lastCreate = createCooldown.get(userId);
  if (lastCreate && Date.now() - lastCreate < CREATE_COOLDOWN_MS) {
    const remaining = Math.ceil((CREATE_COOLDOWN_MS - (Date.now() - lastCreate)) / 60000);
    return NextResponse.json(
      { error: `Aguarde ${remaining} min antes de criar outro grupo.` },
      { status: 429 },
    );
  }

  let body: {
    name?: string;
    description?: string | null;
    concursoSlug?: string | null;
    isPrivate?: boolean;
  };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Body inválido' }, { status: 400 });
  }

  const validation = validateGroupInput(body);
  if (validation) {
    return NextResponse.json({ error: validation }, { status: 400 });
  }

  const name = body.name!.trim();
  const description = body.description?.trim() || null;
  const concursoSlug = body.concursoSlug?.trim() || null;
  const isPrivate = body.isPrivate ? 1 : 0;

  try {
    // Hard-limit: 5 grupos criados por user (regra de produto).
    const ownedRs = await client.execute({
      sql: 'SELECT COUNT(*) AS n FROM study_groups WHERE owner_id = ?',
      args: [userId],
    });
    const owned = Number((ownedRs.rows[0] as unknown as { n: number })?.n ?? 0);
    if (owned >= GROUP_CREATE_LIMIT_PER_USER) {
      return NextResponse.json(
        { error: `Você já criou o máximo de ${GROUP_CREATE_LIMIT_PER_USER} grupos.` },
        { status: 403 },
      );
    }

    // Slug com retry — colisão é improvável (nanoid 6 chars alfa = ~1 bilhão),
    // mas garantimos com até 5 tentativas antes de desistir.
    let slug = buildGroupSlug(name);
    for (let i = 0; i < 5; i++) {
      const exists = await client.execute({
        sql: 'SELECT 1 FROM study_groups WHERE slug = ? LIMIT 1',
        args: [slug],
      });
      if (exists.rows.length === 0) break;
      slug = buildGroupSlug(name);
      if (i === 4) {
        return NextResponse.json(
          { error: 'Falha ao gerar slug único. Tente outro nome.' },
          { status: 500 },
        );
      }
    }

    const id = groupIdNanoid();
    const now = new Date().toISOString();

    // Insert do grupo + auto-membership do owner em transação (batch).
    await client.batch(
      [
        {
          sql: `INSERT INTO study_groups
            (id, owner_id, name, slug, description, concurso_slug, is_private, member_count, created_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, 1, ?)`,
          args: [id, userId, name, slug, description, concursoSlug, isPrivate, now],
        },
        {
          sql: `INSERT INTO study_group_members
            (group_id, user_id, role, joined_at)
            VALUES (?, ?, 'owner', ?)`,
          args: [id, userId, now],
        },
      ],
      'write',
    );

    createCooldown.set(userId, Date.now());

    const group: GroupListItem = {
      id,
      name,
      slug,
      description,
      concursoSlug,
      isPrivate: isPrivate === 1,
      memberCount: 1,
      createdAt: now,
      ownerId: userId,
      isMember: true,
      myRole: 'owner',
      accent: getGroupAccent(concursoSlug),
    };

    return NextResponse.json({ group }, { status: 201 });
  } catch (error) {
    console.error('Erro ao criar grupo:', error);
    return NextResponse.json(
      { error: 'Erro ao criar grupo' },
      { status: 500 },
    );
  }
}
