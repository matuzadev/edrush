// Catálogo de concursos públicos suportados pelo Foco Federal.
// Estrutura escalável — basta adicionar novas entradas aqui e tudo na UI atualiza.

export interface ConcursoDef {
  slug: string;            // identificador único (usado em users.selected_concurso_slug)
  nome: string;            // nome curto pra UI ("Perito Criminal Federal")
  nomeCompleto: string;    // nome formal completo
  area: string;            // especialidade ("Informática", "Engenharia", etc.)
  organizador: string;     // banca/órgão organizador
  orgao: string;           // órgão público destino ("Polícia Federal", "TRF", etc.)
  // Visual
  cor: string;             // accent color hex
  corAccent: string;       // cor secundária / gradient end
  iconoColor: string;      // cor do ícone se for SVG monocromático
  // SVG inline do brasão/distintivo (estilo silhueta, sem cópia de logos oficiais)
  svg: string;
  // Tagline curta exibida no perfil
  tagline: string;
}

// SVGs simples e únicos por concurso. Estilo silhueta/monograma, viewBox 0 0 64 64.

const SVG_PERITO_PF = `
<svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
  <!-- Escudo arredondado -->
  <path d="M32 4 L54 12 L54 32 Q54 50 32 60 Q10 50 10 32 L10 12 Z"
        fill="#0f172a" stroke="#fbbf24" stroke-width="1.5"/>
  <!-- Faixa horizontal -->
  <rect x="10" y="22" width="44" height="6" fill="#fbbf24" opacity="0.15"/>
  <!-- Texto PF -->
  <text x="32" y="29" text-anchor="middle" font-weight="900" font-size="11"
        font-family="Arial, sans-serif" fill="#fbbf24">PF</text>
  <!-- Lupa (perícia) -->
  <circle cx="24" cy="42" r="5" stroke="#67e8f9" stroke-width="1.6" fill="none"/>
  <line x1="28" y1="46" x2="33" y2="51" stroke="#67e8f9" stroke-width="1.8" stroke-linecap="round"/>
  <!-- Estrela superior -->
  <path d="M32 9 L33.5 12 L37 12.3 L34.3 14.6 L35.2 18 L32 16.2 L28.8 18 L29.7 14.6 L27 12.3 L30.5 12 Z"
        fill="#fbbf24"/>
</svg>
`.trim();

export const CONCURSOS: ConcursoDef[] = [
  {
    slug: 'perito-criminal-federal-informatica',
    nome: 'Perito Criminal Federal',
    nomeCompleto: 'Perito Criminal Federal — Polícia Federal',
    area: 'Informática',
    organizador: 'CESPE/CEBRASPE',
    orgao: 'Polícia Federal',
    cor: '#fbbf24',
    corAccent: '#f59e0b',
    iconoColor: '#fbbf24',
    svg: SVG_PERITO_PF,
    tagline: 'Forense computacional na Polícia Federal',
  },

  // Para adicionar novos concursos, basta replicar o objeto acima:
  // {
  //   slug: 'agente-prf',
  //   nome: 'Agente PRF',
  //   nomeCompleto: 'Policial Rodoviário Federal',
  //   area: 'Geral',
  //   organizador: 'CESPE',
  //   orgao: 'Polícia Rodoviária Federal',
  //   cor: '#10b981',
  //   corAccent: '#059669',
  //   iconoColor: '#10b981',
  //   svg: SVG_PRF,
  //   tagline: 'Patrulhamento das rodovias federais',
  // },
];

export const CONCURSO_BY_SLUG: Record<string, ConcursoDef> = Object.fromEntries(
  CONCURSOS.map(c => [c.slug, c])
);

export function getConcurso(slug: string | null | undefined): ConcursoDef | null {
  if (!slug) return null;
  return CONCURSO_BY_SLUG[slug] ?? null;
}
