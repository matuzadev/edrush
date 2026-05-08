// Catálogo seed da loja de cristais.
// Inserido em store_items na primeira inicialização (ver seedStoreItems em db.ts).
// Para alterar preços/itens em produção: editar diretamente a tabela ou
// adicionar nova entry com slug único (idempotência por slug).

export type StoreItemCategory =
  | 'avatar_orgao'
  | 'avatar_vitoria'
  | 'borda_perfil'
  | 'mini_logo_badge'
  | 'exp_buff'
  | 'plataforma_trial';

export type StoreItemRarity = 'common' | 'rare' | 'epic' | 'legendary' | 'mythic';

export interface StoreItemSeed {
  slug: string;
  name: string;
  description: string;
  category: StoreItemCategory;
  priceCrystals: number;
  rarity: StoreItemRarity;
  imageUrl?: string | null;
  // Conteúdo livre por categoria — serializado como JSON em store_items.metadata.
  // Exemplos: { avatarId: 13 } | { multiplier: 2.0, durationHours: 24 } | { days: 30 }
  metadata?: Record<string, unknown> | null;
  isActive?: boolean;
  stock?: number | null;
}

export const STORE_ITEMS_SEED: StoreItemSeed[] = [
  // ── 6 AVATARES ÓRGÃO ──────────────────────────────────────────────
  // IDs referenciam src/data/avatars.ts (categoria 'orgao').
  {
    slug: 'avatar-orgao-pf',
    name: 'Avatar Polícia Federal',
    description: 'Distintivo oficial da Polícia Federal — guardião das fronteiras.',
    category: 'avatar_orgao',
    priceCrystals: 800,
    rarity: 'common',
    metadata: { avatarId: 13 },
  },
  {
    slug: 'avatar-orgao-prf',
    name: 'Avatar PRF',
    description: 'Símbolo da Polícia Rodoviária Federal — vigilância nas estradas.',
    category: 'avatar_orgao',
    priceCrystals: 900,
    rarity: 'common',
    metadata: { avatarId: 14 },
  },
  {
    slug: 'avatar-orgao-pm',
    name: 'Avatar Polícia Militar',
    description: 'Brasão da PM — disciplina e ordem pública.',
    category: 'avatar_orgao',
    priceCrystals: 1100,
    rarity: 'common',
    metadata: { avatarId: 16 },
  },
  {
    slug: 'avatar-orgao-exercito',
    name: 'Avatar Exército',
    description: 'Emblema das Forças Armadas terrestres — bravura e tradição.',
    category: 'avatar_orgao',
    priceCrystals: 1500,
    rarity: 'rare',
    // Avatar 26 = Forças Armadas (proxy mais próximo no catálogo).
    metadata: { avatarId: 26 },
  },
  {
    slug: 'avatar-orgao-marinha',
    name: 'Avatar Marinha',
    description: 'Símbolo naval — soberania nos mares brasileiros.',
    category: 'avatar_orgao',
    priceCrystals: 1800,
    rarity: 'rare',
    // Sem avatar específico de Marinha em avatars.ts — fallback Escudo Federal (id 2).
    metadata: { avatarId: 2, kind: 'marinha' },
  },
  {
    slug: 'avatar-orgao-mp',
    name: 'Avatar Ministério Público',
    description: 'Brasão do MP — defensor da sociedade e fiscal da lei.',
    category: 'avatar_orgao',
    priceCrystals: 2500,
    rarity: 'rare',
    metadata: { avatarId: 21 },
  },

  // ── 4 AVATARES VITÓRIA ────────────────────────────────────────────
  {
    slug: 'avatar-vitoria-trofeu',
    name: 'Avatar Troféu',
    description: 'Para quem já saboreou a aprovação — exiba seu troféu.',
    category: 'avatar_vitoria',
    priceCrystals: 1500,
    rarity: 'rare',
    metadata: { kind: 'trofeu' },
  },
  {
    slug: 'avatar-vitoria-coroa',
    name: 'Avatar Coroa',
    description: 'Realeza dos concursos — só os campeões portam a coroa.',
    category: 'avatar_vitoria',
    priceCrystals: 2200,
    rarity: 'rare',
    metadata: { kind: 'coroa' },
  },
  {
    slug: 'avatar-vitoria-medalha-ouro',
    name: 'Avatar Medalha de Ouro',
    description: 'Primeiro lugar no pódio. Brilho de quem chegou no topo.',
    category: 'avatar_vitoria',
    priceCrystals: 3000,
    rarity: 'epic',
    metadata: { kind: 'medalha-ouro' },
  },
  {
    slug: 'avatar-vitoria-louros',
    name: 'Avatar Coroa de Louros',
    description: 'Honra clássica dos vencedores — louros romanos.',
    category: 'avatar_vitoria',
    priceCrystals: 4000,
    rarity: 'epic',
    metadata: { kind: 'louros' },
  },

  // ── 8 BORDAS DE PERFIL ────────────────────────────────────────────
  {
    slug: 'borda-cinza',
    name: 'Borda Cinza',
    description: 'Borda discreta e elegante — começo da jornada.',
    category: 'borda_perfil',
    priceCrystals: 500,
    rarity: 'common',
    metadata: { color: 'gray' },
  },
  {
    slug: 'borda-prata',
    name: 'Borda Prata',
    description: 'Brilho metálico — para quem já está esquentando.',
    category: 'borda_perfil',
    priceCrystals: 500,
    rarity: 'common',
    metadata: { color: 'silver' },
  },
  {
    slug: 'borda-bronze',
    name: 'Borda Bronze',
    description: 'Tom quente de quem já provou seu valor.',
    category: 'borda_perfil',
    priceCrystals: 500,
    rarity: 'common',
    metadata: { color: 'bronze' },
  },
  {
    slug: 'borda-azul',
    name: 'Borda Azul',
    description: 'Azul vibrante — sinal de constância nos estudos.',
    category: 'borda_perfil',
    priceCrystals: 1500,
    rarity: 'rare',
    metadata: { color: 'blue' },
  },
  {
    slug: 'borda-violeta',
    name: 'Borda Violeta',
    description: 'Roxo nobre — distinção entre concurseiros.',
    category: 'borda_perfil',
    priceCrystals: 1500,
    rarity: 'rare',
    metadata: { color: 'violet' },
  },
  {
    slug: 'borda-dourada',
    name: 'Borda Dourada',
    description: 'Ouro puro — para os que estudam todos os dias sem falhar.',
    category: 'borda_perfil',
    priceCrystals: 5000,
    rarity: 'epic',
    metadata: { color: 'gold' },
  },
  {
    slug: 'borda-rubra',
    name: 'Borda Rubra',
    description: 'Vermelho ardente — chama de quem não desiste nunca.',
    category: 'borda_perfil',
    priceCrystals: 5000,
    rarity: 'epic',
    metadata: { color: 'ruby' },
  },
  {
    slug: 'borda-mistica-celestial',
    name: 'Borda Mística Celestial',
    description: 'Borda animada com gradiente celestial — exclusiva dos lendários.',
    category: 'borda_perfil',
    priceCrystals: 15000,
    rarity: 'legendary',
    metadata: {
      animated: true,
      gradient: 'from-amber-300 via-fuchsia-400 to-cyan-300',
    },
  },

  // ── 5 MEDALHAS / MINI-LOGO BADGES ─────────────────────────────────
  {
    slug: 'badge-verificado',
    name: 'Selo Verificado',
    description: 'Tique azul ao lado do seu nome — autenticidade comprovada.',
    category: 'mini_logo_badge',
    priceCrystals: 2000,
    rarity: 'common',
    metadata: { kind: 'verified' },
  },
  {
    slug: 'badge-veterano',
    name: 'Selo Veterano',
    description: 'Para quem está há tempo na luta dos concursos.',
    category: 'mini_logo_badge',
    priceCrystals: 3500,
    rarity: 'rare',
    metadata: { kind: 'veteran' },
  },
  {
    slug: 'badge-top-contribuidor',
    name: 'Selo Top Contribuidor',
    description: 'Reconhecimento da comunidade pelo seu engajamento.',
    category: 'mini_logo_badge',
    priceCrystals: 5000,
    rarity: 'epic',
    metadata: { kind: 'top-contributor' },
  },
  {
    slug: 'badge-beta-tester',
    name: 'Selo Beta Tester',
    description: 'Quem ajudou a moldar a plataforma em sua fase inicial.',
    category: 'mini_logo_badge',
    priceCrystals: 7500,
    rarity: 'epic',
    metadata: { kind: 'beta-tester' },
  },
  {
    slug: 'badge-membro-fundador',
    name: 'Selo Membro Fundador',
    description: 'Honraria máxima — você é parte da história desde o início.',
    category: 'mini_logo_badge',
    priceCrystals: 10000,
    rarity: 'legendary',
    metadata: { kind: 'founder' },
  },

  // ── 3 EXP BUFFS ───────────────────────────────────────────────────
  {
    slug: 'buff-1.5x-24h',
    name: 'Buff EXP 1.5x · 24h',
    description: 'Multiplica seu EXP por 1.5x durante 24 horas.',
    category: 'exp_buff',
    priceCrystals: 1500,
    rarity: 'common',
    metadata: { multiplier: 1.5, durationHours: 24 },
  },
  {
    slug: 'buff-2x-24h',
    name: 'Buff EXP 2x · 24h',
    description: 'Dobra seu EXP por 24 horas — para fins de semana intensos.',
    category: 'exp_buff',
    priceCrystals: 3000,
    rarity: 'rare',
    metadata: { multiplier: 2.0, durationHours: 24 },
  },
  {
    slug: 'buff-2x-7d',
    name: 'Buff EXP 2x · 7 dias',
    description: 'Dobra seu EXP pela semana inteira — máximo aproveitamento.',
    category: 'exp_buff',
    priceCrystals: 8000,
    rarity: 'epic',
    metadata: { multiplier: 2.0, durationHours: 168 },
  },

  // ── 1 TRIAL MÍTICO ────────────────────────────────────────────────
  {
    slug: 'trial-mes-gratis-platinum',
    name: '30 Dias Premium Grátis',
    description: 'Estende sua assinatura premium em 30 dias. Item mítico exclusivo.',
    category: 'plataforma_trial',
    priceCrystals: 40000,
    rarity: 'mythic',
    metadata: { days: 30 },
  },
];
