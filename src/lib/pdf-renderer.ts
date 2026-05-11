// Renderiza StudyMaterialContent → Buffer PDF via pdfkit.
//
// Decisões de design:
//   - Fonte Noto Sans embedada (PT-BR com acentos, sem dependência de fonte do SO)
//   - Cores alinhadas com a estética dark do app, mas adaptadas pra PDF (papel branco)
//   - Capa + sumário (com page numbers) + páginas de conteúdo + página final
//   - Callouts coloridos por tipo (tip/warning/info/rule)
//   - Tabela manual (pdfkit não tem table primitive)

import PDFDocument from 'pdfkit';
import path from 'path';
import type { StudyMaterialContent, ContentBlock, ChapterSection } from './study-material-types';

const FONT_DIR = path.join(process.cwd(), 'public', 'fonts');
const FONT_REGULAR = path.join(FONT_DIR, 'NotoSans-Regular.ttf');
const FONT_BOLD = path.join(FONT_DIR, 'NotoSans-Bold.ttf');
const FONT_ITALIC = path.join(FONT_DIR, 'NotoSans-Italic.ttf');

const COLORS = {
  emerald: '#059669',
  emeraldDark: '#047857',
  emeraldLight: '#d1fae5',
  slate: '#0f172a',
  slateMid: '#475569',
  slateLight: '#e2e8f0',
  warning: '#dc2626',
  warningLight: '#fee2e2',
  info: '#2563eb',
  infoLight: '#dbeafe',
  tip: '#7c3aed',
  tipLight: '#ede9fe',
  rule: '#0891b2',
  ruleLight: '#cffafe',
  white: '#ffffff',
  paper: '#fafafa',
  text: '#1e293b',
  muted: '#64748b',
};

const CALLOUT_THEME: Record<string, { bg: string; border: string; icon: string; label: string }> = {
  tip:     { bg: COLORS.tipLight,     border: COLORS.tip,     icon: '💡', label: 'DICA' },
  warning: { bg: COLORS.warningLight, border: COLORS.warning, icon: '⚠️', label: 'ATENÇÃO' },
  info:    { bg: COLORS.infoLight,    border: COLORS.info,    icon: 'ℹ️', label: 'INFO' },
  rule:    { bg: COLORS.ruleLight,    border: COLORS.rule,    icon: '📜', label: 'REGRA' },
};

const PAGE_MARGIN = 56;
const PAGE_WIDTH = 595.28;  // A4
const PAGE_HEIGHT = 841.89;
const CONTENT_WIDTH = PAGE_WIDTH - PAGE_MARGIN * 2;

type Doc = InstanceType<typeof PDFDocument>;

function registerFonts(doc: Doc) {
  doc.registerFont('NS-Regular', FONT_REGULAR);
  doc.registerFont('NS-Bold', FONT_BOLD);
  doc.registerFont('NS-Italic', FONT_ITALIC);
}

function drawHeaderFooter(doc: Doc, opts: { title: string; subtitle: string }) {
  const range = doc.bufferedPageRange();
  for (let i = range.start; i < range.start + range.count; i++) {
    doc.switchToPage(i);
    // Reset margins para escrever fora do fluxo
    const oldY = doc.y;
    const oldMarginBottom = doc.page.margins.bottom;
    doc.page.margins.bottom = 0;

    // Header: linha + título do material
    if (i > range.start) {
      doc.fontSize(8).font('NS-Regular').fillColor(COLORS.muted);
      doc.text(opts.title.toUpperCase(), PAGE_MARGIN, 28, {
        width: CONTENT_WIDTH,
        align: 'left',
        lineBreak: false,
      });
      doc.text(opts.subtitle, PAGE_MARGIN, 28, {
        width: CONTENT_WIDTH,
        align: 'right',
        lineBreak: false,
      });
      doc.moveTo(PAGE_MARGIN, 44).lineTo(PAGE_WIDTH - PAGE_MARGIN, 44).strokeColor(COLORS.slateLight).lineWidth(0.5).stroke();
    }

    // Footer: page number + branding
    doc.fontSize(8).font('NS-Regular').fillColor(COLORS.muted);
    const pageNum = i - range.start + 1;
    doc.text(
      `Foco Federal · Material de Estudos`,
      PAGE_MARGIN, PAGE_HEIGHT - 30,
      { width: CONTENT_WIDTH, align: 'left', lineBreak: false }
    );
    doc.text(
      `Página ${pageNum} de ${range.count}`,
      PAGE_MARGIN, PAGE_HEIGHT - 30,
      { width: CONTENT_WIDTH, align: 'right', lineBreak: false }
    );

    doc.y = oldY;
    doc.page.margins.bottom = oldMarginBottom;
  }
}

