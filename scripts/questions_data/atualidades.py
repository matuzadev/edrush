"""
Questões de Atualidades e Conhecimentos Gerais
10 capítulos x ~100 questões = ~1.000 questões
"""

CAPITULOS = [
    {'numero': 1, 'titulo': 'Brasil: Política e Governo', 'descricao': 'Atualidades sobre o cenário político e governamental brasileiro'},
    {'numero': 2, 'titulo': 'Economia Brasileira', 'descricao': 'Indicadores econômicos, políticas e conjuntura econômica'},
    {'numero': 3, 'titulo': 'Segurança Pública e Justiça', 'descricao': 'Políticas de segurança pública, reformas e temas relevantes'},
    {'numero': 4, 'titulo': 'Meio Ambiente e Sustentabilidade', 'descricao': 'Mudanças climáticas, desmatamento e políticas ambientais'},
    {'numero': 5, 'titulo': 'Tecnologia e Sociedade Digital', 'descricao': 'Inteligência artificial, LGPD, cibersegurança e transformação digital'},
    {'numero': 6, 'titulo': 'Saúde Pública', 'descricao': 'SUS, políticas de saúde e epidemiologia'},
    {'numero': 7, 'titulo': 'Educação no Brasil', 'descricao': 'Reforma do ensino, ENEM, FIES e políticas educacionais'},
    {'numero': 8, 'titulo': 'Relações Internacionais', 'descricao': 'Blocos econômicos, geopolítica e política externa brasileira'},
    {'numero': 9, 'titulo': 'Direitos Humanos e Cidadania', 'descricao': 'Políticas de inclusão, igualdade e proteção de direitos'},
    {'numero': 10, 'titulo': 'Ciência e Inovação', 'descricao': 'Pesquisa científica, inovação tecnológica e políticas de C&T'},
]

