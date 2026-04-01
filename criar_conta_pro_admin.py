#!/usr/bin/env python3
"""
🔓 SCRIPT DE ACESSO PRO VIP - FOCO FEDERAL
==========================================
Script seguro para criar conta de desenvolvedor/admin PRO com todos os acessos
Conecta diretamente ao SQLite e cria usuário com assinatura PREMIUM ativa

Uso:
    python3 criar_conta_pro_admin.py

Autor: Foco Federal Dev Team
Data: 2026-04-01
"""

import sqlite3
import uuid
import hashlib
import json
import subprocess
import sys
from datetime import datetime, timedelta
from pathlib import Path
import bcrypt

# ==========================================
# CONFIGURAÇÕES
# ==========================================

DATABASE_PATH = Path(__file__).parent / "data" / "foco-federal.db"
EMAIL_PRO = "dev@focofederal.local"
SENHA_PRO = "Pro123!@#Segura"
NOME_PRO = "Desenvolvedor PRO"

# ==========================================
# FUNÇÕES AUXILIARES
# ==========================================

def hash_password(password: str) -> str:
    """Hash de senha usando bcrypt (seguro)"""
    salt = bcrypt.gensalt(10)
    return bcrypt.hashpw(password.encode('utf-8'), salt).decode('utf-8')

def gerar_uuid() -> str:
    """Gera UUID único para usuário"""
    return str(uuid.uuid4())

def inicializar_banco_se_necessario():
    """
    Inicializa o banco de dados automaticamente se não existir
    Executa: node init-db.js
    """
    if DATABASE_PATH.exists():
        return True  # Banco já existe
    
    print(f"\n🔧 Banco de dados não encontrado. Inicializando automaticamente...")
    print(f"   Executando: node init-db.js\n")
    
    script_path = DATABASE_PATH.parent.parent / "init-db.js"
    
    if not script_path.exists():
        print(f"❌ Erro: Arquivo {script_path} não encontrado")
        print(f"💡 Dica: Certifique-se que init-db.js está no diretório raiz")
        return False
    
    try:
        # Executar o script Node.js
        result = subprocess.run(
            [sys.executable, "-m", "node", str(script_path)],
            capture_output=True,
            text=True,
            cwd=DATABASE_PATH.parent.parent
        )
        
        # Tentar com 'node' diretamente se falhar
        if result.returncode != 0:
            result = subprocess.run(
                ["node", str(script_path)],
                capture_output=True,
                text=True,
                cwd=DATABASE_PATH.parent.parent
            )
        
        if result.returncode == 0:
            print(result.stdout)
            return True
        else:
            print(f"❌ Erro ao executar init-db.js: {result.stderr}")
            return False
            
    except Exception as e:
        print(f"❌ Erro: {e}")
        print(f"💡 Dica: Execute 'node init-db.js' manualmente antes de rodar este script")
        return False

def create_connection(db_path: str):
    """Conecta ao banco de dados SQLite"""
    try:
        conn = sqlite3.connect(db_path)
        conn.row_factory = sqlite3.Row
        return conn
    except sqlite3.Error as e:
        print(f"❌ Erro ao conectar ao banco: {e}")
        return None

