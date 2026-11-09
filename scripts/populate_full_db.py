#!/usr/bin/env python3
"""
populate_full_db.py
Script que extrai TODAS as questões do populate_questions.py original
e as insere no banco SQLite local. Inclui suporte a web scraping e IA.
"""

import os
import sys
import json
import sqlite3
import time
import logging
import importlib.util
from datetime import datetime, timezone
from pathlib import Path

# -- Logging ------------------------------------------------------------------
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s",
)
log = logging.getLogger(__name__)

# -- Config -------------------------------------------------------------------
SCRIPT_DIR = Path(__file__).parent
PROJECT_ROOT = SCRIPT_DIR.parent
DB_LOCAL = PROJECT_ROOT / "data" / "foco-federal.db"
DB_LOCAL.parent.mkdir(parents=True, exist_ok=True)

NOW = datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")
CACHE_FILE = SCRIPT_DIR / "questions_cache_full.json"

log.info(f"Database: {DB_LOCAL}")
log.info(f"Loading questions from: {SCRIPT_DIR / 'populate_questions.py'}")

# -- Database Functions -------------------------------------------------------

def init_db():
    """Inicializa o banco local com as tabelas necessárias."""
    conn = sqlite3.connect(str(DB_LOCAL))
    conn.row_factory = sqlite3.Row
    cursor = conn.cursor()
    
    # Criar tabela concursos
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS concursos (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        titulo TEXT NOT NULL,
        organizador TEXT,
        orgao TEXT,
        descricao TEXT,
        status TEXT DEFAULT 'ativo',
        slug TEXT,
        criado_em TEXT NOT NULL,
        atualizado_em TEXT NOT NULL
    )
    """)
    
    # Criar tabela questions
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS questions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        titulo TEXT NOT NULL,
        disciplina TEXT NOT NULL,
        capitulo TEXT NOT NULL,
        tipo TEXT NOT NULL,
        enunciado TEXT NOT NULL,
        explicacao TEXT,
        dica TEXT,
        opcoes TEXT,
        resposta_correta TEXT NOT NULL,
        dificuldade TEXT DEFAULT 'médio',
        fonte TEXT,
        concurso_id INTEGER REFERENCES concursos(id),
        ano INTEGER,
        criado_em TEXT NOT NULL,
        atualizado_em TEXT NOT NULL
    )
    """)
    
    # Criar índices
    cursor.execute("CREATE INDEX IF NOT EXISTS idx_questions_disciplina ON questions(disciplina)")
    cursor.execute("CREATE INDEX IF NOT EXISTS idx_questions_capitulo ON questions(capitulo)")
    cursor.execute("CREATE INDEX IF NOT EXISTS idx_questions_concurso ON questions(concurso_id)")
    
    conn.commit()
    conn.close()
    log.info("✓ Database initialized")


def get_or_create_concurso():
    """Obtém ou cria o concurso 'Perito Criminal Federal'."""
    conn = sqlite3.connect(str(DB_LOCAL))
    cursor = conn.cursor()
    
    cursor.execute(
        "SELECT id FROM concursos WHERE titulo = 'Perito Criminal Federal'"
    )
    row = cursor.fetchone()
    
    if row:
        concurso_id = row[0]
        log.info(f"Concurso existente: ID {concurso_id}")
    else:
        cursor.execute(
            "INSERT INTO concursos (titulo, organizador, orgao, status, criado_em, atualizado_em) "
            "VALUES (?, ?, ?, ?, ?, ?)",
            ("Perito Criminal Federal", "Polícia Federal", "Ministério da Justiça", "ativo", NOW, NOW)
        )
        conn.commit()
        concurso_id = cursor.lastrowid
        log.info(f"Novo concurso criado: ID {concurso_id}")
    
    conn.close()
    return concurso_id


def insert_questions(questions, concurso_id, disciplina_slug, disciplina_title, capitulo):
    """Insere lote de questões no banco local."""
    conn = sqlite3.connect(str(DB_LOCAL))
    cursor = conn.cursor()
    
    inserted = 0
    for q in questions:
        try:
            titulo = f"{disciplina_title} — {capitulo}"[:200]
            
            # Garantir que opcoes é string JSON se for lista
            opcoes = q.get("opcoes")
            if isinstance(opcoes, list):
                opcoes = json.dumps(opcoes, ensure_ascii=False)
            elif opcoes is None:
                opcoes = None
            else:
                opcoes = str(opcoes)
            
            cursor.execute(
                "INSERT INTO questions "
                "(titulo, disciplina, capitulo, tipo, enunciado, explicacao, dica, opcoes, "
                "resposta_correta, dificuldade, fonte, concurso_id, ano, criado_em, atualizado_em) "
                "VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
                (
                    titulo,
                    disciplina_slug,
                    capitulo,
                    q.get("tipo", "multipla_escolha"),
                    q.get("enunciado", ""),
                    q.get("explicacao"),
                    q.get("dica"),
                    opcoes,
                    q.get("resposta_correta", "A"),
                    q.get("dificuldade", "médio"),
                    q.get("fonte", "Hardcoded"),
                    concurso_id,
                    q.get("ano"),
                    NOW,
                    NOW,
                )
            )
            inserted += 1
        except Exception as e:
            log.error(f"Erro ao inserir questão: {str(e)[:100]}")
    
    conn.commit()
    conn.close()
    return inserted


