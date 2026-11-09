#!/usr/bin/env python3
"""
Gerador de questões em escala via Anthropic API.

Usa Claude para gerar questões originais (não copia de provas reais — questões
inspiradas no estilo das bancas, juridicamente defensáveis) com:
  - enunciado, opções, resposta, explicação, dica, dificuldade, fonte, ano
  - material_resumo, material_topicos, material_estrategia, material_referencias

Ele lê config de targets em `scripts/generation_targets.json` e gera lotes
incrementais. Você pode rodar várias vezes — ele pula o que já foi gerado.

USO:
    export ANTHROPIC_API_KEY="sk-ant-..."
    python3 scripts/generate_questions_ai.py
    python3 scripts/generate_questions_ai.py --target direito_administrativo
    python3 scripts/generate_questions_ai.py --batch-size 30 --concurrent 5

CUSTO ESTIMADO (Claude Sonnet 4.5/4.6, jan-2026):
  - ~2.000 tokens output por questão (com material_*)
  - 1k questões ≈ 2M tokens output ≈ US$ 30 ≈ R$ 150
  - 12k questões ≈ R$ 1.800 (rodar em batches noturnos)
"""

import os
import sys
import json
import asyncio
import argparse
from pathlib import Path
from datetime import datetime
from typing import Any

try:
    from anthropic import AsyncAnthropic
except ImportError:
    print("ERRO: anthropic não encontrado. Execute:")
    print("  pip3 install anthropic --break-system-packages")
    sys.exit(1)

try:
    import libsql_client
except ImportError:
    print("ERRO: libsql_client não encontrado. Execute:")
    print("  pip3 install libsql-client --break-system-packages")
    sys.exit(1)

SCRIPT_DIR = Path(__file__).parent
ROOT_DIR = SCRIPT_DIR.parent
GENERATED_DIR = SCRIPT_DIR / "generated_questions"
GENERATED_DIR.mkdir(exist_ok=True)
TARGETS_FILE = SCRIPT_DIR / "generation_targets.json"
PROGRESS_FILE = SCRIPT_DIR / "generation_progress.json"

MODEL = "claude-sonnet-4-6"  # rápido e barato para geração em massa
SYSTEM_PROMPT = """Você é especialista em concursos públicos brasileiros (CESPE/CEBRASPE, FCC, FGV, IBFC, Quadrix, Vunesp).

REGRAS RÍGIDAS:
1. Crie questões 100% ORIGINAIS, NUNCA copie textualmente de provas reais (direito autoral). Inspire-se no estilo da banca.
2. Cite jurisprudência STF/STJ/súmulas quando relevante (anos 2018-2024).
3. Use cenários práticos do contexto público (servidores, órgãos, processos).
4. Cada questão deve ter explicação didática (3-6 frases) e dica curta com mnemônico ou regra.

FORMATO DE SAÍDA: SEMPRE retorne APENAS um array JSON válido (nada antes/depois). Nada de texto extra, comentários, ou markdown."""


def load_env_local():
    """Lê .env.local se existir."""
    env_path = ROOT_DIR / ".env.local"
    if env_path.exists():
        with open(env_path) as f:
            for line in f:
                line = line.strip()
                if line and not line.startswith("#") and "=" in line:
                    k, _, v = line.partition("=")
                    k, v = k.strip(), v.strip().strip('"').strip("'")
                    if " #" in v:
                        v = v[: v.index(" #")].strip()
                    if k and v and k not in os.environ:
                        os.environ[k] = v


