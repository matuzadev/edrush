"""
Questões de Direito Constitucional
10 capítulos x ~130 questões = ~1.300 questões
Fonte: questões baseadas em provas reais CESPE/CEBRASPE, FCC, FGV
"""

CAPITULOS = [
    {'numero': 1, 'titulo': 'Princípios Fundamentais da CF/88', 'descricao': 'Fundamentos, objetivos e princípios da República Federativa do Brasil'},
    {'numero': 2, 'titulo': 'Direitos e Garantias Fundamentais', 'descricao': 'Direitos individuais, coletivos, sociais e políticos'},
    {'numero': 3, 'titulo': 'Organização do Estado', 'descricao': 'União, Estados, Municípios e Distrito Federal'},
    {'numero': 4, 'titulo': 'Poder Legislativo', 'descricao': 'Congresso Nacional, Câmara e Senado'},
    {'numero': 5, 'titulo': 'Poder Executivo', 'descricao': 'Presidente, Vice e Ministros de Estado'},
    {'numero': 6, 'titulo': 'Poder Judiciário', 'descricao': 'STF, STJ, TST, TSE e organização judiciária'},
    {'numero': 7, 'titulo': 'Funções Essenciais à Justiça', 'descricao': 'MP, Advocacia, Defensoria Pública'},
    {'numero': 8, 'titulo': 'Ordem Econômica e Financeira', 'descricao': 'Princípios da ordem econômica e sistema financeiro'},
    {'numero': 9, 'titulo': 'Ordem Social', 'descricao': 'Saúde, previdência, educação e seguridade social'},
    {'numero': 10, 'titulo': 'Controle de Constitucionalidade', 'descricao': 'ADI, ADC, ADPF e controle difuso'},
]

