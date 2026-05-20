'use client';

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type RefObject,
} from 'react';
import { AvatarSelector } from '@/components/AvatarSelector';

export interface MentionUser {
  id: string;
  username: string;
  nome: string | null;
  avatarId: number;
  equippedBorder: string;
}

interface Props {
  textareaRef: RefObject<HTMLTextAreaElement | null>;
  value: string;
  onChange: (next: string) => void;
  /** Disparado quando uma menção é inserida (opcional pra telemetria/observers). */
  onSelect?: (user: MentionUser) => void;
}

interface ActiveMention {
  /** Posição inicial do '@' no value (inclusive). */
  start: number;
  /** Posição final logo após o último char digitado (cursor). */
  end: number;
  /** Termo após o '@' (sem o '@'). */
  term: string;
}

const MAX_RESULTS = 6;

/**
 * Detecta se o cursor está dentro de uma menção ativa em `value`.
 * Critério: existe um `@` antes do cursor, sem espaço/quebra entre eles,
 * e os caracteres após o `@` casam com [\w] (letras/dígitos/underscore).
 *
 * Retorna null se não há menção ativa.
 */
function detectActiveMention(value: string, cursor: number): ActiveMention | null {
  if (cursor < 0 || cursor > value.length) return null;

  // Olha pra trás a partir do cursor procurando o '@'.
  let i = cursor - 1;
  while (i >= 0) {
    const ch = value.charAt(i);
    if (ch === '@') break;
    // Se chegar em whitespace/quebra antes do @, não está numa menção.
    if (/\s/.test(ch)) return null;
    // Só letras/dígitos/underscore podem fazer parte da menção.
    if (!/[\w]/.test(ch)) return null;
    i--;
  }
  if (i < 0) return null;

  // O '@' precisa estar no começo da string OU precedido de whitespace.
  const prev = i > 0 ? value.charAt(i - 1) : '';
  if (prev !== '' && !/\s/.test(prev)) return null;

  const term = value.slice(i + 1, cursor);
  // Term só com word-chars — caso já validado acima, mas mantém defensivo.
  if (term.length > 0 && !/^\w+$/.test(term)) return null;

  return { start: i, end: cursor, term };
}