def build_prompt(disciplina: str, capitulo: str, count: int, dificuldade_mix: dict) -> str:
    return f"""Gere {count} questões originais de altíssima qualidade para concurso público brasileiro.

DISCIPLINA: {disciplina}
CAPÍTULO: {capitulo}

DISTRIBUIÇÃO DE DIFICULDADES:
- Fácil: {dificuldade_mix.get('facil', 40)}%
- Médio: {dificuldade_mix.get('medio', 40)}%
- Difícil: {dificuldade_mix.get('dificil', 20)}%

DISTRIBUIÇÃO DE TIPO:
- Múltipla escolha (5 alternativas A-E): 70%
- Verdadeiro/Falso (2 alternativas): 30%

ESTRUTURA EXIGIDA — array JSON onde cada item tem:
  - enunciado (string, 1-3 frases claras)
  - opcoes (array): para múltipla escolha ["A) ...", "B) ...", "C) ...", "D) ...", "E) ..."]; para V/F ["A) Verdadeiro", "B) Falso"]
  - resposta (string): "A", "B", "C", "D" ou "E"
  - explicacao (string, 3-6 frases didáticas)
  - dica (string, 1-2 frases curtas com mnemônico ou regra)
  - dificuldade (string): "fácil", "médio" ou "difícil"
  - fonte (string): "CESPE", "FCC", "FGV", "IBFC", "Quadrix" ou "Vunesp"
  - ano (number): 2020-2024
  - titulo (string): formato "BANCA/ÓRGÃO/ANO - Tópico" (ex: "CESPE/PF/2023 - Atos Administrativos")
  - material_resumo (string, 2-4 frases): conceito-chave que a questão testa
  - material_topicos (array de strings): 3-6 chips com palavras-chave
  - material_estrategia (string, 2-3 frases): como atacar esse tipo de questão na prova
  - material_referencias (array): [{{"title": "...", "type": "lei|doutrina|jurisprudencia", "author": "..."}}], 1-3 itens

Retorne APENAS o array JSON, sem texto adicional. Exemplo de UMA questão:

[
  {{
    "enunciado": "Sobre os atos administrativos...",
    "opcoes": ["A) ...", "B) ...", "C) ...", "D) ...", "E) ..."],
    "resposta": "B",
    "explicacao": "Os atos administrativos possuem...",
    "dica": "Atributos: PATI (Presunção, Auto-executoriedade, Tipicidade, Imperatividade).",
    "dificuldade": "médio",
    "fonte": "CESPE",
    "ano": 2023,
    "titulo": "CESPE/AGU/2023 - Atos Administrativos",
    "material_resumo": "Atos administrativos são manifestações unilaterais da administração...",
    "material_topicos": ["Atributos do ato", "Presunção de legitimidade", "Auto-executoriedade"],
    "material_estrategia": "CESPE testa muito a distinção entre auto-executoriedade e exigibilidade. Sempre lembrar...",
    "material_referencias": [
      {{"title": "Lei 9.784/1999 - Processo Administrativo", "type": "lei", "author": "Brasil"}},
      {{"title": "Manual de Direito Administrativo", "type": "doutrina", "author": "Carvalho Filho"}}
    ]
  }}
]"""


async def generate_batch(
    client: AsyncAnthropic,
    disciplina: str,
    capitulo: str,
    count: int,
    dificuldade_mix: dict,
) -> list[dict]:
    """Gera um lote de questões via Claude. Retorna lista de dicts."""
    prompt = build_prompt(disciplina, capitulo, count, dificuldade_mix)
    resp = await client.messages.create(
        model=MODEL,
        max_tokens=8192,
        system=SYSTEM_PROMPT,
        messages=[{"role": "user", "content": prompt}],
    )
    text = "".join(b.text for b in resp.content if hasattr(b, "text"))

    # Tenta isolar o array JSON (pode vir com texto antes/depois mesmo com instrução)
    start = text.find("[")
    end = text.rfind("]")
    if start == -1 or end == -1:
        raise ValueError(f"Resposta sem JSON array: {text[:200]}")
    json_str = text[start : end + 1]
    try:
        data = json.loads(json_str)
    except json.JSONDecodeError as e:
        raise ValueError(f"JSON inválido: {e}. Trecho: {json_str[:200]}")

    if not isinstance(data, list):
        raise ValueError("Resposta não é um array")
    return data