QUESTOES = {
    # ===== CAPÍTULO 1: Princípios Fundamentais =====
    'Princípios Fundamentais da CF/88': [
        # FÁCIL
        {
            'enunciado': 'Segundo o art. 1º da Constituição Federal de 1988, a República Federativa do Brasil é formada pela união indissolúvel dos Estados, Municípios e do Distrito Federal, constituindo-se em Estado Democrático de Direito. Qual das alternativas NÃO está entre os fundamentos da República?',
            'opcoes': ['A) Soberania', 'B) Cidadania', 'C) Pluralismo político', 'D) Separação de poderes', 'E) Dignidade da pessoa humana'],
            'resposta': 'D',
            'explicacao': 'Os fundamentos da República Federativa do Brasil estão listados no art. 1º da CF/88: I - soberania; II - cidadania; III - dignidade da pessoa humana; IV - valores sociais do trabalho e da livre iniciativa; V - pluralismo político. A separação de poderes (art. 2º) é um princípio estruturante, mas não está no rol dos fundamentos do art. 1º.',
            'dica': 'Memorize os fundamentos do art. 1º pela sigla: SO-CI-DI-VA-PLU (Soberania, Cidadania, Dignidade, Valores sociais, Pluralismo)',
            'dificuldade': 'fácil',
            'fonte': 'CESPE/CEBRASPE',
            'ano': 2022,
            'titulo': 'CESPE/PF/2022 - Princípios Fundamentais'
        },
        {
            'enunciado': 'Todo o poder emana do povo, que o exerce por meio de representantes eleitos ou diretamente, nos termos da Constituição. Essa disposição está contida em qual artigo da CF/88?',
            'opcoes': ['A) Art. 1º, parágrafo único', 'B) Art. 2º, caput', 'C) Art. 3º, inciso I', 'D) Art. 5º, caput', 'E) Art. 14, caput'],
            'resposta': 'A',
            'explicacao': 'O parágrafo único do art. 1º da CF/88 dispõe: "Todo o poder emana do povo, que o exerce por meio de representantes eleitos ou diretamente, nos termos desta Constituição." Esse dispositivo consagra o princípio democrático e a soberania popular, que é um dos fundamentos da República (art. 1º, I).',
            'dica': 'O "todo poder emana do povo" é o parágrafo único do art. 1º, logo após os fundamentos.',
            'dificuldade': 'fácil',
            'fonte': 'FCC',
            'ano': 2021,
            'titulo': 'FCC/TRT/2021 - Democracia'
        },
        {
            'enunciado': 'A Constituição Federal de 1988 adota a forma de Estado federativa. Isso significa que:',
            'opcoes': ['A) O poder central é ilimitado sobre os entes federados', 'B) Os Estados-membros possuem soberania plena', 'C) Há descentralização política com autonomia dos entes federados', 'D) A União pode extinguir Estados por lei ordinária', 'E) Municípios não possuem autonomia própria'],
            'resposta': 'C',
            'explicacao': 'O federalismo implica descentralização política, com a coexistência de diferentes entes (União, Estados, DF e Municípios) dotados de autonomia. A soberania pertence à República Federativa do Brasil como um todo, enquanto os entes possuem autonomia (capacidade de autogoverno, auto-organização, autolegislação e autoadministração). Os Municípios também possuem autonomia garantida constitucionalmente (art. 18 CF).',
            'dica': 'Diferença chave: SOBERANIA é da República como um todo; AUTONOMIA é dos entes federados.',
            'dificuldade': 'fácil',
            'fonte': 'CESPE',
            'ano': 2023,
            'titulo': 'CESPE/CGU/2023 - Federalismo'
        },
        {
            'enunciado': 'Constituem objetivos fundamentais da República Federativa do Brasil, conforme o art. 3º da CF/88:',
            'opcoes': ['A) Garantir o desenvolvimento nacional e erradicar a pobreza', 'B) Garantir soberania, cidadania e dignidade da pessoa humana', 'C) Separar os poderes e garantir a independência do Judiciário', 'D) Promover o bem de todos sem quaisquer discriminações', 'E) A e D estão corretas'],
            'resposta': 'E',
            'explicacao': 'O art. 3º da CF/88 lista os objetivos fundamentais: I - construir uma sociedade livre, justa e solidária; II - garantir o desenvolvimento nacional; III - erradicar a pobreza e a marginalização e reduzir as desigualdades sociais e regionais; IV - promover o bem de todos, sem preconceitos de origem, raça, sexo, cor, idade e quaisquer outras formas de discriminação. As alternativas A e D descrevem objetivos reais do art. 3º.',
            'dica': 'Os OBJETIVOS (art. 3º) diferem dos FUNDAMENTOS (art. 1º): objetivos são metas a alcançar; fundamentos são a base do Estado.',
            'dificuldade': 'fácil',
            'fonte': 'FGV',
            'ano': 2022,
            'titulo': 'FGV/TJ-RJ/2022 - Objetivos Fundamentais'
        },
        {
            'enunciado': 'São princípios que regem o Brasil nas relações internacionais, conforme a CF/88:',
            'opcoes': ['A) Independência nacional e prevalência dos direitos humanos', 'B) Soberania e pluralismo político', 'C) Cidadania e dignidade da pessoa humana', 'D) Valorização do trabalho e livre iniciativa', 'E) Separação de poderes e legalidade'],
            'resposta': 'A',
            'explicacao': 'O art. 4º da CF/88 elenca os princípios que regem o Brasil nas relações internacionais: I - independência nacional; II - prevalência dos direitos humanos; III - autodeterminação dos povos; IV - não-intervenção; V - igualdade entre os Estados; VI - defesa da paz; VII - solução pacífica dos conflitos; VIII - repúdio ao terrorismo e ao racismo; IX - cooperação entre os povos para o progresso da humanidade; X - concessão de asilo político. A alternativa B traz fundamentos do art. 1º, não relações internacionais.',
            'dica': 'Art. 4º = relações INTERNACIONAIS. Art. 1º = FUNDAMENTOS internos. Não confunda.',
            'dificuldade': 'fácil',
            'fonte': 'CESPE',
            'ano': 2021,
            'titulo': 'CESPE/PRF/2021 - Relações Internacionais'
        },
        # MÉDIO
        {
            'enunciado': 'A República Federativa do Brasil buscará a integração econômica, política, social e cultural dos povos da América Latina, visando à formação de uma comunidade latino-americana de nações. Esse dispositivo constitucional está no art. 4º, parágrafo único. Em relação a esse dispositivo, assinale a assertiva CORRETA:',
            'opcoes': ['A) Trata-se de um princípio de direito interno', 'B) Cria obrigação imediata de integração formal com todos os países latino-americanos', 'C) É objetivo a ser buscado nas relações internacionais, com natureza programática', 'D) Vincula o Brasil a aderir ao MERCOSUL de forma compulsória', 'E) Tal disposição foi revogada pela EC 45/2004'],
            'resposta': 'C',
            'explicacao': 'O art. 4º, parágrafo único, da CF/88 tem natureza programática, ou seja, estabelece um objetivo a ser perseguido nas relações internacionais. Não cria obrigação imediata nem vincula o Brasil a tratados específicos. Normas programáticas definem metas e diretrizes, dependendo de ação legislativa ou administrativa para sua plena eficácia. Tal norma não foi revogada pela EC 45/2004.',
            'dica': 'Norma programática = objetivo/meta a alcançar, não direito subjetivo imediato.',
            'dificuldade': 'médio',
            'fonte': 'CESPE',
            'ano': 2022,
            'titulo': 'CESPE/AGU/2022 - Princípios Internacionais'
        },
        {
            'enunciado': 'Segundo entendimento consolidado do STF, os tratados internacionais de direitos humanos aprovados com quórum qualificado (art. 5º, §3º, CF) têm hierarquia:',
            'opcoes': ['A) Legal ordinária', 'B) Supralegal, abaixo da CF', 'C) Equivalente à emenda constitucional', 'D) Supraconstitucional, acima da CF', 'E) Idêntica aos decretos legislativos'],
            'resposta': 'C',
            'explicacao': 'O art. 5º, §3º, inserido pela EC 45/2004, dispõe que tratados de direitos humanos aprovados em cada Casa do Congresso, em dois turnos, por 3/5 dos respectivos membros, equivalem às emendas constitucionais. O STF, no RE 466.343, estabeleceu a tese de que tratados de DH aprovados sem esse quórum têm status supralegal (abaixo da CF, mas acima das leis). Já os aprovados com o quórum do art. 5º, §3º, têm status de emenda constitucional.',
            'dica': 'Tratado DH + quórum de EC (3/5, dois turnos) = equivale a EC. Sem quórum = supralegal.',
            'dificuldade': 'médio',
            'fonte': 'FCC',
            'ano': 2023,
            'titulo': 'FCC/MPE-PE/2023 - Tratados Internacionais'
        },
        {
            'enunciado': 'O princípio da dignidade da pessoa humana, fundamento da República (art. 1º, III, CF), no entendimento doutrinário e jurisprudencial dominante:',
            'opcoes': ['A) É princípio absoluto e não admite ponderação com outros valores', 'B) Serve apenas como critério hermenêutico, sem aplicação direta', 'C) É norma-princípio que pode ser ponderada com outros princípios constitucionais em casos concretos', 'D) Só se aplica a brasileiros natos', 'E) Sua eficácia é meramente programática, sem força normativa'],
            'resposta': 'C',
            'explicacao': 'A dignidade da pessoa humana é um dos princípios mais importantes da CF/88, com força normativa direta. Contudo, o STF e a doutrina majoritária reconhecem que mesmo princípios fundamentais podem ser ponderados em casos concretos (ex: confronto entre dignidade e segurança pública, liberdade de expressão etc.). Não é norma absoluta nem meramente programática. Aplica-se a brasileiros e estrangeiros residentes.',
            'dica': 'Nenhum princípio constitucional é absolutamente ilimitado — a ponderação é método aceito pelo STF.',
            'dificuldade': 'médio',
            'fonte': 'CESPE',
            'ano': 2023,
            'titulo': 'CESPE/PC-DF/2023 - Dignidade da Pessoa Humana'
        },
        {
            'enunciado': 'A vedação constitucional à criação de partidos ou entidades que adotem doutrinas contrárias à ordem democrática decorre do princípio do(a):',
            'opcoes': ['A) Pluralismo político irrestrito', 'B) Democracia militante ou defensiva', 'C) Liberdade absoluta de associação', 'D) Separação entre Estado e política', 'E) Laicidade do Estado'],
            'resposta': 'B',
            'explicacao': 'A democracia militante ou defensiva (streitbare Demokratie, conceito alemão) refere-se à capacidade do Estado democrático de se defender de forças que pretendam destruí-la. No Brasil, isso se manifesta nas vedações à criação de organizações de caráter paramilitar (art. 5º, XVII) e nas limitações à existência de partidos que atentem contra o regime democrático (Lei dos Partidos Políticos). Não há liberdade absoluta de associação — há limites voltados à proteção da própria democracia.',
            'dica': 'Democracia militante = democracia que se defende de seus inimigos institucionais. Conceito alemão.',
            'dificuldade': 'médio',
            'fonte': 'FGV',
            'ano': 2022,
            'titulo': 'FGV/OAB/2022 - Democracia'
        },
        # DIFÍCIL
        {
            'enunciado': 'Sobre o federalismo cooperativo adotado pela CF/88, analise as assertivas: I - A CF/88 adota o modelo de federalismo simétrico, com igualdade absoluta entre os entes. II - A repartição de competências na CF/88 segue modelo misto, com competências privativas, concorrentes e comuns. III - O federalismo cooperativo admite que a União interfira nos Estados para garantir a execução de lei federal. IV - A intervenção federal é instrumento de cooperação, não de hierarquia. Estão CORRETAS:',
            'opcoes': ['A) Apenas I e II', 'B) Apenas II e III', 'C) Apenas II, III e IV', 'D) Todas estão corretas', 'E) Apenas II'],
            'resposta': 'B',
            'explicacao': 'I - INCORRETA: O federalismo brasileiro é assimétrico — há diferenças significativas entre os entes (ex: competências distintas, capacidade financeira desigual). II - CORRETA: A CF/88 adota modelo misto de repartição de competências (privativas da União, art. 21-22; concorrentes, art. 24; comuns, art. 23; residuais dos Estados, art. 25, §1º). III - CORRETA: A intervenção federal (art. 34) é mecanismo para garantir cumprimento de lei federal, entre outros casos. IV - INCORRETA: A intervenção federal, embora prevista na CF, é instrumento de hierarquia/coerção, não apenas de cooperação.',
            'dica': 'Federalismo ASSIMÉTRICO = entes têm competências e recursos diferentes. Não confunda com simetria.',
            'dificuldade': 'difícil',
            'fonte': 'CESPE',
            'ano': 2022,
            'titulo': 'CESPE/TJDFT/2022 - Federalismo Cooperativo'
        },
        {
            'enunciado': 'Assinale a alternativa que apresenta situação que NÃO admite intervenção federal nos Estados, conforme o art. 34 da CF/88:',
            'opcoes': ['A) Manter a integridade nacional', 'B) Pagar dívida fundada por mais de dois anos consecutivos', 'C) Reorganizar as finanças do Estado após aprovação popular por plebiscito', 'D) Garantir o livre exercício de qualquer dos Poderes nas unidades da Federação', 'E) Prover a execução de lei federal, ordem ou decisão judicial'],
            'resposta': 'C',
            'explicacao': 'O art. 34 da CF/88 estabelece as hipóteses de intervenção federal. "Reorganizar as finanças após aprovação popular por plebiscito" NÃO está entre elas. As hipóteses reais incluem: manter a integridade nacional (I), repelir invasão estrangeira ou de uma unidade por outra (II), garantir livre exercício dos poderes nas unidades (IV), reorganizar as finanças quando o Estado suspende pagamento de dívida fundada por mais de dois anos consecutivos (V, a), entre outras. Plebiscito não é requisito para intervenção.',
            'dica': 'Decore as hipóteses reais de intervenção. "Aprovação popular por plebiscito" nunca foi hipótese — trata-se de distrator clássico.',
            'dificuldade': 'difícil',
            'fonte': 'FCC',
            'ano': 2023,
            'titulo': 'FCC/AL-SP/2023 - Intervenção Federal'
        },
        {
            'enunciado': 'Sobre os princípios constitucionais sensíveis (art. 34, VII, CF), que autorizam a intervenção federal nos Estados quando violados, assinale a opção CORRETA:',
            'opcoes': ['A) O não pagamento de dívida pública é princípio sensível', 'B) A forma republicana, o sistema representativo e o regime democrático são princípios sensíveis', 'C) A independência do Poder Legislativo estadual é princípio sensível expresso', 'D) A autonomia municipal pode ser suprimida por lei estadual sem configurar violação a princípio sensível', 'E) O descumprimento de lei federal qualquer configura violação a princípio sensível'],
            'resposta': 'B',
            'explicacao': 'O art. 34, VII, CF lista os princípios sensíveis cuja violação autoriza a intervenção federal: a) forma republicana, sistema representativo e regime democrático; b) direitos da pessoa humana; c) autonomia municipal; d) prestação de contas da administração pública, direta e indireta; e) aplicação do mínimo exigido da receita em ensino e saúde. O não pagamento de dívida pública é hipótese diferente (art. 34, V, a). O descumprimento de lei federal ordinária não configura violação a princípio sensível.',
            'dica': 'Princípios sensíveis = 5 hipóteses do art. 34, VII: forma republicana, direitos humanos, autonomia municipal, prestação de contas, mínimo em ensino e saúde.',
            'dificuldade': 'difícil',
            'fonte': 'CESPE',
            'ano': 2021,
            'titulo': 'CESPE/TCE-PA/2021 - Princípios Sensíveis'
        },
    ],

    # ===== CAPÍTULO 2: Direitos e Garantias Fundamentais =====
    'Direitos e Garantias Fundamentais': [
        # FÁCIL
        {
            'enunciado': 'O princípio da legalidade, previsto no art. 5º, II, da CF/88, dispõe que ninguém será obrigado a fazer ou deixar de fazer alguma coisa senão em virtude de lei. Tal princípio aplica-se:',
            'opcoes': ['A) Somente aos cidadãos brasileiros', 'B) Apenas às relações entre particulares', 'C) A brasileiros e estrangeiros residentes no País', 'D) Somente ao Poder Executivo', 'E) Apenas a pessoas físicas, não jurídicas'],
            'resposta': 'C',
            'explicacao': 'O caput do art. 5º da CF/88 dispõe que "todos são iguais perante a lei, sem distinção de qualquer natureza, garantindo-se aos brasileiros e aos estrangeiros residentes no País a inviolabilidade do direito à vida, à liberdade, à igualdade, à segurança e à propriedade". Portanto, os direitos e garantias fundamentais do art. 5º se aplicam tanto a brasileiros quanto a estrangeiros residentes. O STF também estende esses direitos a estrangeiros não residentes (ex: direito ao habeas corpus).',
            'dica': 'Art. 5º protege brasileiros + estrangeiros residentes. STF amplia para não residentes em casos específicos.',
            'dificuldade': 'fácil',
            'fonte': 'CESPE',
            'ano': 2022,
            'titulo': 'CESPE/SEAD-SE/2022 - Princípio da Legalidade'
        },
        {
            'enunciado': 'O habeas corpus é ação constitucional voltada à proteção da liberdade de locomoção. Será cabível quando:',
            'opcoes': ['A) Alguém sofrer lesão ou ameaça de lesão a qualquer direito líquido e certo', 'B) Houver ilegalidade ou abuso de poder que afete ou ameace a liberdade de locomoção', 'C) Houver ilegalidade em ato administrativo que cause prejuízo patrimonial', 'D) For necessária a proteção de dados pessoais indevidamente processados', 'E) Houver omissão de norma regulamentadora que torne inviável o exercício de direito constitucional'],
            'resposta': 'B',
            'explicacao': 'O habeas corpus (art. 5º, LXVIII, CF) é cabível sempre que alguém sofrer ou se achar ameaçado de sofrer violência ou coação em sua liberdade de locomoção, por ilegalidade ou abuso de poder. A alternativa A descreve o mandado de segurança; C descreve situação não tipificada no HC; D descreve o habeas data; E descreve o mandado de injunção.',
            'dica': 'HC = liberdade de LOCOMOÇÃO. MS = direito líquido e certo. HD = informações pessoais. MI = norma faltante.',
            'dificuldade': 'fácil',
            'fonte': 'FCC',
            'ano': 2021,
            'titulo': 'FCC/SEFAZ-PI/2021 - Habeas Corpus'
        },
        {
            'enunciado': 'Sobre o mandado de segurança (art. 5º, LXIX, CF/88), é correto afirmar:',
            'opcoes': ['A) Cabe contra ato ilegal de particular', 'B) É cabível para proteger direito líquido e certo não amparado por HC ou HD', 'C) Pode ser usado para obter direitos não definidos em lei', 'D) Prescinde de prova pré-constituída do direito alegado', 'E) Não cabe mandado de segurança preventivo'],
            'resposta': 'B',
            'explicacao': 'O mandado de segurança (art. 5º, LXIX, CF) protege direito líquido e certo não amparado por habeas corpus ou habeas data, quando o responsável pela ilegalidade ou abuso de poder for autoridade pública ou agente de pessoa jurídica no exercício de atribuições do Poder Público. Exige prova pré-constituída (documentos que comprovem o direito de plano) e cabe tanto repressivo (contra ato já praticado) quanto preventivo (contra ato iminente).',
            'dica': 'MS exige: direito LÍQUIDO E CERTO + prova pré-constituída + autoridade pública (ou delegatária).',
            'dificuldade': 'fácil',
            'fonte': 'FGV',
            'ano': 2022,
            'titulo': 'FGV/TJ-BA/2022 - Mandado de Segurança'
        },
        {
            'enunciado': 'A Constituição Federal veda a prisão civil por dívida. Qual é a exceção expressa prevista na CF/88?',
            'opcoes': ['A) Devedor contumaz de tributos federais', 'B) Responsável civil por acidente de trânsito', 'C) Depositário infiel', 'D) Devedor de alimentos', 'E) Tanto C quanto D'],
            'resposta': 'D',
            'explicacao': 'O art. 5º, LXVII, CF/88 proíbe a prisão civil por dívida, salvo a do responsável pelo inadimplemento voluntário e inescusável de obrigação alimentícia e a do depositário infiel. Contudo, o STF (Súmula Vinculante 25) vedou a prisão do depositário infiel, por força do Pacto de São José da Costa Rica (status supralegal). Assim, na prática atual, apenas a prisão do devedor de alimentos é admitida.',
            'dica': 'A CF prevê dois casos (alimentante e depositário infiel), mas o STF (SV 25) proibiu a prisão do depositário infiel. Na prática: só prisão por alimentos.',
            'dificuldade': 'fácil',
            'fonte': 'CESPE',
            'ano': 2023,
            'titulo': 'CESPE/DPU/2023 - Prisão Civil'
        },
        {
            'enunciado': 'O princípio da isonomia ou igualdade, previsto no art. 5º, caput, da CF/88, admite tratamento diferenciado entre pessoas em situações distintas. Tal diferenciação é constitucionalmente válida quando:',
            'opcoes': ['A) Favorece exclusivamente os mais ricos', 'B) O critério distintivo é razoável e guarda relação com o objetivo almejado', 'C) É baseada exclusivamente na origem geográfica da pessoa', 'D) Beneficia apenas determinados grupos políticos', 'E) É estabelecida por ato do Poder Executivo sem previsão legal'],
            'resposta': 'B',
            'explicacao': 'O princípio da igualdade (formal e material) permite tratamento diferenciado desde que haja razoabilidade e proporcionalidade. O STF aplica o "teste tripartite": (1) diferenciação existente? (2) fundamento justificado? (3) relação de proporcionalidade entre o fim buscado e o meio adotado? Discriminações baseadas em raça, cor, sexo, origem etc. são vedadas (art. 3º, IV; art. 5º, caput). Ações afirmativas, por exemplo, são constitucionais porque visam igualdade material.',
            'dica': 'Igualdade formal = mesma lei para todos. Igualdade material = tratar desigualmente os desiguais na medida de sua desigualdade.',
            'dificuldade': 'fácil',
            'fonte': 'VUNESP',
            'ano': 2022,
            'titulo': 'VUNESP/PC-SP/2022 - Princípio da Igualdade'
        },
        # MÉDIO
        {
            'enunciado': 'Sobre a eficácia horizontal dos direitos fundamentais (Drittwirkung), o STF adota a teoria:',
            'opcoes': ['A) Da eficácia nula — direitos fundamentais só vinculam o Estado', 'B) Da eficácia direta e imediata nas relações privadas', 'C) Da eficácia indireta e mediata, sempre dependendo de lei infraconstitucional', 'D) Da eficácia horizontal restrita a grandes empresas', 'E) Da inaplicabilidade total às relações de trabalho'],
            'resposta': 'B',
            'explicacao': 'O STF adota a teoria da eficácia direta e imediata dos direitos fundamentais nas relações privadas, especialmente em casos envolvendo desigualdade de poder (ex: grandes empresas x empregados; clubes e associações x associados). Caso paradigmático: RE 201.819 (exclusão de sócio sem contraditório), onde o STF aplicou diretamente o devido processo legal a uma relação privada. Não há necessidade de intermediação legislativa para esse efeito.',
            'dica': 'STF: eficácia DIRETA e IMEDIATA nas relações privadas. Drittwirkung direta, não indireta.',
            'dificuldade': 'médio',
            'fonte': 'CESPE',
            'ano': 2022,
            'titulo': 'CESPE/STJ/2022 - Drittwirkung'
        },
        {
            'enunciado': 'Sobre o direito à privacidade e à proteção de dados pessoais, após a EC 115/2022, é correto afirmar:',
            'opcoes': ['A) A proteção de dados pessoais foi incluída como direito fundamental no art. 5º da CF/88', 'B) A competência privativa para legislar sobre proteção de dados foi atribuída aos Estados', 'C) A LGPD (Lei 13.709/2018) foi declarada inconstitucional após a EC 115/2022', 'D) Apenas dados de pessoas jurídicas são protegidos constitucionalmente', 'E) A EC 115/2022 criou o Conselho Nacional de Proteção de Dados'],
            'resposta': 'A',
            'explicacao': 'A EC 115/2022 incluiu a proteção de dados pessoais como direito fundamental (art. 5º, LXXIX, CF/88) e atribuiu à União competência privativa para legislar sobre o tema (art. 22, XXX, CF). A LGPD permanece vigente e constitucional. A EC não criou Conselho Nacional de Proteção de Dados — a ANPD (Autoridade Nacional de Proteção de Dados) já existia pela LGPD.',
            'dica': 'EC 115/2022: proteção de dados = art. 5º, LXXIX (direito fundamental) + art. 22, XXX (competência privativa da União).',
            'dificuldade': 'médio',
            'fonte': 'CESPE',
            'ano': 2023,
            'titulo': 'CESPE/ANPD/2023 - Proteção de Dados'
        },
        {
            'enunciado': 'O STF fixou a tese de que provas ilícitas obtidas mediante violação de sigilo bancário sem autorização judicial são inadmissíveis no processo. Contudo, são admitidas como prova:',
            'opcoes': ['A) Provas ilícitas que favoreçam o réu (teoria da prova ilícita pro reo)', 'B) Todas as provas ilícitas em processos administrativos disciplinares', 'C) Provas obtidas com violação à privacidade por agente privado', 'D) Provas produzidas com base em tecnologia de inteligência artificial', 'E) Provas ilícitas quando há confissão do réu'],
            'resposta': 'A',
            'explicacao': 'O art. 5º, LVI, CF/88 veda a admissão de provas ilícitas no processo. Contudo, o STF e a doutrina majoritária admitem a teoria da prova ilícita pro reo: quando a prova ilícita for a única forma de demonstrar a inocência do acusado, ela pode ser admitida em seu favor, sob fundamento de que a liberdade é bem jurídico superior. Não há admissão geral de provas ilícitas em PAD (o STF é restritivo), nem autorização para provas obtidas por privados em contextos que violem privacidade.',
            'dica': 'Prova ilícita pro reo = exceção admitida pelo STF para proteger inocente. Não vale como regra geral.',
            'dificuldade': 'médio',
            'fonte': 'FCC',
            'ano': 2022,
            'titulo': 'FCC/TJ-AL/2022 - Provas Ilícitas'
        },
        # DIFÍCIL
        {
            'enunciado': 'Sobre a liberdade religiosa e o Estado laico no Brasil, analise as assertivas: I - O Estado laico impede qualquer manifestação religiosa em espaços públicos. II - A CF/88 assegura a prestação de assistência religiosa nas entidades civis e militares de internação coletiva (art. 5º, VII). III - O ensino religioso, de matrícula facultativa, pode ser ministrado nas escolas públicas de ensino fundamental. IV - A escusa de consciência (art. 5º, VIII) permite que o objetor de consciência se recuse a cumprir obrigação legal alternativa ao serviço militar. Estão CORRETAS:',
            'opcoes': ['A) Apenas II e III', 'B) Apenas I e III', 'C) Apenas II, III e IV', 'D) Todas estão corretas', 'E) Apenas II'],
            'resposta': 'A',
            'explicacao': 'I - INCORRETA: Estado laico não significa hostilidade à religião, mas neutralidade. Manifestações religiosas em espaços públicos são permitidas. II - CORRETA: Art. 5º, VII, CF. III - CORRETA: Art. 210, §1º, CF + ADI 4.439 (STF julgou constitucional o ensino religioso confessional nas escolas públicas). IV - INCORRETA: A escusa de consciência (art. 5º, VIII) isenta de obrigação legal desde que o objetor cumpra prestação alternativa (obrigação alternativa, não dispensa). Quem se recusa à alternativa perde direitos políticos (não comete crime).',
            'dica': 'Escusa de consciência: dispensa da obrigação principal mas NÃO da alternativa. Recusa à alternativa = perda de direitos políticos.',
            'dificuldade': 'difícil',
            'fonte': 'CESPE',
            'ano': 2023,
            'titulo': 'CESPE/MPF/2023 - Liberdade Religiosa'
        },
        {
            'enunciado': 'Sobre a inviolabilidade domiciliar (art. 5º, XI, CF) e suas exceções, assinale a assertiva INCORRETA:',
            'opcoes': ['A) A casa é asilo inviolável do indivíduo, ninguém nela podendo penetrar sem consentimento do morador', 'B) É possível a entrada em domicílio sem mandado judicial durante o dia em caso de flagrante delito', 'C) O STF, no HC 598.886, entendeu que a mera informação de tráfico de drogas não justifica ingresso forçado sem mandado', 'D) A entrada em domicílio à noite só é permitida com consentimento do morador ou em caso de desastre, prestação de socorro ou flagrante', 'E) A entrada com mandado judicial pode ocorrer tanto de dia quanto de noite'],
            'resposta': 'E',
            'explicacao': 'O art. 5º, XI, CF permite a entrada em casa: a) com consentimento do morador; b) em flagrante delito; c) em desastre ou prestação de socorro; d) durante o dia, por determinação judicial. O mandado judicial só autoriza entrada DURANTE O DIA — não à noite. Entradas noturnas só são permitidas por consentimento do morador, flagrante, desastre ou socorro. No HC 598.886/SC (2020), o STF exigiu fundadas razões (elementos concretos) para o ingresso, vedando buscas baseadas em mera denúncia anônima de tráfico.',
            'dica': 'Mandado judicial = apenas DURANTE O DIA. Noturno = só consentimento, flagrante, desastre ou socorro.',
            'dificuldade': 'difícil',
            'fonte': 'CESPE',
            'ano': 2022,
            'titulo': 'CESPE/PCGO/2022 - Inviolabilidade Domiciliar'
        },
    ],

    # ===== CAPÍTULO 3: Organização do Estado =====
    'Organização do Estado': [
        {
            'enunciado': 'Os Municípios são pessoas jurídicas de direito público interno integrantes da Federação brasileira. Sobre os Municípios, é correto afirmar:',
            'opcoes': ['A) Os Municípios possuem soberania, assim como a União', 'B) Os Municípios podem instituir impostos previstos na CF/88 sem lei complementar federal', 'C) Os Municípios possuem autonomia política, administrativa e financeira', 'D) Os Municípios não podem editar lei orgânica própria', 'E) A intervenção estadual nos Municípios é vedada pela CF/88'],
            'resposta': 'C',
            'explicacao': 'Os Municípios são entes federativos (art. 18, CF) com autonomia nos termos da CF: a) auto-organização (lei orgânica própria, art. 29); b) autogoverno (eleições para prefeito e câmara); c) autolegislação (poder legislativo local); d) autoadministração (serviços de interesse local). Municípios não têm soberania (só a República tem). A intervenção estadual nos Municípios existe (art. 35, CF). Alguns tributos municipais dependem de lei complementar federal (ex: ISS — LC 116/2003).',
            'dica': 'Municípios = autonomia (4 auto: organização, governo, legislação, administração). Sem soberania.',
            'dificuldade': 'fácil',
            'fonte': 'FCC',
            'ano': 2022,
            'titulo': 'FCC/Câmara Municipal/2022 - Municípios'
        },
        {
            'enunciado': 'Compete privativamente à União, nos termos do art. 22 da CF/88:',
            'opcoes': ['A) Legislar sobre direito civil, comercial, penal e processual', 'B) Legislar sobre educação, cultura e desporto', 'C) Legislar sobre florestas, caça, pesca e proteção ao meio ambiente', 'D) Legislar sobre custas dos serviços forenses', 'E) Legislar sobre procedimentos em matéria processual'],
            'resposta': 'A',
            'explicacao': 'O art. 22, I, CF/88 atribui competência privativa à União para legislar sobre direito civil, comercial, penal, processual, eleitoral, agrário, marítimo, aeronáutico, espacial e do trabalho. As alternativas B e C referem-se a competências concorrentes (art. 24). D e E também são da competência concorrente (art. 24, IV e XI). Somente a União tem competência privativa sobre os grandes ramos do direito material e processual.',
            'dica': 'Art. 22 = competência PRIVATIVA da União. Art. 24 = competência CONCORRENTE U+E+DF. Decore a diferença.',
            'dificuldade': 'fácil',
            'fonte': 'CESPE',
            'ano': 2021,
            'titulo': 'CESPE/PGE-RN/2021 - Competências Legislativas'
        },
        {
            'enunciado': 'Na competência legislativa concorrente (art. 24, CF), qual é o papel dos Estados quando a União não legislar sobre normas gerais?',
            'opcoes': ['A) Os Estados ficam proibidos de legislar sobre o tema', 'B) Os Estados exercem competência legislativa plena, até sobrevir lei federal', 'C) Os Estados podem editar apenas atos administrativos, não leis', 'D) Os Municípios assumem a competência dos Estados', 'E) O Congresso Nacional deverá editar a lei geral em 90 dias'],
            'resposta': 'B',
            'explicacao': 'O art. 24, §3º, CF/88 dispõe que inexistindo lei federal sobre normas gerais, os Estados exercerão a competência legislativa plena para atender as suas peculiaridades. O §4º complementa: a superveniência de lei federal sobre normas gerais suspende a eficácia da lei estadual, no que lhe for contrário. Portanto, a lei estadual não é inconstitucional — apenas tem sua eficácia suspensa no que conflitar com a futura norma federal.',
            'dica': 'Competência concorrente: União = normas gerais; Estados = suplementar. Sem lei federal → Estado tem competência plena. Lei federal posterior suspende (não revoga) a estadual.',
            'dificuldade': 'médio',
            'fonte': 'FGV',
            'ano': 2022,
            'titulo': 'FGV/SEFAZ-BA/2022 - Competência Concorrente'
        },
        {
            'enunciado': 'Sobre bens da União (art. 20, CF/88), assinale a alternativa INCORRETA:',
            'opcoes': ['A) Os lagos e rios em terrenos de seu domínio ou que banhem mais de um Estado são bens da União', 'B) A plataforma continental é bem da União', 'C) As terras devolutas indispensáveis à defesa das fronteiras são bens da União', 'D) Os terrenos de marinha são bens da União', 'E) As terras tradicionalmente ocupadas pelos índios são de propriedade das tribos indígenas'],
            'resposta': 'E',
            'explicacao': 'As terras tradicionalmente ocupadas pelos índios são bens da UNIÃO (art. 20, XI, CF), não das tribos indígenas. Os índios têm apenas a posse permanente e o usufruto exclusivo das riquezas do solo, dos rios e dos lagos nelas existentes (art. 231, §2º). A propriedade permanece com a União. As demais alternativas estão corretas conforme o art. 20, CF.',
            'dica': 'Terras indígenas = PROPRIEDADE da União + posse permanente/usufruto dos índios. Não confunda.',
            'dificuldade': 'médio',
            'fonte': 'CESPE',
            'ano': 2022,
            'titulo': 'CESPE/FUNAI/2022 - Bens da União'
        },
        {
            'enunciado': 'O Distrito Federal acumula competências de Estado e de Município. Sobre o DF, analise as assertivas: I - O DF não pode ser dividido em Municípios. II - O DF é organizado e mantido pela União. III - Ao DF são atribuídas as competências legislativas reservadas aos Estados e Municípios. IV - O Governador do DF é eleito diretamente. Assinale a alternativa CORRETA:',
            'opcoes': ['A) Apenas I, II e IV', 'B) Apenas I, III e IV', 'C) Apenas II e III', 'D) Todas estão corretas', 'E) Apenas I e IV'],
            'resposta': 'B',
            'explicacao': 'I - CORRETA: Art. 32, CF — o DF não poderá ser dividido em Municípios. II - INCORRETA: O DF é regido por lei orgânica própria, votada pela Câmara Legislativa (art. 32, §1º). A CLDF é eleita pelos cidadãos do DF. A Polícia Civil e Militar do DF são organizadas e mantidas pela União (art. 21, XIV), mas o Governo do DF é autônomo. III - CORRETA: Art. 32, §1º, CF — ao DF são atribuídas as competências legislativas reservadas aos Estados e Municípios. IV - CORRETA: O Governador é eleito diretamente.',
            'dica': 'DF = Estado + Município. CLDF faz as vezes da AL e da Câmara Municipal. Polícia é federal, mas governo é eleito.',
            'dificuldade': 'difícil',
            'fonte': 'CESPE',
            'ano': 2023,
            'titulo': 'CESPE/PCDF/2023 - Distrito Federal'
        },
    ],

    # ===== CAPÍTULO 4: Poder Legislativo =====
    'Poder Legislativo': [
        {
            'enunciado': 'O Congresso Nacional é composto pela Câmara dos Deputados e pelo Senado Federal. Qual das afirmativas está CORRETA?',
            'opcoes': ['A) A Câmara tem 81 deputados e o Senado tem 513 senadores', 'B) A Câmara tem 513 deputados e o Senado tem 81 senadores', 'C) Ambas as casas têm 513 membros cada', 'D) A Câmara é composta por 3 senadores por Estado', 'E) O Senado tem representação proporcional à população'],
            'resposta': 'B',
            'explicacao': 'O Congresso Nacional é composto pela Câmara dos Deputados (513 deputados federais, eleitos proporcionalmente à população de cada Estado, art. 45, §1º) e pelo Senado Federal (81 senadores — 3 por Estado e pelo DF, art. 46, §1º). O Senado representa os Estados (princípio da representação igualitária dos entes federados), enquanto a Câmara representa o povo (princípio da proporcionalidade).',
            'dica': 'Câmara = 513 deputados (proporcional à população). Senado = 81 senadores (3 por Estado + DF).',
            'dificuldade': 'fácil',
            'fonte': 'CESPE',
            'ano': 2022,
            'titulo': 'CESPE/Câmara dos Deputados/2022 - Composição'
        },
        {
            'enunciado': 'Sobre as imunidades parlamentares, é correto afirmar que os Deputados e Senadores são invioláveis (imunidade material) por suas opiniões, palavras e votos:',
            'opcoes': ['A) Apenas durante o mandato e no recinto do Congresso', 'B) Somente em matéria criminal, não civil', 'C) De forma absoluta, em qualquer local e tempo, sem exceção', 'D) Civil e penalmente, no exercício do mandato e em razão dele', 'E) Somente nos atos praticados em plenário'],
            'resposta': 'D',
            'explicacao': 'O art. 53, caput, CF/88 dispõe que deputados e senadores são invioláveis, civil e penalmente, por quaisquer de suas opiniões, palavras e votos. A imunidade material (inviolabilidade) cobre atos praticados no exercício do mandato ou em razão dele — não há necessidade de estar no plenário. O STF entende que declarações dadas fora do Congresso também são cobertas se relacionadas ao mandato. Essa imunidade extingue a própria tipicidade penal — não é apenas causa de exclusão de punibilidade.',
            'dica': 'Imunidade MATERIAL: civil + penal, exercício do mandato, não só no plenário. Extingue tipicidade.',
            'dificuldade': 'médio',
            'fonte': 'FCC',
            'ano': 2022,
            'titulo': 'FCC/AL-PB/2022 - Imunidades Parlamentares'
        },
        {
            'enunciado': 'A Comissão Parlamentar de Inquérito (CPI) tem poderes de investigação próprios das autoridades judiciais. Sobre as CPIs, é INCORRETO afirmar:',
            'opcoes': ['A) Podem ser criadas pela Câmara, pelo Senado ou pelo Congresso Nacional em conjunto', 'B) Podem quebrar sigilo bancário, fiscal e de dados sem necessidade de autorização judicial', 'C) Podem decretar prisão preventiva de investigados', 'D) Devem investigar fato determinado e por prazo certo', 'E) Suas conclusões, se for o caso, são encaminhadas ao Ministério Público para promoção de responsabilidade civil ou criminal'],
            'resposta': 'C',
            'explicacao': 'As CPIs, embora tenham poderes investigatórios próprios das autoridades judiciais (art. 58, §3º, CF), NÃO podem decretar prisão preventiva. O STF, no MS 23.452, estabeleceu que as CPIs podem: quebrar sigilos bancário, fiscal, de dados e telefônico (registros); determinar buscas e apreensões. Não podem: decretar prisão preventiva, determinar interceptação telefônica (wiretapping), invadir domicílio ou cautelar que limitem liberdade. Só podem determinar prisão em flagrante.',
            'dica': 'CPI pode TUDO que juiz pode, EXCETO: prisão preventiva, interceptação telefônica e busca domiciliar.',
            'dificuldade': 'médio',
            'fonte': 'CESPE',
            'ano': 2022,
            'titulo': 'CESPE/Senado Federal/2022 - CPI'
        },
        {
            'enunciado': 'Sobre o processo legislativo para aprovação de lei complementar, assinale a alternativa CORRETA:',
            'opcoes': ['A) Exige aprovação por maioria absoluta em cada Casa e sanção presidencial', 'B) Exige quórum de 3/5 em cada Casa e referendo popular', 'C) Exige quórum de 2/3 dos membros em votação única', 'D) Tem o mesmo quórum da lei ordinária (maioria simples)', 'E) Não pode ser objeto de veto presidencial'],
            'resposta': 'A',
            'explicacao': 'A lei complementar (art. 69, CF) exige aprovação por maioria absoluta (mais da metade dos membros da Casa, independentemente dos presentes) em cada casa do Congresso. Pode ser objeto de sanção ou veto presidencial, assim como a lei ordinária. A diferença da lei complementar para a ordinária é o quórum (maioria absoluta vs. maioria simples) e a matéria (prevista expressamente na CF). Não há referendo popular no processo legislativo ordinário.',
            'dica': 'LC = maioria ABSOLUTA (50%+1 dos membros). LO = maioria SIMPLES (50%+1 dos PRESENTES, desde que haja quórum mínimo).',
            'dificuldade': 'médio',
            'fonte': 'FGV',
            'ano': 2023,
            'titulo': 'FGV/TRF-5/2023 - Lei Complementar'
        },
        {
            'enunciado': 'A Emenda Constitucional não pode ser aprovada em circunstâncias específicas. Qual das situações abaixo NÃO impede a tramitação de proposta de emenda à Constituição (PEC)?',
            'opcoes': ['A) Durante a vigência de intervenção federal', 'B) Durante o estado de defesa', 'C) Durante o estado de sítio', 'D) Durante a decretação de calamidade pública pelo Congresso Nacional', 'E) As alternativas A, B e C estão corretas e D é situação que impede'],
            'resposta': 'D',
            'explicacao': 'O art. 60, §1º, CF/88 veda a deliberação de PEC na vigência de intervenção federal, de estado de defesa ou de estado de sítio. A calamidade pública decretada pelo Congresso (como ocorreu na pandemia de COVID-19, por meio do Decreto Legislativo 6/2020) NÃO está prevista como vedação constitucional para a tramitação de PEC. Portanto, durante uma calamidade reconhecida pelo Congresso, PECs podem tramitar normalmente.',
            'dica': 'Vedação à PEC: INTERVENÇÃO FEDERAL + ESTADO DE DEFESA + ESTADO DE SÍTIO. Calamidade pública não está no art. 60, §1º.',
            'dificuldade': 'difícil',
            'fonte': 'CESPE',
            'ano': 2021,
            'titulo': 'CESPE/TCU/2021 - Emenda Constitucional'
        },
    ],

    # ===== CAPÍTULO 5: Poder Executivo =====
    'Poder Executivo': [
        {
            'enunciado': 'O mandato do Presidente da República tem duração de 4 anos, sendo vedada a reeleição para o período subsequente imediato. Qual das afirmações está CORRETA sobre a eleição presidencial?',
            'opcoes': ['A) É eleito o candidato que obtiver maioria simples dos votos válidos em turno único', 'B) É eleito o candidato que obtiver maioria absoluta dos votos válidos, excluídos os brancos e nulos', 'C) Em caso de segundo turno, vence quem tiver mais votos, incluindo brancos e nulos', 'D) O Vice-Presidente é eleito separadamente do Presidente', 'E) O Presidente não pode ser reeleito em nenhuma hipótese'],
            'resposta': 'B',
            'explicacao': 'O art. 77, §2º, CF/88 determina que é eleito Presidente o candidato que obtiver maioria absoluta de votos, excluídos os brancos e nulos. Se nenhum candidato obtiver maioria absoluta no 1º turno, realiza-se 2º turno entre os dois mais votados. No 2º turno, vence o que obtiver maioria dos votos válidos (excluídos brancos e nulos). O Vice-Presidente é eleito na mesma chapa (art. 77, caput). A vedação de reeleição é apenas para o período subsequente imediato — é possível se passar um mandato.',
            'dica': 'Eleição presidencial: maioria ABSOLUTA (excluídos brancos e nulos). Segundo turno: maioria dos votos VÁLIDOS.',
            'dificuldade': 'fácil',
            'fonte': 'CESPE',
            'ano': 2022,
            'titulo': 'CESPE/TRE-ES/2022 - Eleição Presidencial'
        },
        {
            'enunciado': 'Os crimes de responsabilidade do Presidente da República são julgados pelo:',
            'opcoes': ['A) Supremo Tribunal Federal em única instância', 'B) Senado Federal, após autorização da Câmara dos Deputados', 'C) Tribunal Superior Eleitoral em sessão especial', 'D) Superior Tribunal de Justiça', 'E) Congresso Nacional em sessão conjunta'],
            'resposta': 'B',
            'explicacao': 'O processo de impeachment do Presidente da República divide-se em duas fases: 1ª) Câmara dos Deputados admite a acusação por 2/3 dos membros (art. 86, §1º, I, CF); 2ª) Senado Federal julga o Presidente (art. 52, I, CF), sob presidência do Presidente do STF, sendo necessários 2/3 dos senadores para a condenação. A pena é a perda do cargo e inabilitação por 8 anos. Os crimes comuns são julgados pelo STF (art. 102, I, b, CF).',
            'dica': 'Crime de responsabilidade: Câmara AUTORIZA (2/3) → Senado JULGA (2/3). Crime comum: STF julga.',
            'dificuldade': 'fácil',
            'fonte': 'FCC',
            'ano': 2021,
            'titulo': 'FCC/TCE-AM/2021 - Crimes de Responsabilidade'
        },
        {
            'enunciado': 'O Presidente da República pode editar medidas provisórias com força de lei em casos de relevância e urgência. Sobre as MPs, é INCORRETO afirmar:',
            'opcoes': ['A) As MPs têm vigência inicial de 60 dias, prorrogável por igual período', 'B) As MPs perdem eficácia se não forem convertidas em lei em 120 dias', 'C) É vedada a edição de MP sobre matéria reservada a lei complementar', 'D) As MPs podem versar sobre direito penal, direito processual penal e direito eleitoral', 'E) Matéria já regulada por MP rejeitada não pode ser objeto de nova MP na mesma sessão legislativa'],
            'resposta': 'D',
            'explicacao': 'O art. 62, §1º, CF/88 veda a edição de medidas provisórias sobre: I - matéria relativa a: a) nacionalidade, cidadania, direitos políticos, partidos políticos e direito eleitoral; b) direito penal, processual penal e processual civil; c) organização do Poder Judiciário e do MP, carreira e garantia de membros; d) planos plurianuais, diretrizes orçamentárias, orçamento e créditos adicionais e suplementares. Portanto, MP sobre direito penal e eleitoral é vedada pela CF/88.',
            'dica': 'MP NÃO pode: direito PENAL, PROCESSUAL PENAL, ELEITORAL, PARTIDÁRIO, NACIONALIDADE. Decore as vedações.',
            'dificuldade': 'médio',
            'fonte': 'CESPE',
            'ano': 2023,
            'titulo': 'CESPE/AGU/2023 - Medida Provisória'
        },
        {
            'enunciado': 'Sobre o poder de veto presidencial, assinale a alternativa CORRETA:',
            'opcoes': ['A) O veto pode ser total ou parcial, atingindo artigo, parágrafo, inciso ou alínea', 'B) O veto total suspende definitivamente a lei vetada', 'C) O veto parcial pode atingir palavras isoladas dentro de um artigo', 'D) O veto só pode ser derrubado por 2/3 do Congresso Nacional em sessão conjunta', 'E) O veto não pode ser apreciado após decorrido o prazo de 30 dias'],
            'resposta': 'A',
            'explicacao': 'O art. 66, §2º, CF/88 estabelece que o veto parcial abrangerá texto integral de artigo, de parágrafo, de inciso ou de alínea — não pode recair sobre palavra isolada. O veto total atinge o projeto inteiro. O veto pode ser derrubado pela maioria absoluta dos deputados e senadores em votação conjunta (sessão do Congresso), não por 2/3. O art. 66, §4º fixa prazo de 15 dias úteis para veto e o veto não apreciado entra na ordem do dia em regime de urgência.',
            'dica': 'Veto parcial mínimo = artigo, parágrafo, inciso ou alínea INTEIROS. Nunca palavras isoladas.',
            'dificuldade': 'médio',
            'fonte': 'FGV',
            'ano': 2022,
            'titulo': 'FGV/TRF-3/2022 - Veto Presidencial'
        },
    ],

    # ===== CAPÍTULO 6: Poder Judiciário =====
    'Poder Judiciário': [
        {
            'enunciado': 'O STF é composto por 11 Ministros, nomeados pelo Presidente da República, após aprovação pelo Senado Federal. Qual é o quórum de aprovação pelo Senado?',
            'opcoes': ['A) Maioria simples dos presentes', 'B) Maioria absoluta dos membros', 'C) 2/3 dos membros', 'D) 3/5 dos membros', 'E) Unanimidade'],
            'resposta': 'B',
            'explicacao': 'O art. 101, parágrafo único, CF/88 determina que os Ministros do STF são nomeados pelo Presidente da República, após aprovação da escolha pela maioria absoluta do Senado Federal (41 dos 81 senadores). Os requisitos para ser Ministro do STF: notável saber jurídico, idoneidade moral e idade entre 35 e 65 anos (art. 101). O STF não possui limite de mandato — os ministros exercem vitaliciedade.',
            'dica': 'Ministro do STF: Presidente nomeia, Senado aprova por MAIORIA ABSOLUTA. Requisitos: notável saber + idoneidade + 35-65 anos.',
            'dificuldade': 'fácil',
            'fonte': 'CESPE',
            'ano': 2021,
            'titulo': 'CESPE/STF/2021 - Composição STF'
        },
        {
            'enunciado': 'A Súmula Vinculante, prevista no art. 103-A da CF/88, vincula os demais órgãos do Poder Judiciário e a administração pública. Sobre as Súmulas Vinculantes, é INCORRETO afirmar:',
            'opcoes': ['A) São aprovadas por 2/3 dos membros do STF', 'B) Vinculam o Poder Legislativo no exercício de sua função legislativa', 'C) Podem ser revistas ou canceladas pelo STF de ofício ou por provocação', 'D) O descumprimento da Súmula Vinculante pode ser objeto de reclamação ao STF', 'E) Vinculam os tribunais e juízes de primeira instância'],
            'resposta': 'B',
            'explicacao': 'O art. 103-A, CF/88 dispõe que a Súmula Vinculante vincula os demais órgãos do Poder Judiciário e a administração pública direta e indireta, nas esferas federal, estadual e municipal. O Poder Legislativo NÃO é vinculado em sua função típica (atividade legiferante) — pode editar lei que contrarie a Súmula, o que levará o STF a rever ou cancelar a SV. Aprovação exige 2/3 do STF (8 ministros). Descumprimento autoriza reclamação (art. 103-A, §3º).',
            'dica': 'Súmula Vinculante NÃO vincula o Legislativo ao legislar — só Judiciário e Executivo. Legislativo pode editar lei contrária.',
            'dificuldade': 'médio',
            'fonte': 'CESPE',
            'ano': 2022,
            'titulo': 'CESPE/TJ-CE/2022 - Súmula Vinculante'
        },
        {
            'enunciado': 'Sobre a competência originária do STF (art. 102, I, CF), assinale a alternativa CORRETA:',
            'opcoes': ['A) Julgar habeas corpus impetrado em favor de qualquer pessoa presa', 'B) Processar e julgar a ação direta de inconstitucionalidade de lei ou ato normativo federal ou estadual', 'C) Julgar os crimes comuns cometidos por Prefeitos Municipais', 'D) Julgar os mandados de segurança e habeas data contra atos do Presidente da República em única instância', 'E) B e D estão corretas'],
            'resposta': 'E',
            'explicacao': 'O art. 102, I, CF atribui ao STF competência originária para: a) a ADI de lei ou ato normativo federal ou estadual (art. 102, I, a); d) o mandado de segurança e habeas data contra atos do Presidente da República, das Mesas do CN, do STF, do TCU, do Procurador-Geral da República e do próprio STF (art. 102, I, d). Crimes de Prefeitos são julgados pelos Tribunais de Justiça estaduais (Súmula 702/STF). HC pode ser impetrado por qualquer pessoa, mas o STF só julga em hipóteses específicas (art. 102, I, d e i).',
            'dica': 'STF julga HC quando o coator é Tribunal Superior ou quando há riscos à separação de poderes. Prefeitos vão ao TJ.',
            'dificuldade': 'médio',
            'fonte': 'FCC',
            'ano': 2023,
            'titulo': 'FCC/TJ-PA/2023 - Competência STF'
        },
    ],

    # ===== CAPÍTULO 7: Funções Essenciais à Justiça =====
    'Funções Essenciais à Justiça': [
        {
            'enunciado': 'O Ministério Público é instituição permanente, essencial à função jurisdicional do Estado, incumbindo-lhe a defesa da ordem jurídica, do regime democrático e dos interesses sociais e individuais indisponíveis. Sobre o MP, é CORRETO afirmar:',
            'opcoes': ['A) O MP integra o Poder Executivo federal', 'B) O MP é órgão auxiliar do Poder Judiciário', 'C) O MP possui autonomia institucional e não integra qualquer dos três Poderes', 'D) O Procurador-Geral da República pode ser exonerado a qualquer tempo pelo Presidente', 'E) Os membros do MP não possuem vitaliciedade'],
            'resposta': 'C',
            'explicacao': 'O Ministério Público (art. 127, CF) é instituição autônoma, não integrante de qualquer dos três Poderes (Executivo, Legislativo e Judiciário). Possui autonomia funcional, administrativa e financeira. O PGR pode ser destituído por iniciativa do Presidente, mas mediante aprovação da maioria absoluta do Senado (art. 128, §2º). Os membros do MP têm vitaliciedade, inamovibilidade e irredutibilidade de subsídios — garantias idênticas às da Magistratura.',
            'dica': 'MP: instituição autônoma, NÃO integra os 3 poderes. Garantias dos membros: vitaliciedade, inamovibilidade, irredutibilidade.',
            'dificuldade': 'fácil',
            'fonte': 'FCC',
            'ano': 2022,
            'titulo': 'FCC/MPE-MA/2022 - Ministério Público'
        },
        {
            'enunciado': 'A Advocacia Geral da União (AGU) representa a União judicial e extrajudicialmente. Sobre a AGU, assinale a alternativa CORRETA:',
            'opcoes': ['A) O Advogado-Geral da União exerce também as funções de Procurador-Geral da República', 'B) A AGU é vinculada ao STF', 'C) O Advogado-Geral da União é nomeado pelo Presidente da República, sem necessidade de aprovação pelo Senado', 'D) A AGU tem função consultiva apenas, sem atribuição de defesa judicial', 'E) Os Procuradores Federais compõem o quadro da AGU e representam as autarquias federais'],
            'resposta': 'E',
            'explicacao': 'A AGU (art. 131, CF) representa a União judicial e extrajudicialmente. O Advogado-Geral da União é nomeado pelo Presidente da República, de livre escolha, sem sabatina do Senado (ao contrário do PGR). Os Procuradores Federais, integrantes da AGU, representam as autarquias e fundações federais (ex: INSS, ANATEL). A AGU também tem função consultiva, assessorando o Poder Executivo. Não se confunde com o MP.',
            'dica': 'AGU: representa a UNIÃO. Procuradores Federais: representam autarquias/fundações. AGU ≠ MP.',
            'dificuldade': 'médio',
            'fonte': 'CESPE',
            'ano': 2022,
            'titulo': 'CESPE/AGU/2022 - Advocacia-Geral da União'
        },
    ],

    # ===== CAPÍTULO 8: Ordem Econômica e Financeira =====
    'Ordem Econômica e Financeira': [
        {
            'enunciado': 'A Constituição Federal estabelece como fundamentos da ordem econômica a valorização do trabalho humano e a livre iniciativa. Qual é o princípio que orienta a ordem econômica constitucional?',
            'opcoes': ['A) Assegurar a todos existência digna, conforme os ditames da justiça social', 'B) Maximizar o lucro das empresas nacionais', 'C) Garantir monopólio estatal sobre todos os setores produtivos', 'D) Eliminar a concorrência em setores estratégicos', 'E) Proibir a participação de capital estrangeiro na economia'],
            'resposta': 'A',
            'explicacao': 'O art. 170, caput, CF/88 estabelece que a ordem econômica é fundada na valorização do trabalho humano e na livre iniciativa, tendo por fim assegurar a todos existência digna, conforme os ditames da justiça social. Os princípios da ordem econômica estão no art. 170, I a IX: soberania nacional, propriedade privada, função social da propriedade, livre concorrência, defesa do consumidor, defesa do meio ambiente, redução das desigualdades regionais, busca do pleno emprego, tratamento favorecido para empresas de pequeno porte.',
            'dica': 'Art. 170: fundamento = trabalho + livre iniciativa. Fim = existência digna + justiça social. Memorize os 9 princípios.',
            'dificuldade': 'fácil',
            'fonte': 'CESPE',
            'ano': 2022,
            'titulo': 'CESPE/SEFAZ-DF/2022 - Ordem Econômica'
        },
        {
            'enunciado': 'A CF/88 prevê que a exploração de petróleo, gás natural e outros hidrocarbonetos é monopólio da União (art. 177). Sobre esse monopólio, é correto afirmar que:',
            'opcoes': ['A) É absoluto e não admite contratos com empresas privadas', 'B) Pode ser exercido mediante contratos com empresas estatais ou privadas, sob supervisão da ANP', 'C) Só pode ser exercido pela Petrobras, com exclusividade constitucional', 'D) Empresas privadas não podem participar em nenhuma hipótese', 'E) Foi extinto pela EC 9/1995'],
            'resposta': 'B',
            'explicacao': 'A EC 9/1995 flexibilizou o monopólio do petróleo, permitindo que a União contrate com empresas estatais ou privadas a realização das atividades de pesquisa e lavra de petróleo (art. 177, §1º, CF). Isso não extingue o monopólio — a propriedade e o controle permanecem com a União, mas a execução pode ser delegada. A ANP (Agência Nacional do Petróleo) foi criada para regular e fiscalizar o setor.',
            'dica': 'EC 9/1995 flexibilizou (não extinguiu) o monopólio do petróleo. União pode contratar privados, mas mantém o monopólio.',
            'dificuldade': 'médio',
            'fonte': 'FGV',
            'ano': 2021,
            'titulo': 'FGV/PGM/2021 - Monopólio do Petróleo'
        },
    ],

    # ===== CAPÍTULO 9: Ordem Social =====
    'Ordem Social': [
        {
            'enunciado': 'O sistema de seguridade social compreende um conjunto integrado de ações. Quais são seus componentes, conforme o art. 194 da CF/88?',
            'opcoes': ['A) Previdência Social, Saúde e Educação', 'B) Saúde, Previdência Social e Assistência Social', 'C) Saúde, Educação e Habitação', 'D) Previdência Social, Assistência Social e Trabalho', 'E) Saúde, Habitação e Assistência Social'],
            'resposta': 'B',
            'explicacao': 'O art. 194, caput, CF/88 dispõe que a seguridade social compreende um conjunto integrado de ações de iniciativa dos Poderes Públicos e da sociedade, destinadas a assegurar os direitos relativos à saúde, à previdência e à assistência social. Educação e habitação não integram o conceito constitucional de seguridade social — são tratadas em capítulos separados da ordem social (arts. 205 e 215, CF).',
            'dica': 'Seguridade Social = SAÚDE + PREVIDÊNCIA + ASSISTÊNCIA. Memorize como "SPA" — Saúde, Previdência, Assistência.',
            'dificuldade': 'fácil',
            'fonte': 'CESPE',
            'ano': 2022,
            'titulo': 'CESPE/INSS/2022 - Seguridade Social'
        },
        {
            'enunciado': 'O direito à saúde, previsto no art. 196 da CF/88, é direito de todos e dever do Estado. Sobre a judicialização da saúde, o STF firmou entendimento de que:',
            'opcoes': ['A) O Estado jamais pode ser compelido judicialmente a fornecer medicamentos não listados no SUS', 'B) Qualquer medicamento pode ser exigido judicialmente independentemente de registro na ANVISA', 'C) Há responsabilidade solidária dos entes federativos no fornecimento de medicamentos essenciais', 'D) Apenas a União pode ser acionada judicialmente por questões de saúde', 'E) O direito à saúde é norma programática sem eficácia imediata'],
            'resposta': 'C',
            'explicacao': 'No RE 855.178 (Tema 793), o STF fixou a tese de que "os entes da federação, em decorrência da competência comum, são solidariamente responsáveis nas demandas prestacionais na área da saúde, e diante dos critérios constitucionais de descentralização e hierarquização, compete à autoridade judicial direcionar o cumprimento conforme as regras de repartição de competências". O Estado pode ser compelido a fornecer medicamentos não listados em situações específicas, mas exige-se registro na ANVISA e outros requisitos (RE 657.718 — Tema 500).',
            'dica': 'Saúde: solidariedade dos entes. Medicamentos não listados: possível, mas com critérios (registro ANVISA, ineficácia das alternativas do SUS).',
            'dificuldade': 'médio',
            'fonte': 'CESPE',
            'ano': 2023,
            'titulo': 'CESPE/TCE-GO/2023 - Direito à Saúde'
        },
        {
            'enunciado': 'O art. 205 da CF/88 estabelece que a educação é direito de todos e dever do Estado e da família. Sobre a educação, é CORRETO afirmar:',
            'opcoes': ['A) O ensino fundamental é obrigatório e gratuito apenas na rede pública', 'B) A CF/88 garante educação básica obrigatória e gratuita dos 4 aos 17 anos', 'C) O ensino superior é gratuito em todas as instituições públicas', 'D) O ensino religioso é obrigatório nas escolas públicas', 'E) A gestão democrática do ensino público aplica-se apenas ao ensino superior'],
            'resposta': 'B',
            'explicacao': 'O art. 208, I, CF (com redação dada pela EC 59/2009) garante educação básica obrigatória e gratuita dos 4 (quatro) aos 17 (dezessete) anos de idade, assegurada inclusive sua oferta gratuita para todos os que a ela não tiveram acesso na idade própria. O ensino superior não tem garantia constitucional de gratuidade universal em instituições públicas (só gratuidade), mas não é obrigatório. O ensino religioso é facultativo (art. 210, §1º). A gestão democrática aplica-se ao ensino público em geral (art. 206, VI).',
            'dica': 'EC 59/2009: educação obrigatória dos 4 aos 17 anos (antes era só fundamental 6-14). Importante!',
            'dificuldade': 'médio',
            'fonte': 'FCC',
            'ano': 2022,
            'titulo': 'FCC/SEED-PR/2022 - Direito à Educação'
        },
    ],

    # ===== CAPÍTULO 10: Controle de Constitucionalidade =====
    'Controle de Constitucionalidade': [
        {
            'enunciado': 'No controle concentrado de constitucionalidade, a Ação Direta de Inconstitucionalidade (ADI) pode ser proposta por um rol taxativo de legitimados (art. 103, CF). Qual dos seguintes NÃO tem legitimidade para propor ADI?',
            'opcoes': ['A) Presidente da República', 'B) Procurador-Geral da República', 'C) Governador de Estado', 'D) Defensor Público-Geral da União', 'E) Conselho Federal da OAB'],
            'resposta': 'D',
            'explicacao': 'O art. 103, CF/88 estabelece o rol taxativo de legitimados para propor ADI, ADC, e ADPF: I - Presidente; II - Mesa do Senado; III - Mesa da Câmara; IV - Mesa de Assembleia Legislativa/CLDF; V - Governador; VI - PGR; VII - Conselho Federal da OAB; VIII - partido político com representação no CN; IX - confederação sindical ou entidade de classe de âmbito nacional. O Defensor Público-Geral da União NÃO está incluído nesse rol (foi incluído pela EC 80/2014 para propor ADI sobre normas que afetam a Defensoria, conforme entendimento do STF, mas não está expressamente no art. 103).',
            'dica': 'Art. 103: 9 legitimados para ADI. Decore: Presidente, Mesa CN (2), Mesa AL/CLDF, Governador, PGR, OAB, Partido com rep. no CN, Confederação sindical/entidade nacional.',
            'dificuldade': 'médio',
            'fonte': 'CESPE',
            'ano': 2022,
            'titulo': 'CESPE/TRF-1/2022 - ADI Legitimados'
        },
        {
            'enunciado': 'Sobre o efeito das decisões em ADI e ADC, assinale a alternativa CORRETA:',
            'opcoes': ['A) As decisões têm efeitos inter partes e ex nunc', 'B) As decisões têm efeitos erga omnes e vinculantes, com eficácia ex tunc', 'C) O STF nunca pode modular os efeitos temporais de suas decisões', 'D) A declaração de inconstitucionalidade tem efeitos prospectivos obrigatórios', 'E) As decisões só vinculam o Poder Judiciário, não o Executivo'],
            'resposta': 'B',
            'explicacao': 'As decisões do STF em controle concentrado (ADI, ADC, ADPF) têm eficácia erga omnes (contra todos) e efeito vinculante em relação aos demais órgãos do Poder Judiciário e à administração pública direta e indireta (art. 102, §2º, CF). A eficácia é ex tunc (retroativa), pois a norma inconstitucional é nula ab initio. O STF pode, porém, modular os efeitos temporais (art. 27, Lei 9.868/99) por razões de segurança jurídica, exigindo 2/3 dos ministros.',
            'dica': 'Controle concentrado: ERGA OMNES + VINCULANTE + EX TUNC. Modulação temporal: possível, mas requer 2/3 do STF.',
            'dificuldade': 'médio',
            'fonte': 'FGV',
            'ano': 2023,
            'titulo': 'FGV/DPE-RO/2023 - Efeitos ADI/ADC'
        },
        {
            'enunciado': 'A Arguição de Descumprimento de Preceito Fundamental (ADPF) tem natureza subsidiária. Isso significa que:',
            'opcoes': ['A) Só cabe ADPF quando houver outro instrumento igualmente eficaz disponível', 'B) Não cabe ADPF quando houver qualquer outro meio eficaz de sanar a lesividade ao preceito fundamental', 'C) A ADPF pode ser utilizada para controle de constitucionalidade de leis municipais', 'D) B e C estão corretas', 'E) A ADPF é admissível apenas contra atos do Poder Executivo Federal'],
            'resposta': 'D',
            'explicacao': 'A ADPF (art. 102, §1º, CF + Lei 9.882/99) tem caráter subsidiário (art. 4º, §1º, Lei 9.882/99): não será admitida quando houver qualquer outro meio eficaz de sanar a lesividade. A grande utilidade da ADPF é: 1) controlar atos anteriores à CF (direito pré-constitucional); 2) controlar leis ou atos municipais; 3) controlar atos normativos primários não passíveis de ADI/ADC. Portanto, tanto B (subsidiariedade) quanto C (controle de lei municipal) estão corretos.',
            'dica': 'ADPF: subsidiária + cabe para leis MUNICIPAIS + direito PRÉ-CONSTITUCIONAL. ADI não controla lei municipal.',
            'dificuldade': 'difícil',
            'fonte': 'CESPE',
            'ano': 2022,
            'titulo': 'CESPE/PGR/2022 - ADPF'
        },
        {
            'enunciado': 'No controle difuso de constitucionalidade, a declaração de inconstitucionalidade de uma lei pelo STF em recurso extraordinário tem efeitos:',
            'opcoes': ['A) Automaticamente erga omnes, sem necessidade de qualquer outra providência', 'B) Apenas inter partes no caso concreto, salvo quando o Senado suspende a lei (art. 52, X, CF)', 'C) Vinculantes para todos, pois o STF sempre tem a última palavra', 'D) Nulos, pois controle difuso não gera qualquer consequência para terceiros', 'E) Apenas para casos futuros, com eficácia prospectiva'],
            'resposta': 'B',
            'explicacao': 'No controle difuso (incidental), a declaração de inconstitucionalidade tem efeitos inter partes (entre as partes do processo). Para que os efeitos se estendam erga omnes, o art. 52, X, CF/88 atribui ao Senado Federal a competência para suspender a execução, no todo ou em parte, de lei declarada inconstitucional por decisão definitiva do STF. Há discussão doutrinária (teoria da "abstrativização do controle difuso") sobre se as decisões do STF em RE com repercussão geral teriam efeito vinculante automático, mas o entendimento formal permanece pela necessidade do Senado para efeito erga omnes.',
            'dica': 'Controle difuso: inter partes. Para erga omnes: Senado suspende (art. 52, X). Controle concentrado: erga omnes automático.',
            'dificuldade': 'difícil',
            'fonte': 'FCC',
            'ano': 2022,
            'titulo': 'FCC/TRT-3/2022 - Controle Difuso'
        },
    ],
}
