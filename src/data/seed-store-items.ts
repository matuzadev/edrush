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
    imageUrl: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="45" fill="%23003366"/><circle cx="50" cy="50" r="40" fill="none" stroke="%23FFD700" stroke-width="2"/><path d="M35 45 Q50 35 65 45 Q60 55 50 60 Q40 55 35 45" fill="%23FFD700"/><circle cx="50" cy="50" r="12" fill="%23fff"/><text x="50" y="75" text-anchor="middle" font-size="10" fill="%23FFD700" font-weight="bold">PF</text></svg>',
    metadata: { avatarId: 13 },
  },
  {
    slug: 'avatar-orgao-prf',
    name: 'Avatar PRF',
    description: 'Símbolo da Polícia Rodoviária Federal — vigilância nas estradas.',
    category: 'avatar_orgao',
    priceCrystals: 900,
    rarity: 'common',
    imageUrl: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="45" fill="%23DC143C"/><circle cx="50" cy="50" r="40" fill="none" stroke="%23FFD700" stroke-width="2"/><rect x="35" y="40" width="30" height="20" fill="%23FFD700" rx="3"/><text x="50" y="54" text-anchor="middle" font-size="12" fill="%23DC143C" font-weight="bold">PRF</text><text x="50" y="75" text-anchor="middle" font-size="9" fill="%23FFD700" font-weight="bold">ESTRADAS</text></svg>',
    metadata: { avatarId: 14 },
  },
  {
    slug: 'avatar-orgao-pm',
    name: 'Avatar Polícia Militar',
    description: 'Brasão da PM — disciplina e ordem pública.',
    category: 'avatar_orgao',
    priceCrystals: 1100,
    rarity: 'common',
    imageUrl: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="45" fill="%23000066"/><circle cx="50" cy="50" r="40" fill="none" stroke="%23FF1744" stroke-width="2"/><path d="M35 40 L50 30 L65 40 L60 60 L40 60 Z" fill="%23FF1744"/><text x="50" y="75" text-anchor="middle" font-size="10" fill="%23FF1744" font-weight="bold">PM</text></svg>',
    metadata: { avatarId: 16 },
  },
  {
    slug: 'avatar-orgao-exercito',
    name: 'Avatar Exército',
    description: 'Emblema das Forças Armadas terrestres — bravura e tradição.',
    category: 'avatar_orgao',
    priceCrystals: 1500,
    rarity: 'rare',
    imageUrl: '/Gemini_Generated_Image_sx6am1sx6am1sx6a.svg',
    metadata: { avatarId: 26 },
  },
  {
    slug: 'avatar-orgao-marinha',
    name: 'Avatar Marinha',
    description: 'Símbolo naval — soberania nos mares brasileiros.',
    category: 'avatar_orgao',
    priceCrystals: 1800,
    rarity: 'rare',
    imageUrl: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="45" fill="%23001a4d"/><circle cx="50" cy="50" r="40" fill="none" stroke="%2300BFFF" stroke-width="2"/><path d="M30 50 Q50 35 70 50" fill="none" stroke="%2300BFFF" stroke-width="3"/><path d="M35 55 Q50 45 65 55" fill="none" stroke="%2300BFFF" stroke-width="2"/><path d="M40 60 Q50 55 60 60" fill="none" stroke="%2300BFFF" stroke-width="1.5"/><text x="50" y="75" text-anchor="middle" font-size="10" fill="%2300BFFF" font-weight="bold">MARINHA</text></svg>',
    metadata: { avatarId: 2, kind: 'marinha' },
  },
  {
    slug: 'avatar-orgao-mp',
    name: 'Avatar Ministério Público',
    description: 'Brasão do MP — defensor da sociedade e fiscal da lei.',
    category: 'avatar_orgao',
    priceCrystals: 2500,
    rarity: 'rare',
    imageUrl: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="45" fill="%23663300"/><circle cx="50" cy="50" r="40" fill="none" stroke="%23FFD700" stroke-width="2"/><path d="M45 35 L50 45 L55 35 Z" fill="%23FFD700"/><rect x="40" y="45" width="20" height="15" fill="%23FFD700"/><path d="M40 60 L50 70 L60 60 Z" fill="%23FFD700"/><text x="50" y="80" text-anchor="middle" font-size="9" fill="%23FFD700" font-weight="bold">MP</text></svg>',
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
    imageUrl: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="45" fill="%23FFA500"/><circle cx="50" cy="50" r="40" fill="none" stroke="%23FFD700" stroke-width="2"/><path d="M35 55 L40 40 L50 35 L60 40 L65 55 Z" fill="%23FFD700"/><rect x="45" y="55" width="10" height="15" fill="%23FFD700"/><ellipse cx="50" cy="70" rx="12" ry="4" fill="%23FF8C00"/><text x="50" y="80" text-anchor="middle" font-size="9" fill="%23fff" font-weight="bold">TROFÉU</text></svg>',
    metadata: { kind: 'trofeu' },
  },
  {
    slug: 'avatar-vitoria-coroa',
    name: 'Avatar Coroa',
    description: 'Realeza dos concursos — só os campeões portam a coroa.',
    category: 'avatar_vitoria',
    priceCrystals: 2200,
    rarity: 'rare',
    imageUrl: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="45" fill="%23FF1493"/><circle cx="50" cy="50" r="40" fill="none" stroke="%23FFD700" stroke-width="2"/><path d="M30 60 L35 45 L45 50 L50 40 L55 50 L65 45 L70 60 Z" fill="%23FFD700"/><rect x="30" y="60" width="40" height="8" fill="%23FFD700"/><circle cx="35" cy="48" r="3" fill="%23FF1493"/><circle cx="50" cy="40" r="3" fill="%23FF1493"/><circle cx="65" cy="48" r="3" fill="%23FF1493"/><text x="50" y="80" text-anchor="middle" font-size="9" fill="%23FFD700" font-weight="bold">COROA</text></svg>',
    metadata: { kind: 'coroa' },
  },
  {
    slug: 'avatar-vitoria-medalha-ouro',
    name: 'Avatar Medalha de Ouro',
    description: 'Primeiro lugar no pódio. Brilho de quem chegou no topo.',
    category: 'avatar_vitoria',
    priceCrystals: 3000,
    rarity: 'epic',
    imageUrl: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><radialGradient id="goldGrad"><stop offset="0%" style="stop-color:%23FFFF00;stop-opacity:1"/><stop offset="100%" style="stop-color:%23FFD700;stop-opacity:1"/></radialGradient></defs><circle cx="50" cy="50" r="45" fill="url(%23goldGrad)"/><circle cx="50" cy="50" r="35" fill="none" stroke="%23FF6347" stroke-width="3"/><circle cx="50" cy="50" r="25" fill="%23FFFF00"/><text x="50" y="58" text-anchor="middle" font-size="24" fill="%23FFD700" font-weight="bold">1º</text><line x1="50" y1="10" x2="50" y2="25" stroke="%23FFD700" stroke-width="2"/><text x="50" y="85" text-anchor="middle" font-size="9" fill="%23fff" font-weight="bold">OURO</text></svg>',
    metadata: { kind: 'medalha-ouro' },
  },
  {
    slug: 'avatar-vitoria-louros',
    name: 'Avatar Coroa de Louros',
    description: 'Honra clássica dos vencedores — louros romanos.',
    category: 'avatar_vitoria',
    priceCrystals: 4000,
    rarity: 'epic',
    imageUrl: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="45" fill="%23228B22"/><circle cx="50" cy="50" r="40" fill="none" stroke="%2308860D" stroke-width="2"/><path d="M25 50 Q30 35 40 30 Q50 25 60 30 Q70 35 75 50" fill="none" stroke="%23FFD700" stroke-width="3" stroke-linecap="round"/><path d="M25 50 Q30 65 40 70 Q50 75 60 70 Q70 65 75 50" fill="none" stroke="%23FFD700" stroke-width="3" stroke-linecap="round"/><circle cx="50" cy="50" r="8" fill="%23FFD700"/><text x="50" y="80" text-anchor="middle" font-size="9" fill="%23FFD700" font-weight="bold">LOUROS</text></svg>',
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
    imageUrl: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect x="10" y="10" width="80" height="80" fill="none" stroke="%23A9A9A9" stroke-width="6" rx="5"/></svg>',
    metadata: { color: 'gray' },
  },
  {
    slug: 'borda-prata',
    name: 'Borda Prata',
    description: 'Brilho metálico — para quem já está esquentando.',
    category: 'borda_perfil',
    priceCrystals: 500,
    rarity: 'common',
    imageUrl: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><linearGradient id="silverGrad" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" style="stop-color:%23E8E8E8;stop-opacity:1"/><stop offset="100%" style="stop-color:%23C0C0C0;stop-opacity:1"/></linearGradient></defs><rect x="10" y="10" width="80" height="80" fill="none" stroke="url(%23silverGrad)" stroke-width="6" rx="5"/></svg>',
    metadata: { color: 'silver' },
  },
  {
    slug: 'borda-bronze',
    name: 'Borda Bronze',
    description: 'Tom quente de quem já provou seu valor.',
    category: 'borda_perfil',
    priceCrystals: 500,
    rarity: 'common',
    imageUrl: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><linearGradient id="bronzeGrad" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" style="stop-color:%23CD7F32;stop-opacity:1"/><stop offset="100%" style="stop-color:%238B4513;stop-opacity:1"/></linearGradient></defs><rect x="10" y="10" width="80" height="80" fill="none" stroke="url(%23bronzeGrad)" stroke-width="6" rx="5"/></svg>',
    metadata: { color: 'bronze' },
  },
  {
    slug: 'borda-azul',
    name: 'Borda Azul',
    description: 'Azul vibrante — sinal de constância nos estudos.',
    category: 'borda_perfil',
    priceCrystals: 1500,
    rarity: 'rare',
    imageUrl: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect x="10" y="10" width="80" height="80" fill="none" stroke="%231E90FF" stroke-width="6" rx="5"/><rect x="15" y="15" width="70" height="70" fill="none" stroke="%231E90FF" stroke-width="1" rx="3" opacity="0.5"/></svg>',
    metadata: { color: 'blue' },
  },
  {
    slug: 'borda-violeta',
    name: 'Borda Violeta',
    description: 'Roxo nobre — distinção entre concurseiros.',
    category: 'borda_perfil',
    priceCrystals: 1500,
    rarity: 'rare',
    imageUrl: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect x="10" y="10" width="80" height="80" fill="none" stroke="%238B00FF" stroke-width="6" rx="5"/><rect x="15" y="15" width="70" height="70" fill="none" stroke="%23DDA0DD" stroke-width="1" rx="3" opacity="0.5"/></svg>',
    metadata: { color: 'violet' },
  },
  {
    slug: 'borda-dourada',
    name: 'Borda Dourada',
    description: 'Ouro puro — para os que estudam todos os dias sem falhar.',
    category: 'borda_perfil',
    priceCrystals: 5000,
    rarity: 'epic',
    imageUrl: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><radialGradient id="goldBorder"><stop offset="0%" style="stop-color:%23FFFF00;stop-opacity:1"/><stop offset="100%" style="stop-color:%23FFD700;stop-opacity:1"/></radialGradient></defs><rect x="10" y="10" width="80" height="80" fill="none" stroke="url(%23goldBorder)" stroke-width="8" rx="5"/><rect x="12" y="12" width="76" height="76" fill="none" stroke="%23FFD700" stroke-width="1" rx="4" opacity="0.3"/></svg>',
    metadata: { color: 'gold' },
  },
  {
    slug: 'borda-rubra',
    name: 'Borda Rubra',
    description: 'Vermelho ardente — chama de quem não desiste nunca.',
    category: 'borda_perfil',
    priceCrystals: 5000,
    rarity: 'epic',
    imageUrl: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><radialGradient id="rubyBorder"><stop offset="0%" style="stop-color:%23FF4444;stop-opacity:1"/><stop offset="100%" style="stop-color:%23CC0000;stop-opacity:1"/></radialGradient></defs><rect x="10" y="10" width="80" height="80" fill="none" stroke="url(%23rubyBorder)" stroke-width="8" rx="5"/><rect x="12" y="12" width="76" height="76" fill="none" stroke="%23FF1744" stroke-width="1" rx="4" opacity="0.3"/></svg>',
    metadata: { color: 'ruby' },
  },
  {
    slug: 'borda-mistica-celestial',
    name: 'Borda Mística Celestial',
    description: 'Borda animada com gradiente celestial — exclusiva dos lendários.',
    category: 'borda_perfil',
    priceCrystals: 15000,
    rarity: 'legendary',
    imageUrl: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><linearGradient id="celestial" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" style="stop-color:%23FFBB33;stop-opacity:1"/><stop offset="50%" style="stop-color:%23FF44CC;stop-opacity:1"/><stop offset="100%" style="stop-color:%2300FFFF;stop-opacity:1"/></linearGradient></defs><rect x="10" y="10" width="80" height="80" fill="none" stroke="url(%23celestial)" stroke-width="10" rx="5"/><rect x="10" y="10" width="80" height="80" fill="none" stroke="url(%23celestial)" stroke-width="1" rx="5" opacity="0.4" stroke-dasharray="5,3"/></svg>',
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
    imageUrl: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="45" fill="%231E90FF"/><path d="M30 50 L45 65 L70 35" stroke="white" stroke-width="6" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    metadata: { kind: 'verified' },
  },
  {
    slug: 'badge-veterano',
    name: 'Selo Veterano',
    description: 'Para quem está há tempo na luta dos concursos.',
    category: 'mini_logo_badge',
    priceCrystals: 3500,
    rarity: 'rare',
    imageUrl: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="45" fill="%23228B22"/><path d="M35 55 L45 40 L55 40 L65 55 L55 55 L50 65 L45 55 Z" fill="%23FFD700"/><text x="50" y="75" text-anchor="middle" font-size="11" fill="%23FFD700" font-weight="bold">VET</text></svg>',
    metadata: { kind: 'veteran' },
  },
  {
    slug: 'badge-top-contribuidor',
    name: 'Selo Top Contribuidor',
    description: 'Reconhecimento da comunidade pelo seu engajamento.',
    category: 'mini_logo_badge',
    priceCrystals: 5000,
    rarity: 'epic',
    imageUrl: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="45" fill="%23FF6347"/><path d="M25 50 L35 35 L45 40 L50 25 L55 40 L65 35 L75 50 L70 60 L65 55 L50 70 L35 55 L30 60 Z" fill="%23FFD700"/><text x="50" y="80" text-anchor="middle" font-size="9" fill="%23fff" font-weight="bold">TOP</text></svg>',
    metadata: { kind: 'top-contributor' },
  },
  {
    slug: 'badge-beta-tester',
    name: 'Selo Beta Tester',
    description: 'Quem ajudou a moldar a plataforma em sua fase inicial.',
    category: 'mini_logo_badge',
    priceCrystals: 7500,
    rarity: 'epic',
    imageUrl: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="45" fill="%23663399"/><path d="M40 35 L40 65 L60 50 Z" fill="%23FFD700"/><text x="50" y="80" text-anchor="middle" font-size="10" fill="%23FFD700" font-weight="bold">BETA</text></svg>',
    metadata: { kind: 'beta-tester' },
  },
  {
    slug: 'badge-membro-fundador',
    name: 'Selo Membro Fundador',
    description: 'Honraria máxima — você é parte da história desde o início.',
    category: 'mini_logo_badge',
    priceCrystals: 10000,
    rarity: 'legendary',
    imageUrl: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><radialGradient id="founderGrad"><stop offset="0%" style="stop-color:%23FFFF00;stop-opacity:1"/><stop offset="100%" style="stop-color:%23FFD700;stop-opacity:1"/></radialGradient></defs><circle cx="50" cy="50" r="45" fill="url(%23founderGrad)"/><circle cx="50" cy="50" r="35" fill="%23FF1493"/><path d="M50 30 L58 45 L75 45 L62 56 L70 70 L50 60 L30 70 L38 56 L25 45 L42 45 Z" fill="%23FFD700"/></svg>',
    metadata: { kind: 'founder' },
  },
  {
    slug: 'badge-perito',
    name: 'Selo Perito',
    description: 'Para os mestres da precisão — alta acurácia em alto volume.',
    category: 'mini_logo_badge',
    priceCrystals: 4500,
    rarity: 'epic',
    imageUrl: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="45" fill="%230891b2"/><circle cx="50" cy="50" r="28" fill="none" stroke="%23fde047" stroke-width="3"/><circle cx="50" cy="50" r="14" fill="none" stroke="%23fde047" stroke-width="2"/><circle cx="50" cy="50" r="4" fill="%23fde047"/><path d="M50 18 L50 28 M50 72 L50 82 M18 50 L28 50 M72 50 L82 50" stroke="%23fde047" stroke-width="2"/></svg>',
    metadata: { kind: 'perito' },
  },
  {
    slug: 'badge-maratonista',
    name: 'Selo Maratonista',
    description: 'Quem mantém constância acima de tudo — milhas e milhas estudadas.',
    category: 'mini_logo_badge',
    priceCrystals: 6000,
    rarity: 'epic',
    imageUrl: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="45" fill="%23ea580c"/><path d="M30 60 L42 48 L52 56 L70 38" stroke="%23fef3c7" stroke-width="5" fill="none" stroke-linecap="round" stroke-linejoin="round"/><circle cx="70" cy="38" r="5" fill="%23fde047"/><circle cx="42" cy="48" r="3" fill="%23fef3c7"/><circle cx="52" cy="56" r="3" fill="%23fef3c7"/></svg>',
    metadata: { kind: 'maratonista' },
  },
  {
    slug: 'badge-aprovado',
    name: 'Selo Aprovado',
    description: 'Honraria suprema — concedido a quem foi aprovado em concurso.',
    category: 'mini_logo_badge',
    priceCrystals: 12000,
    rarity: 'legendary',
    imageUrl: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><linearGradient id="aprov" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="%23fde047"/><stop offset="1" stop-color="%23ca8a04"/></linearGradient></defs><circle cx="50" cy="50" r="45" fill="url(%23aprov)"/><path d="M28 52 L44 68 L72 32" stroke="%23052e16" stroke-width="6" fill="none" stroke-linecap="round" stroke-linejoin="round"/><circle cx="50" cy="50" r="45" fill="none" stroke="%23052e16" stroke-width="2" stroke-dasharray="3 4"/></svg>',
    metadata: { kind: 'aprovado' },
  },

  // ── 3 EXP BUFFS ───────────────────────────────────────────────────
  {
    slug: 'buff-1.5x-24h',
    name: 'Buff EXP 1.5x · 24h',
    description: 'Multiplica seu EXP por 1.5x durante 24 horas.',
    category: 'exp_buff',
    priceCrystals: 1500,
    rarity: 'common',
    imageUrl: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="45" fill="%2332CD32"/><circle cx="50" cy="50" r="40" fill="none" stroke="%23FFD700" stroke-width="2"/><path d="M35 60 L50 35 L65 60 Z" fill="%23FFD700"/><text x="50" y="75" text-anchor="middle" font-size="12" fill="%23fff" font-weight="bold">1.5x</text></svg>',
    metadata: { multiplier: 1.5, durationHours: 24 },
  },
  {
    slug: 'buff-2x-24h',
    name: 'Buff EXP 2x · 24h',
    description: 'Dobra seu EXP por 24 horas — para fins de semana intensos.',
    category: 'exp_buff',
    priceCrystals: 3000,
    rarity: 'rare',
    imageUrl: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="45" fill="%231E90FF"/><circle cx="50" cy="50" r="40" fill="none" stroke="%23FFD700" stroke-width="2"/><path d="M30 60 L50 30 L70 60 Z" fill="%23FFD700"/><path d="M30 70 L50 40 L70 70 Z" fill="%23FFD700" opacity="0.7"/><text x="50" y="85" text-anchor="middle" font-size="12" fill="%23fff" font-weight="bold">2x</text></svg>',
    metadata: { multiplier: 2.0, durationHours: 24 },
  },
  {
    slug: 'buff-2x-7d',
    name: 'Buff EXP 2x · 7 dias',
    description: 'Dobra seu EXP pela semana inteira — máximo aproveitamento.',
    category: 'exp_buff',
    priceCrystals: 8000,
    rarity: 'epic',
    imageUrl: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><radialGradient id="buffGrad"><stop offset="0%" style="stop-color:%23FF6347;stop-opacity:1"/><stop offset="100%" style="stop-color:%23DC143C;stop-opacity:1"/></radialGradient></defs><circle cx="50" cy="50" r="45" fill="url(%23buffGrad)"/><circle cx="50" cy="50" r="40" fill="none" stroke="%23FFD700" stroke-width="2"/><path d="M25 65 L50 25 L75 65 Z" fill="%23FFD700"/><path d="M20 75 L50 35 L80 75 Z" fill="%23FFD700" opacity="0.6"/><text x="50" y="90" text-anchor="middle" font-size="11" fill="%23fff" font-weight="bold">2x 7d</text></svg>',
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
    imageUrl: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><linearGradient id="mythicGrad" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" style="stop-color:%23FF00FF;stop-opacity:1"/><stop offset="50%" style="stop-color:%2300FFFF;stop-opacity:1"/><stop offset="100%" style="stop-color:%23FFD700;stop-opacity:1"/></linearGradient></defs><circle cx="50" cy="50" r="45" fill="url(%23mythicGrad)"/><path d="M50 20 L60 40 L82 40 L65 55 L75 75 L50 60 L25 75 L35 55 L18 40 L40 40 Z" fill="white" stroke="%23FFD700" stroke-width="1"/><text x="50" y="85" text-anchor="middle" font-size="10" fill="white" font-weight="bold">30 DIAS</text></svg>',
    metadata: { days: 30 },
  },
];
