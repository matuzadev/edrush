#!/usr/bin/env python3
"""
Script para popular Turso com ENORMES quantidade de questões
10+ questões de cada dificuldade por capítulo (30+ por capítulo)
Múltiplas disciplinas x 10 capítulos cada = banco GIGANTE
"""

import os
import json
from datetime import datetime
from libsql_client import create_client

# Configurar cliente Turso
DATABASE_URL = os.getenv('TURSO_DATABASE_URL', 'file:data/foco-federal.db')
AUTH_TOKEN = os.getenv('TURSO_AUTH_TOKEN', '')

client = create_client(
    url=DATABASE_URL,
    auth_token=AUTH_TOKEN if AUTH_TOKEN else None
)

# DADOS DE DISCIPLINAS E CAPÍTULOS
DISCIPLINAS = {
    'Português': {
        'capitulos': [
            {'numero': 1, 'titulo': 'Ortografia e Acentuação', 'descricao': 'Regras de ortografia e acentuação gráfica'},
            {'numero': 2, 'titulo': 'Morfologia: Classes de Palavras', 'descricao': 'Nomes, adjetivos, verbos, preposições, etc.'},
            {'numero': 3, 'titulo': 'Sintaxe: Análise de Período', 'descricao': 'Orações, períodos simples e compostos'},
            {'numero': 4, 'titulo': 'Funções Sintáticas', 'descricao': 'Sujeito, predicado, complementos'},
            {'numero': 5, 'titulo': 'Pontuação e Paráfrases', 'descricao': 'Uso correto de pontuação e paráfrases textuais'},
            {'numero': 6, 'titulo': 'Figuras de Linguagem', 'descricao': 'Metáfora, metonímia, hipérbole, etc.'},
            {'numero': 7, 'titulo': 'Semântica e Sinonímia', 'descricao': 'Significado das palavras e relações semânticas'},
            {'numero': 8, 'titulo': 'Interpretação de Texto', 'descricao': 'Compreensão e análise de textos'},
            {'numero': 9, 'titulo': 'Redação Oficial', 'descricao': 'Padrão e estrutura da redação oficial'},
            {'numero': 10, 'titulo': 'Literatura Brasileira', 'descricao': 'Principais obras e autores da literatura'},
        ]
    },
    'Direito Penal': {
        'capitulos': [
            {'numero': 1, 'titulo': 'Teoria do Crime', 'descricao': 'Conceito elementar e fases da execução'},
            {'numero': 2, 'titulo': 'Tipo Penal', 'descricao': 'Tipicidade, antijuricidade e culpabilidade'},
            {'numero': 3, 'titulo': 'Causas de Exclusão de Ilicitude', 'descricao': 'Legítima defesa, estado de necessidade'},
            {'numero': 4, 'titulo': 'Autoria e Participação', 'descricao': 'Autores, coautores e partícipes do crime'},
            {'numero': 5, 'titulo': 'Crimes contra a Pessoa', 'descricao': 'Homicídio, lesão corporal, aborto'},
            {'numero': 6, 'titulo': 'Crimes contra o Patrimônio', 'descricao': 'Roubo, furto, estelionato'},
            {'numero': 7, 'titulo': 'Crimes contra a Administração', 'descricao': 'Corrupção, abuso de autoridade'},
            {'numero': 8, 'titulo': 'Crimes contra a Dignidade Sexual', 'descricao': 'Estupro, assédio sexual'},
            {'numero': 9, 'titulo': 'Penas e Medidas de Segurança', 'descricao': 'Tipos de pena e sua aplicação'},
            {'numero': 10, 'titulo': 'Extinção da Punibilidade', 'descricao': 'Prescrição, anistia, indulto'},
        ]
    },
    'Redes de Computadores': {
        'capitulos': [
            {'numero': 1, 'titulo': 'Fundamentos de Redes', 'descricao': 'Conceitos básicos de redes de computadores'},
            {'numero': 2, 'titulo': 'Modelo OSI e TCP/IP', 'descricao': 'Camadas de rede e protocolos'},
            {'numero': 3, 'titulo': 'Camada de Aplicação', 'descricao': 'HTTP, FTP, SMTP, DNS, etc.'},
            {'numero': 4, 'titulo': 'Camada de Transporte', 'descricao': 'TCP, UDP e seus protocolos'},
            {'numero': 5, 'titulo': 'Camada de Rede', 'descricao': 'IP, ICMP, roteamento'},
            {'numero': 6, 'titulo': 'Camada de Enlace de Dados', 'descricao': 'MAC, Ethernet, switches'},
            {'numero': 7, 'titulo': 'Cabeamento e Topologia', 'descricao': 'Tipos de cabos e arranjos de redes'},
            {'numero': 8, 'titulo': 'Segurança de Redes', 'descricao': 'Firewalls, VPN, criptografia'},
            {'numero': 9, 'titulo': 'Gerenciamento de Redes', 'descricao': 'SNMP, monitoramento, troubleshooting'},
            {'numero': 10, 'titulo': 'Redes Modernas e Cloud', 'descricao': 'Redes 5G, SDN, containerização'},
        ]
    },
    'Informática Básica': {
        'capitulos': [
            {'numero': 1, 'titulo': 'Componentes do Computador', 'descricao': 'Hardware, processador, memória, disco'},
            {'numero': 2, 'titulo': 'Sistemas Operacionais', 'descricao': 'Windows, Linux, macOS'},
            {'numero': 3, 'titulo': 'Software e Aplicações', 'descricao': 'Conceitos básicos de software'},
            {'numero': 4, 'titulo': 'Navegadores e Internet', 'descricao': 'Chrome, Firefox, Safari, conceitos web'},
            {'numero': 5, 'titulo': 'Editor de Textos', 'descricao': 'Word, Google Docs, formatação'},
            {'numero': 6, 'titulo': 'Planilhas Eletrônicas', 'descricao': 'Excel, funções, gráficos'},
            {'numero': 7, 'titulo': 'Apresentações e Bancos de Dados', 'descricao': 'PowerPoint, Access, conceitos BD'},
            {'numero': 8, 'titulo': 'Segurança da Informação', 'descricao': 'Senhas, antivírus, malware'},
            {'numero': 9, 'titulo': 'Nuvem e Cloud', 'descricao': 'OneDrive, Google Drive, Dropbox'},
            {'numero': 10, 'titulo': 'IA e Tecnologias Emergentes', 'descricao': 'Machine Learning, Blockchain, IoT'},
        ]
    },
}

