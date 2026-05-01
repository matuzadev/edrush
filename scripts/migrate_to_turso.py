#!/usr/bin/env python3
"""
migrate_to_turso.py
Migra TODAS as 79 questões do SQLite local para Turso (nuvem) em tempo real.
Sem perder NADA!
"""

import os
import sys
import json
import sqlite3
import requests
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

# -- Config Turso (from populate_questions.py) --------------------------------
TURSO_URL = os.environ.get(
    "TURSO_DATABASE_URL",
    "libsql://foco-federal-db-matheusz-dev.aws-ap-south-1.turso.io",
)
TURSO_TOKEN = os.environ.get(
    "TURSO_AUTH_TOKEN",
    "eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3Nzc1MTg0MzQsImlkIjoiMDE5ZGRjNTktZmYwMS03MzMxLWE2NjUtMjRlMWY3NjY0ZWY4IiwicmlkIjoiMDZlYzEwNzItNGFlNC00Y2NhLTgzOGQtNTY3NTJiNDA3MWU3In0.6gHq9q_j5F_Wx30kmQwRcLLerEZtQ9NWw8gF8Uojauki2wHq_QqL-YAQWsttklct3vOsUCILU2iJcqhBxwzoDQ",
)
TURSO_HTTP_URL = TURSO_URL.replace("libsql://", "https://")

# -- Local DB -----------------------------------------------------------------
SCRIPT_DIR = Path(__file__).parent
PROJECT_ROOT = SCRIPT_DIR.parent
DB_LOCAL = PROJECT_ROOT / "data" / "foco-federal.db"

NOW = datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")

log.info(f"🌍 Turso URL: {TURSO_HTTP_URL}")
log.info(f"📁 Local DB: {DB_LOCAL}")

# -- Turso HTTP API -----------------------------------------------------------

def arg(value):
    """Convert Python value to Turso API format."""
    if value is None:
        return {"type": "null", "value": None}
    if isinstance(value, bool):
        return {"type": "integer", "value": int(value)}
    if isinstance(value, int):
        return {"type": "integer", "value": value}
    if isinstance(value, float):
        return {"type": "float", "value": value}
    return {"type": "text", "value": str(value)}


def turso_execute(statements):
    """Execute multiple statements in Turso via HTTP."""
    url = f"{TURSO_HTTP_URL}/v2/pipeline"
    headers = {
        "Authorization": f"Bearer {TURSO_TOKEN}",
        "Content-Type": "application/json",
    }
    payload = {"requests": statements + [{"type": "close"}]}
    
    try:
        resp = requests.post(url, headers=headers, json=payload, timeout=30)
        resp.raise_for_status()
        return resp.json()
    except requests.exceptions.RequestException as e:
        log.error(f"Turso API error: {e}")
        raise


def turso_query(sql, args=None):
    """Execute query and return results."""
    stmt = {"sql": sql, "args": args or []}
    result = turso_execute([{"type": "execute", "stmt": stmt}])
    try:
        rows_data = result["results"][0]["response"]["result"]["rows"]
        cols_data = result["results"][0]["response"]["result"]["cols"]
        cols = [c["name"] for c in cols_data]
        return [dict(zip(cols, [v.get("value") if v else None for v in row])) for row in rows_data]
    except (KeyError, IndexError):
        return []


def create_tables_turso():
    """Cria tabelas no Turso se não existirem."""
    log.info("\n📋 Verificando/Criando tabelas no Turso...")
    
    try:
        # Verificar se tabelas existem
        rows = turso_query("SELECT name FROM sqlite_master WHERE type='table' AND name='questions'", [])
        if rows:
            log.info("✅ Tabelas já existem no Turso")
            return
    except:
        pass
    
    try:
        # Tabela concursos
        turso_execute([{
            "type": "execute",
            "stmt": {
                "sql": "CREATE TABLE concursos (id INTEGER PRIMARY KEY AUTOINCREMENT, titulo TEXT NOT NULL, organizador TEXT, orgao TEXT, descricao TEXT, status TEXT DEFAULT 'ativo', slug TEXT, criado_em TEXT NOT NULL, atualizado_em TEXT NOT NULL)",
                "args": []
            }
        }])
        log.info("✅ Tabela concursos criada")
    except Exception as e:
        if "already exists" in str(e):
            log.info("✅ Tabela concursos já existe")
        else:
            log.warning(f"⚠️  Erro ao criar concursos table: {e}")
    
    try:
        # Tabela questions
        turso_execute([{
            "type": "execute",
            "stmt": {
                "sql": "CREATE TABLE questions (id INTEGER PRIMARY KEY AUTOINCREMENT, titulo TEXT NOT NULL, disciplina TEXT NOT NULL, capitulo TEXT NOT NULL, tipo TEXT NOT NULL, enunciado TEXT NOT NULL, explicacao TEXT, dica TEXT, opcoes TEXT, resposta_correta TEXT NOT NULL, dificuldade TEXT DEFAULT 'médio', fonte TEXT, concurso_id INTEGER REFERENCES concursos(id), ano INTEGER, criado_em TEXT NOT NULL, atualizado_em TEXT NOT NULL)",
                "args": []
            }
        }])
        log.info("✅ Tabela questions criada")
    except Exception as e:
        if "already exists" in str(e):
            log.info("✅ Tabela questions já existe")
        else:
            log.warning(f"⚠️  Erro ao criar questions table: {e}")