function drawCover(doc: Doc, content: StudyMaterialContent) {
  // Background degradê (faixa superior)
  doc.rect(0, 0, PAGE_WIDTH, 260).fill(COLORS.slate);
  doc.rect(0, 260, PAGE_WIDTH, 8).fill(COLORS.emerald);

  // Badge "MATERIAL DE ESTUDOS"
  doc.fontSize(10).font('NS-Bold').fillColor(COLORS.emeraldLight);
  doc.text('MATERIAL DE ESTUDOS', PAGE_MARGIN, 80, {
    width: CONTENT_WIDTH, align: 'left', characterSpacing: 2,
  });

  // Disciplina (título grande)
  doc.fontSize(34).font('NS-Bold').fillColor(COLORS.white);
  doc.text(content.disciplina, PAGE_MARGIN, 110, {
    width: CONTENT_WIDTH, align: 'left',
  });

  // Concurso
  doc.fontSize(16).font('NS-Regular').fillColor(COLORS.slateLight);
  doc.text(content.title, PAGE_MARGIN, 175, {
    width: CONTENT_WIDTH, align: 'left',
  });

  // Subtítulo / linha fina
  if (content.subtitle) {
    doc.fontSize(11).font('NS-Italic').fillColor('#cbd5e1');
    doc.text(content.subtitle, PAGE_MARGIN, 205, {
      width: CONTENT_WIDTH, align: 'left',
    });
  }

  // Card de metadados na parte inferior
  doc.rect(PAGE_MARGIN, 320, CONTENT_WIDTH, 1).fill(COLORS.slateLight);

  doc.fontSize(11).font('NS-Bold').fillColor(COLORS.slate);
  doc.text('SOBRE ESTE MATERIAL', PAGE_MARGIN, 340, {
    width: CONTENT_WIDTH, align: 'left', characterSpacing: 1.5,
  });

  doc.fontSize(10).font('NS-Regular').fillColor(COLORS.text);
  doc.text(content.abstract, PAGE_MARGIN, 365, {
    width: CONTENT_WIDTH, align: 'justify', lineGap: 3,
  });

  // Rodapé da capa
  const gen = new Date(content.generated_at);
  const formatted = `${gen.getDate().toString().padStart(2, '0')}/${(gen.getMonth() + 1).toString().padStart(2, '0')}/${gen.getFullYear()}`;
  doc.fontSize(9).font('NS-Regular').fillColor(COLORS.muted);
  doc.text(`Gerado em ${formatted}  ·  ${content.chapters.length} capítulos  ·  Foco Federal`,
    PAGE_MARGIN, PAGE_HEIGHT - 80, { width: CONTENT_WIDTH, align: 'center' });
}

function drawTOC(doc: Doc, content: StudyMaterialContent) {
  doc.addPage();
  doc.fontSize(24).font('NS-Bold').fillColor(COLORS.slate);
  doc.text('Sumário', PAGE_MARGIN, PAGE_MARGIN + 10, { width: CONTENT_WIDTH });
  doc.moveTo(PAGE_MARGIN, doc.y + 8).lineTo(PAGE_WIDTH - PAGE_MARGIN, doc.y + 8).strokeColor(COLORS.emerald).lineWidth(2).stroke();
  doc.y += 28;

  content.chapters.forEach((ch, idx) => {
    doc.fontSize(12).font('NS-Bold').fillColor(COLORS.text);
    doc.text(`${(idx + 1).toString().padStart(2, '0')}.  ${ch.title}`, PAGE_MARGIN, doc.y, {
      width: CONTENT_WIDTH, align: 'left', lineGap: 2,
    });
    doc.y += 6;
  });

  if (content.references && content.references.length > 0) {
    doc.fontSize(12).font('NS-Bold').fillColor(COLORS.text);
    doc.text(`${(content.chapters.length + 1).toString().padStart(2, '0')}.  Referências`, PAGE_MARGIN, doc.y, {
      width: CONTENT_WIDTH, align: 'left',
    });
    doc.y += 6;
  }
}

