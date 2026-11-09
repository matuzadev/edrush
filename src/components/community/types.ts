// Tipos compartilhados pelos componentes da comunidade

export type PostType = 'text' | 'result' | 'question' | 'news';
export type TargetType = 'question' | 'session' | null;

export interface PostAuthor {
  id: string;
  username: string;
  nome: string | null;
  avatarId: number;
  equippedBorder: string;
  xp?: number;
}

export interface PostMetadataResult {
  acertos?: number;
  total?: number;
  disciplina?: string;
  capitulo?: string;
  accuracy?: number;
}

export interface PostMetadataQuestion {
  questionTitle?: string;
  questionPreview?: string;
  banca?: string;
  ano?: number;
}

export interface Post {
  id: string;
  content: string;
  postType: PostType;
  groupId: string | null;
  targetType: TargetType;
  targetId: string | null;
  imageUrl: string | null;
  metadata: unknown;
  likesCount: number;
  commentsCount: number;
  isPinned: boolean;
  likedByMe: boolean;
  createdAt: string;
  author: PostAuthor;
  // grupo (joined opcional)
  groupName?: string | null;
  groupSlug?: string | null;
  groupAccentColor?: string | null;
}

export interface Comment {
  id: string;
  postId: string;
  parentId: string | null;
  content: string;
  likesCount: number;
  likedByMe: boolean;
  createdAt: string;
  author: PostAuthor;
}

export interface FeedResponse {
  posts: Post[];
  nextCursor: string | null;
}

// Helper: tempo relativo PT-BR
export function relativeTime(iso: string): string {
  const ms = Date.now() - new Date(iso).getTime();
  if (ms < 60_000) return 'agora';
  const min = Math.floor(ms / 60_000);
  if (min < 60) return `${min}min`;
  const h = Math.floor(min / 60);
  if (h < 24) return `${h}h`;
  const d = Math.floor(h / 24);
  if (d < 30) return `${d}d`;
  const mo = Math.floor(d / 30);
  return `${mo}mês`;
}