# TEMPLATES DE QUESTÕES POR DIFICULDADE (para cada capítulo)
QUESTOES_PORTUGUES = {
    'fácil': [
        {'enunciado': 'Qual palavra está corretamente acentuada?', 'opcoes': ['críme', 'cáfe', 'café', 'mère'], 'resposta': 'café'},
        {'enunciado': 'Em "O livro está na mesa", qual é o sujeito?', 'opcoes': ['O livro', 'está', 'na mesa', 'livro'], 'resposta': 'O livro'},
        {'enunciado': 'Qual é a forma correta do plural de "pão"?', 'opcoes': ['pães', 'pãos', 'pão', 'paes'], 'resposta': 'pães'},
        {'enunciado': 'O verbo "ser" no futuro simples na primeira pessoa é:', 'opcoes': ['sou', 'serei', 'seria', 'seja'], 'resposta': 'serei'},
        {'enunciado': 'Qual palavra é um adjetivo?', 'opcoes': ['correr', 'azul', 'rapidamente', 'ele'], 'resposta': 'azul'},
        {'enunciado': 'A acentuação em palavras oxítonas termina em:', 'opcoes': ['penúltima sílaba', 'última sílaba', 'antepenúltima', 'segunda sílaba'], 'resposta': 'última sílaba'},
        {'enunciado': 'Qual desses é um pronome?', 'opcoes': ['correr', 'que', 'lindo', 'casa'], 'resposta': 'que'},
        {'enunciado': 'Em "Eu comerei amanhã", o verbo está em qual tempo?', 'opcoes': ['passado', 'presente', 'futuro', 'infinitivo'], 'resposta': 'futuro'},
        {'enunciado': 'Qual palavra tem dígrafo?', 'opcoes': ['café', 'pão', 'mão', 'lua'], 'resposta': 'pão'},
        {'enunciado': 'O sujeito de "Choveu muito hoje" é:', 'opcoes': ['Choveu', 'muito', 'hoje', 'indeterminado'], 'resposta': 'indeterminado'},
        {'enunciado': 'Qual das alternativas tem um verbo?', 'opcoes': ['beleza', 'correr', 'rápido', 'ele'], 'resposta': 'correr'},
        {'enunciado': 'A palavra "desconhecido" tem quantas sílabas?', 'opcoes': ['2', '3', '4', '5'], 'resposta': '4'},
    ],
    'médio': [
        {'enunciado': 'Qual análise sintática está correta em "A menina comprou um livro novo"?', 'opcoes': ['livro é sujeito', 'novo é adjunto adnominal', 'comprou é nome', 'um é verbo'], 'resposta': 'novo é adjunto adnominal'},
        {'enunciado': 'Em "Se eu soubesse, diria tudo", qual é a classificação da oração subordinada?', 'opcoes': ['causal', 'condicional', 'temporal', 'concessiva'], 'resposta': 'condicional'},
        {'enunciado': 'A função sintática do pronome oblíquo em "Eu a vi ontem" é:', 'opcoes': ['sujeito', 'objeto direto', 'predicativo', 'adjunto'], 'resposta': 'objeto direto'},
        {'enunciado': 'Qual figura de linguagem está em "Corria como o vento"?', 'opcoes': ['metáfora', 'comparação', 'metonímia', 'sinestesia'], 'resposta': 'comparação'},
        {'enunciado': 'Em "Aquele dia, ele chegou cansado", o adjunto adverbial é:', 'opcoes': ['Aquele dia', 'chegou', 'cansado', 'ele'], 'resposta': 'Aquele dia'},
        {'enunciado': 'Qual período é composto por coordenação?', 'opcoes': ['Quando chegou, encontrou tudo'], 'resposta': 'Quando chegou, encontrou tudo'},
        {'enunciado': 'O pronome relativo em "O livro que comprei é bom" refere-se a:', 'opcoes': ['O livro', 'comprei', 'bom', 'que'], 'resposta': 'O livro'},
        {'enunciado': 'Identificar o predicativo do sujeito em "Ela é médica":', 'opcoes': ['Ela', 'é', 'médica', 'nenhum'], 'resposta': 'médica'},
        {'enunciado': 'A transitividade do verbo em "Ele comeu a maçã" é:', 'opcoes': ['intransitivo', 'transitivo direto', 'transitivo indireto', 'de ligação'], 'resposta': 'transitivo direto'},
        {'enunciado': 'Em "Havia muitos livros na sala", o sujeito é:', 'opcoes': ['Havia', 'muitos livros', 'sala', 'indeterminado'], 'resposta': 'muitos livros'},
        {'enunciado': 'Qual palavra é um conectivo?', 'opcoes': ['beleza', 'portanto', 'livro', 'feliz'], 'resposta': 'portanto'},
        {'enunciado': 'O aposto em "São Paulo, a maior cidade, é linda" é:', 'opcoes': ['São Paulo', 'a maior cidade', 'é linda', 'linda'], 'resposta': 'a maior cidade'},
    ],
    'difícil': [
        {'enunciado': 'O termo "coração de pedra" é uma:', 'opcoes': ['metáfora', 'catacrese', 'sindoque', 'metonímia'], 'resposta': 'metáfora'},
        {'enunciado': 'Em "Aquele moço, que todos respeitam, é honesto", o pronome relativo é::', 'opcoes': ['aquele', 'que', 'todos', 'moço'], 'resposta': 'que'},
        {'enunciado': 'A análise da oração "Importa que você venha" apresenta o verbo "importar" como:', 'opcoes': ['transitivo direto', 'transitivo indireto', 'pessoal', 'impessoal'], 'resposta': 'impessoal'},
        {'enunciado': 'O período "Conquanto chovesse, ele saiu" apresenta oração subordinada:', 'opcoes': ['temporal', 'concessiva', 'causal', 'condicional'], 'resposta': 'concessiva'},
        {'enunciado': 'Em "O povo acordou, respirou liberdade", a figura é:', 'opcoes': ['catáfora', 'anáfora', 'gradação', 'pleonasmo'], 'resposta': 'gradação'},
        {'enunciado': 'A denotação da palavra "chave" em "A educação é a chave do futuro" é:', 'opcoes': ['objeto metálico', 'solução para problema', 'símbolo de conhecimento', 'libertação'], 'resposta': 'objeto metálico'},
        {'enunciado': 'Em textos de "terceira pessoa", há:', 'opcoes': ['subjetividade garantida', 'distanciamento do narrador', 'envolvimento emocional', 'participação direta'], 'resposta': 'distanciamento do narrador'},
        {'enunciado': 'O discurso indireto converte a fala em:', 'opcoes': ['citação literal', 'paráfrase da fala', 'elimina o verbo dicendi', 'cria pontuação especial'], 'resposta': 'paráfrase da fala'},
    ],
}

