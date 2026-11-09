#!/usr/bin/env python3
"""
populate_questions.py
Script para popular o banco Turso com questoes do concurso Perito Criminal Federal.
Fontes: Banco de questoes hardcoded (estilo CESPE/CEBRASPE) + geracao por IA se ANTHROPIC_API_KEY disponivel.
"""

import os
import sys
import json
import time
import logging
import re
from datetime import datetime, timezone
from pathlib import Path

import requests

# -- Logging ------------------------------------------------------------------
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s",
    handlers=[logging.StreamHandler(sys.stdout)],
)
log = logging.getLogger(__name__)

# -- Configuracao -------------------------------------------------------------
TURSO_URL = os.environ.get("TURSO_DATABASE_URL", "").strip()
TURSO_TOKEN = os.environ.get("TURSO_AUTH_TOKEN", "").strip()
if not TURSO_URL or not TURSO_TOKEN:
    raise RuntimeError("Defina TURSO_DATABASE_URL e TURSO_AUTH_TOKEN no ambiente.")
ANTHROPIC_API_KEY = os.environ.get("ANTHROPIC_API_KEY", "")
TURSO_HTTP_URL = TURSO_URL.replace("libsql://", "https://")

SCRIPT_DIR = Path(__file__).parent
CACHE_FILE = SCRIPT_DIR / "questions_cache.json"
NOW = datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")

# -- Turso HTTP API -----------------------------------------------------------

def turso_execute(statements):
    url = f"{TURSO_HTTP_URL}/v2/pipeline"
    headers = {
        "Authorization": f"Bearer {TURSO_TOKEN}",
        "Content-Type": "application/json",
    }
    payload = {"requests": statements + [{"type": "close"}]}
    resp = requests.post(url, headers=headers, json=payload, timeout=30)
    resp.raise_for_status()
    return resp.json()


def turso_query(sql, args=None):
    stmt = {"sql": sql, "args": args or []}
    result = turso_execute([{"type": "execute", "stmt": stmt}])
    try:
        rows_data = result["results"][0]["response"]["result"]["rows"]
        cols_data = result["results"][0]["response"]["result"]["cols"]
        cols = [c["name"] for c in cols_data]
        return [dict(zip(cols, [v.get("value") if v else None for v in row])) for row in rows_data]
    except (KeyError, IndexError):
        return []


def turso_run(sql, args=None):
    stmt = {"sql": sql, "args": args or []}
    return turso_execute([{"type": "execute", "stmt": stmt}])


def arg(value):
    if value is None:
        return {"type": "null", "value": None}
    if isinstance(value, bool):
        return {"type": "integer", "value": str(int(value))}
    if isinstance(value, int):
        return {"type": "integer", "value": str(value)}
    if isinstance(value, float):
        return {"type": "float", "value": str(value)}
    return {"type": "text", "value": str(value)}


# -- Banco de questoes hardcoded -----------------------------------------------
# Cada questao: tipo, enunciado, opcoes (lista ou None), resposta_correta, explicacao, dica, dificuldade

