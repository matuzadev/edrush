#!/usr/bin/env python3
"""
Script MASSIVO de população do banco Foco Federal
Insere 10.000+ questões com enunciados completos, explicações detalhadas e dicas

Disciplinas:
- Português (avançado)
- Direito Penal (existente, mantido)
- Redes de Computadores (existente, mantido)
- Informática Básica (existente, mantido)
- Direito Constitucional (NOVO)
- Direito Administrativo (NOVO)
- Raciocínio Lógico (NOVO)
- Matemática (NOVO)
- Administração Pública (NOVO)
- Atualidades (NOVO)

Uso:
  TURSO_DATABASE_URL=libsql://... TURSO_AUTH_TOKEN=... python3 scripts/populate_massive.py

  Ou com arquivo .env.local:
  python3 scripts/populate_massive.py
"""

import os
import sys
import json
import asyncio
from datetime import datetime
from pathlib import Path

# Adicionar o diretório do script ao path para importar os módulos de questões
script_dir = Path(__file__).parent
sys.path.insert(0, str(script_dir))

# Importar os módulos de questões — auto-discovery dos novos módulos gerados
import importlib

QUESTION_MODULE_NAMES = [
    # Originais
    'direito_constitucional',
    'direito_administrativo',
    'raciocinio_logico',
    'matematica',
    'administracao_publica',
    'atualidades',
    'portugues_avancado',
    # Novos (gerados pelos agentes — adicionar aqui conforme criados)
    'direito_constitucional_principios',
    'direito_constitucional_organizacao',
    'direito_administrativo_atos',
    'portugues_sintaxe',
    'portugues_interpretacao',
    'raciocinio_tabelas',
    'raciocinio_combinatoria',
    'informatica_seguranca',
    'direito_penal_administracao',
    'matematica_financeira',
]

# Carrega só os módulos que existem (tolerante a módulos ainda não gerados)
question_modules: dict[str, object] = {}
for name in QUESTION_MODULE_NAMES:
    try:
        question_modules[name] = importlib.import_module(f'questions_data.{name}')
    except ImportError:
        print(f"  Pulando módulo inexistente: {name}")

# Tentar importar libsql_client
try:
    import libsql_client
except ImportError:
    print("ERRO: libsql_client não encontrado. Execute:")
    print("  pip3 install libsql-client --break-system-packages")
    sys.exit(1)

# ──────────────────────────────────────────────
# CONFIGURAÇÃO
# ──────────────────────────────────────────────

def load_env_local():
    """Lê variáveis do .env.local se não estiverem no ambiente"""
    env_path = script_dir.parent / ".env.local"
    if env_path.exists():
        with open(env_path) as f:
            for line in f:
                line = line.strip()
                if line and not line.startswith('#') and '=' in line:
                    key, _, value = line.partition('=')
                    key = key.strip()
                    value = value.strip().strip('"').strip("'")
                    # Remove comentário inline
                    if ' #' in value:
                        value = value[:value.index(' #')].strip()
                    if key and value and key not in os.environ:
                        os.environ[key] = value

load_env_local()

DATABASE_URL = os.getenv('TURSO_DATABASE_URL', '')
AUTH_TOKEN = os.getenv('TURSO_AUTH_TOKEN', '')

if not DATABASE_URL:
    print("ERRO: TURSO_DATABASE_URL não definida")
    print("Configure em .env.local ou exporte a variável antes de executar")
    sys.exit(1)

# ──────────────────────────────────────────────
# MAPEAMENTO DE MÓDULOS
# ──────────────────────────────────────────────

# Cada entrada: (nome_disciplina, modulo, usar_como_nova_disciplina)
# Se usar_como_nova_disciplina=False, a disciplina já existe no banco — só adiciona questões
def _m(name: str):
    """Helper: retorna o módulo carregado ou None se não existir."""
    return question_modules.get(name)

MODULOS_RAW = [
    # Originais
    ("Português",                _m('portugues_avancado'),               False),
    ("Direito Constitucional",   _m('direito_constitucional'),            True),
    ("Direito Administrativo",   _m('direito_administrativo'),            True),
    ("Raciocínio Lógico",        _m('raciocinio_logico'),                 True),
    ("Matemática",               _m('matematica'),                        True),
    ("Administração Pública",    _m('administracao_publica'),             True),
    ("Atualidades",              _m('atualidades'),                       True),
    # Novos (gerados via agentes / scripts/generate_questions_ai.py)
    ("Direito Constitucional",   _m('direito_constitucional_principios'), True),
    ("Direito Constitucional",   _m('direito_constitucional_organizacao'),True),
    ("Direito Administrativo",   _m('direito_administrativo_atos'),       True),
    ("Português",                _m('portugues_sintaxe'),                 False),
    ("Português",                _m('portugues_interpretacao'),           False),
    ("Raciocínio Lógico",        _m('raciocinio_tabelas'),                True),
    ("Raciocínio Lógico",        _m('raciocinio_combinatoria'),           True),
    ("Informática Básica",       _m('informatica_seguranca'),             True),
    ("Direito Penal",            _m('direito_penal_administracao'),       True),
    ("Matemática Financeira",    _m('matematica_financeira'),             True),
]

