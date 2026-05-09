// Catálogo de concursos públicos suportados pelo Foco Federal.
// Estrutura escalável — basta adicionar novas entradas aqui e tudo na UI atualiza.

export interface ConcursoDef {
  slug: string;            // identificador único principal
  aliases?: string[];      // outros slugs aceitos (compat. com concursos cadastrados via slugify)
  nome: string;
  nomeCompleto: string;
  area: string;
  organizador: string;
  orgao: string;
  cor: string;
  corAccent: string;
  iconoColor: string;
  svg: string;
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

const SVG_ESFCEX = `
<svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
  <!-- Escudo do Exército (verde-oliva) -->
  <path d="M32 4 L54 12 L54 32 Q54 50 32 60 Q10 50 10 32 L10 12 Z"
        fill="#0f172a" stroke="#4d7c0f" stroke-width="1.5"/>
  <!-- Faixa diagonal verde-oliva -->
  <path d="M10 22 L54 22 L54 28 L10 28 Z" fill="#65a30d" opacity="0.18"/>
  <!-- Espadas cruzadas (símbolo militar) -->
  <line x1="20" y1="14" x2="44" y2="38" stroke="#a3e635" stroke-width="1.6" stroke-linecap="round"/>
  <line x1="44" y1="14" x2="20" y2="38" stroke="#a3e635" stroke-width="1.6" stroke-linecap="round"/>
  <circle cx="32" cy="26" r="2.2" fill="#a3e635"/>
  <!-- Texto EB (Exército Brasileiro) -->
  <text x="32" y="50" text-anchor="middle" font-weight="900" font-size="9"
        font-family="Arial, sans-serif" fill="#a3e635" letter-spacing="1">ESFCEX</text>
  <!-- Estrela superior (5 pontas, símbolo de oficial) -->
  <path d="M32 7 L33.2 10 L36.4 10.2 L33.9 12.3 L34.7 15.4 L32 13.7 L29.3 15.4 L30.1 12.3 L27.6 10.2 L30.8 10 Z"
        fill="#facc15"/>
</svg>
`.trim();

export const CONCURSOS: ConcursoDef[] = [
  {
    slug: 'perito-criminal-federal-informatica',
    // Aceita também o slug gerado pelo onboarding atual (slugify do titulo do concurso no DB).
    // Adicione mais aliases conforme novos titulos forem cadastrados.
    aliases: [
      'concurso-simulado-perito-federal',
      'perito-federal',
      'perito-criminal-federal',
      'pcf-informatica',
    ],
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

  {
    slug: 'esfcex-oficial-quadro-complementar-informatica',
    aliases: [
      'esfcex',
      'esfcex-informatica',
      'esfcex-oficial-informatica',
      'esfcex-quadro-complementar-informatica',
      'exercito-esfcex-informatica',
      'concurso-esfcex-2026',
    ],
    nome: 'EsFCEx — Informática',
    nomeCompleto: 'EsFCEx — Oficial do Quadro Complementar (Informática) — Exército Brasileiro',
    area: 'Informática',
    organizador: 'EsFCEx (Escola de Saúde e Formação Complementar do Exército)',
    orgao: 'Exército Brasileiro',
    cor: '#65a30d',
    corAccent: '#4d7c0f',
    iconoColor: '#a3e635',
    svg: SVG_ESFCEX,
    tagline: 'Oficial do Exército na área de Tecnologia da Informação',
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

// Indexa por slug principal E por todos os aliases.
export const CONCURSO_BY_SLUG: Record<string, ConcursoDef> = (() => {
  const map: Record<string, ConcursoDef> = {};
  for (const c of CONCURSOS) {
    map[c.slug] = c;
    for (const alias of c.aliases ?? []) {
      map[alias] = c;
    }
  }
  return map;
})();

export function getConcurso(slug: string | null | undefined): ConcursoDef | null {
  if (!slug) return null;
  return CONCURSO_BY_SLUG[slug] ?? null;
}
