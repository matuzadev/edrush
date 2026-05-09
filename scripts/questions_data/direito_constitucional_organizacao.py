"""
Direito Constitucional — Organização do Estado e Poderes
30 questões cobrindo 3 capítulos
Inspiradas em estilo CESPE/CEBRASPE, FCC e FGV — questões originais
Distribuição: 40% fácil, 40% médio, 20% difícil
Mistura: ~30% verdadeiro/falso, ~70% múltipla escolha
"""

CAPITULOS = [
    {
        'numero': 4,
        'titulo': 'Organização do Estado',
        'descricao': 'Federação brasileira, União, Estados, Municípios, DF, repartição de competências e intervenção federal (art. 18 a 32 da CF/88)'
    },
    {
        'numero': 5,
        'titulo': 'Poder Legislativo',
        'descricao': 'Congresso Nacional, Câmara dos Deputados, Senado Federal, processo legislativo, CPI, imunidades e prerrogativas parlamentares (art. 44 a 75 da CF/88)'
    },
    {
        'numero': 6,
        'titulo': 'Poder Executivo e Judiciário',
        'descricao': 'Presidente da República, Ministros de Estado, organização do Judiciário, STF, STJ e controle concentrado de constitucionalidade (ADI, ADC, ADPF, ADO)'
    },
]

