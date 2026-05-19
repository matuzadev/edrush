export type AvatarCategory = 'character' | 'orgao';

export interface AvatarDef {
  id: number;
  category: AvatarCategory;
  name: string;
  tagline: string;
  svg: string;
  // opcional: URL pública (ex: '/avatars/xxx.png' ou '/imagens/xxx.png') — será usada pelo componente Avatar quando disponível
  imageUrl?: string;
  colors: { primary: string; accent: string };
}

export const AVATARS: AvatarDef[] = [
  // ── PERSONAGENS FOCO (IDs 1–12) ──────────────────────────────────────────

  {
    id: 1,
    category: 'character',
    name: 'Mira do Foco',
    tagline: 'Mantenha o alvo na sua aprovação',
    colors: { primary: '#10b981', accent: '#34d399' },
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" fill="none">
  <circle cx="32" cy="32" r="30" fill="#052e16" stroke="#10b981" stroke-width="1.5"/>
  <circle cx="32" cy="32" r="22" stroke="#10b981" stroke-width="1.2" stroke-dasharray="4 2"/>
  <circle cx="32" cy="32" r="14" stroke="#34d399" stroke-width="1.5"/>
  <circle cx="32" cy="32" r="6" fill="#10b981"/>
  <line x1="32" y1="4" x2="32" y2="18" stroke="#10b981" stroke-width="2" stroke-linecap="round"/>
  <line x1="32" y1="46" x2="32" y2="60" stroke="#10b981" stroke-width="2" stroke-linecap="round"/>
  <line x1="4" y1="32" x2="18" y2="32" stroke="#10b981" stroke-width="2" stroke-linecap="round"/>
  <line x1="46" y1="32" x2="60" y2="32" stroke="#10b981" stroke-width="2" stroke-linecap="round"/>
  <polygon points="32,26 34,30 32,28 30,30" fill="#ffffff"/>
</svg>`,
  },

  {
    id: 2,
    category: 'character',
    name: 'Escudo Federal',
    tagline: 'Proteja seu futuro, conquiste seu cargo',
    colors: { primary: '#3b82f6', accent: '#60a5fa' },
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" fill="none">
  <circle cx="32" cy="32" r="30" fill="#0c1a3a" stroke="#3b82f6" stroke-width="1.5"/>
  <path d="M32 10 L50 18 L50 34 C50 44 32 54 32 54 C32 54 14 44 14 34 L14 18 Z" fill="#1e3a8a" stroke="#3b82f6" stroke-width="1.5" stroke-linejoin="round"/>
  <text x="32" y="36" text-anchor="middle" font-family="Arial,sans-serif" font-weight="bold" font-size="13" fill="#60a5fa">F</text>
  <polygon points="32,17 33.5,21 37.5,21 34.3,23.5 35.5,27.5 32,25 28.5,27.5 29.7,23.5 26.5,21 30.5,21" fill="#fbbf24"/>
</svg>`,
  },

  {
    id: 3,
    category: 'character',
    name: 'Balança da Justiça',
    tagline: 'Equilíbrio entre estudo e aprovação',
    colors: { primary: '#f59e0b', accent: '#fcd34d' },
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" fill="none">
  <circle cx="32" cy="32" r="30" fill="#1c1008" stroke="#f59e0b" stroke-width="1.5"/>
  <line x1="32" y1="14" x2="32" y2="50" stroke="#f59e0b" stroke-width="2" stroke-linecap="round"/>
  <line x1="20" y1="25" x2="44" y2="25" stroke="#fcd34d" stroke-width="1.5" stroke-linecap="round"/>
  <line x1="20" y1="25" x2="16" y2="33" stroke="#f59e0b" stroke-width="1.2"/>
  <line x1="44" y1="25" x2="48" y2="33" stroke="#f59e0b" stroke-width="1.2"/>
  <path d="M12 33 Q16 30 20 33 Q24 36 12 36 Z" fill="#f59e0b" opacity="0.7"/>
  <path d="M44 33 Q48 30 52 33 Q48 38 44 33 Z" fill="#f59e0b" opacity="0.7"/>
  <rect x="28" y="48" width="8" height="3" rx="1" fill="#f59e0b"/>
  <line x1="32" y1="12" x2="32" y2="16" stroke="#fcd34d" stroke-width="2.5" stroke-linecap="round"/>
</svg>`,
  },

  {
    id: 4,
    category: 'character',
    name: 'Concurseiro',
    tagline: 'Livros e lupa: a arma do aprovado',
    colors: { primary: '#8b5cf6', accent: '#a78bfa' },
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" fill="none">
  <circle cx="32" cy="32" r="30" fill="#1e0938" stroke="#8b5cf6" stroke-width="1.5"/>
  <rect x="14" y="36" width="26" height="14" rx="2" fill="#4c1d95" stroke="#8b5cf6" stroke-width="1"/>
  <rect x="16" y="32" width="22" height="12" rx="2" fill="#5b21b6" stroke="#7c3aed" stroke-width="1"/>
  <rect x="18" y="28" width="18" height="10" rx="2" fill="#6d28d9" stroke="#8b5cf6" stroke-width="1"/>
  <circle cx="42" cy="24" r="7" stroke="#a78bfa" stroke-width="2" fill="none"/>
  <line x1="47" y1="29" x2="52" y2="34" stroke="#a78bfa" stroke-width="2.5" stroke-linecap="round"/>
  <line x1="21" y1="32" x2="33" y2="32" stroke="#a78bfa" stroke-width="1" opacity="0.5"/>
  <line x1="21" y1="36" x2="33" y2="36" stroke="#a78bfa" stroke-width="1" opacity="0.5"/>
</svg>`,
  },

  {
    id: 5,
    category: 'character',
    name: 'Quepe de Autoridade',
    tagline: 'Disciplina militar, mente de aprovado',
    colors: { primary: '#1d4ed8', accent: '#60a5fa' },
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" fill="none">
  <circle cx="32" cy="32" r="30" fill="#0a1628" stroke="#1d4ed8" stroke-width="1.5"/>
  <ellipse cx="32" cy="38" rx="18" ry="5" fill="#1e3a8a"/>
  <path d="M14 36 Q32 20 50 36" fill="#1d4ed8" stroke="#3b82f6" stroke-width="1"/>
  <path d="M16 36 Q32 22 48 36 L14 36 Z" fill="#1e40af"/>
  <rect x="28" y="24" width="8" height="3" rx="1" fill="#fbbf24"/>
  <polygon points="32,20 33,23 36,23 33.5,25 34.5,28 32,26.5 29.5,28 30.5,25 28,23 31,23" fill="#fbbf24"/>
  <line x1="14" y1="38" x2="50" y2="38" stroke="#60a5fa" stroke-width="1.5"/>
</svg>`,
  },

  {
    id: 6,
    category: 'character',
    name: 'Servidor Dedicado',
    tagline: 'Crachá de quem chegou lá',
    imageUrl: '/imagens/servidor_dedicado.png', // usando PNG local existente em public/imagens
    colors: { primary: '#06b6d4', accent: '#67e8f9' },
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" fill="none">
  <circle cx="32" cy="32" r="30" fill="#031a20" stroke="#06b6d4" stroke-width="1.5"/>
  <rect x="22" y="22" width="20" height="26" rx="3" fill="#0e7490" stroke="#06b6d4" stroke-width="1.5"/>
  <rect x="26" y="19" width="12" height="5" rx="2" fill="#164e63" stroke="#06b6d4" stroke-width="1"/>
  <path d="M26 19 Q32 17 38 19" stroke="#06b6d4" stroke-width="1.5" fill="none"/>
  <circle cx="32" cy="32" r="4" fill="#0284c7" stroke="#67e8f9" stroke-width="1"/>
  <text x="32" y="35" text-anchor="middle" font-family="Arial,sans-serif" font-weight="bold" font-size="5" fill="#ffffff">ID</text>
  <line x1="25" y1="40" x2="39" y2="40" stroke="#67e8f9" stroke-width="1" opacity="0.6"/>
  <line x1="27" y1="43" x2="37" y2="43" stroke="#67e8f9" stroke-width="1" opacity="0.4"/>
</svg>`,
  },

  {
    id: 7,
    category: 'character',
    name: 'Águia Federal',
    tagline: 'Voe alto, chegue primeiro',
    // usando PNG local existente em public/imagens
    imageUrl: '/imagens/foto_de_perfil_KIRVANO.png',
    colors: { primary: '#4c00c7ff', accent: '#fca5a5' },
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" fill="none">
  <circle cx="32" cy="32" r="30" fill="#200808" stroke="#3000b6ff" stroke-width="1.5"/>
  <path d="M32 14 C28 18 14 22 10 28 L22 26 L18 32 L28 30 L26 36 L32 34 L38 36 L36 30 L46 32 L42 26 L54 28 C50 22 36 18 32 14Z" fill="#991b1b" stroke="#dc2626" stroke-width="1.2"/>
  <circle cx="32" cy="25" r="3" fill="#fca5a5"/>
  <path d="M31 24 L29 26 L32 25 L35 26 L33 24Z" fill="#fbbf24"/>
  <line x1="26" y1="36" x2="24" y2="44" stroke="#070ae079" stroke-width="1.5" stroke-linecap="round"/>
  <line x1="38" y1="36" x2="40" y2="44" stroke="#dc2626" stroke-width="1.5" stroke-linecap="round"/>
  <line x1="22" y1="44" x2="26" y2="44" stroke="#fca5a5" stroke-width="1.5" stroke-linecap="round"/>
  <line x1="38" y1="44" x2="42" y2="44" stroke="#fca5a5" stroke-width="1.5" stroke-linecap="round"/>
</svg>`,
  },

  {
    id: 8,
    category: 'character',
    name: 'Auditor Perito',
    tagline: 'Lupa sobre cada detalhe da prova',
    colors: { primary: '#d97706', accent: '#fbbf24' },
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" fill="none">
  <circle cx="32" cy="32" r="30" fill="#1c1008" stroke="#d97706" stroke-width="1.5"/>
  <rect x="16" y="20" width="22" height="28" rx="2" fill="#1c1917" stroke="#78350f" stroke-width="1.2"/>
  <line x1="20" y1="26" x2="34" y2="26" stroke="#d97706" stroke-width="1" opacity="0.7"/>
  <line x1="20" y1="30" x2="34" y2="30" stroke="#d97706" stroke-width="1" opacity="0.7"/>
  <line x1="20" y1="34" x2="30" y2="34" stroke="#d97706" stroke-width="1" opacity="0.5"/>
  <circle cx="41" cy="27" r="9" stroke="#fbbf24" stroke-width="2" fill="none"/>
  <circle cx="41" cy="27" r="5" fill="#92400e" opacity="0.6"/>
  <line x1="48" y1="34" x2="54" y2="40" stroke="#fbbf24" stroke-width="3" stroke-linecap="round"/>
</svg>`,
  },

  {
    id: 9,
    category: 'character',
    name: 'Fiscal de Estrada',
    tagline: 'Controlando cada etapa da jornada',
    colors: { primary: '#16a34a', accent: '#4ade80' },
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" fill="none">
  <circle cx="32" cy="32" r="30" fill="#052e16" stroke="#16a34a" stroke-width="1.5"/>
  <rect x="24" y="12" width="16" height="28" rx="2" fill="#1f2937" stroke="#374151" stroke-width="1"/>
  <rect x="26" y="14" width="12" height="7" rx="1" fill="#ef4444" opacity="0.9"/>
  <rect x="26" y="23" width="12" height="7" rx="1" fill="#fbbf24" opacity="0.9"/>
  <rect x="26" y="32" width="12" height="7" rx="1" fill="#4ade80" opacity="0.9"/>
  <rect x="16" y="42" width="32" height="4" rx="1" fill="#374151"/>
  <rect x="20" y="44" width="4" height="2" rx="0.5" fill="#fbbf24"/>
  <rect x="30" y="44" width="4" height="2" rx="0.5" fill="#fbbf24"/>
  <rect x="40" y="44" width="4" height="2" rx="0.5" fill="#fbbf24"/>
</svg>`,
  },

  {
    id: 10,
    category: 'character',
    name: 'Bússola do Estudante',
    tagline: 'Sempre orientado rumo à aprovação',
    colors: { primary: '#0891b2', accent: '#22d3ee' },
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" fill="none">
  <circle cx="32" cy="32" r="30" fill="#031a20" stroke="#0891b2" stroke-width="1.5"/>
  <circle cx="32" cy="32" r="20" stroke="#0e7490" stroke-width="1.5" fill="none"/>
  <circle cx="32" cy="32" r="18" stroke="#06b6d4" stroke-width="0.8" stroke-dasharray="3 3" fill="none"/>
  <text x="32" y="17" text-anchor="middle" font-family="Arial,sans-serif" font-weight="bold" font-size="8" fill="#22d3ee">N</text>
  <text x="32" y="52" text-anchor="middle" font-family="Arial,sans-serif" font-weight="bold" font-size="8" fill="#94a3b8">S</text>
  <text x="16" y="35" text-anchor="middle" font-family="Arial,sans-serif" font-weight="bold" font-size="8" fill="#94a3b8">O</text>
  <text x="48" y="35" text-anchor="middle" font-family="Arial,sans-serif" font-weight="bold" font-size="8" fill="#94a3b8">L</text>
  <polygon points="32,20 34,32 32,30 30,32" fill="#ef4444"/>
  <polygon points="32,44 34,32 32,34 30,32" fill="#94a3b8"/>
  <circle cx="32" cy="32" r="2.5" fill="#22d3ee"/>
</svg>`,
  },

  {
    id: 11,
    category: 'character',
    name: 'Cronômetro Foco',
    tagline: 'Cada minuto conta na sua aprovação',
    colors: { primary: '#7c3aed', accent: '#c084fc' },
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" fill="none">
  <circle cx="32" cy="32" r="30" fill="#1e0938" stroke="#7c3aed" stroke-width="1.5"/>
  <circle cx="32" cy="34" r="18" fill="#2e1065" stroke="#7c3aed" stroke-width="1.5"/>
  <rect x="29" y="12" width="6" height="4" rx="1" fill="#7c3aed"/>
  <line x1="32" y1="16" x2="32" y2="34" stroke="#c084fc" stroke-width="2" stroke-linecap="round"/>
  <line x1="32" y1="34" x2="42" y2="28" stroke="#fbbf24" stroke-width="1.5" stroke-linecap="round"/>
  <circle cx="32" cy="34" r="2.5" fill="#c084fc"/>
  <line x1="32" y1="18" x2="32" y2="22" stroke="#7c3aed" stroke-width="1.5"/>
  <line x1="32" y1="46" x2="32" y2="50" stroke="#7c3aed" stroke-width="1.5"/>
  <line x1="18" y1="34" x2="22" y2="34" stroke="#7c3aed" stroke-width="1.5"/>
  <line x1="42" y1="34" x2="46" y2="34" stroke="#7c3aed" stroke-width="1.5"/>
</svg>`,
  },

  {
    id: 12,
    category: 'character',
    name: 'Gabarito Oficial',
    tagline: 'Caneta em riste, gabarito na mão',
    colors: { primary: '#0f766e', accent: '#2dd4bf' },
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" fill="none">
  <circle cx="32" cy="32" r="30" fill="#032825" stroke="#0f766e" stroke-width="1.5"/>
  <rect x="14" y="16" width="28" height="36" rx="2" fill="#0c2420" stroke="#0f766e" stroke-width="1.2"/>
  <rect x="18" y="20" width="20" height="3" rx="1" fill="#0f766e" opacity="0.8"/>
  <circle cx="21" cy="28" r="1.5" fill="#2dd4bf"/>
  <circle cx="21" cy="33" r="1.5" fill="#2dd4bf"/>
  <circle cx="21" cy="38" r="1.5" fill="#2dd4bf"/>
  <circle cx="21" cy="43" r="1.5" fill="#475569"/>
  <rect x="25" y="26.5" width="12" height="3" rx="1" fill="#134e4a" stroke="#0f766e" stroke-width="0.5"/>
  <rect x="25" y="31.5" width="12" height="3" rx="1" fill="#134e4a" stroke="#0f766e" stroke-width="0.5"/>
  <rect x="25" y="36.5" width="12" height="3" rx="1" fill="#134e4a" stroke="#0f766e" stroke-width="0.5"/>
  <rect x="25" y="41.5" width="12" height="3" rx="1" fill="#134e4a" stroke="#0f766e" stroke-width="0.5"/>
  <rect x="28" y="26.5" width="4" height="3" rx="0.5" fill="#2dd4bf"/>
  <rect x="31" y="31.5" width="4" height="3" rx="0.5" fill="#2dd4bf"/>
  <rect x="28" y="36.5" width="4" height="3" rx="0.5" fill="#2dd4bf"/>
  <path d="M44 14 L52 22 L36 42 L28 44 L30 36 Z" fill="#1c1917" stroke="#fbbf24" stroke-width="1"/>
  <line x1="44" y1="14" x2="52" y2="22" stroke="#fcd34d" stroke-width="1.5"/>
</svg>`,
  },

  // ── LOGOS DE ÓRGÃOS BRASILEIROS (IDs 13–26) ──────────────────────────────

  {
    id: 13,
    category: 'orgao',
    name: 'Polícia Federal',
    tagline: 'PF — Guardião das fronteiras do Brasil',
    colors: { primary: '#1e40af', accent: '#fbbf24' },
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" fill="none">
  <circle cx="32" cy="32" r="30" fill="#0a1628" stroke="#1e40af" stroke-width="1.5"/>
  <circle cx="32" cy="32" r="22" fill="#1e3a8a" stroke="#3b82f6" stroke-width="1.5"/>
  <circle cx="32" cy="32" r="18" fill="#1e3a8a" stroke="#fbbf24" stroke-width="1"/>
  <polygon points="32,14 33.8,19.5 39.5,19.5 34.9,22.9 36.7,28.4 32,25 27.3,28.4 29.1,22.9 24.5,19.5 30.2,19.5" fill="#fbbf24"/>
  <text x="32" y="42" text-anchor="middle" font-family="Arial,sans-serif" font-weight="bold" font-size="10" fill="#ffffff">PF</text>
</svg>`,
  },

  {
    id: 14,
    category: 'orgao',
    name: 'PRF',
    tagline: 'Polícia Rodoviária Federal — Rodovias seguras',
    colors: { primary: '#166534', accent: '#4ade80' },
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" fill="none">
  <circle cx="32" cy="32" r="30" fill="#052e16" stroke="#166534" stroke-width="1.5"/>
  <path d="M32 8 L52 20 L52 44 L32 56 L12 44 L12 20 Z" fill="#14532d" stroke="#16a34a" stroke-width="1.5"/>
  <line x1="12" y1="30" x2="52" y2="30" stroke="#4ade80" stroke-width="2"/>
  <line x1="12" y1="34" x2="52" y2="34" stroke="#fbbf24" stroke-width="1.5"/>
  <text x="32" y="28" text-anchor="middle" font-family="Arial,sans-serif" font-weight="bold" font-size="9" fill="#ffffff">PRF</text>
  <text x="32" y="48" text-anchor="middle" font-family="Arial,sans-serif" font-size="5" fill="#4ade80">FEDERAL</text>
</svg>`,
  },

  {
    id: 15,
    category: 'orgao',
    name: 'Polícia Civil',
    tagline: 'PC — Investigação e justiça estadual',
    colors: { primary: '#1e3a8a', accent: '#93c5fd' },
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" fill="none">
  <circle cx="32" cy="32" r="30" fill="#0a1628" stroke="#1e3a8a" stroke-width="1.5"/>
  <path d="M32 10 L50 18 L50 36 C50 46 32 54 32 54 C32 54 14 46 14 36 L14 18 Z" fill="#1e3a8a" stroke="#3b82f6" stroke-width="1.5"/>
  <text x="32" y="36" text-anchor="middle" font-family="Arial,sans-serif" font-weight="bold" font-size="14" fill="#93c5fd">PC</text>
  <line x1="20" y1="40" x2="44" y2="40" stroke="#60a5fa" stroke-width="1" opacity="0.5"/>
</svg>`,
  },

  {
    id: 16,
    category: 'orgao',
    name: 'Polícia Militar',
    tagline: 'PM — Ordem e segurança pública',
    colors: { primary: '#365314', accent: '#86efac' },
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" fill="none">
  <circle cx="32" cy="32" r="30" fill="#0f1f05" stroke="#365314" stroke-width="1.5"/>
  <path d="M32 10 L50 18 L50 36 C50 46 32 54 32 54 C32 54 14 46 14 36 L14 18 Z" fill="#1a2e05" stroke="#4d7c0f" stroke-width="1.5"/>
  <line x1="28" y1="22" x2="36" y2="42" stroke="#86efac" stroke-width="2" stroke-linecap="round"/>
  <line x1="36" y1="22" x2="28" y2="42" stroke="#86efac" stroke-width="2" stroke-linecap="round"/>
  <text x="32" y="52" text-anchor="middle" font-family="Arial,sans-serif" font-weight="bold" font-size="7" fill="#86efac">PM</text>
</svg>`,
  },

  {
    id: 17,
    category: 'orgao',
    name: 'INSS',
    tagline: 'Previdência Social — Segurança para todos',
    colors: { primary: '#0284c7', accent: '#7dd3fc' },
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" fill="none">
  <circle cx="32" cy="32" r="30" fill="#0c1a28" stroke="#0284c7" stroke-width="1.5"/>
  <path d="M32 10 L50 18 L50 36 C50 46 32 54 32 54 C32 54 14 46 14 36 L14 18 Z" fill="#0c4a6e" stroke="#0284c7" stroke-width="1.5"/>
  <text x="32" y="37" text-anchor="middle" font-family="Arial,sans-serif" font-weight="bold" font-size="10" fill="#7dd3fc">INSS</text>
</svg>`,
  },

  {
    id: 18,
    category: 'orgao',
    name: 'Receita Federal',
    tagline: 'RF — Arrecadação e fiscalização tributária',
    colors: { primary: '#92400e', accent: '#fcd34d' },
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" fill="none">
  <circle cx="32" cy="32" r="30" fill="#1c0f00" stroke="#92400e" stroke-width="1.5"/>
  <path d="M32 10 L50 18 L50 36 C50 46 32 54 32 54 C32 54 14 46 14 36 L14 18 Z" fill="#451a03" stroke="#b45309" stroke-width="1.5"/>
  <text x="32" y="30" text-anchor="middle" font-family="Arial,sans-serif" font-weight="bold" font-size="13" fill="#fcd34d">RF</text>
  <line x1="22" y1="34" x2="42" y2="34" stroke="#fbbf24" stroke-width="1.5"/>
  <circle cx="27" cy="40" r="3.5" stroke="#fcd34d" stroke-width="1.5" fill="none"/>
  <line x1="27" y1="40" x2="37" y2="40" stroke="#fcd34d" stroke-width="1.5"/>
  <line x1="37" y1="37" x2="37" y2="43" stroke="#fcd34d" stroke-width="1.5"/>
</svg>`,
  },

  {
    id: 19,
    category: 'orgao',
    name: 'Tribunal Federal',
    tagline: 'TRF — Justiça Federal em segundo grau',
    colors: { primary: '#4a1942', accent: '#e879f9' },
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" fill="none">
  <circle cx="32" cy="32" r="30" fill="#1a0a1a" stroke="#4a1942" stroke-width="1.5"/>
  <rect x="28" y="12" width="8" height="24" rx="1" fill="#701a75" stroke="#c026d3" stroke-width="1"/>
  <ellipse cx="32" cy="12" rx="6" ry="3" fill="#6b21a8" stroke="#c026d3" stroke-width="1"/>
  <line x1="24" y1="36" x2="20" y2="36" stroke="#e879f9" stroke-width="2" stroke-linecap="round"/>
  <line x1="40" y1="36" x2="44" y2="36" stroke="#e879f9" stroke-width="2" stroke-linecap="round"/>
  <line x1="16" y1="36" x2="48" y2="36" stroke="#9333ea" stroke-width="1.5"/>
  <text x="32" y="50" text-anchor="middle" font-family="Arial,sans-serif" font-weight="bold" font-size="9" fill="#e879f9">TRF</text>
</svg>`,
  },

  {
    id: 20,
    category: 'orgao',
    name: 'STF',
    tagline: 'Supremo Tribunal Federal — Guardião da Constituição',
    colors: { primary: '#1e3a8a', accent: '#fbbf24' },
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" fill="none">
  <circle cx="32" cy="32" r="30" fill="#0a1628" stroke="#1e3a8a" stroke-width="1.5"/>
  <line x1="14" y1="46" x2="50" y2="46" stroke="#1e40af" stroke-width="2"/>
  <rect x="16" y="36" width="4" height="10" fill="#1d4ed8"/>
  <rect x="22" y="32" width="4" height="14" fill="#1d4ed8"/>
  <rect x="28" y="28" width="8" height="18" fill="#1e40af" stroke="#3b82f6" stroke-width="0.5"/>
  <rect x="38" y="32" width="4" height="14" fill="#1d4ed8"/>
  <rect x="44" y="36" width="4" height="10" fill="#1d4ed8"/>
  <line x1="22" y1="28" x2="42" y2="28" stroke="#fbbf24" stroke-width="1.5"/>
  <text x="32" y="24" text-anchor="middle" font-family="Arial,sans-serif" font-weight="bold" font-size="8" fill="#fbbf24">STF</text>
</svg>`,
  },

  {
    id: 21,
    category: 'orgao',
    name: 'Ministério Público',
    tagline: 'MP — Defensor da sociedade e da lei',
    colors: { primary: '#7f1d1d', accent: '#fca5a5' },
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" fill="none">
  <circle cx="32" cy="32" r="30" fill="#200808" stroke="#7f1d1d" stroke-width="1.5"/>
  <path d="M32 10 L50 18 L50 36 C50 46 32 54 32 54 C32 54 14 46 14 36 L14 18 Z" fill="#450a0a" stroke="#b91c1c" stroke-width="1.5"/>
  <text x="32" y="37" text-anchor="middle" font-family="Arial,sans-serif" font-weight="bold" font-size="13" fill="#fca5a5">MP</text>
</svg>`,
  },

  {
    id: 22,
    category: 'orgao',
    name: 'AGU',
    tagline: 'Advocacia-Geral da União — Defesa do Estado',
    colors: { primary: '#0c4a6e', accent: '#38bdf8' },
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" fill="none">
  <circle cx="32" cy="32" r="30" fill="#040d18" stroke="#0c4a6e" stroke-width="1.5"/>
  <path d="M32 10 L50 18 L50 36 C50 46 32 54 32 54 C32 54 14 46 14 36 L14 18 Z" fill="#0c2a42" stroke="#0369a1" stroke-width="1.5"/>
  <text x="32" y="37" text-anchor="middle" font-family="Arial,sans-serif" font-weight="bold" font-size="12" fill="#38bdf8">AGU</text>
</svg>`,
  },

  {
    id: 23,
    category: 'orgao',
    name: 'Câmara dos Deputados',
    tagline: 'CD — Casa do Povo brasileiro',
    colors: { primary: '#14532d', accent: '#4ade80' },
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" fill="none">
  <circle cx="32" cy="32" r="30" fill="#052e16" stroke="#14532d" stroke-width="1.5"/>
  <path d="M12 44 Q12 28 32 20 Q52 28 52 44 Z" fill="#14532d" stroke="#16a34a" stroke-width="1.5"/>
  <rect x="30" y="18" width="4" height="6" rx="1" fill="#4ade80"/>
  <rect x="14" y="42" width="36" height="4" rx="1" fill="#166534"/>
  <line x1="14" y1="44" x2="52" y2="44" stroke="#4ade80" stroke-width="0.8"/>
  <text x="32" y="58" text-anchor="middle" font-family="Arial,sans-serif" font-weight="bold" font-size="8" fill="#4ade80">CD</text>
</svg>`,
  },

  {
    id: 24,
    category: 'orgao',
    name: 'Senado Federal',
    tagline: 'Senado — A voz dos estados',
    colors: { primary: '#1e3a8a', accent: '#93c5fd' },
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" fill="none">
  <circle cx="32" cy="32" r="30" fill="#0a1628" stroke="#1e3a8a" stroke-width="1.5"/>
  <path d="M14 44 Q14 28 32 20 Q50 28 50 44 Z" fill="#1e3a8a" stroke="#3b82f6" stroke-width="1.5"/>
  <rect x="30" y="18" width="4" height="6" rx="1" fill="#93c5fd"/>
  <rect x="14" y="42" width="36" height="4" rx="1" fill="#1e40af"/>
  <text x="32" y="58" text-anchor="middle" font-family="Arial,sans-serif" font-weight="bold" font-size="10" fill="#93c5fd">S</text>
</svg>`,
  },

  {
    id: 25,
    category: 'orgao',
    name: 'Corpo de Bombeiros',
    tagline: 'CB — Coragem que salva vidas',
    colors: { primary: '#991b1b', accent: '#fca5a5' },
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" fill="none">
  <circle cx="32" cy="32" r="30" fill="#200808" stroke="#991b1b" stroke-width="1.5"/>
  <path d="M22 42 L22 28 Q22 24 26 24 L38 24 Q42 24 42 28 L42 42 Z" fill="#7f1d1d" stroke="#dc2626" stroke-width="1.2"/>
  <ellipse cx="32" cy="24" rx="10" ry="5" fill="#991b1b" stroke="#ef4444" stroke-width="1"/>
  <rect x="30" y="19" width="4" height="5" rx="1" fill="#b91c1c"/>
  <line x1="24" y1="32" x2="40" y2="40" stroke="#fca5a5" stroke-width="2" stroke-linecap="round"/>
  <line x1="40" y1="32" x2="24" y2="40" stroke="#fca5a5" stroke-width="2" stroke-linecap="round"/>
  <rect x="18" y="42" width="28" height="4" rx="1" fill="#7f1d1d" stroke="#dc2626" stroke-width="1"/>
</svg>`,
  },

  {
    id: 26,
    category: 'orgao',
    name: 'Forças Armadas',
    tagline: 'FA — Defesa e soberania nacional',
    colors: { primary: '#1a4731', accent: '#fbbf24' },
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" fill="none">
  <circle cx="32" cy="32" r="30" fill="#0a1f14" stroke="#1a4731" stroke-width="1.5"/>
  <polygon points="32,12 34.5,19.5 42,19.5 36.2,24 38.5,32 32,27.5 25.5,32 27.8,24 22,19.5 29.5,19.5" fill="#fbbf24" stroke="#d97706" stroke-width="0.5"/>
  <circle cx="32" cy="22" r="14" stroke="#22c55e" stroke-width="1.2" fill="none" stroke-dasharray="3 2"/>
  <text x="32" y="46" text-anchor="middle" font-family="Arial,sans-serif" font-weight="bold" font-size="9" fill="#4ade80">FORÇAS</text>
  <text x="32" y="55" text-anchor="middle" font-family="Arial,sans-serif" font-weight="bold" font-size="8" fill="#4ade80">ARMADAS</text>
</svg>`,
  },
];

export function getAvatar(id: number): AvatarDef {
  return AVATARS.find((a) => a.id === id) ?? AVATARS[0];
}

export const CHARACTER_AVATARS = AVATARS.filter((a) => a.category === 'character');
export const ORGAO_AVATARS = AVATARS.filter((a) => a.category === 'orgao');