def criar_usuario_pro():
    """
    Cria usuário PRO/VIP no banco de dados
    - Sem precisar de registro normal
    - Com todos os acessos liberados
    - Assinatura PRO ativa por 1 ano
    """
    
    print("\n" + "="*60)
    print("🔓 CRIADOR DE CONTA PRO - FOCO FEDERAL")
    print("="*60)
    
    # Inicializar banco de dados se necessário
    if not inicializar_banco_se_necessario():
        print("❌ Falha ao inicializar banco de dados")
        return False
    
    print(f"\n📁 Banco de dados: {DATABASE_PATH}")
    
    # Conectar ao banco
    conn = create_connection(str(DATABASE_PATH))
    if not conn:
        return False
    
    cursor = conn.cursor()
    
    try:
        # Gerar dados
        user_id = gerar_uuid()
        senha_hash = hash_password(SENHA_PRO)
        agora = datetime.now().isoformat()
        expiracao = (datetime.now() + timedelta(days=365)).isoformat()  # 1 ano
        
        print(f"\n📊 Dados da Conta PRO:")
        print(f"   ID:        {user_id}")
        print(f"   Email:     {EMAIL_PRO}")
        print(f"   Senha:     {SENHA_PRO}")
        print(f"   Nome:      {NOME_PRO}")
        print(f"   Status:    ACTIVE (PRO)")
        print(f"   Expira em: {datetime.fromisoformat(expiracao).strftime('%d/%m/%Y')}")
        
        # Verificar se usuário já existe
        cursor.execute("SELECT * FROM users WHERE email = ?", (EMAIL_PRO,))
        existing_user = cursor.fetchone()
        
        if existing_user:
            print(f"\n⚠️  Usuário '{EMAIL_PRO}' já existe!")
            print(f"   ID: {existing_user['id']}")
            
            # Opção: Atualizar para PRO
            resposta = input("\n🔄 Deseja atualizar para status PRO? (s/n): ").lower()
            if resposta == 's':
                cursor.execute("""
                    UPDATE users 
                    SET subscription_status = 'active',
                        subscription_expires_at = ?,
                        atualizado_em = ?
                    WHERE email = ?
                """, (expiracao, agora, EMAIL_PRO))
                conn.commit()
                print("✅ Usuário atualizado para PRO com sucesso!")
            else:
                print("❌ Operação cancelada")
                return False
        else:
            # Criar novo usuário PRO
            cursor.execute("""
                INSERT INTO users (
                    id, email, senha_hash, nome, foto_url,
                    provider, provider_id, uf_id, cidade_id,
                    subscription_status, subscription_expires_at,
                    stripe_customer_id, pagbank_customer_id,
                    criado_em, atualizado_em
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """, (
                user_id,                    # id
                EMAIL_PRO,                  # email
                senha_hash,                 # senha_hash (bcrypt)
                NOME_PRO,                   # nome
                "https://api.dicebear.com/9.x/avataaars/svg?seed=pro",  # foto_url
                "email",                    # provider
                None,                       # provider_id
                None,                       # uf_id
                None,                       # cidade_id
                "active",                   # subscription_status (PRO ATIVO)
                expiracao,                  # subscription_expires_at
                None,                       # stripe_customer_id
                None,                       # pagbank_customer_id
                agora,                      # criado_em
                agora                       # atualizado_em
            ))
            
            conn.commit()
            print(f"\n✅ Usuário PRO criado com sucesso!")
        
        # Listar dados do usuário criado
        cursor.execute("SELECT * FROM users WHERE email = ?", (EMAIL_PRO,))
        user = cursor.fetchone()
        
        print(f"\n📋 Dados salvos no banco:")
        print(f"   ID:                    {user['id']}")
        print(f"   Email:                 {user['email']}")
        print(f"   Nome:                  {user['nome']}")
        print(f"   Status Assinatura:     {user['subscription_status']}")
        print(f"   Expira em:             {user['subscription_expires_at']}")
        print(f"   Provider:              {user['provider']}")
        print(f"   Criado em:             {user['criado_em']}")
        
        conn.close()
        
        # Instruções de acesso
        print("\n" + "="*60)
        print("🚀 INSTRUÇÕES DE ACESSO")
        print("="*60)
        print(f"""
1️⃣  Acesse o site em:
    http://localhost:3000

2️⃣  Clique em "ENTRAR"

3️⃣  Faça login com:
    Email:  {EMAIL_PRO}
    Senha:  {SENHA_PRO}

4️⃣  Você terá acesso COMPLETO ao dashboard PRO:
    ✅ Assinatura PRO ativa por 1 ano
    ✅ Todas as 4000+ questões desbloqueadas
    ✅ Simulados completos
    ✅ Analytics avançados
    ✅ Comunidade premium
    ✅ Sem limites de requisições
    ✅ Suporte prioritário

5️⃣  Você será redirecionado para:
    http://localhost:3000/dashboard

🔐 SEGURANÇA:
    • Senha com hash bcrypt (forte)
    • Dados salvos no SQLite local
    • Acesso apenas localmente em dev
    • Não compartilhe essas credenciais em produção!
""")
        
        return True
        
    except sqlite3.Error as e:
        print(f"\n❌ Erro SQL: {e}")
        conn.rollback()
        return False
    finally:
        if conn:
            conn.close()

def main():
    """Função principal"""
    try:
        sucesso = criar_usuario_pro()
        
        if sucesso:
            print("\n" + "="*60)
            print("✅ CONTA PRO CRIADA COM SUCESSO!")
            print("="*60)
            print("\n💡 Próximos passos:")
            print("   1. Certifique-se que 'npm run dev' está rodando")
            print("   2. Abra http://localhost:3000")
            print("   3. Faça login com as credenciais acima")
            print("   4. Aproveite o acesso PRO completo! 🎉")
            print("\n")
            return 0
        else:
            print("\n❌ Falha ao criar conta PRO")
            return 1
            
    except Exception as e:
        print(f"\n❌ Erro inesperado: {e}")
        import traceback
        traceback.print_exc()
        return 1

if __name__ == "__main__":
    exit(main())