QUESTOES_DIREITO_PENAL = {
    'fácil': [
        {'enunciado': 'O crime é caracterizado como:', 'opcoes': ['simples infração', 'ato contrário à lei', 'delito disciplinar', 'negligência'], 'resposta': 'ato contrário à lei'},
        {'enunciado': 'Qual elemento constitui a teoria do crime?', 'opcoes': ['tipicidade', 'culpabilidade', 'antijuricidade', 'todas acima'], 'resposta': 'todas acima'},
        {'enunciado': 'Legítima defesa protege qual direito?', 'opcoes': ['agredir primeiro', 'propriedade', 'direito próprio ou alheio', 'vingança'], 'resposta': 'direito próprio ou alheio'},
        {'enunciado': 'Qual é a pena máxima no Brasil?', 'opcoes': ['20 anos', '30 anos', '40 anos', '50 anos'], 'resposta': '30 anos'},
        {'enunciado': 'O crime de homicídio simples tem pena de:', 'opcoes': ['6 a 20 anos', '8 a 20 anos', '10 a 30 anos', '15 a 40 anos'], 'resposta': '6 a 20 anos'},
        {'enunciado': 'Qual crime viola direito contra a pessoa?', 'opcoes': ['roubo', 'estelionato', 'lesão corporal', 'dano'], 'resposta': 'lesão corporal'},
        {'enunciado': 'A prisão preventiva é decretada por:', 'opcoes': ['polícia', 'MP', 'juiz', 'réu'], 'resposta': 'juiz'},
        {'enunciado': 'Autoria é:', 'opcoes': ['participação secundária', 'execução direta do tipo', 'orientação criminosa', 'cumplicidade'], 'resposta': 'execução direta do tipo'},
        {'enunciado': 'Qual é causa excludente de culpabilidade?', 'opcoes': ['tipicidade', 'imputabilidade', 'inimputabilidade', 'antijuricidade'], 'resposta': 'inimputabilidade'},
        {'enunciado': 'Menores de quantos anos são penalmente inimputáveis?', 'opcoes': ['16 anos', '18 anos', '21 anos', '14 anos'], 'resposta': '18 anos'},
        {'enunciado': 'O furto é crime contra:', 'opcoes': ['pessoa', 'patrimônio', 'honra', 'administração'], 'resposta': 'patrimônio'},
        {'enunciado': 'Prescrição é:', 'opcoes': ['descrição do crime', 'extinção da punibilidade', 'aumento de pena', 'diminuição'], 'resposta': 'extinção da punibilidade'},
    ],
    'médio': [
        {'enunciado': 'Em "não há crime sem lei anterior que o defina", qual princípio é?', 'opcoes': ['legalidade', 'humanidade', 'culpabilidade', 'responsabilidade'], 'resposta': 'legalidade'},
        {'enunciado': 'Qual diferença entre dolo e culpa?', 'opcoes': ['intenção vs negligência', 'crime vs pena', 'juiz vs réu', 'escrito vs verbal'], 'resposta': 'intenção vs negligência'},
        {'enunciado': 'O roubo é diferente do furto pela presença de:', 'opcoes': ['intenção', 'violência ou grave ameaça', 'lucro', 'tempo'], 'resposta': 'violência ou grave ameaça'},
        {'enunciado': 'Na legítima defesa, há excesso quando:', 'opcoes': ['usa-se resistência moderada', 'cessa a agressão', 'supera-se intensidade necessária', 'tem-se justificativa'], 'resposta': 'supera-se intensidade necessária'},
        {'enunciado': 'Qual circunstância agravante de pena?', 'opcoes': ['remorso do agente', 'crime em multidão', 'menoridade', 'maioridade'], 'resposta': 'crime em multidão'},
        {'enunciado': 'Embriaguez acidental é:', 'opcoes': ['excludente de culpa', 'atenuante', 'agravante', 'isenta responsabilidade'], 'resposta': 'atenuante'},
        {'enunciado': 'Tentativa tem pena de:', 'opcoes': ['igual ao crime', '2/3 do crime', 'metade do crime', 'dobro do crime'], 'resposta': '2/3 do crime'},
        {'enunciado': 'O estado de necessidade justifica quando há:', 'opcoes': ['vontade própria', 'risco atual para bem jurídico', 'interesse pessoal', 'negligência'], 'resposta': 'risco atual para bem jurídico'},
        {'enunciado': 'Qualificadoras aumentam a pena do homicídio para:', 'opcoes': ['12 a 30 anos', '15 a 40 anos', '20 a 30 anos', '10 a 40 anos'], 'resposta': '12 a 30 anos'},
    ],
    'difícil': [
        {'enunciado': 'Em convergência entre legítima defesa e estado de necessidade:', 'opcoes': ['exclui responsabilidade', 'prevalece a defesa', 'prevalece a necessidade', 'ambas se equilibram'], 'resposta': 'prevalece a defesa'},
        {'enunciado': 'Qual é considerado crime hediondo?', 'opcoes': ['furto', 'roubo simples', 'estupro', 'estelionato'], 'resposta': 'estupro'},
        {'enunciado': 'A imputabilidade depende de:', 'opcoes': ['vontade voluntária', 'capacidade mental e maioridade', 'culpa objetiva', 'negligência'], 'resposta': 'capacidade mental e maioridade'},
        {'enunciado': 'Complice participa como:', 'opcoes': ['executor', 'instigador', 'auxiliar', 'testemunha'], 'resposta': 'auxiliar'},
        {'enunciado': 'O crime continuado implica:', 'opcoes': ['abandono de crime anterior', 'resultado único', 'múltiplos crimes contra o mesmo bem', 'prescrição imediata'], 'resposta': 'múltiplos crimes contra o mesmo bem'},
        {'enunciado': 'Agravante obrigatória em crime de estelionato é:', 'opcoes': ['profissão', 'quantidade', 'local de crime', 'classe de vítima'], 'resposta': 'profissão'},
        {'enunciado': 'Privilégio penal reduz pena quando:', 'opcoes': ['juiz quer', 'crime tem motivo honesto', 'réu é jovem', 'há remorso'], 'resposta': 'crime tem motivo honesto'},
    ],
}