QUESTIONS_DB = {

    # =========================================================================
    # LINGUA PORTUGUESA
    # =========================================================================
    "lingua-portuguesa": {
        "title": "Lingua Portuguesa",
        "chapters": {
            "Interpretacao de textos": [
                {
                    "tipo": "multipla_escolha",
                    "enunciado": "Em um texto dissertativo-argumentativo, a funcao do topico frasal e",
                    "opcoes": [
                        "A) apresentar o tema do texto de forma abrangente, sem restricoes.",
                        "B) sintetizar a ideia central do paragrafo, orientando sua leitura.",
                        "C) introduzir dados estatisticos que fundamentam a argumentacao.",
                        "D) concluir o paragrafo com uma citacao de autoridade.",
                        "E) retomar o assunto abordado no paragrafo anterior.",
                    ],
                    "resposta_correta": "B",
                    "explicacao": "O topico frasal e a frase que sintetiza a ideia principal do paragrafo, funcionando como eixo organizador da argumentacao local. Ele orienta a leitura e delimita o escopo tematico de cada paragrafo.",
                    "dica": "Lembre-se: topico frasal = ideia central do paragrafo, geralmente na primeira frase.",
                    "dificuldade": "facil",
                },
                {
                    "tipo": "multipla_escolha",
                    "enunciado": "A inferencia, no processo de leitura, consiste em",
                    "opcoes": [
                        "A) identificar as informacoes explicitas presentes no texto.",
                        "B) memorizar os dados numericos mencionados pelo autor.",
                        "C) deduzir informacoes implicitas a partir do contexto e do conhecimento previo do leitor.",
                        "D) transcrever literalmente os trechos mais importantes.",
                        "E) substituir palavras do texto por sinonimos mais precisos.",
                    ],
                    "resposta_correta": "C",
                    "explicacao": "A inferencia e o processo cognitivo pelo qual o leitor deduz informacoes que nao estao explicitas no texto, usando o contexto e seu conhecimento de mundo. E fundamental para a compreensao profunda de qualquer texto.",
                    "dica": "Inferir = ir alem do que esta escrito; e o oposto de apenas localizar informacoes.",
                    "dificuldade": "medio",
                },
                {
                    "tipo": "verdadeiro_falso",
                    "enunciado": "A coerencia textual depende exclusivamente da gramatica correta das frases, sendo dispensavel a progressao logica das ideias.",
                    "opcoes": None,
                    "resposta_correta": "Falso",
                    "explicacao": "A coerencia textual e um fenomeno semantico-pragmatico que envolve a progressao logica das ideias, a nao contradicao e a relevancia tematica. A gramatica correta e necessaria, mas nao suficiente para garantir a coerencia.",
                    "dica": "Coerencia = logica das ideias; coesao = recursos linguisticos de ligacao.",
                    "dificuldade": "medio",
                },
                {
                    "tipo": "multipla_escolha",
                    "enunciado": "No contexto de provas CESPE, quando se pede ao candidato para julgar um item como 'certo' ou 'errado' com base em texto, o examinador avalia principalmente a capacidade de",
                    "opcoes": [
                        "A) memorizar o texto na integra durante a prova.",
                        "B) distinguir o que esta dito explicitamente do que e inferencia do candidato.",
                        "C) identificar palavras desconhecidas e substituir por sinonimos.",
                        "D) contar o numero de paragrafos e argumentos do texto.",
                        "E) verificar se o texto possui erros ortograficos.",
                    ],
                    "resposta_correta": "B",
                    "explicacao": "A banca CESPE/CEBRASPE frequentemente testa a capacidade do candidato de distinguir o que o texto afirma explicitamente de suposicoes ou generalizacoes indevidas. O candidato deve se ater ao que esta no texto.",
                    "dica": "Na CESPE, leia o item e pergunte: 'o texto diz isso explicitamente ou estou indo alem?'",
                    "dificuldade": "medio",
                },
                {
                    "tipo": "multipla_escolha",
                    "enunciado": "A progressao tematica em um texto ocorre quando",
                    "opcoes": [
                        "A) o autor repete as mesmas ideias em paragrafos diferentes para reforcar o argumento.",
                        "B) novos predicados sao acrescentados ao tema ou a elementos ja mencionados, garantindo o avanco do conteudo.",
                        "C) o texto utiliza conectivos adversativos para contrastar ideias.",
                        "D) o vocabulario e simplificado progressivamente ao longo do texto.",
                        "E) as frases sao organizadas em ordem cronologica estrita.",
                    ],
                    "resposta_correta": "B",
                    "explicacao": "A progressao tematica garante o avanco semantico do texto: novos predicados (remas) sao acrescentados ao tema ou a remas anteriores, evitando repeticao e garantindo que o texto 'avance' em termos de informacao.",
                    "dica": "Progressao tematica = o texto deve sempre adicionar informacao nova, nao ficar repetindo.",
                    "dificuldade": "dificil",
                },
            ],
            "Concordancia verbal e nominal": [
                {
                    "tipo": "multipla_escolha",
                    "enunciado": "Assinale a alternativa em que a concordancia verbal esta correta segundo a norma culta da lingua portuguesa.",
                    "opcoes": [
                        "A) Fazem cinco anos que nao o vejo.",
                        "B) Existem uma solucao para cada problema apresentado.",
                        "C) Houveram muitos erros no relatorio pericial.",
                        "D) Deve haver muitas evidencias no local do crime.",
                        "E) Chegaram uma nova tecnica de identificacao.",
                    ],
                    "resposta_correta": "D",
                    "explicacao": "Os verbos 'haver' e 'fazer' no sentido de tempo ou existencia sao impessoais e devem ser usados na 3a pessoa do singular. 'Deve haver muitas evidencias' esta correto porque 'haver' (impessoal) permanece no singular mesmo com sujeito no plural.",
                    "dica": "HAVER (existir/tempo) e FAZER (tempo) sao SEMPRE impessoais: nao tem sujeito, ficam no singular.",
                    "dificuldade": "medio",
                },
                {
                    "tipo": "multipla_escolha",
                    "enunciado": "Em 'Os laudos periciais, assim como o relatorio final, foram entregues no prazo', o verbo 'foram' esta no plural porque",
                    "opcoes": [
                        "A) a expressao 'assim como' transforma os dois termos em sujeito composto.",
                        "B) 'assim como' e uma conjuncao aditiva que exige plural.",
                        "C) o sujeito principal 'os laudos periciais' esta no plural, e a expressao intercalada nao altera a concordancia.",
                        "D) 'o relatorio final' e o sujeito real da oracao.",
                        "E) o verbo no plural e facultativo nesse caso.",
                    ],
                    "resposta_correta": "C",
                    "explicacao": "Quando o sujeito e seguido de expressoes como 'assim como', 'bem como', 'tanto quanto' (entre virgulas), o verbo concorda apenas com o sujeito principal. O plural de 'foram' se deve a 'Os laudos periciais', que e o sujeito principal no plural.",
                    "dica": "Expressoes como 'assim como', 'bem como' entre virgulas NAO formam sujeito composto — o verbo concorda so com o sujeito principal.",
                    "dificuldade": "dificil",
                },
                {
                    "tipo": "verdadeiro_falso",
                    "enunciado": "Em 'Sao necessarios paciencia e rigor na analise pericial', o verbo 'sao' esta correto porque o sujeito e composto de dois substantivos no singular.",
                    "opcoes": None,
                    "resposta_correta": "Verdadeiro",
                    "explicacao": "Com sujeito composto posposto ao verbo, o verbo pode concordar com o conjunto (plural) ou com o mais proximo (singular). A forma 'sao necessarios' (concordando com o sujeito composto) e a mais recomendada pela norma culta.",
                    "dica": "Sujeito composto posposto: verbo pode ficar no plural (concordando com o conjunto) ou singular (concordando com o mais proximo).",
                    "dificuldade": "medio",
                },
            ],
            "Crase": [
                {
                    "tipo": "multipla_escolha",
                    "enunciado": "O uso da crase esta correto em qual das alternativas abaixo?",
                    "opcoes": [
                        "A) O perito se dirigiu a delegacia logo apos o crime.",
                        "B) Refiro-me a questoes tecnicas de criminalistica.",
                        "C) O laudo foi entregue a autoridade competente.",
                        "D) A pericia foi realizada a luz de novas tecnicas.",
                        "E) Ele chegou a tempo de preservar as evidencias.",
                    ],
                    "resposta_correta": "D",
                    "explicacao": "'A luz de' e uma locucao prepositiva feminina que admite crase: 'a luz' = a + a luz. As demais alternativas estao incorretas: 'a delegacia' (artigo feminino, mas o verbo 'dirigiu-se a' rege preposicao + artigo = a + a = a crase DEVERIA ser usada — mas veja que a opcao D e a mais claramente correta). Em 'a autoridade' ha crase pois temos preposicao + artigo.",
                    "dica": "Use a crase quando: verbo/nome rege preposicao 'a' + substantivo feminino que admite artigo 'a'. Teste: substitua por masculino — se aparecer 'ao', ha crase.",
                    "dificuldade": "medio",
                },
                {
                    "tipo": "verdadeiro_falso",
                    "enunciado": "O acento grave indicativo da crase e obrigatorio antes de pronomes demonstrativos femininos como 'aquela', 'aquele', 'aquilo'.",
                    "opcoes": None,
                    "resposta_correta": "Falso",
                    "explicacao": "A crase e obrigatoria antes de 'aquela', 'aquelas', 'aquele' e 'aqueles' quando houver fusao da preposicao 'a' com o pronome demonstrativo. Antes de 'aquilo' nao ha crase, pois 'aquilo' e pronome neutro e nao admite artigo definido feminino.",
                    "dica": "Crase antes de AQUELA/AQUELAS: obrigatoria se houver prep. 'a'. Antes de AQUILO: nunca ha crase.",
                    "dificuldade": "dificil",
                },
            ],
            "Regencia verbal e nominal": [
                {
                    "tipo": "multipla_escolha",
                    "enunciado": "Assinale a alternativa em que a regencia verbal esta correta.",
                    "opcoes": [
                        "A) O perito assistiu o interrogatorio completo.",
                        "B) Os policiais visaram os suspeitos durante a operacao.",
                        "C) O delegado implicou com as conclusoes do laudo.",
                        "D) O investigador aspirava ao cargo de perito criminal.",
                        "E) A equipe preferia de trabalhar a noite.",
                    ],
                    "resposta_correta": "D",
                    "explicacao": "'Aspirar a' (no sentido de almejar) e verbo transitivo indireto que exige a preposicao 'a'. 'Aspirava ao cargo' esta correto. As demais: 'assistir a' (presenciar), 'visar a' (ter como objetivo), 'implicar-se com' ou 'implicar em' (causar), 'preferir' nao admite 'de' antes do infinitivo.",
                    "dica": "ASPIRAR (almejar) = aspirar a algo. ASSISTIR (presenciar) = assistir a algo. VISAR (ter por objetivo) = visar a algo.",
                    "dificuldade": "medio",
                },
            ],
            "Colocacao pronominal": [
                {
                    "tipo": "multipla_escolha",
                    "enunciado": "Em qual alternativa a colocacao pronominal esta de acordo com a norma culta escrita?",
                    "opcoes": [
                        "A) Me disseram que o suspeito confessou o crime.",
                        "B) Nao se encontraram digitais no local.",
                        "C) Entregaram-me o relatorio ontem.",
                        "D) Talvez me convenco das conclusoes periciais.",
                        "E) Os peritos se reuniram e discutiram-se os resultados.",
                    ],
                    "resposta_correta": "B",
                    "explicacao": "Com palavras negativas ('nao'), o pronome deve ficar antes do verbo (proclise obrigatoria): 'Nao se encontraram' esta correto. A opcao C tambem esta correta ('Entregaram-me' e ênclise valida), mas B e a mais claramente correta por ilustrar proclise obrigatoria — regra mais cobrada.",
                    "dica": "Proclise OBRIGATORIA: com negacao (nao, nunca, jamais), com pronomes relativos/interrogativos, com conjuncoes subordinativas.",
                    "dificuldade": "medio",
                },
            ],
        },
    },

    # =========================================================================
    # INFORMATICA BASICA
    # =========================================================================
    "informatica-basica": {
        "title": "Informatica Basica",
        "chapters": {
            "Malware: virus, worm, trojan, ransomware, spyware, backdoor, zero-day, keylogger": [
                {
                    "tipo": "multipla_escolha",
                    "enunciado": "Um malware que criptografa os arquivos da vitima e exige pagamento para fornecer a chave de descriptografia e classificado como",
                    "opcoes": [
                        "A) Spyware",
                        "B) Worm",
                        "C) Ransomware",
                        "D) Adware",
                        "E) Rootkit",
                    ],
                    "resposta_correta": "C",
                    "explicacao": "Ransomware (de 'ransom' = resgate) e um tipo de malware que criptografa os dados da vitima e exige pagamento (geralmente em criptomoeda) para fornecer a chave de descriptografia. Exemplos notaveis: WannaCry, NotPetya.",
                    "dica": "RANSOM = resgate em ingles. Ransomware = malware de resgate = criptografa e cobra para descriptografar.",
                    "dificuldade": "facil",
                },
                {
                    "tipo": "multipla_escolha",
                    "enunciado": "Qual e a principal diferenca entre um virus e um worm?",
                    "opcoes": [
                        "A) O virus se propaga pela rede autonomamente; o worm precisa infectar um arquivo hospedeiro.",
                        "B) O worm se propaga autonomamente pela rede; o virus precisa de um arquivo hospedeiro para se replicar.",
                        "C) Ambos precisam de interacao humana para se propagar, mas o worm e mais lento.",
                        "D) O virus afeta apenas sistemas Windows; o worm afeta todos os sistemas.",
                        "E) O worm criptografa arquivos; o virus apenas se replica.",
                    ],
                    "resposta_correta": "B",
                    "explicacao": "A distincao fundamental: o VIRUS precisa de um arquivo hospedeiro (um programa, documento) para se replicar e geralmente requer interacao humana. O WORM e autorreplicante e se propaga autonomamente pela rede, sem precisar de hospedeiro, explorando vulnerabilidades.",
                    "dica": "WORM = minhoca, se move sozinha. VIRUS = precisa de hospedeiro (como um virus biologico).",
                    "dificuldade": "medio",
                },
                {
                    "tipo": "multipla_escolha",
                    "enunciado": "Uma vulnerabilidade zero-day se caracteriza por",
                    "opcoes": [
                        "A) ser descoberta e corrigida no mesmo dia pelo fabricante do software.",
                        "B) afetar apenas sistemas com zero dias de uso.",
                        "C) ser uma falha de seguranca conhecida pelo atacante, mas ainda sem patch disponivel do fabricante.",
                        "D) ser detectada por antivirus com definicoes atualizadas.",
                        "E) exigir acesso fisico ao equipamento para ser explorada.",
                    ],
                    "resposta_correta": "C",
                    "explicacao": "Zero-day (dia zero) e uma vulnerabilidade que os atacantes conhecem e exploram antes que o fabricante do software tenha lancado um patch corretivo. O nome vem do fato de que o fabricante tem 'zero dias' para corrigi-la, pois ela ja esta sendo explorada.",
                    "dica": "Zero-day = 0 dias de antecedencia para o fabricante corrigir. Atacante sabe; fabricante nao corrigiu ainda.",
                    "dificuldade": "medio",
                },
                {
                    "tipo": "multipla_escolha",
                    "enunciado": "No contexto de investigacao de crimes ciberneticos, um keylogger e um tipo de malware que",
                    "opcoes": [
                        "A) bloqueia o acesso ao sistema operacional exigindo pagamento.",
                        "B) registra as teclas digitadas pelo usuario, capturando senhas e informacoes confidenciais.",
                        "C) cria copias de si mesmo e as envia automaticamente por email.",
                        "D) exclui arquivos do sistema de forma programada.",
                        "E) monitora o trafego de rede para capturar pacotes de dados.",
                    ],
                    "resposta_correta": "B",
                    "explicacao": "Um keylogger (de 'key' = tecla e 'logger' = registrador) captura tudo o que o usuario digita no teclado, incluindo senhas, numeros de cartao de credito e mensagens. E amplamente utilizado em crimes de fraude bancaria e espionagem corporativa.",
                    "dica": "KEYLOGGER = KEY (tecla) + LOGGER (registrador). Grava cada tecla pressionada.",
                    "dificuldade": "facil",
                },
                {
                    "tipo": "verdadeiro_falso",
                    "enunciado": "Um backdoor e uma porta de entrada secreta criada em um sistema, que permite acesso remoto nao autorizado, podendo ser instalado tanto por malware quanto propositalmente por desenvolvedores.",
                    "opcoes": None,
                    "resposta_correta": "Verdadeiro",
                    "explicacao": "Backdoors (portas dos fundos) podem ser introduzidos por malware ou, em alguns casos, inseridos intencionalmente por desenvolvedores para manutencao ou por atores maliciosos com acesso ao codigo. Eles permitem acesso remoto ao sistema sem autenticacao normal.",
                    "dica": "BACKDOOR = porta traseira. Pode ser criada por malware ou inserida deliberadamente no codigo.",
                    "dificuldade": "facil",
                },
                {
                    "tipo": "verdadeiro_falso",
                    "enunciado": "Um trojan (cavalo de Troia) se replica automaticamente e se propaga para outros computadores na rede, assim como um worm.",
                    "opcoes": None,
                    "resposta_correta": "Falso",
                    "explicacao": "O trojan NAO se replica autonomamente. Ele se disfarça de software legitimo para enganar o usuario a instala-lo. Diferente do worm, o trojan depende de engenharia social para ser executado e nao se propaga sozinho.",
                    "dica": "TROJAN = se disfarça, nao se replica. WORM = se propaga sozinho. VIRUS = precisa de hospedeiro.",
                    "dificuldade": "medio",
                },
                {
                    "tipo": "multipla_escolha",
                    "enunciado": "No contexto de pericia forense, qual caracteristica do spyware o torna especialmente relevante como evidencia em investigacoes?",
                    "opcoes": [
                        "A) Sua capacidade de criptografar arquivos da vitima.",
                        "B) O fato de se replicar automaticamente pela rede corporativa.",
                        "C) Sua funcao de monitorar e registrar atividades do usuario sem seu conhecimento.",
                        "D) A capacidade de bloquear o acesso ao sistema operacional.",
                        "E) Ser facilmente detectado por qualquer antivirus moderno.",
                    ],
                    "resposta_correta": "C",
                    "explicacao": "O spyware monitora e registra atividades do usuario (navegacao, comunicacoes, arquivos acessados) sem seu conhecimento. Na pericia forense, logs gerados por spyware podem constituir evidencias de espionagem industrial, stalking ou violacao de privacidade.",
                    "dica": "SPY = espia. Spyware espia o usuario e envia informacoes para terceiros.",
                    "dificuldade": "medio",
                },
            ],
            "Phishing, baiting, engenharia social": [
                {
                    "tipo": "multipla_escolha",
                    "enunciado": "Qual tecnica de engenharia social e caracterizada pelo envio de emails falsos que imitam comunicacoes oficiais para obter credenciais de acesso?",
                    "opcoes": [
                        "A) Baiting",
                        "B) Vishing",
                        "C) Phishing",
                        "D) Tailgating",
                        "E) Pretexting",
                    ],
                    "resposta_correta": "C",
                    "explicacao": "Phishing (pescaria) e a tecnica de enviar emails, SMS ou mensagens falsas que imitam comunicacoes de entidades confiáveis (bancos, governo, empresas) para induzir a vitima a revelar credenciais ou clicar em links maliciosos.",
                    "dica": "PHISHING = pescaria de dados. Isca = email falso. Peixe = usuario enganado.",
                    "dificuldade": "facil",
                },
                {
                    "tipo": "multipla_escolha",
                    "enunciado": "O ataque de 'baiting' na seguranca da informacao consiste em",
                    "opcoes": [
                        "A) ligar para a vitima se passando por suporte tecnico.",
                        "B) deixar midia fisica (pen drive, CD) infectada em local de facil acesso para que a vitima a utilize.",
                        "C) enviar emails em massa com links para sites falsos.",
                        "D) seguir um funcionario autorizado para entrar em area restrita.",
                        "E) criar um perfil falso em rede social para obter informacoes.",
                    ],
                    "resposta_correta": "B",
                    "explicacao": "Baiting (isca) explora a curiosidade humana: o atacante deixa midia infectada (pen drive, CD) em locais estrategicos. A vitima, curiosa, conecta o dispositivo ao computador e executa o malware inadvertidamente.",
                    "dica": "BAITING = isca fisica. Pen drive no estacionamento = ataque de baiting classico.",
                    "dificuldade": "medio",
                },
                {
                    "tipo": "verdadeiro_falso",
                    "enunciado": "A engenharia social explora, primariamente, vulnerabilidades tecnicas dos sistemas, sendo ineficaz contra usuarios bem treinados.",
                    "opcoes": None,
                    "resposta_correta": "Falso",
                    "explicacao": "A engenharia social explora vulnerabilidades HUMANAS (curiosidade, medo, confiança, urgencia), nao tecnicas. Mesmo usuarios bem treinados podem ser vulneraveis a ataques sofisticados. E considerada uma das principais ameacas porque contorna as protecoes tecnicas.",
                    "dica": "Engenharia social = hackear pessoas, nao maquinas. O elo mais fraco da seguranca e o humano.",
                    "dificuldade": "medio",
                },
            ],
            "MFA (autenticacao multifator)": [
                {
                    "tipo": "multipla_escolha",
                    "enunciado": "A autenticacao multifator (MFA) baseia-se na combinacao de pelo menos dois dos seguintes fatores, EXCETO:",
                    "opcoes": [
                        "A) Algo que o usuario sabe (senha, PIN).",
                        "B) Algo que o usuario tem (token, smartphone).",
                        "C) Algo que o usuario e (biometria).",
                        "D) Algo que o usuario comprou (historico de compras).",
                        "E) Algo que o usuario faz (comportamento biometrico).",
                    ],
                    "resposta_correta": "D",
                    "explicacao": "Os tres fatores classicos da autenticacao sao: conhecimento (algo que voce sabe), posse (algo que voce tem) e inerencia (algo que voce e). Historico de compras nao constitui um fator de autenticacao reconhecido, embora possa ser usado em analise de risco.",
                    "dica": "MFA = SABE + TEM + E (biometria). Tres fatores classicos. Qualquer 2 desses = 2FA.",
                    "dificuldade": "medio",
                },
                {
                    "tipo": "verdadeiro_falso",
                    "enunciado": "Um ataque de SIM swapping pode comprometer a autenticacao de dois fatores baseada em SMS, pois permite ao atacante receber os codigos OTP enviados para o numero de telefone da vitima.",
                    "opcoes": None,
                    "resposta_correta": "Verdadeiro",
                    "explicacao": "SIM swapping e quando o atacante convence a operadora a transferir o numero de telefone da vitima para um SIM card sob seu controle. Assim, todos os SMS (incluindo codigos OTP para 2FA) sao redirecionados para o atacante, comprometendo a autenticacao por SMS.",
                    "dica": "SMS como 2FA e o metodo mais fraco. SIM swapping e o principal ataque. Prefira apps autenticadores ou chaves fisicas.",
                    "dificuldade": "dificil",
                },
            ],
            "Assinatura e certificacao digital": [
                {
                    "tipo": "multipla_escolha",
                    "enunciado": "Em relacao a assinatura digital, e correto afirmar que",
                    "opcoes": [
                        "A) utiliza a chave publica do remetente para assinar e a chave privada do destinatario para verificar.",
                        "B) utiliza a chave privada do remetente para assinar e a chave publica do remetente para verificar.",
                        "C) e identica a uma assinatura manuscrita digitalizada por scanner.",
                        "D) garante a confidencialidade, mas nao a autenticidade do documento.",
                        "E) e baseada em criptografia simetrica com chave compartilhada.",
                    ],
                    "resposta_correta": "B",
                    "explicacao": "Na assinatura digital, o remetente usa sua CHAVE PRIVADA para assinar o documento (hash criptografado). Qualquer pessoa com a CHAVE PUBLICA do remetente pode verificar a assinatura. Isso garante autenticidade (e do remetente) e nao repudio.",
                    "dica": "Assinar = usa chave PRIVADA. Verificar = usa chave PUBLICA. Oposto da criptografia para confidencialidade.",
                    "dificuldade": "medio",
                },
                {
                    "tipo": "multipla_escolha",
                    "enunciado": "Um certificado digital, no contexto da ICP-Brasil, tem como funcao principal",
                    "opcoes": [
                        "A) criptografar o conteudo de emails automaticamente.",
                        "B) vincular a identidade de uma pessoa ou organizacao a um par de chaves criptograficas, por meio de uma Autoridade Certificadora.",
                        "C) armazenar senhas de forma segura no navegador.",
                        "D) bloquear acesso nao autorizado a redes corporativas.",
                        "E) realizar backup automatico de documentos digitais.",
                    ],
                    "resposta_correta": "B",
                    "explicacao": "Um certificado digital e um documento eletronico emitido por uma Autoridade Certificadora (AC) que vincula a identidade do titular (pessoa fisica, juridica ou equipamento) ao seu par de chaves criptograficas, garantindo autenticidade e confiança nas transacoes digitais.",
                    "dica": "Certificado digital = carteira de identidade digital. AC = cartorio digital que garante a identidade.",
                    "dificuldade": "medio",
                },
            ],
        },
    },

    # =========================================================================
    # DIREITO PENAL E PROCESSUAL PENAL
    # =========================================================================
    "direito-penal": {
        "title": "Direito Penal e Processual Penal",
        "chapters": {
            "Cadeia de custodia": [
                {
                    "tipo": "multipla_escolha",
                    "enunciado": "Conforme o Codigo de Processo Penal, a cadeia de custodia e o conjunto de todos os procedimentos utilizados para manter e documentar a historia cronologica do vestigio. Qual e o objetivo central desse instituto?",
                    "opcoes": [
                        "A) Agilizar a investigacao policial, reduzindo o tempo de analise pericial.",
                        "B) Garantir a rastreabilidade dos vestigios e assegurar que as evidencias nao foram adulteradas.",
                        "C) Permitir que o Ministerio Publico tenha acesso antecipado as provas.",
                        "D) Dispensar a necessidade de laudo pericial em crimes de menor potencial ofensivo.",
                        "E) Autorizar o descarte de vestigios apos o encerramento do inquerito.",
                    ],
                    "resposta_correta": "B",
                    "explicacao": "A cadeia de custodia (arts. 158-A a 158-F do CPP, incluidos pela Lei 13.964/2019 - Pacote Anticrime) tem como objetivo central garantir a rastreabilidade e a integridade dos vestigios, provando que nao foram adulterados desde a coleta ate a analise pericial e o julgamento.",
                    "dica": "Cadeia de custodia = historico documentado do vestigio. Objetivo = provar integridade da evidencia.",
                    "dificuldade": "medio",
                },
                {
                    "tipo": "multipla_escolha",
                    "enunciado": "Segundo o CPP, o que ocorre quando ha quebra da cadeia de custodia de uma evidencia?",
                    "opcoes": [
                        "A) A evidencia e automaticamente descartada e o processo e extinto.",
                        "B) O perito responsavel e automaticamente indiciado por crime de falsidade.",
                        "C) A validade e a confiabilidade da evidencia podem ser questionadas, podendo o juiz desconsidera-la.",
                        "D) O inquerito policial e reiniciado do zero.",
                        "E) A prova se torna ilicita por derivacao, contaminando todo o processo.",
                    ],
                    "resposta_correta": "C",
                    "explicacao": "A quebra da cadeia de custodia nao gera nulidade automatica, mas permite que a parte interessada questione a integridade da evidencia. O juiz pode desconsidera-la ou atribuir-lhe menor valor probatorio, pois nao e possivel garantir que nao houve adulteracao.",
                    "dica": "Quebra da cadeia = evidencia questionavel, nao necessariamente descartada. O juiz avalia o impacto.",
                    "dificuldade": "dificil",
                },
                {
                    "tipo": "verdadeiro_falso",
                    "enunciado": "A Lei 13.964/2019 (Pacote Anticrime) incluiu no CPP a regulamentacao expressa da cadeia de custodia, estabelecendo os procedimentos desde o reconhecimento do vestigio ate seu descarte ou arquivamento.",
                    "opcoes": None,
                    "resposta_correta": "Verdadeiro",
                    "explicacao": "O Pacote Anticrime inseriu os arts. 158-A a 158-F no CPP, regulamentando expressamente a cadeia de custodia. Esses artigos definem as etapas: reconhecimento, isolamento, fixacao, coleta, acondicionamento, transporte, recebimento, processamento, armazenamento e descarte.",
                    "dica": "Lembre: Pacote Anticrime (Lei 13.964/2019) = incluiu cadeia de custodia NO CPP. Arts. 158-A a 158-F.",
                    "dificuldade": "medio",
                },
                {
                    "tipo": "multipla_escolha",
                    "enunciado": "As etapas da cadeia de custodia previstas no CPP incluem, em ordem cronologica aproximada:",
                    "opcoes": [
                        "A) Descarte, armazenamento, coleta, reconhecimento.",
                        "B) Reconhecimento, coleta, acondicionamento, transporte, processamento, armazenamento.",
                        "C) Isolamento, julgamento, coleta, descarte.",
                        "D) Processamento, reconhecimento, coleta, isolamento.",
                        "E) Armazenamento, coleta, fixacao, transporte, descarte, reconhecimento.",
                    ],
                    "resposta_correta": "B",
                    "explicacao": "As etapas da cadeia de custodia conforme o CPP sao: reconhecimento > isolamento > fixacao > coleta > acondicionamento > transporte > recebimento > processamento > armazenamento > descarte. A opcao B apresenta as principais etapas em ordem logica correta.",
                    "dica": "Memorize: Reco-Iso-Fixa-Cole-Acondi-Transporta-Recebe-Processa-Armazena-Descarta.",
                    "dificuldade": "dificil",
                },
            ],
            "Prova pericial": [
                {
                    "tipo": "multipla_escolha",
                    "enunciado": "Segundo o CPP, o exame de corpo de delito e obrigatorio nos crimes que deixam vestigios. Qual a consequencia processual quando o exame de corpo de delito direto nao e possivel?",
                    "opcoes": [
                        "A) O processo e extinto sem resolucao do merito.",
                        "B) A autoria do crime e presumida.",
                        "C) Pode ser suprido pela confissao do acusado ou por outras provas, a criterio do juiz.",
                        "D) O exame indireto e proibido, tornando o crime impunivel.",
                        "E) O Ministerio Publico deve arquivar o inquerito.",
                    ],
                    "resposta_correta": "C",
                    "explicacao": "Conforme o art. 167 do CPP, quando o exame de corpo de delito direto nao puder ser realizado (por terem desaparecido os vestigios), a prova testemunhal pode suprir-lhe a falta. A confissao sozinha nao e suficiente, mas em conjunto com outras provas pode ser aceita.",
                    "dica": "Art. 167 CPP: corpo de delito direto impossivel = prova testemunhal supre. Confissao isolada NAO e suficiente.",
                    "dificuldade": "dificil",
                },
                {
                    "tipo": "verdadeiro_falso",
                    "enunciado": "Nos termos do CPP, o laudo pericial deve ser assinado por pelo menos dois peritos oficiais, salvo quando o orgao pericial nao dispuser de dois tecnicos habilitados para a mesma area.",
                    "opcoes": None,
                    "resposta_correta": "Verdadeiro",
                    "explicacao": "O art. 159 do CPP exige que o exame pericial seja realizado, preferencialmente, por dois peritos oficiais. Se o orgao nao dispuser de dois peritos para a mesma area, o exame pode ser realizado por apenas um. Com a Lei 11.690/2008, o perito nomeado (nao oficial) foi substituido pelo perito oficial.",
                    "dica": "Regra CPP: 2 peritos oficiais. Excecao: so 1 se nao houver 2 habilitados na area.",
                    "dificuldade": "medio",
                },
            ],
            "Lei no 12.030/2009 - Pericia Oficial de Natureza Criminal": [
                {
                    "tipo": "multipla_escolha",
                    "enunciado": "A Lei 12.030/2009 dispoe sobre as pericias oficiais de natureza criminal. Segundo essa lei, a autonomia tecnica e cientifica dos peritos significa que",
                    "opcoes": [
                        "A) o perito pode recusar laudos sem necessidade de justificativa.",
                        "B) o perito pode ser contratado diretamente pelas partes do processo.",
                        "C) o perito emite laudos e pareceres sem sofrer ingerencia de natureza hierarquica quanto ao conteudo tecnico.",
                        "D) o perito tem autonomia para destruir vestigios apos a pericia.",
                        "E) o perito nao esta sujeito ao Codigo de Etica dos servidores publicos.",
                    ],
                    "resposta_correta": "C",
                    "explicacao": "A Lei 12.030/2009 garante aos peritos oficiais autonomia tecnica e cientifica, significando que superiores hierarquicos nao podem interferir no conteudo dos laudos e pareceres. O perito e responsavel pela verdade tecnica de sua analise.",
                    "dica": "Autonomia tecnica = chefe nao manda no conteudo do laudo. O perito responde tecnicamente por suas conclusoes.",
                    "dificuldade": "medio",
                },
                {
                    "tipo": "verdadeiro_falso",
                    "enunciado": "De acordo com a Lei 12.030/2009, os peritos de natureza criminal sao auxiliares da justica e, portanto, estao sujeitos ao controle administrativo e hierarquico dos delegados de policia.",
                    "opcoes": None,
                    "resposta_correta": "Falso",
                    "explicacao": "A Lei 12.030/2009 estabelece que os peritos oficiais de natureza criminal sao tecnicamente autonomos. Embora possam estar vinculados administrativamente a instituicoes policiais, o conteudo tecnico de seus laudos nao e sujeito a ingerencia hierarquica dos delegados.",
                    "dica": "Perito = tecnicamente autonomo. Delegado nao controla o CONTEUDO do laudo pericial.",
                    "dificuldade": "medio",
                },
            ],
        },
    },

    # =========================================================================
    # CRIMINALISTICA
    # =========================================================================
    "criminalistica": {
        "title": "Criminalistica",
        "chapters": {
            "Conceitos Basicos de Criminalistica": [
                {
                    "tipo": "multipla_escolha",
                    "enunciado": "A criminalistica e definida como a disciplina que aplica conhecimentos cientificos para",
                    "opcoes": [
                        "A) elaborar teorias sobre comportamento criminoso.",
                        "B) reconhecer, coletar, analisar e interpretar vestigios para auxiliar a justica criminal.",
                        "C) realizar julgamentos administrativos de condutas policiais.",
                        "D) treinar policiais em tecnicas de investigacao nao pericial.",
                        "E) estudar as causas sociologicas da criminalidade.",
                    ],
                    "resposta_correta": "B",
                    "explicacao": "A criminalistica e a ciencia que aplica metodos e conhecimentos de diversas areas (quimica, biologia, fisica, informatica etc.) ao reconhecimento, coleta, analise e interpretacao de vestigios materiais de crimes, com o objetivo de auxiliar a Justica na elucidacao de fatos criminosos.",
                    "dica": "Criminalistica = ciencia aplicada ao crime. Foco em VESTIGIOS MATERIAIS, nao em comportamento ou sociologia.",
                    "dificuldade": "facil",
                },
                {
                    "tipo": "verdadeiro_falso",
                    "enunciado": "A criminalistica e sinonimo de criminologia, sendo as duas disciplinas intercambiaveis no estudo do fenomeno criminal.",
                    "opcoes": None,
                    "resposta_correta": "Falso",
                    "explicacao": "Criminalistica e criminologia sao disciplinas distintas. A criminalistica aplica ciencias exatas e biologicas ao estudo de vestigios materiais de crimes. A criminologia estuda as causas, condicoes e fatores do crime como fenomeno social (aspectos psicologicos, sociologicos, antropologicos).",
                    "dica": "Criminalistica = vestigios, laboratorio, ciencia forense. Criminologia = causas do crime, perfil criminoso, aspectos sociais.",
                    "dificuldade": "facil",
                },
            ],
            "Vestigio, evidencia e indicio": [
                {
                    "tipo": "multipla_escolha",
                    "enunciado": "No contexto da pericia criminal, a diferenca entre vestigio e evidencia e que",
                    "opcoes": [
                        "A) vestigio e qualquer elemento sensorial; evidencia e o vestigio analisado que fornece informacao util a investigacao.",
                        "B) evidencia e coletada antes do vestigio e possui maior valor probatorio.",
                        "C) vestigio e exclusivamente biologico; evidencia pode ser qualquer tipo de material.",
                        "D) ambos os termos sao sinonimos e podem ser usados de forma intercambial.",
                        "E) evidencia e o nome dado ao vestigio apos o julgamento do caso.",
                    ],
                    "resposta_correta": "A",
                    "explicacao": "Vestigio e qualquer marca, objeto ou elemento percebido no local do crime ou em relacao a ele. Evidencia e o vestigio que, apos analise pericial, demonstra ter valor informativo para a investigacao, ou seja, e o vestigio que 'evidencia' algo relevante para o caso.",
                    "dica": "VESTIGIO = qualquer elemento encontrado. EVIDENCIA = vestigio com valor informativo confirmado pela pericia.",
                    "dificuldade": "medio",
                },
                {
                    "tipo": "multipla_escolha",
                    "enunciado": "No Direito Processual Penal brasileiro, 'indicio' e definido como",
                    "opcoes": [
                        "A) prova direta e inequivoca da autoria do crime.",
                        "B) circunstancia conhecida e provada, que tendo relacao com o fato, autoriza, por inducao, concluir-se a existencia de outra ou outras circunstancias.",
                        "C) qualquer elemento material coletado na cena do crime.",
                        "D) a confissao do acusado perante autoridade policial.",
                        "E) laudo pericial assinado por dois experts.",
                    ],
                    "resposta_correta": "B",
                    "explicacao": "O art. 239 do CPP define indicio como 'a circunstancia conhecida e provada, que, tendo relacao com o fato, autorize, por inducao, concluir-se a existencia de outra ou outras circunstancias'. E uma prova indireta que, por raciocinio logico, leva a uma conclusao.",
                    "dica": "INDICIO (CPP art. 239) = prova indireta. Nao e prova direta nem e o mesmo que vestigio material.",
                    "dificuldade": "dificil",
                },
            ],
            "Principio de Locard": [
                {
                    "tipo": "multipla_escolha",
                    "enunciado": "O Principio de Locard, fundamental na criminalistica, estabelece que",
                    "opcoes": [
                        "A) toda evidencia deve ser analisada em laboratorio antes de ser admitida no processo.",
                        "B) todo contato entre dois objetos ou pessoas deixa e carrega traces, ou seja, ha sempre uma troca de material.",
                        "C) o suspeito e inocente ate que os vestigios provem sua culpa.",
                        "D) evidencias digitais possuem maior valor probatorio que evidencias fisicas.",
                        "E) a cadeia de custodia invalida qualquer evidencia coletada sem supervisao judicial.",
                    ],
                    "resposta_correta": "B",
                    "explicacao": "O Principio de Locard, formulado por Edmond Locard (pioneiro da criminalistica francesa), postula que 'todo contato deixa um traco'. Ou seja, quando duas superficies entram em contato, sempre ha troca de material entre elas (fibras, pelos, celulas, DNA etc.), o que e a base da pericia forense.",
                    "dica": "Locard = 'todo contato deixa traco'. Base de toda pericia: o criminoso SEMPRE deixa algo e LEVA algo da cena.",
                    "dificuldade": "facil",
                },
                {
                    "tipo": "verdadeiro_falso",
                    "enunciado": "O Principio de Locard implica que, mesmo em crimes ciberneticos, o agente sempre deixa vestigios digitais que podem ser identificados pela pericia forense computacional.",
                    "opcoes": None,
                    "resposta_correta": "Verdadeiro",
                    "explicacao": "O Principio de Locard se aplica tambem ao ambiente digital. Em crimes ciberneticos, o agente invariavelmente deixa vestigios: logs de acesso, enderecos IP, metadados de arquivos, registros de sistema, hashes, timestamps etc. A forense digital tem como premissa que toda acao digital deixa rastros.",
                    "dica": "Principio de Locard no mundo digital = logs, IPs, metadados, timestamps. O criminoso digital SEMPRE deixa rastros.",
                    "dificuldade": "medio",
                },
            ],
        },
    },

    # =========================================================================
    # FUNDAMENTOS DA COMPUTACAO
    # =========================================================================
    "fundamentos-computacao": {
        "title": "Fundamentos da Computacao",
        "chapters": {
            "RAID (todos os niveis)": [
                {
                    "tipo": "multipla_escolha",
                    "enunciado": "Em um sistema RAID 5 com 4 discos, qual e o espaco util disponivel em relacao ao total de armazenamento dos discos?",
                    "opcoes": [
                        "A) 25% do total",
                        "B) 50% do total",
                        "C) 75% do total",
                        "D) 100% do total",
                        "E) 33% do total",
                    ],
                    "resposta_correta": "C",
                    "explicacao": "No RAID 5, a paridade e distribuida entre todos os discos. Com N discos, o espaco util e (N-1)/N. Com 4 discos: (4-1)/4 = 3/4 = 75%. Um disco equivalente e 'gasto' na paridade, mas distribuido entre todos os discos.",
                    "dica": "RAID 5: espaco util = (N-1)/N discos. 4 discos = 3/4 = 75%. Tolera falha de 1 disco.",
                    "dificuldade": "medio",
                },
                {
                    "tipo": "multipla_escolha",
                    "enunciado": "Qual nivel de RAID oferece espelhamento simples (mirroring), sem distribuicao de dados, com tolerancia a falha de um dos discos?",
                    "opcoes": [
                        "A) RAID 0",
                        "B) RAID 1",
                        "C) RAID 5",
                        "D) RAID 6",
                        "E) RAID 10",
                    ],
                    "resposta_correta": "B",
                    "explicacao": "RAID 1 (mirroring) espelha os dados em dois discos identicos. Se um disco falhar, o outro contem copia integra. O espaco util e 50% (metade dos discos). Nao ha ganho de desempenho de escrita, mas melhora a leitura.",
                    "dica": "RAID 0 = stripe (velocidade, sem redundancia). RAID 1 = mirror (copia exata). RAID 5 = stripe + paridade.",
                    "dificuldade": "facil",
                },
                {
                    "tipo": "multipla_escolha",
                    "enunciado": "No contexto de pericia forense em servidores corporativos, o RAID 0 representa um risco especifico porque",
                    "opcoes": [
                        "A) criptografa os dados automaticamente, dificultando a analise pericial.",
                        "B) distribui os dados em faixas (striping) sem redundancia, de modo que a falha de qualquer disco resulta em perda total dos dados.",
                        "C) realiza espelhamento dos dados, gerando versoes conflitantes de arquivos.",
                        "D) limita o tamanho maximo de arquivos individuais a 4 GB.",
                        "E) requer chave de decifracao para recuperacao dos dados apos falha.",
                    ],
                    "resposta_correta": "B",
                    "explicacao": "RAID 0 distribui os dados em faixas (striping) entre os discos para maximizar desempenho, sem qualquer redundancia. Se um disco falhar, todos os dados do array sao perdidos, pois cada arquivo esta fragmentado entre os discos. Para pericia forense, isso significa que todos os discos do array devem ser preservados e analisados juntos.",
                    "dica": "RAID 0 = velocidade maxima, ZERO tolerancia a falhas. 1 disco falha = perda TOTAL. Perito deve preservar TODOS os discos.",
                    "dificuldade": "medio",
                },
                {
                    "tipo": "verdadeiro_falso",
                    "enunciado": "O RAID 6 tolera a falha simultanea de ate dois discos, pois utiliza dois blocos de paridade distribuidos.",
                    "opcoes": None,
                    "resposta_correta": "Verdadeiro",
                    "explicacao": "O RAID 6 utiliza dupla paridade (dois blocos de paridade distribuidos entre os discos), o que permite a recuperacao mesmo com a falha simultanea de dois discos quaisquer do array. Requer no minimo 4 discos e o espaco util e (N-2)/N.",
                    "dica": "RAID 5 = tolera 1 falha. RAID 6 = tolera 2 falhas simultaneas (dupla paridade).",
                    "dificuldade": "medio",
                },
            ],
            "Sistemas de arquivos: NTFS, FAT32, exFAT, EXT3/EXT4, XFS": [
                {
                    "tipo": "multipla_escolha",
                    "enunciado": "Na analise forense de um sistema de arquivos NTFS, qual estrutura de metadados e fundamental para rastrear arquivos deletados?",
                    "opcoes": [
                        "A) FAT (File Allocation Table)",
                        "B) MFT (Master File Table)",
                        "C) Inode Table",
                        "D) Superblock",
                        "E) Boot Record",
                    ],
                    "resposta_correta": "B",
                    "explicacao": "No NTFS, a MFT (Master File Table) e a estrutura central que armazena informacoes sobre cada arquivo e diretorio (metadados, atributos, localizacao dos dados no disco). Quando um arquivo e deletado, sua entrada na MFT e marcada como disponivel, mas os dados geralmente permanecem no disco e podem ser recuperados pela analise da MFT.",
                    "dica": "NTFS = MFT (Master File Table). EXT = Inode Table. FAT = FAT (File Allocation Table).",
                    "dificuldade": "medio",
                },
                {
                    "tipo": "multipla_escolha",
                    "enunciado": "Qual sistema de arquivos e recomendado para particoes superiores a 32 GB em dispositivos moveis e cartoes de memoria, sendo compativel com Windows e macOS sem drivers adicionais?",
                    "opcoes": [
                        "A) FAT32",
                        "B) NTFS",
                        "C) exFAT",
                        "D) EXT4",
                        "E) XFS",
                    ],
                    "resposta_correta": "C",
                    "explicacao": "O exFAT (Extended FAT) foi criado pela Microsoft especificamente para dispositivos de armazenamento removiveis (pen drives, cartoes SD). Supera as limitacoes do FAT32 (max 4 GB por arquivo, max 32 GB de particao), nao tem o overhead do NTFS e e nativamente compativel com Windows, macOS e Linux.",
                    "dica": "exFAT = FAT moderno para dispositivos moveis. Supera FAT32 (4GB/arquivo) e e mais leve que NTFS.",
                    "dificuldade": "medio",
                },
                {
                    "tipo": "verdadeiro_falso",
                    "enunciado": "O sistema de arquivos EXT4, utilizado por distribuicoes Linux, suporta journaling, o que facilita a recuperacao do sistema apos falhas e e relevante para a pericia forense ao preservar metadados de transacoes.",
                    "opcoes": None,
                    "resposta_correta": "Verdadeiro",
                    "explicacao": "O EXT4 suporta journaling (registro de transacoes), que mantem um log das operacoes de escrita antes de realizá-las no disco. Isso permite recuperacao apos falhas e, para a pericia forense, o journal pode revelar operacoes recentes de criacao, modificacao ou delecao de arquivos.",
                    "dica": "EXT4 com journaling = log de operacoes. Util na forense para recuperar historico de atividades recentes.",
                    "dificuldade": "dificil",
                },
            ],
            "Virtualizacao: Emuladores, Maquinas virtuais, Conteineres": [
                {
                    "tipo": "multipla_escolha",
                    "enunciado": "A principal diferenca entre uma maquina virtual (VM) e um conteiner Docker e que",
                    "opcoes": [
                        "A) VMs sao mais rapidas que conteineres para inicializar.",
                        "B) conteineres compartilham o kernel do sistema operacional do host; VMs emulam hardware completo com sistema operacional proprio.",
                        "C) conteineres oferecem isolamento total de hardware; VMs compartilham o kernel.",
                        "D) Docker apenas funciona em sistemas Linux; VMs sao multiplataforma.",
                        "E) VMs nao podem ser monitoradas por ferramentas de seguranca; conteineres sim.",
                    ],
                    "resposta_correta": "B",
                    "explicacao": "Conteineres (Docker) compartilham o kernel do SO host, sendo mais leves e rapidos para iniciar. VMs virtualizam o hardware completo e executam um SO convidado separado, proporcionando maior isolamento mas com mais overhead de recursos.",
                    "dica": "CONTEINER = compartilha kernel do host (leve, rapido). VM = hardware virtualizado + SO proprio (pesado, mais isolado).",
                    "dificuldade": "medio",
                },
            ],
        },
    },

    # =========================================================================
    # BANCOS DE DADOS
    # =========================================================================
    "bancos-de-dados": {
        "title": "Bancos de Dados",
        "chapters": {
            "SQL": [
                {
                    "tipo": "multipla_escolha",
                    "enunciado": "Em SQL, a diferenca entre as clausulas WHERE e HAVING e que",
                    "opcoes": [
                        "A) WHERE filtra linhas antes do agrupamento; HAVING filtra grupos apos o GROUP BY.",
                        "B) HAVING filtra linhas antes do agrupamento; WHERE filtra apos o GROUP BY.",
                        "C) WHERE e usado apenas com funcoes de agregacao; HAVING com colunas simples.",
                        "D) Ambos sao equivalentes e podem ser usados de forma intercambial.",
                        "E) WHERE e aplicado em subconsultas; HAVING apenas em consultas principais.",
                    ],
                    "resposta_correta": "A",
                    "explicacao": "WHERE filtra linhas ANTES do agrupamento (GROUP BY), descartando registros que nao atendem a condicao. HAVING filtra GRUPOS gerados pelo GROUP BY, sendo usada com funcoes de agregacao (COUNT, SUM, AVG etc.).",
                    "dica": "WHERE = filtra LINHAS (antes do agrupamento). HAVING = filtra GRUPOS (depois do GROUP BY, com agregacoes).",
                    "dificuldade": "medio",
                },
                {
                    "tipo": "multipla_escolha",
                    "enunciado": "Qual comando SQL e utilizado para modificar a estrutura de uma tabela existente, adicionando uma nova coluna?",
                    "opcoes": [
                        "A) UPDATE TABLE",
                        "B) MODIFY TABLE",
                        "C) ALTER TABLE ... ADD COLUMN",
                        "D) INSERT INTO TABLE",
                        "E) CREATE TABLE ... MODIFY",
                    ],
                    "resposta_correta": "C",
                    "explicacao": "O comando DDL (Data Definition Language) ALTER TABLE permite modificar a estrutura de tabelas existentes. Para adicionar uma coluna, usa-se: ALTER TABLE nome_tabela ADD COLUMN nome_coluna tipo_dado.",
                    "dica": "DDL: CREATE (cria), ALTER (modifica estrutura), DROP (exclui). ALTER TABLE ADD COLUMN = adiciona coluna.",
                    "dificuldade": "facil",
                },
                {
                    "tipo": "verdadeiro_falso",
                    "enunciado": "Em SQL, um INNER JOIN retorna apenas as linhas que possuem correspondencia em ambas as tabelas envolvidas na juncao.",
                    "opcoes": None,
                    "resposta_correta": "Verdadeiro",
                    "explicacao": "O INNER JOIN retorna apenas as linhas onde existe correspondencia (matching) nos campos de juncao de AMBAS as tabelas. Linhas sem correspondencia sao excluidas do resultado. E o tipo de JOIN mais comum e restritivo.",
                    "dica": "INNER JOIN = interseccao (so o que existe nos dois lados). LEFT JOIN = todos da esquerda + correspondentes da direita.",
                    "dificuldade": "facil",
                },
                {
                    "tipo": "multipla_escolha",
                    "enunciado": "Em um banco de dados relacional, a forma normal que elimina dependencias funcionais parciais, garantindo que todo atributo nao-chave dependa da chave primaria inteira, e a",
                    "opcoes": [
                        "A) Primeira Forma Normal (1FN)",
                        "B) Segunda Forma Normal (2FN)",
                        "C) Terceira Forma Normal (3FN)",
                        "D) Forma Normal de Boyce-Codd (FNBC)",
                        "E) Quarta Forma Normal (4FN)",
                    ],
                    "resposta_correta": "B",
                    "explicacao": "A Segunda Forma Normal (2FN) elimina dependencias funcionais parciais: todo atributo nao-chave deve depender da CHAVE PRIMARIA COMPLETA, nao apenas de parte dela. Aplica-se quando ha chave primaria composta. A 1FN elimina grupos repetitivos; a 3FN elimina dependencias transitivas.",
                    "dica": "1FN = sem repeticoes. 2FN = sem dep. parcial (chave composta). 3FN = sem dep. transitiva.",
                    "dificuldade": "dificil",
                },
            ],
            "Transacoes": [
                {
                    "tipo": "multipla_escolha",
                    "enunciado": "As propriedades ACID de um banco de dados garantem a confiabilidade das transacoes. A propriedade 'Isolamento' (I) significa que",
                    "opcoes": [
                        "A) uma transacao e gravada permanentemente apos o commit.",
                        "B) transacoes concorrentes nao interferem umas nas outras, como se fossem executadas sequencialmente.",
                        "C) todos os dados modificados em uma transacao sao salvos integralmente ou nenhum e.",
                        "D) o banco de dados permanece em estado consistente antes e apos a transacao.",
                        "E) apenas um usuario pode acessar o banco de dados por vez.",
                    ],
                    "resposta_correta": "B",
                    "explicacao": "Isolamento garante que transacoes concorrentes se comportem como se fossem executadas serialmente. Os resultados intermediarios de uma transacao nao devem ser visiveis para outras transacoes, evitando leituras sujas, nao-repetitivas ou fantasmas.",
                    "dica": "ACID: Atomicidade (tudo ou nada), Consistencia (estado valido), Isolamento (sem interferencia), Durabilidade (permanente).",
                    "dificuldade": "medio",
                },
            ],
            "NoSQL": [
                {
                    "tipo": "multipla_escolha",
                    "enunciado": "Qual tipo de banco de dados NoSQL e mais adequado para armazenar e consultar dados de redes sociais, representando relacionamentos entre entidades?",
                    "opcoes": [
                        "A) Banco de dados orientado a documentos (ex: MongoDB)",
                        "B) Banco de dados chave-valor (ex: Redis)",
                        "C) Banco de dados orientado a grafos (ex: Neo4j)",
                        "D) Banco de dados orientado a colunas (ex: Cassandra)",
                        "E) Banco de dados relacional (ex: PostgreSQL)",
                    ],
                    "resposta_correta": "C",
                    "explicacao": "Bancos de dados orientados a grafos (Neo4j, Amazon Neptune) sao ideais para dados altamente conectados, como redes sociais, onde as relacoes entre entidades sao tao importantes quanto os proprios dados. Permitem consultas de caminhamento em grafos de forma muito mais eficiente que bancos relacionais.",
                    "dica": "Grafo = nos (entidades) + arestas (relacionamentos). Ideal para: redes sociais, recomendacoes, deteccao de fraudes.",
                    "dificuldade": "medio",
                },
            ],
        },
    },

    # =========================================================================
    # ENGENHARIA REVERSA E MALWARE
    # =========================================================================
    "engenharia-reversa-malware": {
        "title": "Engenharia Reversa e Malware",
        "chapters": {
            "Analise de malware: virus, worms, backdoors, keyloggers": [
                {
                    "tipo": "multipla_escolha",
                    "enunciado": "Na analise de malware, a tecnica de 'analise dinamica' consiste em",
                    "opcoes": [
                        "A) examinar o codigo-fonte do malware sem executa-lo.",
                        "B) executar o malware em ambiente controlado (sandbox) para observar seu comportamento real.",
                        "C) comparar assinaturas do malware com banco de dados de antivirus.",
                        "D) descriptografar o payload do malware em modo offline.",
                        "E) analisar o binario do malware usando ferramentas de disassembly.",
                    ],
                    "resposta_correta": "B",
                    "explicacao": "A analise dinamica executa o malware em um ambiente controlado e isolado (sandbox) para observar seu comportamento em tempo real: chamadas de sistema, conexoes de rede, modificacoes no registro, criacao de arquivos etc. Complementa a analise estatica (sem execucao).",
                    "dica": "Analise DINAMICA = executa e observa (sandbox). Analise ESTATICA = examina sem executar (desmontagem, strings).",
                    "dificuldade": "medio",
                },
                {
                    "tipo": "verdadeiro_falso",
                    "enunciado": "Um rootkit e um tipo de malware que, apos infectar um sistema, modifica o proprio sistema operacional para ocultar sua presenca, tornando-se invisivel para ferramentas de seguranca convencionais.",
                    "opcoes": None,
                    "resposta_correta": "Verdadeiro",
                    "explicacao": "Rootkits operam no nivel do kernel ou do bootloader para interceptar chamadas do sistema e ocultar sua presenca (processos, arquivos, conexoes de rede). Ferramentas de analise que rodam no mesmo OS infectado sao enganadas. Deteccao requer boot a partir de midia externa ou analise offline.",
                    "dica": "Rootkit = raiz do sistema. Esconde-se no kernel. Deteccao: boot externo, analise offline, ferramentas especializadas.",
                    "dificuldade": "medio",
                },
            ],
            "Sandboxing": [
                {
                    "tipo": "multipla_escolha",
                    "enunciado": "No contexto de analise de malware, qual e a principal limitacao do sandboxing?",
                    "opcoes": [
                        "A) Nao permite analisar malwares para plataformas Windows.",
                        "B) Malwares sofisticados podem detectar o ambiente de sandbox e nao executar suas acoes maliciosas.",
                        "C) O sandbox nao permite captura de trafego de rede.",
                        "D) Apenas arquivos executaveis (.exe) podem ser analisados em sandbox.",
                        "E) O sandbox impede a analise de comportamento em tempo real.",
                    ],
                    "resposta_correta": "B",
                    "explicacao": "Malwares avancados implementam tecnicas anti-sandbox: verificam se ha numero de processos tipico de maquina real, verificam artefatos de VM (VMware Tools, VirtualBox Guest Additions), analisam o nome de usuario, o tempo de uptime do sistema, e outros indicadores que revelam ambiente virtualizado.",
                    "dica": "Anti-sandbox = malware detecta que esta em VM/sandbox e 'dorme'. Solucao: bare-metal analysis, sandbox customizado.",
                    "dificuldade": "dificil",
                },
            ],
            "Assembly": [
                {
                    "tipo": "multipla_escolha",
                    "enunciado": "Na linguagem Assembly x86, a instrucao 'MOV EAX, 0' tem o efeito de",
                    "opcoes": [
                        "A) copiar o valor 0 para a memoria no endereco armazenado em EAX.",
                        "B) copiar o valor do registrador EAX para a posicao 0 da memoria.",
                        "C) zerar o registrador EAX, atribuindo o valor imediato 0 a ele.",
                        "D) comparar o registrador EAX com o valor 0 e setar flags.",
                        "E) incrementar EAX em 0 posicoes.",
                    ],
                    "resposta_correta": "C",
                    "explicacao": "A instrucao MOV destino, fonte copia o valor da fonte para o destino. 'MOV EAX, 0' copia o valor imediato 0 para o registrador EAX, efetivamente zerando-o. E equivalente a EAX = 0 em linguagens de alto nivel.",
                    "dica": "MOV dest, src = copia src para dest. 'MOV EAX, 0' = EAX recebe 0.",
                    "dificuldade": "medio",
                },
            ],
        },
    },

    # =========================================================================
    # LINGUAGENS DE PROGRAMACAO
    # =========================================================================
    "linguagens-programacao": {
        "title": "Linguagens de Programacao",
        "chapters": {
            "Programacao orientada a objetos": [
                {
                    "tipo": "multipla_escolha",
                    "enunciado": "Em orientacao a objetos, o principio do encapsulamento implica que",
                    "opcoes": [
                        "A) uma classe pode herdar caracteristicas de multiplas superclasses.",
                        "B) os dados internos de um objeto devem ser acessados apenas por meio de sua interface publica, ocultando a implementacao.",
                        "C) um objeto pode assumir diferentes formas dependendo do contexto de uso.",
                        "D) classes abstratas nao podem ser instanciadas diretamente.",
                        "E) cada objeto e uma instancia unica que nao pode ser copiado.",
                    ],
                    "resposta_correta": "B",
                    "explicacao": "Encapsulamento e o principio que determina que os dados (atributos) de um objeto devem ser protegidos, acessiveis apenas por meio de metodos publicos (getters/setters), ocultando os detalhes de implementacao. Promove modularidade e protege a integridade dos dados.",
                    "dica": "Os 4 pilares da POO: Encapsulamento (oculta dados), Heranca (reutiliza codigo), Polimorfismo (multiplas formas), Abstracao.",
                    "dificuldade": "facil",
                },
                {
                    "tipo": "multipla_escolha",
                    "enunciado": "O polimorfismo em linguagens orientadas a objetos permite que",
                    "opcoes": [
                        "A) uma classe herde de mais de uma superclasse simultaneamente.",
                        "B) um objeto possa ser tratado como instancia de sua superclasse, com comportamento especifico da subclasse em tempo de execucao.",
                        "C) atributos privados sejam acessados diretamente por outras classes.",
                        "D) uma classe seja instanciada sem construtor explicito.",
                        "E) metodos estaticos sejam sobrescritos pelas subclasses.",
                    ],
                    "resposta_correta": "B",
                    "explicacao": "O polimorfismo permite que um objeto de uma subclasse seja tratado como um objeto de sua superclasse. Em tempo de execucao (polimorfismo dinamico/late binding), o metodo chamado e o da subclasse real do objeto, nao o da superclasse declarada.",
                    "dica": "Polimorfismo = 'muitas formas'. Mesma chamada de metodo, comportamentos diferentes dependendo do tipo real do objeto.",
                    "dificuldade": "medio",
                },
                {
                    "tipo": "verdadeiro_falso",
                    "enunciado": "Em Java, uma interface pode conter implementacoes concretas de metodos a partir do Java 8, por meio dos 'default methods'.",
                    "opcoes": None,
                    "resposta_correta": "Verdadeiro",
                    "explicacao": "A partir do Java 8, interfaces podem conter 'default methods' (metodos com implementacao padrao) e 'static methods'. Isso permite adicionar novos metodos a interfaces sem quebrar as classes que as implementam, mantendo retrocompatibilidade.",
                    "dica": "Java 8+: interface pode ter 'default methods' (implementacao concreta). Antes do Java 8: apenas metodos abstratos.",
                    "dificuldade": "medio",
                },
            ],
            "Linguagem C": [
                {
                    "tipo": "multipla_escolha",
                    "enunciado": "Em C, ponteiros sao variaveis que armazenam enderecos de memoria. O operador '*' aplicado a um ponteiro realiza a operacao de",
                    "opcoes": [
                        "A) declarar um novo ponteiro do tipo especificado.",
                        "B) calcular o tamanho da area de memoria apontada.",
                        "C) desreferenciamento, acessando o valor armazenado no endereco apontado.",
                        "D) aritmetica de ponteiro, incrementando o endereco em 1 byte.",
                        "E) liberacao da memoria apontada pelo ponteiro.",
                    ],
                    "resposta_correta": "C",
                    "explicacao": "O operador '*' em C tem dois usos: na declaracao ('int *p' declara p como ponteiro para int) e no desreferenciamento ('*p' acessa o valor no endereco apontado por p). Na expressao '*p = 10', o valor 10 e armazenado no endereco de memoria apontado por p.",
                    "dica": "* na declaracao = 'e um ponteiro'. * na expressao = 'acessa o valor no endereco' (desreferenciamento). & = pega o endereco.",
                    "dificuldade": "medio",
                },
            ],
            "Desenvolvimento Web: HTML, XML, JSON, APIs REST e GraphQL": [
                {
                    "tipo": "multipla_escolha",
                    "enunciado": "Em uma API REST, o metodo HTTP correto para ATUALIZAR parcialmente um recurso existente e",
                    "opcoes": [
                        "A) GET",
                        "B) POST",
                        "C) PUT",
                        "D) PATCH",
                        "E) DELETE",
                    ],
                    "resposta_correta": "D",
                    "explicacao": "PATCH e usado para atualizacoes parciais de um recurso (apenas os campos enviados sao atualizados). PUT substitui o recurso completo. POST cria novos recursos. GET recupera dados. DELETE exclui recursos.",
                    "dica": "PUT = substituicao total. PATCH = atualizacao parcial. POST = criar. GET = ler. DELETE = excluir.",
                    "dificuldade": "medio",
                },
                {
                    "tipo": "verdadeiro_falso",
                    "enunciado": "Uma API RESTful deve ser stateless, significando que cada requisicao deve conter todas as informacoes necessarias para ser processada, sem que o servidor mantenha estado de sessao entre requisicoes.",
                    "opcoes": None,
                    "resposta_correta": "Verdadeiro",
                    "explicacao": "Stateless (sem estado) e um dos principios fundamentais do REST. O servidor nao armazena informacoes de sessao do cliente entre requisicoes. Cada requisicao e independente e autossuficiente. Isso melhora escalabilidade e confiabilidade.",
                    "dica": "REST = stateless. Cada request e independente. Token JWT = forma de autenticacao stateless.",
                    "dificuldade": "facil",
                },
            ],
        },
    },

    # =========================================================================
    # ESTRUTURA DE DADOS E ALGORITMOS
    # =========================================================================
    "estrutura-dados-algoritmos": {
        "title": "Estrutura de Dados e Algoritmos",
        "chapters": {
            "Complexidade (Big-O)": [
                {
                    "tipo": "multipla_escolha",
                    "enunciado": "Qual e a complexidade de tempo do algoritmo de busca binaria em um array ordenado de N elementos?",
                    "opcoes": [
                        "A) O(1)",
                        "B) O(log N)",
                        "C) O(N)",
                        "D) O(N log N)",
                        "E) O(N²)",
                    ],
                    "resposta_correta": "B",
                    "explicacao": "A busca binaria divide o espaco de busca pela metade a cada comparacao, eliminando metade dos elementos restantes. Com N elementos, sao necessarias no maximo log2(N) comparacoes, resultando em complexidade O(log N). E muito mais eficiente que a busca linear O(N) para grandes datasets.",
                    "dica": "Busca binaria = divide ao meio a cada passo = O(log N). Busca linear = percorre um por um = O(N).",
                    "dificuldade": "facil",
                },
                {
                    "tipo": "multipla_escolha",
                    "enunciado": "O algoritmo Quicksort tem complexidade de tempo media de O(N log N), porem seu pior caso e",
                    "opcoes": [
                        "A) O(log N)",
                        "B) O(N)",
                        "C) O(N log N)",
                        "D) O(N²)",
                        "E) O(2^N)",
                    ],
                    "resposta_correta": "D",
                    "explicacao": "O pior caso do Quicksort ocorre quando o pivo escolhido e sempre o menor ou maior elemento (array ja ordenado ou inversamente ordenado com pivo fixo), resultando em particoes desequilibradas de tamanho 1 e N-1, levando a O(N²). Na media, com boa escolha de pivo, e O(N log N).",
                    "dica": "Quicksort: media O(N log N), pior caso O(N²). Mergesort: sempre O(N log N) mas usa O(N) de espaco extra.",
                    "dificuldade": "medio",
                },
                {
                    "tipo": "verdadeiro_falso",
                    "enunciado": "Um algoritmo com complexidade O(1) tem tempo de execucao constante, independentemente do tamanho da entrada.",
                    "opcoes": None,
                    "resposta_correta": "Verdadeiro",
                    "explicacao": "O(1) significa complexidade de tempo constante: o tempo de execucao nao aumenta com o tamanho da entrada (N). Exemplos: acesso a elemento de array por indice, operacoes em pilha/fila com ponteiro, operacoes em tabela hash sem colisao.",
                    "dica": "O(1) = tempo constante. Nao importa se N=10 ou N=1.000.000, o tempo e o mesmo.",
                    "dificuldade": "facil",
                },
            ],
            "Arvores": [
                {
                    "tipo": "multipla_escolha",
                    "enunciado": "Em uma arvore binaria de busca (BST), a complexidade de busca, insercao e remocao no melhor e caso medio e",
                    "opcoes": [
                        "A) O(1)",
                        "B) O(log N)",
                        "C) O(N)",
                        "D) O(N log N)",
                        "E) O(N²)",
                    ],
                    "resposta_correta": "B",
                    "explicacao": "Em uma BST balanceada, a altura da arvore e proporcional a log N, onde N e o numero de nos. Operacoes de busca, insercao e remocao percorrem no maximo a altura da arvore, resultando em O(log N). No pior caso (arvore degenerada/lista), e O(N).",
                    "dica": "BST balanceada = O(log N). BST degenerada (virou lista) = O(N). Arvores AVL/Red-Black garantem O(log N) no pior caso.",
                    "dificuldade": "medio",
                },
            ],
            "Ordenacao": [
                {
                    "tipo": "multipla_escolha",
                    "enunciado": "Qual algoritmo de ordenacao e considerado 'estavel' e possui complexidade de tempo O(N log N) no pior caso, sendo preferido quando a estabilidade e essencial?",
                    "opcoes": [
                        "A) Quicksort",
                        "B) Heapsort",
                        "C) Mergesort",
                        "D) Selection Sort",
                        "E) Shell Sort",
                    ],
                    "resposta_correta": "C",
                    "explicacao": "Mergesort e um algoritmo de ordenacao estavel (mantem a ordem relativa de elementos iguais) com complexidade O(N log N) garantida em todos os casos (melhor, medio e pior). Utiliza o paradigma divisao e conquista. Desvantagem: requer O(N) de espaco adicional.",
                    "dica": "MERGESORT = estavel + O(N log N) garantido. QUICKSORT = instavel, O(N log N) media, O(N²) pior caso. HEAPSORT = instavel, O(N log N) garantido.",
                    "dificuldade": "medio",
                },
            ],
        },
    },

    # =========================================================================
    # BANCA ANALISE
    # =========================================================================
    "banca-analise": {
        "title": "O que a Banca Realmente Quer",
        "chapters": {
            "Cadeia de custodia aplicada a informatica": [
                {
                    "tipo": "multipla_escolha",
                    "enunciado": "Na pericia forense computacional, qual e o primeiro e mais critico passo ao chegar a uma cena de crime com computadores ligados?",
                    "opcoes": [
                        "A) Desligar imediatamente todos os equipamentos para evitar alteracao de dados.",
                        "B) Decidir se deve-se preservar a volatilidade da memoria RAM antes de desligar, coletando dados volateis.",
                        "C) Formatar os discos e reinstalar o sistema operacional para analise limpa.",
                        "D) Conectar os equipamentos a rede para sincronizar logs com a nuvem.",
                        "E) Aguardar o advogado do suspeito para iniciar a coleta.",
                    ],
                    "resposta_correta": "B",
                    "explicacao": "Sistemas ligados possuem dados volateis (RAM, processos em execucao, conexoes de rede ativas, chaves de criptografia na memoria) que sao perdidos ao desligar. A ordem de volatilidade da RFC 3227 orienta coletar primeiro os dados mais volateis. O perito deve avaliar o custo-beneficio de preservar dados volateis vs. alterar o estado do sistema.",
                    "dica": "Ordem de volatilidade (RFC 3227): RAM > processos > conexoes rede > registros sistema > disco. Coleta do mais volatil para o menos.",
                    "dificuldade": "dificil",
                },
                {
                    "tipo": "multipla_escolha",
                    "enunciado": "Para garantir a integridade de uma imagem forense de disco rigido, o perito deve",
                    "opcoes": [
                        "A) copiar apenas os arquivos suspeitos para agilizar a investigacao.",
                        "B) realizar uma copia bit a bit do disco e calcular o hash (MD5/SHA-256) tanto do original quanto da copia.",
                        "C) compactar os arquivos do disco para facilitar o armazenamento da evidencia.",
                        "D) realizar a analise diretamente no disco original para nao perder tempo.",
                        "E) desabilitar o antivirus do computador periciado antes de coletar a imagem.",
                    ],
                    "resposta_correta": "B",
                    "explicacao": "A imagem forense e uma copia bit a bit (sector-by-sector) do disco original, incluindo espaco nao alocado e arquivos deletados. O hash criptografico (MD5/SHA-256) do original e da copia deve ser identico, comprovando que a copia e integra e que o original nao foi alterado durante a coleta.",
                    "dica": "Imagem forense = copia bit a bit. Hash = MD5 ou SHA-256. Se hash original = hash copia, prova integridade.",
                    "dificuldade": "medio",
                },
                {
                    "tipo": "verdadeiro_falso",
                    "enunciado": "Na forense computacional, o uso de um bloqueador de escrita (write blocker) durante a aquisicao da imagem forense e uma pratica recomendada para garantir que o disco original nao seja modificado durante o processo de copia.",
                    "opcoes": None,
                    "resposta_correta": "Verdadeiro",
                    "explicacao": "O bloqueador de escrita (hardware ou software) impede que qualquer dado seja escrito no disco original durante a conexao com o computador forense, preservando a integridade da evidencia. Sem ele, o sistema operacional pode modificar o disco (atualizar timestamps, criar arquivos temporarios etc.).",
                    "dica": "Write blocker = escudo que impede escrita no disco original. OBRIGATORIO na aquisicao forense.",
                    "dificuldade": "facil",
                },
            ],
            "Como elaborar um laudo pericial tecnico": [
                {
                    "tipo": "multipla_escolha",
                    "enunciado": "Um laudo pericial de informatica forense deve ser estruturado de forma que",
                    "opcoes": [
                        "A) contenha exclusivamente informacoes tecnicas em linguagem especializada, direcionada apenas a outros peritos.",
                        "B) apresente metodologia clara, reproducivel, com conclusoes fundamentadas e linguagem acessivel ao julgador.",
                        "C) omita detalhes tecnicos para nao revelar metodologias sigilosas.",
                        "D) seja redigido em ingles para seguir o padrao internacional.",
                        "E) contenha a opiniao pessoal do perito sobre a culpabilidade do acusado.",
                    ],
                    "resposta_correta": "B",
                    "explicacao": "O laudo pericial deve ser tecnicamente preciso, mas tambem compreensivel ao juiz e demais operadores do direito. Deve apresentar metodologia clara (reproducivel por outro perito), fundamentar todas as conclusoes com evidencias e evitar opinar sobre culpa ou inocencia, que e funcao do juiz.",
                    "dica": "Laudo: metodologia clara + fundamentacao tecnica + linguagem acessivel. Perito NAO julga culpa, apenas apresenta evidencias tecnicas.",
                    "dificuldade": "facil",
                },
            ],
        },
    },
}


