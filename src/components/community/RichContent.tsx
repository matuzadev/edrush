'use client';

import Link from 'next/link';
import { Fragment, type ReactNode } from 'react';

interface Props {
  text: string;
  /** Classe adicional aplicada ao wrapper (mantém whitespace por padrão). */
  className?: string;
}

const MENTION_RE = /@(\w+)/g;

/**
 * Renderiza texto com menções `@username` linkadas para `/perfil/<username>`.
 * Preserva o whitespace original via `white-space: pre-wrap`.
 */
export function RichContent({ text, className }: Props) {
  if (!text) return null;

  const parts: ReactNode[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  let key = 0;

  // Reset do regex stateful (g flag).
  MENTION_RE.lastIndex = 0;

  while ((match = MENTION_RE.exec(text)) !== null) {
    const username = match[1];
    const start = match.index;
    const end = start + match[0].length;

    if (start > lastIndex) {
      parts.push(<Fragment key={`t-${key++}`}>{text.slice(lastIndex, start)}</Fragment>);
    }

    parts.push(
      <Link
        key={`m-${key++}`}
        href={`/perfil/${encodeURIComponent(username)}`}
        className="text-cyan-400 hover:underline font-bold"
      >
        @{username}
      </Link>,
    );

    lastIndex = end;
  }

  if (lastIndex < text.length) {
    parts.push(<Fragment key={`t-${key++}`}>{text.slice(lastIndex)}</Fragment>);
  }

  return (
    <span className={className} style={{ whiteSpace: 'pre-wrap' }}>
      {parts}
    </span>
  );
}