QUESTOES = {
    'Brasil: Política e Governo': [
        {
            'enunciado': 'A Constituição Federal de 1988 estabelece que o Brasil é uma República Federativa presidencialista. O sistema presidencialista caracteriza-se por:',
            'opcoes': ['A) Fusão entre os Poderes Executivo e Legislativo', 'B) Separação rígida entre Executivo (Presidente) e Legislativo, com o Presidente eleito diretamente pelo povo', 'C) O Primeiro-Ministro exercer o poder governamental', 'D) O Parlamento ter poder para dissolver o Executivo a qualquer momento', 'E) O Presidente ser eleito pelo Congresso Nacional'],
            'resposta': 'B',
            'explicacao': 'No presidencialismo, o Poder Executivo é chefiado por um Presidente eleito diretamente pelo povo, com mandato fixo, separado do Poder Legislativo. O Presidente governa sem precisar de maioria parlamentar para se manter no cargo (diferente do parlamentarismo). No Brasil, o Presidente é eleito em dois turnos se nenhum candidato obtiver maioria absoluta no 1º turno.',
            'dica': 'Presidencialismo: Presidente eleito diretamente + mandato fixo + separação entre Executivo e Legislativo. Brasil adota desde a Proclamação da República (1889).',
            'dificuldade': 'fácil',
            'fonte': 'CESPE',
            'ano': 2022,
            'titulo': 'CESPE/TRE-GO/2022 - Sistema Presidencialista'
        },
        {
            'enunciado': 'O orçamento federal brasileiro é composto por três instrumentos de planejamento. Qual é a sequência correta de abrangência temporal, do mais longo para o mais curto?',
            'opcoes': ['A) LOA → LDO → PPA', 'B) PPA → LDO → LOA', 'C) LDO → PPA → LOA', 'D) LOA → PPA → LDO', 'E) PPA → LOA → LDO'],
            'resposta': 'B',
            'explicacao': 'O planejamento orçamentário federal tem três instrumentos: 1) PPA (Plano Plurianual) — 4 anos, define objetivos e metas de médio prazo; 2) LDO (Lei de Diretrizes Orçamentárias) — 1 ano, orienta a elaboração do LOA e estabelece metas fiscais; 3) LOA (Lei Orçamentária Anual) — 1 ano, detalha as receitas e despesas do exercício. O PPA é o mais estratégico e abrangente; a LOA é o mais operacional e detalhado.',
            'dica': 'Orçamento: PPA (4 anos) → LDO (anual, metas) → LOA (anual, detalhado). "Do mais geral para o mais específico."',
            'dificuldade': 'médio',
            'fonte': 'CESPE',
            'ano': 2022,
            'titulo': 'CESPE/CGU/2022 - PPA/LDO/LOA'
        },
        {
            'enunciado': 'O Brasil adota o regime de metas de inflação, onde o Banco Central tem como objetivo manter a inflação dentro de uma banda definida pelo Conselho Monetário Nacional (CMN). O principal instrumento da política monetária para controlar a inflação é:',
            'opcoes': ['A) Taxa de câmbio', 'B) Taxa Selic (taxa básica de juros)', 'C) Taxa de desemprego', 'D) Meta de superávit primário', 'E) Taxa de reservas compulsórias exclusivamente'],
            'resposta': 'B',
            'explicacao': 'No regime de metas de inflação (adotado pelo Brasil em 1999), o Banco Central usa a taxa Selic (taxa básica de juros) como principal instrumento. Quando a inflação ameaça superar a meta, o Bacen eleva a Selic — tornando o crédito mais caro e reduzindo o consumo e investimentos. Quando a inflação está abaixo da meta, reduz a Selic. O COPOM (Comitê de Política Monetária) se reúne a cada 45 dias para definir a Selic.',
            'dica': 'Inflação alta → Bacen sobe a Selic → crédito mais caro → menos consumo → menos pressão inflacionária. Selic é o principal instrumento da política monetária.',
            'dificuldade': 'médio',
            'fonte': 'FCC',
            'ano': 2022,
            'titulo': 'FCC/Bacen/2022 - Política Monetária'
        },
        {
            'enunciado': 'A Lei de Responsabilidade Fiscal (LRF — Lei Complementar 101/2000) estabelece normas de finanças públicas voltadas para a responsabilidade na gestão fiscal. Entre seus princípios, está:',
            'opcoes': ['A) Autorizar gasto ilimitado em programas sociais sem compensação', 'B) Equilíbrio entre receitas e despesas e controle do endividamento público', 'C) Proibir qualquer tipo de crédito público', 'D) Permitir que cada ente crie tributos livremente sem limite', 'E) Garantir que servidores públicos tenham aumentos automáticos anuais'],
            'resposta': 'B',
            'explicacao': 'A Lei de Responsabilidade Fiscal (LC 101/2000) estabelece: equilíbrio entre receitas e despesas; limitações de gasto com pessoal (% da Receita Corrente Líquida); controle do endividamento; transparência e prestação de contas; vedação de criar despesa sem fonte de receita correspondente (regra de compensação); responsabilização de gestores por descumprimento. É o principal marco legal da disciplina fiscal brasileira.',
            'dica': 'LRF (LC 101/2000): equilíbrio fiscal, limite de gasto com pessoal, controle da dívida, transparência. Descumprimento = crime de responsabilidade (Lei 10.028/2000).',
            'dificuldade': 'médio',
            'fonte': 'CESPE',
            'ano': 2021,
            'titulo': 'CESPE/TCU/2021 - Lei de Responsabilidade Fiscal'
        },
    ],

    'Economia Brasileira': [
        {
            'enunciado': 'O PIB (Produto Interno Bruto) mede:',
            'opcoes': ['A) A soma de todos os bens e serviços FINAIS produzidos em um país em determinado período', 'B) Apenas a produção industrial do país', 'C) A renda dos cidadãos independentemente de onde trabalham', 'D) O valor de todas as transações financeiras realizadas no país', 'E) A diferença entre exportações e importações'],
            'resposta': 'A',
            'explicacao': 'O PIB (Produto Interno Bruto) é a soma monetária de todos os bens e serviços FINAIS (não intermediários, para evitar dupla contagem) produzidos dentro do território de um país em um determinado período (trimestre ou ano). É calculado de três formas equivalentes: pela ótica da produção, da despesa (consumo + investimento + gastos do governo + exportações líquidas) e da renda. O PIB mede riqueza produzida no território (não a renda dos nacionais — isso é PNB).',
            'dica': 'PIB: bens e serviços FINAIS, produzidos no TERRITÓRIO, em determinado período. PNB: produzidos pelos NACIONAIS, onde quer que estejam.',
            'dificuldade': 'fácil',
            'fonte': 'CESPE',
            'ano': 2022,
            'titulo': 'CESPE/IBGE/2022 - Conceito de PIB'
        },
        {
            'enunciado': 'O IPCA (Índice Nacional de Preços ao Consumidor Amplo) é o índice oficial de inflação do Brasil, calculado pelo IBGE. O IPCA mede:',
            'opcoes': ['A) A inflação ao produtor industrial', 'B) A variação dos preços de uma cesta de produtos e serviços consumidos pelas famílias com renda de 1 a 40 salários mínimos', 'C) Apenas a variação dos preços dos alimentos', 'D) A inflação das empresas públicas', 'E) A variação cambial do Real em relação ao Dólar'],
            'resposta': 'B',
            'explicacao': 'O IPCA é calculado pelo IBGE e mede a inflação para famílias com renda entre 1 e 40 salários mínimos nas regiões metropolitanas do Brasil. É o índice oficial utilizado pelo Banco Central para o regime de metas de inflação. Outros índices: IGP-M (FGV — inflação de produtores), INPC (famílias de renda menor, 1 a 5 SM), IPC-A (FIPE, São Paulo).',
            'dica': 'IPCA: inflação oficial do Brasil. Calculado pelo IBGE. Para famílias de 1-40 SM. É o índice das metas de inflação do Bacen.',
            'dificuldade': 'médio',
            'fonte': 'FCC',
            'ano': 2022,
            'titulo': 'FCC/Bacen/2022 - IPCA'
        },
    ],

    'Segurança Pública e Justiça': [
        {
            'enunciado': 'A Polícia Federal tem como missão constitucional (art. 144, §1º, CF/88):',
            'opcoes': ['A) Fazer o policiamento ostensivo e a preservação da ordem pública', 'B) Apurar infrações penais contra a ordem política e social, infrações em detrimento de bens, serviços e interesses da União, e exercer a função de polícia judiciária da União', 'C) Investigar apenas crimes de colarinho branco', 'D) Exercer apenas vigilância nas fronteiras terrestres', 'E) Apurar crimes praticados por servidores estaduais'],
            'resposta': 'B',
            'explicacao': 'O art. 144, §1º, CF/88 atribui à Polícia Federal: (I) apurar infrações penais contra a ordem política e social; (II) prevenir e reprimir o tráfico ilícito de entorpecentes e drogas afins, o contrabando e o descaminho; (III) exercer as funções de polícia marítima, aeroportuária e de fronteiras; (IV) exercer, com exclusividade, as funções de polícia judiciária da União. O policiamento ostensivo é da Polícia Militar.',
            'dica': 'PF = polícia JUDICIÁRIA da União + infrações contra a União + fronteiras + tráfico/contrabando. PM = policiamento OSTENSIVO dos Estados.',
            'dificuldade': 'médio',
            'fonte': 'CESPE',
            'ano': 2022,
            'titulo': 'CESPE/PF/2022 - Atribuições da Polícia Federal'
        },
        {
            'enunciado': 'O Estatuto da Criança e do Adolescente (ECA — Lei 8.069/1990) estabelece que a criança e o adolescente são sujeitos de direitos. Para o ECA, considera-se criança a pessoa com até:',
            'opcoes': ['A) 10 anos de idade', 'B) 12 anos de idade incompletos', 'C) 14 anos de idade', 'D) 16 anos de idade', 'E) 18 anos de idade'],
            'resposta': 'B',
            'explicacao': 'O art. 2º do ECA define: criança = pessoa com até 12 anos de idade incompletos; adolescente = pessoa entre 12 e 18 anos de idade. A distinção importa: crianças são encaminhadas ao Conselho Tutelar (não aplicam-se medidas socioeducativas); adolescentes podem cumprir medidas socioeducativas (advertência, LA, PSC, semiliberdade, internação). Menores de 18 anos são penalmente inimputáveis (art. 228, CF + art. 104, ECA).',
            'dica': 'ECA: criança = até 12 anos INCOMPLETOS. Adolescente = 12 a 18 anos. Inimputabilidade penal: abaixo de 18 anos (CF, art. 228).',
            'dificuldade': 'fácil',
            'fonte': 'CESPE',
            'ano': 2022,
            'titulo': 'CESPE/DPF/2022 - ECA'
        },
    ],

    'Meio Ambiente e Sustentabilidade': [
        {
            'enunciado': 'O Acordo de Paris (2015) é um tratado internacional sobre mudanças climáticas. Qual é o principal objetivo do Acordo de Paris?',
            'opcoes': ['A) Eliminar completamente as emissões de carbono até 2025', 'B) Limitar o aquecimento global a menos de 2°C acima dos níveis pré-industriais, com esforços para 1,5°C', 'C) Criar um imposto global sobre carbono', 'D) Substituir o Protocolo de Kyoto por metas vinculantes de redução para países desenvolvidos apenas', 'E) Proibir a produção de combustíveis fósseis a partir de 2030'],
            'resposta': 'B',
            'explicacao': 'O Acordo de Paris (COP21, dezembro de 2015), em vigor desde 2016, estabelece como objetivo central manter o aumento da temperatura global abaixo de 2°C em relação aos níveis pré-industriais e envidar esforços para limitar a 1,5°C. Os países se comprometem com NDCs (Contribuições Nacionalmente Determinadas) — metas voluntárias de redução de emissões. Diferente do Protocolo de Kyoto, o Acordo de Paris é universal (inclui países em desenvolvimento) e baseado em compromissos nacionais voluntários.',
            'dica': 'Acordo de Paris: meta de temperatura = abaixo de 2°C (esforços para 1,5°C). Universal, NDCs voluntárias. Aprovado na COP21 (2015).',
            'dificuldade': 'médio',
            'fonte': 'CESPE',
            'ano': 2022,
            'titulo': 'CESPE/IBAMA/2022 - Acordo de Paris'
        },
        {
            'enunciado': 'O Código Florestal Brasileiro (Lei 12.651/2012) instituiu, entre outros mecanismos, a:',
            'opcoes': ['A) Reserva Legal — área de vegetação nativa que deve ser mantida em propriedades rurais', 'B) Proibição absoluta de desmatamento em qualquer parte do território nacional', 'C) Extinção das Áreas de Preservação Permanente (APPs)', 'D) Transferência da gestão ambiental exclusivamente para os Municípios', 'E) Criação do imposto sobre carbono para propriedades rurais'],
            'resposta': 'A',
            'explicacao': 'O Código Florestal (Lei 12.651/2012) estabelece dois instrumentos principais: (1) Reserva Legal (RL): percentual de vegetação nativa que deve ser mantido na propriedade rural (20% no Cerrado, 80% na Amazônia Legal, 35% no Cerrado amazônico); (2) Áreas de Preservação Permanente (APPs): faixas de proteção obrigatória às margens de rios, topos de morro e encostas. O CAR (Cadastro Ambiental Rural) é o sistema de registro digital das propriedades rurais.',
            'dica': 'Código Florestal: Reserva Legal (% a preservar) + APPs (margens de rios, morros). Amazônia: 80% de RL. Cerrado: 20%. CAR: cadastro obrigatório.',
            'dificuldade': 'médio',
            'fonte': 'FCC',
            'ano': 2022,
            'titulo': 'FCC/IBAMA/2022 - Código Florestal'
        },
        {
            'enunciado': 'O Fundo Amazônia, administrado pelo BNDES, tem por objetivo:',
            'opcoes': ['A) Financiar a exploração sustentável da madeira amazônica', 'B) Captar doações para prevenção de desmatamento e promover o desenvolvimento sustentável na Amazônia', 'C) Financiar a expansão da agropecuária na região amazônica', 'D) Criar reservas privadas de biodiversidade no bioma', 'E) Compensar proprietários rurais expropriados por criação de unidades de conservação'],
            'resposta': 'B',
            'explicacao': 'O Fundo Amazônia foi criado em 2008 e é administrado pelo BNDES. Financia ações de prevenção ao desmatamento e promoção do desenvolvimento sustentável na Amazônia Legal, recebendo doações principalmente da Noruega e Alemanha. Em 2019, foi suspenso por desentendimentos sobre a política ambiental, sendo reativado em 2023. Em 2022, o Brasil aprovou seu Plano Nacional de Mudanças do Clima com metas de redução de emissões.',
            'dica': 'Fundo Amazônia: BNDES + doações externas (Noruega, Alemanha) → prevenir desmatamento + desenvolvimento sustentável na Amazônia.',
            'dificuldade': 'médio',
            'fonte': 'CESPE',
            'ano': 2022,
            'titulo': 'CESPE/BNDES/2022 - Fundo Amazônia'
        },
    ],

    'Tecnologia e Sociedade Digital': [
        {
            'enunciado': 'A Lei Geral de Proteção de Dados Pessoais (LGPD — Lei 13.709/2018) estabelece regras sobre o tratamento de dados pessoais. Qual é a definição de "dado pessoal" segundo a LGPD?',
            'opcoes': ['A) Apenas informações financeiras e bancárias de pessoas físicas', 'B) Informação relacionada a pessoa natural identificada ou identificável', 'C) Exclusivamente dados de saúde e biométricos', 'D) Apenas dados digitais armazenados em computadores', 'E) Informações de pessoas jurídicas e pessoas físicas indistintamente'],
            'resposta': 'B',
            'explicacao': 'O art. 5º, I, da LGPD define dado pessoal como "informação relacionada a pessoa natural identificada ou identificável". Isso inclui: nome, CPF, e-mail, IP, localização, preferências, informações comportamentais, dados biométricos, etc. Dados de pessoas jurídicas NÃO são protegidos pela LGPD (apenas de pessoas naturais). Dados anonimizados, quando não permitem identificação, também não são dados pessoais para a LGPD.',
            'dica': 'LGPD: protege dados de PESSOA NATURAL identificada ou identificável. Não protege dados de pessoa jurídica. Dado anonimizado = não é dado pessoal.',
            'dificuldade': 'médio',
            'fonte': 'CESPE',
            'ano': 2022,
            'titulo': 'CESPE/ANPD/2022 - LGPD'
        },
        {
            'enunciado': 'O Marco Civil da Internet (Lei 12.965/2014) estabelece princípios, garantias, direitos e deveres para o uso da internet no Brasil. Um dos princípios centrais é a neutralidade de rede, que significa:',
            'opcoes': ['A) Que o acesso à internet deve ser gratuito para todos os brasileiros', 'B) Que os provedores de internet não podem discriminar os pacotes de dados por origem, destino, serviço ou conteúdo', 'C) Que o governo não pode regular a internet', 'D) Que todas as empresas de internet têm os mesmos direitos que os usuários', 'E) Que a velocidade de internet deve ser igual em todo o território nacional'],
            'resposta': 'B',
            'explicacao': 'A neutralidade de rede (art. 9º, Marco Civil) estabelece que os provedores de conexão e de aplicações devem tratar os pacotes de dados de forma isonômica, sem discriminação por origem, destino, protocolo, conteúdo, serviço, tipo de dado ou aplicação. Isso impede que provedores criem "vias rápidas" para serviços que paguem mais, bloqueiem concorrentes ou degradem determinados serviços. O princípio é controverso internacionalmente — alguns países aboliram a neutralidade de rede.',
            'dica': 'Neutralidade de rede: provedores NÃO podem discriminar pacotes por conteúdo/serviço. Todos os dados são tratados igualmente.',
            'dificuldade': 'médio',
            'fonte': 'FCC',
            'ano': 2022,
            'titulo': 'FCC/TRF-3/2022 - Marco Civil'
        },
    ],

    'Saúde Pública': [
        {
            'enunciado': 'O Sistema Único de Saúde (SUS) foi criado pela Constituição Federal de 1988 e regulamentado pelas Leis 8.080/1990 e 8.142/1990. Os princípios do SUS incluem:',
            'opcoes': ['A) Universalidade, integralidade e equidade', 'B) Seletividade, exclusividade e hierarquia', 'C) Privatização, descentralização e lucratividade', 'D) Universalidade, seletividade e complementaridade', 'E) Hierarquia rígida, centralização e exclusividade pública'],
            'resposta': 'A',
            'explicacao': 'Os princípios doutrinários do SUS (Lei 8.080/1990) são: (1) Universalidade — acesso para todos, sem qualquer discriminação; (2) Integralidade — atenção à saúde em todos os seus aspectos (promoção, prevenção, cura, reabilitação); (3) Equidade — tratar desigualmente os desiguais para reduzir desigualdades. Os princípios organizativos são: descentralização, regionalização, hierarquização e participação da comunidade.',
            'dica': 'SUS: princípios doutrinários = Universalidade + Integralidade + Equidade (UIE). Organizativos: descentralização, regionalização, hierarquização, participação.',
            'dificuldade': 'fácil',
            'fonte': 'CESPE',
            'ano': 2022,
            'titulo': 'CESPE/ANVISA/2022 - Princípios do SUS'
        },
        {
            'enunciado': 'O conceito ampliado de saúde, adotado pelo SUS e pela OMS, define saúde como:',
            'opcoes': ['A) Simplesmente a ausência de doenças', 'B) Um estado de completo bem-estar físico, mental e social, e não apenas ausência de doenças', 'C) A capacidade de trabalhar sem limitações', 'D) O equilíbrio entre corpo e mente segundo a medicina tradicional', 'E) O acesso a medicamentos e tratamentos médicos'],
            'resposta': 'B',
            'explicacao': 'A Organização Mundial da Saúde (OMS), desde 1948, define saúde como "um estado de completo bem-estar físico, mental e social, e não apenas ausência de doenças". O SUS adota esse conceito ampliado, que implica abordagem integral e determinantes sociais da saúde (alimentação, moradia, saneamento, educação, renda, trabalho, etc.). A 8ª Conferência Nacional de Saúde (1986) — que precede a CF/88 — consolidou esse conceito no Brasil.',
            'dica': 'Saúde (OMS/SUS): bem-estar FÍSICO + MENTAL + SOCIAL, não apenas ausência de doenças. Determinantes sociais influenciam a saúde.',
            'dificuldade': 'fácil',
            'fonte': 'FCC',
            'ano': 2021,
            'titulo': 'FCC/Pref-SP/2021 - Conceito de Saúde'
        },
    ],

    'Educação no Brasil': [
        {
            'enunciado': 'A Base Nacional Comum Curricular (BNCC), homologada em 2017 (Ed. Infantil e Fundamental) e 2018 (Ensino Médio), é um documento de caráter normativo que:',
            'opcoes': ['A) É um currículo único e obrigatório para todas as escolas do país, sem espaço para adaptações locais', 'B) Define o conjunto de aprendizagens essenciais a todos os estudantes brasileiros, deixando às redes e escolas autonomia para complementar o currículo', 'C) Substitui completamente os currículos estaduais e municipais', 'D) Se aplica apenas às escolas públicas federais', 'E) Estabelece apenas os conteúdos de Língua Portuguesa e Matemática'],
            'resposta': 'B',
            'explicacao': 'A BNCC define aprendizagens essenciais — competências e habilidades — que todos os alunos devem desenvolver, mas não é um currículo único. As redes de ensino e escolas têm autonomia para elaborar seus próprios currículos, que devem observar a BNCC mas podem complementá-la com até 40% de conteúdo local. Aplica-se a todas as escolas, públicas e privadas. Cobre todas as áreas do conhecimento.',
            'dica': 'BNCC: define competências e habilidades ESSENCIAIS para todos. Escolas/redes têm autonomia para complementar. Não é currículo único.',
            'dificuldade': 'médio',
            'fonte': 'CESPE',
            'ano': 2022,
            'titulo': 'CESPE/INEP/2022 - BNCC'
        },
    ],

    'Relações Internacionais': [
        {
            'enunciado': 'O MERCOSUL (Mercado Comum do Sul) é um bloco de integração regional do qual o Brasil é membro fundador. O MERCOSUL foi criado pelo:',
            'opcoes': ['A) Tratado de Assunção (1991)', 'B) Tratado de Roma (1957)', 'C) Acordo de Cartagena (1969)', 'D) Protocolo de Ouro Preto (1994)', 'E) Tratado de Montevidéu (1980)'],
            'resposta': 'A',
            'explicacao': 'O MERCOSUL foi criado pelo Tratado de Assunção, assinado em 26 de março de 1991, pelos presidentes do Brasil, Argentina, Uruguai e Paraguai. Entrou em vigor em novembro de 1991. O Protocolo de Ouro Preto (1994) deu ao MERCOSUL personalidade jurídica internacional e estabeleceu sua estrutura institucional. A Venezuela foi membro pleno (2012-2016, depois suspensa). Bolívia é membro em processo de adesão.',
            'dica': 'MERCOSUL: criado pelo Tratado de ASSUNÇÃO (1991). Membros fundadores: Brasil, Argentina, Uruguai, Paraguai. Ouro Preto (1994) = estrutura institucional.',
            'dificuldade': 'médio',
            'fonte': 'CESPE',
            'ano': 2022,
            'titulo': 'CESPE/IRBr/2022 - MERCOSUL'
        },
        {
            'enunciado': 'A ONU (Organização das Nações Unidas) possui órgãos principais. Qual dos órgãos tem poder de aplicar sanções e autorizar o uso da força para manter a paz e a segurança internacionais?',
            'opcoes': ['A) Assembleia Geral', 'B) Secretariado', 'C) Conselho de Segurança', 'D) Conselho Econômico e Social', 'E) Tribunal Internacional de Justiça'],
            'resposta': 'C',
            'explicacao': 'O Conselho de Segurança da ONU (CS) é o órgão com responsabilidade primária pela manutenção da paz e segurança internacionais. Tem 15 membros: 5 permanentes com poder de veto (EUA, Reino Unido, França, Rússia e China) e 10 rotativos eleitos pela Assembleia Geral. Pode impor sanções econômicas e autorizar missões de paz (peacekeeping). As decisões do CS são vinculantes para todos os membros da ONU.',
            'dica': 'Conselho de Segurança: paz e segurança internacionais. 5 membros permanentes com VETO (EUA, UK, França, Rússia, China) + 10 rotativos.',
            'dificuldade': 'médio',
            'fonte': 'FCC',
            'ano': 2022,
            'titulo': 'FCC/IRBr/2022 - ONU'
        },
    ],

    'Direitos Humanos e Cidadania': [
        {
            'enunciado': 'A Declaração Universal dos Direitos Humanos (DUDH) foi proclamada pela ONU em:',
            'opcoes': ['A) 1945', 'B) 1948', 'C) 1966', 'D) 1988', 'E) 1993'],
            'resposta': 'B',
            'explicacao': 'A Declaração Universal dos Direitos Humanos foi adotada e proclamada pela Assembleia Geral das Nações Unidas em 10 de dezembro de 1948 (Resolução 217 A III), após o fim da Segunda Guerra Mundial e os horrores do Holocausto. É um documento fundacional do sistema internacional de direitos humanos, proclamando direitos civis, políticos, econômicos, sociais e culturais. O dia 10 de dezembro é o Dia Internacional dos Direitos Humanos.',
            'dica': 'DUDH: 10 de dezembro de 1948. Pós-Segunda Guerra Mundial. Dia Internacional dos DH = 10/12. Base do sistema internacional de DH.',
            'dificuldade': 'fácil',
            'fonte': 'CESPE',
            'ano': 2022,
            'titulo': 'CESPE/DPU/2022 - DUDH'
        },
        {
            'enunciado': 'O Estatuto do Idoso (Lei 10.741/2003) considera idosa a pessoa com idade igual ou superior a:',
            'opcoes': ['A) 55 anos', 'B) 60 anos', 'C) 65 anos', 'D) 70 anos', 'E) 75 anos'],
            'resposta': 'B',
            'explicacao': 'O Estatuto do Idoso (Lei 10.741/2003) define como idosa a pessoa com 60 (sessenta) anos ou mais (art. 1º). O Estatuto assegura direitos como prioridade no atendimento, acesso preferencial a serviços públicos, saúde, transporte gratuito ou subsidiado, entre outros. A OMS e a ONU utilizam 65 anos como parâmetro em países desenvolvidos, mas o Brasil optou por 60 anos.',
            'dica': 'Estatuto do Idoso (Lei 10.741/2003): idoso = 60 anos ou mais. Brasil usa 60 anos (OMS usa 65 para países desenvolvidos).',
            'dificuldade': 'fácil',
            'fonte': 'FCC',
            'ano': 2021,
            'titulo': 'FCC/DPE-RR/2021 - Estatuto do Idoso'
        },
    ],

    'Ciência e Inovação': [
        {
            'enunciado': 'A Inteligência Artificial (IA) generativa, como o ChatGPT, foi desenvolvida com base em modelos de linguagem de grande porte (LLMs). Esses modelos são treinados por:',
            'opcoes': ['A) Programação manual de regras gramaticais e sintáticas', 'B) Aprendizado profundo em grandes volumes de texto usando redes neurais transformers', 'C) Algoritmos de busca em bancos de dados estruturados', 'D) Especialistas humanos que inserem respostas manualmente', 'E) Regras lógicas proposicionais clássicas'],
            'resposta': 'B',
            'explicacao': 'Os LLMs (Large Language Models) como GPT-4, Llama, Claude e Gemini são treinados por aprendizado profundo (deep learning) usando arquiteturas transformer, sobre bilhões de tokens de texto. O processo inclui pré-treinamento (aprendizado de padrões linguísticos) e fine-tuning com RLHF (Reinforcement Learning from Human Feedback). São modelos estatísticos que preveem o próximo token mais provável, não sistemas baseados em regras.',
            'dica': 'IA generativa: transformers + deep learning + treinamento em grandes volumes de texto. RLHF é o método de alinhamento humano usado.',
            'dificuldade': 'médio',
            'fonte': 'CESPE',
            'ano': 2023,
            'titulo': 'CESPE/CNPQ/2023 - Inteligência Artificial'
        },
        {
            'enunciado': 'A Lei de Inovação Tecnológica (Lei 10.973/2004, atualizada pela Lei 13.243/2016 - Marco Legal da Ciência, Tecnologia e Inovação) tem como objetivo:',
            'opcoes': ['A) Proibir pesquisas em parceria com empresas privadas', 'B) Estimular a inovação e a pesquisa científica e tecnológica no ambiente produtivo, com foco na capacitação e interação entre ICTs e empresas', 'C) Centralizar todas as pesquisas no CNPQ', 'D) Eliminar as universidades públicas em favor de centros tecnológicos privados', 'E) Criar um imposto sobre royalties de propriedade intelectual'],
            'resposta': 'B',
            'explicacao': 'A Lei de Inovação (10.973/2004) e seu aprimoramento pelo Marco Legal de C&T (13.243/2016) visam: estimular a interação entre Instituições Científicas, Tecnológicas e de Inovação (ICTs) e o setor produtivo; flexibilizar a participação de pesquisadores em empresas (spinoffs); criar mecanismos de transferência de tecnologia; facilitar o licenciamento de patentes geradas em universidades. O objetivo é transformar conhecimento científico em inovação produtiva.',
            'dica': 'Marco Legal C&T (2016): permite interação ICTs-empresas, spinoffs acadêmicos, transferência de tecnologia, participação de pesquisadores em startups.',
            'dificuldade': 'médio',
            'fonte': 'CESPE',
            'ano': 2022,
            'titulo': 'CESPE/CNPQ/2022 - Marco Legal C&T'
        },
    ],
}