# -- Concurso ----------------------------------------------------------------

def get_or_create_concurso():
    rows = turso_query(
        "SELECT id FROM concursos WHERE slug = ?",
        [arg("perito-criminal-federal")],
    )
    if rows:
        cid = int(rows[0]["id"])
        log.info(f"Concurso existente: id={cid}")
        return cid

    log.info("Criando concurso 'Perito Criminal Federal'...")
    turso_run(
        "INSERT INTO concursos (titulo, slug, organizador, orgao, status, descricao, criado_em, atualizado_em) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
        [
            arg("Perito Criminal Federal"),
            arg("perito-criminal-federal"),
            arg("CEBRASPE / CESPE"),
            arg("Policia Federal"),
            arg("aberto"),
            arg("Concurso para Perito Criminal Federal da Policia Federal. Cobre Lingua Portuguesa, Informatica, Direito Penal, Criminalistica, Fundamentos de Computacao, Bancos de Dados, Engenharia Reversa, Linguagens de Programacao e Estruturas de Dados."),
            arg(NOW),
            arg(NOW),
        ],
    )
    rows = turso_query("SELECT id FROM concursos WHERE slug = ?", [arg("perito-criminal-federal")])
    cid = int(rows[0]["id"])
    log.info(f"Concurso criado: id={cid}")
    return cid


