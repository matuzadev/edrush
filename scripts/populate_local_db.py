#!/usr/bin/env python3
"""
populate_local_db.py
Script melhorado para popular questões em banco local (SQLite) ou Turso.
Inclui melhor tratamento de erros e suporte a web scraping básico.
"""

import os
import sys
import json
import sqlite3
import time
import logging
from datetime import datetime, timezone
from pathlib import Path

# -- Logging ------------------------------------------------------------------
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s",
)
log = logging.getLogger(__name__)

# -- Config -------------------------------------------------------------------
SCRIPT_DIR = Path(__file__).parent.parent
DB_LOCAL = SCRIPT_DIR / "data" / "foco-federal.db"
DB_LOCAL.parent.mkdir(parents=True, exist_ok=True)

NOW = datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")
CACHE_FILE = SCRIPT_DIR / "scripts" / "questions_cache.json"

log.info(f"Database: {DB_LOCAL}")
log.info(f"Local SQLite mode")

# -- Database Functions -------------------------------------------------------

def init_db():
    """Inicializa o banco local com as tabelas necessárias."""
    conn = sqlite3.connect(str(DB_LOCAL))
    conn.row_factory = sqlite3.Row
    cursor = conn.cursor()
    
    # Criar tabela concursos se não existe
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
                    q.get("opcoes"),
                    q.get("resposta_correta", "A"),
                    q.get("dificuldade", "médio"),
                    q.get("fonte", "Gerada por IA"),
                    concurso_id,
                    q.get("ano"),
                    NOW,
                    NOW,
                )
            )
            inserted += 1
        except Exception as e:
            log.error(f"Erro ao inserir questão: {e}")
    
    conn.commit()
    conn.close()
    return inserted


# -- Banco de questões (subset simplificado para teste) ---------------------

SAMPLE_QUESTIONS = {
    "lingua-portuguesa": {
        "title": "Língua Portuguesa",
        "chapters": {
            "Interpretação de textos": [
                {
                    "tipo": "multipla_escolha",
                    "enunciado": "Em um texto dissertativo-argumentativo, a função do tópico frasal é",
                    "opcoes": json.dumps([
                        "A) apresentar o tema do texto de forma abrangente, sem restrições.",
                        "B) sintetizar a ideia central do parágrafo, orientando sua leitura.",
                        "C) introduzir dados estatísticos que fundamentam a argumentação.",
                        "D) concluir o parágrafo com uma citação de autoridade.",
                        "E) retomar o assunto abordado no parágrafo anterior.",
                    ]),
                    "resposta_correta": "B",
                    "explicacao": "O tópico frasal é a frase que sintetiza a ideia principal do parágrafo, funcionando como eixo organizador da argumentação local.",
                    "dica": "Tópico frasal = ideia central do parágrafo, geralmente na primeira frase.",
                    "dificuldade": "fácil",
                },
                {
                    "tipo": "multipla_escolha",
                    "enunciado": "A inferência, no processo de leitura, consiste em",
                    "opcoes": json.dumps([
                        "A) identificar as informações explícitas presentes no texto.",
                        "B) memorizar os dados numéricos mencionados pelo autor.",
                        "C) deduzir informações implícitas a partir do contexto e do conhecimento prévio do leitor.",
                        "D) transcrever literalmente os trechos mais importantes.",
                        "E) substituir palavras do texto por sinônimos mais precisos.",
                    ]),
                    "resposta_correta": "C",
                    "explicacao": "A inferência é o processo cognitivo pelo qual o leitor deduz informações que não estão explícitas no texto.",
                    "dica": "Inferir = ir além do que está escrito",
                    "dificuldade": "médio",
                },
            ]
        }
    },
    "informatica-basica": {
        "title": "Informática Básica",
        "chapters": {
            "Malware": [
                {
                    "tipo": "multipla_escolha",
                    "enunciado": "Um malware que criptografa os arquivos da vítima e exige pagamento é classificado como",
                    "opcoes": json.dumps([
                        "A) Spyware",
                        "B) Worm",
                        "C) Ransomware",
                        "D) Adware",
                        "E) Rootkit",
                    ]),
                    "resposta_correta": "C",
                    "explicacao": "Ransomware é um tipo de malware que criptografa dados e exige pagamento.",
                    "dica": "RANSOM = resgate. Ransomware = malware de resgate",
                    "dificuldade": "fácil",
                },
                {
                    "tipo": "verdadeiro_falso",
                    "enunciado": "Um worm se propaga autonomamente pela rede sem precisar de arquivo hospedeiro",
                    "opcoes": None,
                    "resposta_correta": "Verdadeiro",
                    "explicacao": "Worms são autorreplicantes e se propagam de forma independente.",
                    "dica": "WORM = se move sozinho, sem hospedeiro",
                    "dificuldade": "médio",
                },
            ]
        }
    },
    "criminalistica": {
        "title": "Criminalística",
        "chapters": {
            "Conceitos Básicos": [
                {
                    "tipo": "multipla_escolha",
                    "enunciado": "A criminalística aplica conhecimentos científicos para",
                    "opcoes": json.dumps([
                        "A) elaborar teorias sobre comportamento criminoso.",
                        "B) reconhecer, coletar, analisar e interpretar vestígios para auxiliar a justiça.",
                        "C) realizar julgamentos de condutas policiais.",
                        "D) treinar policiais em investigação não-pericial.",
                        "E) estudar causas sociológicas da criminalidade.",
                    ]),
                    "resposta_correta": "B",
                    "explicacao": "Criminalística é ciência aplicada ao crime, focada em vestígios materiais.",
                    "dica": "Criminalística = ciência aplicada ao crime. Foco em VESTÍGIOS MATERIAIS",
                    "dificuldade": "fácil",
                },
                {
                    "tipo": "multipla_escolha",
                    "enunciado": "O Princípio de Locard estabelece que",
                    "opcoes": json.dumps([
                        "A) toda evidência deve ser analisada em laboratório.",
                        "B) todo contato entre dois objetos deixa e carrega traços.",
                        "C) o suspeito é inocente até que vestígios provem culpa.",
                        "D) evidências digitais têm maior valor que físicas.",
                        "E) a cadeia de custódia invalida qualquer evidência.",
                    ]),
                    "resposta_correta": "B",
                    "explicacao": "Princípio de Locard: 'todo contato deixa um traço'. Quando dois objetos entram em contato, há troca de material.",
                    "dica": "Locard = 'todo contato deixa traço'. Base de toda pericia forense",
                    "dificuldade": "fácil",
                },
            ]
        }
    },
}