function ensureSpace(doc: Doc, needed: number) {
  if (doc.y + needed > PAGE_HEIGHT - PAGE_MARGIN - 30) {
    doc.addPage();
  }
}

function drawChapterTitle(doc: Doc, index: number, title: string) {
  doc.addPage();
  doc.fontSize(11).font('NS-Bold').fillColor(COLORS.emerald);
  doc.text(`CAPÍTULO ${index.toString().padStart(2, '0')}`, PAGE_MARGIN, PAGE_MARGIN + 10, {
    width: CONTENT_WIDTH, characterSpacing: 2,
  });
  doc.fontSize(26).font('NS-Bold').fillColor(COLORS.slate);
  doc.text(title, PAGE_MARGIN, doc.y + 4, { width: CONTENT_WIDTH, lineGap: 2 });
  doc.moveTo(PAGE_MARGIN, doc.y + 8).lineTo(PAGE_MARGIN + 60, doc.y + 8).strokeColor(COLORS.emerald).lineWidth(3).stroke();
  doc.y += 28;
}

function drawHeading(doc: Doc, level: 2 | 3, text: string) {
  ensureSpace(doc, level === 2 ? 50 : 36);
  if (level === 2) {
    doc.fontSize(16).font('NS-Bold').fillColor(COLORS.slate);
  } else {
    doc.fontSize(13).font('NS-Bold').fillColor(COLORS.emeraldDark);
  }
  doc.text(text, PAGE_MARGIN, doc.y + (level === 2 ? 14 : 8), {
    width: CONTENT_WIDTH, lineGap: 2,
  });
  doc.y += level === 2 ? 6 : 4;
}

function drawParagraph(doc: Doc, text: string) {
  ensureSpace(doc, 24);
  doc.fontSize(10.5).font('NS-Regular').fillColor(COLORS.text);
  doc.text(text, PAGE_MARGIN, doc.y, {
    width: CONTENT_WIDTH, align: 'justify', lineGap: 3, paragraphGap: 6,
  });
  doc.y += 4;
}

function drawList(doc: Doc, items: string[], ordered: boolean) {
  doc.fontSize(10.5).font('NS-Regular').fillColor(COLORS.text);
  items.forEach((item, idx) => {
    ensureSpace(doc, 22);
    const bullet = ordered ? `${idx + 1}.` : '•';
    const xLeft = PAGE_MARGIN + 8;
    const xText = PAGE_MARGIN + 24;
    doc.text(bullet, xLeft, doc.y, { continued: false, width: 16, lineBreak: false });
    doc.text(item, xText, doc.y, {
      width: CONTENT_WIDTH - 24, align: 'left', lineGap: 3,
    });
    doc.y += 3;
  });
  doc.y += 6;
}

function drawCallout(doc: Doc, block: Extract<ContentBlock, { type: 'callout' }>) {
  const theme = CALLOUT_THEME[block.style] ?? CALLOUT_THEME.info;
  doc.fontSize(10.5).font('NS-Regular').fillColor(COLORS.text);

  // Mede altura do texto pra desenhar o box certo
  const innerWidth = CONTENT_WIDTH - 24;
  const textHeight = doc.heightOfString(block.text, { width: innerWidth, align: 'left', lineGap: 3 });
  const labelHeight = 18;
  const totalHeight = textHeight + labelHeight + 18;

  ensureSpace(doc, totalHeight + 8);
  const startY = doc.y + 4;

  // Box background
  doc.rect(PAGE_MARGIN, startY, CONTENT_WIDTH, totalHeight).fillAndStroke(theme.bg, theme.border).lineWidth(0);
  // Faixa lateral
  doc.rect(PAGE_MARGIN, startY, 4, totalHeight).fill(theme.border);

  // Label
  doc.fontSize(9).font('NS-Bold').fillColor(theme.border);
  doc.text(`${theme.icon} ${block.title?.toUpperCase() ?? theme.label}`, PAGE_MARGIN + 12, startY + 8, {
    width: innerWidth, characterSpacing: 1.5, lineBreak: false,
  });

  // Texto
  doc.fontSize(10.5).font('NS-Regular').fillColor(COLORS.text);
  doc.text(block.text, PAGE_MARGIN + 12, startY + labelHeight + 10, {
    width: innerWidth, align: 'left', lineGap: 3,
  });

  doc.y = startY + totalHeight + 10;
}