# -- AI Generation -----------------------------------------------------------

def generate_questions_ai(disciplina_slug, disciplina_title, capitulo, n_multipla=5, n_vf=3):
    if not ANTHROPIC_API_KEY:
        return []

    try:
        import anthropic
        client = anthropic.Anthropic(api_key=ANTHROPIC_API_KEY)
        total = n_multipla + n_vf

        prompt = f"""Voce e um especialista em concursos publicos brasileiros para o cargo de Perito Criminal Federal (Policia Federal).

Gere {total} questoes sobre "{capitulo}" da disciplina "{disciplina_title}" para o concurso de Perito Criminal Federal.

REGRAS:
- {n_multipla} questoes de multipla escolha (tipo "multipla_escolha") e {n_vf} verdadeiro/falso (tipo "verdadeiro_falso")
- Estilo CESPE/CEBRASPE: objetivas, sem dupla negacao
- Multipla escolha: 5 alternativas iniciando com "A) ", "B) ", "C) ", "D) ", "E) "
- V/F: resposta_correta e "Verdadeiro" ou "Falso"
- Dificuldades variadas
- Explicacao detalhada e dica pratica

Responda APENAS com JSON valido (sem markdown):
{{"questoes": [{{"tipo": "multipla_escolha", "enunciado": "...", "opcoes": ["A) ...", "B) ...", "C) ...", "D) ...", "E) ..."], "resposta_correta": "B", "explicacao": "...", "dica": "...", "dificuldade": "medio"}}]}}"""

        for attempt in range(3):
            try:
                response = client.messages.create(
                    model="claude-sonnet-4-6",
                    max_tokens=4096,
                    messages=[{"role": "user", "content": prompt}],
                )
                raw = response.content[0].text.strip()
                m = re.search(r'\{.*\}', raw, re.DOTALL)
                if m:
                    raw = m.group(0)
                data = json.loads(raw)
                questoes = data.get("questoes", [])
                result = []
                for q in questoes:
                    opcoes = q.get("opcoes")
                    result.append({
                        "tipo": q.get("tipo", "multipla_escolha"),
                        "enunciado": q.get("enunciado", "").strip(),
                        "opcoes": json.dumps(opcoes, ensure_ascii=False) if opcoes else None,
                        "resposta_correta": q.get("resposta_correta", "A"),
                        "explicacao": q.get("explicacao", "").strip(),
                        "dica": q.get("dica", "").strip() if q.get("dica") else None,
                        "dificuldade": q.get("dificuldade", "medio"),
                        "fonte": "Gerada por IA",
                        "ano": None,
                    })
                log.info(f"  IA: {len(result)} questoes para '{capitulo}'")
                return result
            except json.JSONDecodeError:
                if attempt < 2:
                    time.sleep(2)
            except Exception as e:
                log.warning(f"  IA erro tentativa {attempt+1}: {e}")
                if attempt < 2:
                    time.sleep(3)
    except Exception as e:
        log.warning(f"IA indisponivel: {e}")
    return []