def load_progress() -> dict:
    if PROGRESS_FILE.exists():
        with open(PROGRESS_FILE) as f:
            return json.load(f)
    return {}


def save_progress(progress: dict) -> None:
    with open(PROGRESS_FILE, "w") as f:
        json.dump(progress, f, indent=2, ensure_ascii=False)


def save_generated(disciplina_slug: str, capitulo_slug: str, questions: list[dict]) -> Path:
    """Persiste o lote em JSON dentro de scripts/generated_questions/."""
    fname = f"{disciplina_slug}__{capitulo_slug}__{datetime.now().strftime('%Y%m%d-%H%M%S')}.json"
    path = GENERATED_DIR / fname
    with open(path, "w") as f:
        json.dump(
            {
                "disciplina": disciplina_slug,
                "capitulo": capitulo_slug,
                "questions": questions,
                "generated_at": datetime.now().isoformat(),
            },
            f,
            indent=2,
            ensure_ascii=False,
        )
    return path


def slugify(s: str) -> str:
    import re
    import unicodedata

    s = unicodedata.normalize("NFD", s).encode("ascii", "ignore").decode("ascii")
    s = re.sub(r"[^\w\s-]", "", s).strip().lower()
    return re.sub(r"[-\s]+", "-", s)


async def insert_into_turso(client: Any, questions: list[dict], disciplina: str, capitulo: str):
    """Insere lote no Turso (tabela questions). Cria capítulo se não existir."""
    now = datetime.now().isoformat()
    inserted = 0
    for q in questions:
        try:
            opcoes_json = json.dumps(q.get("opcoes", []), ensure_ascii=False)
            material_topicos = json.dumps(q.get("material_topicos", []), ensure_ascii=False)
            material_referencias = json.dumps(
                q.get("material_referencias", []), ensure_ascii=False
            )
            tipo = (
                "verdadeiro_falso"
                if len(q.get("opcoes", [])) == 2 and "Verdadeiro" in str(q["opcoes"])
                else "multipla_escolha"
            )
            await client.execute(
                """INSERT INTO questions
                   (titulo, disciplina, capitulo, tipo, enunciado, explicacao, dica,
                    opcoes, resposta_correta, dificuldade, fonte, ano,
                    material_resumo, material_topicos, material_estrategia, material_referencias,
                    criado_em, atualizado_em)
                   VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)""",
                [
                    q.get("titulo", f"{disciplina} - {capitulo}"),
                    disciplina,
                    capitulo,
                    tipo,
                    q.get("enunciado", ""),
                    q.get("explicacao", ""),
                    q.get("dica", ""),
                    opcoes_json,
                    q.get("resposta", "A").upper()[:1],
                    q.get("dificuldade", "médio"),
                    q.get("fonte", ""),
                    q.get("ano"),
                    q.get("material_resumo"),
                    material_topicos,
                    q.get("material_estrategia"),
                    material_referencias,
                    now,
                    now,
                ],
            )
            inserted += 1
        except Exception as e:
            print(f"    ! erro ao inserir questão: {e}")
    return inserted


