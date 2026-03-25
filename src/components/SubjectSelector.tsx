"use client";

import React, { useState, useMemo } from "react";
import { X } from 'lucide-react';

interface Props {
  value: string;
  onChange: (s: string) => void;
  subjects?: string[];
  onCreate?: (s: string) => void;
  onDelete?: (s: string) => void;
  placeholder?: string;
}

export const SubjectSelector: React.FC<Props> = ({ value, onChange, subjects = [], onCreate, onDelete, placeholder = "Selecionar ou criar matéria" }) => {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    if (!query) return subjects;
    return subjects.filter((s) => s.toLowerCase().includes(query.toLowerCase()));
  }, [subjects, query]);

  const handleAdd = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      const v = query.trim();
      if (!v) return;
      if (!subjects.includes(v)) {
        onCreate?.(v);
      }
      onChange(v);
      setQuery("");
    }
  };

  return (
    <div>
      <label className="block text-sm font-bold text-slate-300 mb-2 uppercase tracking-widest">Matéria</label>

      <div className="mb-2">
        <div className="flex flex-wrap gap-2">
          {subjects.map((s) => (
            <div key={s} className="relative inline-flex">
              <button
                type="button"
                onClick={() => onChange(s)}
                className={`px-4 py-2 rounded-full text-sm font-semibold transition ${
                  s === value
                    ? "bg-emerald-500 text-slate-900"
                    : "bg-slate-800 text-slate-300 hover:bg-slate-700"
                }`}
              >
                {s}
              </button>
              {onDelete && (
                <button
                  type="button"
                  onClick={() => onDelete(s)}
                  title="Remover matéria"
                  className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full p-1 shadow-md"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="flex gap-2">
        <input
          aria-label="Adicionar matéria"
          placeholder={placeholder}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleAdd}
          className="flex-1 px-4 py-2 bg-slate-800 border border-white/10 rounded-lg text-white focus:outline-none focus:border-emerald-500"
        />
        <button
          type="button"
          onClick={() => {
            const v = query.trim();
            if (!v) return;
            if (!subjects.includes(v)) onCreate?.(v);
            onChange(v);
            setQuery("");
          }}
          className="px-4 py-2 rounded-lg bg-emerald-500 text-slate-900 font-bold"
        >
          Criar
        </button>
      </div>
    </div>
  );
};

export default SubjectSelector;
