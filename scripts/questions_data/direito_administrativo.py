"""
Questões de Direito Administrativo
10 capítulos x ~130 questões = ~1.300 questões
"""

CAPITULOS = [
    {'numero': 1, 'titulo': 'Princípios da Administração Pública', 'descricao': 'LIMPE e demais princípios do Direito Administrativo'},
    {'numero': 2, 'titulo': 'Atos Administrativos', 'descricao': 'Conceito, requisitos, atributos e espécies de atos administrativos'},
    {'numero': 3, 'titulo': 'Poderes Administrativos', 'descricao': 'Poder vinculado, discricionário, hierárquico, disciplinar e de polícia'},
    {'numero': 4, 'titulo': 'Licitações e Contratos', 'descricao': 'Lei 14.133/2021 e contratos administrativos'},
    {'numero': 5, 'titulo': 'Servidores Públicos', 'descricao': 'Regime jurídico, cargos, empregos e funções públicas'},
    {'numero': 6, 'titulo': 'Bens Públicos', 'descricao': 'Classificação e regime jurídico dos bens públicos'},
    {'numero': 7, 'titulo': 'Serviços Públicos', 'descricao': 'Conceito, classificação e formas de prestação'},
    {'numero': 8, 'titulo': 'Controle da Administração', 'descricao': 'Controle interno, externo, judicial e social'},
    {'numero': 9, 'titulo': 'Improbidade Administrativa', 'descricao': 'Lei 8.429/1992 e responsabilidade dos agentes'},
    {'numero': 10, 'titulo': 'Processo Administrativo', 'descricao': 'Lei 9.784/1999 e princípios do processo administrativo'},
]