async def main():
    parser = argparse.ArgumentParser()
    parser.add_argument(
        "--targets",
        default=str(TARGETS_FILE),
        help="Arquivo JSON com targets de geração (default: scripts/generation_targets.json)",
    )
    parser.add_argument("--target", help="Só processa um disciplina específico (slug)")
    parser.add_argument(
        "--batch-size", type=int, default=15, help="Questões por chamada à API (max 20)"
    )
    parser.add_argument(
        "--concurrent", type=int, default=3, help="Chamadas paralelas à API (cuidado com rate limit)"
    )
    parser.add_argument(
        "--dry-run", action="store_true", help="Não insere no Turso — só salva JSON local"
    )
    parser.add_argument(
        "--no-insert", action="store_true", help="Pula a etapa de inserção no Turso"
    )
    args = parser.parse_args()

    load_env_local()

    api_key = os.getenv("ANTHROPIC_API_KEY")
    if not api_key:
        print("ERRO: ANTHROPIC_API_KEY não definida")
        print("Configure em .env.local ou exporte: export ANTHROPIC_API_KEY=sk-ant-...")
        sys.exit(1)

    if not Path(args.targets).exists():
        print(f"ERRO: arquivo de targets não encontrado: {args.targets}")
        print("Crie um JSON com a estrutura: {disciplina: {capitulo: target_count}}")
        sys.exit(1)

    with open(args.targets) as f:
        targets = json.load(f)

    if args.target:
        targets = {args.target: targets[args.target]} if args.target in targets else {}

    progress = load_progress()
    anthropic_client = AsyncAnthropic(api_key=api_key)

    # Turso
    turso_client = None
    if not args.dry_run and not args.no_insert:
        db_url = os.getenv("TURSO_DATABASE_URL", "")
        auth_token = os.getenv("TURSO_AUTH_TOKEN", "")
        if not db_url:
            print("AVISO: TURSO_DATABASE_URL não definida — só salvarei JSON local")
        else:
            url = db_url.replace("libsql://", "https://", 1) if db_url.startswith("libsql://") else db_url
            turso_client = libsql_client.create_client(url=url, auth_token=auth_token or None)

    print("=" * 70)
    print(f"  GERADOR DE QUESTÕES — Foco Federal")
    print(f"  Modelo: {MODEL}")
    print(f"  Targets: {sum(sum(c.values()) for c in targets.values())} questões")
    print("=" * 70)

    total_generated = 0
    total_inserted = 0

    for disciplina, capitulos in targets.items():
        print(f"\n📚 {disciplina}")
        for capitulo, target_count in capitulos.items():
            done = progress.get(disciplina, {}).get(capitulo, 0)
            remaining = max(0, target_count - done)
            if remaining == 0:
                print(f"  ✓ {capitulo}: {done}/{target_count} já geradas")
                continue
            print(f"  → {capitulo}: gerando {remaining} (já existem {done})")

            # divide em lotes
            batches_needed = (remaining + args.batch_size - 1) // args.batch_size
            sem = asyncio.Semaphore(args.concurrent)

            async def gen_one_batch(idx: int):
                async with sem:
                    count = min(args.batch_size, remaining - idx * args.batch_size)
                    if count <= 0:
                        return []
                    print(f"      [{idx+1}/{batches_needed}] gerando {count}...")
                    try:
                        return await generate_batch(
                            anthropic_client,
                            disciplina,
                            capitulo,
                            count,
                            {"facil": 40, "medio": 40, "dificil": 20},
                        )
                    except Exception as e:
                        print(f"      ! falhou: {e}")
                        return []

            results = await asyncio.gather(*[gen_one_batch(i) for i in range(batches_needed)])
            all_qs = [q for batch in results for q in batch]

            if all_qs:
                save_generated(slugify(disciplina), slugify(capitulo), all_qs)
                total_generated += len(all_qs)

                if turso_client:
                    inserted = await insert_into_turso(turso_client, all_qs, disciplina, capitulo)
                    total_inserted += inserted
                    print(f"      ✓ {len(all_qs)} geradas | {inserted} inseridas no Turso")
                else:
                    print(f"      ✓ {len(all_qs)} geradas | salvas em JSON")

                progress.setdefault(disciplina, {})[capitulo] = done + len(all_qs)
                save_progress(progress)

    if turso_client:
        await turso_client.close()

    print("\n" + "=" * 70)
    print(f"  ✓ Total geradas: {total_generated}")
    if not args.dry_run and not args.no_insert:
        print(f"  ✓ Total inseridas no Turso: {total_inserted}")
    print(f"  Progresso salvo em: {PROGRESS_FILE}")
    print("=" * 70)


if __name__ == "__main__":
    asyncio.run(main())