export function MentionAutocomplete({ textareaRef, value, onChange, onSelect }: Props) {
  const [active, setActive] = useState<ActiveMention | null>(null);
  const [results, setResults] = useState<MentionUser[]>([]);
  const [highlight, setHighlight] = useState(0);
  const [loading, setLoading] = useState(false);

  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  // Detecta menção ativa em resposta a mudanças no value.
  // Lemos o cursor do textareaRef de forma defensiva.
  useEffect(() => {
    const ta = textareaRef.current;
    if (!ta) {
      setActive(null);
      return;
    }
    const cursor = ta.selectionStart ?? value.length;
    const mention = detectActiveMention(value, cursor);
    setActive(mention);
    setHighlight(0);
  }, [value, textareaRef]);

  // Adicionalmente, listenamos seleção/keyup pra capturar quando o cursor
  // se move sem o value mudar (ex.: clique do mouse).
  useEffect(() => {
    const ta = textareaRef.current;
    if (!ta) return;
    const handler = () => {
      const cursor = ta.selectionStart ?? ta.value.length;
      const mention = detectActiveMention(ta.value, cursor);
      setActive(mention);
      setHighlight(0);
    };
    ta.addEventListener('keyup', handler);
    ta.addEventListener('click', handler);
    ta.addEventListener('select', handler);
    return () => {
      ta.removeEventListener('keyup', handler);
      ta.removeEventListener('click', handler);
      ta.removeEventListener('select', handler);
    };
  }, [textareaRef]);

  // Busca debounced quando há menção ativa com pelo menos 2 chars.
  useEffect(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
      debounceRef.current = null;
    }
    if (abortRef.current) {
      abortRef.current.abort();
      abortRef.current = null;
    }

    if (!active || active.term.length < 2) {
      setResults([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    debounceRef.current = setTimeout(() => {
      const ctrl = new AbortController();
      abortRef.current = ctrl;
      fetch(`/api/users/mention-search?q=${encodeURIComponent(active.term)}`, {
        signal: ctrl.signal,
      })
        .then((r) => (r.ok ? r.json() : { users: [] }))
        .then((data: { users?: MentionUser[] }) => {
          const list = (data.users ?? []).slice(0, MAX_RESULTS);
          setResults(list);
          setHighlight(0);
        })
        .catch(() => {
          // Aborts caem aqui — silenciar.
        })
        .finally(() => {
          setLoading(false);
        });
    }, 150);

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
        debounceRef.current = null;
      }
    };
  }, [active]);

  // Cleanup geral
  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
      if (abortRef.current) abortRef.current.abort();
    };
  }, []);

  const close = useCallback(() => {
    setActive(null);
    setResults([]);
    setHighlight(0);
  }, []);

  const selectUser = useCallback(
    (user: MentionUser) => {
      const ta = textareaRef.current;
      if (!active || !ta) return;
      const before = value.slice(0, active.start);
      const after = value.slice(active.end);
      const insertion = `@${user.username} `;
      const next = `${before}${insertion}${after}`;
      onChange(next);
      onSelect?.(user);
      close();
      // Reposiciona o cursor logo após a menção inserida.
      const newCursor = before.length + insertion.length;
      requestAnimationFrame(() => {
        const t = textareaRef.current;
        if (!t) return;
        try {
          t.focus();
          t.setSelectionRange(newCursor, newCursor);
        } catch {
          /* noop */
        }
      });
    },
    [active, value, onChange, onSelect, textareaRef, close],
  );

  // Captura teclas no textarea pra navegar no dropdown.
  useEffect(() => {
    const ta = textareaRef.current;
    if (!ta) return;
    if (!active || results.length === 0) return;

    const handler = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setHighlight((h) => (h + 1) % results.length);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setHighlight((h) => (h - 1 + results.length) % results.length);
      } else if (e.key === 'Enter' || e.key === 'Tab') {
        e.preventDefault();
        const u = results[highlight];
        if (u) selectUser(u);
      } else if (e.key === 'Escape') {
        e.preventDefault();
        close();
      }
    };
    ta.addEventListener('keydown', handler);
    return () => {
      ta.removeEventListener('keydown', handler);
    };
  }, [textareaRef, active, results, highlight, selectUser, close]);

  // Visibilidade do dropdown.
  const open = useMemo(() => {
    return !!active && active.term.length >= 2 && (loading || results.length > 0);
  }, [active, loading, results]);

  if (!open) return null;

  return (
    <div
      role="listbox"
      aria-label="Sugestões de menções"
      className="absolute left-0 right-0 z-30 mt-1 rounded-xl overflow-hidden"
      style={{
        top: '100%',
        background: 'rgba(15,23,42,0.98)',
        border: '1px solid rgba(16,185,129,0.30)',
        boxShadow: '0 12px 32px -12px rgba(0,0,0,0.6)',
        maxHeight: 280,
        overflowY: 'auto',
      }}
    >
      {loading && results.length === 0 && (
        <div className="px-3 py-2 text-xs text-slate-500">Buscando…</div>
      )}
      {results.map((u, idx) => {
        const selected = idx === highlight;
        return (
          <button
            key={u.id}
            type="button"
            role="option"
            aria-selected={selected}
            onMouseEnter={() => setHighlight(idx)}
            // Usa onMouseDown pra disparar antes do blur do textarea.
            onMouseDown={(e) => {
              e.preventDefault();
              selectUser(u);
            }}
            className={`w-full flex items-center gap-2 px-3 py-2 text-left transition ${
              selected ? 'bg-slate-800' : 'hover:bg-slate-800/60'
            }`}
          >
            <span className="shrink-0">
              <AvatarSelector selectedId={u.avatarId} size="sm" />
            </span>
            <span className="flex-1 min-w-0">
              <span className="block text-xs font-mono text-cyan-400 truncate">
                @{u.username}
              </span>
              {u.nome && (
                <span className="block text-xs text-slate-400 truncate">{u.nome}</span>
              )}
            </span>
          </button>
        );
      })}
    </div>
  );
}
