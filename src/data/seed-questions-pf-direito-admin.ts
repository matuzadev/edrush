// ─── PF — Direito Administrativo (banco completo) ────────────────────────────
// Concurso: Polícia Federal (Agente / Escrivão / Delegado / Perito).
// Banca: CESPE / CEBRASPE.
//
// Distribuição (430 questões):
//   Capítulo 1  — Princípios da Administração Pública: 100 questões + Material de Estudos
//   Capítulo 2  — Poderes administrativos:              30
//   Capítulo 3  — Atos administrativos:                 30
//   Capítulo 4  — Agentes públicos e servidores:        30
//   Capítulo 5  — Órgãos e entidades da Administração:  30
//   Capítulo 6  — Licitações e contratos (Lei 14.133):  60 (capítulo extenso)
//   Capítulo 7  — Controle da Administração Pública:    30
//   Capítulo 8  — Responsabilidade civil do Estado:     30
//   Capítulo 9  — Processo administrativo (Lei 9.784):  30
//   Capítulo 10 — Improbidade administrativa:           30
//   Capítulo 11 — Servidores federais (Lei 8.112/90):   30
//
// Fontes: Edital CEBRASPE PF 2025 (Ed_1_PF_25_Abertura), provas anteriores PF
//   2018/2014, CF/88 art. 37-41, Lei 8.112/90, Lei 9.784/99, Lei 14.133/2021,
//   Lei 8.429/92 (red. Lei 14.230/2021), Súmulas STF/STJ relevantes.
// Bibliografia: Di Pietro, Hely Lopes Meirelles, Bandeira de Mello,
//   Carvalho Filho, Alexandrino & Paulo, Matheus Carvalho.

import type { SeedQuestion } from './seed-questions';

import { PF_DIR_ADMIN_CAP1A } from './seed-questions-pf-direito-admin-cap1a';
import { PF_DIR_ADMIN_CAP1B } from './seed-questions-pf-direito-admin-cap1b';
import { PF_DIR_ADMIN_CAP2_3 } from './seed-questions-pf-direito-admin-cap2-3';
import { PF_DIR_ADMIN_CAP4_5 } from './seed-questions-pf-direito-admin-cap4-5';
import { PF_DIR_ADMIN_CAP6 } from './seed-questions-pf-direito-admin-cap6';
import { PF_DIR_ADMIN_CAP7_8 } from './seed-questions-pf-direito-admin-cap7-8';
import { PF_DIR_ADMIN_CAP9_10 } from './seed-questions-pf-direito-admin-cap9-10';
import { PF_DIR_ADMIN_CAP11 } from './seed-questions-pf-direito-admin-cap11';

// Capítulos da disciplina direito-administrativo — alinhados a subjects.json.
// O title precisa bater EXATAMENTE com src/data/subjects.json para o quiz exibir.
export const PF_DIR_ADMIN_CHAPTERS: {
  disciplina: string;
  numero: number;
  titulo: string;
  descricao?: string;
  is_primeiro?: boolean;
}[] = [
  { disciplina: 'direito-administrativo', numero: 1, titulo: 'Princípios da Administração Pública', is_primeiro: true,
    descricao: 'Princípios expressos do art. 37 da CF/88 (LIMPE) e princípios implícitos.' },
  { disciplina: 'direito-administrativo', numero: 2, titulo: 'Poderes administrativos',
    descricao: 'Poder vinculado, discricionário, hierárquico, disciplinar, regulamentar, de polícia.' },
  { disciplina: 'direito-administrativo', numero: 3, titulo: 'Atos administrativos',
    descricao: 'Conceito, atributos, elementos, classificação, validade, extinção e convalidação.' },
  { disciplina: 'direito-administrativo', numero: 4, titulo: 'Agentes públicos e servidores',
    descricao: 'Espécies, classificação, regime jurídico e responsabilidades.' },
  { disciplina: 'direito-administrativo', numero: 5, titulo: 'Órgãos e entidades da Administração',
    descricao: 'Administração direta e indireta, autarquias, fundações, EPs e SEMs.' },
  { disciplina: 'direito-administrativo', numero: 6, titulo: 'Licitações e contratos (Lei 14.133/2021)',
    descricao: 'Nova Lei de Licitações: princípios, modalidades, fases, contratos e sanções.' },
  { disciplina: 'direito-administrativo', numero: 7, titulo: 'Controle da Administração Pública',
    descricao: 'Controle interno, externo (TCU), judicial e social.' },
  { disciplina: 'direito-administrativo', numero: 8, titulo: 'Responsabilidade civil do Estado',
    descricao: 'Teoria do risco administrativo, art. 37 §6º CF/88, ação regressiva.' },
  { disciplina: 'direito-administrativo', numero: 9, titulo: 'Processo administrativo (Lei 9.784/99)',
    descricao: 'Princípios do processo administrativo federal, prazos, recursos, anulação e revogação.' },
  { disciplina: 'direito-administrativo', numero: 10, titulo: 'Improbidade administrativa',
    descricao: 'Lei 8.429/92 com alterações da Lei 14.230/2021: atos, sanções, prescrição.' },
  { disciplina: 'direito-administrativo', numero: 11, titulo: 'Regime jurídico dos servidores federais (Lei 8.112/90)',
    descricao: 'Provimento, vacância, direitos, deveres, regime disciplinar e PAD.' },
];

export const PF_DIR_ADMIN_QUESTIONS: SeedQuestion[] = [
  ...PF_DIR_ADMIN_CAP1A,
  ...PF_DIR_ADMIN_CAP1B,
  ...PF_DIR_ADMIN_CAP2_3,
  ...PF_DIR_ADMIN_CAP4_5,
  ...PF_DIR_ADMIN_CAP6,
  ...PF_DIR_ADMIN_CAP7_8,
  ...PF_DIR_ADMIN_CAP9_10,
  ...PF_DIR_ADMIN_CAP11,
];
