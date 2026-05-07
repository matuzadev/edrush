export interface BrazilianState {
  codigo_ibge: number;
  sigla: string;
  nome: string;
  regiao: 'Norte' | 'Nordeste' | 'Centro-Oeste' | 'Sudeste' | 'Sul';
}

export const BRAZILIAN_STATES: BrazilianState[] = [
  { codigo_ibge: 12, sigla: 'AC', nome: 'Acre',                regiao: 'Norte' },
  { codigo_ibge: 27, sigla: 'AL', nome: 'Alagoas',             regiao: 'Nordeste' },
  { codigo_ibge: 16, sigla: 'AP', nome: 'Amapá',               regiao: 'Norte' },
  { codigo_ibge: 13, sigla: 'AM', nome: 'Amazonas',            regiao: 'Norte' },
  { codigo_ibge: 29, sigla: 'BA', nome: 'Bahia',               regiao: 'Nordeste' },
  { codigo_ibge: 23, sigla: 'CE', nome: 'Ceará',               regiao: 'Nordeste' },
  { codigo_ibge: 53, sigla: 'DF', nome: 'Distrito Federal',    regiao: 'Centro-Oeste' },
  { codigo_ibge: 32, sigla: 'ES', nome: 'Espírito Santo',      regiao: 'Sudeste' },
  { codigo_ibge: 52, sigla: 'GO', nome: 'Goiás',               regiao: 'Centro-Oeste' },
  { codigo_ibge: 21, sigla: 'MA', nome: 'Maranhão',            regiao: 'Nordeste' },
  { codigo_ibge: 51, sigla: 'MT', nome: 'Mato Grosso',         regiao: 'Centro-Oeste' },
  { codigo_ibge: 50, sigla: 'MS', nome: 'Mato Grosso do Sul',  regiao: 'Centro-Oeste' },
  { codigo_ibge: 31, sigla: 'MG', nome: 'Minas Gerais',        regiao: 'Sudeste' },
  { codigo_ibge: 15, sigla: 'PA', nome: 'Pará',                regiao: 'Norte' },
  { codigo_ibge: 25, sigla: 'PB', nome: 'Paraíba',             regiao: 'Nordeste' },
  { codigo_ibge: 41, sigla: 'PR', nome: 'Paraná',              regiao: 'Sul' },
  { codigo_ibge: 26, sigla: 'PE', nome: 'Pernambuco',          regiao: 'Nordeste' },
  { codigo_ibge: 22, sigla: 'PI', nome: 'Piauí',               regiao: 'Nordeste' },
  { codigo_ibge: 33, sigla: 'RJ', nome: 'Rio de Janeiro',      regiao: 'Sudeste' },
  { codigo_ibge: 24, sigla: 'RN', nome: 'Rio Grande do Norte', regiao: 'Nordeste' },
  { codigo_ibge: 43, sigla: 'RS', nome: 'Rio Grande do Sul',   regiao: 'Sul' },
  { codigo_ibge: 11, sigla: 'RO', nome: 'Rondônia',            regiao: 'Norte' },
  { codigo_ibge: 14, sigla: 'RR', nome: 'Roraima',             regiao: 'Norte' },
  { codigo_ibge: 42, sigla: 'SC', nome: 'Santa Catarina',      regiao: 'Sul' },
  { codigo_ibge: 35, sigla: 'SP', nome: 'São Paulo',           regiao: 'Sudeste' },
  { codigo_ibge: 28, sigla: 'SE', nome: 'Sergipe',             regiao: 'Nordeste' },
  { codigo_ibge: 17, sigla: 'TO', nome: 'Tocantins',           regiao: 'Norte' },
];

export function getStateBySigla(sigla: string): BrazilianState | undefined {
  const target = sigla.trim().toUpperCase();
  return BRAZILIAN_STATES.find((s) => s.sigla === target);
}