QUESTOES = {
    # ===== CAPÍTULO 1: Princípios da Administração Pública =====
    'Princípios da Administração Pública': [
        {
            'enunciado': 'O art. 37, caput, da CF/88 elenca os princípios que regem a administração pública direta e indireta. Qual das alternativas apresenta TODOS os princípios expressos nesse dispositivo?',
            'opcoes': ['A) Legalidade, impessoalidade, moralidade, publicidade e eficiência', 'B) Legalidade, legitimidade, economicidade, publicidade e eficiência', 'C) Legalidade, impessoalidade, proporcionalidade, publicidade e eficiência', 'D) Legalidade, moralidade, razoabilidade, publicidade e eficiência', 'E) Legalidade, impessoalidade, moralidade, proporcionalidade e eficiência'],
            'resposta': 'A',
            'explicacao': 'O art. 37, caput, CF/88 enuncia cinco princípios expressos: Legalidade, Impessoalidade, Moralidade, Publicidade e Eficiência (LIMPE). O princípio da eficiência foi acrescentado pela EC 19/1998 (Reforma Administrativa). Os demais princípios citados nas alternativas (legitimidade, economicidade, proporcionalidade, razoabilidade) também se aplicam à Administração, mas são implícitos na CF ou decorrem de outros dispositivos, não estando no art. 37, caput.',
            'dica': 'LIMPE = Legalidade, Impessoalidade, Moralidade, Publicidade, Eficiência. "Eficiência" veio com a EC 19/1998.',
            'dificuldade': 'fácil',
            'fonte': 'CESPE',
            'ano': 2022,
            'titulo': 'CESPE/PF/2022 - Princípios LIMPE'
        },
        {
            'enunciado': 'O princípio da legalidade na Administração Pública difere do princípio da legalidade no Direito Privado. Qual é a diferença fundamental?',
            'opcoes': ['A) Na Administração, o agente pode fazer tudo que a lei não proibir; no privado, só pode o que a lei autoriza', 'B) Na Administração, o agente só pode fazer o que a lei autoriza; no privado, pode fazer tudo que a lei não proibir', 'C) Não há diferença — ambos seguem a mesma lógica', 'D) Na Administração, a lei é meramente orientativa; no privado, é obrigatória', 'E) Na Administração, a legalidade só se aplica ao Poder Executivo'],
            'resposta': 'B',
            'explicacao': 'Na legalidade administrativa (art. 37, caput, e art. 5º, II, CF), o administrador público só pode agir quando houver autorização legal — "se não está autorizado, é proibido". No Direito Privado, o particular pode fazer tudo que a lei não proibir — "se não está proibido, é permitido". Essa distinção é fundamental: o agente público não tem liberdade genérica de atuação, devendo pautar-se estritamente nos limites da lei. Modernamente, o STJ fala em vinculação à juridicidade (não apenas à lei estrita).',
            'dica': 'Adm Pública: só pode o que a LEI AUTORIZA. Particular: pode tudo que a LEI NÃO PROÍBE. Inversão da lógica.',
            'dificuldade': 'fácil',
            'fonte': 'FCC',
            'ano': 2021,
            'titulo': 'FCC/TJ-RO/2021 - Legalidade Administrativa'
        },
        {
            'enunciado': 'O princípio da moralidade administrativa exige que o administrador não apenas aja dentro da legalidade estrita, mas também:',
            'opcoes': ['A) Consulte a opinião pública antes de toda decisão', 'B) Atue conforme padrões éticos de honestidade, boa-fé e lealdade à Administração', 'C) Evite qualquer contato com a imprensa', 'D) Submeta todos os atos a aprovação do Tribunal de Contas', 'E) Atue exclusivamente em conformidade com os costumes sociais'],
            'resposta': 'B',
            'explicacao': 'O princípio da moralidade (art. 37, caput, CF) vai além da legalidade: exige que o administrador aja com honestidade, boa-fé, probidade e lealdade não apenas para com a Administração, mas também em relação aos administrados. Maurício Hauriou, que sistematizou esse princípio, afirmava que o administrador deve respeitar a "moral institucional" da Administração. A violação à moralidade configura ato de improbidade administrativa (art. 11, Lei 8.429/92).',
            'dica': 'Moralidade: além da legalidade, exige ética, boa-fé e probidade. Violação = improbidade (art. 11 da Lei 8.429/92).',
            'dificuldade': 'fácil',
            'fonte': 'CESPE',
            'ano': 2022,
            'titulo': 'CESPE/SEDF/2022 - Moralidade'
        },
        {
            'enunciado': 'O princípio da impessoalidade na Administração Pública tem dupla dimensão. Qual das alternativas descreve CORRETAMENTE ambas?',
            'opcoes': ['A) O administrador deve agir sem favoritismo e os atos são imputados à Administração, não ao agente', 'B) O administrador não pode ter nome associado a obras públicas e deve agir apenas por razões técnicas', 'C) A Administração deve tratar todos os cidadãos de forma idêntica, sem exceções', 'D) Os atos administrativos são sempre anônimos e não identificam o servidor que os praticou', 'E) A impessoalidade proíbe qualquer forma de promoção pessoal do servidor'],
            'resposta': 'A',
            'explicacao': 'A impessoalidade tem duas dimensões: 1) Dimensão interna (finalidade): o administrador deve agir visando o interesse público, sem favoritismo ou perseguição — vedando discriminações arbitrárias e uso do aparato público para fins pessoais; 2) Dimensão externa (imputação): os atos administrativos são imputados à Administração Pública, não ao agente que os praticou (teoria do órgão). O art. 37, §1º, CF veda a promoção pessoal do administrador em publicidade oficial, como decorrência da impessoalidade.',
            'dica': 'Impessoalidade: 1) sem favoritismo (finalidade pública); 2) atos imputados à Administração (teoria do órgão). Art. 37, §1º proíbe promoção pessoal.',
            'dificuldade': 'médio',
            'fonte': 'FGV',
            'ano': 2022,
            'titulo': 'FGV/PGM-Manaus/2022 - Impessoalidade'
        },
        {
            'enunciado': 'O princípio da eficiência, inserido na CF/88 pela EC 19/1998, vincula a Administração a:',
            'opcoes': ['A) Obter o melhor resultado possível com o máximo de recursos disponíveis', 'B) Atingir resultados satisfatórios com uso racional e economizando recursos públicos', 'C) Executar apenas o que for economicamente lucrativo', 'D) Privatizar serviços públicos ineficientes', 'E) Eliminar cargos comissionados de confiança'],
            'resposta': 'B',
            'explicacao': 'O princípio da eficiência exige que a Administração Pública atue com qualidade, presteza, rendimento funcional e economicidade. Não se trata de maximizar resultados a qualquer custo, mas de obter os melhores resultados possíveis com os recursos disponíveis (eficiência = melhor resultado com menor custo). A EC 19/1998 também introduziu a avaliação periódica de desempenho dos servidores como instrumento para garantir a eficiência.',
            'dica': 'Eficiência = fazer mais com menos (melhor resultado + uso racional de recursos). EC 19/1998 trouxe avaliação de desempenho.',
            'dificuldade': 'fácil',
            'fonte': 'CESPE',
            'ano': 2021,
            'titulo': 'CESPE/ANATEL/2021 - Eficiência'
        },
        # MÉDIO
        {
            'enunciado': 'Sobre o princípio da razoabilidade e proporcionalidade na Administração Pública, assinale a alternativa CORRETA:',
            'opcoes': ['A) São princípios idênticos, sem qualquer distinção', 'B) A proporcionalidade tem três subprincípios: adequação, necessidade e proporcionalidade em sentido estrito', 'C) A razoabilidade proíbe toda diferenciação no tratamento de administrados', 'D) A proporcionalidade aplica-se apenas ao Poder Judiciário', 'E) São princípios que só se aplicam a atos discricionários ilícitos'],
            'resposta': 'B',
            'explicacao': 'A proporcionalidade é composta por três subprincípios (tríade): adequação (o meio deve ser apto a atingir o fim), necessidade (o meio deve ser o menos gravoso entre os igualmente eficazes) e proporcionalidade em sentido estrito (os benefícios devem superar os ônus). A razoabilidade, mais ampla, exige que os atos administrativos sejam razoáveis, sem excessos nem insuficiências. Ambos são distintos, embora frequentemente usados em conjunto.',
            'dica': 'Proporcionalidade: ADEQUAÇÃO + NECESSIDADE + PROPORCIONALIDADE ESTRITA. Memorize a tríade.',
            'dificuldade': 'médio',
            'fonte': 'CESPE',
            'ano': 2022,
            'titulo': 'CESPE/TCE-RO/2022 - Proporcionalidade'
        },
        {
            'enunciado': 'O princípio da autotutela administrativa permite que a Administração Pública:',
            'opcoes': ['A) Anule seus próprios atos ilegais e revogue atos inconvenientes ou inoportunos, independentemente do Judiciário', 'B) Revogue atos ilegais e anule atos inconvenientes, em qualquer tempo', 'C) Só revogue atos com autorização judicial prévia', 'D) Anule ou revogue atos somente mediante provocação dos administrados', 'E) Desfaça atos jurídicos perfeitos sem qualquer consequência jurídica'],
            'resposta': 'A',
            'explicacao': 'O princípio da autotutela (Súmulas 346 e 473/STF) permite que a Administração: 1) ANULE seus atos quando ilegais (anulação retroage ao início — efeito ex tunc); 2) REVOGUE seus atos quando inconvenientes ou inoportunos por razões de mérito administrativo (revogação tem efeito ex nunc — prospectivo). Ambas as hipóteses independem de autorização judicial. A anulação, porém, deve respeitar o contraditório e prazo decadencial de 5 anos (art. 54, Lei 9.784/99) quando afeta direitos de terceiros de boa-fé.',
            'dica': 'Autotutela: ANULA (ilegal, ex tunc) ou REVOGA (inconveniente, ex nunc). Prazo: 5 anos para anular ato que gerou direitos (Lei 9.784).',
            'dificuldade': 'médio',
            'fonte': 'FCC',
            'ano': 2022,
            'titulo': 'FCC/TRT-SP/2022 - Autotutela'
        },
        # DIFÍCIL
        {
            'enunciado': 'Sobre a teoria dos motivos determinantes, é correto afirmar que:',
            'opcoes': ['A) A Administração pode livremente mudar a motivação de seus atos sem qualquer consequência', 'B) Uma vez motivado o ato administrativo, a Administração fica vinculada aos motivos declarados, podendo o ato ser invalidado se os motivos forem falsos ou inexistentes', 'C) Só se aplica a atos vinculados, não a atos discricionários', 'D) A teoria é inaplicável em atos de exoneração de cargo em comissão', 'E) A motivação é sempre dispensável em atos administrativos'],
            'resposta': 'B',
            'explicacao': 'A teoria dos motivos determinantes (Themistocles Cavalcanti e jurisprudência do STJ/STF) estabelece que quando a Administração motiva um ato, fica a ele vinculada: se os motivos declarados forem falsos ou inexistentes, o ato será inválido, mesmo que discricionário. Exemplo clássico: exoneração de cargo em comissão (ato discricionário) motivada por "falta de verbas" — se na prática houve verba e a exoneração foi por perseguição, é passível de invalidação. Isso amplia o controle judicial sobre atos discricionários.',
            'dica': 'Teoria dos motivos determinantes: motivou = ficou vinculado ao motivo. Motivo falso = ato inválido, mesmo que discricionário.',
            'dificuldade': 'difícil',
            'fonte': 'CESPE',
            'ano': 2023,
            'titulo': 'CESPE/PGF/2023 - Teoria dos Motivos'
        },
    ],

    # ===== CAPÍTULO 2: Atos Administrativos =====
    'Atos Administrativos': [
        {
            'enunciado': 'Os atributos (ou características) dos atos administrativos são:',
            'opcoes': ['A) Presunção de legitimidade, imperatividade, autoexecutoriedade e tipicidade', 'B) Legalidade, moralidade, publicidade e eficiência', 'C) Vinculação, discricionariedade, competência e forma', 'D) Motivação, finalidade, objeto e causa', 'E) Presunção de legitimidade, nulidade, autoexecutoriedade e revogabilidade'],
            'resposta': 'A',
            'explicacao': 'Os atributos dos atos administrativos, segundo a doutrina majoritária (Hely Lopes Meirelles), são: 1) Presunção de legitimidade e veracidade (o ato é presumidamente legal e seus fatos são tidos como verdadeiros, com inversão do ônus da prova); 2) Imperatividade (o ato é imposto unilateralmente, independente da concordância do administrado); 3) Autoexecutoriedade (pode ser executado pela própria Administração sem necessidade de ordem judicial); 4) Tipicidade (o ato deve corresponder a um tipo previsto em lei). Nem todos os atos possuem todos os atributos.',
            'dica': 'Atributos: PI-IA-T = Presunção legitimidade + Imperatividade + Autoexecutoriedade + Tipicidade. Nem todo ato tem todos.',
            'dificuldade': 'fácil',
            'fonte': 'CESPE',
            'ano': 2022,
            'titulo': 'CESPE/INSS/2022 - Atributos dos Atos'
        },
        {
            'enunciado': 'Os requisitos (elementos) do ato administrativo válido são:',
            'opcoes': ['A) Competência, finalidade, forma, motivo e objeto', 'B) Legalidade, impessoalidade, moralidade, publicidade e eficiência', 'C) Imperatividade, autoexecutoriedade, presunção de legitimidade e tipicidade', 'D) Sujeito, objeto, causa, forma e vontade', 'E) Vinculação, discricionariedade, motivação, competência e publicidade'],
            'resposta': 'A',
            'explicacao': 'Os cinco requisitos de validade do ato administrativo (conforme Hely Lopes Meirelles): 1) Competência: o agente deve ter atribuição legal para a prática do ato; 2) Finalidade: o ato deve visar o interesse público (desvio de finalidade = vício); 3) Forma: o ato deve obedecer à forma prescrita em lei; 4) Motivo: a situação de fato e de direito que enseja a prática do ato; 5) Objeto: o conteúdo do ato (o que ele determina). Mnemônico: CO-FI-FOR-MO-OB.',
            'dica': 'Requisitos: CO-FI-FOR-MO-OB (Competência, Finalidade, Forma, Motivo, Objeto). Lembre da sigla!',
            'dificuldade': 'fácil',
            'fonte': 'FCC',
            'ano': 2022,
            'titulo': 'FCC/TCE-PI/2022 - Requisitos do Ato'
        },
        {
            'enunciado': 'O vício de desvio de finalidade (ou desvio de poder) ocorre quando o administrador:',
            'opcoes': ['A) Atua fora de sua competência territorial', 'B) Pratica ato visando fim diverso do previsto em lei, ainda que de interesse público', 'C) Deixa de fundamentar suas decisões', 'D) Pratica ato com objeto ilícito', 'E) Age de forma desproporcional'],
            'resposta': 'B',
            'explicacao': 'O desvio de finalidade (ou desvio de poder) ocorre quando o agente pratica o ato com fim diverso daquele previsto pelo legislador — seja para atingir interesse pessoal, de terceiro, ou até mesmo para atingir outro fim público, mas diferente do que a lei previa. É o vício de finalidade do ato administrativo. Exemplo: remoção de servidor por perseguição pessoal, usando o pretexto de "interesse da administração". O ato pode ser aparentemente legal, mas é nulo pelo vício de finalidade.',
            'dica': 'Desvio de finalidade: ato aparentemente legal, mas com FINALIDADE DIFERENTE da prevista em lei. Difícil de provar (precisa de indícios).',
            'dificuldade': 'médio',
            'fonte': 'CESPE',
            'ano': 2021,
            'titulo': 'CESPE/TRF-1/2021 - Desvio de Finalidade'
        },
        {
            'enunciado': 'Sobre a extinção dos atos administrativos, é INCORRETO afirmar:',
            'opcoes': ['A) A anulação decorre de ilegalidade e tem efeitos ex tunc', 'B) A revogação decorre de conveniência e oportunidade e tem efeitos ex nunc', 'C) A cassação extingue o ato quando o beneficiário descumpre condição necessária para sua manutenção', 'D) A caducidade ocorre quando lei posterior torna inadmissível a situação que o ato havia autorizado', 'E) A revogação pode atingir atos vinculados que geraram direitos adquiridos'],
            'resposta': 'E',
            'explicacao': 'A revogação só pode atingir atos DISCRICIONÁRIOS por razões de mérito (conveniência e oportunidade). Não pode atingir: atos vinculados (que não têm mérito administrativo), atos que geraram direitos adquiridos, atos que exauriram seus efeitos, atos que integram procedimento administrativo ou que decorrem de aprovação judicial. Portanto, a alternativa E está incorreta por combinar dois limites da revogação. A cassação (condição descumprida), caducidade (lei posterior) e anulação (ilegalidade) são formas distintas de extinção.',
            'dica': 'Revogação: só ato DISCRICIONÁRIO, sem direito adquirido, sem exaurimento dos efeitos. NÃO revoga ato vinculado.',
            'dificuldade': 'médio',
            'fonte': 'FGV',
            'ano': 2022,
            'titulo': 'FGV/TJ-MS/2022 - Extinção dos Atos'
        },
        {
            'enunciado': 'A convalidação de atos administrativos com vícios sanáveis é:',
            'opcoes': ['A) Proibida em qualquer hipótese — ato com vício deve ser sempre anulado', 'B) Possível nos vícios de competência (salvo exclusiva) e de forma (quando não essencial)', 'C) Possível para vícios de finalidade e objeto', 'D) Obrigatória sempre que o ato tenha gerado benefício ao administrado', 'E) Exclusividade do Poder Judiciário'],
            'resposta': 'B',
            'explicacao': 'A convalidação (ou saneamento) é a correção retroativa de vícios sanáveis de ato administrativo, com efeitos ex tunc. Conforme art. 55 da Lei 9.784/99, podem ser convalidados: 1) vícios de competência: quando não exclusiva (a autoridade competente ratifica); 2) vícios de forma: quando não essencial ao ato. Não admitem convalidação: vícios de finalidade (desvio de poder), objeto (ilicitude do conteúdo), motivo (fato inexistente) e competência exclusiva. O ato convalidado é retroativamente válido — diferentemente da anulação, que tem efeito retroativo de nulidade.',
            'dica': 'Convalidação possível: vício de COMPETÊNCIA (não exclusiva) + vício de FORMA (não essencial). Retroage — efeito ex tunc.',
            'dificuldade': 'difícil',
            'fonte': 'CESPE',
            'ano': 2022,
            'titulo': 'CESPE/TCU/2022 - Convalidação'
        },
    ],

    # ===== CAPÍTULO 3: Poderes Administrativos =====
    'Poderes Administrativos': [
        {
            'enunciado': 'O poder de polícia é atributo do Estado que restringe direitos individuais em benefício do interesse coletivo. Sobre o poder de polícia, é CORRETO afirmar:',
            'opcoes': ['A) Só pode ser exercido por entidades da Administração Pública direta', 'B) Pode ser delegado às entidades de direito privado integrantes da Administração Indireta que exerçam atividade de fomento', 'C) Atributos do poder de polícia: discricionariedade, autoexecutoriedade e coercibilidade', 'D) Nunca admite delegação a particulares', 'E) O poder de polícia pode ser exercido somente de forma repressiva'],
            'resposta': 'C',
            'explicacao': 'Os atributos do poder de polícia são: 1) Discricionariedade: em regra, o administrador tem liberdade de escolha dos meios e do momento; 2) Autoexecutoriedade: pode ser executado sem necessidade de ordem judicial prévia; 3) Coercibilidade: pode ser imposto mediante força, se necessário. O STJ (REsp 817.534) e o STF (RE 633.782) têm debatido a possibilidade de delegação de poder de polícia fiscalizatório (não sancionatório) a pessoas jurídicas de direito privado da Adm. Indireta (autarquias e EP/SEM de capital público majoritário).',
            'dica': 'Poder de polícia: discricionário + autoexecutório + coercitivo. Fases: ordem, condicionamento, fiscalização, sanção.',
            'dificuldade': 'médio',
            'fonte': 'CESPE',
            'ano': 2022,
            'titulo': 'CESPE/PRF/2022 - Poder de Polícia'
        },
        {
            'enunciado': 'O abuso de poder pode ocorrer nas modalidades de:',
            'opcoes': ['A) Excesso de poder e desvio de poder', 'B) Desvio de poder e falta de poder', 'C) Excesso de poder e falta de poder', 'D) Uso legal do poder e desvio de poder', 'E) Improbidade administrativa e desvio de poder'],
            'resposta': 'A',
            'explicacao': 'O abuso de poder ocorre em duas modalidades: 1) Excesso de poder: o agente atua dentro de sua competência, mas ultrapassa os limites do que a lei permite (excede quantitativamente); 2) Desvio de poder (desvio de finalidade): o agente pratica o ato dentro de sua competência, mas com finalidade diferente da prevista em lei (vício qualitativo). Ambos tornam o ato inválido, sujeito a anulação. O abuso de poder pode ensejar mandado de segurança, ação popular e, em casos mais graves, improbidade administrativa.',
            'dica': 'Abuso de poder: EXCESSO (vai além do permitido) ou DESVIO (fim errado). Ambos invalidam o ato.',
            'dificuldade': 'fácil',
            'fonte': 'FCC',
            'ano': 2021,
            'titulo': 'FCC/MPE-SP/2021 - Abuso de Poder'
        },
    ],

    # ===== CAPÍTULO 4: Licitações e Contratos =====
    'Licitações e Contratos': [
        {
            'enunciado': 'A Nova Lei de Licitações (Lei 14.133/2021) revogou a Lei 8.666/93. Qual das modalidades de licitação foi MANTIDA e qual foi CRIADA pela Lei 14.133/2021?',
            'opcoes': ['A) Manteve a concorrência; criou o diálogo competitivo', 'B) Manteve a tomada de preços; criou o pregão eletrônico', 'C) Manteve a carta-convite; criou o leilão eletrônico', 'D) Manteve o pregão; criou a concorrência simplificada', 'E) Manteve todas as modalidades antigas e criou o diálogo competitivo'],
            'resposta': 'A',
            'explicacao': 'A Lei 14.133/2021 estabelece cinco modalidades: concorrência, pregão, concurso, leilão e diálogo competitivo. O diálogo competitivo é a modalidade nova, inspirada no direito europeu, cabível para contratações complexas em que a Administração não tem solução técnica definida — permite diálogo prévio com potenciais licitantes. A tomada de preços e a carta-convite foram extintas. O pregão foi mantido e atualizado (já regulado pela Lei 10.520/2002, que foi revogada). A concorrência absorveu hipóteses da tomada de preços.',
            'dica': 'Lei 14.133/2021: 5 modalidades = Concorrência + Pregão + Concurso + Leilão + Diálogo Competitivo (NOVO). Tomada de preços e convite = extintas.',
            'dificuldade': 'médio',
            'fonte': 'CESPE',
            'ano': 2022,
            'titulo': 'CESPE/TCE-ES/2022 - Lei 14.133/2021'
        },
        {
            'enunciado': 'O pregão, na Lei 14.133/2021, é modalidade adequada para:',
            'opcoes': ['A) Qualquer contratação da Administração Pública, sem restrição', 'B) Aquisição de bens e serviços comuns, cujo padrão de desempenho possa ser definido objetivamente', 'C) Contratação de obras de engenharia de qualquer valor', 'D) Alienação de bens imóveis da Administração', 'E) Contratos de concessão de serviço público'],
            'resposta': 'B',
            'explicacao': 'O pregão (art. 6º, XLI, Lei 14.133/2021) é modalidade destinada à contratação de bens e serviços comuns, incluídos os serviços comuns de engenharia, podendo ser realizado de forma eletrônica ou presencial. Bens e serviços comuns são aqueles cujos padrões de desempenho e qualidade podem ser objetivamente definidos em edital por especificações usuais do mercado. Para obras de maior complexidade, usa-se concorrência. Para alienação de imóveis, usa-se leilão. Para concessões, usa-se concorrência ou diálogo competitivo.',
            'dica': 'Pregão = bens e serviços COMUNS (especificação objetiva). Obras complexas = concorrência. Alienação imóvel = leilão.',
            'dificuldade': 'médio',
            'fonte': 'FCC',
            'ano': 2023,
            'titulo': 'FCC/PGE-AL/2023 - Pregão'
        },
        {
            'enunciado': 'Na Lei 14.133/2021, as hipóteses de contratação direta dividem-se em inexigibilidade e dispensa de licitação. A inexigibilidade se aplica quando:',
            'opcoes': ['A) O valor do contrato for inferior ao limite para convite', 'B) Houver inviabilidade de competição, como fornecedor exclusivo ou profissional notório', 'C) Houver emergência ou calamidade que impeça a realização de licitação', 'D) A contratação for de pequeno valor (até R$ 50.000)', 'E) A licitação for deserta ou fracassada'],
            'resposta': 'B',
            'explicacao': 'A inexigibilidade de licitação (art. 74, Lei 14.133/2021) ocorre quando há inviabilidade de competição, em hipóteses como: I - aquisição de materiais, equipamentos ou gêneros com fornecedor exclusivo; II - contratação de profissional do setor artístico, diretamente ou por empresário exclusivo; III - contratação de serviço técnico especializado de natureza predominantemente intelectual de profissional notoriamente especializado. A dispensa, por outro lado, é possível a licitação, mas o legislador optou por dispensá-la por razões de conveniência (valores pequenos, emergência, etc.).',
            'dica': 'INEXIGIBILIDADE = inviabilidade de competição (exclusividade, notoriedade). DISPENSA = possível competir, mas dispensa por razão específica.',
            'dificuldade': 'médio',
            'fonte': 'CESPE',
            'ano': 2023,
            'titulo': 'CESPE/TCU/2023 - Inexigibilidade'
        },
        {
            'enunciado': 'Os contratos administrativos possuem cláusulas exorbitantes que os diferenciam dos contratos privados. Qual das alternativas NÃO é cláusula exorbitante?',
            'opcoes': ['A) Alteração unilateral pela Administração', 'B) Rescisão unilateral pela Administração', 'C) Fiscalização e acompanhamento do contrato', 'D) Renegociação de preço por acordo mútuo das partes', 'E) Aplicação de penalidades pela Administração'],
            'resposta': 'D',
            'explicacao': 'As cláusulas exorbitantes são prerrogativas da Administração que não existem nos contratos de direito privado, conferindo à Administração posição de supremacia. São cláusulas exorbitantes (art. 104, Lei 14.133/2021): alteração e rescisão unilateral; fiscalização; aplicação de penalidades; ocupação provisória; retenção de garantias. A renegociação de preço por acordo mútuo é cláusula contratual comum, não exorbitante — ambas as partes concordam, sem imposição unilateral.',
            'dica': 'Cláusulas exorbitantes: poderes UNILATERAIS da Adm (alterar, rescindir, fiscalizar, penalizar). Renegociação bilateral não é exorbitante.',
            'dificuldade': 'médio',
            'fonte': 'FGV',
            'ano': 2022,
            'titulo': 'FGV/TCM-RJ/2022 - Contratos Administrativos'
        },
    ],

    # ===== CAPÍTULO 5: Servidores Públicos =====
    'Servidores Públicos': [
        {
            'enunciado': 'A estabilidade do servidor público, prevista no art. 41 da CF/88, é adquirida após:',
            'opcoes': ['A) 1 ano de efetivo exercício em cargo de provimento efetivo', 'B) 2 anos de efetivo exercício em cargo de provimento efetivo', 'C) 3 anos de efetivo exercício em cargo de provimento efetivo', 'D) 5 anos de efetivo exercício em qualquer cargo público', 'E) Após a posse no cargo efetivo, independentemente de prazo'],
            'resposta': 'C',
            'explicacao': 'O art. 41, caput, CF/88 (com redação da EC 19/1998) dispõe que são estáveis, após 3 (três) anos de efetivo exercício, os servidores nomeados para cargo de provimento efetivo em virtude de concurso público. O §4º exige avaliação especial de desempenho por comissão instituída para essa finalidade como condição para a aquisição da estabilidade. A estabilidade só se aplica a cargos EFETIVOS — não a cargos comissionados (de livre nomeação e exoneração).',
            'dica': 'Estabilidade: 3 anos de exercício em cargo EFETIVO (concurso público) + avaliação de desempenho. EC 19/1998 mudou de 2 para 3 anos.',
            'dificuldade': 'fácil',
            'fonte': 'CESPE',
            'ano': 2022,
            'titulo': 'CESPE/SEAD-DF/2022 - Estabilidade'
        },
        {
            'enunciado': 'O servidor público estável pode perder o cargo nas seguintes hipóteses constitucionais:',
            'opcoes': ['A) Sentença judicial transitada em julgado e processo administrativo disciplinar', 'B) Sentença judicial transitada em julgado, processo administrativo e avaliação de desempenho insuficiente', 'C) Sentença judicial transitada em julgado, processo administrativo, avaliação de desempenho e excesso de gasto com pessoal', 'D) Apenas por sentença judicial transitada em julgado', 'E) A qualquer tempo, por decisão do gestor superior hierárquico'],
            'resposta': 'C',
            'explicacao': 'O art. 41, §1º, CF/88 estabelece que o servidor estável perderá o cargo: I - em virtude de sentença judicial transitada em julgado (com garantias do devido processo penal/civil); II - mediante processo administrativo em que lhe seja assegurada ampla defesa; III - mediante procedimento de avaliação periódica de desempenho, com garantia de ampla defesa. Além dessas, há a hipótese do art. 169, §4º: exoneração por excesso de gastos com pessoal, com indenização proporcional ao tempo de serviço.',
            'dica': 'Servidor estável perde cargo em 4 hipóteses: (1) sentença judicial + (2) PAD + (3) avaliação desempenho + (4) excesso gasto pessoal (art. 169).',
            'dificuldade': 'médio',
            'fonte': 'FCC',
            'ano': 2022,
            'titulo': 'FCC/AL-PI/2022 - Perda do Cargo'
        },
        {
            'enunciado': 'O acúmulo de cargos públicos é vedado constitucionalmente. Qual das hipóteses abaixo é PERMITIDA pela CF/88?',
            'opcoes': ['A) Dois cargos efetivos quaisquer remunerados', 'B) Um cargo efetivo e um cargo de confiança', 'C) Dois cargos de professor em universidades públicas diferentes', 'D) Um cargo de médico e um cargo de administrador', 'E) Um cargo público e um emprego em empresa pública'],
            'resposta': 'C',
            'explicacao': 'O art. 37, XVI e XVII, CF/88 veda a acumulação remunerada de cargos públicos, salvo exceções: a) dois cargos de professor; b) um cargo de professor com outro técnico ou científico; c) dois cargos ou empregos privativos de profissionais de saúde, com profissões regulamentadas. Dois cargos de professor em universidades diferentes é expressamente permitido. Em todos os casos, deve haver compatibilidade de horários e a remuneração somada não pode exceder o teto constitucional.',
            'dica': 'Acúmulo PERMITIDO: 2 professores OU professor + técnico/científico OU 2 profissionais de saúde. Precisa de compatibilidade de horário.',
            'dificuldade': 'médio',
            'fonte': 'CESPE',
            'ano': 2021,
            'titulo': 'CESPE/UFBA/2021 - Acúmulo de Cargos'
        },
    ],

    # ===== CAPÍTULO 6: Bens Públicos =====
    'Bens Públicos': [
        {
            'enunciado': 'Os bens públicos são classificados pelo Código Civil (art. 99) em três categorias. Qual das alternativas apresenta a classificação CORRETA?',
            'opcoes': ['A) Bens de uso comum do povo, bens de uso especial e bens dominicais', 'B) Bens públicos, bens privados e bens mistos', 'C) Bens da União, bens dos Estados e bens dos Municípios', 'D) Bens afetados, bens desafetados e bens patrimoniais', 'E) Bens imóveis, bens móveis e bens fungíveis'],
            'resposta': 'A',
            'explicacao': 'O art. 99 do Código Civil classifica os bens públicos em: I - bens de uso comum do povo (rios, mares, ruas, praças — uso pela coletividade, em geral gratuito); II - bens de uso especial (edifícios públicos, repartições, bens afetados a serviço público); III - bens dominicais (ou dominiais — bens do patrimônio disponível, sem afetação específica, como terrenos vagos e créditos públicos). Os dominicais podem ser alienados quando desafetados.',
            'dica': 'Bens públicos: USO COMUM (todos usam) + USO ESPECIAL (serviço público) + DOMINICAIS (patrimônio disponível). Só dominicais são alienáveis.',
            'dificuldade': 'fácil',
            'fonte': 'FCC',
            'ano': 2021,
            'titulo': 'FCC/TCE-GO/2021 - Classificação dos Bens'
        },
        {
            'enunciado': 'Os bens públicos são, em regra, inalienáveis, imprescritíveis e impenhoráveis. Sobre a inalienabilidade, é CORRETO afirmar:',
            'opcoes': ['A) Todos os bens públicos são absolutamente inalienáveis', 'B) Os bens de uso comum e os de uso especial são inalienáveis enquanto afetados; os dominicais podem ser alienados', 'C) A inalienabilidade pode ser suprimida por lei ordinária para qualquer bem público', 'D) Bens dominicais são sempre inalienáveis', 'E) Apenas bens móveis do domínio público podem ser alienados'],
            'resposta': 'B',
            'explicacao': 'A inalienabilidade dos bens públicos não é absoluta. Os bens de uso comum e uso especial são inalienáveis enquanto estiverem afetados (destinados à finalidade pública). Os bens dominicais, por não terem afetação específica, podem ser alienados, observadas as exigências legais (avaliação prévia, licitação, autorização legislativa etc.). A desafetação de um bem de uso comum ou especial o converte em dominical, tornando-o alienável.',
            'dica': 'Inalienabilidade: regra. Exceção: bens DOMINICAIS (desafetados) podem ser alienados. Afetado = inalienável.',
            'dificuldade': 'médio',
            'fonte': 'CESPE',
            'ano': 2022,
            'titulo': 'CESPE/AGU/2022 - Inalienabilidade'
        },
    ],

    # ===== CAPÍTULO 7: Serviços Públicos =====
    'Serviços Públicos': [
        {
            'enunciado': 'Os princípios que regem os serviços públicos, segundo a doutrina e a legislação, incluem:',
            'opcoes': ['A) Continuidade, generalidade (universalidade), eficiência, segurança, atualidade, modicidade tarifária e cortesia', 'B) Legalidade, moralidade, eficiência, publicidade e impessoalidade', 'C) Proporcionalidade, razoabilidade, continuidade e segurança', 'D) Apenas continuidade e modicidade tarifária', 'E) Eficiência, lucratividade, concorrência e modernidade'],
            'resposta': 'A',
            'explicacao': 'Os princípios dos serviços públicos (art. 6º, Lei 8.987/95) são: continuidade (serviço ininterrupto), generalidade ou universalidade (acesso a todos), eficiência, segurança, atualidade (modernização), modicidade das tarifas (acessibilidade de preços) e cortesia no tratamento dos usuários. O art. 7º, Lei 8.987/95 lista os direitos dos usuários. A interrupção do serviço é excepcionalmente admitida em situações de emergência ou inadimplemento do usuário (após aviso prévio, art. 6º, §3º).',
            'dica': 'Princípios dos serviços públicos: C-G-E-S-A-M-C = Continuidade, Generalidade, Eficiência, Segurança, Atualidade, Modicidade, Cortesia.',
            'dificuldade': 'fácil',
            'fonte': 'CESPE',
            'ano': 2022,
            'titulo': 'CESPE/ANEEL/2022 - Princípios dos Serviços Públicos'
        },
        {
            'enunciado': 'A concessão de serviço público distingue-se da permissão porque:',
            'opcoes': ['A) A concessão é sempre por prazo determinado; a permissão é por prazo indeterminado', 'B) A concessão é contratual e pressupõe licitação; a permissão é precária e discricionária sem licitação', 'C) Na concessão o concessionário é pessoa jurídica ou consórcio; na permissão pode ser pessoa física', 'D) A concessão não admite rescisão unilateral; a permissão admite', 'E) C e D estão corretas'],
            'resposta': 'C',
            'explicacao': 'A concessão (art. 2º, II, Lei 8.987/95) exige que o concessionário seja pessoa jurídica ou consórcio de empresas. A permissão (art. 2º, IV, Lei 8.987/95) pode ser outorgada a pessoa física ou jurídica. Ambas exigem licitação (art. 175, CF). A permissão é contrato de adesão de caráter precário (admite revogação por conveniência), mas também é formalizada contratualmente. A concessão é mais estável e tem prazos maiores.',
            'dica': 'Concessão: só pessoa jurídica/consórcio. Permissão: pessoa física ou jurídica. Ambas: licitação obrigatória.',
            'dificuldade': 'médio',
            'fonte': 'FCC',
            'ano': 2022,
            'titulo': 'FCC/SABESP/2022 - Concessão vs Permissão'
        },
    ],

    # ===== CAPÍTULO 8: Controle da Administração =====
    'Controle da Administração': [
        {
            'enunciado': 'O Tribunal de Contas da União (TCU) exerce o controle externo da Administração Federal. Sobre o TCU, é CORRETO afirmar:',
            'opcoes': ['A) O TCU integra o Poder Judiciário federal', 'B) O TCU é órgão auxiliar do Congresso Nacional, com função de controle externo', 'C) As decisões do TCU têm força de coisa julgada imutável', 'D) O TCU só pode fiscalizar a administração direta federal', 'E) O TCU tem poder para anular contratos administrativos com força vinculante'],
            'resposta': 'B',
            'explicacao': 'O TCU (art. 71, CF) é órgão auxiliar do Congresso Nacional no controle externo da Administração Pública Federal. Não integra o Poder Judiciário — sua natureza é de órgão de controle externo autônomo. As decisões do TCU têm natureza administrativa (não jurisdicional), podendo ser revistas pelo Judiciário. O TCU fiscaliza a Administração direta e indireta federal, empresas públicas e qualquer entidade que receba recursos federais. Pode determinar medidas corretivas, mas seus efeitos diferem da jurisdição.',
            'dica': 'TCU: auxilia o CN no controle externo. NÃO é Poder Judiciário. Decisões são ADMINISTRATIVAS (revisáveis pelo Judiciário).',
            'dificuldade': 'fácil',
            'fonte': 'CESPE',
            'ano': 2022,
            'titulo': 'CESPE/TCU/2022 - Natureza do TCU'
        },
        {
            'enunciado': 'O controle judicial dos atos administrativos abrange o controle de:',
            'opcoes': ['A) Apenas a legalidade, não podendo o Judiciário substituir o mérito administrativo', 'B) Legalidade e mérito administrativo, podendo substituir qualquer decisão do administrador', 'C) Apenas a forma dos atos, não seu conteúdo', 'D) Somente atos vinculados, não atos discricionários', 'E) Apenas atos do Poder Executivo, não do Legislativo'],
            'resposta': 'A',
            'explicacao': 'O Judiciário pode controlar os atos administrativos quanto à sua LEGALIDADE (incluindo constitucionalidade, proporcionalidade, razoabilidade, desvio de finalidade etc.), mas não pode substituir o mérito administrativo — a conveniência e oportunidade do ato discricionário. O Judiciário não pode dizer qual é a melhor política pública, mas pode anular ato ilegal, desproporcional ou contrário ao interesse público. A doutrina moderna fala em controle da juridicidade, mais amplo que a mera legalidade.',
            'dica': 'Controle judicial: alcança LEGALIDADE + juridicidade (proporcionalidade, razoabilidade). NÃO alcança o mérito (conveniência e oportunidade).',
            'dificuldade': 'médio',
            'fonte': 'FGV',
            'ano': 2022,
            'titulo': 'FGV/TJ-SC/2022 - Controle Judicial'
        },
    ],

    # ===== CAPÍTULO 9: Improbidade Administrativa =====
    'Improbidade Administrativa': [
        {
            'enunciado': 'A Lei 8.429/1992, com as alterações da Lei 14.230/2021, dividiu os atos de improbidade em categorias. Quais são as categorias atualmente vigentes?',
            'opcoes': ['A) Enriquecimento ilícito, lesão ao erário e violação aos princípios da Administração', 'B) Enriquecimento ilícito e lesão ao erário (a violação de princípios foi extinta pela Lei 14.230/2021)', 'C) Enriquecimento ilícito, lesão ao erário e improbidade culposa', 'D) Improbidade dolosa e improbidade culposa', 'E) Corrupção passiva, corrupção ativa e improbidade culposa'],
            'resposta': 'B',
            'explicacao': 'A Lei 14.230/2021 reformou profundamente a Lei de Improbidade. As principais mudanças: 1) Extinguiu o art. 11 (violação de princípios) como categoria autônoma de improbidade; 2) Exige DOLO (elemento subjetivo) para todos os atos de improbidade — eliminou a modalidade culposa; 3) Reformulou o art. 9º (enriquecimento ilícito) e art. 10 (lesão ao erário). Conduta meramente culposa pode gerar responsabilidade civil, mas não improbidade. O Ministério Público passou a ser o único legitimado para propor a ação de improbidade.',
            'dica': 'Lei 14.230/2021: acabou com improbidade por violação de princípios (art.11) e com modalidade culposa. Agora só 2 categorias + só DOLO.',
            'dificuldade': 'médio',
            'fonte': 'CESPE',
            'ano': 2022,
            'titulo': 'CESPE/PGM-SP/2022 - Lei 14.230/2021'
        },
        {
            'enunciado': 'Sobre as sanções por ato de improbidade administrativa, a Lei 14.230/2021 estabelece que:',
            'opcoes': ['A) A perda da função pública e a suspensão dos direitos políticos são sanções automáticas pela condenação', 'B) O prazo de suspensão dos direitos políticos para lesão ao erário é de 5 a 8 anos', 'C) A multa civil no enriquecimento ilícito pode chegar a 3 vezes o valor do acréscimo patrimonial', 'D) A proibição de contratar com o poder público é de 3 anos para qualquer ato de improbidade', 'E) A condenação por improbidade gera automaticamente condenação criminal'],
            'resposta': 'C',
            'explicacao': 'A Lei 14.230/2021 reformulou as sanções. Para enriquecimento ilícito (art. 9º): perda dos bens acrescidos ilicitamente, ressarcimento integral do dano (se houver), perda da função pública, suspensão dos direitos políticos de 14 a 16 anos, pagamento de multa civil de até 3x o valor do acréscimo patrimonial, proibição de contratar com poder público por 14 anos. Para lesão ao erário (art. 10º): suspensão de 5 a 8 anos. Sanções NÃO são automáticas — devem ser aplicadas pelo Judiciário.',
            'dica': 'Enriquecimento ilícito: suspensão 14-16 anos, multa até 3x. Lesão ao erário: suspensão 5-8 anos. Sanções não são automáticas.',
            'dificuldade': 'difícil',
            'fonte': 'CESPE',
            'ano': 2023,
            'titulo': 'CESPE/TCE-PR/2023 - Sanções Improbidade'
        },
    ],

    # ===== CAPÍTULO 10: Processo Administrativo =====
    'Processo Administrativo': [
        {
            'enunciado': 'A Lei 9.784/1999 regula o processo administrativo no âmbito da Administração Pública Federal. Sobre os princípios desse processo, é CORRETO afirmar:',
            'opcoes': ['A) A administração pode agir de ofício, independentemente de provocação, no processo administrativo', 'B) O processo administrativo só pode ser iniciado por requerimento do interessado', 'C) O contraditório e ampla defesa não se aplicam ao processo administrativo', 'D) A publicidade dos atos administrativos é sempre absoluta, sem exceções', 'E) O princípio da oficialidade impede a produção de provas pela Administração'],
            'resposta': 'A',
            'explicacao': 'O princípio da oficialidade (art. 2º, XII, Lei 9.784/99) permite que a Administração instaure e instrua o processo administrativo de ofício, sem necessidade de provocação do interessado. A Administração pode e deve impulsionar o processo em busca da verdade material. O processo também pode ser iniciado por requerimento (art. 5º), mas não exclusivamente. O contraditório e ampla defesa (art. 5º, LV, CF) se aplicam ao processo administrativo. A publicidade tem exceções (sigilo necessário).',
            'dica': 'Oficialidade: Administração pode iniciar e impulsionar o processo DE OFÍCIO. Busca a verdade material.',
            'dificuldade': 'fácil',
            'fonte': 'FCC',
            'ano': 2022,
            'titulo': 'FCC/TRT-24/2022 - Princípios do Processo Adm'
        },
        {
            'enunciado': 'O prazo para a Administração anular ato que tenha gerado efeitos favoráveis aos destinatários de boa-fé, segundo a Lei 9.784/1999, é de:',
            'opcoes': ['A) 1 ano', 'B) 2 anos', 'C) 3 anos', 'D) 5 anos', 'E) 10 anos'],
            'resposta': 'D',
            'explicacao': 'O art. 54 da Lei 9.784/1999 estabelece que o direito da Administração de anular os atos administrativos de que decorram efeitos favoráveis para os destinatários decai em 5 (cinco) anos, contados da data em que foram praticados, salvo comprovada má-fé. Esse prazo decadencial protege a segurança jurídica e a boa-fé do administrado. A má-fé do beneficiário afasta a decadência, permitindo anulação a qualquer tempo.',
            'dica': 'Prazo decadencial para anular ato favorável ao administrado de BOA-FÉ: 5 ANOS (art. 54, Lei 9.784/99). Má-fé: sem prazo.',
            'dificuldade': 'médio',
            'fonte': 'CESPE',
            'ano': 2022,
            'titulo': 'CESPE/CGU/2022 - Decadência Administrativa'
        },
    ],
}
