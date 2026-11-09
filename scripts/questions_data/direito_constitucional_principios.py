"""
Direito Constitucional — Princípios Fundamentais e Direitos
30 questões cobrindo 3 capítulos
"""

CAPITULOS = [
    {
        'numero': 1,
        'titulo': 'Princípios Fundamentais e Aplicação das Normas Constitucionais',
        'descricao': 'Estudo dos arts. 1º a 4º da CF/88, fundamentos e objetivos da República, princípios das relações internacionais, supremacia constitucional, hermenêutica e teoria da eficácia das normas constitucionais segundo José Afonso da Silva.'
    },
    {
        'numero': 2,
        'titulo': 'Direitos e Garantias Fundamentais',
        'descricao': 'Análise do art. 5º da CF/88: direitos individuais e coletivos, remédios constitucionais (HC, HD, MS, MI, ação popular), eficácia horizontal e vertical dos direitos fundamentais, restrições legítimas e jurisprudência recente do STF.'
    },
    {
        'numero': 3,
        'titulo': 'Aplicabilidade das Normas Constitucionais',
        'descricao': 'Classificação das normas constitucionais quanto à eficácia (plena, contida e limitada — José Afonso da Silva), limites ao poder de reforma constitucional, cláusulas pétreas, mutação constitucional e bloco de constitucionalidade.'
    },
]

