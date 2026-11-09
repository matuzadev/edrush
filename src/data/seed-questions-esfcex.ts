// ─── EsFCEx 2026 — Banco semente de capítulos e questões ─────────────────────
// Concurso: Curso de Formação de Oficiais do Quadro Complementar (CFO/QC) —
// Área de Informática — Exército Brasileiro / EsFCEx.
//
// Mapeamento de matérias em src/lib/concurso-areas.ts → bloco "ESFCEX".
// Capítulos refletem src/data/subjects.json.
// As questões totalizam 300+, distribuídas entre Conhecimentos Gerais
// (Português, História do Brasil, Geografia do Brasil) e Conhecimentos
// Específicos de Informática (Fundamentos, Redes, Segurança, BD, Cloud,
// Sistemas de Informação, Teoria da Informação, etc).
//
// Fontes do conteúdo programático:
//   - Edital ESEX2501 (12/03/2026) — esfcex.eb.mil.br
//   - Relação de Assuntos e Bibliografia EsFCEx 2026 — Anexo do edital
//   - Bibliografia clássica do edital: Fausto (História), Adas (Geografia),
//     Tanenbaum (Redes), Stallings (Segurança), Date/Elmasri (BD),
//     Bertalanffy (Teoria de Sistemas), Rezende (Sistemas de Informação).

import type { SeedQuestion } from './seed-questions';