function drawExample(doc: Doc, block: Extract<ContentBlock, { type: 'example' }>) {
  doc.fontSize(10.5).font('NS-Regular').fillColor(COLORS.text);
  const innerWidth = CONTENT_WIDTH - 24;
  const qHeight = doc.heightOfString(block.question, { width: innerWidth, lineGap: 3 });
  const aHeight = doc.heightOfString(block.answer, { width: innerWidth, lineGap: 3 });
  const eHeight = block.explanation
    ? doc.heightOfString(block.explanation, { width: innerWidth, lineGap: 3 })
    : 0;
  const total = qHeight + aHeight + eHeight + 70;

  ensureSpace(doc, total + 10);
  const startY = doc.y + 4;

  doc.rect(PAGE_MARGIN, startY, CONTENT_WIDTH, total).fillAndStroke('#f8fafc', '#e2e8f0').lineWidth(0);
  doc.rect(PAGE_MARGIN, startY, 4, total).fill(COLORS.emerald);

  let y = startY + 8;
  doc.fontSize(9).font('NS-Bold').fillColor(COLORS.emerald);
  doc.text('📝 EXEMPLO RESOLVIDO', PAGE_MARGIN + 12, y, { width: innerWidth, characterSpacing: 1.5, lineBreak: false });
  y += 18;

  doc.fontSize(10).font('NS-Bold').fillColor(COLORS.slate);
  doc.text('Enunciado:', PAGE_MARGIN + 12, y, { width: innerWidth, lineBreak: false });
  y += 14;
  doc.font('NS-Regular').fillColor(COLORS.text);
  doc.text(block.question, PAGE_MARGIN + 12, y, { width: innerWidth, align: 'justify', lineGap: 3 });
  y = doc.y + 6;

  doc.font('NS-Bold').fillColor(COLORS.emeraldDark);
  doc.text('Gabarito:', PAGE_MARGIN + 12, y, { width: innerWidth, lineBreak: false });
  y += 14;
  doc.font('NS-Regular').fillColor(COLORS.text);
  doc.text(block.answer, PAGE_MARGIN + 12, y, { width: innerWidth, align: 'justify', lineGap: 3 });
  y = doc.y + 6;

  if (block.explanation) {
    doc.font('NS-Bold').fillColor(COLORS.slate);
    doc.text('Explicação:', PAGE_MARGIN + 12, y, { width: innerWidth, lineBreak: false });
    y += 14;
    doc.font('NS-Regular').fillColor(COLORS.text);
    doc.text(block.explanation, PAGE_MARGIN + 12, y, { width: innerWidth, align: 'justify', lineGap: 3 });
  }

  doc.y = startY + total + 10;
}

function drawDefinition(doc: Doc, block: Extract<ContentBlock, { type: 'definition' }>) {
  doc.fontSize(10.5).font('NS-Regular').fillColor(COLORS.text);
  ensureSpace(doc, 60);
  const startY = doc.y + 4;
  const meaningHeight = doc.heightOfString(block.meaning, { width: CONTENT_WIDTH - 24, lineGap: 3 });
  const total = meaningHeight + 36;

  doc.rect(PAGE_MARGIN, startY, CONTENT_WIDTH, total).strokeColor('#e2e8f0').lineWidth(1).stroke();

  doc.fontSize(11).font('NS-Bold').fillColor(COLORS.slate);
  doc.text(block.term, PAGE_MARGIN + 12, startY + 8, { width: CONTENT_WIDTH - 24, lineBreak: false });
  doc.fontSize(10).font('NS-Regular').fillColor(COLORS.text);
  doc.text(block.meaning, PAGE_MARGIN + 12, startY + 26, {
    width: CONTENT_WIDTH - 24, align: 'left', lineGap: 3,
  });
  doc.y = startY + total + 10;
}

