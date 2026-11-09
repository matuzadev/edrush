// Shape do JSON estruturado retornado pelo Claude e renderizado em PDF.
// Stable contract — não mudar sem reflexão; PDF renderer depende disso.

export type ContentBlock =
  | { type: 'paragraph'; text: string }
  | { type: 'heading'; level: 2 | 3; text: string }
  | { type: 'list'; ordered?: boolean; items: string[] }
  | { type: 'callout'; style: 'tip' | 'warning' | 'info' | 'rule'; title?: string; text: string }
  | { type: 'example'; question: string; answer: string; explanation?: string }
  | { type: 'definition'; term: string; meaning: string }
  | { type: 'table'; headers: string[]; rows: string[][] };

export interface ChapterSection {
  title: string;
  intro?: string;
  blocks: ContentBlock[];
}

export interface StudyMaterialContent {
  title: string;
  subtitle: string;
  concurso_slug: string;
  disciplina: string;
  abstract: string;
  chapters: ChapterSection[];
  references?: string[];
  /** ISO timestamp da geração. */
  generated_at: string;
}