// Capítulos do EsFCEx (alinhados aos slugs de subjects.json e concurso-areas.ts).
// Os títulos batem com src/data/subjects.json para que apareçam no quiz.
export const ESFCEX_CHAPTERS: {
  disciplina: string;
  numero: number;
  titulo: string;
  descricao?: string;
  is_primeiro?: boolean;
}[] = [
  // ── Conhecimentos Gerais — Português ─────────────────────────────────────
  { disciplina: 'compreensao-textos', numero: 1, titulo: 'Textos informativos, narrativos e argumentativos', is_primeiro: true,
    descricao: 'Identificação de tipologia textual e da intenção comunicativa do texto.' },
  { disciplina: 'compreensao-textos', numero: 2, titulo: 'Ideia principal e secundária',
    descricao: 'Identificação da tese, dos argumentos e das informações de apoio.' },
  { disciplina: 'compreensao-textos', numero: 3, titulo: 'Inferências',
    descricao: 'Pressupostos, subentendidos e conclusões implícitas do texto.' },
  { disciplina: 'compreensao-textos', numero: 4, titulo: 'Sentido explícito e implícito',
    descricao: 'Diferenciação entre o que está dito e o que está sugerido.' },
  { disciplina: 'compreensao-textos', numero: 5, titulo: 'Coesão e coerência textual',
    descricao: 'Mecanismos coesivos, conectores e progressão temática.' },

  { disciplina: 'gramatica-texto', numero: 1, titulo: 'Classes de palavras', is_primeiro: true,
    descricao: 'Substantivo, adjetivo, pronome, verbo, advérbio e demais classes.' },
  { disciplina: 'gramatica-texto', numero: 2, titulo: 'Emprego de tempos e modos verbais',
    descricao: 'Indicativo, subjuntivo, imperativo e tempos compostos.' },
  { disciplina: 'gramatica-texto', numero: 3, titulo: 'Voz ativa e passiva',
    descricao: 'Transformação entre vozes e agente da passiva.' },
  { disciplina: 'gramatica-texto', numero: 4, titulo: 'Concordância Verbal',
    descricao: 'Regras de concordância do verbo com o sujeito.' },
  { disciplina: 'gramatica-texto', numero: 5, titulo: 'Concordância Nominal',
    descricao: 'Concordância do adjetivo, artigo e pronome com o substantivo.' },
  { disciplina: 'gramatica-texto', numero: 6, titulo: 'Regência verbal e nominal',
    descricao: 'Verbos transitivos e regência de nomes com preposição.' },
  { disciplina: 'gramatica-texto', numero: 7, titulo: 'Crase',
    descricao: 'Uso obrigatório, facultativo e proibido da crase.' },
  { disciplina: 'gramatica-texto', numero: 8, titulo: 'Pontuação',
    descricao: 'Vírgula, ponto e vírgula, travessão e demais sinais.' },

  { disciplina: 'semantica', numero: 1, titulo: 'Significação das palavras', is_primeiro: true,
    descricao: 'Estudo do sentido das palavras no contexto.' },
  { disciplina: 'semantica', numero: 2, titulo: 'Sinônimos e antônimos',
    descricao: 'Relações de sentido entre palavras.' },
  { disciplina: 'semantica', numero: 3, titulo: 'Denotação e conotação',
    descricao: 'Sentido literal x sentido figurado.' },
  { disciplina: 'semantica', numero: 4, titulo: 'Ambiguidade',
    descricao: 'Duplo sentido por má construção sintática ou lexical.' },

  { disciplina: 'reescrita-textual', numero: 1, titulo: 'Substituição de palavras e expressões', is_primeiro: true,
    descricao: 'Reescrita preservando o sentido original.' },
  { disciplina: 'reescrita-textual', numero: 2, titulo: 'Reorganização de frases',
    descricao: 'Inversão de ordem e mudança de estrutura sintática.' },
  { disciplina: 'reescrita-textual', numero: 3, titulo: 'Manutenção do sentido original',
    descricao: 'Equivalência semântica entre versões reescritas.' },

  // ── Conhecimentos Gerais — História do Brasil ────────────────────────────
  { disciplina: 'historia-colonia', numero: 1, titulo: 'Descobrimento', is_primeiro: true,
    descricao: 'Chegada dos portugueses, expansão marítima e Tratado de Tordesilhas.' },
  { disciplina: 'historia-colonia', numero: 2, titulo: 'Capitanias hereditárias',
    descricao: 'Sistema de doação, donatários e fracassos do modelo.' },
  { disciplina: 'historia-colonia', numero: 3, titulo: 'Governo-geral',
    descricao: 'Tomé de Sousa, centralização e administração colonial.' },
  { disciplina: 'historia-colonia', numero: 4, titulo: 'Economia colonial',
    descricao: 'Açúcar, mineração, pacto colonial e ciclos econômicos.' },
  { disciplina: 'historia-colonia', numero: 5, titulo: 'Escravidão',
    descricao: 'Tráfico atlântico, trabalho escravo indígena e africano.' },
  { disciplina: 'historia-colonia', numero: 6, titulo: 'Invasões estrangeiras',
    descricao: 'Franceses, holandeses e a Guerra Brasílica.' },

  { disciplina: 'historia-imperio', numero: 1, titulo: 'Independência do Brasil', is_primeiro: true,
    descricao: 'Processo de emancipação e o Grito do Ipiranga (1822).' },
  { disciplina: 'historia-imperio', numero: 2, titulo: 'Primeiro Reinado',
    descricao: 'D. Pedro I, Constituição de 1824 e Confederação do Equador.' },
  { disciplina: 'historia-imperio', numero: 3, titulo: 'Período Regencial',
    descricao: 'Regências, Ato Adicional de 1834 e revoltas regenciais.' },
  { disciplina: 'historia-imperio', numero: 4, titulo: 'Segundo Reinado',
    descricao: 'D. Pedro II, café, Guerra do Paraguai e Lei Áurea.' },
  { disciplina: 'historia-imperio', numero: 5, titulo: 'Abolição da escravidão',
    descricao: 'Leis abolicionistas e processo até 13 de maio de 1888.' },
  { disciplina: 'historia-imperio', numero: 6, titulo: 'Proclamação da República',
    descricao: 'Crise do Império e Proclamação em 15 de novembro de 1889.' },

  { disciplina: 'historia-republica', numero: 1, titulo: 'República Velha', is_primeiro: true,
    descricao: 'Política do café-com-leite, oligarquias e coronelismo.' },
  { disciplina: 'historia-republica', numero: 2, titulo: 'Era Vargas',
    descricao: 'Revolução de 1930, Estado Novo e legislação trabalhista.' },
  { disciplina: 'historia-republica', numero: 3, titulo: 'Regime Militar',
    descricao: 'Golpe de 1964, AI-5, milagre econômico e abertura.' },
  { disciplina: 'historia-republica', numero: 4, titulo: 'Redemocratização',
    descricao: 'Diretas Já, Sarney, Plano Real e estabilização econômica.' },
  { disciplina: 'historia-republica', numero: 5, titulo: 'Constituição de 1988',
    descricao: 'Constituinte, Constituição Cidadã e seus princípios.' },

  { disciplina: 'historia-temas', numero: 1, titulo: 'Formação do Estado brasileiro', is_primeiro: true,
    descricao: 'Centralização x descentralização ao longo da história.' },
  { disciplina: 'historia-temas', numero: 2, titulo: 'Movimentos sociais',
    descricao: 'Canudos, Contestado, MST e movimentos urbanos.' },
  { disciplina: 'historia-temas', numero: 3, titulo: 'Questão agrária',
    descricao: 'Reforma agrária, latifúndios e conflitos no campo.' },
  { disciplina: 'historia-temas', numero: 4, titulo: 'Industrialização',
    descricao: 'Industrialização brasileira do XIX ao Plano de Metas.' },
  { disciplina: 'historia-temas', numero: 5, titulo: 'Urbanização',
    descricao: 'Êxodo rural e formação das metrópoles brasileiras.' },

  // ── Conhecimentos Gerais — Geografia do Brasil ───────────────────────────
  { disciplina: 'geografia-fisica', numero: 1, titulo: 'Relevo brasileiro', is_primeiro: true,
    descricao: 'Planaltos, planícies e depressões; classificações de Aroldo de Azevedo, Ross e Ab\'Sáber.' },
  { disciplina: 'geografia-fisica', numero: 2, titulo: 'Climas do Brasil',
    descricao: 'Equatorial, tropical, semiárido e subtropical.' },
  { disciplina: 'geografia-fisica', numero: 3, titulo: 'Biomas: Amazônia, Cerrado, Caatinga',
    descricao: 'Características, fauna, flora e ameaças ambientais.' },
  { disciplina: 'geografia-fisica', numero: 4, titulo: 'Biomas: Mata Atlântica, Pampas, Pantanal',
    descricao: 'Características e estado de conservação.' },
  { disciplina: 'geografia-fisica', numero: 5, titulo: 'Hidrografia brasileira',
    descricao: 'Bacias hidrográficas: Amazônica, Paraná, São Francisco, Tocantins.' },

  { disciplina: 'geografia-humana', numero: 1, titulo: 'População brasileira', is_primeiro: true,
    descricao: 'Crescimento, distribuição, miscigenação e censo demográfico.' },
  { disciplina: 'geografia-humana', numero: 2, titulo: 'Migrações internas',
    descricao: 'Êxodo rural, migrações Nordeste-Sudeste e fluxos atuais.' },
  { disciplina: 'geografia-humana', numero: 3, titulo: 'Urbanização',
    descricao: 'Metropolização, conurbação e hierarquia urbana.' },
  { disciplina: 'geografia-humana', numero: 4, titulo: 'Industrialização',
    descricao: 'Distribuição espacial da indústria e desconcentração.' },
  { disciplina: 'geografia-humana', numero: 5, titulo: 'Regiões metropolitanas',
    descricao: 'Conceito jurídico (LC 14/1973) e principais RMs do Brasil.' },

  { disciplina: 'geografia-economica', numero: 1, titulo: 'Agricultura', is_primeiro: true,
    descricao: 'Agronegócio, agricultura familiar e fronteira agrícola.' },
  { disciplina: 'geografia-economica', numero: 2, titulo: 'Pecuária',
    descricao: 'Bovinocultura, suinocultura e avicultura no Brasil.' },
  { disciplina: 'geografia-economica', numero: 3, titulo: 'Extrativismo',
    descricao: 'Mineral, vegetal e animal — desafios ambientais.' },
  { disciplina: 'geografia-economica', numero: 4, titulo: 'Indústria',
    descricao: 'Setores, polos industriais e desconcentração espacial.' },
  { disciplina: 'geografia-economica', numero: 5, titulo: 'Matriz energética',
    descricao: 'Hidrelétrica, eólica, solar, biomassa e fósseis.' },
  { disciplina: 'geografia-economica', numero: 6, titulo: 'Transportes',
    descricao: 'Modais rodoviário, ferroviário, aquaviário, aéreo e dutoviário.' },

  { disciplina: 'organizacao-territorio', numero: 1, titulo: 'Regiões do IBGE', is_primeiro: true,
    descricao: 'Norte, Nordeste, Centro-Oeste, Sudeste e Sul.' },
  { disciplina: 'organizacao-territorio', numero: 2, titulo: 'Fronteiras',
    descricao: 'Fronteiras terrestres do Brasil e países limítrofes.' },
  { disciplina: 'organizacao-territorio', numero: 3, titulo: 'Integração nacional',
    descricao: 'SUDENE, SUDAM, eixos rodoviários e telecomunicações.' },

  // ── Conhecimentos Específicos — Informática ──────────────────────────────
  { disciplina: 'fundamentos-informatica', numero: 1, titulo: 'Conceitos de internet e intranet', is_primeiro: true,
    descricao: 'Definições, diferenças, extranet e topologias.' },
  { disciplina: 'fundamentos-informatica', numero: 2, titulo: 'Tecnologias, ferramentas e aplicações da internet',
    descricao: 'WWW, e-mail, FTP, computação em nuvem, IoT.' },
  { disciplina: 'fundamentos-informatica', numero: 3, titulo: 'Navegadores, e-mail, redes sociais, busca e pesquisa',
    descricao: 'Chrome, Firefox, Edge, configurações de e-mail e operadores de busca.' },
  { disciplina: 'fundamentos-informatica', numero: 4, titulo: 'Sistemas Operacionais: Windows e Linux',
    descricao: 'Estrutura, gerenciamento de processos, arquivos, comandos.' },
  { disciplina: 'fundamentos-informatica', numero: 5, titulo: 'Acesso remoto',
    descricao: 'SSH, RDP, VNC, Telnet e suas características.' },
  { disciplina: 'fundamentos-informatica', numero: 6, titulo: 'Transferência de arquivos',
    descricao: 'FTP, SFTP, FTPS, SCP, HTTP, e protocolos correlatos.' },
  { disciplina: 'fundamentos-informatica', numero: 7, titulo: 'Aplicações multimídia',
    descricao: 'Codecs, streaming, formatos de áudio e vídeo.' },

  { disciplina: 'escritorio-produtividade', numero: 1, titulo: 'Microsoft Office: Word, Excel, PowerPoint', is_primeiro: true,
    descricao: 'Funções de planilha, formatação, atalhos e fórmulas.' },
  { disciplina: 'escritorio-produtividade', numero: 2, titulo: 'LibreOffice: Writer, Calc, Impress',
    descricao: 'Equivalentes livres do MS Office, formato ODF e diferenças.' },

  { disciplina: 'redes-de-computadores', numero: 1, titulo: 'Conceitos gerais de redes', is_primeiro: true,
    descricao: 'LAN, MAN, WAN, PAN e tipos de redes.' },
  { disciplina: 'redes-de-computadores', numero: 2, titulo: 'Modelo OSI e TCP/IP',
    descricao: 'Camadas, encapsulamento, comparação entre os modelos.' },
  { disciplina: 'redes-de-computadores', numero: 3, titulo: 'IPv4 e IPv6 — Endereçamento IP',
    descricao: 'Classes, sub-redes, máscaras, NAT, IPv6 e dual-stack.' },
  { disciplina: 'redes-de-computadores', numero: 4, titulo: 'Arquitetura de redes',
    descricao: 'Topologias, equipamentos (hub, switch, router) e cabeamento.' },
  { disciplina: 'redes-de-computadores', numero: 5, titulo: 'Noções de comunicação de dados',
    descricao: 'Bandas, modulação, codificação e transmissão.' },
  { disciplina: 'redes-de-computadores', numero: 6, titulo: 'Protocolos de camada de aplicação: HTTP/S, FTP, DNS, SMTP',
    descricao: 'Funcionamento, portas, segurança (TLS) e troubleshooting.' },
  { disciplina: 'redes-de-computadores', numero: 7, titulo: 'VPN e redes privadas',
    descricao: 'IPSec, SSL/TLS-VPN, túneis e segurança em VPN.' },
  { disciplina: 'redes-de-computadores', numero: 8, titulo: 'Protocolos de roteamento',
    descricao: 'RIP, OSPF, BGP — vetor de distância x estado de enlace.' },

  { disciplina: 'seguranca-informacao', numero: 1, titulo: 'Conceitos de segurança da informação', is_primeiro: true,
    descricao: 'CID (confidencialidade, integridade, disponibilidade), ameaças e riscos.' },
  { disciplina: 'seguranca-informacao', numero: 2, titulo: 'Malware: vírus, worms, pragas virtuais',
    descricao: 'Tipologia: vírus, worm, trojan, ransomware, spyware, rootkit.' },
  { disciplina: 'seguranca-informacao', numero: 3, titulo: 'Ferramentas de segurança: antivírus, firewall, anti-spyware',
    descricao: 'IDS, IPS, WAF, EDR, SIEM e suas finalidades.' },

  { disciplina: 'computacao-nuvem', numero: 1, titulo: 'Conceito de Cloud Computing', is_primeiro: true,
    descricao: 'Definição NIST, modelos IaaS/PaaS/SaaS e tipos de nuvem.' },
  { disciplina: 'computacao-nuvem', numero: 2, titulo: 'Características da computação em nuvem',
    descricao: 'Elasticidade, multitenancy, self-service, pay-per-use.' },
  { disciplina: 'computacao-nuvem', numero: 3, titulo: 'Vantagens e aplicações',
    descricao: 'Cloud bursting, alta disponibilidade, redução de CapEx.' },

  { disciplina: 'teoria-sistemas', numero: 1, titulo: 'Conceitos fundamentais', is_primeiro: true,
    descricao: 'Sistemas, subsistemas, entradas, processamento e saídas.' },
  { disciplina: 'teoria-sistemas', numero: 2, titulo: 'Sistemas abertos e fechados',
    descricao: 'Características, exemplos e fronteiras com o ambiente.' },
  { disciplina: 'teoria-sistemas', numero: 3, titulo: 'Integração de sistemas',
    descricao: 'EAI, ESB, APIs, webservices e middleware.' },

  { disciplina: 'camadas-aplicacao', numero: 1, titulo: 'Frontend', is_primeiro: true,
    descricao: 'HTML, CSS, JS, frameworks (React, Angular, Vue).' },
  { disciplina: 'camadas-aplicacao', numero: 2, titulo: 'Backend',
    descricao: 'Servidores, lógica de negócio, APIs e linguagens server-side.' },
  { disciplina: 'camadas-aplicacao', numero: 3, titulo: 'Processos',
    descricao: 'Comunicação interprocessos, threads, escalonamento.' },
  { disciplina: 'camadas-aplicacao', numero: 4, titulo: 'Aplicações distribuídas',
    descricao: 'Cliente-servidor, P2P, microserviços, RPC.' },

  { disciplina: 'sistemas-informacao', numero: 1, titulo: 'Ciclo de vida de sistemas', is_primeiro: true,
    descricao: 'Concepção, análise, projeto, implementação, manutenção.' },
  { disciplina: 'sistemas-informacao', numero: 2, titulo: 'Levantamento de requisitos e análise',
    descricao: 'Funcionais e não funcionais, técnicas de elicitação.' },
  { disciplina: 'sistemas-informacao', numero: 3, titulo: 'Especificação e desenvolvimento',
    descricao: 'Modelos UML, casos de uso, métricas de software.' },
  { disciplina: 'sistemas-informacao', numero: 4, titulo: 'Testes, homologação, produção e suporte',
    descricao: 'Tipos de teste (unitário, integração, sistema, aceitação) e operações.' },

  { disciplina: 'teoria-informacao', numero: 1, titulo: 'Dados, Informação, Conhecimento', is_primeiro: true,
    descricao: 'Pirâmide DIKW: dados → informação → conhecimento → sabedoria.' },
  { disciplina: 'teoria-informacao', numero: 2, titulo: 'Representação de dados',
    descricao: 'Sistemas numéricos (bin, oct, hex), ASCII, UTF-8, codificação.' },
  { disciplina: 'teoria-informacao', numero: 3, titulo: 'Segurança da informação',
    descricao: 'Criptografia, hash, controle de acesso e LGPD.' },
  { disciplina: 'teoria-informacao', numero: 4, titulo: 'Inteligência da informação',
    descricao: 'BI, data mining, analytics, dashboards e KPIs.' },

  { disciplina: 'banco-de-dados', numero: 1, titulo: 'Conceitos básicos de banco de dados', is_primeiro: true,
    descricao: 'SGBD, esquemas, instâncias e independência de dados.' },
  { disciplina: 'banco-de-dados', numero: 2, titulo: 'Base de dados',
    descricao: 'Tipos, normalização e persistência.' },
  { disciplina: 'banco-de-dados', numero: 3, titulo: 'Documentação',
    descricao: 'Dicionário de dados, metadados e diagramas.' },
  { disciplina: 'banco-de-dados', numero: 4, titulo: 'Prototipação',
    descricao: 'Modelos preliminares, MVP e iteração de design.' },
  { disciplina: 'banco-de-dados', numero: 5, titulo: 'Modelagem conceitual',
    descricao: 'Entidades, atributos, relacionamentos, cardinalidade.' },
  { disciplina: 'banco-de-dados', numero: 6, titulo: 'Modelo Entidade-Relacionamento (MER)',
    descricao: 'Diagrama ER, generalização, especialização, agregação.' },
  { disciplina: 'banco-de-dados', numero: 7, titulo: 'Administração de dados',
    descricao: 'DBA, governança, backup, performance.' },
  { disciplina: 'banco-de-dados', numero: 8, titulo: 'Dados estruturados e não estruturados',
    descricao: 'Tabelas, JSON, XML, blobs e semiestruturados.' },
  { disciplina: 'banco-de-dados', numero: 9, titulo: 'Bancos relacionais',
    descricao: 'Modelo de Codd, álgebra relacional e SGBDRs.' },
  { disciplina: 'banco-de-dados', numero: 10, titulo: 'Chaves primária e estrangeira',
    descricao: 'PK, FK, integridade referencial e unique constraints.' },
  { disciplina: 'banco-de-dados', numero: 11, titulo: 'Relacionamentos',
    descricao: 'Cardinalidade 1:1, 1:N, N:N e como modelar cada caso.' },

  { disciplina: 'extras-esfcex', numero: 1, titulo: 'Noções de virtualização e containers', is_primeiro: true,
    descricao: 'VMs, hypervisors (Tipo 1/2), Docker, Kubernetes.' },
  { disciplina: 'extras-esfcex', numero: 2, titulo: 'Versionamento com Git (conceito)',
    descricao: 'Commits, branches, merge, rebase, GitHub/GitLab.' },
  { disciplina: 'extras-esfcex', numero: 3, titulo: 'LGPD — Lei Geral de Proteção de Dados',
    descricao: 'Lei 13.709/2018, princípios, ANPD, bases legais e direitos do titular.' },
  { disciplina: 'extras-esfcex', numero: 4, titulo: 'Criptografia: Hash, Simétrica e Assimétrica',
    descricao: 'AES, RSA, SHA-256, MD5, TLS, PKI e assinatura digital.' },
  { disciplina: 'extras-esfcex', numero: 5, titulo: 'Logs e auditoria de sistemas',
    descricao: 'Coleta, retenção, SIEM, syslog e correlação de eventos.' },
  { disciplina: 'extras-esfcex', numero: 6, titulo: 'Conceitos iniciais de forense digital',
    descricao: 'Cadeia de custódia, hash de evidências, análise pós-incidente.' },
];

// ─── Imports parciais (para manter cada bloco em arquivo enxuto) ─────────────
import { ESFCEX_PORTUGUES } from './seed-questions-esfcex-portugues';
import { ESFCEX_HISTORIA_GEOGRAFIA } from './seed-questions-esfcex-historia-geografia';
import { ESFCEX_INFO_FUND } from './seed-questions-esfcex-info1a';
import { ESFCEX_INFO_REDES } from './seed-questions-esfcex-info1b';
import { ESFCEX_INFO_PARTE2 } from './seed-questions-esfcex-info2';

export const ESFCEX_QUESTIONS: SeedQuestion[] = [
  ...ESFCEX_PORTUGUES,
  ...ESFCEX_HISTORIA_GEOGRAFIA,
  ...ESFCEX_INFO_FUND,
  ...ESFCEX_INFO_REDES,
  ...ESFCEX_INFO_PARTE2,
];