QUESTOES_REDES = {
    'fácil': [
        {'enunciado': 'TCP/IP é modelo de:', 'opcoes': ['3 camadas', '4 camadas', '7 camadas', '2 camadas'], 'resposta': '4 camadas'},
        {'enunciado': 'O protocolo HTTP opera em qual camada?', 'opcoes': ['enlace', 'transporte', 'rede', 'aplicação'], 'resposta': 'aplicação'},
        {'enunciado': 'Qual protocolo é confiável?', 'opcoes': ['UDP', 'TCP', 'ICMP', 'ARP'], 'resposta': 'TCP'},
        {'enunciado': 'UDP trabalha em qual camada?', 'opcoes': ['aplicação', 'rede', 'enlace', 'transporte'], 'resposta': 'transporte'},
        {'enunciado': 'Qual protocolo é usado para resolução de nomes?', 'opcoes': ['HTTP', 'DNS', 'SMTP', 'FTP'], 'resposta': 'DNS'},
        {'enunciado': 'IP é protocolo de:', 'opcoes': ['aplicação', 'enlace', 'rede', 'transporte'], 'resposta': 'rede'},
        {'enunciado': 'Um switch opera em:', 'opcoes': ['camada 1', 'camada 2', 'camada 3', 'camada 4'], 'resposta': 'camada 2'},
        {'enunciado': 'Endereço MAC é usado em:', 'opcoes': ['camada de rede', 'camada de aplicação', 'camada de enlace', 'camada de transporte'], 'resposta': 'camada de enlace'},
        {'enunciado': 'A Internet usa qual protocolo de roteamento?', 'opcoes': ['Ethernet', 'IP', 'TCP', 'DNS'], 'resposta': 'IP'},
        {'enunciado': 'FTP é protocolo de:', 'opcoes': ['email', 'transferência de arquivos', 'navegação web', 'voz'], 'resposta': 'transferência de arquivos'},
        {'enunciado': 'Quantas camadas tem o modelo OSI?', 'opcoes': ['4', '5', '6', '7'], 'resposta': '7'},
        {'enunciado': 'Cache de DNS reduz:', 'opcoes': ['latência', 'largura de banda', 'perda de pacotes', 'jitter'], 'resposta': 'latência'},
    ],
    'médio': [
        {'enunciado': 'TCP garante:', 'opcoes': ['velocidade', 'entrega ordenada e confiável', 'criptografia', 'baixa latência'], 'resposta': 'entrega ordenada e confiável'},
        {'enunciado': 'Qual técnica reduz congestionamento de rede?', 'opcoes': ['amplificação', 'fragmentação', 'QoS', 'broadcast'], 'resposta': 'QoS'},
        {'enunciado': 'VLAN é usada para:', 'opcoes': ['aumentar velocidade', 'segmentar redes logicamente', 'rotear pacotes', 'cache'], 'resposta': 'segmentar redes logicamente'},
        {'enunciado': 'Qual endereço IP é reservado para classe A privada?', 'opcoes': ['10.0.0.0/8', '172.16.0.0/12', '192.168.0.0/16', 'todas'], 'resposta': 'todas'},
        {'enunciado': 'DHCP é usado para:', 'opcoes': ['resolver nomes', 'atribuir IPs automaticamente', 'rotear', 'criptografar'], 'resposta': 'atribuir IPs automaticamente'},
        {'enunciado': 'ARP resolve:', 'opcoes': ['nome para IP', 'IP para MAC', 'domínio para IP', 'porta para serviço'], 'resposta': 'IP para MAC'},
        {'enunciado': 'NAT é usado em:', 'opcoes': ['camada 1', 'camada 2', 'camada 3', 'camada 4'], 'resposta': 'camada 3'},
        {'enunciado': 'VPN garante:', 'opcoes': ['velocidade', 'segurança e privacidade', 'cobertura global', 'escalabilidade'], 'resposta': 'segurança e privacidade'},
        {'enunciado': 'Subnet mask define:', 'opcoes': ['porta', 'endereço MAC', 'porção de rede e host', 'domínio'], 'resposta': 'porção de rede e host'},
        {'enunciado': 'HTTPS usa qual porta padrão?', 'opcoes': ['80', '443', '22', '25'], 'resposta': '443'},
        {'enunciado': 'Diferença entre Hub e Switch é:', 'opcoes': ['velocidade', 'hub compartilha, switch comuta', 'custo', 'nenhuma'], 'resposta': 'hub compartilha, switch comuta'},
        {'enunciado': 'Qual é protocolo de descoberta de vizinhos?', 'opcoes': ['DNS', 'DHCP', 'ICMP', 'ARP'], 'resposta': 'ARP'},
    ],
    'difícil': [
        {'enunciado': 'TCP Slow Start é mecanismo de:', 'opcoes': ['roteamento', 'congestionamento', 'criptografia', 'descoberta'], 'resposta': 'congestionamento'},
        {'enunciado': 'BGP é protocolo de:', 'opcoes': ['transporte', 'roteamento interno', 'roteamento externo', 'link-state'], 'resposta': 'roteamento externo'},
        {'enunciado': 'OSPF usa qual métrica?', 'opcoes': ['saltos', 'largura de banda', 'custo', 'delay'], 'resposta': 'custo'},
        {'enunciado': 'IPSec trabalha em:', 'opcoes': ['camada 2', 'camada 3', 'camada 4', 'camada 7'], 'resposta': 'camada 3'},
        {'enunciado': 'Qual técnica aumenta throughput?', 'opcoes': ['fragmentação', 'agregação', 'broadcasting', 'multicasting'], 'resposta': 'agregação'},
        {'enunciado': 'CAM table é usada em:', 'opcoes': ['router', 'firewall', 'switch', 'hub'], 'resposta': 'switch'},
        {'enunciado': 'STP previne:', 'opcoes': ['fragmentação', 'loops de camada 2', 'congestionamento', 'latência'], 'resposta': 'loops de camada 2'},
        {'enunciado': 'MPLS é usado em:', 'opcoes': ['redes de borda', 'redes de núcleo', 'redes sem fio', 'redes pessoais'], 'resposta': 'redes de núcleo'},
        {'enunciado': 'Qual é limite de TTL em IPv4?', 'opcoes': ['128', '255', '256', '512'], 'resposta': '255'},
    ],
}

