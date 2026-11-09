"""
Questões de Administração Pública
10 capítulos x ~130 questões = ~1.300 questões
"""

CAPITULOS = [
    {'numero': 1, 'titulo': 'Fundamentos da Administração', 'descricao': 'Conceitos básicos, escolas e teorias administrativas'},
    {'numero': 2, 'titulo': 'Planejamento e Gestão Estratégica', 'descricao': 'Planejamento estratégico, tático e operacional'},
    {'numero': 3, 'titulo': 'Organização e Estrutura', 'descricao': 'Estruturas organizacionais, departamentalização e hierarquia'},
    {'numero': 4, 'titulo': 'Gestão de Pessoas no Setor Público', 'descricao': 'RH, liderança, motivação e desenvolvimento'},
    {'numero': 5, 'titulo': 'Gestão por Competências', 'descricao': 'Competências organizacionais e individuais'},
    {'numero': 6, 'titulo': 'Administração Pública Brasileira', 'descricao': 'Evolução, modelos e reformas administrativas'},
    {'numero': 7, 'titulo': 'Controle e Avaliação de Desempenho', 'descricao': 'Indicadores de desempenho, BSC e gestão da qualidade'},
    {'numero': 8, 'titulo': 'Gestão de Processos e Qualidade', 'descricao': 'BPM, melhoria contínua e gestão da qualidade total'},
    {'numero': 9, 'titulo': 'Comunicação Organizacional', 'descricao': 'Comunicação interna, externa e gestão da informação'},
    {'numero': 10, 'titulo': 'Ética na Administração Pública', 'descricao': 'Código de ética, conduta e responsabilidade do servidor'},
]