QUESTOES = {
    'Princípios Fundamentais e Aplicação das Normas Constitucionais': [
        {
            'enunciado': 'Sobre os fundamentos da República Federativa do Brasil, previstos no art. 1º da CF/88, assinale a alternativa correta.',
            'opcoes': [
                'A) A soberania, a cidadania e a dignidade da pessoa humana são objetivos fundamentais da República.',
                'B) O pluralismo político e os valores sociais do trabalho e da livre iniciativa são fundamentos da República.',
                'C) A construção de uma sociedade livre, justa e solidária é fundamento, e não objetivo, da República.',
                'D) A independência nacional é princípio que rege as relações internacionais e também fundamento da República.',
                'E) A erradicação da pobreza é fundamento expresso no art. 1º da CF/88.'
            ],
            'resposta': 'B',
            'explicacao': 'O art. 1º da CF/88 elenca como fundamentos da República: soberania, cidadania, dignidade da pessoa humana, valores sociais do trabalho e da livre iniciativa, e pluralismo político (mnemônico SOCIDIVAPLU). A construção de sociedade livre, justa e solidária e a erradicação da pobreza são objetivos (art. 3º), não fundamentos. A independência nacional é princípio das relações internacionais (art. 4º).',
            'dica': 'Mnemônico SOCIDIVAPLU para fundamentos (art. 1º): SOberania, CIdadania, DIgnidade, VAlores sociais do trabalho/livre iniciativa, PLUralismo político.',
            'dificuldade': 'fácil',
            'fonte': 'CESPE',
            'ano': 2023,
            'titulo': 'CESPE/TRF1/2023 - Fundamentos da República'
        },
        {
            'enunciado': 'A Constituição Federal de 1988 estabelece, no art. 3º, os objetivos fundamentais da República. Acerca desses objetivos, julgue: "Promover o bem de todos, sem preconceitos de origem, raça, sexo, cor, idade e quaisquer outras formas de discriminação, é objetivo fundamental da República Federativa do Brasil".',
            'opcoes': ['A) Verdadeiro', 'B) Falso'],
            'resposta': 'A',
            'explicacao': 'O art. 3º, IV, da CF/88 prevê expressamente como objetivo fundamental da República "promover o bem de todos, sem preconceitos de origem, raça, sexo, cor, idade e quaisquer outras formas de discriminação". Trata-se de norma programática que orienta a atuação estatal e fundamenta políticas públicas afirmativas, conforme reconhecido pelo STF no julgamento da ADPF 186 (cotas raciais).',
            'dica': 'Objetivos do art. 3º começam com VERBOS: CONstruir, GArantir, ERradicar, PROmover (CONGAERPRO).',
            'dificuldade': 'fácil',
            'fonte': 'CESPE',
            'ano': 2022,
            'titulo': 'CESPE/PF/2022 - Objetivos Fundamentais'
        },
        {
            'enunciado': 'No tocante aos princípios que regem as relações internacionais do Brasil (art. 4º da CF/88), assinale a alternativa INCORRETA.',
            'opcoes': [
                'A) A prevalência dos direitos humanos é princípio expresso e fundamenta a adesão do Brasil a tratados internacionais de proteção.',
                'B) A concessão de asilo político está prevista no art. 4º como princípio das relações internacionais.',
                'C) A defesa da paz e a solução pacífica dos conflitos são princípios distintos previstos no art. 4º.',
                'D) A República Federativa do Brasil buscará a integração econômica, política, social e cultural dos povos da América Latina.',
                'E) O repúdio ao terrorismo e ao racismo possui status de cláusula pétrea por estar no art. 4º.'
            ],
            'resposta': 'E',
            'explicacao': 'O repúdio ao terrorismo e ao racismo está previsto no art. 4º, VIII, da CF/88, mas o art. 4º NÃO é cláusula pétrea — as cláusulas pétreas estão taxativamente no art. 60, §4º (forma federativa, voto direto/secreto/universal/periódico, separação dos Poderes e direitos e garantias individuais). As demais alternativas reproduzem corretamente o art. 4º. A integração latino-americana consta no parágrafo único do art. 4º.',
            'dica': 'Cláusulas pétreas estão SOMENTE no art. 60, §4º. Princípios das relações internacionais (art. 4º) podem ser modificados por EC.',
            'dificuldade': 'médio',
            'fonte': 'FCC',
            'ano': 2023,
            'titulo': 'FCC/TRT/2023 - Princípios das Relações Internacionais'
        },
        {
            'enunciado': 'Acerca da supremacia da Constituição e da hermenêutica constitucional, julgue: "O princípio da unidade da Constituição impõe ao intérprete o dever de harmonizar as tensões e contradições entre normas constitucionais, afastando a tese de hierarquia entre normas originárias da Constituição".',
            'opcoes': ['A) Verdadeiro', 'B) Falso'],
            'resposta': 'A',
            'explicacao': 'O princípio da unidade da Constituição, formulado por Konrad Hesse, estabelece que a Constituição deve ser interpretada como um todo harmônico, sem hierarquia entre suas normas originárias. O STF reiteradamente afirma a inexistência de normas constitucionais originárias inconstitucionais (ADI 815/DF). Eventuais tensões devem ser resolvidas por ponderação e concordância prática, não por exclusão.',
            'dica': 'Não existe hierarquia entre normas constitucionais ORIGINÁRIAS. Princípios da hermenêutica: unidade, concordância prática, força normativa, máxima efetividade.',
            'dificuldade': 'médio',
            'fonte': 'CESPE',
            'ano': 2024,
            'titulo': 'CESPE/STJ/2024 - Hermenêutica Constitucional'
        },
        {
            'enunciado': 'Sobre a separação dos Poderes prevista no art. 2º da CF/88, é correto afirmar que:',
            'opcoes': [
                'A) Trata-se de princípio absoluto, não admitindo qualquer interferência entre os Poderes.',
                'B) Configura cláusula pétrea, sendo vedada a deliberação de proposta de emenda tendente a aboli-la.',
                'C) A teoria foi originalmente concebida por Aristóteles e aperfeiçoada por John Locke.',
                'D) O sistema brasileiro adota separação rígida, sem mecanismos de freios e contrapesos.',
                'E) O Poder Judiciário não pode exercer função atípica de natureza administrativa.'
            ],
            'resposta': 'B',
            'explicacao': 'A separação dos Poderes é cláusula pétrea expressa no art. 60, §4º, III, da CF/88. A teoria foi sistematizada por Montesquieu (e não Aristóteles, que apenas vislumbrou três funções) em "O Espírito das Leis". O Brasil adota o sistema de freios e contrapesos (checks and balances), com funções típicas e atípicas — o Judiciário, por exemplo, exerce função administrativa (concursos, licitações) e legislativa (regimentos internos).',
            'dica': 'Separação dos Poderes = cláusula pétrea (art. 60, §4º, III). Cada Poder tem função TÍPICA e funções ATÍPICAS.',
            'dificuldade': 'fácil',
            'fonte': 'FGV',
            'ano': 2023,
            'titulo': 'FGV/TJ/2023 - Separação dos Poderes'
        },
        {
            'enunciado': 'Acerca da dignidade da pessoa humana como fundamento da República, julgue: "Segundo entendimento doutrinário e jurisprudencial do STF, a dignidade da pessoa humana possui dupla dimensão: como princípio e como regra, atuando tanto como vetor interpretativo quanto como norma de aplicação direta".',
            'opcoes': ['A) Verdadeiro', 'B) Falso'],
            'resposta': 'A',
            'explicacao': 'A dignidade da pessoa humana, prevista no art. 1º, III, da CF/88, possui natureza dúplice segundo a doutrina (Ingo Sarlet) e o STF: atua como princípio (vetor interpretativo de todo o ordenamento) e também como regra de aplicação imediata em casos de violação direta (ex.: vedação à tortura, ao trabalho escravo). O STF aplicou a dignidade como fundamento direto em casos como ADPF 132 (união homoafetiva) e ADI 4.815 (biografias não autorizadas).',
            'dica': 'Dignidade da pessoa humana = princípio matriz, fundamento absoluto e núcleo essencial dos direitos fundamentais.',
            'dificuldade': 'difícil',
            'fonte': 'CESPE',
            'ano': 2024,
            'titulo': 'CESPE/PGE/2024 - Dignidade da Pessoa Humana'
        },
        {
            'enunciado': 'Sobre a interpretação constitucional, qual princípio determina que, na aplicação da Constituição, deve-se preferir a interpretação que confira maior efetividade à norma constitucional?',
            'opcoes': [
                'A) Princípio da unidade da Constituição.',
                'B) Princípio da concordância prática.',
                'C) Princípio da máxima efetividade.',
                'D) Princípio do efeito integrador.',
                'E) Princípio da força normativa da Constituição.'
            ],
            'resposta': 'C',
            'explicacao': 'O princípio da máxima efetividade (ou eficiência) determina que ao intérprete cabe atribuir à norma constitucional o sentido que lhe dê maior eficácia e aplicabilidade prática. Já a força normativa (Hesse) é o dever de assegurar a Constituição como norma jurídica vinculante. A concordância prática resolve colisões. A unidade trata da Constituição como sistema. O efeito integrador busca a unidade político-social.',
            'dica': 'Máxima efetividade = mais aplicabilidade. Concordância prática = harmonizar colisões. Força normativa = fazer valer a CF.',
            'dificuldade': 'médio',
            'fonte': 'FCC',
            'ano': 2022,
            'titulo': 'FCC/DPE/2022 - Princípios da Hermenêutica'
        },
        {
            'enunciado': 'Julgue o item: "O princípio da supremacia da Constituição decorre da rigidez constitucional e fundamenta o controle de constitucionalidade, sendo a Constituição brasileira de 1988 classificada como rígida, formal, escrita, dogmática e analítica".',
            'opcoes': ['A) Verdadeiro', 'B) Falso'],
            'resposta': 'A',
            'explicacao': 'A CF/88 é classificada como: (i) escrita — sistematizada em texto; (ii) formal — leis materialmente constitucionais que não constam no texto não têm hierarquia constitucional; (iii) dogmática — fruto de assembleia constituinte; (iv) rígida — exige processo legislativo mais complexo (art. 60); (v) analítica — extensa e detalhada; (vi) promulgada — origem democrática. A supremacia decorre justamente da rigidez, que fundamenta o controle de constitucionalidade.',
            'dica': 'CF/88: Escrita, Formal, Dogmática, Rígida, Analítica, Promulgada. Rigidez gera Supremacia, que gera Controle de Constitucionalidade.',
            'dificuldade': 'médio',
            'fonte': 'CESPE',
            'ano': 2023,
            'titulo': 'CESPE/TRT/2023 - Classificação da CF/88'
        },
        {
            'enunciado': 'Em relação à soberania como fundamento da República, assinale a alternativa correta:',
            'opcoes': [
                'A) A soberania interna é dirigida às relações entre o Estado brasileiro e outros Estados.',
                'B) A soberania externa traduz o poder supremo do Estado dentro de seu território.',
                'C) A soberania popular é exercida exclusivamente pelo voto direto, sendo vedados outros instrumentos.',
                'D) O art. 14 da CF/88 prevê o exercício da soberania popular pelo sufrágio universal e, ainda, mediante plebiscito, referendo e iniciativa popular.',
                'E) A soberania, por ser cláusula pétrea, não pode ser objeto de tratado internacional.'
            ],
            'resposta': 'D',
            'explicacao': 'O art. 14 da CF/88 prevê que a soberania popular será exercida pelo sufrágio universal e pelo voto direto e secreto, com valor igual para todos, e, nos termos da lei, mediante plebiscito, referendo e iniciativa popular. As alternativas A e B invertem os conceitos (interna = dentro do território; externa = relações com outros Estados). A soberania não impede a celebração de tratados — ela é exercida ao firmá-los.',
            'dica': 'Soberania popular se exerce por: VOTO + PLEBISCITO + REFERENDO + INICIATIVA POPULAR (art. 14).',
            'dificuldade': 'médio',
            'fonte': 'FGV',
            'ano': 2024,
            'titulo': 'FGV/MPE/2024 - Soberania Popular'
        },
        {
            'enunciado': 'Acerca do pluralismo político como fundamento da República, é correto afirmar:',
            'opcoes': [
                'A) Confunde-se com o pluripartidarismo, sendo expressão restrita ao número de partidos políticos.',
                'B) É fundamento que assegura apenas a liberdade de expressão política em campanhas eleitorais.',
                'C) Possui sentido amplo, abrangendo a coexistência de diversas ideologias, crenças e concepções na sociedade.',
                'D) Não tem reflexos na liberdade de associação, regulada exclusivamente pelo Código Civil.',
                'E) Foi inserido por emenda constitucional posteriormente à promulgação da CF/88.'
            ],
            'resposta': 'C',
            'explicacao': 'O pluralismo político (art. 1º, V, CF/88) é fundamento que vai além do pluripartidarismo. Em sentido amplo, assegura a coexistência de diversas correntes de pensamento, ideologias, crenças religiosas, concepções éticas e culturais. Reflete-se em liberdades como associação (art. 5º, XVII), reunião, expressão e crença. É texto originário da CF/88, não inserido por EC.',
            'dica': 'Pluralismo POLÍTICO ≠ Pluripartidarismo. O primeiro é AMPLO (ideologias, crenças); o segundo é apenas sobre partidos.',
            'dificuldade': 'difícil',
            'fonte': 'CESPE',
            'ano': 2023,
            'titulo': 'CESPE/MPU/2023 - Pluralismo Político'
        },
    ],
    'Direitos e Garantias Fundamentais': [
        {
            'enunciado': 'Sobre o princípio da legalidade previsto no art. 5º, II, da CF/88, assinale a alternativa correta:',
            'opcoes': [
                'A) Ninguém será obrigado a fazer ou deixar de fazer alguma coisa senão em virtude de decreto.',
                'B) Ninguém será obrigado a fazer ou deixar de fazer alguma coisa senão em virtude de lei.',
                'C) A legalidade na Administração Pública confunde-se com a legalidade dos particulares.',
                'D) A reserva legal é gênero do qual o princípio da legalidade é espécie.',
                'E) Medida provisória não pode jamais criar obrigações para os particulares.'
            ],
            'resposta': 'B',
            'explicacao': 'O art. 5º, II, da CF/88 dispõe que "ninguém será obrigado a fazer ou deixar de fazer alguma coisa senão em virtude de lei". Para o particular vige a autonomia (pode fazer tudo que a lei não proíba); para a Administração vige a legalidade estrita (só pode fazer o que a lei autoriza). Reserva legal é espécie de legalidade (matérias específicas reservadas à lei). Medidas provisórias têm força de lei (art. 62) e podem criar obrigações.',
            'dica': 'Para o PARTICULAR: pode fazer tudo que a lei não proíbe. Para a ADMINISTRAÇÃO: só pode fazer o que a lei autoriza.',
            'dificuldade': 'fácil',
            'fonte': 'FCC',
            'ano': 2023,
            'titulo': 'FCC/SEFAZ/2023 - Princípio da Legalidade'
        },
        {
            'enunciado': 'Julgue: "Segundo a jurisprudência do STF, os direitos fundamentais possuem eficácia horizontal, podendo ser invocados nas relações entre particulares, como reconhecido no caso da exclusão de associado da União Brasileira de Compositores sem garantia do contraditório".',
            'opcoes': ['A) Verdadeiro', 'B) Falso'],
            'resposta': 'A',
            'explicacao': 'O STF, no julgamento do RE 201.819/RJ (caso UBC), consagrou a teoria da eficácia horizontal dos direitos fundamentais (Drittwirkung), determinando a aplicação direta dos direitos fundamentais nas relações privadas. No caso, reconheceu-se que a exclusão de associado sem contraditório e ampla defesa viola o devido processo legal, ainda que praticada por entidade privada. O Brasil adota a teoria da eficácia direta/imediata nas relações privadas.',
            'dica': 'Eficácia VERTICAL = Estado x particular. Eficácia HORIZONTAL = particular x particular. Brasil adota eficácia DIRETA.',
            'dificuldade': 'médio',
            'fonte': 'CESPE',
            'ano': 2022,
            'titulo': 'CESPE/AGU/2022 - Eficácia Horizontal'
        },
        {
            'enunciado': 'Acerca dos remédios constitucionais, assinale a alternativa correta:',
            'opcoes': [
                'A) O habeas corpus é cabível em favor de pessoa jurídica que sofra constrangimento ilegal em sua liberdade de locomoção.',
                'B) O mandado de segurança coletivo pode ser impetrado por partido político com representação no Congresso Nacional.',
                'C) O habeas data é via adequada para obter informações pessoais de terceiros constantes em bancos de dados públicos.',
                'D) A ação popular pode ser proposta por qualquer pessoa, inclusive estrangeiros não residentes.',
                'E) O mandado de injunção é cabível diante de qualquer omissão legislativa, ainda que não relacionada a direitos fundamentais.'
            ],
            'resposta': 'B',
            'explicacao': 'O art. 5º, LXX, "a", da CF/88 legitima partido político com representação no Congresso Nacional a impetrar MS coletivo. HC só protege liberdade de locomoção, e pessoa jurídica não se locomove (Súmula 691 STF). Habeas data é PERSONALÍSSIMO — só serve para informações do próprio impetrante (Súmula 2 STJ). Ação popular exige cidadania (título eleitoral). MI é cabível apenas para tornar viáveis direitos e liberdades constitucionais e prerrogativas inerentes à nacionalidade, soberania e cidadania (art. 5º, LXXI).',
            'dica': 'MS coletivo: PASS-CO-O = PArtido com representação, Sindicato, aSSociação (1 ano), Confederação, Organização sindical/entidade de classe.',
            'dificuldade': 'médio',
            'fonte': 'CESPE',
            'ano': 2024,
            'titulo': 'CESPE/PF/2024 - Remédios Constitucionais'
        },
        {
            'enunciado': 'Julgue: "Segundo a jurisprudência consolidada do STF, é constitucional a prisão civil do depositário infiel, em razão da Súmula Vinculante 25 e do Pacto de São José da Costa Rica".',
            'opcoes': ['A) Verdadeiro', 'B) Falso'],
            'resposta': 'B',
            'explicacao': 'O item está INCORRETO. A Súmula Vinculante 25 declara ILÍCITA a prisão civil do depositário infiel, qualquer que seja a modalidade do depósito. No julgamento do RE 466.343, o STF, com base no Pacto de São José da Costa Rica (que tem status supralegal), entendeu que a única prisão civil admissível no Brasil é a do devedor de pensão alimentícia (art. 5º, LXVII, CF/88).',
            'dica': 'Prisão civil no Brasil = SOMENTE devedor de alimentos. Pacto de São José = status SUPRALEGAL (acima da lei, abaixo da CF).',
            'dificuldade': 'médio',
            'fonte': 'CESPE',
            'ano': 2023,
            'titulo': 'CESPE/TJ/2023 - Prisão Civil'
        },
        {
            'enunciado': 'Sobre a inviolabilidade do domicílio (art. 5º, XI, CF/88), é correto afirmar:',
            'opcoes': [
                'A) A casa é asilo absoluto do indivíduo, não admitindo nenhuma forma de ingresso sem consentimento.',
                'B) O ingresso forçado em domicílio sem mandado é lícito apenas durante o dia, em qualquer hipótese.',
                'C) Conforme o RE 603.616, o ingresso em domicílio sem mandado exige fundadas razões justificadoras, a posteriori demonstráveis.',
                'D) O conceito de "casa" para fins constitucionais limita-se à residência habitual, excluindo escritórios profissionais.',
                'E) A flagrância de crime permanente não autoriza o ingresso sem mandado, exigindo-se sempre autorização judicial.'
            ],
            'resposta': 'C',
            'explicacao': 'No RE 603.616 (Tema 280, repercussão geral), o STF firmou que "a entrada forçada em domicílio sem mandado judicial só é lícita, mesmo em período noturno, quando amparada em fundadas razões, devidamente justificadas a posteriori, que indiquem que dentro da casa ocorre situação de flagrante delito, sob pena de responsabilidade disciplinar, civil e penal do agente". O ingresso é admitido em flagrante, desastre, socorro ou, durante o dia, com mandado judicial. "Casa" tem conceito amplo (inclui escritórios — Súmula Vinculante 14 trata do acesso aos autos pelo advogado, mas o conceito amplo de casa decorre da própria CF e da jurisprudência).',
            'dica': 'Ingresso em domicílio: DIA com mandado OU NOITE só com flagrante/desastre/socorro/consentimento. Sem mandado = exigem-se FUNDADAS RAZÕES (RE 603.616).',
            'dificuldade': 'difícil',
            'fonte': 'CESPE',
            'ano': 2024,
            'titulo': 'CESPE/PC/2024 - Inviolabilidade do Domicílio'
        },
        {
            'enunciado': 'Julgue: "É possível restringir direitos fundamentais por meio de lei ordinária, desde que se observe o princípio da proporcionalidade e o núcleo essencial do direito não seja atingido".',
            'opcoes': ['A) Verdadeiro', 'B) Falso'],
            'resposta': 'A',
            'explicacao': 'Direitos fundamentais não são absolutos e podem sofrer restrições, desde que observados: (i) o princípio da proporcionalidade (necessidade, adequação, proporcionalidade em sentido estrito); (ii) a preservação do núcleo essencial (Wesensgehaltsgarantie); (iii) a reserva legal quando exigida; (iv) a vedação ao retrocesso. O STF aplica esses critérios em casos como o da ADI 4.815 (biografias) e ADI 4.103 (vaquejada).',
            'dica': 'Restrição a direitos fundamentais: PROPORCIONALIDADE + NÚCLEO ESSENCIAL preservado + RESERVA LEGAL.',
            'dificuldade': 'difícil',
            'fonte': 'CESPE',
            'ano': 2024,
            'titulo': 'CESPE/PGR/2024 - Restrição a Direitos Fundamentais'
        },
        {
            'enunciado': 'Quanto à liberdade de expressão e manifestação do pensamento, é CORRETO afirmar:',
            'opcoes': [
                'A) A CF/88 admite o anonimato em manifestações políticas como forma de proteção do expressante.',
                'B) O direito de resposta é proporcional ao agravo, além da indenização por dano material, moral ou à imagem.',
                'C) A censura prévia é admitida em obras audiovisuais para proteção de crianças e adolescentes.',
                'D) Segundo o STF, é constitucional a exigência de diploma de jornalismo para o exercício da profissão.',
                'E) A liberdade de expressão é absoluta, não admitindo qualquer forma de responsabilização posterior.'
            ],
            'resposta': 'B',
            'explicacao': 'O art. 5º, V, da CF/88 assegura o direito de resposta proporcional ao agravo, além de indenização por dano material, moral ou à imagem. O anonimato é VEDADO (art. 5º, IV). A censura prévia é proibida (ADPF 130 — Lei de Imprensa). O STF declarou inconstitucional a exigência de diploma de jornalismo (RE 511.961). A liberdade de expressão admite responsabilização posterior por abusos.',
            'dica': 'Liberdade de expressão: SEM censura prévia + SEM anonimato + COM responsabilização posterior + direito de resposta PROPORCIONAL.',
            'dificuldade': 'médio',
            'fonte': 'FGV',
            'ano': 2023,
            'titulo': 'FGV/OAB/2023 - Liberdade de Expressão'
        },
        {
            'enunciado': 'Julgue: "O direito ao esquecimento, segundo entendimento firmado pelo STF no RE 1.010.606 (Tema 786), é incompatível com a Constituição Federal de 1988".',
            'opcoes': ['A) Verdadeiro', 'B) Falso'],
            'resposta': 'A',
            'explicacao': 'No RE 1.010.606 (julgado em 2021, Tema 786 da repercussão geral), o STF firmou tese de que "é incompatível com a Constituição a ideia de um direito ao esquecimento, assim entendido como o poder de obstar, em razão da passagem do tempo, a divulgação de fatos ou dados verídicos e licitamente obtidos e publicados em meios de comunicação social". Eventuais excessos devem ser analisados caso a caso à luz da liberdade de expressão e dos direitos da personalidade.',
            'dica': 'STF Tema 786: NÃO existe direito ao esquecimento no Brasil. Conflitos resolvem-se caso a caso (proporcionalidade).',
            'dificuldade': 'difícil',
            'fonte': 'CESPE',
            'ano': 2023,
            'titulo': 'CESPE/MPF/2023 - Direito ao Esquecimento'
        },
        {
            'enunciado': 'Sobre os direitos dos presos, conforme art. 5º da CF/88 e jurisprudência do STF, assinale a alternativa correta:',
            'opcoes': [
                'A) A CF/88 admite a pena de morte em qualquer hipótese, desde que prevista em lei.',
                'B) O preso tem direito à identificação dos responsáveis por sua prisão ou interrogatório policial.',
                'C) A prisão de qualquer pessoa só será comunicada ao juiz competente, sem necessidade de comunicação à família.',
                'D) O STF não reconhece o estado de coisas inconstitucional do sistema penitenciário.',
                'E) É constitucional a exigência de fiança em qualquer modalidade de crime, inclusive racismo.'
            ],
            'resposta': 'B',
            'explicacao': 'O art. 5º, LXIV, CF/88 garante ao preso direito à identificação dos responsáveis por sua prisão ou interrogatório policial. Pena de morte só em caso de guerra declarada (art. 5º, XLVII, "a"). A prisão deve ser comunicada IMEDIATAMENTE ao juiz E à família ou pessoa indicada (art. 5º, LXII). No julgamento da ADPF 347, o STF reconheceu o "estado de coisas inconstitucional" do sistema penitenciário. Crimes de racismo são INAFIANÇÁVEIS (art. 5º, XLII).',
            'dica': 'Inafiançáveis e imprescritíveis: RACISMO + AÇÃO DE GRUPOS ARMADOS contra Estado Democrático. Inafiançáveis e insuscetíveis de graça/anistia: 3T+H = Tortura, Tráfico, Terrorismo + Hediondos.',
            'dificuldade': 'médio',
            'fonte': 'CESPE',
            'ano': 2024,
            'titulo': 'CESPE/DPU/2024 - Direitos dos Presos'
        },
        {
            'enunciado': 'Acerca do princípio da igualdade (art. 5º, caput, CF/88), julgue: "O STF tem reconhecido a constitucionalidade de ações afirmativas, como cotas raciais em universidades e em concursos públicos, com base no princípio da igualdade material".',
            'opcoes': ['A) Verdadeiro', 'B) Falso'],
            'resposta': 'A',
            'explicacao': 'O STF, na ADPF 186 (cotas raciais em universidades) e na ADC 41 (cotas raciais em concursos públicos federais — Lei 12.990/2014), firmou a constitucionalidade de ações afirmativas com base no princípio da igualdade material (substancial), que demanda tratamento desigual para os desiguais na medida de sua desigualdade. A igualdade formal (todos iguais perante a lei) convive com a material (busca de equiparação real).',
            'dica': 'Igualdade FORMAL = todos iguais perante a lei. Igualdade MATERIAL = desigualar para igualar (justifica ações afirmativas).',
            'dificuldade': 'fácil',
            'fonte': 'CESPE',
            'ano': 2023,
            'titulo': 'CESPE/MPDFT/2023 - Princípio da Igualdade'
        },
    ],
    'Aplicabilidade das Normas Constitucionais': [
        {
            'enunciado': 'Segundo a clássica classificação de José Afonso da Silva, as normas constitucionais quanto ao grau de eficácia se dividem em:',
            'opcoes': [
                'A) Normas autoaplicáveis e normas não autoaplicáveis.',
                'B) Normas de eficácia plena, contida e limitada.',
                'C) Normas programáticas, organizatórias e definidoras.',
                'D) Normas exequíveis por si mesmas e normas integráveis.',
                'E) Normas de aplicação direta e normas de aplicação reflexa.'
            ],
            'resposta': 'B',
            'explicacao': 'A classificação de José Afonso da Silva (1968), adotada amplamente pela doutrina e jurisprudência brasileira, divide as normas constitucionais quanto à eficácia em: (i) eficácia PLENA — aplicabilidade direta, imediata e integral; (ii) eficácia CONTIDA (ou redutível/restringível) — aplicabilidade direta e imediata, mas pode ser restringida; (iii) eficácia LIMITADA — aplicabilidade indireta e mediata, dependem de regulamentação. As demais classificações pertencem a outros autores (Ruy Barbosa — autoaplicáveis/não autoaplicáveis; Maria Helena Diniz; Vezio Crisafulli, etc.).',
            'dica': 'José Afonso da Silva: PLENA (não restringe), CONTIDA (pode restringir), LIMITADA (precisa de lei).',
            'dificuldade': 'fácil',
            'fonte': 'FCC',
            'ano': 2023,
            'titulo': 'FCC/TRT/2023 - Classificação JAS'
        },
        {
            'enunciado': 'Quanto às normas de eficácia contida, assinale a alternativa correta:',
            'opcoes': [
                'A) Possuem aplicabilidade indireta, mediata e reduzida, dependendo sempre de regulamentação.',
                'B) Têm aplicabilidade direta e imediata, mas podem ter seu alcance restringido por lei infraconstitucional.',
                'C) Não admitem qualquer restrição legal, por serem de aplicação plena.',
                'D) São sempre programáticas e dependem de complementação legislativa.',
                'E) Configuram modalidade de norma de eficácia limitada, segundo a doutrina majoritária.'
            ],
            'resposta': 'B',
            'explicacao': 'Normas de eficácia contida (ou prospectiva — Michel Temer; redutível — Maria Helena Diniz) têm aplicabilidade DIRETA, IMEDIATA, mas NÃO INTEGRAL — podem ser restringidas por lei infraconstitucional, conceito jurídico indeterminado ou outras normas constitucionais. Exemplo clássico: art. 5º, XIII, "é livre o exercício de qualquer trabalho, ofício ou profissão, atendidas as qualificações profissionais que a lei estabelecer". Enquanto não vier a lei restritiva, a norma é de eficácia plena.',
            'dica': 'Eficácia CONTIDA: já produz todos os efeitos, MAS lei pode VIR e restringir. Ex.: liberdade profissional, direito de propriedade.',
            'dificuldade': 'médio',
            'fonte': 'CESPE',
            'ano': 2024,
            'titulo': 'CESPE/AGU/2024 - Eficácia Contida'
        },
        {
            'enunciado': 'Julgue: "As normas constitucionais de eficácia limitada, embora não produzam todos os seus efeitos desde a promulgação, possuem desde logo eficácia mínima, vinculando o legislador e revogando normas anteriores incompatíveis".',
            'opcoes': ['A) Verdadeiro', 'B) Falso'],
            'resposta': 'A',
            'explicacao': 'Normas de eficácia limitada possuem eficácia jurídica MÍNIMA desde a promulgação, embora careçam de regulamentação para plena aplicação. Conforme José Afonso da Silva, possuem eficácia: (i) negativa — revogam normas anteriores incompatíveis e impedem a edição de normas em sentido contrário; (ii) vinculativa — obrigam o legislador a regulamentá-las; (iii) interpretativa — orientam a hermenêutica das demais normas. Subdividem-se em normas de princípio institutivo e programáticas.',
            'dica': 'Eficácia LIMITADA tem eficácia MÍNIMA: revoga lei anterior + vincula legislador + serve de parâmetro interpretativo.',
            'dificuldade': 'médio',
            'fonte': 'CESPE',
            'ano': 2023,
            'titulo': 'CESPE/STF/2023 - Eficácia Limitada'
        },
        {
            'enunciado': 'Acerca dos limites ao poder de reforma constitucional (art. 60 da CF/88), assinale a alternativa correta:',
            'opcoes': [
                'A) A CF/88 pode ser emendada na vigência de intervenção federal, estado de defesa ou estado de sítio.',
                'B) São cláusulas pétreas: forma federativa, voto direto/secreto/universal/periódico, separação dos Poderes e direitos e garantias individuais.',
                'C) Proposta de emenda rejeitada pode ser reapresentada na mesma sessão legislativa, desde que com nova redação.',
                'D) A iniciativa de PEC é privativa do Presidente da República.',
                'E) A aprovação de emenda exige maioria absoluta em cada Casa do Congresso, em dois turnos.'
            ],
            'resposta': 'B',
            'explicacao': 'O art. 60, §4º, CF/88, traz as cláusulas pétreas explícitas: forma federativa (I), voto direto, secreto, universal e periódico (II), separação dos Poderes (III) e direitos e garantias individuais (IV). É VEDADA emenda na vigência de intervenção federal, estado de defesa ou estado de sítio (§1º). PEC rejeitada não pode ser reapresentada na mesma sessão legislativa (§5º). Iniciativa: 1/3 da Câmara ou Senado, Presidente da República, ou mais da metade das Assembleias Legislativas (§2º). Aprovação: 3/5 em cada Casa, em dois turnos.',
            'dica': 'Cláusulas pétreas explícitas: FOR-VO-SEP-DIR (FORma federativa, VOto, SEParação dos Poderes, DIReitos e garantias individuais).',
            'dificuldade': 'fácil',
            'fonte': 'CESPE',
            'ano': 2023,
            'titulo': 'CESPE/Câmara/2023 - Cláusulas Pétreas'
        },
        {
            'enunciado': 'Sobre a mutação constitucional, julgue: "A mutação constitucional é processo informal de alteração do sentido da norma constitucional, sem modificação de seu texto, exemplificada pela evolução jurisprudencial do STF sobre o art. 52, X, da CF/88, no julgamento das ADIs 3406 e 3470".',
            'opcoes': ['A) Verdadeiro', 'B) Falso'],
            'resposta': 'A',
            'explicacao': 'Mutação constitucional é processo informal de alteração do sentido da norma sem modificação textual, decorrente de evolução social, política e jurisprudencial. No julgamento das ADIs 3406 e 3470 (2017), o STF reconheceu a mutação constitucional do art. 52, X, da CF, conferindo eficácia erga omnes às decisões definitivas em controle difuso, sem necessidade da resolução do Senado (que passou a ter mero papel de publicidade). Outro exemplo: evolução do conceito de família (ADPF 132).',
            'dica': 'Mutação constitucional = MUDA O SENTIDO sem mudar o TEXTO. É processo INFORMAL de reforma.',
            'dificuldade': 'difícil',
            'fonte': 'CESPE',
            'ano': 2024,
            'titulo': 'CESPE/STJ/2024 - Mutação Constitucional'
        },
        {
            'enunciado': 'A norma constitucional que dispõe ser "livre o exercício de qualquer trabalho, ofício ou profissão, atendidas as qualificações profissionais que a lei estabelecer" (art. 5º, XIII) é classificada como norma de eficácia:',
            'opcoes': [
                'A) Plena.',
                'B) Contida.',
                'C) Limitada de princípio institutivo.',
                'D) Limitada de princípio programático.',
                'E) Exaurida.'
            ],
            'resposta': 'B',
            'explicacao': 'O art. 5º, XIII, é o exemplo clássico de norma de eficácia CONTIDA. Aplica-se direta e imediatamente — todos têm liberdade profissional desde a promulgação —, mas pode ser restringida por lei posterior (ex.: exigência de OAB para advocacia, CRM para medicina). Enquanto não houver lei restritiva, a norma é de eficácia plena. O STF declarou inconstitucional a exigência de diploma para jornalista (RE 511.961), por desproporcionalidade.',
            'dica': 'Quando a CF diz "nos termos da lei", "salvo nas hipóteses previstas em lei" = geralmente eficácia CONTIDA.',
            'dificuldade': 'médio',
            'fonte': 'FCC',
            'ano': 2022,
            'titulo': 'FCC/TJ/2022 - Eficácia Contida'
        },
        {
            'enunciado': 'Julgue: "Segundo o STF, as cláusulas pétreas funcionam como limites materiais ao poder constituinte derivado reformador, mas NÃO impedem que emenda constitucional aperfeiçoe ou amplie o conteúdo do direito protegido".',
            'opcoes': ['A) Verdadeiro', 'B) Falso'],
            'resposta': 'A',
            'explicacao': 'Cláusulas pétreas limitam materialmente o poder constituinte derivado, mas a vedação é de tendentes a ABOLIR (art. 60, §4º). Emendas que ampliem ou aperfeiçoem direitos são plenamente admissíveis. Ex.: EC 26/2000 ampliou direitos sociais (moradia); EC 45/2004 ampliou prerrogativas do Judiciário. O STF (ADI 939, EC 3/93) firmou que o núcleo essencial é intocável, mas regulamentação aperfeiçoadora é válida.',
            'dica': 'Cláusula pétrea proíbe ABOLIR (suprimir/reduzir o núcleo). NÃO proíbe ampliar/aperfeiçoar.',
            'dificuldade': 'difícil',
            'fonte': 'CESPE',
            'ano': 2024,
            'titulo': 'CESPE/PGFN/2024 - Cláusulas Pétreas e EC'
        },
        {
            'enunciado': 'Sobre as normas programáticas, é correto afirmar:',
            'opcoes': [
                'A) São espécie de norma de eficácia plena, gerando direitos subjetivos imediatos.',
                'B) São espécie de norma de eficácia limitada, traçando programas e fins a serem alcançados pelo Estado.',
                'C) Não vinculam o Poder Público nem geram qualquer efeito jurídico.',
                'D) Possuem natureza meramente moral, sem força jurídica.',
                'E) São incompatíveis com a teoria contemporânea da força normativa da Constituição.'
            ],
            'resposta': 'B',
            'explicacao': 'Normas programáticas são espécie de norma de eficácia LIMITADA (subdividida em normas de princípio institutivo e programáticas, segundo José Afonso da Silva). Traçam programas, fins e diretrizes a serem perseguidos pelo Estado (ex.: art. 196 — saúde como direito de todos; art. 205 — educação). Possuem força normativa, vinculam o Poder Público (proibição de retrocesso) e podem ser invocadas para controle de políticas públicas (ADPF 45 — mínimo existencial).',
            'dica': 'Programáticas = LIMITADAS de cunho social. Vinculam o Estado e fundamentam o controle de políticas públicas.',
            'dificuldade': 'médio',
            'fonte': 'FGV',
            'ano': 2023,
            'titulo': 'FGV/MPE/2023 - Normas Programáticas'
        },
        {
            'enunciado': 'Acerca do bloco de constitucionalidade no Brasil, assinale a alternativa correta:',
            'opcoes': [
                'A) Compreende apenas o texto expresso da Constituição Federal de 1988.',
                'B) Inclui todos os tratados internacionais ratificados pelo Brasil, independentemente de procedimento.',
                'C) Abrange a CF/88, as emendas constitucionais e os tratados de direitos humanos aprovados pelo rito do art. 5º, §3º (3/5 em dois turnos nas duas Casas).',
                'D) Engloba leis complementares federais por terem hierarquia constitucional.',
                'E) Não é reconhecido pelo STF, que adota concepção restritiva.'
            ],
            'resposta': 'C',
            'explicacao': 'O bloco de constitucionalidade no Brasil, segundo entendimento prevalecente, compreende: (i) o texto da CF/88; (ii) as emendas constitucionais; (iii) os tratados internacionais de direitos humanos aprovados pelo rito do art. 5º, §3º (introduzido pela EC 45/2004), com quórum de 3/5 em dois turnos em cada Casa. Tratados de direitos humanos não aprovados por esse rito têm status SUPRALEGAL (RE 466.343). Demais tratados têm status de lei ordinária. Leis complementares são infraconstitucionais.',
            'dica': 'Bloco de constitucionalidade BR = CF + EC + Tratados de DH com rito do art. 5º, §3º (3/5, 2 turnos, 2 Casas).',
            'dificuldade': 'difícil',
            'fonte': 'CESPE',
            'ano': 2024,
            'titulo': 'CESPE/PGR/2024 - Bloco de Constitucionalidade'
        },
        {
            'enunciado': 'Julgue: "É possível que uma norma constitucional originária seja declarada inconstitucional pelo STF quando contrariar princípio constitucional fundamental, conforme a teoria de Otto Bachof adotada pelo Supremo".',
            'opcoes': ['A) Verdadeiro', 'B) Falso'],
            'resposta': 'B',
            'explicacao': 'O item está INCORRETO. O STF REJEITOU expressamente a teoria de Otto Bachof (normas constitucionais inconstitucionais) na ADI 815/DF (Rel. Min. Moreira Alves, 1996), entendendo que normas constitucionais ORIGINÁRIAS não podem ser objeto de controle de constitucionalidade. Apenas normas derivadas (emendas constitucionais) podem ser declaradas inconstitucionais. Vigora no Brasil o princípio da unidade da Constituição: não há hierarquia entre normas originárias.',
            'dica': 'STF NÃO adota a tese de Bachof. Normas ORIGINÁRIAS = imunes a controle. Apenas EMENDAS podem ser declaradas inconstitucionais.',
            'dificuldade': 'difícil',
            'fonte': 'CESPE',
            'ano': 2023,
            'titulo': 'CESPE/MPF/2023 - Normas Originárias'
        },
    ],
}