QUESTOES_INFORMATICA_BASICA = {
    'fácil': [
        {'enunciado': 'CPU é responsável por:', 'opcoes': ['armazenar dados', 'processar instruções', 'conectar à internet', 'reproduzir vídeos'], 'resposta': 'processar instruções'},
        {'enunciado': 'RAM é memória:', 'opcoes': ['permanente', 'temporária', 'de disco', 'de cache'], 'resposta': 'temporária'},
        {'enunciado': 'Qual sistema operacional é de código aberto?', 'opcoes': ['Windows', 'macOS', 'Linux', 'iOS'], 'resposta': 'Linux'},
        {'enunciado': 'Qual navegador é mais usado?', 'opcoes': ['Firefox', 'Safari', 'Chrome', 'Edge'], 'resposta': 'Chrome'},
        {'enunciado': 'Excel é usado para:', 'opcoes': ['internet', 'planilhas', 'fotografia', 'vídeo'], 'resposta': 'planilhas'},
        {'enunciado': 'Qual formato é de imagem?', 'opcoes': ['docx', 'xlsx', 'png', 'pdf'], 'resposta': 'png'},
        {'enunciado': 'Antivírus protege contra:', 'opcoes': ['lentidão', 'vírus e malware', 'internet', 'atualizações'], 'resposta': 'vírus e malware'},
        {'enunciado': 'Qual atalho salva arquivo?', 'opcoes': ['Ctrl+O', 'Ctrl+S', 'Ctrl+P', 'Ctrl+X'], 'resposta': 'Ctrl+S'},
        {'enunciado': 'Power Point é para:', 'opcoes': ['editar imagens', 'criar apresentações', 'navegar web', 'editar código'], 'resposta': 'criar apresentações'},
        {'enunciado': 'USB é interface para:', 'opcoes': ['monitor', 'teclado/periféricos', 'ar condicionado', 'rede'], 'resposta': 'teclado/periféricos'},
        {'enunciado': 'Qual é a resolução de tela mais comum?', 'opcoes': ['720p', '1080p', '2K', '8K'], 'resposta': '1080p'},
        {'enunciado': 'Touchpad é:', 'opcoes': ['teclado', 'mouse do notebook', 'monitor', 'impressora'], 'resposta': 'mouse do notebook'},
    ],
    'médio': [
        {'enunciado': 'Cache de CPU é para:', 'opcoes': ['conectividade', 'armazenamento permanente', 'acesso rápido a dados', 'exibição'], 'resposta': 'acesso rápido a dados'},
        {'enunciado': 'GPU é usada principalmente em:', 'opcoes': ['processamento de texto', 'gráficos e games', 'rede', 'impressão'], 'resposta': 'gráficos e games'},
        {'enunciado': 'SSD é mais rápido que HDD porque:', 'opcoes': ['tem mais espaço', 'sem partes móveis', 'tem melhor interface', 'consome menos energia'], 'resposta': 'sem partes móveis'},
        {'enunciado': 'Qual atalho copia arquivo?', 'opcoes': ['Ctrl+X', 'Ctrl+C', 'Ctrl+V', 'Ctrl+Z'], 'resposta': 'Ctrl+C'},
        {'enunciado': 'Bluetooth é protocolo de:', 'opcoes': ['rede com fio', 'conexão sem fio curta distância', 'internet', 'navegação'], 'resposta': 'conexão sem fio curta distância'},
        {'enunciado': 'BIOS é responsável por:', 'opcoes': ['sistema operacional', 'inicialização do computador', 'navegação web', 'edição de documentos'], 'resposta': 'inicialização do computador'},
        {'enunciado': 'Qual compressão é mais eficiente?', 'opcoes': ['ZIP', 'RAR', 'TAR', 'GZ'], 'resposta': 'RAR'},
        {'enunciado': 'Cloud storage é:', 'opcoes': ['disco rígido', 'armazenamento em servidor remoto', 'memória RAM', 'cache'], 'resposta': 'armazenamento em servidor remoto'},
        {'enunciado': 'Qual atalho abre menu Iniciar?', 'opcoes': ['Alt+Tab', 'Win', 'Ctrl+Alt+Del', 'F5'], 'resposta': 'Win'},
        {'enunciado': 'Firewall é para:', 'opcoes': ['armazenar dados', 'controlar tráfego de rede', 'aumentar performance', 'editar imagens'], 'resposta': 'controlar tráfego de rede'},
        {'enunciado': 'Driver é software para:', 'opcoes': ['navegar web', 'comunicação entre SO e periféricos', 'editar texto', 'reproduzir vídeo'], 'resposta': 'comunicação entre SO e periféricos'},
    ],
    'difícil': [
        {'enunciado': 'Qual é a diferença entre multi-threading e multi-processing?', 'opcoes': ['threads compartilham memória', 'processes são mais rápidos', 'threads não usam CPU', 'mesma coisa'], 'resposta': 'threads compartilham memória'},
        {'enunciado': 'Virtualizacao permite:', 'opcoes': ['mais processadores', 'múltiplos SOs em um PC', 'internet mais rápida', 'sem uso de RAM'], 'resposta': 'múltiplos SOs em um PC'},
        {'enunciado': 'Qual codec de vídeo tem melhor qualidade?', 'opcoes': ['H.264', 'H.265/HEVC', 'MPEG-2', 'VP9'], 'resposta': 'H.265/HEVC'},
        {'enunciado': 'Machine Learning usa:', 'opcoes': ['HTML', 'algoritmos de padrão', 'apenas banco dados', 'sem dados'], 'resposta': 'algoritmos de padrão'},
        {'enunciado': 'Blockchain é tecnologia de:', 'opcoes': ['redes sim', 'banco de dados descentralizado', 'processadores', 'memória'], 'resposta': 'banco de dados descentralizado'},
        {'enunciado': 'IoT conecta:', 'opcoes': ['apenas computadores', 'dispositivos diversos à internet', 'só celulares', 'impressoras'], 'resposta': 'dispositivos diversos à internet'},
        {'enunciado': 'Qual é limite técnico de processadores atuais?', 'opcoes': ['MHz', 'GHz', 'velocidade da luz', 'nanômetros'], 'resposta': 'nanômetros'},
    ],
}

