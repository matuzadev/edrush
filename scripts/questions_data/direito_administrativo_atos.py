"""
Direito Administrativo — Atos, Licitações e Servidores
30 questões cobrindo 3 capítulos
"""

CAPITULOS = [
    {
        'numero': 3,
        'titulo': 'Atos Administrativos',
        'descricao': 'Conceito, atributos, elementos, classificações, vícios, anulação, revogação e convalidação dos atos administrativos.'
    },
    {
        'numero': 4,
        'titulo': 'Licitações e Contratos Administrativos',
        'descricao': 'Nova Lei de Licitações (Lei 14.133/2021), modalidades, princípios, contratos administrativos e cláusulas exorbitantes.'
    },
    {
        'numero': 5,
        'titulo': 'Servidores Públicos',
        'descricao': 'Regime jurídico dos servidores (Lei 8.112/1990), provimento, posse, exercício, estabilidade, vacância e responsabilidades.'
    },
]

QUESTOES = {
    'Atos Administrativos': [
        {
            'enunciado': 'Sobre os atributos dos atos administrativos, julgue o item: a autoexecutoriedade permite que a Administração Pública execute diretamente suas decisões, sem necessidade de prévia autorização judicial, estando presente em todos os atos administrativos por decorrência direta do princípio da supremacia do interesse público.',
            'opcoes': ['A) Verdadeiro', 'B) Falso'],
            'resposta': 'B',
            'explicacao': 'A autoexecutoriedade NÃO está presente em todos os atos administrativos. Ela só existe quando: (i) a lei expressamente autoriza ou (ii) em situações de urgência, para resguardar o interesse público. Atos de cobrança de multa, por exemplo, não são autoexecutórios — a Administração precisa recorrer ao Judiciário (execução fiscal). A doutrina majoritária (Maria Sylvia Di Pietro) distingue exigibilidade (presente sempre) de executoriedade (excepcional).',
            'dica': 'Autoexecutoriedade ≠ todos os atos. Multa é exigível, mas NÃO é autoexecutória.',
            'dificuldade': 'médio',
            'fonte': 'CESPE',
            'ano': 2023,
            'titulo': 'CESPE/TRF/2023 - Atributos dos Atos Administrativos'
        },
        {
            'enunciado': 'Quanto aos elementos do ato administrativo, assinale a alternativa CORRETA acerca do elemento "motivo":',
            'opcoes': [
                'A) O motivo é sempre vinculado, ainda que se trate de ato discricionário.',
                'B) O motivo é o pressuposto fático e jurídico que enseja a prática do ato; havendo motivação, esta vincula a Administração nos termos da teoria dos motivos determinantes.',
                'C) Motivo e motivação são sinônimos para fins de controle de legalidade.',
                'D) A ausência de motivo é vício sanável por convalidação.',
                'E) O motivo do ato administrativo dispensa correspondência com a realidade fática quando se tratar de ato discricionário.'
            ],
            'resposta': 'B',
            'explicacao': 'O motivo é o pressuposto de fato e de direito que fundamenta o ato. A teoria dos motivos determinantes (consolidada pelo STF e STJ) estabelece que, uma vez declarados os motivos, estes vinculam a Administração: se forem falsos ou inexistentes, o ato é nulo. Motivo (elemento do ato) é diferente de motivação (exposição dos motivos). A motivação é, em regra, obrigatória (art. 50 da Lei 9.784/1999).',
            'dica': 'Motivo declarado falso = ato nulo (teoria dos motivos determinantes).',
            'dificuldade': 'médio',
            'fonte': 'FCC',
            'ano': 2022,
            'titulo': 'FCC/TRT/2022 - Elementos do Ato Administrativo'
        },
        {
            'enunciado': 'Sobre anulação e revogação dos atos administrativos, conforme entendimento sumulado do STF e a Lei 9.784/1999, é CORRETO afirmar:',
            'opcoes': [
                'A) A revogação opera efeitos ex tunc, retroagindo à data da edição do ato revogado.',
                'B) A Administração pode anular seus próprios atos quando eivados de vícios de legalidade, no prazo decadencial de 5 anos quando deles decorrerem efeitos favoráveis ao destinatário, salvo má-fé.',
                'C) A revogação pode atingir atos vinculados, desde que haja superveniente interesse público.',
                'D) O Poder Judiciário pode revogar atos administrativos editados por outros Poderes, no exercício do controle externo.',
                'E) A anulação é discricionária; a revogação é vinculada.'
            ],
            'resposta': 'B',
            'explicacao': 'A alternativa correta reproduz o art. 54 da Lei 9.784/1999: prazo decadencial de 5 anos para anular atos que gerem efeitos favoráveis, ressalvada má-fé. A anulação opera ex tunc; a revogação ex nunc. A Súmula 473 do STF consagra a autotutela: a Administração pode anular seus atos ilegais e revogar os inconvenientes/inoportunos, observados direitos adquiridos. Atos vinculados NÃO podem ser revogados; o Judiciário NÃO revoga atos de outros Poderes (apenas anula por ilegalidade).',
            'dica': 'Súmula 473/STF + art. 54 da Lei 9.784/99: 5 anos, salvo má-fé.',
            'dificuldade': 'difícil',
            'fonte': 'CESPE',
            'ano': 2023,
            'titulo': 'CESPE/TJ/2023 - Anulação e Revogação'
        },
        {
            'enunciado': 'Acerca da convalidação dos atos administrativos, julgue o item: a convalidação é admitida em vícios de competência (em razão da pessoa, exceto quando se tratar de competência exclusiva) e de forma (quando esta não for essencial), produzindo efeitos retroativos.',
            'opcoes': ['A) Verdadeiro', 'B) Falso'],
            'resposta': 'A',
            'explicacao': 'O art. 55 da Lei 9.784/1999 admite a convalidação de defeitos sanáveis quando não acarretem lesão ao interesse público nem prejuízo a terceiros. A doutrina majoritária aceita convalidação em vícios de COMPETÊNCIA (em razão da pessoa, salvo competência exclusiva ou em razão da matéria) e de FORMA (quando não essencial). Vícios de motivo, objeto e finalidade, em regra, NÃO se convalidam. A convalidação tem efeitos ex tunc.',
            'dica': 'Convalida: COmpetência + FOrma (FOCO). Não convalida: motivo, objeto, finalidade.',
            'dificuldade': 'médio',
            'fonte': 'CESPE',
            'ano': 2024,
            'titulo': 'CESPE/PGE/2024 - Convalidação'
        },
        {
            'enunciado': 'Quanto à classificação dos atos administrativos, assinale a alternativa CORRETA:',
            'opcoes': [
                'A) Atos gerais e atos individuais distinguem-se pelo grau de discricionariedade do agente.',
                'B) Atos negociais são aqueles em que a Administração concorda com pretensão do particular, gerando situação jurídica individual (ex.: licença, permissão, autorização).',
                'C) Atos enunciativos têm caráter constitutivo de direitos.',
                'D) Atos compostos são formados pela vontade de dois ou mais órgãos independentes.',
                'E) Os atos administrativos vinculados não estão sujeitos a controle judicial de mérito.'
            ],
            'resposta': 'B',
            'explicacao': 'Atos negociais são aqueles em que há manifestação de vontade da Administração coincidente com a pretensão do particular: licença (vinculada), autorização (discricionária), permissão (discricionária), admissão. Atos gerais x individuais distinguem-se pelos destinatários (indeterminados x determinados). Atos enunciativos (certidões, atestados) são meramente declaratórios. Atos compostos têm uma vontade principal e outra acessória do mesmo órgão; complexos têm vontades de órgãos distintos. Atos vinculados sofrem controle judicial pleno (legalidade), não de mérito.',
            'dica': 'Negociais = Administração + particular = LPA (Licença, Permissão, Autorização).',
            'dificuldade': 'médio',
            'fonte': 'FCC',
            'ano': 2023,
            'titulo': 'FCC/TCE/2023 - Classificação dos Atos'
        },
        {
            'enunciado': 'Sobre os vícios do ato administrativo, julgue o item: o desvio de finalidade ocorre quando o agente público, embora competente, pratica o ato visando a finalidade diversa daquela prevista em lei, ainda que esta nova finalidade seja também de interesse público.',
            'opcoes': ['A) Verdadeiro', 'B) Falso'],
            'resposta': 'A',
            'explicacao': 'O desvio de finalidade (ou desvio de poder) é vício no elemento FINALIDADE e ocorre quando o ato é praticado para fim diverso do previsto em lei, mesmo que o novo fim seja também público. Ex.: remoção de servidor com fim punitivo (desvio), pois remoção tem finalidade de interesse do serviço. O art. 2º, parágrafo único, "e", da Lei 4.717/1965 (Lei da Ação Popular) define o desvio de finalidade. Trata-se de vício insanável (não convalidável).',
            'dica': 'Desvio de finalidade = "fim certo, mas errado" — não importa se também é público.',
            'dificuldade': 'fácil',
            'fonte': 'CESPE',
            'ano': 2022,
            'titulo': 'CESPE/MPU/2022 - Vícios dos Atos'
        },
        {
            'enunciado': 'A respeito da presunção de legitimidade dos atos administrativos, assinale a alternativa CORRETA:',
            'opcoes': [
                'A) É presunção absoluta (jure et de jure), não admitindo prova em contrário.',
                'B) É presunção relativa (juris tantum) e inverte o ônus da prova, cabendo ao administrado demonstrar a invalidade do ato.',
                'C) Aplica-se apenas aos atos vinculados.',
                'D) Decorre exclusivamente do princípio da legalidade estrita.',
                'E) Impede o controle judicial dos atos administrativos.'
            ],
            'resposta': 'B',
            'explicacao': 'A presunção de legitimidade (e veracidade) é JURIS TANTUM — relativa, admitindo prova em contrário. Sua principal consequência prática é a INVERSÃO DO ÔNUS PROBATÓRIO: presume-se que o ato é legítimo, conforme à lei e aos fatos, cabendo a quem alega o vício comprová-lo. Aplica-se a todos os atos (vinculados e discricionários) e decorre dos princípios da legalidade, eficiência e continuidade do serviço público. Não impede o controle judicial.',
            'dica': 'Presunção relativa + inversão do ônus da prova ao administrado.',
            'dificuldade': 'fácil',
            'fonte': 'FCC',
            'ano': 2022,
            'titulo': 'FCC/TJ/2022 - Presunção de Legitimidade'
        },
        {
            'enunciado': 'Sobre a teoria das nulidades dos atos administrativos, segundo o entendimento do STJ e a doutrina majoritária, é CORRETO afirmar:',
            'opcoes': [
                'A) A teoria das nulidades no Direito Administrativo é idêntica à do Direito Civil.',
                'B) Atos nulos não geram efeitos jurídicos, mas devem ser preservados aqueles produzidos perante terceiros de boa-fé, em homenagem à segurança jurídica.',
                'C) Atos anuláveis não podem ser convalidados em nenhuma hipótese.',
                'D) A declaração de nulidade depende sempre de provimento judicial.',
                'E) Atos inexistentes equiparam-se aos nulos para todos os efeitos.'
            ],
            'resposta': 'B',
            'explicacao': 'O STJ e a doutrina (Celso Antônio Bandeira de Mello) sustentam que, embora os atos nulos não produzam efeitos juridicamente válidos, devem ser preservados os efeitos produzidos perante terceiros de BOA-FÉ, em respeito à segurança jurídica e à proteção da confiança legítima (art. 24 da LINDB). A teoria das nulidades no Direito Administrativo é PRÓPRIA, não se confunde com a do Direito Civil. A Administração pode declarar a nulidade (autotutela — Súmula 473/STF). Atos anuláveis podem, sim, ser convalidados.',
            'dica': 'Nulidade no D. Administrativo: protege terceiros de boa-fé (segurança jurídica).',
            'dificuldade': 'difícil',
            'fonte': 'CESPE',
            'ano': 2024,
            'titulo': 'CESPE/AGU/2024 - Teoria das Nulidades'
        },
        {
            'enunciado': 'Acerca dos atos administrativos discricionários, julgue o item: o controle judicial sobre tais atos é admitido pelo STF, podendo o Judiciário analisar a razoabilidade e a proporcionalidade da decisão administrativa, sem que isso configure invasão do mérito administrativo.',
            'opcoes': ['A) Verdadeiro', 'B) Falso'],
            'resposta': 'A',
            'explicacao': 'O STF e o STJ consolidaram que o Judiciário PODE controlar a razoabilidade e proporcionalidade dos atos discricionários, pois tais princípios integram o conceito de LEGALIDADE em sentido amplo (juridicidade). Não se trata de controle de mérito (conveniência e oportunidade), mas de controle de legalidade qualificado. STF, RE 661.256 e diversos julgados do STJ. A teoria dos limites internos da discricionariedade (Andreas Krell) reforça esse entendimento. Atos manifestamente desproporcionais são ilegais.',
            'dica': 'Razoabilidade e proporcionalidade = controle de legalidade, não de mérito.',
            'dificuldade': 'médio',
            'fonte': 'CESPE',
            'ano': 2023,
            'titulo': 'CESPE/STJ/2023 - Controle dos Atos Discricionários'
        },
        {
            'enunciado': 'Sobre a tipicidade como atributo do ato administrativo, assinale a alternativa CORRETA:',
            'opcoes': [
                'A) A tipicidade aplica-se exclusivamente aos atos contratuais da Administração.',
                'B) A tipicidade exige que o ato administrativo corresponda a figuras previamente definidas em lei como aptas a produzir determinados resultados, sendo decorrência do princípio da legalidade.',
                'C) A tipicidade é incompatível com a discricionariedade administrativa.',
                'D) Trata-se de atributo exclusivo dos atos vinculados.',
                'E) A tipicidade dispensa a previsão legal quando o ato visar ao interesse público.'
            ],
            'resposta': 'B',
            'explicacao': 'A tipicidade, atributo destacado por Maria Sylvia Di Pietro, exige que o ato administrativo corresponda a um tipo previamente definido em lei como capaz de produzir determinados efeitos. Decorre da legalidade: a Administração só pode praticar atos previstos em lei. Aplica-se aos atos UNILATERAIS (não aos contratuais, que se regem por bilateralidade). É compatível com a discricionariedade (a lei prevê o tipo, mas deixa margem de escolha quanto a alguns elementos).',
            'dica': 'Tipicidade = ato deve estar previsto em lei (corolário da legalidade).',
            'dificuldade': 'fácil',
            'fonte': 'FGV',
            'ano': 2023,
            'titulo': 'FGV/TJ/2023 - Tipicidade dos Atos'
        }
    ],
    'Licitações e Contratos Administrativos': [
        {
            'enunciado': 'De acordo com a Nova Lei de Licitações (Lei 14.133/2021), julgue o item: o pregão é a modalidade obrigatória para aquisição de bens e serviços comuns, sendo vedada sua utilização para contratação de obras e serviços de engenharia, ainda que comuns.',
            'opcoes': ['A) Verdadeiro', 'B) Falso'],
            'resposta': 'B',
            'explicacao': 'A Lei 14.133/2021 INOVOU ao permitir o pregão para serviços comuns de engenharia (art. 6º, XLI, c/c art. 29). O pregão continua obrigatório para bens e serviços comuns (art. 29), mas agora abrange também os SERVIÇOS COMUNS DE ENGENHARIA. O que continua vedado é o pregão para OBRAS e para serviços de engenharia NÃO COMUNS. Diferentemente da revogada Lei 10.520/2002, o pregão na nova lei é mais amplo.',
            'dica': 'Pregão na 14.133: bens comuns + serviços comuns + serviços comuns de engenharia. Veda obras.',
            'dificuldade': 'médio',
            'fonte': 'CESPE',
            'ano': 2024,
            'titulo': 'CESPE/TCU/2024 - Pregão na Lei 14.133/2021'
        },
        {
            'enunciado': 'Sobre o diálogo competitivo, modalidade introduzida pela Lei 14.133/2021, assinale a alternativa CORRETA:',
            'opcoes': [
                'A) É modalidade aplicável a qualquer contratação, desde que o valor estimado seja superior a R$ 100 milhões.',
                'B) Destina-se à contratação de obras, serviços e compras em que a Administração realize diálogos com licitantes previamente selecionados, mediante critérios objetivos, com o intuito de desenvolver alternativa(s) capaz(es) de atender às suas necessidades.',
                'C) Dispensa fase de habilitação e julgamento.',
                'D) Foi importada do Direito norte-americano e é típica para contratações de baixo valor.',
                'E) Pode ser usada livremente, sem condições específicas, em qualquer contratação federal.'
            ],
            'resposta': 'B',
            'explicacao': 'O diálogo competitivo (art. 32 da Lei 14.133/2021) é uma modalidade INSPIRADA NO DIREITO EUROPEU (Diretiva 2014/24/UE), aplicável a contratações que envolvam (i) inovação tecnológica ou técnica, (ii) impossibilidade de a Administração ter sua necessidade satisfeita sem adaptação de soluções disponíveis, ou (iii) impossibilidade de definir previamente as especificações técnicas. Estrutura-se em fases: pré-seleção, diálogo (com licitantes selecionados objetivamente) e competitiva. Não dispensa habilitação nem julgamento.',
            'dica': 'Diálogo competitivo = inovação + complexidade técnica (origem europeia).',
            'dificuldade': 'difícil',
            'fonte': 'FCC',
            'ano': 2023,
            'titulo': 'FCC/PGE/2023 - Diálogo Competitivo'
        },
        {
            'enunciado': 'Acerca dos princípios licitatórios na Lei 14.133/2021, assinale a alternativa CORRETA:',
            'opcoes': [
                'A) O princípio do julgamento objetivo permite ao agente público afastar-se dos critérios fixados no edital quando demonstrado interesse público superveniente.',
                'B) A Lei 14.133/2021 introduziu expressamente o princípio do desenvolvimento nacional sustentável e o da segregação de funções.',
                'C) O princípio da vinculação ao instrumento convocatório é mitigado para os licitantes, mas absoluto para a Administração.',
                'D) O princípio da competitividade autoriza dispensa de licitação sempre que houver pluralidade de fornecedores.',
                'E) A nova lei aboliu o princípio da isonomia entre os licitantes.'
            ],
            'resposta': 'B',
            'explicacao': 'O art. 5º da Lei 14.133/2021 inovou ao positivar diversos princípios: além dos clássicos (legalidade, impessoalidade, moralidade, publicidade, eficiência, isonomia, vinculação ao edital, julgamento objetivo), incluiu desenvolvimento nacional sustentável, segregação de funções, eficácia, motivação, planejamento, transparência, celeridade, competitividade, entre outros. A vinculação ao instrumento convocatório vincula AMBAS as partes (Administração e licitantes), e o julgamento objetivo IMPÕE seguir os critérios do edital, sob pena de nulidade.',
            'dica': 'Lei 14.133, art. 5º: novos princípios — segregação de funções, planejamento, sustentabilidade.',
            'dificuldade': 'médio',
            'fonte': 'CESPE',
            'ano': 2024,
            'titulo': 'CESPE/AGU/2024 - Princípios da Nova Lei de Licitações'
        },
        {
            'enunciado': 'Sobre as cláusulas exorbitantes nos contratos administrativos, assinale a alternativa CORRETA:',
            'opcoes': [
                'A) Configuram prerrogativas excepcionais da Administração que, se inseridas em contratos privados, seriam consideradas leoninas.',
                'B) Devem estar expressamente previstas no contrato para que possam ser invocadas pela Administração.',
                'C) São inaplicáveis aos contratos celebrados pelas empresas públicas e sociedades de economia mista.',
                'D) A alteração unilateral, espécie de cláusula exorbitante, pode atingir tanto cláusulas regulamentares quanto financeiras.',
                'E) A rescisão unilateral por interesse público dispensa qualquer indenização ao contratado.'
            ],
            'resposta': 'A',
            'explicacao': 'Cláusulas exorbitantes (arts. 103 e ss. da Lei 14.133/2021) são prerrogativas que extrapolam o direito comum: alteração unilateral, rescisão unilateral, fiscalização, aplicação de sanções, ocupação provisória. Em contratos privados seriam abusivas (leoninas). São IMPLÍCITAS — decorrem da lei, dispensam previsão expressa. A alteração unilateral atinge apenas cláusulas REGULAMENTARES (objeto, qualidade), nunca as ECONÔMICO-FINANCEIRAS (preserva-se o equilíbrio). A rescisão por interesse público GERA dever de indenizar (art. 138 da Lei 14.133/2021).',
            'dica': 'Cláusulas exorbitantes: implícitas, alteram só o regulamentar, rescisão indeniza.',
            'dificuldade': 'médio',
            'fonte': 'FCC',
            'ano': 2023,
            'titulo': 'FCC/TRT/2023 - Cláusulas Exorbitantes'
        },
        {
            'enunciado': 'Quanto às hipóteses de inexigibilidade de licitação na Lei 14.133/2021, julgue o item: a contratação de profissional do setor artístico, diretamente ou por intermédio de empresário exclusivo, configura inexigibilidade desde que consagrado pela crítica especializada ou pela opinião pública.',
            'opcoes': ['A) Verdadeiro', 'B) Falso'],
            'resposta': 'A',
            'explicacao': 'O art. 74, II, da Lei 14.133/2021 (assim como antes o art. 25, III, da Lei 8.666/1993) prevê inexigibilidade para contratação de profissional do setor artístico, diretamente ou por intermédio de empresário EXCLUSIVO, desde que consagrado pela CRÍTICA ESPECIALIZADA ou pela OPINIÃO PÚBLICA. A inexigibilidade pressupõe inviabilidade de competição. O STF, no julgamento da AP 971, consolidou rigor na demonstração da exclusividade do empresário (contrato registrado, exclusividade territorial e temporal).',
            'dica': 'Artista: empresário exclusivo + crítica especializada OU opinião pública.',
            'dificuldade': 'fácil',
            'fonte': 'CESPE',
            'ano': 2023,
            'titulo': 'CESPE/MPF/2023 - Inexigibilidade de Licitação'
        },
        {
            'enunciado': 'Sobre o equilíbrio econômico-financeiro nos contratos administrativos, assinale a alternativa CORRETA:',
            'opcoes': [
                'A) A teoria da imprevisão aplica-se a fatos previsíveis, mas de consequências incalculáveis.',
                'B) O fato do príncipe é ato geral do ente contratante que onera indiretamente o contrato.',
                'C) A revisão (recomposição) por álea econômica extraordinária independe de previsão contratual.',
                'D) O reajuste contratual é aplicado mediante negociação caso a caso, conforme inflação real do contrato.',
                'E) A correção monetária equivale ao reajuste de preços para fins de equilíbrio econômico-financeiro.'
            ],
            'resposta': 'C',
            'explicacao': 'A revisão (ou recomposição) decorre de ÁLEA ECONÔMICA EXTRAORDINÁRIA — fatos imprevisíveis ou previsíveis de consequências incalculáveis (teoria da imprevisão), fato do príncipe, fato da Administração, sujeições imprevistas, caso fortuito ou força maior. Independe de previsão contratual (decorre da CF, art. 37, XXI, e da Lei 14.133/2021, art. 124, II, "d"). Teoria da imprevisão: fatos IMPREVISÍVEIS. Fato do príncipe: ato GERAL do ente contratante. Reajuste é automático e contratual; correção monetária é mera atualização do valor da moeda.',
            'dica': 'Revisão: independe de previsão contratual; reajuste é contratual e periódico.',
            'dificuldade': 'difícil',
            'fonte': 'CESPE',
            'ano': 2024,
            'titulo': 'CESPE/PGFN/2024 - Equilíbrio Econômico-Financeiro'
        },
        {
            'enunciado': 'Sobre as modalidades licitatórias na Lei 14.133/2021, assinale a alternativa CORRETA:',
            'opcoes': [
                'A) A nova lei manteve as modalidades convite e tomada de preços, com novos limites de valor.',
                'B) São modalidades: pregão, concorrência, concurso, leilão e diálogo competitivo.',
                'C) A concorrência é cabível apenas para contratações de grande vulto.',
                'D) O leilão tornou-se modalidade obsoleta na nova legislação.',
                'E) O critério de julgamento "maior desconto" só pode ser usado no pregão.'
            ],
            'resposta': 'B',
            'explicacao': 'A Lei 14.133/2021 (art. 28) prevê CINCO modalidades: pregão, concorrência, concurso, leilão e diálogo competitivo. Foram EXTINTAS as modalidades convite e tomada de preços (presentes na Lei 8.666/1993). A concorrência (art. 6º, XXXVIII) NÃO depende mais de valor — é definida pelo objeto (bens e serviços especiais, obras e serviços de engenharia, e bens/serviços comuns/especiais não enquadrados no pregão). O leilão (art. 6º, XL) permanece para venda de bens. O critério "maior desconto" pode ser usado em diversas modalidades.',
            'dica': 'Lei 14.133: 5 modalidades — sem convite e tomada de preços.',
            'dificuldade': 'médio',
            'fonte': 'FGV',
            'ano': 2024,
            'titulo': 'FGV/TJ/2024 - Modalidades de Licitação'
        },
        {
            'enunciado': 'Acerca da exceção do contrato não cumprido (exceptio non adimpleti contractus) nos contratos administrativos, julgue o item: a Lei 14.133/2021 admite que o contratado suspenda a execução do contrato caso a Administração esteja em mora superior a dois meses no pagamento, observado o procedimento legal.',
            'opcoes': ['A) Verdadeiro', 'B) Falso'],
            'resposta': 'B',
            'explicacao': 'O art. 137, §2º, IV, da Lei 14.133/2021 admite a exceção do contrato não cumprido APÓS DOIS MESES de atraso (prazo MENOR que os 90 dias da Lei 8.666/1993, art. 78, XV). Logo, a afirmação de "superior a dois meses" requer cuidado: tecnicamente, a lei permite após o atraso ULTRAPASSAR DOIS MESES (>2 meses). Contudo, a Lei 14.133/2021 também trouxe inovação: o particular pode pleitear a EXTINÇÃO do contrato. A exceção do contrato não cumprido foi mitigada na nova lei: prazo menor que o anterior, e o particular pode optar pela suspensão ou extinção. A questão erra ao afirmar incorretamente o regime — a lei prevê a possibilidade após atraso superior a 2 meses, não dispensa o procedimento legal específico (notificação prévia, etc.). Atenção: a banca considera incorreta a redação que omite que se trata de POSSIBILIDADE DE EXTINÇÃO ou suspensão, e que exige procedimento.',
            'dica': 'Lei 14.133: exceção do contrato não cumprido após +2 meses (antes eram 90 dias).',
            'dificuldade': 'difícil',
            'fonte': 'CESPE',
            'ano': 2024,
            'titulo': 'CESPE/AGU/2024 - Exceção do Contrato Não Cumprido'
        },
        {
            'enunciado': 'Sobre a duração dos contratos administrativos na Lei 14.133/2021, assinale a alternativa CORRETA:',
            'opcoes': [
                'A) Os contratos de prestação de serviços contínuos têm prazo máximo de 60 meses, prorrogáveis até 120 meses.',
                'B) Todos os contratos administrativos estão limitados ao período de vigência dos respectivos créditos orçamentários.',
                'C) Contratos de aluguel de equipamentos podem ser celebrados por prazo de até 10 anos, em razão de sua natureza específica.',
                'D) A Lei 14.133/2021 vedou expressamente a celebração de contratos plurianuais.',
                'E) Os contratos de eficiência têm vigência máxima de 12 meses.'
            ],
            'resposta': 'A',
            'explicacao': 'O art. 107 da Lei 14.133/2021 estabelece que contratos de SERVIÇOS E FORNECIMENTOS CONTÍNUOS podem ter vigência máxima de 5 anos (60 meses), prorrogáveis sucessivamente, observada a vantajosidade, até o limite de 10 anos (120 meses) — art. 107. Contratos com pagamento integral antecipado (uso eventual de bens), com vigência atrelada à entrega, e contratos de operação continuada de sistemas estruturantes de TI podem ter prazos próprios. A nova lei NÃO vedou contratos plurianuais — pelo contrário, ampliou as hipóteses (art. 105 e 106).',
            'dica': 'Serviços contínuos: 5 anos + prorrogação até 10 anos (Lei 14.133, art. 107).',
            'dificuldade': 'médio',
            'fonte': 'FCC',
            'ano': 2024,
            'titulo': 'FCC/TCE/2024 - Duração dos Contratos'
        },
        {
            'enunciado': 'Sobre a fase preparatória da licitação na Lei 14.133/2021, assinale a alternativa CORRETA:',
            'opcoes': [
                'A) O ETP (Estudo Técnico Preliminar) é dispensável para a totalidade das contratações da Administração federal.',
                'B) A matriz de riscos é obrigatória apenas para contratos integrados de grande vulto.',
                'C) A fase preparatória deve compatibilizar-se com o plano de contratações anual e abranger ETP, termo de referência ou projeto básico/executivo, análise de riscos, pesquisa de preços e documentos pertinentes, conforme o caso.',
                'D) A pesquisa de preços é facultativa nas contratações por dispensa.',
                'E) O agente de contratação tem suas atribuições restritas à fase externa do certame.'
            ],
            'resposta': 'C',
            'explicacao': 'A fase preparatória (art. 18 da Lei 14.133/2021) deve refletir todos os aspectos técnicos e mercadológicos relevantes ao processamento e julgamento da licitação, alinhada ao Plano de Contratações Anual (PCA — art. 12, VII). Compreende ETP, termo de referência ou projeto básico/executivo, análise de riscos, pesquisa de preços, etc. O ETP é, em regra, OBRIGATÓRIO (com hipóteses de dispensa — art. 14, §2º). A matriz de riscos é obrigatória em contratações de obras/serviços de grande vulto e em contratos integrados/semi-integrados (art. 22, §3º). Pesquisa de preços é OBRIGATÓRIA também em dispensas. O agente de contratação atua na fase interna E externa.',
            'dica': 'Fase preparatória: PCA + ETP + TR/PB + matriz de riscos + pesquisa de preços.',
            'dificuldade': 'difícil',
            'fonte': 'CESPE',
            'ano': 2024,
            'titulo': 'CESPE/TCU/2024 - Fase Preparatória da Licitação'
        }
    ],
    'Servidores Públicos': [
        {
            'enunciado': 'Sobre as formas de provimento dos cargos públicos na Lei 8.112/1990, julgue o item: a nomeação é a única forma de provimento originário, dependendo da prévia aprovação em concurso público para cargos efetivos.',
            'opcoes': ['A) Verdadeiro', 'B) Falso'],
            'resposta': 'A',
            'explicacao': 'O art. 8º da Lei 8.112/1990 lista as formas de provimento: nomeação, promoção, readaptação, reversão, aproveitamento, reintegração e recondução. A NOMEAÇÃO é a ÚNICA forma de provimento ORIGINÁRIO (gera relação jurídica nova). As demais são DERIVADAS (pressupõem vínculo anterior). Para cargo efetivo, a nomeação depende de prévia aprovação em concurso público (CF, art. 37, II). Para cargo em comissão, é de livre nomeação e exoneração.',
            'dica': 'Nomeação = único provimento originário. As demais (promoção, reversão etc.) são derivadas.',
            'dificuldade': 'fácil',
            'fonte': 'CESPE',
            'ano': 2022,
            'titulo': 'CESPE/INSS/2022 - Provimento de Cargos'
        },
        {
            'enunciado': 'Acerca da posse e do exercício na Lei 8.112/1990, assinale a alternativa CORRETA:',
            'opcoes': [
                'A) A posse deve ocorrer no prazo de 15 dias contados da publicação do ato de provimento, podendo ser prorrogada por igual período a pedido do interessado.',
                'B) A posse deve ocorrer no prazo de 30 dias contados da publicação do ato de provimento, e o exercício no prazo de 15 dias contados da posse.',
                'C) Posse e exercício ocorrem simultaneamente, no mesmo ato administrativo.',
                'D) O servidor que não entrar em exercício no prazo legal será reconduzido ao cargo anterior.',
                'E) A posse pode ser dada por procuração específica em qualquer hipótese, sem exceções.'
            ],
            'resposta': 'B',
            'explicacao': 'Art. 13, §1º: posse em até 30 DIAS contados da publicação do ato de provimento. Art. 15, §1º: exercício em até 15 DIAS contados da posse. A posse pode ocorrer mediante procuração específica (art. 13, §3º). Quem não toma posse no prazo tem o ato de nomeação TORNADO SEM EFEITO (art. 13, §6º). Quem toma posse mas não entra em exercício é EXONERADO (art. 15, §2º). A posse só ocorre na nomeação (art. 13, §4º) — promoção e readaptação dispensam posse.',
            'dica': 'Posse: 30 dias da nomeação. Exercício: 15 dias da posse.',
            'dificuldade': 'fácil',
            'fonte': 'FCC',
            'ano': 2023,
            'titulo': 'FCC/TRT/2023 - Posse e Exercício'
        },
        {
            'enunciado': 'Sobre a estabilidade do servidor público, conforme a CF/1988 e a Lei 8.112/1990, assinale a alternativa CORRETA:',
            'opcoes': [
                'A) A estabilidade é adquirida após dois anos de efetivo exercício para servidores nomeados em cargo efetivo.',
                'B) A estabilidade é adquirida após três anos de efetivo exercício e exige aprovação em avaliação especial de desempenho realizada por comissão competente.',
                'C) Servidores ocupantes de cargo em comissão também adquirem estabilidade após cinco anos de exercício.',
                'D) A estabilidade impede absolutamente a perda do cargo, salvo por aposentadoria voluntária.',
                'E) A estabilidade abrange empregados públicos celetistas após três anos de contrato.'
            ],
            'resposta': 'B',
            'explicacao': 'CF, art. 41 (com redação da EC 19/1998): estabilidade adquirida após 3 ANOS de efetivo exercício, mediante (i) aprovação em concurso público, (ii) nomeação para cargo de provimento efetivo, e (iii) avaliação especial de desempenho por comissão. Cargos em comissão NÃO geram estabilidade (livre exoneração — CF, art. 37, II). A estabilidade pode ser perdida (CF, art. 41, §1º): sentença judicial transitada em julgado, processo administrativo disciplinar com ampla defesa, procedimento de avaliação periódica de desempenho, ou excesso de despesa com pessoal (CF, art. 169). O STF, no RE 589.998 (Tema 131), firmou que empregados públicos de empresas estatais NÃO têm estabilidade do art. 41, mas exigem motivação para dispensa.',
            'dica': '3 anos + concurso + cargo efetivo + avaliação especial = estabilidade (CF, art. 41).',
            'dificuldade': 'médio',
            'fonte': 'CESPE',
            'ano': 2023,
            'titulo': 'CESPE/PGE/2023 - Estabilidade'
        },
        {
            'enunciado': 'Quanto às formas de vacância na Lei 8.112/1990, julgue o item: a posse em outro cargo inacumulável configura forma de vacância, podendo o servidor pedir reconsideração caso não confirmado no estágio probatório, com retorno ao cargo anteriormente ocupado.',
            'opcoes': ['A) Verdadeiro', 'B) Falso'],
            'resposta': 'A',
            'explicacao': 'O art. 33, VIII, da Lei 8.112/1990 prevê a posse em outro cargo INACUMULÁVEL como forma de vacância. O STJ, em diversos julgados, e o STF (MS 24.543), consolidaram o direito à RECONDUÇÃO ao cargo anterior caso o servidor não seja confirmado no estágio probatório do novo cargo (art. 29, II), desde que ainda se trate de cargo efetivo (servidor estável). Essa figura preserva a segurança jurídica e o direito do servidor que arrisca novo concurso.',
            'dica': 'Posse em cargo inacumulável = vacância; pode haver recondução ao cargo anterior.',
            'dificuldade': 'médio',
            'fonte': 'CESPE',
            'ano': 2023,
            'titulo': 'CESPE/STJ/2023 - Vacância e Recondução'
        },
        {
            'enunciado': 'Sobre as responsabilidades do servidor público (civil, penal e administrativa), assinale a alternativa CORRETA:',
            'opcoes': [
                'A) As três esferas de responsabilidade são absolutamente independentes, e a absolvição em qualquer delas afasta automaticamente as demais.',
                'B) A absolvição criminal por insuficiência de provas vincula as esferas civil e administrativa, impedindo nova punição.',
                'C) As esferas são, em regra, independentes; apenas a absolvição penal por inexistência do fato ou negativa de autoria repercute nas esferas civil e administrativa.',
                'D) A condenação criminal exige novo procedimento administrativo para configurar infração disciplinar.',
                'E) A responsabilidade civil do servidor é solidária com a Administração perante o terceiro lesado.'
            ],
            'resposta': 'C',
            'explicacao': 'Os arts. 121 a 126 da Lei 8.112/1990 e o entendimento consolidado do STF/STJ (Súmula 18/STF; STF, MS 23.625) estabelecem a INDEPENDÊNCIA RELATIVA das três esferas. Apenas duas hipóteses de absolvição criminal repercutem nas demais esferas: (i) inexistência do fato e (ii) negativa de autoria (art. 386, I e IV, do CPP). Absolvição por insuficiência de provas NÃO vincula. Quanto à responsabilidade civil perante terceiros: o ente público responde objetivamente (CF, art. 37, §6º), e o terceiro só pode acionar a ADMINISTRAÇÃO (não o servidor diretamente — STF, RE 1.027.633, Tema 940), cabendo ação regressiva contra o servidor em caso de dolo ou culpa.',
            'dica': 'Esferas independentes; só absolve TUDO se o juiz penal disser: "fato não existiu" ou "não foi você".',
            'dificuldade': 'difícil',
            'fonte': 'CESPE',
            'ano': 2024,
            'titulo': 'CESPE/AGU/2024 - Responsabilidades do Servidor'
        },
        {
            'enunciado': 'Sobre o regime jurídico dos servidores públicos federais, julgue o item: o estágio probatório, conforme entendimento do STF e do STJ, tem duração de 36 meses, ainda que a Lei 8.112/1990 mencione o prazo de 24 meses, em razão da nova redação do art. 41 da Constituição dada pela EC 19/1998.',
            'opcoes': ['A) Verdadeiro', 'B) Falso'],
            'resposta': 'A',
            'explicacao': 'A Lei 8.112/1990, art. 20, originalmente previa 24 meses para o estágio probatório. Com a EC 19/1998, a estabilidade passou a ser adquirida após 3 anos. O STJ (MS 12.523) e o STF consolidaram que o estágio probatório acompanha o prazo da estabilidade, sendo de 36 MESES. A AGU, por meio do Parecer AGU/AC-17/2004, também adotou esse entendimento. Logo, embora a redação literal da Lei 8.112/1990 ainda fale em 24 meses, prevalece o prazo de 36 meses.',
            'dica': 'Estágio probatório: 36 meses (compatível com a estabilidade pós-EC 19/98).',
            'dificuldade': 'médio',
            'fonte': 'CESPE',
            'ano': 2023,
            'titulo': 'CESPE/MPU/2023 - Estágio Probatório'
        },
        {
            'enunciado': 'Acerca da reintegração e da recondução, conforme a Lei 8.112/1990, assinale a alternativa CORRETA:',
            'opcoes': [
                'A) A reintegração ocorre quando o servidor estável é demitido e tem invalidada a demissão por decisão administrativa ou judicial, retornando ao cargo de origem com ressarcimento das vantagens.',
                'B) A recondução só pode ocorrer mediante novo concurso público.',
                'C) A reintegração depende de provimento judicial, sendo vedado seu reconhecimento administrativo.',
                'D) A recondução implica indenização a quem ocupava o cargo, sem direito de retorno do anterior ocupante.',
                'E) São formas de provimento originário, gerando estabilidade após dois anos.'
            ],
            'resposta': 'A',
            'explicacao': 'Art. 28 da Lei 8.112/1990: REINTEGRAÇÃO é o retorno do servidor ESTÁVEL ao cargo de origem, decorrente de invalidação (administrativa ou judicial) da demissão, com ressarcimento de todas as vantagens. Se o cargo estiver provido, o atual ocupante é RECONDUZIDO ao seu cargo de origem (sem indenização) ou aproveitado em outro cargo, ou colocado em disponibilidade (art. 28, §§). RECONDUÇÃO (art. 29) é o retorno do servidor estável ao cargo anterior em razão de inabilitação em estágio probatório de outro cargo ou reintegração do anterior ocupante. Ambas são formas DERIVADAS de provimento.',
            'dica': 'Reintegração = volta após demissão invalidada (com ressarcimento). Recondução = volta ao cargo anterior (sem ressarcimento).',
            'dificuldade': 'médio',
            'fonte': 'FCC',
            'ano': 2023,
            'titulo': 'FCC/TJ/2023 - Reintegração e Recondução'
        },
        {
            'enunciado': 'Sobre o acúmulo de cargos públicos, conforme a CF/1988 e jurisprudência do STF, julgue o item: é admitido o acúmulo de dois cargos privativos de profissionais da saúde com profissões regulamentadas, mediante compatibilidade de horários, sendo dispensado o limite de 60 horas semanais conforme entendimento atual do STF (Tema 1.081).',
            'opcoes': ['A) Verdadeiro', 'B) Falso'],
            'resposta': 'A',
            'explicacao': 'A CF, art. 37, XVI, "c", admite acumulação de dois cargos privativos de profissionais de saúde com profissões regulamentadas, desde que haja COMPATIBILIDADE DE HORÁRIOS. O STF, no Tema 1.081 (RE 1.176.440, julgado em 2020), firmou tese de que NÃO HÁ LIMITE OBJETIVO de jornada (como o de 60 horas semanais antes exigido pela AGU), bastando a compatibilidade fática de horários, a ser aferida caso a caso pela Administração. Tal entendimento garante o acúmulo desde que não haja prejuízo ao serviço.',
            'dica': 'STF Tema 1.081: dois cargos de saúde — só compatibilidade de horários, sem limite fixo de jornada.',
            'dificuldade': 'difícil',
            'fonte': 'CESPE',
            'ano': 2024,
            'titulo': 'CESPE/STF/2024 - Acúmulo de Cargos na Saúde'
        },
        {
            'enunciado': 'Acerca do processo administrativo disciplinar (PAD) na Lei 8.112/1990, assinale a alternativa CORRETA:',
            'opcoes': [
                'A) A defesa técnica por advogado é obrigatória em todas as fases do PAD, sob pena de nulidade absoluta, conforme Súmula 343 do STJ.',
                'B) A Súmula Vinculante 5 do STF dispõe que a falta de defesa técnica por advogado no PAD não ofende a Constituição.',
                'C) O prazo prescricional para apuração de infrações puníveis com demissão é de dois anos, contado da data do fato.',
                'D) A confissão do servidor dispensa a instrução probatória e a apresentação de defesa.',
                'E) O PAD pode ser instaurado por servidor ocupante de cargo em comissão, independentemente de hierarquia.'
            ],
            'resposta': 'B',
            'explicacao': 'A Súmula Vinculante 5 do STF dispõe expressamente: "A falta de defesa técnica por advogado no processo administrativo disciplinar não ofende a Constituição." Embora a Súmula 343/STJ (anterior) apontasse pela obrigatoriedade, ela foi SUPERADA pela SV 5. Prescrição (art. 142): 5 ANOS para infrações puníveis com demissão (não 2). A confissão NÃO dispensa instrução nem ampla defesa (CF, art. 5º, LV). Comissão de PAD deve ser composta por servidores ESTÁVEIS (art. 149).',
            'dica': 'SV 5/STF: ausência de advogado no PAD NÃO é nulidade. Prescrição demissão: 5 anos.',
            'dificuldade': 'médio',
            'fonte': 'CESPE',
            'ano': 2024,
            'titulo': 'CESPE/PF/2024 - Processo Administrativo Disciplinar'
        },
        {
            'enunciado': 'Sobre a aposentadoria do servidor público após a Reforma da Previdência (EC 103/2019), assinale a alternativa CORRETA:',
            'opcoes': [
                'A) A aposentadoria voluntária por idade exige 60 anos para homem e 55 para mulher, com 10 anos de serviço público.',
                'B) A aposentadoria compulsória ocorre aos 70 anos, sem qualquer exceção.',
                'C) A EC 103/2019 manteve, para servidores federais, idade mínima de 65 anos para homem e 62 para mulher na aposentadoria voluntária, com tempo mínimo de contribuição.',
                'D) A aposentadoria por invalidez não admite proventos integrais em qualquer hipótese.',
                'E) A reforma extinguiu a aposentadoria especial dos professores.'
            ],
            'resposta': 'C',
            'explicacao': 'A EC 103/2019 alterou o art. 40 da CF: aposentadoria voluntária do servidor federal exige idade mínima de 65 anos (homem) e 62 anos (mulher), com 25 anos de contribuição (no mínimo), 10 anos de serviço público e 5 anos no cargo. Aposentadoria compulsória: 75 anos (LC 152/2015). Aposentadoria por incapacidade permanente (antes "invalidez") tem proventos integrais quando decorrente de acidente em serviço, moléstia profissional ou doença grave (lista legal). Professores têm regra especial: 60 anos (homem) e 57 anos (mulher), com 25 anos de magistério.',
            'dica': 'EC 103/19: aposentadoria voluntária federal — 65/62 anos + tempo de contribuição/serviço/cargo.',
            'dificuldade': 'difícil',
            'fonte': 'CESPE',
            'ano': 2024,
            'titulo': 'CESPE/TRF/2024 - Aposentadoria do Servidor (EC 103/2019)'
        }
    ],
}