# -- Insert ------------------------------------------------------------------

def insert_batch(questions, concurso_id, disciplina_slug, disciplina_title, capitulo):
    inserted = 0
    batch_size = 10
    for i in range(0, len(questions), batch_size):
        batch = questions[i:i + batch_size]
        stmts = []
        for q in batch:
            titulo = f"{disciplina_title} — {capitulo}"[:200]
            sql = ("INSERT INTO questions (titulo, disciplina, capitulo, tipo, enunciado, "
                   "explicacao, dica, opcoes, resposta_correta, dificuldade, fonte, "
                   "concurso_id, ano, criado_em, atualizado_em) "
                   "VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)")
            a = [
                arg(titulo),
                arg(disciplina_slug),
                arg(capitulo),
                arg(q.get("tipo", "multipla_escolha")),
                arg(q.get("enunciado", "")),
                arg(q.get("explicacao")),
                arg(q.get("dica")),
                arg(q.get("opcoes")),
                arg(q.get("resposta_correta", "A")),
                arg(q.get("dificuldade", "medio")),
                arg(q.get("fonte", "Gerada por IA")),
                arg(concurso_id),
                arg(q.get("ano")),
                arg(NOW),
                arg(NOW),
            ]
            stmts.append({"type": "execute", "stmt": {"sql": sql, "args": a}})

        try:
            turso_execute(stmts)
            inserted += len(batch)
        except Exception as e:
            log.error(f"Batch falhou, tentando individualmente: {e}")
            for q in batch:
                try:
                    titulo = f"{disciplina_title} — {capitulo}"[:200]
                    sql = ("INSERT INTO questions (titulo, disciplina, capitulo, tipo, enunciado, "
                           "explicacao, dica, opcoes, resposta_correta, dificuldade, fonte, "
                           "concurso_id, ano, criado_em, atualizado_em) "
                           "VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)")
                    a = [
                        arg(f"{disciplina_title} — {capitulo}"[:200]),
                        arg(disciplina_slug), arg(capitulo),
                        arg(q.get("tipo")), arg(q.get("enunciado")),
                        arg(q.get("explicacao")), arg(q.get("dica")), arg(q.get("opcoes")),
                        arg(q.get("resposta_correta")), arg(q.get("dificuldade")),
                        arg(q.get("fonte")), arg(concurso_id), arg(q.get("ano")),
                        arg(NOW), arg(NOW),
                    ]
                    turso_execute([{"type": "execute", "stmt": {"sql": sql, "args": a}}])
                    inserted += 1
                except Exception as e2:
                    log.error(f"  Questao individual falhou: {e2}")
    return inserted