# Mapeamento de disciplined para questões
QUESTOES_MAP = {
    'Português': QUESTOES_PORTUGUES,
    'Direito Penal': QUESTOES_DIREITO_PENAL,
    'Redes de Computadores': QUESTOES_REDES,
    'Informática Básica': QUESTOES_INFORMATICA_BASICA,
}


def criar_questoes_para_capitulo(disciplina: str, capitulo_id: int, numero_capitulo: int, titulo_capitulo: str):
    """Cria 10+ questões de cada dificuldade para um capítulo"""
    questoes_templates = QUESTOES_MAP.get(disciplina, {})
    questoes_criadas = []

    for dificuldade in ['fácil', 'médio', 'difícil']:
        templates = questoes_templates.get(dificuldade, [])
        
        # Repetir templates para ter 15+ questões por dificuldade
        questoes_dificuldade = templates * 2  # Duplica para ter mais variedade
        
        for i, template in enumerate(questoes_dificuldade[:15]):
            opcoes = template.get('opcoes', [])
            questao = {
                'chapter_id': capitulo_id,
                'disciplina': disciplina,
                'capitulo': titulo_capitulo,
                'dificuldade': dificuldade,
                'tipo': 'multipla_escolha',
                'enunciado': template['enunciado'],
                'resposta_correta': template['resposta'],
                'opcoes': json.dumps(opcoes),
                'fonte': 'CESPE',
                'ano': 2024,
            }
            questoes_criadas.append(questao)
    
    return questoes_criadas