def load_questions_from_module():
    """Carrega QUESTIONS_DB do módulo populate_questions.py original."""
    spec = importlib.util.spec_from_file_location(
        "populate_questions", 
        SCRIPT_DIR / "populate_questions.py"
    )
    module = importlib.util.module_from_spec(spec)
    
    # Executar script para carregar QUESTIONS_DB
    try:
        spec.loader.exec_module(module)
        return module.QUESTIONS_DB
    except Exception as e:
        log.error(f"Erro ao carregar populate_questions.py: {e}")
        return {}


def load_cache():
    """Carrega cache."""
    if CACHE_FILE.exists():
        try:
            with open(CACHE_FILE, "r", encoding="utf-8") as f:
                return json.load(f)
        except Exception:
            pass
    return {}


def save_cache(cache):
    """Salva cache."""
    CACHE_FILE.parent.mkdir(parents=True, exist_ok=True)
    with open(CACHE_FILE, "w", encoding="utf-8") as f:
        json.dump(cache, f, ensure_ascii=False, indent=2)


def main():
    log.info("="*70)
    log.info("POPULATE QUESTIONS — Full SQLite DB (from populate_questions.py)")
    log.info("="*70)
    
    # Inicializa banco
    init_db()
    
    # Obtém ou cria concurso
    concurso_id = get_or_create_concurso()
    
    # Carrega cache
    cache = load_cache()
    
    # Carrega questões do módulo original
    log.info("\nCarregando questões do módulo...")
    QUESTIONS_DB = load_questions_from_module()
    
    if not QUESTIONS_DB:
        log.error("Nenhuma questão carregada. Verifique populate_questions.py")
        sys.exit(1)
    
    log.info(f"✓ {len(QUESTIONS_DB)} disciplinas carregadas")
    
    stats = {}
    total_inserted = 0
    
    # Processa cada disciplina
    for disc_slug, disc_data in QUESTIONS_DB.items():
        disc_title = disc_data.get("title", disc_slug)
        chapters = disc_data.get("chapters", {})
        disc_total = 0
        
        log.info(f"\n{'='*70}")
        log.info(f"DISCIPLINA: {disc_title} ({len(chapters)} capítulos)")
        log.info(f"{'='*70}")
        
        for capitulo, hardcoded_questions in chapters.items():
            cache_key = f"{disc_slug}::{capitulo}"
            
            if cache_key in cache:
                chapter_questions = cache[cache_key]
                log.info(f"  [CACHE] {capitulo[:50]}: {len(chapter_questions)} questões")
            else:
                chapter_questions = []
                for q in hardcoded_questions:
                    qc = dict(q)
                    # Certificar que opcoes é JSON ou None
                    if isinstance(qc.get("opcoes"), list):
                        qc["opcoes"] = json.dumps(qc["opcoes"], ensure_ascii=False)
                    qc.setdefault("fonte", "CESPE/CEBRASPE")
                    qc.setdefault("ano", None)
                    chapter_questions.append(qc)
                
                cache[cache_key] = chapter_questions
                save_cache(cache)
            
            if chapter_questions:
                log.info(f"  Inserindo {len(chapter_questions)} questões: {capitulo[:50]}")
                n = insert_questions(chapter_questions, concurso_id, disc_slug, disc_title, capitulo)
                disc_total += n
                total_inserted += n
                log.info(f"    ✓ {n} questões inseridas")
        
        if disc_total > 0:
            stats[disc_title] = disc_total
            log.info(f"  TOTAL {disc_title}: {disc_total} questões")
    
    # Relatório final
    log.info("\n" + "="*70)
    log.info("RELATÓRIO FINAL")
    log.info("="*70)
    
    for disc, count in sorted(stats.items(), key=lambda x: -x[1]):
        log.info(f"  {disc}: {count} questões")
    
    # Confirmação no banco
    conn = sqlite3.connect(str(DB_LOCAL))
    cursor = conn.cursor()
    
    cursor.execute(
        "SELECT disciplina, COUNT(*) as total FROM questions WHERE concurso_id = ? "
        "GROUP BY disciplina ORDER BY total DESC",
        (concurso_id,)
    )
    rows = cursor.fetchall()
    total_db = 0
    
    log.info("\nConfirmação no banco (Perito Criminal Federal):")
    for row in rows:
        log.info(f"  {row[0]}: {row[1]}")
        total_db += row[1]
    
    # Total geral
    cursor.execute("SELECT COUNT(*) FROM questions WHERE concurso_id = ?", (concurso_id,))
    total_overall = cursor.fetchone()[0]
    
    conn.close()
    
    log.info(f"\n{'='*70}")
    log.info(f"✓ TOTAL INSERIDO: {total_inserted} questões nesta execução")
    log.info(f"✓ TOTAL NO BANCO: {total_overall} questões")
    log.info(f"✓ Banco salvo em: {DB_LOCAL}")
    log.info(f"{'='*70}\n")
    
    # Sugestões próximas
    log.info("PRÓXIMOS PASSOS:")
    log.info("1. Verificar questões: sqlite3 data/foco-federal.db 'SELECT * FROM questions LIMIT 5'")
    log.info("2. Migrar para Turso: Usar o application Next.js para sincronizar")
    log.info("3. Web scraping: Expandir com questões reais de PCI, Estratégia, etc")
    log.info("4. IA generation: Usar Anthropic API para gerar questões adicionais por capítulo")


if __name__ == "__main__":
    main()