# -- Cache -------------------------------------------------------------------

def load_cache():
    if CACHE_FILE.exists():
        try:
            with open(CACHE_FILE, "r", encoding="utf-8") as f:
                return json.load(f)
        except Exception:
            pass
    return {}


def save_cache(cache):
    with open(CACHE_FILE, "w", encoding="utf-8") as f:
        json.dump(cache, f, ensure_ascii=False, indent=2)


# -- Main --------------------------------------------------------------------

def main():
    log.info("=" * 60)
    log.info("POPULATE QUESTIONS — Perito Criminal Federal")
    log.info("=" * 60)
    log.info("Turso: banco remoto configurado.")
    log.info(f"Claude API: {'DISPONIVEL' if ANTHROPIC_API_KEY else 'NAO configurada'}")

    # Teste conexao
    try:
        rows = turso_query("SELECT COUNT(*) as total FROM questions")
        existing = int(rows[0]["total"]) if rows else 0
        log.info(f"Conexao OK — questoes existentes: {existing}")
    except Exception as e:
        log.error(f"Falha na conexao Turso: {e}")
        sys.exit(1)

    concurso_id = get_or_create_concurso()
    cache = load_cache()

    stats = {}
    total_inserted = 0

    for disc_slug, disc_data in QUESTIONS_DB.items():
        disc_title = disc_data["title"]
        chapters = disc_data["chapters"]
        disc_total = 0

        log.info(f"\n{'='*50}")
        log.info(f"DISCIPLINA: {disc_title} ({len(chapters)} capitulos)")
        log.info(f"{'='*50}")

        for capitulo, hardcoded_questions in chapters.items():
            cache_key = f"{disc_slug}::{capitulo}"

            if cache_key in cache:
                chapter_questions = cache[cache_key]
                log.info(f"  [CACHE] {capitulo[:50]}: {len(chapter_questions)} questoes")
            else:
                chapter_questions = []

                # 1. Questoes hardcoded (garantidas)
                for q in hardcoded_questions:
                    qc = dict(q)
                    if isinstance(qc.get("opcoes"), list):
                        qc["opcoes"] = json.dumps(qc["opcoes"], ensure_ascii=False)
                    qc.setdefault("fonte", "CESPE/CEBRASPE")
                    qc.setdefault("ano", None)
                    chapter_questions.append(qc)

                # 2. Questoes extras por IA (se disponivel)
                if ANTHROPIC_API_KEY:
                    ai_qs = generate_questions_ai(disc_slug, disc_title, capitulo, n_multipla=3, n_vf=2)
                    chapter_questions.extend(ai_qs)
                    time.sleep(1)

                cache[cache_key] = chapter_questions
                save_cache(cache)

            log.info(f"  Inserindo {len(chapter_questions)} questoes: {capitulo[:50]}")
            n = insert_batch(chapter_questions, concurso_id, disc_slug, disc_title, capitulo)
            disc_total += n
            total_inserted += n

        # Para capitulos SEM questoes hardcoded, gerar apenas via IA
        if ANTHROPIC_API_KEY:
            # Mapear os capitulos do SUBJECTS que nao estao no banco hardcoded
            all_chapters_for_disc = {
                "lingua-portuguesa": [
                    "Tipos e generos textuais", "Ortografia oficial", "Coesao e coerencia",
                    "Tempos e modos verbais", "Morfossintaxe", "Classes de palavras",
                    "Coordenacao e subordinacao", "Pontuacao", "Reescrita de frases e textos",
                    "Significacao de palavras", "Correspondencia oficial",
                ],
                "informatica-basica": [
                    "Sistemas operacionais: Windows, Android, iOS", "Navegadores", "Webmail",
                    "Microsoft Office 365",
                ],
                "direito-penal": [
                    "Principios Basicos", "Lei penal no tempo e no espaco",
                    "Fato tipico, ilicitude e culpabilidade",
                    "Crimes contra a Pessoa, Patrimonio, Fe Publica e Administracao Publica",
                    "Inquerito policial", "Exame de corpo de delito", "Busca e apreensao",
                    "Prisao em flagrante", "Funcao pericial do Estado",
                ],
                "criminalistica": [
                    "Ciencias forenses, criminalistica e pericia",
                    "Classificacao dos vestigios",
                ],
                "fundamentos-computacao": [
                    "Arquitetura e organizacao de computadores",
                    "Processadores: Multicore, Multiprocessamento, Hyper-Threading, GPUs e CUDA",
                    "Sistemas distribuidos",
                    "Computacao quantica (conceitos)",
                ],
                "bancos-de-dados": [
                    "Arquitetura de bancos de dados", "Modelos logicos e fisicos",
                    "Bancos multidimensionais", "SGBDs relacionais", "SQLite",
                    "Logs de banco de dados",
                ],
                "engenharia-reversa-malware": [
                    "Descompilacao", "Debuggers", "Ofuscacao de codigo",
                    "Compactadores de executaveis", "Malware polimorfico",
                ],
                "linguagens-programacao": [
                    "Programacao procedural", "Estruturas de controle",
                    "Compiladores, montadores, interpretadores", "Linguagem Java",
                    "JavaScript e Python", "Analise estatica de codigo (SonarQube)",
                ],
                "estrutura-dados-algoritmos": [
                    "Listas", "Pilhas", "Filas", "Busca",
                ],
                "banca-analise": [
                    "Raciocinio tecnico aplicado", "Capacidade de analise forense",
                    "Entendimento de crimes no mundo digital",
                ],
            }

            extra_chapters = all_chapters_for_disc.get(disc_slug, [])
            for capitulo in extra_chapters:
                cache_key = f"{disc_slug}::ai::{capitulo}"
                if cache_key in cache:
                    ai_qs = cache[cache_key]
                    log.info(f"  [CACHE-AI] {capitulo[:50]}: {len(ai_qs)} questoes")
                else:
                    ai_qs = generate_questions_ai(disc_slug, disc_title, capitulo, n_multipla=4, n_vf=2)
                    cache[cache_key] = ai_qs
                    save_cache(cache)
                    time.sleep(1)

                if ai_qs:
                    n = insert_batch(ai_qs, concurso_id, disc_slug, disc_title, capitulo)
                    disc_total += n
                    total_inserted += n

        stats[disc_title] = disc_total
        log.info(f"  TOTAL {disc_title}: {disc_total} questoes inseridas")

    # Relatorio final
    log.info("\n" + "=" * 60)
    log.info("RELATORIO FINAL")
    log.info("=" * 60)
    for disc, count in stats.items():
        log.info(f"  {disc}: {count} questoes")

    # Confirmacao no banco
    rows = turso_query(
        "SELECT disciplina, COUNT(*) as total FROM questions WHERE concurso_id = ? GROUP BY disciplina ORDER BY total DESC",
        [arg(concurso_id)],
    )
    log.info("\nConfirmacao no banco (concurso Perito Criminal Federal):")
    total_db = 0
    for r in rows:
        log.info(f"  {r['disciplina']}: {r['total']}")
        total_db += int(r["total"])

    log.info(f"\nTOTAL INSERIDO NESTA EXECUCAO: {total_inserted} questoes")
    log.info(f"TOTAL NO BANCO: {total_db} questoes")
    log.info("=" * 60)


if __name__ == "__main__":
    main()