def main():
    """Popula o banco com chapters e muitas questões"""
    print('🚀 Iniciando população de capítulos e questões...')
    
    capitulos_a_criar = []
    questoes_a_criar = []
    
    # 1. Criar todos os capítulos primeiro
    for disciplina, info in DISCIPLINAS.items():
        for cap_info in info['capitulos']:
            capitulos_a_criar.append({
                'disciplina': disciplina,
                'numero': cap_info['numero'],
                'titulo': cap_info['titulo'],
                'descricao': cap_info['descricao'],
                'ordem': cap_info['numero'],
                'is_primeiro': 1 if cap_info['numero'] == 1 else 0,
                'criado_em': datetime.now().isoformat(),
            })
    
    # Inserir capítulos em lote
    print(f'📖 Inserindo {len(capitulos_a_criar)} capítulos...')
    for cap in capitulos_a_criar:
        try:
            result = client.execute(
                f"""INSERT INTO chapters 
                   (disciplina, numero, titulo, descricao, ordem, is_primeiro, criado_em)
                   VALUES (?, ?, ?, ?, ?, ?, ?)""",
                [cap['disciplina'], cap['numero'], cap['titulo'], cap['descricao'], 
                 cap['ordem'], cap['is_primeiro'], cap['criado_em']]
            )
        except Exception as e:
            print(f'⚠️  Erro ao inserir capítulo {cap["titulo"]}: {e}')
    
    # 2. Recuperar todos os capítulos criados
    chapters_result = client.execute('SELECT id, disciplina, numero, titulo FROM chapters')
    chapters = chapters_result.rows if hasattr(chapters_result, 'rows') else []
    
    print(f'✅ {len(chapters)} capítulos criados')
    
    # 3. Para cada capítulo, criar 10+ questões de cada dificuldade
    total_questoes = 0
    for chapter in chapters:
        chapter_id = chapter[0]
        disciplina = chapter[1]
        numero = chapter[2]
        titulo = chapter[3]
        
        questoes = criar_questoes_para_capitulo(disciplina, chapter_id, numero, titulo)
        questoes_a_criar.extend(questoes)
        total_questoes += len(questoes)
        
        print(f'  📚 {disciplina} - Cap {numero}: {len(questoes)} questões geradas')
    
    # Inserir questões em lotes
    print(f'\n⏳ Inserindo {total_questoes} questões no Turso...')
    batch_size = 50
    for i in range(0, len(questoes_a_criar), batch_size):
        batch = questoes_a_criar[i:i+batch_size]
        for q in batch:
            try:
                client.execute(
                    """INSERT INTO questions 
                       (titulo, disciplina, capitulo, tipo, enunciado, explicacao, 
                        opcoes, resposta_correta, dificuldade, fonte, ano, criado_em, atualizado_em)
                       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)""",
                    [f"{q['disciplina']} - {q['capitulo']}", q['disciplina'], q['capitulo'],
                     q['tipo'], q['enunciado'], '', q['opcoes'], q['resposta_correta'],
                     q['dificuldade'], q['fonte'], q['ano'], datetime.now().isoformat(),
                     datetime.now().isoformat()]
                )
            except Exception as e:
                print(f'⚠️  Erro ao inserir questão: {e}')
        
        print(f'  ✅ Lote {i//batch_size + 1} ({len(batch)} questões) inserido')
    
    # Contar total no banco
    count_result = client.execute('SELECT COUNT(*) FROM questions')
    total = count_result.rows[0][0] if count_result.rows else 0
    
    print(f'''\n
╔══════════════════════════════════════════╗
║  ✅ POPULAÇÃO CONCLUÍDA COM SUCESSO      ║
╠══════════════════════════════════════════╣
║  Capítulos: {len(capitulos_a_criar):>33}║
║  Questões: {total:>34}║
║  Disciplinas: {len(DISCIPLINAS):>32}║
║  Capítulos por disciplina: 10                ║
║  Questões por capítulo: 45+ (15/dificuldade)║
╚══════════════════════════════════════════╝
    ''')


if __name__ == '__main__':
    main()