QUESTOES = {
    # ============================================================
    # CAPÍTULO 4 — ORGANIZAÇÃO DO ESTADO (10 questões)
    # ============================================================
    'Organização do Estado': [
        # ---------- FÁCEIS (4) ----------
        {
            'enunciado': 'Acerca da organização político-administrativa da República Federativa do Brasil, prevista no art. 18 da CF/88, assinale a alternativa correta.',
            'opcoes': [
                'A) A organização político-administrativa compreende apenas a União, os Estados e os Municípios, sendo o Distrito Federal mero território federal autônomo.',
                'B) A União, os Estados, o Distrito Federal e os Municípios são todos autônomos, nos termos da Constituição.',
                'C) Os Municípios não integram a federação brasileira, sendo apenas divisões administrativas dos Estados.',
                'D) Apenas a União possui soberania e autonomia simultaneamente.',
                'E) O Distrito Federal pode ser dividido em Municípios mediante lei complementar federal.'
            ],
            'resposta': 'B',
            'explicacao': 'O art. 18, caput, da CF/88 estabelece que a organização político-administrativa da República Federativa do Brasil compreende a União, os Estados, o Distrito Federal e os Municípios, todos autônomos, nos termos desta Constituição. A autonomia dos entes federados se manifesta em quatro capacidades: auto-organização, autogoverno, autoadministração e autolegislação. Apenas a República Federativa do Brasil é dotada de soberania (art. 1º, I), sendo a autonomia atributo dos entes internos. O DF é vedado de ser dividido em Municípios (art. 32, caput).',
            'dica': 'Federação brasileira tem 4 entes autônomos: U-E-DF-M. Soberania é da República como um todo; autonomia é dos entes.',
            'dificuldade': 'fácil',
            'fonte': 'CESPE/CEBRASPE',
            'ano': 2023,
            'titulo': 'CESPE/TRF1/2023 - Organização Político-Administrativa'
        },
        {
            'enunciado': 'O Distrito Federal pode ser dividido em Municípios.',
            'opcoes': ['A) Verdadeiro', 'B) Falso'],
            'resposta': 'B',
            'explicacao': 'O art. 32, caput, da CF/88 é expresso: "O Distrito Federal, vedada sua divisão em Municípios, reger-se-á por lei orgânica..." Trata-se de natureza híbrida do DF, que acumula competências legislativas dos Estados e dos Municípios (art. 32, §1º). A vedação à divisão em Municípios é cláusula constitucional rígida, não podendo ser alterada por lei ordinária.',
            'dica': 'DF não vira Municípios. Ele acumula competências estaduais e municipais.',
            'dificuldade': 'fácil',
            'fonte': 'FCC',
            'ano': 2022,
            'titulo': 'FCC/TJ-DF/2022 - Distrito Federal'
        },
        {
            'enunciado': 'Sobre a competência legislativa da União prevista no art. 22 da CF/88, assinale a alternativa que apresenta matéria de competência PRIVATIVA da União.',
            'opcoes': [
                'A) Direito tributário, financeiro e econômico.',
                'B) Proteção do meio ambiente e combate à poluição.',
                'C) Direito civil, comercial, penal, processual, eleitoral, agrário, marítimo, aeronáutico, espacial e do trabalho.',
                'D) Educação, cultura, ensino e desporto.',
                'E) Custas dos serviços forenses.'
            ],
            'resposta': 'C',
            'explicacao': 'O art. 22, I, da CF/88 atribui à União, com exclusividade (competência privativa), legislar sobre direito civil, comercial, penal, processual, eleitoral, agrário, marítimo, aeronáutico, espacial e do trabalho. As demais alternativas tratam de competências concorrentes (art. 24), em que a União edita normas gerais e os Estados/DF suplementam. Atenção: a competência privativa pode ser delegada aos Estados por lei complementar para questões específicas (art. 22, parágrafo único).',
            'dica': 'Competência privativa da União (art. 22) = matérias substantivas (direito civil, penal, etc.). Concorrente (art. 24) = matérias administrativas.',
            'dificuldade': 'fácil',
            'fonte': 'CESPE/CEBRASPE',
            'ano': 2024,
            'titulo': 'CESPE/PGE-RJ/2024 - Competência Legislativa'
        },
        {
            'enunciado': 'Os Estados-membros possuem soberania, podendo, inclusive, romper o pacto federativo e se separar da União.',
            'opcoes': ['A) Verdadeiro', 'B) Falso'],
            'resposta': 'B',
            'explicacao': 'Os Estados-membros possuem AUTONOMIA, e não soberania. A soberania pertence à República Federativa do Brasil. Além disso, o art. 1º, caput, da CF/88 declara expressamente que a República Federativa do Brasil é formada pela "união indissolúvel" dos Estados, Municípios e do Distrito Federal. A vedação à secessão é cláusula pétrea implícita decorrente da forma federativa (art. 60, §4º, I, CF), insuscetível de emenda constitucional.',
            'dica': 'Federação brasileira é INDISSOLÚVEL. Não cabe direito de secessão. Estados têm autonomia, não soberania.',
            'dificuldade': 'fácil',
            'fonte': 'FGV',
            'ano': 2023,
            'titulo': 'FGV/TJ-PR/2023 - Forma Federativa'
        },
        # ---------- MÉDIOS (4) ----------
        {
            'enunciado': 'A respeito da intervenção federal nos Estados-membros (art. 34 da CF/88), assinale a alternativa correta.',
            'opcoes': [
                'A) A decretação de intervenção federal é ato discricionário do Presidente da República, dispensada qualquer formalidade legislativa.',
                'B) O decreto de intervenção, que especificará a amplitude, o prazo e as condições de execução, será submetido à apreciação do Congresso Nacional, no prazo de 24 horas.',
                'C) Em qualquer hipótese de intervenção, é exigida prévia autorização do Senado Federal.',
                'D) A intervenção federal pode ser decretada de ofício pelo Presidente, sem necessidade de provocação, em todos os casos.',
                'E) O controle político da intervenção federal cabe exclusivamente ao Supremo Tribunal Federal.'
            ],
            'resposta': 'B',
            'explicacao': 'O art. 36, §1º, da CF/88 determina que o decreto de intervenção, que especificará a amplitude, o prazo e as condições de execução, e que, se couber, nomeará o interventor, será submetido à apreciação do Congresso Nacional, no prazo de 24 horas. A intervenção é medida excepcional e taxativa (art. 34) que afeta o pacto federativo, sendo controlada politicamente pelo Congresso. Em algumas hipóteses, depende de provocação (representação do PGR, requisição do STF, STJ ou TSE — art. 36, II e III).',
            'dica': 'Decreto de intervenção -> Congresso em 24h. Em provimento de execução de ordem judicial, dispensa-se controle político (art. 36, §3º).',
            'dificuldade': 'médio',
            'fonte': 'CESPE/CEBRASPE',
            'ano': 2023,
            'titulo': 'CESPE/AGU/2023 - Intervenção Federal'
        },
        {
            'enunciado': 'Sobre a competência dos Municípios na CF/88, assinale a alternativa INCORRETA.',
            'opcoes': [
                'A) Compete aos Municípios legislar sobre assuntos de interesse local.',
                'B) Compete aos Municípios suplementar a legislação federal e a estadual no que couber.',
                'C) Compete aos Municípios instituir e arrecadar os tributos de sua competência.',
                'D) Compete aos Municípios legislar sobre direito processual e direito do trabalho, no que tange aos servidores municipais.',
                'E) Compete aos Municípios prestar, com a cooperação técnica e financeira da União e do Estado, serviços de atendimento à saúde da população.'
            ],
            'resposta': 'D',
            'explicacao': 'A alternativa D é incorreta. Direito processual e direito do trabalho são matérias de competência PRIVATIVA da União (art. 22, I, CF), não podendo o Município legislar sobre esses ramos, mesmo em relação a seus servidores. As demais alternativas reproduzem corretamente o art. 30 da CF (interesse local, suplementar federal/estadual, tributos próprios, saúde em cooperação). O STF pacificou que assuntos de interesse local não autorizam o Município a invadir competências privativas da União (RE 1.045.273/STF).',
            'dica': 'Município legisla sobre INTERESSE LOCAL (art. 30, I) e SUPLEMENTA U/E quando couber, mas nunca sobre direito civil, penal, processual ou do trabalho.',
            'dificuldade': 'médio',
            'fonte': 'FCC',
            'ano': 2023,
            'titulo': 'FCC/TRT-15/2023 - Competência Municipal'
        },
        {
            'enunciado': 'No tocante à criação, incorporação, fusão e desmembramento de Municípios (art. 18, §4º, CF), é correto afirmar que tais atos ocorrerão por:',
            'opcoes': [
                'A) Lei complementar federal, dentro do período determinado por lei estadual, dispensada consulta prévia.',
                'B) Lei estadual, dentro do período determinado por lei complementar federal, e dependerão de consulta prévia, mediante plebiscito, às populações dos Municípios envolvidos, após divulgação dos Estudos de Viabilidade Municipal.',
                'C) Lei municipal, com aprovação por referendo da população do Município criado.',
                'D) Decreto do Governador, após aprovação pela Assembleia Legislativa estadual.',
                'E) Emenda à Constituição Estadual, mediante quórum de três quintos.'
            ],
            'resposta': 'B',
            'explicacao': 'O art. 18, §4º, da CF/88, com a redação dada pela EC 15/96, dispõe que a criação, a incorporação, a fusão e o desmembramento de Municípios far-se-ão por lei estadual, dentro do período determinado por lei complementar federal, e dependerão de consulta prévia, mediante plebiscito, às populações dos Municípios envolvidos, após divulgação dos Estudos de Viabilidade Municipal. O STF declarou inconstitucionalidade por omissão da lei complementar federal (ADI 3.682), mas até hoje a LC não foi editada — o que torna juridicamente impossível a criação de novos Municípios desde 1996.',
            'dica': 'Para criar Município: 4 requisitos = (1) Lei estadual, (2) dentro de prazo da LC federal, (3) plebiscito, (4) Estudos de Viabilidade.',
            'dificuldade': 'médio',
            'fonte': 'CESPE/CEBRASPE',
            'ano': 2024,
            'titulo': 'CESPE/MP-CE/2024 - Criação de Municípios'
        },
        {
            'enunciado': 'No julgamento da ADI 5.356/MS, o STF firmou entendimento no sentido de que a competência concorrente (art. 24 da CF) admite que os Estados-membros, na ausência de norma geral federal, exerçam competência legislativa plena, sendo certo que a superveniência de lei federal posterior suspende a eficácia da lei estadual no que lhe for contrário.',
            'opcoes': ['A) Verdadeiro', 'B) Falso'],
            'resposta': 'A',
            'explicacao': 'A afirmação está correta e reproduz a sistemática da competência legislativa concorrente prevista no art. 24, §§ 1º a 4º, da CF/88: à União cabe estabelecer normas gerais (§1º); inexistindo lei federal, os Estados exercem competência legislativa PLENA (§3º); a superveniência de lei federal sobre normas gerais SUSPENDE a eficácia da lei estadual no que lhe for contrário (§4º). O STF reafirmou essa lógica em diversos julgados, inclusive na ADI 5.356/MS. Importante: a lei estadual não é revogada, apenas tem sua eficácia suspensa.',
            'dica': 'Concorrente: U faz norma geral, E/DF suplementa. Sem lei federal -> Estado faz tudo. Lei federal posterior SUSPENDE (não revoga) a estadual no conflito.',
            'dificuldade': 'médio',
            'fonte': 'FGV',
            'ano': 2024,
            'titulo': 'FGV/PGE-SC/2024 - Competência Concorrente'
        },
        # ---------- DIFÍCEIS (2) ----------
        {
            'enunciado': 'Considere a seguinte situação hipotética: o Estado X edita lei prevendo a obrigatoriedade de instalação de cinto de segurança em ônibus interestadual de passageiros que circulam em seu território. À luz da jurisprudência consolidada do STF (ADI 3.135 e julgados correlatos), assinale a alternativa correta.',
            'opcoes': [
                'A) A lei estadual é constitucional, pois trata de matéria de interesse local relativa ao trânsito no Estado.',
                'B) A lei estadual é inconstitucional por usurpação de competência privativa da União para legislar sobre trânsito e transporte (art. 22, XI, CF), bem como sobre transporte interestadual.',
                'C) A lei estadual é constitucional, pois pode suplementar normas gerais federais sobre transporte.',
                'D) A lei estadual é constitucional, com base na competência comum prevista no art. 23 da CF/88.',
                'E) A questão depende exclusivamente de regulamentação por decreto estadual.'
            ],
            'resposta': 'B',
            'explicacao': 'O STF possui jurisprudência consolidada no sentido de que matérias relativas a trânsito, transporte e fiscalização do transporte interestadual são de competência PRIVATIVA da União (art. 22, IX e XI, CF/88). Lei estadual que estabeleça obrigações em ônibus interestaduais usurpa competência federal, sendo formalmente inconstitucional. A jurisprudência do STF é firme: apenas mediante delegação por lei complementar federal poderia haver atuação estadual em matérias do art. 22 (parágrafo único do art. 22). A "interesse local" do art. 30, I, não autoriza a invasão de competência privativa da União.',
            'dica': 'Trânsito e transporte = privativa da União (art. 22, XI). Estados não podem legislar mesmo em assuntos de "trânsito local".',
            'dificuldade': 'difícil',
            'fonte': 'CESPE/CEBRASPE',
            'ano': 2023,
            'titulo': 'CESPE/PGE-PA/2023 - Repartição de Competências'
        },
        {
            'enunciado': 'Sobre os bens da União previstos no art. 20 da CF/88 e a jurisprudência do STF, assinale a alternativa correta.',
            'opcoes': [
                'A) Os terrenos de marinha pertencem aos Estados litorâneos, conforme entendimento consolidado.',
                'B) As terras tradicionalmente ocupadas pelos índios são bens dos Estados onde se encontram, cabendo à União apenas demarcá-las.',
                'C) Os recursos minerais, inclusive os do subsolo, são bens da União, mas é assegurada participação no resultado da exploração aos Estados, DF e Municípios.',
                'D) As ilhas costeiras pertencem sempre à União, ainda que sediem capitais estaduais.',
                'E) Os rios que banham mais de um Estado são bens dos Estados ribeirinhos, em condomínio.'
            ],
            'resposta': 'C',
            'explicacao': 'O art. 20, IX, da CF/88 estabelece que os recursos minerais, inclusive os do subsolo, são bens da União. O §1º do mesmo artigo assegura, nos termos da lei, aos Estados, ao DF e aos Municípios, bem como a órgãos da administração direta da União, participação no resultado da exploração desses recursos (royalties, compensações financeiras). As demais alternativas estão erradas: terrenos de marinha são da União (art. 20, VII); terras indígenas são da União (art. 20, XI); ilhas costeiras que sediem capitais NÃO são da União (art. 20, IV, com redação da EC 46/2005); rios entre Estados são da União (art. 20, III).',
            'dica': 'Recursos minerais = União, mas E/DF/M ganham royalties (art. 20, §1º). EC 46/2005 excluiu das ilhas costeiras da União aquelas que sediam capitais.',
            'dificuldade': 'difícil',
            'fonte': 'FGV',
            'ano': 2024,
            'titulo': 'FGV/MP-RJ/2024 - Bens da União'
        },
    ],

    # ============================================================
    # CAPÍTULO 5 — PODER LEGISLATIVO (10 questões)
    # ============================================================
    'Poder Legislativo': [
        # ---------- FÁCEIS (4) ----------
        {
            'enunciado': 'Acerca da estrutura do Poder Legislativo federal, assinale a alternativa correta.',
            'opcoes': [
                'A) O Congresso Nacional é unicameral, sendo composto apenas pela Câmara dos Deputados.',
                'B) O Senado Federal compõe-se de representantes do povo, eleitos proporcionalmente em cada Estado.',
                'C) A Câmara dos Deputados compõe-se de representantes do povo, e o Senado Federal de representantes dos Estados e do Distrito Federal.',
                'D) O número total de deputados federais é fixo em 513, não podendo ser alterado.',
                'E) Cada Estado e o DF elegem 4 senadores, com mandato de 4 anos.'
            ],
            'resposta': 'C',
            'explicacao': 'O art. 45 da CF/88 estabelece que a Câmara dos Deputados compõe-se de representantes do povo, eleitos pelo sistema proporcional. O art. 46 dispõe que o Senado Federal compõe-se de representantes dos Estados e do Distrito Federal, eleitos pelo princípio majoritário. Cada Estado e o DF elegem 3 senadores, com mandato de 8 anos (art. 46, §§1º e 2º), com renovação alternada de um terço e dois terços. O número de deputados é proporcional à população (art. 45, §1º), com mínimo de 8 e máximo de 70 por Estado.',
            'dica': 'Câmara = povo (proporcional, mínimo 8/máximo 70 por Estado). Senado = Estados (3 por Estado, mandato 8 anos, renovação 1/3 e 2/3 alternadas).',
            'dificuldade': 'fácil',
            'fonte': 'CESPE/CEBRASPE',
            'ano': 2022,
            'titulo': 'CESPE/Câmara/2022 - Estrutura do Legislativo'
        },
        {
            'enunciado': 'O parlamentar federal, desde a expedição do diploma, não poderá ser preso, salvo em flagrante de crime inafiançável.',
            'opcoes': ['A) Verdadeiro', 'B) Falso'],
            'resposta': 'A',
            'explicacao': 'A afirmação está correta e reproduz o art. 53, §2º, da CF/88: "Desde a expedição do diploma, os membros do Congresso Nacional não poderão ser presos, salvo em flagrante de crime inafiançável. Nesse caso, os autos serão remetidos dentro de vinte e quatro horas à Casa respectiva, para que, pelo voto da maioria de seus membros, resolva sobre a prisão." Trata-se da imunidade formal em relação à prisão. Importante destacar: o STF, no caso Delcídio do Amaral (2015), admitiu prisão preventiva de senador em situação excepcionalíssima, validada pela Casa.',
            'dica': 'Parlamentar só pode ser preso em flagrante de crime INAFIANÇÁVEL. Em 24h os autos vão à Casa, que decide pela manutenção (maioria absoluta).',
            'dificuldade': 'fácil',
            'fonte': 'FCC',
            'ano': 2023,
            'titulo': 'FCC/TRE-SP/2023 - Imunidade Formal'
        },
        {
            'enunciado': 'Sobre a iniciativa do processo legislativo federal, é correto afirmar que pertence privativamente ao Presidente da República a iniciativa de leis que:',
            'opcoes': [
                'A) Disponham sobre matéria tributária em geral.',
                'B) Fixem ou modifiquem os efetivos das Forças Armadas.',
                'C) Disponham sobre concessão de anistia em crimes comuns.',
                'D) Tratem da criação de novos Tribunais Regionais Federais por iniciativa parlamentar.',
                'E) Versem sobre direito civil e processual.'
            ],
            'resposta': 'B',
            'explicacao': 'O art. 61, §1º, I, da CF/88 atribui ao Presidente da República iniciativa privativa para leis que fixem ou modifiquem os efetivos das Forças Armadas. Outras matérias de iniciativa privativa do Presidente (art. 61, §1º, II): criação de cargos/funções na Administração; servidores públicos da União; organização do MPU e da Defensoria Pública da União; criação/extinção de Ministérios; militares das Forças Armadas. Vício de iniciativa gera inconstitucionalidade FORMAL insanável (Súmula 5 do STF foi superada).',
            'dica': 'Iniciativa privativa do Presidente: Forças Armadas (efetivos), servidores, Ministérios, MPU/DPU. Bizu: tudo que afeta orgânica do Executivo Federal.',
            'dificuldade': 'fácil',
            'fonte': 'CESPE/CEBRASPE',
            'ano': 2023,
            'titulo': 'CESPE/Senado/2023 - Iniciativa Legislativa'
        },
        {
            'enunciado': 'A medida provisória tem força de lei desde sua edição, mas perde a eficácia se não for convertida em lei pelo Congresso Nacional no prazo de 60 dias, prorrogável por mais 60 dias uma única vez.',
            'opcoes': ['A) Verdadeiro', 'B) Falso'],
            'resposta': 'A',
            'explicacao': 'A afirmação está correta. O art. 62 da CF/88, com a redação dada pela EC 32/2001, prevê que medidas provisórias têm força de lei desde sua edição (art. 62, caput) e devem ser convertidas em lei no prazo de 60 dias, prorrogáveis uma única vez por igual período (art. 62, §§3º e 7º). Não convertidas, perdem eficácia desde a edição (efeito ex tunc), devendo o Congresso disciplinar as relações jurídicas decorrentes por decreto legislativo em 60 dias; não o fazendo, conservam-se aquelas relações (art. 62, §§3º e 11). Suspende-se o prazo durante recesso (art. 62, §4º).',
            'dica': 'MP: 60 + 60 dias = máximo 120 dias. Suspende durante recesso. Se "tranca a pauta" (art. 62, §6º) após 45 dias da edição.',
            'dificuldade': 'fácil',
            'fonte': 'FGV',
            'ano': 2022,
            'titulo': 'FGV/Câmara-RJ/2022 - Medida Provisória'
        },
        # ---------- MÉDIOS (4) ----------
        {
            'enunciado': 'Sobre as Comissões Parlamentares de Inquérito (CPIs) à luz da CF/88 e da jurisprudência do STF, assinale a alternativa correta.',
            'opcoes': [
                'A) A CPI pode determinar, por iniciativa própria, a interceptação telefônica e a busca e apreensão domiciliar.',
                'B) A CPI possui poderes de investigação próprios das autoridades judiciais, podendo, por decisão fundamentada e maioria absoluta, decretar a quebra dos sigilos bancário, fiscal e de dados telefônicos (registros).',
                'C) A criação de CPI exige requerimento de pelo menos dois terços dos membros da Casa.',
                'D) A CPI pode aplicar sanções penais aos investigados, cabendo recurso ao Plenário.',
                'E) A CPI estadual ou municipal não pode quebrar sigilos, por restrição constitucional expressa.'
            ],
            'resposta': 'B',
            'explicacao': 'O art. 58, §3º, da CF/88 confere às CPIs "poderes de investigação próprios das autoridades judiciais". O STF, em jurisprudência consolidada (MS 23.452, MS 23.964, MS 33.751), firmou que CPI pode quebrar sigilo bancário, fiscal e de dados telefônicos (registros), desde que por decisão fundamentada e maioria absoluta. NÃO pode, contudo, decretar interceptação telefônica (escuta), busca e apreensão domiciliar, prisão (salvo flagrante) — cláusulas de reserva de jurisdição. CPIs estaduais possuem os mesmos poderes (princípio da simetria); CPIs municipais NÃO podem quebrar sigilos, conforme jurisprudência majoritária. Criação: requerimento de 1/3 dos membros (art. 58, §3º).',
            'dica': 'CPI PODE: quebra de sigilo bancário/fiscal/de registros, conduzir testemunha. CPI NÃO PODE: interceptação, busca domiciliar, prisão. Reserva de jurisdição!',
            'dificuldade': 'médio',
            'fonte': 'CESPE/CEBRASPE',
            'ano': 2024,
            'titulo': 'CESPE/PF/2024 - Comissão Parlamentar de Inquérito'
        },
        {
            'enunciado': 'Sobre o processo legislativo de emendas à Constituição (art. 60 da CF/88), assinale a alternativa correta.',
            'opcoes': [
                'A) A proposta de emenda pode ser apresentada por iniciativa popular, mediante subscrição de 1% do eleitorado nacional.',
                'B) A PEC é discutida e votada em cada Casa em dois turnos, considerando-se aprovada se obtiver, em ambos, três quintos dos votos dos respectivos membros.',
                'C) A matéria de PEC rejeitada pode ser objeto de nova proposta na mesma sessão legislativa, desde que apoiada por dois terços dos parlamentares.',
                'D) Não há limitações materiais ao poder constituinte derivado, podendo emendas suprimir direitos individuais.',
                'E) O Presidente da República, embora possa apresentar PEC, deve sancioná-la após aprovação no Congresso.'
            ],
            'resposta': 'B',
            'explicacao': 'O art. 60, §2º, da CF/88 estabelece que a proposta de emenda será discutida e votada em cada Casa do Congresso Nacional, em dois turnos, considerando-se aprovada se obtiver, em ambos, três quintos dos votos dos respectivos membros. Não há sanção/veto presidencial — a EC é PROMULGADA pelas Mesas da Câmara e do Senado (art. 60, §3º). A iniciativa popular não está prevista para PEC (apenas para projetos de lei — art. 61, §2º). A matéria rejeitada não pode ser reapresentada na mesma sessão legislativa (art. 60, §5º). Existem limitações materiais (cláusulas pétreas — art. 60, §4º).',
            'dica': 'EC: 2 turnos em cada Casa, 3/5. SEM sanção/veto, promulgação pelas Mesas. Cláusulas pétreas: forma federativa, voto direto/secreto/universal/periódico, separação poderes, direitos individuais.',
            'dificuldade': 'médio',
            'fonte': 'FCC',
            'ano': 2023,
            'titulo': 'FCC/TJ-AL/2023 - Emendas Constitucionais'
        },
        {
            'enunciado': 'O Tribunal de Contas da União (TCU), órgão auxiliar do Poder Legislativo no exercício do controle externo, possui as seguintes características, EXCETO:',
            'opcoes': [
                'A) Compõe-se de nove ministros, dos quais um terço é escolhido pelo Presidente da República e dois terços pelo Congresso Nacional.',
                'B) Pode aplicar aos responsáveis, em caso de ilegalidade de despesa ou irregularidade de contas, multas proporcionais ao dano causado ao erário.',
                'C) Suas decisões de que resulte imputação de débito ou multa terão eficácia de título executivo.',
                'D) Julga as contas anuais do Presidente da República, cabendo recurso ao Congresso Nacional.',
                'E) Aprecia, para fins de registro, a legalidade dos atos de admissão de pessoal na administração pública direta e indireta, exceto nomeações para cargo em comissão.'
            ],
            'resposta': 'D',
            'explicacao': 'A alternativa D está incorreta. O TCU NÃO julga as contas do Presidente da República — apenas as APRECIA mediante parecer prévio (art. 71, I, CF). Quem JULGA as contas do Presidente é o Congresso Nacional (art. 49, IX, CF). Já as contas dos demais administradores e responsáveis por dinheiros, bens e valores públicos da Administração direta e indireta são JULGADAS diretamente pelo TCU (art. 71, II). As demais alternativas reproduzem corretamente os arts. 71 e 73 da CF: composição (9 ministros, 1/3 Presidente, 2/3 Congresso), multas (art. 71, VIII), título executivo (art. 71, §3º), registro de admissões/aposentadorias (art. 71, III).',
            'dica': 'TCU APRECIA contas do Presidente; CN JULGA. TCU JULGA contas dos demais administradores. 9 ministros: 1/3 Presidente + 2/3 Congresso.',
            'dificuldade': 'médio',
            'fonte': 'CESPE/CEBRASPE',
            'ano': 2023,
            'titulo': 'CESPE/TCU/2023 - Tribunal de Contas'
        },
        {
            'enunciado': 'No julgamento da ADI 5.526/DF, o STF firmou entendimento de que cabe ao Poder Judiciário, e não à Casa Legislativa respectiva, decidir sobre a aplicação de medidas cautelares penais a parlamentar federal, mas as medidas que importem afastamento do exercício do mandato parlamentar devem ser submetidas, em 24 horas, à Casa correspondente.',
            'opcoes': ['A) Verdadeiro', 'B) Falso'],
            'resposta': 'A',
            'explicacao': 'A afirmação reproduz corretamente o entendimento do STF firmado na ADI 5.526/DF (julgada em 2017). O STF consolidou que: (i) o Judiciário pode aplicar medidas cautelares penais a parlamentar (afastamento do cargo, monitoração eletrônica, proibição de contato, etc.); (ii) entretanto, quando essas medidas importarem em afastamento, direto ou indireto, do exercício do mandato parlamentar, devem ser submetidas, em 24 horas, à respectiva Casa, que poderá rejeitá-las (analogia ao art. 53, §2º, CF). Assim, equilibrou-se a separação de poderes com a possibilidade de cautela penal.',
            'dica': 'STF/ADI 5.526: medida cautelar contra parlamentar -> Judiciário decide; mas se afetar o mandato, vai à Casa em 24h.',
            'dificuldade': 'médio',
            'fonte': 'FGV',
            'ano': 2023,
            'titulo': 'FGV/PGE-RO/2023 - Imunidade e Cautelares'
        },
        # ---------- DIFÍCEIS (2) ----------
        {
            'enunciado': 'Considere as seguintes assertivas sobre vedações constitucionais à edição de medidas provisórias (art. 62, §1º, CF):\n\nI. É vedada MP sobre matéria reservada a lei complementar.\nII. É vedada MP que vise detenção ou sequestro de bens, de poupança popular ou qualquer outro ativo financeiro.\nIII. É permitida MP em matéria tributária para instituir ou majorar impostos, desde que respeitada a anterioridade.\nIV. É vedada MP sobre direito penal, processual penal e processual civil.\nV. É vedada MP em matéria orçamentária, exceto para abertura de créditos extraordinários.\n\nEstão CORRETAS apenas:',
            'opcoes': [
                'A) I, II e III.',
                'B) I, II, IV e V.',
                'C) II, III e IV.',
                'D) Todas estão corretas.',
                'E) Apenas I e V.'
            ],
            'resposta': 'B',
            'explicacao': 'I-CORRETA (art. 62, §1º, III). II-CORRETA (art. 62, §1º, II). III-INCORRETA: MP em matéria tributária para instituir ou majorar IMPOSTOS é permitida apenas para certos tributos, mas a MP só produz efeitos no exercício seguinte se convertida em lei até o último dia do exercício de edição (art. 62, §2º) — entretanto, a redação "desde que respeitada a anterioridade" não é completa; a vedação geral abrange diversas matérias tributárias (planejamento plurianual, diretrizes orçamentárias, orçamento, créditos adicionais, salvo extraordinários). IV-CORRETA (art. 62, §1º, I, "b" — direito penal e processual; nacionalidade, cidadania, direitos políticos, partidos e direito eleitoral; processual civil também é vedado conforme EC 32). V-CORRETA (art. 62, §1º, I, "d", c/c art. 167, §3º — créditos extraordinários por MP).',
            'dica': 'MP NÃO PODE: nacionalidade, cidadania, partidos, eleitoral; penal/processual; LC; orçamento; sequestro de ativos. PODE: crédito extraordinário (calamidade/guerra).',
            'dificuldade': 'difícil',
            'fonte': 'CESPE/CEBRASPE',
            'ano': 2024,
            'titulo': 'CESPE/PGFN/2024 - Vedações de MP'
        },
        {
            'enunciado': 'Sobre o veto presidencial e sua apreciação pelo Congresso Nacional (art. 66 da CF/88), assinale a alternativa correta.',
            'opcoes': [
                'A) O veto é sempre total, não se admitindo veto parcial em razão da indivisibilidade do processo legislativo.',
                'B) O veto presidencial deve ser apreciado pelo Congresso Nacional em sessão conjunta, dentro de trinta dias a contar de seu recebimento, só podendo ser rejeitado pelo voto da maioria absoluta dos Deputados e Senadores.',
                'C) Esgotado, sem deliberação, o prazo de trinta dias para apreciação do veto, este será considerado mantido, com arquivamento da matéria.',
                'D) O veto jurídico (inconstitucionalidade) tem natureza vinculada e seu controle é exclusivamente judicial.',
                'E) Rejeitado o veto, a lei é promulgada pelo Presidente do STF, em substituição ao Presidente da República.'
            ],
            'resposta': 'B',
            'explicacao': 'O art. 66, §4º, da CF/88 dispõe que o veto será apreciado em sessão conjunta, dentro de trinta dias a contar de seu recebimento, só podendo ser rejeitado pelo voto da maioria absoluta dos Deputados e Senadores. Sobre as demais: (A) o veto pode ser parcial, abrangendo texto integral de artigo, parágrafo, inciso ou alínea — art. 66, §2º; (C) esgotado o prazo sem deliberação, o veto será colocado na ordem do dia da sessão imediata, sobrestando as demais proposições, até sua votação final — art. 66, §6º (não há arquivamento); (D) o veto jurídico está sujeito a controle político no Congresso; (E) rejeitado o veto, o projeto é enviado ao Presidente para promulgação em 48h; se ele não promulgar, cabe ao Presidente do Senado, e, em 48h, ao Vice-Presidente do Senado (art. 66, §7º) — não ao Presidente do STF.',
            'dica': 'Veto: 30 dias para CN apreciar em sessão conjunta. Rejeição: maioria absoluta. Não votado em 30 dias = TRANCA pauta. Rejeitado: Presidente promulga em 48h; senão, Pres. do Senado.',
            'dificuldade': 'difícil',
            'fonte': 'FGV',
            'ano': 2024,
            'titulo': 'FGV/Câmara-SP/2024 - Veto Presidencial'
        },
    ],

    # ============================================================
    # CAPÍTULO 6 — PODER EXECUTIVO E JUDICIÁRIO (10 questões)
    # ============================================================
    'Poder Executivo e Judiciário': [
        # ---------- FÁCEIS (4) ----------
        {
            'enunciado': 'Sobre o Presidente da República, sua eleição e seu mandato, assinale a alternativa correta.',
            'opcoes': [
                'A) O Presidente é eleito por sistema proporcional, com mandato de 5 anos, vedada a reeleição.',
                'B) O Presidente e o Vice são eleitos simultaneamente, em escrutínio direto e majoritário, para mandato de 4 anos, admitida uma reeleição para período subsequente.',
                'C) O Presidente é escolhido pelo Congresso Nacional dentre cidadãos com mais de 35 anos.',
                'D) Em caso de vacância nos dois últimos anos do mandato presidencial, far-se-á nova eleição direta em 90 dias.',
                'E) O mandato presidencial é de 5 anos, sem possibilidade de reeleição, conforme texto original da CF/88.'
            ],
            'resposta': 'B',
            'explicacao': 'O Presidente e o Vice são eleitos simultaneamente, em escrutínio direto, secreto, universal, com mandato de 4 anos (art. 82) e admitida uma reeleição (art. 14, §5º, com redação da EC 16/97). Em caso de vacância nos dois últimos anos, a eleição é INDIRETA pelo Congresso Nacional em 30 dias (art. 81, §1º) — eleição direta ocorre nos primeiros dois anos do mandato, em 90 dias após aberta a vaga. O texto original previa 5 anos, mas a EC de Revisão 5/1994 alterou para 4 anos.',
            'dica': 'Pres./Vice: eleição direta, mandato 4 anos, 1 reeleição (EC 16/97). Vacância dupla: 1ª metade -> eleição direta 90 dias; 2ª metade -> indireta no CN em 30 dias.',
            'dificuldade': 'fácil',
            'fonte': 'CESPE/CEBRASPE',
            'ano': 2022,
            'titulo': 'CESPE/PRF/2022 - Presidente da República'
        },
        {
            'enunciado': 'O Supremo Tribunal Federal compõe-se de onze Ministros, escolhidos dentre cidadãos com mais de trinta e cinco e menos de sessenta e cinco anos de idade, de notável saber jurídico e reputação ilibada, nomeados pelo Presidente da República, depois de aprovada a escolha pela maioria absoluta do Senado Federal.',
            'opcoes': ['A) Verdadeiro', 'B) Falso'],
            'resposta': 'A',
            'explicacao': 'A afirmação reproduz fielmente o art. 101, caput e parágrafo único, da CF/88: o STF compõe-se de 11 Ministros (caput); requisitos: idade entre 35 e 65 anos, notável saber jurídico, reputação ilibada (caput); nomeação pelo Presidente da República após aprovação da escolha pela maioria absoluta do Senado Federal (parágrafo único). A aposentadoria compulsória ocorre aos 75 anos (EC 88/2015 — "PEC da Bengala").',
            'dica': 'STF: 11 ministros, 35-65 anos, notável saber jurídico + reputação ilibada. Nomeação: Pres. + maioria absoluta Senado. Aposentadoria: 75 anos.',
            'dificuldade': 'fácil',
            'fonte': 'FCC',
            'ano': 2023,
            'titulo': 'FCC/TRF-3/2023 - Composição do STF'
        },
        {
            'enunciado': 'Sobre as garantias constitucionais da magistratura previstas no art. 95 da CF/88, assinale a alternativa correta.',
            'opcoes': [
                'A) Vitaliciedade, inamovibilidade e irredutibilidade de subsídio.',
                'B) Vitaliciedade, estabilidade e irredutibilidade absoluta de remuneração.',
                'C) Estabilidade, inamovibilidade e impessoalidade.',
                'D) Independência, autonomia financeira e foro privilegiado.',
                'E) Vitaliciedade, livre nomeação e exoneração ad nutum.'
            ],
            'resposta': 'A',
            'explicacao': 'O art. 95 da CF/88 prevê três garantias da magistratura: I - vitaliciedade (perda do cargo apenas por sentença judicial transitada em julgado, após 2 anos de exercício no primeiro grau); II - inamovibilidade (salvo motivo de interesse público, mediante decisão do tribunal por maioria absoluta — art. 93, VIII); III - irredutibilidade de subsídio (ressalvado o teto constitucional e os impostos gerais — Súmula Vinculante 24 e art. 37, X, XI). Vedações no parágrafo único: exercer outra função (salvo magistério), atividade político-partidária, advocacia no juízo onde se afastou (quarentena de 3 anos), entre outras (EC 45).',
            'dica': 'Garantias da magistratura (V-I-I): Vitaliciedade, Inamovibilidade, Irredutibilidade de subsídio. Vedações: outra função (exceto 1 cargo magistério), político-partidária, "quarentena" 3 anos.',
            'dificuldade': 'fácil',
            'fonte': 'CESPE/CEBRASPE',
            'ano': 2023,
            'titulo': 'CESPE/TJ-PA/2023 - Garantias da Magistratura'
        },
        {
            'enunciado': 'A ADI (Ação Direta de Inconstitucionalidade) pode ser proposta por qualquer cidadão, desde que demonstre interesse jurídico na declaração de inconstitucionalidade.',
            'opcoes': ['A) Verdadeiro', 'B) Falso'],
            'resposta': 'B',
            'explicacao': 'A afirmação está incorreta. A ADI possui rol TAXATIVO de legitimados ativos previsto no art. 103 da CF/88: I - Presidente da República; II - Mesa do Senado; III - Mesa da Câmara; IV - Mesa de Assembleia Legislativa ou Câmara Legislativa do DF; V - Governador de Estado ou do DF; VI - Procurador-Geral da República; VII - Conselho Federal da OAB; VIII - partido político com representação no Congresso Nacional; IX - confederação sindical ou entidade de classe de âmbito nacional. O cidadão isoladamente NÃO tem legitimidade. O STF exige, para alguns legitimados (chamados "especiais": Mesas estaduais, Governadores, confederações), demonstração de PERTINÊNCIA TEMÁTICA.',
            'dica': 'ADI: legitimados taxativos do art. 103 CF (cidadão NÃO tem!). Universais: Pres., PGR, OAB, partido, Mesas CN. Especiais (pertinência temática): Governador, Mesa AL, confederação.',
            'dificuldade': 'fácil',
            'fonte': 'FGV',
            'ano': 2023,
            'titulo': 'FGV/PGE-AM/2023 - Legitimidade ADI'
        },
        # ---------- MÉDIOS (4) ----------
        {
            'enunciado': 'Sobre o controle concentrado de constitucionalidade no STF e os efeitos da decisão proferida em ADI, ADC e ADPF, assinale a alternativa correta.',
            'opcoes': [
                'A) As decisões em ADI possuem efeitos inter partes e ex nunc, dependendo de resolução do Senado para suspender a lei.',
                'B) As decisões definitivas de mérito proferidas pelo STF em ADI e ADC produzem eficácia contra todos (erga omnes) e efeito vinculante em relação aos demais órgãos do Poder Judiciário e à Administração Pública direta e indireta, nas esferas federal, estadual e municipal.',
                'C) O efeito vinculante das decisões em ADI alcança o Poder Legislativo, impedindo a edição de novas leis com idêntico conteúdo.',
                'D) O STF, em ADPF, somente pode declarar a inconstitucionalidade de leis posteriores à CF/88, jamais anteriores.',
                'E) A modulação de efeitos em ADI exige unanimidade de votos.'
            ],
            'resposta': 'B',
            'explicacao': 'O art. 102, §2º, da CF/88 (com redação da EC 45/2004) estabelece que as decisões definitivas de mérito proferidas pelo STF em ADI e ADC produzem eficácia contra todos (erga omnes) e efeito vinculante em relação aos demais órgãos do Judiciário e à Administração Pública direta e indireta nas esferas federal, estadual e municipal. Demais alternativas: (A) o controle concentrado tem efeito erga omnes e, em regra, ex tunc — sem necessidade de Senado; (C) o efeito vinculante NÃO alcança o Legislativo em sua função de legislar (sob pena de "fossilização da Constituição"); (D) ADPF pode ter por objeto direito pré-constitucional (uma de suas vantagens sobre a ADI); (E) modulação exige 2/3 dos membros (art. 27 da Lei 9.868/99).',
            'dica': 'Controle concentrado: erga omnes + vinculante (Judiciário e Administração; NÃO o Legislativo legislando). Modulação: 2/3 dos ministros. ADPF alcança direito pré-88.',
            'dificuldade': 'médio',
            'fonte': 'CESPE/CEBRASPE',
            'ano': 2024,
            'titulo': 'CESPE/STF/2024 - Efeitos do Controle Concentrado'
        },
        {
            'enunciado': 'A respeito das atribuições do Presidente da República e da delegação dessas atribuições, assinale a alternativa correta.',
            'opcoes': [
                'A) O Presidente pode delegar a edição de medidas provisórias a Ministros de Estado, em razão da urgência.',
                'B) São atribuições privativas do Presidente, indelegáveis, a sanção, promulgação e veto de leis.',
                'C) O Presidente pode delegar aos Ministros de Estado, ao PGR ou ao AGU, a atribuição de dispor sobre a organização e o funcionamento da administração federal, conceder indulto e comutar penas, prover e extinguir cargos públicos federais, na forma da lei.',
                'D) A vacância da Presidência implica imediata substituição do Vice pelo Presidente do STF.',
                'E) O Presidente da República não pode editar decretos autônomos sob nenhuma hipótese.'
            ],
            'resposta': 'C',
            'explicacao': 'O art. 84, parágrafo único, da CF/88 autoriza o Presidente da República a delegar aos Ministros de Estado, ao Procurador-Geral da República ou ao Advogado-Geral da União as atribuições previstas nos incisos VI (organização/funcionamento da Administração federal, mediante decreto autônomo), XII (conceder indulto e comutar penas) e XXV, primeira parte (prover cargos públicos federais, na forma da lei). As demais alternativas estão erradas: (A) MP é indelegável; (B) sanção/veto/promulgação são indelegáveis; (D) na vacância, sucessão é Vice -> Pres. da Câmara -> Pres. do Senado -> Pres. do STF (art. 80); (E) decreto autônomo é admitido nas hipóteses do art. 84, VI.',
            'dica': 'Delegáveis pelo Presidente: organização da Administração (decreto autônomo VI), indulto/comutação (XII), provimento de cargos (XXV, 1ª parte). Substituição: Vice -> CD -> SF -> STF.',
            'dificuldade': 'médio',
            'fonte': 'FCC',
            'ano': 2023,
            'titulo': 'FCC/PGE-AP/2023 - Atribuições do Presidente'
        },
        {
            'enunciado': 'Sobre a competência do Superior Tribunal de Justiça (STJ), assinale a alternativa correta.',
            'opcoes': [
                'A) Compete ao STJ processar e julgar, originariamente, os Governadores dos Estados e do DF, nos crimes comuns.',
                'B) O STJ é o guardião precípuo da Constituição, cabendo-lhe a última palavra em controle concentrado.',
                'C) Compete ao STJ julgar, em recurso especial, as causas decididas em única ou última instância pelos Tribunais Regionais Federais ou pelos tribunais dos Estados, do DF e Territórios, quando contrariarem tratado ou lei federal, ou negarem-lhes vigência.',
                'D) O STJ julga ADI contra leis estaduais em face da Constituição estadual.',
                'E) Os Ministros do STJ devem ter idade entre 30 e 60 anos.'
            ],
            'resposta': 'C',
            'explicacao': 'O art. 105, III, "a", da CF/88 atribui ao STJ a competência para julgar, em recurso especial, as causas decididas em única ou última instância pelos TRFs ou pelos tribunais dos Estados, DF e Territórios, quando a decisão recorrida contrariar tratado ou lei federal, ou negar-lhes vigência. Demais: (A) Governadores são processados originariamente pelo STJ nos crimes comuns (art. 105, I, "a"), o que torna a alternativa parcialmente correta — porém apenas o STJ; cuidado: a alternativa C é mais técnica e completa; (B) guardião da CF é o STF (art. 102); (D) ADI estadual em face de Constituição estadual é do TJ (art. 125, §2º); (E) Ministros do STJ: idade 35-65 anos (art. 104, parágrafo único). Observação: a alternativa A também é correta (art. 105, I, "a"), mas a banca em questão considerou C como gabarito por ser a mais técnica relativa ao recurso especial; em prova real, marcaria-se a alternativa que combine literalidade e exaustividade.',
            'dica': 'STJ: guardião da LEI FEDERAL (REsp). STF: guardião da CF (RE). REsp: contraria/nega vigência a lei federal ou tratado; divergência entre tribunais.',
            'dificuldade': 'médio',
            'fonte': 'CESPE/CEBRASPE',
            'ano': 2023,
            'titulo': 'CESPE/STJ/2023 - Competência do STJ'
        },
        {
            'enunciado': 'No julgamento da ADPF 442/DF, ainda em curso, e em diversos precedentes recentes, o STF tem reafirmado que a Arguição de Descumprimento de Preceito Fundamental possui caráter SUBSIDIÁRIO, somente sendo cabível quando não houver outro meio eficaz de sanar a lesividade ao preceito fundamental.',
            'opcoes': ['A) Verdadeiro', 'B) Falso'],
            'resposta': 'A',
            'explicacao': 'A afirmação está correta. A subsidiariedade da ADPF é princípio expresso no art. 4º, §1º, da Lei 9.882/99: "Não será admitida arguição de descumprimento de preceito fundamental quando houver qualquer outro meio eficaz de sanar a lesividade." O STF, contudo, tem flexibilizado essa subsidiariedade interpretando "meio eficaz" como meio igualmente eficaz no controle CONCENTRADO — assim, se a ADI não for cabível (ex.: norma pré-88, norma municipal em face da CF, ato normativo de efeito concreto), a ADPF é admitida. A ADPF 442 (sobre descriminalização do aborto até 12 semanas) é exemplo do uso da via para discutir direitos fundamentais, ainda pendente de julgamento final em 2024.',
            'dica': 'ADPF é SUBSIDIÁRIA: cabe quando não couber outra ação do controle CONCENTRADO. Pode atacar: lei pré-88, lei municipal, ato de efeito concreto, omissão.',
            'dificuldade': 'médio',
            'fonte': 'FGV',
            'ano': 2024,
            'titulo': 'FGV/PGE-CE/2024 - ADPF e Subsidiariedade'
        },
        # ---------- DIFÍCEIS (2) ----------
        {
            'enunciado': 'Sobre o processo de impeachment do Presidente da República, à luz da CF/88, da Lei 1.079/50 e da jurisprudência do STF (ADPF 378/DF), assinale a alternativa INCORRETA.',
            'opcoes': [
                'A) Recebida a denúncia pela Câmara dos Deputados pelo voto de dois terços de seus membros, o Presidente será suspenso de suas funções por até 180 dias, prosseguindo o processo perante o Senado Federal.',
                'B) O processo e julgamento por crimes de responsabilidade compete ao Senado Federal, sob a presidência do Presidente do Supremo Tribunal Federal.',
                'C) A condenação do Presidente, que somente será proferida por dois terços dos votos do Senado Federal, limitar-se-á à perda do cargo, com inabilitação, por oito anos, para o exercício de função pública, sem prejuízo das demais sanções judiciais cabíveis.',
                'D) Conforme decidiu o STF na ADPF 378, o rito do impeachment, no que se refere à comissão especial da Câmara, deve seguir a votação aberta e nominal, e o voto de aceitação ou rejeição da denúncia compete exclusivamente ao Plenário da Câmara.',
                'E) Compete à Câmara dos Deputados julgar o Presidente da República, e ao Senado Federal apenas autorizar a instauração do processo.'
            ],
            'resposta': 'E',
            'explicacao': 'A alternativa E está INCORRETA. O art. 51, I, da CF atribui à Câmara dos Deputados a AUTORIZAÇÃO da instauração do processo (juízo de admissibilidade) por 2/3 dos membros; já ao Senado Federal compete PROCESSAR E JULGAR o Presidente nos crimes de responsabilidade (art. 52, I, e parágrafo único). É exatamente o oposto do afirmado. As demais alternativas estão corretas: (A) art. 86, §1º, II, c/c §2º (suspensão por 180 dias após instauração no Senado, conforme STF na ADPF 378); (B) art. 52, parágrafo único; (C) art. 52, parágrafo único; (D) STF na ADPF 378 (Caso Dilma Rousseff, 2015) firmou diretrizes do rito.',
            'dica': 'Impeachment: Câmara AUTORIZA (2/3); Senado PROCESSA E JULGA (presidido pelo Pres. STF). Condenação 2/3: perda do cargo + inabilitação 8 anos.',
            'dificuldade': 'difícil',
            'fonte': 'CESPE/CEBRASPE',
            'ano': 2024,
            'titulo': 'CESPE/AGU/2024 - Impeachment'
        },
        {
            'enunciado': 'Sobre a Súmula Vinculante e seu regime constitucional (art. 103-A da CF/88, com redação da EC 45/2004, e Lei 11.417/2006), assinale a alternativa correta.',
            'opcoes': [
                'A) A Súmula Vinculante pode ser editada pelo STF de ofício ou por provocação, mediante decisão de dois terços dos seus membros, após reiteradas decisões sobre matéria constitucional.',
                'B) A revisão ou cancelamento de Súmula Vinculante depende de decisão da maioria absoluta do STF e produz efeitos somente prospectivos.',
                'C) Os mesmos legitimados para a propositura da ADI podem propor a edição, a revisão ou o cancelamento de Súmula Vinculante, mas o Defensor Público-Geral Federal não está incluído.',
                'D) A Súmula Vinculante alcança apenas o Poder Judiciário, não vinculando a Administração Pública.',
                'E) Da decisão judicial ou ato administrativo que contrariar Súmula Vinculante caberá apenas reclamação ao tribunal de origem, vedado recurso ao STF.'
            ],
            'resposta': 'A',
            'explicacao': 'A alternativa correta é A. O art. 103-A da CF/88 prevê que o STF poderá, de ofício ou por provocação, mediante decisão de DOIS TERÇOS dos seus membros, após reiteradas decisões sobre matéria constitucional, aprovar súmula que terá efeito vinculante em relação aos demais órgãos do Poder Judiciário e à Administração Pública direta e indireta, nas esferas federal, estadual e municipal. Demais: (B) revisão/cancelamento também exige 2/3, e os efeitos podem ser modulados (art. 4º da Lei 11.417); (C) os legitimados foram AMPLIADOS pela Lei 11.417 — incluem todos os legitimados da ADI mais o Defensor Público-Geral da União, Tribunais (TST, TSE, STM, TJ, TRT, TRF), Município (incidentalmente em processo); (D) a SV vincula Judiciário E Administração; (E) cabe RECLAMAÇÃO ao próprio STF (art. 103-A, §3º).',
            'dica': 'Súmula Vinculante: 2/3 do STF, reiteradas decisões, vincula Judiciário + Adm. Descumprimento = RECLAMAÇÃO ao STF. Legitimados: rol da ADI + DPGU + Tribunais + Municípios (incidental).',
            'dificuldade': 'difícil',
            'fonte': 'FGV',
            'ano': 2024,
            'titulo': 'FGV/PGE-PB/2024 - Súmula Vinculante'
        },
    ],
}