function drawTable(doc: Doc, block: Extract<ContentBlock, { type: 'table' }>) {
  const cols = block.headers.length;
  if (cols === 0) return;
  const colWidth = CONTENT_WIDTH / cols;
  const rowHeight = 24;

  ensureSpace(doc, (block.rows.length + 1) * rowHeight + 20);
  const startY = doc.y + 4;

  // Header
  doc.rect(PAGE_MARGIN, startY, CONTENT_WIDTH, rowHeight).fill(COLORS.slate);
  doc.fontSize(10).font('NS-Bold').fillColor(COLORS.white);
  block.headers.forEach((h, i) => {
    doc.text(h, PAGE_MARGIN + i * colWidth + 8, startY + 7, {
      width: colWidth - 16, lineBreak: false, ellipsis: true,
    });
  });

  // Rows
  doc.font('NS-Regular').fillColor(COLORS.text);
  block.rows.forEach((row, ri) => {
    const y = startY + (ri + 1) * rowHeight;
    if (ri % 2 === 1) {
      doc.rect(PAGE_MARGIN, y, CONTENT_WIDTH, rowHeight).fill('#f8fafc');
    }
    doc.fillColor(COLORS.text);
    row.forEach((cell, ci) => {
      doc.text(cell ?? '', PAGE_MARGIN + ci * colWidth + 8, y + 7, {
        width: colWidth - 16, lineBreak: false, ellipsis: true,
      });
    });
  });

  // Border
  doc.rect(PAGE_MARGIN, startY, CONTENT_WIDTH, rowHeight * (block.rows.length + 1))
    .strokeColor('#cbd5e1').lineWidth(0.5).stroke();

  doc.y = startY + rowHeight * (block.rows.length + 1) + 10;
}

function drawBlock(doc: Doc, block: ContentBlock) {
  switch (block.type) {
    case 'paragraph': return drawParagraph(doc, block.text);
    case 'heading': return drawHeading(doc, block.level, block.text);
    case 'list': return drawList(doc, block.items, !!block.ordered);
    case 'callout': return drawCallout(doc, block);
    case 'example': return drawExample(doc, block);
    case 'definition': return drawDefinition(doc, block);
    case 'table': return drawTable(doc, block);
  }
}

function drawChapter(doc: Doc, index: number, chapter: ChapterSection) {
  drawChapterTitle(doc, index, chapter.title);
  if (chapter.intro) {
    doc.fontSize(11).font('NS-Italic').fillColor(COLORS.muted);
    doc.text(chapter.intro, PAGE_MARGIN, doc.y, {
      width: CONTENT_WIDTH, align: 'justify', lineGap: 3,
    });
    doc.y += 12;
  }
  for (const block of chapter.blocks) {
    drawBlock(doc, block);
  }
}

function drawReferences(doc: Doc, refs: string[]) {
  doc.addPage();
  doc.fontSize(24).font('NS-Bold').fillColor(COLORS.slate);
  doc.text('Referências', PAGE_MARGIN, PAGE_MARGIN + 10, { width: CONTENT_WIDTH });
  doc.moveTo(PAGE_MARGIN, doc.y + 8).lineTo(PAGE_WIDTH - PAGE_MARGIN, doc.y + 8).strokeColor(COLORS.emerald).lineWidth(2).stroke();
  doc.y += 24;

  doc.fontSize(10.5).font('NS-Regular').fillColor(COLORS.text);
  refs.forEach((ref, idx) => {
    ensureSpace(doc, 30);
    doc.text(`[${idx + 1}] ${ref}`, PAGE_MARGIN, doc.y, {
      width: CONTENT_WIDTH, align: 'left', lineGap: 3,
    });
    doc.y += 4;
  });
}

export async function renderPDF(content: StudyMaterialContent): Promise<{
  buffer: Buffer;
  pageCount: number;
}> {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({
      size: 'A4',
      margins: { top: PAGE_MARGIN, bottom: PAGE_MARGIN, left: PAGE_MARGIN, right: PAGE_MARGIN },
      bufferPages: true,
      info: {
        Title: `${content.disciplina} — ${content.title}`,
        Author: 'Foco Federal',
        Subject: 'Material de Estudos para Concurso Público',
        Keywords: `concurso, ${content.disciplina}, ${content.concurso_slug}`,
      },
    });

    const chunks: Buffer[] = [];
    doc.on('data', (c: Buffer) => chunks.push(c));
    doc.on('end', () => {
      const buffer = Buffer.concat(chunks);
      const pageCount = doc.bufferedPageRange().count;
      resolve({ buffer, pageCount });
    });
    doc.on('error', reject);

    try {
      registerFonts(doc);
      doc.font('NS-Regular');

      drawCover(doc, content);
      drawTOC(doc, content);

      content.chapters.forEach((ch, i) => drawChapter(doc, i + 1, ch));

      if (content.references && content.references.length > 0) {
        drawReferences(doc, content.references);
      }

      // Header/footer em todas as páginas (após bufferPages)
      drawHeaderFooter(doc, { title: content.disciplina, subtitle: content.title });

      doc.end();
    } catch (err) {
      reject(err);
    }
  });
}