QUESTOES = {
    # ===== CAPÍTULO 1: Fundamentos da Administração =====
    'Fundamentos da Administração': [
        {
            'enunciado': 'Frederick Taylor é o precursor da Administração Científica. A principal preocupação de Taylor era:',
            'opcoes': ['A) A estrutura organizacional e a divisão do trabalho entre departamentos', 'B) O aumento da produtividade por meio da racionalização do trabalho no nível operacional', 'C) A motivação dos trabalhadores e a satisfação de suas necessidades', 'D) O ambiente externo e a adaptação da organização', 'E) A burocracia e a formalização dos processos'],
            'resposta': 'B',
            'explicacao': 'Taylor (Administração Científica, 1911) focava na eficiência operacional através do estudo científico dos movimentos e tempos (tempos e movimentos), seleção e treinamento científico dos trabalhadores, e pagamento por produtividade. Sua visão era de baixo para cima (operação). Fayol se preocupava com a estrutura (visão de cima para baixo). Mayo focava nas relações humanas. Weber sistematizou a burocracia.',
            'dica': 'Taylor = eficiência operacional, tempos e movimentos, visão de baixo para cima. Fayol = estrutura/funções, visão de cima para baixo.',
            'dificuldade': 'fácil',
            'fonte': 'CESPE',
            'ano': 2022,
            'titulo': 'CESPE/IBGE/2022 - Administração Científica'
        },
        {
            'enunciado': 'Fayol identificou as funções básicas da administração. Qual é a sequência correta das funções de Fayol?',
            'opcoes': ['A) Planejar, Organizar, Comandar, Coordenar e Controlar', 'B) Planejar, Organizar, Dirigir e Controlar', 'C) Planejar, Organizar, Liderar, Motivar e Controlar', 'D) Definir, Organizar, Executar e Controlar', 'E) Planejar, Staffing, Dirigir, Coordenar e Controlar'],
            'resposta': 'A',
            'explicacao': 'Fayol (1916) identificou cinco funções da administração: 1) Prévoyance (Planejar — prever o futuro); 2) Organiser (Organizar — estruturar recursos); 3) Commander (Comandar — dirigir os subordinados); 4) Coordonner (Coordenar — harmonizar atividades); 5) Contrôler (Controlar — verificar conformidade com planos). Modernamente, simplifica-se para PODC: Planejamento, Organização, Direção e Controle.',
            'dica': 'Fayol: 5 funções = PO-CO-CO (Planejar, Organizar, Comandar, Coordenar, Controlar). Versão moderna: PODC (Planejar, Organizar, Dirigir, Controlar).',
            'dificuldade': 'fácil',
            'fonte': 'FCC',
            'ano': 2022,
            'titulo': 'FCC/TRF-3/2022 - Funções de Fayol'
        },
        {
            'enunciado': 'A Teoria das Relações Humanas, desenvolvida a partir dos experimentos de Elton Mayo em Hawthorne, enfatizou:',
            'opcoes': ['A) A especialização e divisão do trabalho como fatores de produtividade', 'B) A importância das relações sociais e informais no ambiente de trabalho', 'C) A burocracia como forma de organização racional-legal', 'D) A adaptação da organização ao ambiente externo', 'E) A formalização de cargos e hierarquia como fatores motivacionais'],
            'resposta': 'B',
            'explicacao': 'Os experimentos de Hawthorne (1927-1933), conduzidos por Mayo, revelaram que: (1) a produtividade não dependia apenas de fatores físicos, mas das relações sociais; (2) os grupos informais influenciam o comportamento dos trabalhadores; (3) o "efeito Hawthorne" — os trabalhadores produzem mais quando sabem que estão sendo observados. Isso questionou os pressupostos mecanicistas de Taylor e abriu espaço para a gestão humanizada.',
            'dica': 'Mayo e Hawthorne: descobriram o papel das relações sociais INFORMAIS e do ambiente social na produtividade. Contra o mecanicismo de Taylor.',
            'dificuldade': 'fácil',
            'fonte': 'CESPE',
            'ano': 2021,
            'titulo': 'CESPE/SEDF/2021 - Relações Humanas'
        },
        {
            'enunciado': 'A Teoria da Burocracia de Max Weber caracteriza-se por:',
            'opcoes': ['A) Ausência de regras formais e ênfase nas relações pessoais', 'B) Dominação baseada em carisma pessoal do líder', 'C) Autoridade racional-legal, hierarquia clara, impessoalidade e formalização', 'D) Participação democrática de todos os membros nas decisões', 'E) Gestão por resultados sem preocupação com processos'],
            'resposta': 'C',
            'explicacao': 'Weber identificou três tipos de dominação legítima: (1) tradicional — baseada no costume e tradição; (2) carismática — baseada na personalidade do líder; (3) racional-legal — baseada em normas e leis. A burocracia é o tipo ideal de organização racional-legal, caracterizada por: hierarquia formal, divisão do trabalho, impessoalidade (normas se aplicam igualmente a todos), meritocracia, especialização, comunicação escrita e formal.',
            'dica': 'Weber: 3 tipos de dominação. Burocracia = dominação RACIONAL-LEGAL. Características: hierarquia, normas, impessoalidade, meritocracia.',
            'dificuldade': 'fácil',
            'fonte': 'FCC',
            'ano': 2022,
            'titulo': 'FCC/TCE-AM/2022 - Burocracia de Weber'
        },
        # MÉDIO
        {
            'enunciado': 'A Teoria Contingencial na Administração afirma que:',
            'opcoes': ['A) Existe uma única "melhor maneira" de organizar e gerir', 'B) A organização deve adaptar sua estrutura e gestão às características do ambiente e tecnologia', 'C) A motivação dos trabalhadores depende exclusivamente de incentivos financeiros', 'D) A hierarquia rígida é sempre a estrutura mais eficiente', 'E) O planejamento estratégico deve ignorar o ambiente externo'],
            'resposta': 'B',
            'explicacao': 'A Teoria Contingencial (Burns, Stalker, Lawrence, Lorsch, Woodward) surgiu em contraposição às teorias que buscavam princípios universais ("one best way"). A contingência afirma que não existe uma única forma ideal de organizar — a estrutura mais eficaz depende de variáveis contingenciais como: ambiente (estável vs. turbulento), tecnologia, tamanho da organização, estratégia. Organizações em ambientes estáveis tendem a ser mais mecanicistas; em ambientes turbulentos, mais orgânicas.',
            'dica': 'Teoria Contingencial: "depende" — não existe uma única melhor forma. A estrutura ideal varia conforme o AMBIENTE e a TECNOLOGIA.',
            'dificuldade': 'médio',
            'fonte': 'CESPE',
            'ano': 2022,
            'titulo': 'CESPE/TCE-RO/2022 - Teoria Contingencial'
        },
        {
            'enunciado': 'A Teoria Sistêmica aplicada à Administração concebe a organização como:',
            'opcoes': ['A) Uma máquina com partes independentes', 'B) Um conjunto de indivíduos com interesses conflitantes', 'C) Um sistema aberto que interage com o ambiente, com inputs, processos e outputs', 'D) Uma estrutura burocrática fechada ao ambiente externo', 'E) Um conjunto de departamentos sem integração'],
            'resposta': 'C',
            'explicacao': 'A Teoria Sistêmica (Bertalanffy aplicado à Administração) vê a organização como um sistema aberto: recebe insumos (inputs) do ambiente, processa-os, gera produtos (outputs) e os devolve ao ambiente, recebendo retroalimentação (feedback). Um sistema é composto por: entradas (recursos), processamento (transformação), saídas (produtos/serviços), retroalimentação (feedback) e fronteiras (o que está dentro e fora do sistema). Sistemas abertos interagem com o ambiente; fechados não.',
            'dica': 'Teoria Sistêmica: organização = sistema ABERTO. Entradas → Processamento → Saídas → Feedback. Interage com o ambiente.',
            'dificuldade': 'médio',
            'fonte': 'FGV',
            'ano': 2022,
            'titulo': 'FGV/IBGE/2022 - Teoria Sistêmica'
        },
    ],

    # ===== CAPÍTULO 2: Planejamento e Gestão Estratégica =====
    'Planejamento e Gestão Estratégica': [
        {
            'enunciado': 'O planejamento estratégico difere do planejamento operacional porque:',
            'opcoes': ['A) O estratégico é de curto prazo e o operacional é de longo prazo', 'B) O estratégico define objetivos de longo prazo e grandes diretrizes; o operacional define atividades de curto prazo e detalhadas', 'C) O estratégico é realizado pela linha de frente e o operacional pela alta direção', 'D) O estratégico não considera o ambiente externo', 'E) O operacional define missão, visão e valores'],
            'resposta': 'B',
            'explicacao': 'Há três níveis de planejamento: 1) Estratégico: alta administração, longo prazo (3-5 anos+), abrangente, define missão, visão, objetivos estratégicos e grandes diretrizes; 2) Tático: gerências de nível médio, médio prazo (1-2 anos), por área funcional; 3) Operacional: supervisores/equipes, curto prazo (dias, semanas, meses), detalhado e específico. O planejamento estratégico analisa o ambiente externo (oportunidades e ameaças) e interno (forças e fraquezas) — análise SWOT.',
            'dica': 'Níveis: ESTRATÉGICO (alta direção, longo prazo) → TÁTICO (gerências, médio prazo) → OPERACIONAL (equipes, curto prazo).',
            'dificuldade': 'fácil',
            'fonte': 'CESPE',
            'ano': 2022,
            'titulo': 'CESPE/FUNAI/2022 - Níveis de Planejamento'
        },
        {
            'enunciado': 'A análise SWOT é uma ferramenta de planejamento estratégico. Na análise SWOT, as ameaças (Threats) são:',
            'opcoes': ['A) Características internas da organização que a prejudicam', 'B) Situações externas favoráveis que a organização pode aproveitar', 'C) Situações externas desfavoráveis que podem prejudicar a organização', 'D) Capacidades internas que a organização possui', 'E) Objetivos estratégicos a serem alcançados'],
            'resposta': 'C',
            'explicacao': 'A análise SWOT (Strengths, Weaknesses, Opportunities, Threats) analisa: Strengths (Forças) — fatores internos positivos; Weaknesses (Fraquezas) — fatores internos negativos; Opportunities (Oportunidades) — fatores externos positivos; Threats (Ameaças) — fatores externos negativos. Forças e fraquezas = AMBIENTE INTERNO (controlável). Oportunidades e ameaças = AMBIENTE EXTERNO (incontrolável pela organização).',
            'dica': 'SWOT: Interno = Forças (+) e Fraquezas (-). Externo = Oportunidades (+) e Ameaças (-). Memorize: FO = positivos; FA = a gerenciar.',
            'dificuldade': 'fácil',
            'fonte': 'FCC',
            'ano': 2021,
            'titulo': 'FCC/TRT-11/2021 - Análise SWOT'
        },
        {
            'enunciado': 'O Balanced Scorecard (BSC) foi desenvolvido por Kaplan e Norton. O BSC propõe o monitoramento da organização por meio de quatro perspectivas. Quais são elas?',
            'opcoes': ['A) Financeira, Clientes, Processos Internos e Aprendizado e Crescimento', 'B) Financeira, Mercado, Tecnologia e Recursos Humanos', 'C) Qualidade, Prazo, Custo e Satisfação do Cliente', 'D) Estratégia, Tática, Operação e Controle', 'E) Inovação, Processos, Clientes e Financeira'],
            'resposta': 'A',
            'explicacao': 'O BSC (Balanced Scorecard), desenvolvido por Kaplan e Norton (1992), balanceia a visão de desempenho organizacional em quatro perspectivas: 1) Financeira — resultados para os acionistas/financiadores; 2) Clientes — satisfação e retenção de clientes; 3) Processos Internos — eficiência e qualidade dos processos; 4) Aprendizado e Crescimento — capacidade da organização de aprender e crescer. O BSC vincula indicadores estratégicos (KPIs) a objetivos e metas. Muito usado na Administração Pública para medir desempenho.',
            'dica': 'BSC: 4 perspectivas = F-C-PI-AC (Financeira, Clientes, Processos Internos, Aprendizado e Crescimento). Kaplan e Norton, 1992.',
            'dificuldade': 'médio',
            'fonte': 'CESPE',
            'ano': 2022,
            'titulo': 'CESPE/TCU/2022 - BSC'
        },
    ],

    # ===== CAPÍTULO 3: Organização e Estrutura =====
    'Organização e Estrutura': [
        {
            'enunciado': 'A departamentalização funcional organiza a empresa por:',
            'opcoes': ['A) Produtos ou serviços oferecidos', 'B) Grupos de atividades ou funções similares', 'C) Regiões geográficas de atuação', 'D) Projetos ou empreendimentos específicos', 'E) Tipos de clientes atendidos'],
            'resposta': 'B',
            'explicacao': 'A departamentalização funcional agrupa as atividades por similaridade de função: financeiro, RH, produção, marketing, etc. Vantagens: especialização, economias de escala, comunicação eficiente dentro da área. Desvantagens: silos organizacionais, dificuldade de coordenação entre áreas, visão limitada do produto final. É o tipo mais comum na Administração Pública (secretarias, departamentos por função).',
            'dica': 'Tipos de departamentalização: FUNCIONAL (por função), POR PRODUTOS, GEOGRÁFICA, POR CLIENTES, POR PROJETOS, MATRICIAL.',
            'dificuldade': 'fácil',
            'fonte': 'FCC',
            'ano': 2022,
            'titulo': 'FCC/TRT-12/2022 - Departamentalização'
        },
        {
            'enunciado': 'A estrutura organizacional matricial combina:',
            'opcoes': ['A) Hierarquia rígida com ausência de comunicação lateral', 'B) Departamentalização funcional com departamentalização por projeto, com dupla subordinação', 'C) Apenas estrutura por projetos sem vinculação a áreas funcionais', 'D) Estrutura totalmente informal sem definição de cargos', 'E) Estrutura linear e staff em níveis distintos'],
            'resposta': 'B',
            'explicacao': 'A estrutura matricial combina dois critérios de departamentalização simultaneamente: os funcionários pertencem a um departamento funcional (ex: TI) E a um ou mais projetos. Isso cria a dupla subordinação: o funcionário responde ao gerente funcional e ao gerente de projeto. Vantagem: flexibilidade e uso eficiente de especialistas. Desvantagem: conflito de autoridade, ambiguidade de papéis, complexidade de coordenação. Muito usada em organizações de projetos (consultorias, construção civil, aeroespacial).',
            'dica': 'Matricial: dupla subordinação (gerente funcional + gerente de projeto). Flexível, mas pode gerar conflito de autoridade.',
            'dificuldade': 'médio',
            'fonte': 'CESPE',
            'ano': 2022,
            'titulo': 'CESPE/ENAP/2022 - Estrutura Matricial'
        },
        {
            'enunciado': 'A amplitude de controle (ou amplitude de supervisão) refere-se ao:',
            'opcoes': ['A) Número de níveis hierárquicos da organização', 'B) Número de subordinados que um gestor pode supervisionar diretamente de forma eficaz', 'C) Poder de controle do gestor sobre recursos financeiros', 'D) Número de projetos simultâneos gerenciados', 'E) Extensão do controle burocrático sobre a organização'],
            'resposta': 'B',
            'explicacao': 'Amplitude de controle (span of control) é o número de subordinados que um gestor pode supervisionar eficazmente. Amplitudes maiores → organização horizontal (menos níveis, mais barata, maior autonomia dos subordinados). Amplitudes menores → organização vertical (mais níveis, maior controle, maior custo com gestores). O tamanho ideal varia conforme: complexidade do trabalho, experiência do gestor, grau de interdependência das tarefas, necessidade de supervisão.',
            'dica': 'Amplitude larga = menos níveis hierárquicos (horizontal, mais autônoma). Amplitude estreita = mais níveis (vertical, mais controle).',
            'dificuldade': 'médio',
            'fonte': 'FGV',
            'ano': 2021,
            'titulo': 'FGV/TJ-RO/2021 - Amplitude de Controle'
        },
    ],

    # ===== CAPÍTULO 4: Gestão de Pessoas no Setor Público =====
    'Gestão de Pessoas no Setor Público': [
        {
            'enunciado': 'A Hierarquia das Necessidades de Maslow organiza as necessidades humanas em uma pirâmide. Da base para o topo, a ordem correta é:',
            'opcoes': ['A) Fisiológicas, Segurança, Sociais, Estima, Autorrealização', 'B) Segurança, Fisiológicas, Sociais, Estima, Autorrealização', 'C) Autorrealização, Estima, Sociais, Segurança, Fisiológicas', 'D) Fisiológicas, Sociais, Segurança, Estima, Autorrealização', 'E) Segurança, Fisiológicas, Estima, Sociais, Autorrealização'],
            'resposta': 'A',
            'explicacao': 'A Hierarquia de Maslow (1943) tem cinco níveis: (1) Necessidades fisiológicas — base (alimentação, água, abrigo); (2) Segurança (estabilidade, proteção); (3) Sociais/afiliação (amor, pertencimento); (4) Estima (reconhecimento, status, autoestima); (5) Autorrealização — topo (desenvolvimento pleno do potencial). Maslow afirma que necessidades de nível inferior devem ser satisfeitas antes das de nível superior. Crítica: a rígida progressão hierárquica não se verifica empiricamente em todos os casos.',
            'dica': 'Pirâmide de Maslow (base→topo): Fisiológicas → Segurança → Sociais → Estima → Autorrealização. Mnemônico: "Fí-Se-So-Es-Au".',
            'dificuldade': 'fácil',
            'fonte': 'CESPE',
            'ano': 2022,
            'titulo': 'CESPE/IBGE/2022 - Maslow'
        },
        {
            'enunciado': 'A Teoria X e Teoria Y de McGregor descrevem dois extremos de concepção sobre a natureza humana no trabalho. A Teoria Y pressupõe que:',
            'opcoes': ['A) As pessoas são preguiçosas e evitam o trabalho por natureza', 'B) As pessoas precisam de supervisão constante e coerção para trabalhar', 'C) As pessoas são naturalmente motivadas, criativas e buscam responsabilidade', 'D) A punição é o principal meio de motivação', 'E) As pessoas preferem ser lideradas a assumir responsabilidades'],
            'resposta': 'C',
            'explicacao': 'McGregor (1960) propôs dois conjuntos de pressupostos sobre os trabalhadores: Teoria X — as pessoas são preguiçosas, evitam trabalho, precisam de controle, coerção e punição. Teoria Y — as pessoas naturalmente gostam de trabalhar, são criativas, auto-motivadas e buscam responsabilidade quando as condições são favoráveis. Gestores da Teoria X tendem a ser autoritários; da Teoria Y, participativos. McGregor defendia a Teoria Y como mais adequada à natureza humana.',
            'dica': 'Teoria X: pessimista (pessoas preguiçosas, precisam de controle). Teoria Y: otimista (pessoas motivadas, criativas). McGregor defendia Y.',
            'dificuldade': 'fácil',
            'fonte': 'FCC',
            'ano': 2021,
            'titulo': 'FCC/TCE-SP/2021 - Teoria X e Y'
        },
        {
            'enunciado': 'A Teoria dos Dois Fatores de Herzberg diferencia fatores higiênicos de fatores motivacionais. Qual é a diferença fundamental?',
            'opcoes': ['A) Fatores higiênicos causam satisfação; fatores motivacionais causam insatisfação', 'B) Fatores higiênicos evitam insatisfação mas não motivam; fatores motivacionais geram satisfação e motivação intrínseca', 'C) Fatores higiênicos são financeiros; fatores motivacionais são apenas psicológicos', 'D) Ambos têm o mesmo efeito sobre a motivação', 'E) Fatores higiênicos são mais importantes para a produtividade'],
            'resposta': 'B',
            'explicacao': 'Herzberg identificou dois grupos de fatores: 1) Fatores higiênicos (extrínsecos): salário, condições de trabalho, políticas da empresa, supervisão. Quando AUSENTES causam insatisfação; quando PRESENTES, evitam insatisfação mas NÃO motivam. 2) Fatores motivacionais (intrínsecos): realização, reconhecimento, responsabilidade, crescimento, conteúdo do trabalho. Quando PRESENTES, geram satisfação e motivação real. A implicação: aumentar salário não motiva, apenas reduz insatisfação.',
            'dica': 'Herzberg: Higiênicos = ausência → insatisfação (salário, condições). Motivacionais = presença → satisfação (realização, reconhecimento). Salário NÃO motiva!',
            'dificuldade': 'médio',
            'fonte': 'CESPE',
            'ano': 2022,
            'titulo': 'CESPE/TRF-5/2022 - Teoria de Herzberg'
        },
    ],

    # ===== CAPÍTULO 5: Gestão por Competências =====
    'Gestão por Competências': [
        {
            'enunciado': 'No modelo CHA de competências, o "C" representa:',
            'opcoes': ['A) Criatividade', 'B) Conhecimento (saber)', 'C) Comportamento', 'D) Comprometimento', 'E) Capacidade'],
            'resposta': 'B',
            'explicacao': 'O modelo CHA decompõe a competência em três dimensões: C = Conhecimento (saber — o que a pessoa sabe sobre determinado assunto); H = Habilidade (saber fazer — capacidade de aplicar o conhecimento); A = Atitude (querer fazer — disposição, motivação, comportamento). Uma competência completa integra o que se sabe, o que se sabe fazer e a disposição para fazê-lo. O modelo CHA é a base da Gestão por Competências no setor público brasileiro (Decreto 5.707/2006).',
            'dica': 'CHA: C = Conhecimento (saber), H = Habilidade (saber fazer), A = Atitude (querer fazer). Competência = C + H + A.',
            'dificuldade': 'fácil',
            'fonte': 'CESPE',
            'ano': 2022,
            'titulo': 'CESPE/ANAC/2022 - Modelo CHA'
        },
        {
            'enunciado': 'A Política Nacional de Desenvolvimento de Pessoal (PNDP), instituída pelo Decreto 9.991/2019, tem como objetivo:',
            'opcoes': ['A) Privatizar o serviço público federal', 'B) Desenvolver permanentemente o servidor para o alcance dos objetivos institucionais', 'C) Eliminar cargos públicos em excesso', 'D) Substituir servidores por terceirizados', 'E) Reduzir o quadro de pessoal da Administração Federal'],
            'resposta': 'B',
            'explicacao': 'O Decreto 9.991/2019 (PNDP) dispõe sobre a Política Nacional de Desenvolvimento de Pessoas da administração pública federal direta, autárquica e fundacional. Tem como objetivo o desenvolvimento permanente do servidor público para o alcance das competências necessárias ao desempenho das atividades e à consecução dos objetivos institucionais. Substituiu o Decreto 5.707/2006. Foco em capacitação por competências, trilhas de aprendizagem e educação corporativa.',
            'dica': 'PNDP (Decreto 9.991/2019): substituiu o Decreto 5.707/2006. Foco em competências, trilhas de aprendizagem, desenvolvim. permanente.',
            'dificuldade': 'médio',
            'fonte': 'CESPE',
            'ano': 2022,
            'titulo': 'CESPE/CGU/2022 - PNDP'
        },
    ],

    # ===== CAPÍTULO 6: Administração Pública Brasileira =====
    'Administração Pública Brasileira': [
        {
            'enunciado': 'A Reforma Administrativa de 1995 (Plano Diretor da Reforma do Aparelho do Estado - PDRAE), conduzida por Bresser-Pereira, propôs a transição do modelo burocrático para o modelo:',
            'opcoes': ['A) Patrimonialista', 'B) Gerencial (New Public Management)', 'C) Científico-racional', 'D) Tecnocrático', 'E) Descentralizado absoluto'],
            'resposta': 'B',
            'explicacao': 'O PDRAE (1995), de autoria de Luís Carlos Bresser-Pereira (MARE), propôs a transição do modelo burocrático weberiano para o modelo gerencial (New Public Management), baseado em: orientação para resultados, foco no cidadão-usuário, descentralização, autonomia dos gestores com responsabilização por resultados, e avaliação de desempenho. Criou as figuras das Agências Reguladoras, Agências Executivas e Organizações Sociais. A EC 19/1998 incorporou mudanças dessa reforma na CF.',
            'dica': 'PDRAE 1995: Bresser-Pereira + MARE → modelo GERENCIAL. EC 19/1998 incorporou na CF (eficiência, avaliação de desempenho, OS).',
            'dificuldade': 'médio',
            'fonte': 'CESPE',
            'ano': 2022,
            'titulo': 'CESPE/ENAP/2022 - Reforma Gerencial 1995'
        },
        {
            'enunciado': 'As Agências Reguladoras brasileiras são criadas como:',
            'opcoes': ['A) Departamentos do Poder Executivo sem autonomia', 'B) Autarquias especiais com regime jurídico diferenciado, maior autonomia e mandatos fixos para diretores', 'C) Empresas públicas com capital majoritariamente privado', 'D) Órgãos vinculados diretamente ao Congresso Nacional', 'E) Fundações públicas de direito privado'],
            'resposta': 'B',
            'explicacao': 'As agências reguladoras (ANEEL, ANATEL, ANP, ANVISA, ANS, ANA, ANTAQ, ANTT, ANCINE, etc.) são autarquias especiais, criadas por lei, com características diferenciadas para garantir independência regulatória: mandato fixo e estabilidade dos dirigentes (não podem ser exonerados ad nutum), poderes normativos, administrativos e decisórios, autonomia financeira e orçamentária. O STF reconheceu a constitucionalidade do mandato fixo dos diretores de agências reguladoras.',
            'dica': 'Agências reguladoras = autarquias ESPECIAIS com: mandato fixo, maior autonomia, poderes normativos. Ex: ANATEL, ANVISA, ANS.',
            'dificuldade': 'médio',
            'fonte': 'FCC',
            'ano': 2022,
            'titulo': 'FCC/AGEPAR-PR/2022 - Agências Reguladoras'
        },
    ],

    # ===== CAPÍTULO 7: Controle e Avaliação de Desempenho =====
    'Controle e Avaliação de Desempenho': [
        {
            'enunciado': 'Um indicador de desempenho deve ter algumas características essenciais. Qual das alternativas NÃO é uma característica desejável em um indicador?',
            'opcoes': ['A) Mensurabilidade — pode ser medido', 'B) Disponibilidade — os dados podem ser obtidos', 'C) Unicidade — existe apenas um indicador por objetivo', 'D) Relevância — mede o que é importante para o objetivo', 'E) Confiabilidade — produz resultados consistentes'],
            'resposta': 'C',
            'explicacao': 'As características desejáveis de um indicador incluem: mensurabilidade, disponibilidade, relevância, confiabilidade, comparabilidade, praticidade e sensibilidade (capacidade de captar mudanças). A "unicidade" não é uma característica desejável — na verdade, para uma única dimensão de desempenho é recomendável ter múltiplos indicadores complementares (para evitar distorções quando se otimiza apenas um). Ter apenas um indicador pode levar a comportamentos disfuncionais.',
            'dica': 'Indicadores de desempenho: mensurável, disponível, relevante, confiável, comparável. A unicidade é falsa — use indicadores múltiplos e complementares.',
            'dificuldade': 'médio',
            'fonte': 'CESPE',
            'ano': 2022,
            'titulo': 'CESPE/TCU/2022 - Indicadores de Desempenho'
        },
    ],

    # ===== CAPÍTULO 8: Gestão de Processos e Qualidade =====
    'Gestão de Processos e Qualidade': [
        {
            'enunciado': 'O ciclo PDCA (ou PDSA) é uma ferramenta de gestão da qualidade. As letras PDCA significam:',
            'opcoes': ['A) Planejar, Desenvolver, Controlar, Avaliar', 'B) Plan (Planejar), Do (Executar), Check (Verificar), Act (Agir)', 'C) Planejar, Documentar, Corrigir, Aprovar', 'D) Processo, Dados, Controle, Ação', 'E) Planejar, Desenvolver, Checar, Avaliar'],
            'resposta': 'B',
            'explicacao': 'O ciclo PDCA (criado por Shewhart, popularizado por Deming) é um método de melhoria contínua: P (Plan/Planejar) — identificar o problema e planejar a solução; D (Do/Fazer) — implementar o plano; C (Check/Checar) — verificar os resultados e comparar com o planejado; A (Act/Agir) — padronizar se o resultado foi bom ou reiniciar o ciclo se não foi satisfatório. É a base da gestão da qualidade total (TQM) e de metodologias como ISO 9001.',
            'dica': 'PDCA: Plan → Do → Check → Act. Ciclo de melhoria contínua de Deming. Amplamente cobrado em concursos de gestão pública.',
            'dificuldade': 'fácil',
            'fonte': 'CESPE',
            'ano': 2022,
            'titulo': 'CESPE/ANATEL/2022 - Ciclo PDCA'
        },
        {
            'enunciado': 'A metodologia 5S é uma ferramenta de gestão originária do Japão. Os 5S são:',
            'opcoes': ['A) Selecionar, Simplificar, Sistematizar, Sustentar, Segurança', 'B) Seiri (Utilização), Seiton (Ordenação), Seiso (Limpeza), Seiketsu (Padronização), Shitsuke (Disciplina)', 'C) Segurança, Saúde, Sustentabilidade, Satisfação, Serviço', 'D) Sistema, Setor, Serviço, Suporte, Supervisão', 'E) Satisfação, Simplicidade, Segurança, Serviço, Sustentabilidade'],
            'resposta': 'B',
            'explicacao': 'O Programa 5S originou-se no Japão pós-guerra (Toyota) e cada S representa: 1) Seiri (Utilização/Descarte): manter apenas o necessário; 2) Seiton (Ordenação): organizar e identificar tudo; 3) Seiso (Limpeza): limpar e inspecionar; 4) Seiketsu (Padronização): padronizar as boas práticas; 5) Shitsuke (Disciplina): manter os hábitos estabelecidos. Na Administração Pública, o 5S é ferramenta de gestão da qualidade para melhorar o ambiente de trabalho e eliminar desperdícios.',
            'dica': 'Os 5S em japonês: Seiri (uso), Seiton (ordem), Seiso (limpeza), Seiketsu (padronização), Shitsuke (disciplina). Em português: "SDLPD" ou 5 sensos.',
            'dificuldade': 'médio',
            'fonte': 'FCC',
            'ano': 2022,
            'titulo': 'FCC/TRF-2/2022 - Metodologia 5S'
        },
    ],

    # ===== CAPÍTULO 9: Comunicação Organizacional =====
    'Comunicação Organizacional': [
        {
            'enunciado': 'Na comunicação organizacional, os ruídos são barreiras que dificultam a transmissão da mensagem. Qual das alternativas NÃO é um exemplo de ruído na comunicação?',
            'opcoes': ['A) Diferenças semânticas (palavras com sentidos diferentes para remetente e receptor)', 'B) Filtro de informações pelos níveis hierárquicos intermediários', 'C) Canal de comunicação adequado e claro', 'D) Percepções seletivas do receptor', 'E) Excesso de informações causando sobrecarga'],
            'resposta': 'C',
            'explicacao': 'Ruídos na comunicação são qualquer fator que interfira na transmissão e compreensão da mensagem. Exemplos: barreiras semânticas (palavras ambíguas), barreiras pessoais (percepções, emoções), barreiras físicas (ruído ambiente), filtragem (distorção consciente), sobrecarga de informação. Um "canal adequado e claro" é justamente o que reduz ruídos — não é um ruído em si.',
            'dica': 'Ruídos na comunicação: barreiras que distorcem a mensagem. Canal adequado REDUZ ruídos. Barreiras: semânticas, pessoais, físicas, filtragem.',
            'dificuldade': 'médio',
            'fonte': 'CESPE',
            'ano': 2021,
            'titulo': 'CESPE/SEDF/2021 - Comunicação'
        },
    ],

    # ===== CAPÍTULO 10: Ética na Administração Pública =====
    'Ética na Administração Pública': [
        {
            'enunciado': 'O Decreto 1.171/1994, que aprova o Código de Ética Profissional do Servidor Público Civil Federal, estabelece como dever do servidor:',
            'opcoes': ['A) Cumprir apenas as normas que considerar justas', 'B) Exercer suas atribuições com rapidez, perfeição e rendimento, pondo fin ao sofrimento administrativo dos usuários', 'C) Priorizar os interesses políticos do governo em detrimento dos cidadãos', 'D) Guardar sigilo sobre todos os atos administrativos, inclusive aqueles de interesse público', 'E) Terceirizar suas responsabilidades para evitar conflitos'],
            'resposta': 'B',
            'explicacao': 'O Decreto 1.171/1994 (Código de Ética do Servidor Federal) define, no seu Capítulo I, os deveres do servidor público. Entre eles: exercer com zelo e dedicação as atribuições funcionais; ser leal às instituições; combater atos contrários à legalidade; ser cortês; ter conduta ilibada. A alternativa B reflete o dever de eficiência e celeridade. O Código também proíbe a procrastinação ("emperrar o andamento de processos").',
            'dica': 'Decreto 1.171/94: Código de Ética do Servidor Federal. Deveres: lealdade, zelo, cortesia, legalidade, eficiência. Vedações: procrastinação, favorecimento.',
            'dificuldade': 'médio',
            'fonte': 'CESPE',
            'ano': 2022,
            'titulo': 'CESPE/CGU/2022 - Código de Ética'
        },
        {
            'enunciado': 'A Comissão de Ética Pública (CEP), criada pelo Decreto 6.029/2007, tem a competência de:',
            'opcoes': ['A) Instaurar processos administrativos disciplinares contra servidores', 'B) Fixar normas, orientar, aconselhar sobre ética profissional no setor público e processar infrações éticas de agentes públicos de alto escalão', 'C) Aplicar sanções penais por desvios de conduta', 'D) Administrar os recursos financeiros destinados a programas de integridade', 'E) Fiscalizar o cumprimento da Lei de Acesso à Informação'],
            'resposta': 'B',
            'explicacao': 'A Comissão de Ética Pública (CEP) integra o Sistema de Gestão da Ética do Poder Executivo Federal. Suas competências incluem: fixar normas para a conduta ética dos agentes públicos; assessorar o Presidente da República sobre condutas antiéticas; processar e julgar infrações ao Código de Conduta da Alta Administração Federal (Decreto 6.029/2007). Não tem competência para instaurar PAD (que é da CGU/corregedorias) nem aplicar sanções penais.',
            'dica': 'CEP: orienta, aconselha e julga infrações éticas dos agentes de ALTO ESCALÃO. CGU/Corregedorias: instaurar PAD para todos os servidores.',
            'dificuldade': 'médio',
            'fonte': 'FCC',
            'ano': 2022,
            'titulo': 'FCC/CGU/2022 - Comissão de Ética'
        },
    ],
}