# Filtra só os que carregaram com sucesso
MODULOS = [(n, m, t) for (n, m, t) in MODULOS_RAW if m is not None]

# ──────────────────────────────────────────────
# FUNÇÕES AUXILIARES
# ──────────────────────────────────────────────

def opcoes_para_lista(opcoes_raw):
    """
    Converte as opções para um JSON array limpo.
    As opções vêm como ['A) texto', 'B) texto', ...]
    Retorna ['A) texto', 'B) texto', ...]
    """
    if isinstance(opcoes_raw, list):
        return json.dumps(opcoes_raw, ensure_ascii=False)
    return json.dumps([], ensure_ascii=False)


def resposta_para_letra(resposta_raw, opcoes_raw):
    """
    Garante que a resposta correta seja uma letra (A, B, C, D, E).
    Se já for letra, retorna como está.
    Se for o texto completo, extrai a letra.
    """
    if not resposta_raw:
        return 'A'

    r = str(resposta_raw).strip()

    # Se já é uma letra
    if len(r) == 1 and r.upper() in 'ABCDE':
        return r.upper()

    # Se começa com a letra e parêntesis: "A) texto"
    if len(r) >= 2 and r[0].upper() in 'ABCDE' and r[1] in ')':
        return r[0].upper()

    # Tentar encontrar a opção correspondente
    if isinstance(opcoes_raw, list):
        for i, op in enumerate(opcoes_raw):
            op_str = str(op).strip()
            # Compara o texto após "X) "
            texto_opcao = op_str[3:].strip() if len(op_str) > 2 else op_str
            if r.lower() == texto_opcao.lower() or r.lower() == op_str.lower():
                return 'ABCDE'[i]

    # Retorno padrão
    return r[0].upper() if r[0].upper() in 'ABCDE' else 'A'


# ──────────────────────────────────────────────
# LÓGICA PRINCIPAL
# ──────────────────────────────────────────────

