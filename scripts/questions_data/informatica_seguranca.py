"""
Informática — Segurança, Internet e Redes
30 questões cobrindo 3 capítulos
"""

CAPITULOS = [
    {'numero': 5, 'titulo': 'Segurança da Informação', 'descricao': 'Princípios CIDA, criptografia, certificado e assinatura digital, hash e ataques cibernéticos'},
    {'numero': 6, 'titulo': 'Internet e Navegação', 'descricao': 'Protocolos de aplicação, navegadores, cookies, cache, proxy, VPN, DNS e ferramentas de busca'},
    {'numero': 7, 'titulo': 'Redes de Computadores', 'descricao': 'Modelos OSI/TCP-IP, topologias, endereçamento IP, sub-redes, cabeamento e equipamentos de rede'},
]

QUESTOES = {
    'Segurança da Informação': [
        {
            'enunciado': 'Em uma campanha de conscientização promovida por um Tribunal Regional Federal, o setor de TI explicou aos servidores que a Segurança da Informação se sustenta em quatro princípios fundamentais — confidencialidade, integridade, disponibilidade e autenticidade (CIDA). Considerando esses princípios, assinale a alternativa correta.',
            'opcoes': ['A) Confidencialidade garante que a informação não seja alterada sem autorização durante o armazenamento ou transmissão.', 'B) Integridade assegura que a informação esteja sempre acessível aos usuários autorizados quando necessária.', 'C) Disponibilidade refere-se à proteção da informação contra acessos não autorizados.', 'D) Autenticidade visa confirmar que a informação foi originada por quem realmente alega tê-la produzido.', 'E) Os quatro princípios são sinônimos e podem ser usados de forma intercambiável em políticas de segurança.'],
            'resposta': 'D',
            'explicacao': 'Os princípios CIDA têm conceitos distintos: Confidencialidade — apenas pessoas autorizadas acessam a informação (proteção contra acesso indevido); Integridade — a informação não é alterada sem autorização (proteção contra adulteração); Disponibilidade — a informação está acessível aos autorizados quando necessário; Autenticidade — confirma que a informação veio de quem afirma tê-la enviado/produzido. As alternativas A, B e C trocam os conceitos. A correta é a D.',
            'dica': 'Mnemônico CIDA: Confidencialidade = "só quem pode vê"; Integridade = "ninguém mexe"; Disponibilidade = "está no ar"; Autenticidade = "é quem diz ser".',
            'dificuldade': 'fácil',
            'fonte': 'CESPE',
            'ano': 2023,
            'titulo': 'CESPE/TRF/2023 - Princípios CIDA'
        },
        {
            'enunciado': 'Um servidor público precisa enviar um documento sigiloso para outro órgão e deseja garantir que apenas o destinatário possa lê-lo. Para isso, utiliza criptografia assimétrica. Nessa situação, qual chave deve ser utilizada para CIFRAR a mensagem?',
            'opcoes': ['A) A chave privada do remetente.', 'B) A chave pública do remetente.', 'C) A chave privada do destinatário.', 'D) A chave pública do destinatário.', 'E) Uma chave simétrica compartilhada previamente entre as partes.'],
            'resposta': 'D',
            'explicacao': 'Na criptografia assimétrica há um par de chaves (pública e privada) matematicamente relacionadas. Para garantir CONFIDENCIALIDADE, o remetente cifra com a CHAVE PÚBLICA DO DESTINATÁRIO — assim, somente quem possui a respectiva chave privada (o destinatário) consegue decifrar. Já para garantir AUTENTICIDADE (assinatura digital), o remetente cifra/assina com sua própria chave privada, e qualquer um pode verificar com a chave pública do remetente.',
            'dica': 'Para SIGILO: cifre com a PÚBLICA do destinatário. Para ASSINAR: cifre com a PRIVADA do remetente. "Pública para enviar segredo, privada para provar identidade".',
            'dificuldade': 'médio',
            'fonte': 'CESPE',
            'ano': 2023,
            'titulo': 'CESPE/PF/2023 - Criptografia Assimétrica'
        },
        {
            'enunciado': 'Julgue o item: "A criptografia simétrica utiliza a mesma chave para cifrar e decifrar uma mensagem, sendo geralmente mais rápida do que a criptografia assimétrica, porém apresenta o desafio de distribuição segura da chave entre as partes."',
            'opcoes': ['A) Verdadeiro', 'B) Falso'],
            'resposta': 'A',
            'explicacao': 'A afirmativa está correta. A criptografia simétrica (ex.: AES, DES, 3DES) usa uma única chave secreta tanto para cifrar quanto para decifrar, sendo computacionalmente mais rápida e adequada a grandes volumes de dados. Sua principal limitação é a distribuição segura da chave entre as partes — se alguém interceptar a chave, toda a comunicação fica comprometida. Por isso, é comum usar a assimétrica para trocar a chave simétrica e a simétrica para o tráfego em si (modelo híbrido — TLS, por exemplo).',
            'dica': 'Simétrica = MESMA chave (rápida, problema = distribuir a chave). Assimétrica = DUAS chaves (lenta, resolve a distribuição). HTTPS usa as duas: assimétrica negocia, simétrica trafega.',
            'dificuldade': 'fácil',
            'fonte': 'CESPE',
            'ano': 2022,
            'titulo': 'CESPE/TJ-DFT/2022 - Criptografia Simétrica'
        },
        {
            'enunciado': 'O certificado digital ICP-Brasil é amplamente utilizado por servidores públicos federais para acesso a sistemas como SEI, SIAFI e e-CAC da Receita Federal. Sobre o certificado digital, é correto afirmar que:',
            'opcoes': ['A) É emitido pelo próprio usuário e não exige validação por terceiros.', 'B) Vincula uma chave pública à identidade de uma pessoa física ou jurídica e é emitido por uma Autoridade Certificadora (AC).', 'C) Substitui completamente a necessidade de senhas em sistemas de informação.', 'D) Tem validade vitalícia, dispensando renovação periódica.', 'E) É um arquivo de texto puro, sem qualquer mecanismo criptográfico.'],
            'resposta': 'B',
            'explicacao': 'Um certificado digital é uma estrutura de dados (no padrão X.509) que vincula uma chave pública à identidade do titular (CPF/CNPJ), sendo emitido e assinado por uma Autoridade Certificadora (AC) confiável. No Brasil, a hierarquia ICP-Brasil é coordenada pelo ITI (Instituto Nacional de Tecnologia da Informação), com a AC-Raiz no topo. Os certificados têm prazo de validade (tipicamente 1 a 3 anos), exigindo renovação. Modelos comuns: A1 (arquivo no computador) e A3 (em token ou cartão).',
            'dica': 'Certificado = "RG digital" emitido por uma Autoridade Certificadora (AC). ICP-Brasil = hierarquia oficial. A1 = arquivo (1 ano), A3 = token/cartão (até 3 anos).',
            'dificuldade': 'médio',
            'fonte': 'FCC',
            'ano': 2023,
            'titulo': 'FCC/TRT/2023 - Certificado Digital ICP-Brasil'
        },
        {
            'enunciado': 'A assinatura digital é um mecanismo criptográfico que garante autenticidade, integridade e não repúdio de um documento eletrônico. O processo correto de assinatura digital de um documento envolve:',
            'opcoes': ['A) Cifrar todo o documento com a chave pública do remetente e enviar ao destinatário.', 'B) Calcular um hash do documento e cifrá-lo com a chave privada do remetente, anexando-o ao documento.', 'C) Cifrar o documento com a chave simétrica do destinatário, sem cálculo de hash.', 'D) Calcular o hash do documento e cifrá-lo com a chave pública do destinatário.', 'E) Apenas anexar uma imagem digitalizada da assinatura manuscrita ao final do arquivo.'],
            'resposta': 'B',
            'explicacao': 'O processo correto da assinatura digital é: 1) calcula-se um HASH (resumo criptográfico) do documento usando algoritmos como SHA-256; 2) cifra-se esse hash com a CHAVE PRIVADA DO REMETENTE, gerando a assinatura; 3) o documento + assinatura é enviado. Para verificar, o destinatário decifra a assinatura com a chave pública do remetente (obtendo o hash original) e calcula um novo hash do documento recebido — se forem iguais, o documento está íntegro e a autoria está confirmada. Garante autenticidade, integridade e não repúdio.',
            'dica': 'Assinatura digital = HASH cifrado com a chave PRIVADA do remetente. Não é cifrar o documento todo — é cifrar o "resumo" dele. Verifica com a chave pública do remetente.',
            'dificuldade': 'difícil',
            'fonte': 'CESPE',
            'ano': 2024,
            'titulo': 'CESPE/TCU/2024 - Assinatura Digital'
        },
        {
            'enunciado': 'Sobre as funções HASH criptográficas (como MD5, SHA-1, SHA-256), julgue o item: "Uma função hash criptográfica é unidirecional — produz uma saída de tamanho fixo a partir de uma entrada de tamanho variável e, idealmente, não permite a recuperação da entrada original a partir do hash."',
            'opcoes': ['A) Verdadeiro', 'B) Falso'],
            'resposta': 'A',
            'explicacao': 'A afirmativa está correta. Funções hash criptográficas (resumo de mensagem) possuem três propriedades essenciais: 1) UNIDIRECIONALIDADE — é computacionalmente inviável obter a mensagem original a partir do hash; 2) SAÍDA DE TAMANHO FIXO — independente do tamanho da entrada (1KB ou 1GB), o hash tem tamanho fixo (ex.: SHA-256 sempre gera 256 bits); 3) RESISTÊNCIA A COLISÕES — é improvável que duas entradas diferentes gerem o mesmo hash. MD5 e SHA-1 são considerados quebrados; recomenda-se SHA-256 ou superior.',
            'dica': 'Hash = "impressão digital" da informação. Unidirecional, tamanho fixo, sem colisão. SHA-256 é o padrão atual; MD5 e SHA-1 estão obsoletos.',
            'dificuldade': 'fácil',
            'fonte': 'FGV',
            'ano': 2023,
            'titulo': 'FGV/TJ-RS/2023 - Funções Hash'
        },
        {
            'enunciado': 'Em 2023, diversos órgãos públicos brasileiros foram alvo de ataques que criptografaram arquivos críticos e exigiram pagamento em criptomoedas para liberação. Esse tipo de ataque é classificado como:',
            'opcoes': ['A) Phishing.', 'B) Ransomware.', 'C) Man-in-the-Middle (MitM).', 'D) DDoS.', 'E) SQL Injection.'],
            'resposta': 'B',
            'explicacao': 'Ransomware é um malware que sequestra os dados da vítima por meio de criptografia e exige resgate (ransom) — geralmente em criptomoedas como Bitcoin — para fornecer a chave de decifração. Casos famosos: WannaCry (2017), Conti, LockBit. As principais formas de proteção são: backup offline (3-2-1: três cópias, dois meios, uma off-site), atualização de sistemas, antivírus, treinamento de usuários (a maioria dos ataques começa via phishing). As demais alternativas tratam de outros tipos de ataque com objetivos distintos.',
            'dica': 'Ransom = resgate. Ransomware = "sequestro digital" via criptografia. Defesa principal: BACKUP OFFLINE + atualizações + cuidado com anexos de e-mail.',
            'dificuldade': 'fácil',
            'fonte': 'CESPE',
            'ano': 2023,
            'titulo': 'CESPE/PF/2023 - Ransomware'
        },
        {
            'enunciado': 'Um servidor público recebeu um e-mail aparentemente vindo do "Banco do Brasil" solicitando que ele clicasse em um link para "regularizar sua conta corrente". Ao clicar, foi direcionado a uma página falsa que imitava o site do banco. Esse ataque é caracterizado como:',
            'opcoes': ['A) Ransomware.', 'B) DDoS.', 'C) Phishing.', 'D) SQL Injection.', 'E) Buffer overflow.'],
            'resposta': 'C',
            'explicacao': 'Phishing (do inglês "fishing" — pescar) é um ataque de engenharia social no qual o atacante se passa por uma entidade confiável (banco, órgão público, empresa) para enganar a vítima e obter dados sensíveis (senhas, dados bancários, CPF). Variações: Spear Phishing (direcionado a alvos específicos), Whaling (direcionado a executivos), Vishing (por voz/telefone), Smishing (por SMS). Sinais de phishing: urgência, links suspeitos, erros gramaticais, remetentes parecidos mas diferentes do oficial.',
            'dica': 'Phishing = "pescaria de senhas". Sempre desconfie de e-mails com URGÊNCIA, links abreviados ou pedidos de dados sigilosos. Confira o remetente e passe o mouse sobre o link antes de clicar.',
            'dificuldade': 'fácil',
            'fonte': 'FCC',
            'ano': 2022,
            'titulo': 'FCC/TRE-AP/2022 - Phishing'
        },
        {
            'enunciado': 'Um portal de serviços de uma prefeitura ficou indisponível após receber milhões de requisições simultâneas vindas de uma botnet com computadores comprometidos espalhados pelo mundo. Esse tipo de ataque é caracterizado como:',
            'opcoes': ['A) MitM (Man-in-the-Middle).', 'B) DDoS (Distributed Denial of Service).', 'C) Ransomware.', 'D) Cross-Site Scripting (XSS).', 'E) Engenharia social.'],
            'resposta': 'B',
            'explicacao': 'DDoS (Distributed Denial of Service — Negação de Serviço Distribuída) é um ataque que sobrecarrega servidores, redes ou aplicações com tráfego excessivo originado de múltiplas máquinas comprometidas (botnet), tornando o serviço indisponível para usuários legítimos. Difere do DoS comum (não distribuído) pela origem múltipla e simultânea. Mitigações: serviços anti-DDoS (Cloudflare, AWS Shield), rate limiting, CDN, firewall de aplicação (WAF). Atinge disponibilidade — princípio "D" do CIDA.',
            'dica': 'DDoS = ataque DISTRIBUÍDO de muitos zumbis (botnet) ao mesmo tempo. Atinge a DISPONIBILIDADE. Lembre: DDoS = "Derrubar o site Disponível".',
            'dificuldade': 'médio',
            'fonte': 'CESPE',
            'ano': 2024,
            'titulo': 'CESPE/STJ/2024 - Ataque DDoS'
        },
        {
            'enunciado': 'Um atacante conseguiu interceptar a comunicação entre um cidadão e o portal Gov.br, posicionando-se entre as duas partes e capturando credenciais sem que nenhuma das partes percebesse. Esse ataque é classificado como:',
            'opcoes': ['A) SQL Injection — exploração de falhas em consultas SQL.', 'B) Phishing — captura de dados via páginas falsas.', 'C) MitM (Man-in-the-Middle) — interceptação ativa entre as partes.', 'D) Ransomware — sequestro de dados.', 'E) Cross-Site Request Forgery (CSRF).'],
            'resposta': 'C',
            'explicacao': 'O ataque Man-in-the-Middle (MitM, "homem no meio") ocorre quando um atacante se posiciona entre duas partes que se comunicam, podendo apenas espionar (passivo) ou também alterar mensagens (ativo). Vetores comuns: redes Wi-Fi públicas sem criptografia, ARP spoofing, DNS spoofing, certificados forjados. Defesas: HTTPS com certificados válidos (TLS), VPN em redes não confiáveis, HSTS, certificate pinning, autenticação mútua. SQL Injection (A) ataca o banco; phishing (B) usa engano; ransomware (D) sequestra dados; CSRF (E) força ações em sessões já autenticadas.',
            'dica': 'MitM = "homem no meio" intercepta a conversa. Defesa: HTTPS + VPN em Wi-Fi público. Nunca use Wi-Fi aberto para acessar bancos!',
            'dificuldade': 'difícil',
            'fonte': 'CESPE',
            'ano': 2024,
            'titulo': 'CESPE/Polícia Federal/2024 - Man-in-the-Middle'
        },
    ],
    'Internet e Navegação': [
        {
            'enunciado': 'Os protocolos da camada de aplicação são amplamente cobrados em concursos públicos. Sobre eles, assinale a alternativa correta:',
            'opcoes': ['A) HTTP usa criptografia por padrão para proteger a transmissão de dados.', 'B) HTTPS é uma evolução do HTTP que utiliza TLS/SSL para garantir confidencialidade e integridade.', 'C) FTP transmite arquivos sempre de forma criptografada por padrão.', 'D) SMTP é um protocolo utilizado exclusivamente para receber e-mails.', 'E) POP3 e IMAP são protocolos idênticos, sem qualquer diferença prática.'],
            'resposta': 'B',
            'explicacao': 'HTTPS (HTTP Secure) é o HTTP encapsulado em TLS/SSL, garantindo confidencialidade (cifragem do tráfego), integridade (detecção de alterações) e autenticidade do servidor (via certificado digital). Erros das demais: A — HTTP é texto puro, sem criptografia; C — FTP padrão é texto puro (FTPS/SFTP é que são seguros); D — SMTP é para ENVIO de e-mails; E — POP3 e IMAP têm diferenças importantes (POP3 baixa e geralmente apaga do servidor; IMAP sincroniza, mantendo no servidor).',
            'dica': 'HTTP = porta 80, sem cripto. HTTPS = porta 443, com TLS. SMTP envia (25/587), POP3 recebe baixando (110), IMAP recebe sincronizando (143).',
            'dificuldade': 'fácil',
            'fonte': 'CESPE',
            'ano': 2022,
            'titulo': 'CESPE/TRT/2022 - Protocolos de Aplicação'
        },
        {
            'enunciado': 'Uma servidora pública precisa configurar o aplicativo de e-mail em seu celular para acessar a caixa institucional, podendo ler as mensagens tanto pelo celular quanto pelo computador, mantendo o status de leitura sincronizado entre os dispositivos. Qual protocolo é mais adequado para essa configuração?',
            'opcoes': ['A) SMTP.', 'B) POP3.', 'C) IMAP.', 'D) FTP.', 'E) HTTP.'],
            'resposta': 'C',
            'explicacao': 'IMAP (Internet Message Access Protocol — porta 143, ou 993 com TLS) mantém as mensagens no servidor e SINCRONIZA o estado (lido/não lido, pastas, marcações) entre múltiplos dispositivos. É ideal para acesso simultâneo. Já o POP3 (Post Office Protocol — porta 110/995) baixa as mensagens para o cliente e tradicionalmente as remove do servidor — adequado para um único dispositivo offline. SMTP é para envio. FTP é para arquivos. HTTP é web.',
            'dica': 'IMAP = "Internet, Múltiplos Acessos, Permanece" no servidor (sincroniza). POP3 = "Pega e Off" — baixa e some. Para celular + PC, sempre IMAP.',
            'dificuldade': 'médio',
            'fonte': 'FCC',
            'ano': 2023,
            'titulo': 'FCC/TRE-PE/2023 - IMAP vs POP3'
        },
        {
            'enunciado': 'Julgue o item: "Os cookies são pequenos arquivos de texto armazenados pelo navegador no computador do usuário, contendo informações enviadas pelo servidor web, podendo ser usados para manter sessões de login, preferências do usuário e rastreamento de comportamento."',
            'opcoes': ['A) Verdadeiro', 'B) Falso'],
            'resposta': 'A',
            'explicacao': 'A afirmativa está correta. Cookies são pequenos arquivos (até ~4KB) que o servidor envia ao navegador, que os armazena e os reenvia em requisições subsequentes ao mesmo domínio. Tipos: de sessão (apagam ao fechar o navegador) e persistentes (com data de expiração); próprios (do site) e de terceiros (rastreadores); seguros (apenas em HTTPS via flag Secure) e HttpOnly (inacessíveis ao JavaScript, contra XSS). Servem para manter login, preferências, carrinhos de compra e rastreamento publicitário (LGPD/GDPR exigem consentimento).',
            'dica': 'Cookie = "biscoito que o site dá ao navegador para reconhecer você depois". Sessão (volátil) x Persistente (com prazo). LGPD exige aviso/consentimento.',
            'dificuldade': 'fácil',
            'fonte': 'CESPE',
            'ano': 2023,
            'titulo': 'CESPE/TJ-PA/2023 - Cookies'
        },
        {
            'enunciado': 'O DNS (Domain Name System) é um serviço fundamental da Internet. Qual é a sua função principal?',
            'opcoes': ['A) Criptografar dados em trânsito entre o cliente e o servidor.', 'B) Traduzir nomes de domínio (ex.: gov.br) em endereços IP correspondentes.', 'C) Distribuir endereços IP dinâmicos para dispositivos em uma rede local.', 'D) Filtrar pacotes maliciosos antes que cheguem ao servidor.', 'E) Hospedar páginas web e servir arquivos HTML aos clientes.'],
            'resposta': 'B',
            'explicacao': 'O DNS (Sistema de Nomes de Domínio — porta 53 UDP/TCP) traduz nomes de domínio amigáveis (ex.: www.gov.br) em endereços IP numéricos (ex.: 200.198.219.45) que os roteadores usam para encaminhar pacotes. Funciona como uma "lista telefônica" da Internet, organizada hierarquicamente: raiz (.) → TLD (.br, .com) → domínio (gov.br) → subdomínio (www). Distribuir IP dinâmico é função do DHCP; filtrar pacotes é firewall; hospedar páginas é servidor web (HTTP/HTTPS). Ataques comuns ao DNS: DNS spoofing/cache poisoning.',
            'dica': 'DNS = "agenda telefônica da Internet": nome → IP. Porta 53. Sem DNS, você teria que decorar 200.198.219.45 em vez de gov.br.',
            'dificuldade': 'fácil',
            'fonte': 'FGV',
            'ano': 2022,
            'titulo': 'FGV/TJ-SC/2022 - DNS'
        },
        {
            'enunciado': 'Em uma URL como "https://www.tcu.gov.br:443/relatorios?ano=2024#topo", o que representa, respectivamente, "https", "www.tcu.gov.br", "443", "/relatorios", "?ano=2024" e "#topo"?',
            'opcoes': ['A) Protocolo, host, porta, caminho, query string, fragmento.', 'B) Caminho, host, protocolo, porta, fragmento, query string.', 'C) Host, protocolo, query string, caminho, fragmento, porta.', 'D) Protocolo, porta, host, query string, caminho, fragmento.', 'E) Fragmento, host, porta, protocolo, caminho, query string.'],
            'resposta': 'A',
            'explicacao': 'Estrutura padrão de uma URL (RFC 3986): esquema/protocolo (https) :// host (www.tcu.gov.br) : porta (443) / caminho (/relatorios) ? query string (ano=2024) # fragmento (topo). O protocolo indica como acessar; o host é o servidor; a porta especifica o serviço (443 = HTTPS padrão, 80 = HTTP); o caminho é o recurso; a query string passa parâmetros; o fragmento é uma âncora interna ao documento (não vai para o servidor — apenas o navegador interpreta).',
            'dica': 'URL = Protocolo://Host:Porta/Caminho?Query#Fragmento. Mnemônico: "PHPCQF" — Protocolo, Host, Porta, Caminho, Query, Fragmento.',
            'dificuldade': 'médio',
            'fonte': 'CESPE',
            'ano': 2023,
            'titulo': 'CESPE/MPU/2023 - Estrutura de URL'
        },
        {
            'enunciado': 'Uma VPN (Virtual Private Network) é frequentemente utilizada por servidores em trabalho remoto para acessar sistemas de seu órgão. Sobre VPN, é correto afirmar:',
            'opcoes': ['A) Acelera a navegação na Internet substituindo o navegador padrão.', 'B) Cria um túnel criptografado entre o cliente e a rede corporativa, protegendo o tráfego em redes não confiáveis.', 'C) É equivalente a um antivírus, eliminando malwares automaticamente.', 'D) Bloqueia totalmente o acesso à Internet enquanto está ativa.', 'E) Funciona somente em redes cabeadas, sendo incompatível com Wi-Fi.'],
            'resposta': 'B',
            'explicacao': 'VPN (Rede Privada Virtual) cria um TÚNEL CRIPTOGRAFADO entre o dispositivo do usuário e um servidor VPN (geralmente da empresa/órgão), de forma que o tráfego trafegue protegido mesmo em redes não confiáveis (Wi-Fi público, hotéis). Protocolos comuns: IPsec, OpenVPN, WireGuard, L2TP. Benefícios: confidencialidade do tráfego, acesso a recursos internos, mascaramento do IP. Não é antivírus, não acelera (pode até reduzir velocidade pelo overhead da cripto) e não bloqueia a Internet.',
            'dica': 'VPN = "túnel criptografado". Em rede pública, ligue a VPN para proteger o tráfego. Não confunda com antivírus.',
            'dificuldade': 'médio',
            'fonte': 'CESPE',
            'ano': 2024,
            'titulo': 'CESPE/AGU/2024 - VPN'
        },
        {
            'enunciado': 'Julgue o item: "Um servidor proxy atua como intermediário entre o cliente e os servidores de destino, podendo ser utilizado para filtrar conteúdo, aplicar políticas de acesso, implementar cache de páginas e mascarar o IP do cliente."',
            'opcoes': ['A) Verdadeiro', 'B) Falso'],
            'resposta': 'A',
            'explicacao': 'A afirmativa está correta. Um proxy (servidor procurador) atua como intermediário: o cliente envia a requisição ao proxy, que a encaminha ao servidor de destino e retorna a resposta. Funções: filtragem de conteúdo (bloquear sites em órgãos públicos), políticas de acesso (controle de banda/horário), cache (acelera acessos repetidos), anonimização (mascarar o IP), inspeção de tráfego e logging. Tipos: forward proxy (para clientes saírem da rede), reverse proxy (à frente de servidores web — Nginx, HAProxy), transparente.',
            'dica': 'Proxy = "intermediário/porteiro". Filtra, faz cache, mascara IP. Forward (saída) x Reverse (entrada). Squid é o mais conhecido em redes corporativas.',
            'dificuldade': 'médio',
            'fonte': 'FCC',
            'ano': 2023,
            'titulo': 'FCC/TRT-PR/2023 - Proxy'
        },
        {
            'enunciado': 'Sobre o cache do navegador, é correto afirmar que:',
            'opcoes': ['A) Cache armazena no servidor cópias das páginas visitadas pelos usuários.', 'B) Cache do navegador armazena localmente recursos como imagens, CSS e JS para acelerar o carregamento de páginas em visitas posteriores.', 'C) Cache é um sinônimo exato de cookie e ambos têm a mesma finalidade.', 'D) O cache não pode ser limpo manualmente pelo usuário.', 'E) Cache armazena exclusivamente as senhas dos sites visitados.'],
            'resposta': 'B',
            'explicacao': 'O cache do navegador é uma área de armazenamento LOCAL no computador do usuário onde o navegador guarda cópias de recursos estáticos (imagens, folhas de estilo CSS, scripts JS, fontes) para que, em visitas subsequentes, esses recursos sejam carregados rapidamente do disco em vez de baixados novamente. Cabeçalhos HTTP como Cache-Control, ETag e Expires controlam essa política. Diferenças: cookie (texto pequeno com dados de sessão/preferências, enviado em cada requisição) x cache (recursos para acelerar carregamento, usado localmente). Pode-se limpar pelo Ctrl+Shift+Del.',
            'dica': 'Cache = "memória rápida" para acelerar próximas visitas. Cookie = pequenos dados de sessão. Ctrl+F5 força recarregar ignorando cache.',
            'dificuldade': 'fácil',
            'fonte': 'FGV',
            'ano': 2022,
            'titulo': 'FGV/TJDFT/2022 - Cache do Navegador'
        },
        {
            'enunciado': 'Em ferramentas de busca como o Google, operadores avançados ajudam a refinar resultados. Em uma pesquisa por documentos PDF do Tribunal de Contas da União que contenham a expressão exata "auditoria operacional", a sintaxe correta seria:',
            'opcoes': ['A) auditoria operacional site:tcu.gov.br type:pdf', 'B) "auditoria operacional" site:tcu.gov.br filetype:pdf', 'C) auditoria+operacional in:tcu.gov.br format=pdf', 'D) [auditoria operacional] domain:tcu.gov.br ext:pdf', 'E) auditoria&operacional url:tcu.gov.br doctype:pdf'],
            'resposta': 'B',
            'explicacao': 'Operadores de busca avançada do Google: aspas ("...") — busca expressão exata; site:dominio.com — restringe ao domínio; filetype:ext (ou ext:ext) — restringe à extensão de arquivo; -palavra — exclui termo; OR — alternativa; intitle: — somente no título; inurl: — na URL; * — coringa. A sintaxe correta para o cenário é "auditoria operacional" site:tcu.gov.br filetype:pdf — observe as aspas para a expressão exata, site: para o domínio e filetype: para PDF.',
            'dica': 'Google: "frase exata", site:dominio, filetype:pdf, -termo (exclui), OR. Memorize: aspas + site + filetype são os mais cobrados.',
            'dificuldade': 'difícil',
            'fonte': 'CESPE',
            'ano': 2023,
            'titulo': 'CESPE/TCU/2023 - Operadores de Busca'
        },
        {
            'enunciado': 'Sobre o modo de navegação anônima/privada presente em navegadores como Chrome (Anônimo), Firefox (Privativa) e Edge (InPrivate), assinale a alternativa correta:',
            'opcoes': ['A) Garante anonimato total na Internet, ocultando o usuário do provedor de acesso e dos sites visitados.', 'B) Não armazena no dispositivo histórico, cookies e dados de formulários após o fechamento da sessão, mas não oculta o tráfego do provedor, do empregador ou dos sites visitados.', 'C) Cifra automaticamente todo o tráfego com criptografia ponta a ponta, equivalente a uma VPN.', 'D) Bloqueia completamente todos os anúncios e rastreadores na web.', 'E) Impede definitivamente que o computador seja infectado por malwares.'],
            'resposta': 'B',
            'explicacao': 'O modo anônimo/privado evita o ARMAZENAMENTO LOCAL de histórico, cookies, dados de formulários e cache após a sessão ser fechada — útil em computadores compartilhados. Porém, NÃO torna o usuário anônimo na Internet: o provedor (ISP), o empregador (em rede corporativa), o site visitado e a rede onde está conectado continuam vendo o tráfego e o IP. Não substitui VPN nem antivírus, e também não bloqueia anúncios. Para anonimato real, são necessárias ferramentas como Tor combinadas com VPN.',
            'dica': 'Anônimo/InPrivate = não grava localmente. NÃO esconde do provedor, do site nem do chefe. Para anonimato real, use Tor + VPN.',
            'dificuldade': 'médio',
            'fonte': 'CESPE',
            'ano': 2024,
            'titulo': 'CESPE/STF/2024 - Navegação Anônima'
        },
    ],
    'Redes de Computadores': [
        {
            'enunciado': 'O modelo OSI (Open Systems Interconnection) é frequentemente comparado ao modelo TCP/IP. Qual é a quantidade de camadas em cada um, respectivamente?',
            'opcoes': ['A) OSI: 4 camadas; TCP/IP: 7 camadas.', 'B) OSI: 7 camadas; TCP/IP: 4 camadas.', 'C) OSI: 5 camadas; TCP/IP: 5 camadas.', 'D) OSI: 6 camadas; TCP/IP: 3 camadas.', 'E) OSI: 7 camadas; TCP/IP: 7 camadas.'],
            'resposta': 'B',
            'explicacao': 'O modelo OSI possui 7 camadas: 1) Física, 2) Enlace, 3) Rede, 4) Transporte, 5) Sessão, 6) Apresentação, 7) Aplicação. O modelo TCP/IP (mais usado na prática) possui 4 camadas: 1) Acesso à Rede (Física + Enlace do OSI), 2) Internet (Rede), 3) Transporte, 4) Aplicação (Sessão + Apresentação + Aplicação do OSI). Algumas literaturas adotam TCP/IP com 5 camadas, separando Física e Enlace, mas a versão clássica do RFC 1122 são 4.',
            'dica': 'OSI = 7 camadas (FERTSAA — Física/Enlace/Rede/Transporte/Sessão/Apresentação/Aplicação). TCP/IP = 4 camadas. Memorize: "Para Enviar Recados Tente Sempre A Aplicação".',
            'dificuldade': 'fácil',
            'fonte': 'CESPE',
            'ano': 2022,
            'titulo': 'CESPE/TRE-MS/2022 - OSI x TCP/IP'
        },
        {
            'enunciado': 'Em qual camada do modelo OSI atuam, respectivamente, um SWITCH e um ROTEADOR?',
            'opcoes': ['A) Camada 1 (Física) e Camada 2 (Enlace).', 'B) Camada 2 (Enlace) e Camada 3 (Rede).', 'C) Camada 3 (Rede) e Camada 4 (Transporte).', 'D) Camada 4 (Transporte) e Camada 7 (Aplicação).', 'E) Camada 7 (Aplicação) e Camada 7 (Aplicação).'],
            'resposta': 'B',
            'explicacao': 'O SWITCH opera na CAMADA 2 (Enlace) — encaminha quadros (frames) com base no endereço MAC, mantendo uma tabela CAM. O ROTEADOR opera na CAMADA 3 (Rede) — encaminha pacotes IP entre redes diferentes com base em tabelas de roteamento. Para referência: HUB = Camada 1 (Física, repete sinal a todos); BRIDGE = Camada 2; FIREWALL pode operar nas camadas 3, 4 ou 7 (filtra por IP, porta ou conteúdo). Existem switches "L3" que também roteiam, mas o switch tradicional é L2.',
            'dica': 'HUB (1 — burro) → SWITCH (2 — MAC) → ROTEADOR (3 — IP) → FIREWALL (3/4/7). Mnemônico: "Hubs Sabem Roteadores Filtram".',
            'dificuldade': 'médio',
            'fonte': 'FCC',
            'ano': 2023,
            'titulo': 'FCC/TRT-RJ/2023 - Camadas OSI - Equipamentos'
        },
        {
            'enunciado': 'Sobre topologias de rede, julgue o item: "Na topologia em ESTRELA, todos os dispositivos se conectam a um nó central (geralmente um switch); a falha do nó central derruba toda a rede, mas a falha de um dispositivo periférico não afeta os demais."',
            'opcoes': ['A) Verdadeiro', 'B) Falso'],
            'resposta': 'A',
            'explicacao': 'A afirmativa está correta. Na topologia ESTRELA — a mais usada em redes locais (LAN) modernas — todos os dispositivos se conectam a um equipamento central (switch). Vantagens: fácil identificação de falhas, expansão simples, falha de um nó não afeta os demais. Desvantagem: ponto único de falha (se o switch cair, toda a rede cai). Outras topologias: BARRAMENTO (cabo único; falha do cabo derruba tudo); ANEL (cada nó conecta-se ao próximo formando círculo — Token Ring); MALHA (todos com todos — alta redundância e custo, usada em backbones).',
            'dica': 'Estrela = switch no centro. Barramento = um fio só. Anel = circular. Malha = todos com todos. Estrela é dominante em LAN moderna.',
            'dificuldade': 'fácil',
            'fonte': 'CESPE',
            'ano': 2022,
            'titulo': 'CESPE/TJ-RR/2022 - Topologia em Estrela'
        },
        {
            'enunciado': 'Sobre endereçamento IPv4, qual das alternativas apresenta um endereço VÁLIDO de host?',
            'opcoes': ['A) 256.10.10.1', 'B) 192.168.1.300', 'C) 10.0.0.1', 'D) 192.168.1', 'E) 192.168.1.1.5'],
            'resposta': 'C',
            'explicacao': 'Um endereço IPv4 é composto por 4 OCTETOS (8 bits cada, total 32 bits) separados por pontos, com cada octeto variando de 0 a 255. Análise das alternativas: A) 256 inválido (>255); B) 300 inválido (>255); C) 10.0.0.1 — VÁLIDO (faixa privada classe A: 10.0.0.0/8); D) só 3 octetos — inválido; E) 5 octetos — inválido. Faixas privadas (RFC 1918): 10.0.0.0/8 (classe A), 172.16.0.0/12 (classe B), 192.168.0.0/16 (classe C). Loopback: 127.0.0.0/8.',
            'dica': 'IPv4 = 4 octetos de 0 a 255. Privadas: 10.x, 172.16-31.x, 192.168.x. Loopback: 127.0.0.1. Octeto fora de 0-255 é inválido.',
            'dificuldade': 'fácil',
            'fonte': 'FGV',
            'ano': 2023,
            'titulo': 'FGV/TJ-RJ/2023 - Endereço IPv4'
        },
        {
            'enunciado': 'Qual das características abaixo descreve corretamente o IPv6 em relação ao IPv4?',
            'opcoes': ['A) IPv6 utiliza endereços de 32 bits, ampliando em pouco a capacidade do IPv4.', 'B) IPv6 utiliza endereços de 128 bits, representados em 8 grupos hexadecimais separados por dois-pontos, expandindo enormemente o espaço de endereçamento.', 'C) IPv6 substituiu completamente o IPv4 no Brasil em 2010 e este não é mais utilizado.', 'D) IPv6 é representado em decimal pontuado, idêntico ao IPv4.', 'E) IPv6 utiliza apenas endereços de 64 bits e não suporta multicast.'],
            'resposta': 'B',
            'explicacao': 'IPv6 utiliza endereços de 128 BITS (vs. 32 bits do IPv4), oferecendo aproximadamente 3,4×10^38 endereços — o que praticamente elimina a escassez. A representação é em 8 GRUPOS HEXADECIMAIS de 16 bits separados por dois-pontos (ex.: 2001:0db8:85a3:0000:0000:8a2e:0370:7334), com regras de abreviação (zeros à esquerda omitidos; sequências de zeros consecutivos por "::"). IPv6 trouxe melhorias: autoconfiguração (SLAAC), IPsec nativo (opcional no IPv4), eliminação do NAT em larga escala, multicast nativo. IPv4 e IPv6 coexistem (dual-stack).',
            'dica': 'IPv4 = 32 bits, decimal pontuado (4 octetos). IPv6 = 128 bits, hexadecimal com ":" (8 grupos). "::" abrevia zeros consecutivos.',
            'dificuldade': 'médio',
            'fonte': 'CESPE',
            'ano': 2023,
            'titulo': 'CESPE/Telebras/2023 - IPv6'
        },
        {
            'enunciado': 'Em uma sub-rede com a máscara 255.255.255.0 (/24), qual é o número total de endereços e quantos são utilizáveis para hosts?',
            'opcoes': ['A) 256 endereços totais e 256 utilizáveis.', 'B) 256 endereços totais e 254 utilizáveis (excluindo rede e broadcast).', 'C) 128 endereços totais e 126 utilizáveis.', 'D) 1024 endereços totais e 1022 utilizáveis.', 'E) 65536 endereços totais e 65534 utilizáveis.'],
            'resposta': 'B',
            'explicacao': 'Uma máscara /24 (255.255.255.0) reserva 24 bits para a rede e 8 bits para hosts. O total é 2^8 = 256 endereços. Porém, 2 são reservados: o primeiro endereço (todos os bits do host em 0) é o de REDE (ex.: 192.168.1.0); o último (todos os bits do host em 1) é o de BROADCAST (ex.: 192.168.1.255). Logo, 256 - 2 = 254 endereços utilizáveis para hosts. Fórmula geral: hosts utilizáveis = 2^n - 2, onde n é o número de bits de host.',
            'dica': 'Hosts utilizáveis = 2^n - 2 (subtrai endereço de rede e de broadcast). /24 = 254 hosts. /25 = 126. /26 = 62. /30 = 2 (links ponto-a-ponto).',
            'dificuldade': 'difícil',
            'fonte': 'CESPE',
            'ano': 2023,
            'titulo': 'CESPE/TRF-1/2023 - Sub-redes'
        },
        {
            'enunciado': 'Um técnico de TI de uma autarquia federal precisa identificar o equipamento adequado para SEGMENTAR redes diferentes (ex.: rede administrativa e rede de visitantes), encaminhando pacotes entre elas com base no endereço IP de destino. O equipamento correto é:',
            'opcoes': ['A) Hub.', 'B) Switch (não gerenciável L2).', 'C) Roteador.', 'D) Bridge.', 'E) Repetidor.'],
            'resposta': 'C',
            'explicacao': 'O ROTEADOR (camada 3 — Rede) é o equipamento que interconecta REDES DIFERENTES, encaminhando pacotes IP com base em tabelas de roteamento. É essencial para segmentar redes lógicas (sub-redes) e direcionar tráfego entre elas, inclusive para a Internet. O SWITCH L2 atua dentro da mesma rede com endereços MAC (não roteia entre sub-redes). O HUB apenas repete sinal eletrônico (camada 1). A BRIDGE conecta segmentos da mesma rede (camada 2). O REPETIDOR apenas amplifica sinal. Switches L3 podem rotear, mas a opção mais correta para segmentar redes é o roteador.',
            'dica': 'Para conectar REDES DIFERENTES → ROTEADOR (camada 3, decide pelo IP). Dentro da MESMA REDE → SWITCH (camada 2, decide pelo MAC).',
            'dificuldade': 'médio',
            'fonte': 'FCC',
            'ano': 2022,
            'titulo': 'FCC/TRT-SP/2022 - Roteador'
        },
        {
            'enunciado': 'Julgue o item: "Um firewall é um dispositivo (hardware, software ou ambos) que monitora e controla o tráfego de rede com base em regras de segurança previamente definidas, podendo operar nas camadas 3 (rede), 4 (transporte) e 7 (aplicação) do modelo OSI."',
            'opcoes': ['A) Verdadeiro', 'B) Falso'],
            'resposta': 'A',
            'explicacao': 'A afirmativa está correta. O FIREWALL é um sistema de segurança que filtra o tráfego entre redes (geralmente entre rede interna e Internet) conforme regras (whitelist/blacklist). Tipos: 1) Filtro de pacotes (camada 3/4) — analisa IP e portas; 2) Stateful (camada 4) — mantém estado das conexões; 3) Proxy/Aplicação (camada 7) — analisa o conteúdo da aplicação (HTTP, FTP); 4) Next-Generation Firewall (NGFW) — combina IDS/IPS, antivírus, inspeção profunda. Pode ser hardware (appliance), software (iptables, Windows Firewall) ou serviço de nuvem.',
            'dica': 'Firewall = "porteiro da rede" com regras. Pode ser de pacote (3/4), stateful, de aplicação (7) ou NGFW. Bloqueia/permite por IP, porta, protocolo ou conteúdo.',
            'dificuldade': 'fácil',
            'fonte': 'CESPE',
            'ano': 2023,
            'titulo': 'CESPE/MPF/2023 - Firewall'
        },
        {
            'enunciado': 'Sobre cabeamento de redes, é correto afirmar que:',
            'opcoes': ['A) Cabos UTP categoria 6 (Cat6) suportam taxas de transmissão de até 10 Gbps em distâncias curtas, sendo amplamente usados em redes Gigabit Ethernet.', 'B) Cabos coaxiais são o padrão atual em redes locais corporativas.', 'C) Fibra óptica utiliza sinais elétricos e é mais suscetível à interferência eletromagnética que o par trançado.', 'D) Cabos UTP categoria 3 são adequados para redes 10 Gigabit Ethernet em qualquer distância.', 'E) Wi-Fi não é considerado um meio de transmissão de dados.'],
            'resposta': 'A',
            'explicacao': 'Cabos UTP (Unshielded Twisted Pair — par trançado sem blindagem) são os mais usados em LAN. Categorias relevantes: Cat5e (até 1 Gbps em 100m), Cat6 (até 1 Gbps em 100m e até 10 Gbps em até ~55m), Cat6a (10 Gbps em 100m), Cat7/Cat8 (frequências superiores). Erros das demais: B — coaxial é tecnologia obsoleta em LAN moderna; C — fibra usa sinal LUMINOSO e é IMUNE a interferência eletromagnética; D — Cat3 é antigo (telefonia/10Mbps); E — Wi-Fi é meio de transmissão sem fio (radiofrequência).',
            'dica': 'Cat5e/Cat6 (UTP) = padrão LAN moderna. Fibra = luz + imune a EMI + longa distância. Coaxial = obsoleto em LAN. Wi-Fi = sem fio.',
            'dificuldade': 'médio',
            'fonte': 'FGV',
            'ano': 2023,
            'titulo': 'FGV/Câmara/2023 - Cabeamento'
        },
        {
            'enunciado': 'Considere o seguinte cenário: uma autarquia federal possui a rede 192.168.10.0/26. Qual é a quantidade MÁXIMA de hosts utilizáveis nessa sub-rede?',
            'opcoes': ['A) 254 hosts.', 'B) 126 hosts.', 'C) 62 hosts.', 'D) 30 hosts.', 'E) 14 hosts.'],
            'resposta': 'C',
            'explicacao': 'Em /26, a máscara é 255.255.255.192. São 26 bits para rede e 32-26 = 6 bits para host. Total = 2^6 = 64 endereços. Subtraindo o endereço de rede e o de broadcast: 64 - 2 = 62 hosts utilizáveis. Tabela rápida: /24 → 254 hosts; /25 → 126; /26 → 62; /27 → 30; /28 → 14; /29 → 6; /30 → 2 (típico de links ponto-a-ponto). Saber essa tabela é essencial em concursos de TI.',
            'dica': 'Memorize a tabela: /24=254, /25=126, /26=62, /27=30, /28=14, /29=6, /30=2. Fórmula: 2^(32 - prefixo) - 2.',
            'dificuldade': 'difícil',
            'fonte': 'CESPE',
            'ano': 2024,
            'titulo': 'CESPE/Receita Federal/2024 - Cálculo de Sub-redes'
        },
    ],
}
