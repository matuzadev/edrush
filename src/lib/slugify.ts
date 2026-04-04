export function slugify(str: string): string {
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // remove acentos
    .replace(/[^a-z0-9\s-]/g, '')   // remove caracteres especiais
    .replace(/\s+/g, '-')            // espaços para hífens
    .replace(/-+/g, '-')             // múltiplos hífens para um
    .replace(/^-|-$/g, '');          // remove hífens das extremidades
}