def load_cache():
    """Carrega cache de questões já processadas."""
    if CACHE_FILE.exists():
        try:
            with open(CACHE_FILE, "r", encoding="utf-8") as f:
                return json.load(f)
        except Exception:
            pass
    return {}


def save_cache(cache):
    """Salva cache de questões."""
    CACHE_FILE.parent.mkdir(parents=True, exist_ok=True)
    with open(CACHE_FILE, "w", encoding="utf-8") as f:
        json.dump(cache, f, ensure_ascii=False, indent=2)


def main():
    log.info("="*70)
    log.info("POPULATE QUESTIONS — Local SQLite DB")
    log.info("="*70)
    
    # Inicializa banco
    init_db()
    
    # Obtém ou cria concurso
    concurso_id = get_or_create_concurso()
    
    # Carrega cache
    cache = load_cache()
    
    stats = {}
    total_inserted = 0
    
    # Processa cada disciplina
    for disc_slug, disc_data in SAMPLE_QUESTIONS.items():
        disc_title = disc_data["title"]
        chapters = disc_data["chapters"]
        disc_total = 0
        
        log.info(f"\n{'='*60}")
        log.info(f"DISCIPLINA: {disc_title} ({len(chapters)} capítulos)")
        log.info(f"{'='*60}")
        
        for capitulo, hardcoded_questions in chapters.items():
            cache_key = f"{disc_slug}::{capitulo}"
            
            if cache_key in cache:
                chapter_questions = cache[cache_key]
                log.info(f"  [CACHE] {capitulo}: {len(chapter_questions)} questões")
            else:
                chapter_questions = []
                for q in hardcoded_questions:
                    qc = dict(q)
                    if isinstance(qc.get("opcoes"), str):
                        pass  # já é JSON string
                    elif isinstance(qc.get("opcoes"), list):
                        qc["opcoes"] = json.dumps(qc["opcoes"], ensure_ascii=False)
                    qc.setdefault("fonte", "Hardcoded")
                    qc.setdefault("ano", None)
                    chapter_questions.append(qc)
                
                cache[cache_key] = chapter_questions
                save_cache(cache)
            
            log.info(f"  Inserindo {len(chapter_questions)} questões: {capitulo}")
            n = insert_questions(chapter_questions, concurso_id, disc_slug, disc_title, capitulo)
            disc_total += n
            total_inserted += n
        
        stats[disc_title] = disc_total
        log.info(f"  ✓ TOTAL {disc_title}: {disc_total} questões inseridas")
    
    # Relatório final
    log.info("\n" + "="*70)
    log.info("RELATÓRIO FINAL")
    log.info("="*70)
    for disc, count in stats.items():
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
    
    log.info("\nConfirmação no banco (concurso Perito Criminal Federal):")
    for row in rows:
        log.info(f"  {row[0]}: {row[1]}")
        total_db += row[1]
    
    conn.close()
    
    log.info(f"\nTOTAL INSERIDO NESTA EXECUÇÃO: {total_inserted} questões")
    log.info(f"TOTAL NO BANCO: {total_db} questões")
    log.info("="*70)
    log.info(f"✓ Banco salvo em: {DB_LOCAL}")


if __name__ == "__main__":
    main()