async def main():
    now = datetime.now().isoformat()

    print("=" * 60)
    print("  FOCO FEDERAL — POPULAÇÃO MASSIVA DO BANCO")
    print(f"  Iniciado em: {datetime.now().strftime('%d/%m/%Y %H:%M:%S')}")
    print("=" * 60)

    # Criar cliente Turso
    url = DATABASE_URL
    if url.startswith('libsql://'):
        url = 'https://' + url[len('libsql://'):]

    client = libsql_client.create_client(
        url=url,
        auth_token=AUTH_TOKEN if AUTH_TOKEN else None
    )

    try:
        # ── 1. Verificar estado atual ──────────────────────────
        print("\n[1/4] Verificando estado atual do banco...")
        try:
            r = await client.execute("SELECT COUNT(*) FROM questions")
            total_anterior = r.rows[0][0]
            print(f"  Questões existentes: {total_anterior}")
        except Exception as e:
            print(f"  Aviso: {e}")
            total_anterior = 0

        try:
            r = await client.execute("SELECT COUNT(*) FROM chapters")
            caps_anterior = r.rows[0][0]
            print(f"  Capítulos existentes: {caps_anterior}")
        except Exception as e:
            print(f"  Aviso: {e}")
            caps_anterior = 0

        # ── 2. Inserir capítulos (INSERT OR IGNORE) ────────────
        print("\n[2/4] Inserindo capítulos...")
        capitulos_inseridos = 0

        for disciplina_nome, modulo, _ in MODULOS:
            capitulos = modulo.CAPITULOS
            for cap in capitulos:
                try:
                    await client.execute(
                        """INSERT OR IGNORE INTO chapters
                           (disciplina, numero, titulo, descricao, ordem, is_primeiro, criado_em)
                           VALUES (?, ?, ?, ?, ?, ?, ?)""",
                        [
                            disciplina_nome,
                            cap['numero'],
                            cap['titulo'],
                            cap.get('descricao', ''),
                            cap['numero'],
                            1 if cap['numero'] == 1 else 0,
                            now
                        ]
                    )
                    capitulos_inseridos += 1
                except Exception as e:
                    print(f"  Aviso capítulo {cap['titulo']}: {e}")

        print(f"  Capítulos processados: {capitulos_inseridos}")

        # ── 3. Preparar todas as questões ─────────────────────
        print("\n[3/4] Preparando questões...")
        todas_questoes = []
        stats_por_disciplina = {}

        for disciplina_nome, modulo, _ in MODULOS:
            questoes_do_modulo = modulo.QUESTOES
            count = 0

            for capitulo_titulo, questoes_lista in questoes_do_modulo.items():
                for q in questoes_lista:
                    opcoes_raw = q.get('opcoes', [])
                    resposta_raw = q.get('resposta', 'A')

                    # Normalizar resposta para letra
                    letra = resposta_para_letra(resposta_raw, opcoes_raw)

                    questao = {
                        'titulo': q.get('titulo', f"{disciplina_nome} - {capitulo_titulo}"),
                        'disciplina': disciplina_nome,
                        'capitulo': capitulo_titulo,
                        'tipo': 'multipla_escolha',
                        'enunciado': q.get('enunciado', ''),
                        'explicacao': q.get('explicacao', ''),
                        'dica': q.get('dica', ''),
                        'opcoes': opcoes_para_lista(opcoes_raw),
                        'resposta_correta': letra,
                        'dificuldade': q.get('dificuldade', 'médio'),
                        'fonte': q.get('fonte', ''),
                        'ano': q.get('ano', None),
                    }
                    todas_questoes.append(questao)
                    count += 1

            stats_por_disciplina[disciplina_nome] = count
            print(f"  {disciplina_nome}: {count} questões")

        total_preparado = len(todas_questoes)
        print(f"\n  Total preparado: {total_preparado} questões")

        # ── 4. Pré-carregar enunciados existentes para deduplicação ────
        print("\n[3.5/4] Carregando enunciados existentes (dedup)...")
        existing_enunciados = set()
        try:
            r = await client.execute("SELECT enunciado FROM questions")
            for row in r.rows:
                # Normalize: strip + lowercase + first 200 chars
                e = (row[0] or '').strip().lower()[:200]
                if e:
                    existing_enunciados.add(e)
            print(f"  {len(existing_enunciados)} enunciados já presentes — serão pulados")
        except Exception as e:
            print(f"  Aviso: não foi possível carregar dedup ({e})")

        # ── 5. Inserir em lotes de 50 (com dedup) ─────────────────────
        print("\n[4/4] Inserindo questões no Turso (lotes de 50)...")
        batch_size = 50
        inseridos = 0
        erros = 0
        pulados_dup = 0

        for i in range(0, len(todas_questoes), batch_size):
            lote = todas_questoes[i:i + batch_size]
            lote_num = i // batch_size + 1
            total_lotes = (len(todas_questoes) + batch_size - 1) // batch_size

            for q in lote:
                # Dedup: pula se enunciado já existe
                key = (q['enunciado'] or '').strip().lower()[:200]
                if key in existing_enunciados:
                    pulados_dup += 1
                    continue
                existing_enunciados.add(key)  # evita dup interna no mesmo run

                try:
                    await client.execute(
                        """INSERT INTO questions
                           (titulo, disciplina, capitulo, tipo, enunciado, explicacao, dica,
                            opcoes, resposta_correta, dificuldade, fonte, ano, criado_em, atualizado_em)
                           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)""",
                        [
                            q['titulo'],
                            q['disciplina'],
                            q['capitulo'],
                            q['tipo'],
                            q['enunciado'],
                            q['explicacao'],
                            q['dica'],
                            q['opcoes'],
                            q['resposta_correta'],
                            q['dificuldade'],
                            q['fonte'],
                            q['ano'],
                            now,
                            now
                        ]
                    )
                    inseridos += 1
                except Exception as e:
                    erros += 1
                    if erros <= 5:  # Mostrar só os primeiros 5 erros
                        print(f"  Erro na questão '{q.get('titulo', '')[:50]}': {e}")

            # Progress
            pct = (lote_num / total_lotes) * 100
            print(f"  Lote {lote_num:3d}/{total_lotes} ({pct:.0f}%) — {inseridos} inseridas, {pulados_dup} duplicadas (puladas), {erros} erros")

        # ── Resultado final ────────────────────────────────────
        try:
            r = await client.execute("SELECT COUNT(*) FROM questions")
            total_final = r.rows[0][0]
        except:
            total_final = total_anterior + inseridos

        try:
            r = await client.execute("SELECT COUNT(*) FROM chapters")
            total_caps = r.rows[0][0]
        except:
            total_caps = caps_anterior + capitulos_inseridos

        try:
            r = await client.execute(
                "SELECT disciplina, COUNT(*) as n FROM questions GROUP BY disciplina ORDER BY n DESC"
            )
            breakdown = r.rows
        except:
            breakdown = []

        print("\n" + "=" * 60)
        print("  RESULTADO FINAL")
        print("=" * 60)
        print(f"  Questões antes: {total_anterior:,}")
        print(f"  Questões novas: {inseridos:,}")
        print(f"  Erros:          {erros}")
        print(f"  Total no banco: {total_final:,}")
        print(f"  Capítulos:      {total_caps}")
        print()
        print("  Distribuição por disciplina:")
        for row in breakdown:
            print(f"    {row[0]:<30} {row[1]:>6} questões")
        print("=" * 60)
        print(f"  Concluído em: {datetime.now().strftime('%d/%m/%Y %H:%M:%S')}")
        print("=" * 60)

    finally:
        await client.close()


if __name__ == "__main__":
    asyncio.run(main())