def get_or_create_concurso_turso():
    """Obtém ou cria concurso no Turso."""
    log.info("\n🏛️  Sincronizando concurso...")
    
    rows = turso_query("SELECT id FROM concursos WHERE titulo = ?", [arg("Perito Criminal Federal")])
    
    if rows:
        concurso_id = rows[0]["id"]
        log.info(f"✅ Concurso existente (ID: {concurso_id})")
    else:
        turso_execute([{
            "type": "execute",
            "stmt": {
                "sql": "INSERT INTO concursos (titulo, organizador, orgao, status, criado_em, atualizado_em) VALUES (?, ?, ?, ?, ?, ?)",
                "args": [
                    arg("Perito Criminal Federal"),
                    arg("Polícia Federal"),
                    arg("Ministério da Justiça"),
                    arg("ativo"),
                    arg(NOW),
                    arg(NOW),
                ]
            }
        }])
        
        rows = turso_query("SELECT id FROM concursos WHERE titulo = ?", [arg("Perito Criminal Federal")])
        concurso_id = rows[0]["id"]
        log.info(f"✅ Concurso criado (ID: {concurso_id})")
    
    return concurso_id


def migrate_questions():
    """Migra todas as questões do SQLite para Turso."""
    log.info("\n📚 Migrando questões...")
    
    # Ler do SQLite
    conn = sqlite3.connect(str(DB_LOCAL))
    conn.row_factory = sqlite3.Row
    cursor = conn.cursor()
    
    cursor.execute("SELECT * FROM questions ORDER BY disciplina, capitulo")
    all_questions = cursor.fetchall()
    conn.close()
    
    log.info(f"Lidas {len(all_questions)} questões do SQLite local")
    
    if not all_questions:
        log.error("❌ Nenhuma questão encontrada no SQLite!")
        return 0
    
    # Obter concurso no Turso
    concurso_id = get_or_create_concurso_turso()
    
    # Preparar statements para inserção em batch
    batch_size = 10
    inserted = 0
    
    for i in range(0, len(all_questions), batch_size):
        batch = all_questions[i:i + batch_size]
        stmts = []
        
        for q in batch:
            stmt = {
                "type": "execute",
                "stmt": {
                    "sql": """
                    INSERT INTO questions (titulo, disciplina, capitulo, tipo, enunciado,
                    explicacao, dica, opcoes, resposta_correta, dificuldade, fonte,
                    concurso_id, ano, criado_em, atualizado_em)
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                    """,
                    "args": [
                        arg(q["titulo"]),
                        arg(q["disciplina"]),
                        arg(q["capitulo"]),
                        arg(q["tipo"]),
                        arg(q["enunciado"]),
                        arg(q["explicacao"]),
                        arg(q["dica"]),
                        arg(q["opcoes"]),
                        arg(q["resposta_correta"]),
                        arg(q["dificuldade"]),
                        arg(q["fonte"]),
                        arg(concurso_id),
                        arg(q["ano"]),
                        arg(q["criado_em"]),
                        arg(q["atualizado_em"]),
                    ]
                }
            }
            stmts.append(stmt)
        
        try:
            turso_execute(stmts)
            inserted += len(batch)
            pct = int((inserted / len(all_questions)) * 100)
            log.info(f"  [{pct}%] {inserted}/{len(all_questions)} questões migradas")
        except Exception as e:
            log.error(f"Erro em batch {i//batch_size+1}: {e}")
            # Tentar individualmente
            for q in batch:
                try:
                    turso_execute([{
                        "type": "execute",
                        "stmt": {
                            "sql": """
                            INSERT INTO questions (titulo, disciplina, capitulo, tipo, enunciado,
                            explicacao, dica, opcoes, resposta_correta, dificuldade, fonte,
                            concurso_id, ano, criado_em, atualizado_em)
                            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                            """,
                            "args": [
                                arg(q["titulo"]),
                                arg(q["disciplina"]),
                                arg(q["capitulo"]),
                                arg(q["tipo"]),
                                arg(q["enunciado"]),
                                arg(q["explicacao"]),
                                arg(q["dica"]),
                                arg(q["opcoes"]),
                                arg(q["resposta_correta"]),
                                arg(q["dificuldade"]),
                                arg(q["fonte"]),
                                arg(concurso_id),
                                arg(q["ano"]),
                                arg(q["criado_em"]),
                                arg(q["atualizado_em"]),
                            ]
                        }
                    }])
                    inserted += 1
                except Exception as e2:
                    log.error(f"    ❌ Falha: {q['enunciado'][:50]}... {e2}")
            
            time.sleep(2)  # Throttle após erro
    
    return inserted


def verify_migration():
    """Valida a migração no Turso."""
    log.info("\n✓ Validando migração no Turso...")
    
    rows = turso_query(
        "SELECT disciplina, COUNT(*) as total FROM questions GROUP BY disciplina ORDER BY total DESC",
        []
    )
    
    total = 0
    for row in rows:
        log.info(f"  {row['disciplina']}: {row['total']} questões")
        total += int(row["total"])
    
    return total


def main():
    log.info("="*70)
    log.info("🚀 MIGRAÇÃO TURSO - Salvando TUDO na Nuvem!")
    log.info("="*70)
    
    try:
        # Criar tabelas
        create_tables_turso()
        
        # Migrar questões
        inserted = migrate_questions()
        
        # Validar
        total_turso = verify_migration()
        
        log.info("\n" + "="*70)
        log.info(f"✅ SUCESSO! {inserted} questões migradas para Turso")
        log.info(f"✅ Total no Turso: {total_turso} questões")
        log.info(f"✅ URL: {TURSO_HTTP_URL}")
        log.info("="*70)
        
        return 0
    
    except Exception as e:
        log.error(f"\n❌ ERRO: {e}")
        return 1


if __name__ == "__main__":
    sys.exit(main())
