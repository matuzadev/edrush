/**
 * Mapeamento de órgãos/organizadores para configurações visuais.
 * A chave é a substring que aparece no nome do organizador (case-insensitive).
 * Se não houver match, gera iniciais + cor baseados no nome.
 */
export interface OrgaoConfig {
  initials: string;
  color: string; // cor de fundo do badge
  textColor: string;
}

const ORGAO_MAP: Array<{ match: string; config: OrgaoConfig }> = [
  { match: 'polícia federal',        config: { initials: 'PF',   color: '#1e3a5f', textColor: '#60a5fa' } },
  { match: 'policia federal',        config: { initials: 'PF',   color: '#1e3a5f', textColor: '#60a5fa' } },
  { match: 'polícia rodoviária',     config: { initials: 'PRF',  color: '#1a3a2a', textColor: '#34d399' } },
  { match: 'policia rodoviaria',     config: { initials: 'PRF',  color: '#1a3a2a', textColor: '#34d399' } },
  { match: 'receita federal',        config: { initials: 'RF',   color: '#3b1a1a', textColor: '#f87171' } },
  { match: 'ibge',                   config: { initials: 'IBGE', color: '#1a2a3b', textColor: '#38bdf8' } },
  { match: 'banco central',          config: { initials: 'BC',   color: '#2a1a3b', textColor: '#a78bfa' } },
  { match: 'tcu',                    config: { initials: 'TCU',  color: '#3b2a1a', textColor: '#fb923c' } },
  { match: 'tribunal de contas',     config: { initials: 'TCU',  color: '#3b2a1a', textColor: '#fb923c' } },
  { match: 'stf',                    config: { initials: 'STF',  color: '#1a3b2a', textColor: '#4ade80' } },
  { match: 'stj',                    config: { initials: 'STJ',  color: '#1a3b30', textColor: '#2dd4bf' } },
  { match: 'correios',               config: { initials: 'ECT',  color: '#2a3b1a', textColor: '#a3e635' } },
  { match: 'inss',                   config: { initials: 'INSS', color: '#3b1a2a', textColor: '#f472b6' } },
  { match: 'caixa econômica',        config: { initials: 'CEF',  color: '#1a2a1a', textColor: '#86efac' } },
  { match: 'caixa economica',        config: { initials: 'CEF',  color: '#1a2a1a', textColor: '#86efac' } },
  { match: 'banco do brasil',        config: { initials: 'BB',   color: '#2a2a1a', textColor: '#fbbf24' } },
  { match: 'ministério da fazenda',  config: { initials: 'MF',   color: '#1a3a3b', textColor: '#22d3ee' } },
  { match: 'ministerio da fazenda',  config: { initials: 'MF',   color: '#1a3a3b', textColor: '#22d3ee' } },
  { match: 'anatel',                 config: { initials: 'ANATEL', color: '#2b1a3b', textColor: '#c084fc' } },
  { match: 'anvisa',                 config: { initials: 'ANVISA', color: '#1a3b3b', textColor: '#5eead4' } },
  { match: 'anac',                   config: { initials: 'ANAC', color: '#3b1a1a', textColor: '#fca5a5' } },
  { match: 'depen',                  config: { initials: 'DEPEN', color: '#251a3b', textColor: '#a5b4fc' } },
  { match: 'polícia penal',          config: { initials: 'PP',   color: '#251a3b', textColor: '#a5b4fc' } },
  { match: 'policia penal',          config: { initials: 'PP',   color: '#251a3b', textColor: '#a5b4fc' } },
  { match: 'abin',                   config: { initials: 'ABIN', color: '#1a1a3b', textColor: '#818cf8' } },
  { match: 'susep',                  config: { initials: 'SUSEP', color: '#3b2a1a', textColor: '#fdba74' } },
  { match: 'ana ',                   config: { initials: 'ANA',  color: '#1a2a3b', textColor: '#7dd3fc' } },
];

const FALLBACK_COLORS = [
  { color: '#1e3a5f', textColor: '#60a5fa' },
  { color: '#1a3a2a', textColor: '#34d399' },
  { color: '#3b1a1a', textColor: '#f87171' },
  { color: '#2a1a3b', textColor: '#a78bfa' },
  { color: '#3b2a1a', textColor: '#fb923c' },
  { color: '#1a3b2a', textColor: '#4ade80' },
  { color: '#1a2a3b', textColor: '#38bdf8' },
];

function getInitials(name: string): string {
  const words = name.trim().split(/\s+/);
  if (words.length === 1) return words[0].slice(0, 2).toUpperCase();
  // Pega até 3 iniciais de palavras significativas (ignora artigos/preposições)
  const skip = new Set(['de', 'da', 'do', 'das', 'dos', 'e', 'a', 'o', 'em', 'no', 'na']);
  const sig = words.filter((w) => !skip.has(w.toLowerCase()));
  return sig
    .slice(0, 3)
    .map((w) => w[0].toUpperCase())
    .join('');
}

function hashName(name: string): number {
  let h = 0;
  for (let i = 0; i < name.length; i++) {
    h = (h * 31 + name.charCodeAt(i)) & 0xffff;
  }
  return h;
}

export function getOrgaoConfig(organizador: string): OrgaoConfig {
  const lower = organizador.toLowerCase();
  for (const { match, config } of ORGAO_MAP) {
    if (lower.includes(match)) return config;
  }
  // Fallback: gera iniciais + cor determinística pelo nome
  const palette = FALLBACK_COLORS[hashName(organizador) % FALLBACK_COLORS.length];
  return {
    initials: getInitials(organizador),
    ...palette,
  };
}
