#!/usr/bin/env python3
"""
Script para configurar os desbloqueios padrão entre capítulos
Cada capítulo desbloqueia o próximo em sequência (1->2, 2->3, etc)
"""

import os
from datetime import datetime
from libsql_client import create_client

DATABASE_URL = os.getenv('TURSO_DATABASE_URL', 'file:data/foco-federal.db')
AUTH_TOKEN = os.getenv('TURSO_AUTH_TOKEN', '')

client = create_client(
    url=DATABASE_URL,
    auth_token=AUTH_TOKEN if AUTH_TOKEN else None
)


def main():
    """Configura desbloqueios sequenciais"""
    print('🔓 Configurando desbloqueios entre capítulos...\n')

    try:
        # Buscar todos os capítulos
        result = client.execute(
            'SELECT id, disciplina, numero, titulo FROM chapters ORDER BY disciplina, numero'
        )
        chapters = result.rows if hasattr(result, 'rows') else []

        if not chapters:
            print('❌ Nenhum capítulo encontrado no banco')
            return

        # Agrupar por disciplina
        chapters_por_disciplina = {}
        for chapter in chapters:
            ch_id, disciplina, numero, titulo = chapter
            if disciplina not in chapters_por_disciplina:
                chapters_por_disciplina[disciplina] = []
            chapters_por_disciplina[disciplina].append((ch_id, numero, titulo))

        # Para cada disciplina, configurar desbloqueios
        total_desbloqueios = 0
        for disciplina, caps in chapters_por_disciplina.items():
            # Ordenar por número
            caps_sorted = sorted(caps, key=lambda x: x[1])

            print(f'📚 {disciplina}:')
            for i in range(len(caps_sorted) - 1):
                cap_origem_id, cap_origem_num, cap_origem_title = caps_sorted[i]
                cap_destino_id, cap_destino_num, cap_destino_title = caps_sorted[i + 1]

                # Inserir desbloqueio (cap N desbloqueia cap N+1)
                try:
                    client.execute(
                        f"""INSERT OR REPLACE INTO chapter_unlocks 
                           (chapter_id_origem, chapter_id_destino, percentual_necessario, criado_em)
                           VALUES (?, ?, ?, ?)""",
                        [
                            cap_origem_id,
                            cap_destino_id,
                            80,  # 80% de acerto necessário
                            datetime.now().isoformat(),
                        ],
                    )
                    print(
                        f'  ✅ Cap {cap_origem_num} ({cap_origem_title}) → Cap {cap_destino_num} ({cap_destino_title})'
                    )
                    total_desbloqueios += 1
                except Exception as e:
                    print(f'  ⚠️  Erro: {e}')

            print()

        # Também criar relação onde o último capítulo desbloqueia exame/simulado (futura feature)
        # Por enquanto, último é o final

        print(f'''
╔════════════════════════════════════════╗
║  ✅ DESBLOQUEIOS CONFIGURADOS          ║
╠════════════════════════════════════════╣
║  Total de relações: {total_desbloqueios:<20}║
║  Padrão: Capítulo N desbloqueia N+1   ║
║  Percentual necessário: 80%            ║
╚════════════════════════════════════════╝
        ''')

    except Exception as error:
        print(f'❌ Erro: {error}')


if __name__ == '__main__':
    main()
