"""
Direito Penal — Crimes contra a Administração, Improbidade e Hediondos
30 questões cobrindo 3 capítulos
"""

CAPITULOS = [
    {
        'numero': 8,
        'titulo': 'Crimes contra a Administração Pública',
        'descricao': 'Peculato, concussão, corrupção passiva e ativa, prevaricação, advocacia administrativa e condescendência criminosa (arts. 312 a 327 do Código Penal), com foco nas modalidades, na figura do funcionário público por equiparação e na jurisprudência do STJ/STF.'
    },
    {
        'numero': 9,
        'titulo': 'Lei de Improbidade Administrativa',
        'descricao': 'Atos de improbidade administrativa que importam enriquecimento ilícito, prejuízo ao erário e violação a princípios da Administração, sanções, prazos prescricionais e principais alterações trazidas pela Lei 14.230/2021, incluindo a exigência de dolo específico.'
    },
    {
        'numero': 10,
        'titulo': 'Crimes Hediondos e Lei Antidrogas',
        'descricao': 'Lei 8.072/90 (rol taxativo, progressão de regime, livramento condicional), Lei 9.455/97 (tortura), legislação antiterrorismo e Lei 11.343/2006 (tráfico, uso de drogas, causas de aumento e diminuição de pena, tráfico privilegiado).'
    },
]

QUESTOES = {
    'Crimes contra a Administração Pública': [
        {
            'enunciado': 'João, servidor público federal, recebe a guarda de um veículo oficial em razão do cargo e, valendo-se dessa posse, apropria-se do bem em proveito próprio. De acordo com o Código Penal e a jurisprudência do STJ, a conduta de João configura:',
            'opcoes': [
                'A) Furto qualificado pelo abuso de confiança, pois o bem pertencia à União.',
                'B) Peculato-apropriação (art. 312, caput, primeira parte, do CP).',
                'C) Peculato-desvio, já que o bem foi destinado a finalidade diversa da pública.',
                'D) Peculato-furto (art. 312, §1º, do CP), pois houve subtração da coisa pública.',
                'E) Estelionato contra a Administração Pública.'
            ],
            'resposta': 'B',
            'explicacao': 'O peculato-apropriação (art. 312, caput, 1ª parte, CP) ocorre quando o funcionário público, tendo a posse do bem em razão do cargo, dele se apropria. Como João já tinha a posse legítima do veículo (em razão do cargo) e converteu essa posse em domínio (animus rem sibi habendi), tipifica-se a apropriação, e não o peculato-furto, que exige a subtração de bem cuja posse o agente NÃO tinha.',
            'dica': 'Mnemônico do peculato: APROPRIA (já tem a posse) x DESVIA (dá outra destinação) x FURTA (não tem a posse, mas se vale do cargo).',
            'dificuldade': 'fácil',
            'fonte': 'CESPE',
            'ano': 2023,
            'titulo': 'CESPE/PF/2023 - Peculato-apropriação'
        },
        {
            'enunciado': 'Sobre o crime de concussão (art. 316 do CP), assinale a alternativa correta:',
            'opcoes': [
                'A) Trata-se de crime material, que se consuma somente com o efetivo recebimento da vantagem indevida.',
                'B) A exigência da vantagem indevida pode ser feita após o agente deixar a função, desde que em razão dela.',
                'C) O crime de concussão admite a forma culposa, segundo entendimento majoritário do STJ.',
                'D) A concussão é praticada por particular, equiparado a funcionário público pela função pública exercida.',
                'E) A vantagem exigida na concussão deve ser, necessariamente, de natureza econômica e em dinheiro.'
            ],
            'resposta': 'B',
            'explicacao': 'A concussão é crime formal, consumando-se com a mera EXIGÊNCIA da vantagem indevida, ainda que esta não seja efetivamente entregue. O art. 316 prevê expressamente a possibilidade de a exigência ocorrer "ainda que fora da função, ou antes de assumi-la, mas em razão dela". O sujeito ativo é o funcionário público (crime próprio), não admitindo modalidade culposa.',
            'dica': 'Concussão = EXIGE (com ameaça implícita do cargo). Corrupção passiva = SOLICITA/RECEBE (sem coação). Ambos são crimes formais.',
            'dificuldade': 'médio',
            'fonte': 'FCC',
            'ano': 2022,
            'titulo': 'FCC/TJ-SP/2022 - Concussão'
        },
        {
            'enunciado': 'Maria, oficial de cartório, deixa de praticar ato de ofício para satisfazer interesse pessoal de uma amiga, retardando a expedição de certidão. Conforme o art. 319 do CP, sua conduta configura:',
            'opcoes': [
                'A) Corrupção passiva privilegiada.',
                'B) Advocacia administrativa.',
                'C) Prevaricação.',
                'D) Condescendência criminosa.',
                'E) Fato atípico, pois exige-se vantagem econômica.'
            ],
            'resposta': 'C',
            'explicacao': 'A prevaricação (art. 319 do CP) consiste em retardar ou deixar de praticar, indevidamente, ato de ofício, ou praticá-lo contra disposição expressa de lei, para satisfazer INTERESSE OU SENTIMENTO PESSOAL. O elemento subjetivo específico (interesse pessoal) é o que diferencia a prevaricação da corrupção passiva (que exige vantagem indevida) e da mera infração funcional administrativa.',
            'dica': 'Prevaricação = "P" de Pessoal (interesse ou sentimento pessoal). Sem vantagem indevida, mas com motivação egoística.',
            'dificuldade': 'fácil',
            'fonte': 'CESPE',
            'ano': 2023,
            'titulo': 'CESPE/TJ-DFT/2023 - Prevaricação'
        },
        {
            'enunciado': 'Acerca do conceito de funcionário público para fins penais (art. 327 do CP), julgue a assertiva: Considera-se funcionário público, por equiparação, quem exerce cargo, emprego ou função em entidade paraestatal, bem como quem trabalha para empresa prestadora de serviço contratada ou conveniada para a execução de atividade típica da Administração Pública.',
            'opcoes': [
                'A) Verdadeiro',
                'B) Falso'
            ],
            'resposta': 'A',
            'explicacao': 'O §1º do art. 327 do CP, com redação dada pela Lei 9.983/2000, equipara a funcionário público quem exerce cargo, emprego ou função em entidade paraestatal e também quem trabalha para empresa prestadora de serviço contratada ou conveniada para a execução de ATIVIDADE TÍPICA da Administração Pública. O STJ tem reiterado essa interpretação ampliativa para fins de tipificação de crimes funcionais.',
            'dica': 'Funcionário público "por equiparação" = paraestatais + terceirizados que executam atividade TÍPICA da Administração.',
            'dificuldade': 'médio',
            'fonte': 'CESPE',
            'ano': 2022,
            'titulo': 'CESPE/PC-DF/2022 - Funcionário público por equiparação'
        },
        {
            'enunciado': 'Sobre o crime de corrupção passiva (art. 317 do CP), à luz da jurisprudência consolidada do STF e do STJ, é correto afirmar:',
            'opcoes': [
                'A) A corrupção passiva é crime bilateral, exigindo-se necessariamente a aceitação da vantagem para sua consumação.',
                'B) A simples solicitação de vantagem indevida pelo funcionário público, em razão da função, consuma o crime, ainda que não recebida.',
                'C) Para a configuração do tipo, exige-se a prática efetiva do ato de ofício relacionado à vantagem.',
                'D) A corrupção passiva absorve sempre o crime praticado pelo funcionário em razão da vantagem recebida (ato funcional).',
                'E) O recebimento de presentes de pequeno valor (até dez por cento do salário-mínimo) é causa legal de exclusão da tipicidade.'
            ],
            'resposta': 'B',
            'explicacao': 'A corrupção passiva (art. 317 do CP) é crime FORMAL e UNILATERAL, consumando-se com a mera solicitação da vantagem indevida pelo funcionário, dispensando o efetivo recebimento e o consentimento do corruptor. A prática do ato de ofício é causa de aumento de pena (art. 317, §1º), e não elementar. Inexiste, no Brasil, regra legal de bagatela quanto a presentes para servidores em geral.',
            'dica': 'Corrupção passiva = solicita/recebe/aceita promessa. Basta UMA dessas condutas para consumar (crime formal e unilateral).',
            'dificuldade': 'médio',
            'fonte': 'FGV',
            'ano': 2024,
            'titulo': 'FGV/MPE-RJ/2024 - Corrupção passiva'
        },
        {
            'enunciado': 'No tocante ao crime de advocacia administrativa (art. 321 do CP), assinale a alternativa correta:',
            'opcoes': [
                'A) Trata-se de crime próprio cometido por advogado regularmente inscrito na OAB que defenda interesse particular em juízo.',
                'B) Patrocinar interesse legítimo perante a Administração configura o tipo, ainda que sem o uso da função.',
                'C) Exige-se, como elementar, a obtenção de vantagem econômica pelo agente.',
                'D) O crime consiste em patrocinar, direta ou indiretamente, interesse privado perante a Administração Pública, valendo-se da qualidade de funcionário, podendo o interesse ser legítimo ou ilegítimo.',
                'E) A advocacia administrativa absorve, em qualquer hipótese, o crime de corrupção passiva quando praticada pelo mesmo agente.'
            ],
            'resposta': 'D',
            'explicacao': 'A advocacia administrativa (art. 321 do CP) consiste em patrocinar, direta ou indiretamente, interesse privado perante a Administração Pública, VALENDO-SE DA QUALIDADE DE FUNCIONÁRIO. O interesse pode ser legítimo (caput) ou ilegítimo (parágrafo único, qualificadora). Não se exige vantagem econômica para o agente — basta o uso da função para favorecer terceiro.',
            'dica': '"Advocacia administrativa": o servidor "advoga" (patrocina) pelos outros DENTRO da Administração, usando seu cargo como porta de entrada.',
            'dificuldade': 'médio',
            'fonte': 'CESPE',
            'ano': 2021,
            'titulo': 'CESPE/PGE-PE/2021 - Advocacia administrativa'
        },
        {
            'enunciado': 'Acerca do crime de condescendência criminosa (art. 320 do CP), julgue a assertiva: O delegado de polícia que, por indulgência, deixa de instaurar inquérito policial contra subordinado que praticou infração funcional pratica condescendência criminosa.',
            'opcoes': [
                'A) Verdadeiro',
                'B) Falso'
            ],
            'resposta': 'A',
            'explicacao': 'A condescendência criminosa (art. 320 do CP) consiste em deixar o funcionário, por indulgência, de responsabilizar SUBORDINADO que cometeu infração no exercício do cargo ou, quando lhe falte competência, não levar o fato ao conhecimento da autoridade competente. O delegado, ao deixar de apurar a infração funcional do subordinado por mera indulgência (sem visar interesse pessoal), incorre exatamente nesse tipo penal.',
            'dica': 'Condescendência criminosa = chefe "fechando os olhos" para falta do subordinado por INDULGÊNCIA (não por interesse pessoal — senão seria prevaricação).',
            'dificuldade': 'fácil',
            'fonte': 'CESPE',
            'ano': 2022,
            'titulo': 'CESPE/PC-PA/2022 - Condescendência criminosa'
        },
        {
            'enunciado': 'Acerca do peculato culposo (art. 312, §2º, do CP), à luz da jurisprudência do STJ, assinale a alternativa CORRETA:',
            'opcoes': [
                'A) A reparação do dano antes da sentença irrecorrível extingue a punibilidade do peculato doloso e culposo.',
                'B) A reparação do dano antes da sentença irrecorrível extingue a punibilidade apenas do peculato culposo; se posterior, reduz a pena pela metade.',
                'C) A reparação do dano, em qualquer espécie de peculato, é mero atenuante genérico.',
                'D) O peculato culposo é incompatível com a figura do funcionário por equiparação prevista no art. 327, §1º.',
                'E) A reparação posterior à sentença irrecorrível, no peculato culposo, extingue a punibilidade.'
            ],
            'resposta': 'B',
            'explicacao': 'Conforme o art. 312, §3º, do CP, no peculato CULPOSO a reparação do dano, se ANTES da sentença irrecorrível, extingue a punibilidade; se posterior, reduz de metade a pena imposta. Esse benefício é exclusivo do peculato culposo — no peculato doloso, a reparação é apenas atenuante (art. 65, III, "b") ou causa de redução do art. 16 (arrependimento posterior), conforme o caso.',
            'dica': 'Peculato culposo é o ÚNICO em que reparar o dano antes da sentença EXTINGUE a punibilidade. Depois, reduz pela metade.',
            'dificuldade': 'médio',
            'fonte': 'FCC',
            'ano': 2023,
            'titulo': 'FCC/TCE-SP/2023 - Peculato culposo'
        },
        {
            'enunciado': 'Pedro, servidor público estadual, foi denunciado pelo crime de peculato-desvio. A defesa alegou atipicidade material, sob o argumento de que o valor desviado (R$ 350,00) seria insignificante. Conforme entendimento consolidado do STF e do STJ:',
            'opcoes': [
                'A) Aplica-se o princípio da insignificância em qualquer crime contra a Administração Pública, desde que o prejuízo seja inferior a um salário-mínimo.',
                'B) O princípio da insignificância é, em regra, INAPLICÁVEL aos crimes praticados por funcionário público contra a Administração Pública, pois tutelam também a moralidade administrativa.',
                'C) A jurisprudência admite a insignificância em peculato, desde que haja reparação espontânea do dano.',
                'D) O STJ admite o princípio da insignificância no peculato, mas o STF o rejeita expressamente.',
                'E) O princípio da insignificância afasta a tipicidade formal do peculato em todas as hipóteses.'
            ],
            'resposta': 'B',
            'explicacao': 'Tanto o STF quanto o STJ firmaram entendimento de que o princípio da insignificância NÃO se aplica, em regra, aos crimes contra a Administração Pública praticados por funcionário público, pois o bem jurídico tutelado vai além do patrimônio: protege-se a MORALIDADE ADMINISTRATIVA. Ressalva-se apenas o crime de descaminho (Súmula 599 do STJ admite a tese, com exceções). Vide AgRg no AREsp 1.794.857/SP (STJ, 2021).',
            'dica': 'Súmula 599 do STJ: insignificância NÃO se aplica aos crimes contra a Administração Pública (salvo descaminho, em situações específicas).',
            'dificuldade': 'difícil',
            'fonte': 'CESPE',
            'ano': 2024,
            'titulo': 'CESPE/AGU/2024 - Insignificância e crimes funcionais'
        },
        {
            'enunciado': 'Quanto ao crime de corrupção ativa (art. 333 do CP), analise as proposições abaixo:\n\nI. Trata-se de crime praticado por particular contra a Administração em geral.\nII. Consuma-se com o oferecimento ou promessa de vantagem indevida ao funcionário, ainda que ele recuse.\nIII. A causa de aumento de pena (parágrafo único) incide se, em razão da vantagem ou promessa, o funcionário retarda ou omite ato de ofício.\nIV. Para a consumação, exige-se a aceitação da vantagem pelo funcionário público.\n\nEstão CORRETAS apenas:',
            'opcoes': [
                'A) I, II e III.',
                'B) I, III e IV.',
                'C) II, III e IV.',
                'D) I, II e IV.',
                'E) Todas estão corretas.'
            ],
            'resposta': 'A',
            'explicacao': 'A corrupção ativa (art. 333 do CP) é crime praticado por PARTICULAR contra a Administração em geral (item I correto). Consuma-se com o mero oferecimento ou promessa de vantagem indevida ao funcionário, sendo crime FORMAL e UNILATERAL — independe da aceitação (item II correto, item IV incorreto). O parágrafo único traz causa de aumento se, em razão da vantagem, o funcionário retarda ou omite ato de ofício, ou o pratica infringindo dever funcional (item III correto).',
            'dica': 'Corrupção ativa e passiva são crimes AUTÔNOMOS — não exigem reciprocidade. Basta oferecer (ativa) ou solicitar (passiva).',
            'dificuldade': 'difícil',
            'fonte': 'FGV',
            'ano': 2023,
            'titulo': 'FGV/PC-RJ/2023 - Corrupção ativa'
        },
    ],
    'Lei de Improbidade Administrativa': [
        {
            'enunciado': 'A Lei 14.230/2021 promoveu profundas alterações na Lei 8.429/92. Sobre o regime atualmente vigente, assinale a alternativa CORRETA:',
            'opcoes': [
                'A) Os atos de improbidade administrativa podem ser praticados a título doloso ou culposo, conforme a modalidade.',
                'B) Apenas o ato de improbidade que cause prejuízo ao erário admite a forma culposa.',
                'C) Todas as modalidades de improbidade administrativa exigem DOLO ESPECÍFICO, não se admitindo a forma culposa.',
                'D) O dolo eventual é suficiente para todas as modalidades de improbidade administrativa.',
                'E) A modalidade culposa subsiste apenas para servidores públicos efetivos.'
            ],
            'resposta': 'C',
            'explicacao': 'Após a Lei 14.230/2021, o art. 1º, §§1º e 2º, da Lei 8.429/92 passou a exigir DOLO ESPECÍFICO (vontade livre e consciente de alcançar o resultado ilícito tipificado) para todas as modalidades de improbidade — eliminando completamente a figura culposa que antes existia para o art. 10 (prejuízo ao erário). O STF, no Tema 1.199, reconheceu a irretroatividade da norma quanto às culposas já transitadas em julgado, mas para casos pendentes a exigência de dolo é a regra.',
            'dica': 'Pós-2021: improbidade exige DOLO ESPECÍFICO sempre. Culpa não tipifica mais nada (nem o art. 10).',
            'dificuldade': 'médio',
            'fonte': 'CESPE',
            'ano': 2024,
            'titulo': 'CESPE/TCE-RJ/2024 - Lei 14.230/2021'
        },
        {
            'enunciado': 'Sobre os atos de improbidade que importam enriquecimento ilícito (art. 9º da LIA), com a redação da Lei 14.230/2021, é INCORRETO afirmar:',
            'opcoes': [
                'A) Configura-se quando o agente público aufere vantagem patrimonial indevida em razão do exercício do cargo.',
                'B) O rol do art. 9º é meramente exemplificativo, admitindo-se outras condutas análogas.',
                'C) A modalidade exige dolo específico de obter o proveito ilícito.',
                'D) A sanção pode incluir a perda dos bens acrescidos ilicitamente, multa civil e suspensão dos direitos políticos.',
                'E) A perda da função pública atinge apenas o vínculo com o ente lesado, conforme a nova redação.'
            ],
            'resposta': 'B',
            'explicacao': 'A Lei 14.230/2021 alterou o caput do art. 9º para deixar claro que os tipos previstos são TAXATIVOS (numerus clausus), assim como nos arts. 10 e 11. Antes, prevalecia a interpretação de rol exemplificativo. As demais alternativas estão corretas: a perda da função pública, conforme art. 12, §1º, atinge apenas o vínculo com o ente lesado pela conduta (alteração relevante da nova lei).',
            'dica': 'Pós-2021 os róis dos arts. 9º, 10 e 11 são TAXATIVOS. Nada de "outras condutas análogas".',
            'dificuldade': 'difícil',
            'fonte': 'FGV',
            'ano': 2023,
            'titulo': 'FGV/TJ-MA/2023 - Enriquecimento ilícito'
        },
        {
            'enunciado': 'Acerca do prazo prescricional na Lei de Improbidade Administrativa após a Lei 14.230/2021, julgue a assertiva: O prazo de prescrição para o ajuizamento da ação de improbidade administrativa é de 8 anos, contados a partir da ocorrência do fato ou, no caso de infrações permanentes, do dia em que cessou a permanência.',
            'opcoes': [
                'A) Verdadeiro',
                'B) Falso'
            ],
            'resposta': 'A',
            'explicacao': 'O art. 23 da Lei 8.429/92, com redação da Lei 14.230/2021, fixa o prazo prescricional UNIFORME de 8 anos, contados da ocorrência do fato ou, em caso de infrações permanentes, do dia em que cessou a permanência. A nova lei também introduziu a prescrição intercorrente (art. 23, §§4º a 8º), pela metade do prazo (4 anos), entre marcos processuais.',
            'dica': 'LIA pós-2021: prescrição = 8 anos do fato (era 5 antes). Intercorrente = 4 anos entre marcos processuais.',
            'dificuldade': 'fácil',
            'fonte': 'CESPE',
            'ano': 2023,
            'titulo': 'CESPE/MPU/2023 - Prescrição na LIA'
        },
        {
            'enunciado': 'João, prefeito municipal, contratou empresa sem prévia licitação para reforma de escola, causando comprovado prejuízo ao erário. À luz do art. 10 da Lei 8.429/92, com a redação da Lei 14.230/2021, julgue:',
            'opcoes': [
                'A) Mesmo que a contratação tenha sido por mera negligência, João responderá por ato de improbidade.',
                'B) Para responsabilização por improbidade, é necessária a comprovação de DOLO ESPECÍFICO de João em causar o prejuízo ou obter vantagem indevida.',
                'C) Basta o erro grosseiro, conforme a Lei de Introdução às Normas do Direito Brasileiro, para configurar improbidade.',
                'D) A ausência de licitação configura, automaticamente, improbidade na modalidade enriquecimento ilícito.',
                'E) A responsabilização independe de prova de prejuízo, bastando a violação formal à Lei 8.666/93 ou Lei 14.133/2021.'
            ],
            'resposta': 'B',
            'explicacao': 'Após a Lei 14.230/2021, o art. 10 da LIA passou a exigir DOLO ESPECÍFICO ("vontade livre e consciente de alcançar o resultado ilícito"). A mera ilegalidade ou negligência (culpa grave) NÃO configura mais improbidade. Há necessidade de prova de efetiva LESÃO AO ERÁRIO (dano real, não presumido) e do elemento subjetivo doloso. Esse foi um dos pontos mais debatidos no STF — ARE 843.989/PR (Tema 1.199).',
            'dica': 'Improbidade pós-2021: precisa de DOLO ESPECÍFICO + DANO REAL (não mais presumido) no art. 10.',
            'dificuldade': 'difícil',
            'fonte': 'CESPE',
            'ano': 2024,
            'titulo': 'CESPE/PGE-DF/2024 - Prejuízo ao erário'
        },
        {
            'enunciado': 'Sobre os atos de improbidade que atentam contra os princípios da Administração Pública (art. 11 da LIA), com a Lei 14.230/2021, assinale a alternativa CORRETA:',
            'opcoes': [
                'A) A simples violação a princípios genéricos da Administração configura ato de improbidade, conforme entendimento atual.',
                'B) A revogação tácita do dispositivo afastou a possibilidade de improbidade por violação a princípios.',
                'C) O rol do art. 11 passou a ser taxativo, descrevendo condutas específicas, e exige dolo específico do agente.',
                'D) A culpa grave foi mantida como elemento subjetivo suficiente para a tipificação do art. 11.',
                'E) Os atos do art. 11 não admitem aplicação da pena de perda da função pública.'
            ],
            'resposta': 'C',
            'explicacao': 'A Lei 14.230/2021 transformou o art. 11 da LIA em rol TAXATIVO, listando expressamente as condutas que constituem improbidade por violação a princípios (incisos atualmente em vigor, tendo havido revogação de vários incisos antigos como o I e o II). Exige-se dolo específico, e o §1º deixa claro que "não basta a voluntariedade do agente". A pena de perda da função pública continua possível (art. 12, III), embora atenuada no novo regime.',
            'dica': 'Art. 11 pós-2021: rol TAXATIVO + dolo específico. Não é mais "qualquer violação a princípio".',
            'dificuldade': 'médio',
            'fonte': 'FCC',
            'ano': 2023,
            'titulo': 'FCC/PGE-AM/2023 - Violação a princípios'
        },
        {
            'enunciado': 'Sobre a aplicação das sanções da Lei 8.429/92, assinale a alternativa CORRETA conforme o art. 12 com redação da Lei 14.230/2021:',
            'opcoes': [
                'A) A perda dos bens acrescidos ilicitamente é cabível em qualquer modalidade de improbidade.',
                'B) A suspensão dos direitos políticos é vitalícia, podendo ser revista após dez anos.',
                'C) As sanções devem ser aplicadas cumulativamente em todos os casos, vedada a dosimetria proporcional.',
                'D) Para o ato do art. 9º (enriquecimento ilícito), a suspensão dos direitos políticos pode ser de até 14 anos e a multa civil equivalente ao acréscimo patrimonial.',
                'E) A pena de proibição de contratar com o Poder Público não se aplica a pessoas jurídicas envolvidas no ato.'
            ],
            'resposta': 'D',
            'explicacao': 'O art. 12, I, da LIA (redação da Lei 14.230/2021) prevê, para o ato de enriquecimento ilícito (art. 9º), a perda dos bens acrescidos ilicitamente, perda da função pública, suspensão dos direitos políticos por até 14 ANOS, multa civil EQUIVALENTE AO VALOR DO ACRÉSCIMO PATRIMONIAL e proibição de contratar com o Poder Público por até 14 anos. As sanções podem ser aplicadas isolada ou cumulativamente, conforme a gravidade (art. 12, §1º). A perda dos bens acrescidos pressupõe o efetivo enriquecimento — não cabe nas hipóteses do art. 11.',
            'dica': 'Sanções LIA — escala (pós-2021): art. 9º = suspensão direitos políticos até 14 anos; art. 10 = até 12 anos; art. 11 = até 4 anos.',
            'dificuldade': 'difícil',
            'fonte': 'CESPE',
            'ano': 2024,
            'titulo': 'CESPE/MP-RJ/2024 - Sanções LIA'
        },
        {
            'enunciado': 'Sobre a legitimidade ativa para propor a ação de improbidade administrativa, julgue a assertiva: Após a Lei 14.230/2021, a ação de improbidade administrativa pode ser proposta apenas pelo Ministério Público, vedada a legitimação concorrente da pessoa jurídica lesada.',
            'opcoes': [
                'A) Verdadeiro',
                'B) Falso'
            ],
            'resposta': 'B',
            'explicacao': 'Embora a Lei 14.230/2021 originalmente tenha concentrado a legitimidade no Ministério Público (revogando a legitimação concorrente da pessoa jurídica interessada), o STF, na ADI 7.042 e ADI 7.043 (julgadas em agosto de 2022), declarou INCONSTITUCIONAL essa restrição e RESTABELECEU a legitimidade ativa CONCORRENTE da pessoa jurídica lesada para propor a ação de improbidade. Atualmente, tanto o MP quanto a pessoa jurídica lesada podem ajuizar a ação.',
            'dica': 'STF (ADI 7.042/7.043): legitimidade da LIA é CONCORRENTE — MP + pessoa jurídica lesada. A restrição da Lei 14.230 caiu.',
            'dificuldade': 'médio',
            'fonte': 'FGV',
            'ano': 2024,
            'titulo': 'FGV/TJ-RJ/2024 - Legitimidade ativa LIA'
        },
        {
            'enunciado': 'Acerca do acordo de não persecução cível (ANPC) na Lei de Improbidade, conforme art. 17-B da Lei 8.429/92 (incluído pela Lei 14.230/2021):',
            'opcoes': [
                'A) É vedada qualquer espécie de acordo nas ações de improbidade administrativa.',
                'B) O ANPC pode ser celebrado em qualquer fase da ação, exigindo-se reparação integral do dano e reversão da vantagem indevida obtida.',
                'C) O ANPC só pode ser celebrado antes do oferecimento da inicial, sob pena de preclusão.',
                'D) A celebração de ANPC dispensa a oitiva do ente lesado e do Tribunal de Contas competente.',
                'E) O acordo, uma vez homologado, equivale a sentença penal condenatória, gerando reincidência.'
            ],
            'resposta': 'B',
            'explicacao': 'O art. 17-B da LIA, introduzido pela Lei 14.230/2021, autoriza o Acordo de Não Persecução Cível (ANPC), celebrado pelo MP, em QUALQUER FASE do processo (inclusive na fase recursal), desde que assegurada a reparação INTEGRAL do dano e a reversão da vantagem indevida obtida. O acordo deve ser homologado pelo juízo competente, com oitiva do ente lesado, e não tem natureza penal — a improbidade é cível, não gerando reincidência criminal.',
            'dica': 'ANPC = acordo cível de improbidade. Pode ser feito a QUALQUER tempo. Exige reparação INTEGRAL do dano.',
            'dificuldade': 'médio',
            'fonte': 'CESPE',
            'ano': 2023,
            'titulo': 'CESPE/MPF/2023 - ANPC'
        },
        {
            'enunciado': 'Sobre os sujeitos da Lei de Improbidade Administrativa após a Lei 14.230/2021, é CORRETO afirmar:',
            'opcoes': [
                'A) Apenas servidores públicos efetivos podem ser sujeitos ativos da improbidade.',
                'B) Particulares só respondem por improbidade se atuarem em conjunto com agente público que tenha sido condenado.',
                'C) Os agentes políticos não estão sujeitos à LIA, devendo responder exclusivamente por crime de responsabilidade.',
                'D) Particulares podem ser sujeitos ativos da improbidade, mas exclusivamente em concurso com agente público, e com igual exigência de dolo específico.',
                'E) A responsabilização do particular dispensa a comprovação do dolo.'
            ],
            'resposta': 'D',
            'explicacao': 'O art. 3º da LIA, na redação da Lei 14.230/2021, dispõe que o particular pode ser sujeito ativo da improbidade, MAS APENAS em concurso com agente público (induzindo, concorrendo dolosamente ou se beneficiando), exigindo-se a comprovação do dolo específico do particular. Quanto aos agentes políticos, o STF (Pet 3.211/STF e ADI 2.797) firmou que eles também respondem por improbidade, salvo quando a conduta for tipificada como crime de responsabilidade que gere bis in idem.',
            'dica': 'Particular na LIA: SEMPRE em concurso com agente público + dolo específico. Sem agente público, não há improbidade.',
            'dificuldade': 'médio',
            'fonte': 'FCC',
            'ano': 2024,
            'titulo': 'FCC/TCM-SP/2024 - Sujeitos da LIA'
        },
        {
            'enunciado': 'Acerca da independência das instâncias na responsabilização por ato de improbidade administrativa, é INCORRETO afirmar:',
            'opcoes': [
                'A) A absolvição criminal por inexistência do fato ou negativa de autoria afasta a responsabilização por improbidade.',
                'B) A absolvição criminal por insuficiência de provas, em regra, não vincula a esfera de improbidade.',
                'C) As esferas penal, civil (improbidade) e administrativa são, em regra, independentes entre si.',
                'D) A condenação criminal definitiva produz efeitos automáticos na ação de improbidade, dispensando a instrução probatória.',
                'E) A pena de perda da função pública na improbidade é distinta da decretada na esfera criminal, podendo coexistir.'
            ],
            'resposta': 'D',
            'explicacao': 'A condenação criminal definitiva NÃO produz efeitos automáticos na ação de improbidade — as esferas são independentes (item D INCORRETO, gabarito). A regra da independência admite exceções: a absolvição criminal por inexistência do fato ou por negativa categórica de autoria vincula as demais esferas (CP, art. 935 do CC). Já a absolvição por insuficiência de provas (in dubio pro reo) ou por atipicidade não vincula a esfera cível, em regra (STJ, AgInt no REsp 1.732.101).',
            'dica': 'Independência das instâncias: regra. Exceção (vincula): absolvição criminal por INEXISTÊNCIA DO FATO ou NEGATIVA DE AUTORIA.',
            'dificuldade': 'médio',
            'fonte': 'CESPE',
            'ano': 2023,
            'titulo': 'CESPE/TJ-PR/2023 - Independência das instâncias'
        },
    ],
    'Crimes Hediondos e Lei Antidrogas': [
        {
            'enunciado': 'Sobre o rol dos crimes hediondos previstos na Lei 8.072/90, com as alterações das Leis 13.142/2015, 13.964/2019 e 14.344/2022, assinale a alternativa CORRETA:',
            'opcoes': [
                'A) O rol dos crimes hediondos é exemplificativo, podendo o juiz ampliá-lo para crimes graves análogos.',
                'B) O homicídio simples praticado em atividade típica de grupo de extermínio é considerado hediondo.',
                'C) O furto qualificado pelo emprego de explosivo, atualmente, NÃO é considerado crime hediondo.',
                'D) O estupro de vulnerável foi excluído do rol pela Lei 13.964/2019 (Pacote Anticrime).',
                'E) O tráfico de drogas privilegiado (art. 33, §4º, da Lei 11.343/2006) é considerado crime hediondo, conforme Súmula 512 do STJ.'
            ],
            'resposta': 'B',
            'explicacao': 'O art. 1º, I, da Lei 8.072/90 prevê expressamente que o homicídio, ainda que simples, quando praticado em atividade típica de grupo de extermínio, é HEDIONDO. O rol é TAXATIVO (item A errado). O furto qualificado pelo emprego de explosivo OU mediante explosão do dispositivo (art. 155, §4º-A do CP) FOI INCLUÍDO como hediondo pela Lei 13.654/2018 (item C errado). O estupro de vulnerável continua hediondo (item D errado). O STF, no HC 118.533, e o STJ cancelaram a Súmula 512 — o tráfico privilegiado NÃO é hediondo (item E errado).',
            'dica': 'Tráfico privilegiado (§4º art. 33) NÃO é hediondo (STF, HC 118.533 e cancelamento da Súmula 512 do STJ).',
            'dificuldade': 'difícil',
            'fonte': 'CESPE',
            'ano': 2024,
            'titulo': 'CESPE/PF/2024 - Rol dos hediondos'
        },
        {
            'enunciado': 'Quanto à progressão de regime nos crimes hediondos após a Lei 13.964/2019 (Pacote Anticrime), assinale a alternativa CORRETA:',
            'opcoes': [
                'A) O regime inicial será obrigatoriamente o fechado, vedada a progressão antes do cumprimento de 2/3 da pena.',
                'B) Os percentuais variam conforme o crime e a primariedade: 40% (hediondo, primário), 50% (hediondo com resultado morte, primário, vedado o livramento condicional), 60% (hediondo, reincidente) e 70% (hediondo com resultado morte, reincidente).',
                'C) A progressão para os hediondos é vedada por força do art. 2º, §1º, da Lei 8.072/90.',
                'D) Aplica-se uniformemente o percentual de 1/6 da pena para todos os crimes hediondos, independentemente da reincidência.',
                'E) A reincidência específica em crimes hediondos exige o cumprimento integral da pena.'
            ],
            'resposta': 'B',
            'explicacao': 'A Lei 13.964/2019 alterou o art. 112 da LEP, fixando percentuais escalonados para a progressão de regime: hediondo/equiparado, primário = 40%; hediondo com resultado morte, primário = 50% (vedado livramento condicional); hediondo, reincidente = 60%; hediondo com resultado morte, reincidente em crime hediondo (reincidência específica) = 70%. A vedação à progressão foi declarada inconstitucional pelo STF no HC 82.959/2006, e a Lei 11.464/2007 já permitia a progressão.',
            'dica': 'Progressão hediondos: 40-50-60-70 (primário/com morte/reincidente/reincidente com morte). Decore essa escada!',
            'dificuldade': 'médio',
            'fonte': 'FGV',
            'ano': 2023,
            'titulo': 'FGV/DPE-RJ/2023 - Progressão hediondos'
        },
        {
            'enunciado': 'Sobre o crime de tortura previsto na Lei 9.455/97, julgue a assertiva: A tortura é equiparada a crime hediondo para fins de aplicação da Lei 8.072/90, sendo INSUSCETÍVEL de fiança, anistia e graça, e admitindo a progressão de regime após o cumprimento de 2/5 da pena, se primário.',
            'opcoes': [
                'A) Verdadeiro',
                'B) Falso'
            ],
            'resposta': 'B',
            'explicacao': 'A tortura é EQUIPARADA a crime hediondo (CF/88, art. 5º, XLIII), insuscetível de fiança, anistia e graça (correto até aqui). Contudo, após a Lei 13.964/2019, os percentuais de progressão de regime para hediondos e equiparados são: 40% (primário), 50% (com resultado morte, primário), 60% (reincidente) e 70% (reincidente com resultado morte) — NÃO mais 2/5. O percentual de 2/5 era da redação anterior (Lei 11.464/2007). A assertiva está incorreta na parte final.',
            'dica': 'Hediondos e equiparados pós-Pacote Anticrime: 40-50-60-70%, NÃO mais 2/5 ou 3/5.',
            'dificuldade': 'difícil',
            'fonte': 'CESPE',
            'ano': 2023,
            'titulo': 'CESPE/PCDF/2023 - Tortura e progressão'
        },
        {
            'enunciado': 'Sobre o crime de tráfico de drogas (art. 33 da Lei 11.343/2006) e o tráfico privilegiado (§4º), assinale a alternativa CORRETA:',
            'opcoes': [
                'A) O tráfico privilegiado exige primariedade, bons antecedentes, não dedicação a atividades criminosas e não integração a organização criminosa, sendo aplicável causa de redução de 1/6 a 2/3.',
                'B) O tráfico privilegiado é considerado crime hediondo, conforme Súmula 512 do STJ, ainda em vigor.',
                'C) A pena base do tráfico (art. 33, caput) é de 3 a 10 anos de reclusão.',
                'D) O porte de drogas para uso próprio (art. 28) é considerado infração hedionda em razão da política de tolerância zero.',
                'E) O tráfico de drogas, mesmo na forma privilegiada, é insuscetível de substituição por pena restritiva de direitos.'
            ],
            'resposta': 'A',
            'explicacao': 'O tráfico privilegiado (art. 33, §4º, da Lei 11.343/2006) exige: primariedade, bons antecedentes, NÃO se dedicar a atividades criminosas e NÃO integrar organização criminosa. Presentes esses 4 requisitos, a pena é REDUZIDA de 1/6 a 2/3. O STF, no HC 118.533, decidiu que o tráfico privilegiado NÃO é hediondo, e a Súmula 512 do STJ FOI CANCELADA. A pena base do tráfico é de 5 a 15 anos (não 3 a 10). O STF, no HC 97.256, afastou a vedação automática à substituição.',
            'dica': 'Tráfico privilegiado = 4 requisitos cumulativos (primário + bons antecedentes + não se dedica a crime + não é de orcrim) = redução 1/6 a 2/3.',
            'dificuldade': 'fácil',
            'fonte': 'FCC',
            'ano': 2023,
            'titulo': 'FCC/PC-PE/2023 - Tráfico privilegiado'
        },
        {
            'enunciado': 'Acerca do art. 28 da Lei 11.343/2006 (porte de drogas para consumo pessoal), considerando o entendimento do STF no RE 635.659 (2024), assinale a alternativa CORRETA:',
            'opcoes': [
                'A) O STF declarou inconstitucional o art. 28, descriminalizando totalmente o porte de drogas para consumo.',
                'B) O STF descriminalizou apenas o porte de MACONHA para uso próprio, fixando parâmetro objetivo (até 40g ou 6 plantas fêmeas), mantendo o tipo como infração administrativa.',
                'C) O STF determinou a aplicação obrigatória de pena privativa de liberdade para o porte para uso próprio.',
                'D) O STF declarou que o porte de qualquer droga para uso próprio passa a ser crime, com pena de detenção.',
                'E) O STF determinou a aplicação automática do princípio da insignificância a qualquer porte de droga.'
            ],
            'resposta': 'B',
            'explicacao': 'No RE 635.659 (julgado em 2024), o STF firmou entendimento de que o porte de MACONHA para consumo pessoal não constitui ilícito penal, mas continua sendo ilícito ADMINISTRATIVO. A Corte fixou o parâmetro objetivo de até 40g de Cannabis ou 6 plantas fêmeas como presunção (relativa) de uso pessoal. A descriminalização restringiu-se à maconha — para outras drogas, o regime do art. 28 permanece, com as sanções não privativas de liberdade já previstas (advertência, prestação de serviços, medida educativa).',
            'dica': 'STF (RE 635.659/2024): maconha até 40g = ilícito administrativo, NÃO crime. Outras drogas = continua art. 28 (sem prisão).',
            'dificuldade': 'médio',
            'fonte': 'CESPE',
            'ano': 2024,
            'titulo': 'CESPE/PC-CE/2024 - Art. 28 e descriminalização'
        },
        {
            'enunciado': 'Sobre as causas de aumento de pena previstas no art. 40 da Lei 11.343/2006, julgue a assertiva: A natureza transnacional do delito, a prática nas dependências ou imediações de estabelecimentos de ensino, hospitais ou unidades de tratamento, e o envolvimento de criança ou adolescente são causas que aumentam a pena de 1/6 a 2/3.',
            'opcoes': [
                'A) Verdadeiro',
                'B) Falso'
            ],
            'resposta': 'A',
            'explicacao': 'O art. 40 da Lei 11.343/2006 prevê várias causas de aumento de pena de 1/6 a 2/3, entre as quais: I - natureza transnacional do delito; III - infração cometida nas dependências ou imediações de estabelecimentos prisionais, de ensino ou hospitalares, sedes de entidades estudantis, sociais, culturais, recreativas, esportivas ou beneficentes, locais de trabalho coletivo, de recintos onde se realizem espetáculos ou diversões, de serviços de tratamento de dependentes ou unidades militares ou policiais ou em transporte público; VI - envolvimento ou direcionamento da prática a criança ou adolescente. Todas estão corretas.',
            'dica': 'Art. 40 Lei de Drogas: aumento 1/6 a 2/3. Lugares "sensíveis" (escola, hospital, presídio) + transnacional + menor = traficante "vacilou" duas vezes.',
            'dificuldade': 'médio',
            'fonte': 'FGV',
            'ano': 2022,
            'titulo': 'FGV/DPE-RO/2022 - Causas de aumento Lei 11.343'
        },
        {
            'enunciado': 'Sobre o crime de associação para o tráfico (art. 35 da Lei 11.343/2006) e a associação criminosa (art. 288 do CP), assinale a alternativa CORRETA:',
            'opcoes': [
                'A) Ambas exigem o número mínimo de quatro pessoas, conforme Lei 12.850/2013.',
                'B) A associação para o tráfico exige duas ou mais pessoas, enquanto a associação criminosa do art. 288 do CP exige três ou mais.',
                'C) O crime do art. 35 da Lei 11.343/2006 é hediondo, mas a associação criminosa comum não.',
                'D) Ambos são considerados crimes hediondos por equiparação.',
                'E) A associação para o tráfico exige a prática efetiva de pelo menos um crime de tráfico para sua consumação.'
            ],
            'resposta': 'B',
            'explicacao': 'A associação para o tráfico (art. 35 da Lei 11.343/2006) exige duas ou mais pessoas, enquanto a associação criminosa comum (art. 288 do CP) exige TRÊS ou mais (com a redação dada pela Lei 12.850/2013, que alterou o número de "mais de três" para "três ou mais"). Quanto à hediondez: o art. 35 NÃO está expressamente no rol da Lei 8.072/90, e o STF/STJ entendem que NÃO é hediondo por equiparação. Para a consumação do art. 35, basta a estabilidade do vínculo associativo voltado à prática reiterada do tráfico, sendo crime autônomo.',
            'dica': 'Associação para tráfico = 2 ou mais pessoas (art. 35 Lei Drogas). Associação criminosa comum = 3 ou mais (art. 288 CP). Organização criminosa = 4 ou mais (Lei 12.850).',
            'dificuldade': 'médio',
            'fonte': 'CESPE',
            'ano': 2023,
            'titulo': 'CESPE/PC-RN/2023 - Associação para o tráfico'
        },
        {
            'enunciado': 'Acerca da legislação antiterrorismo (Lei 13.260/2016), assinale a alternativa CORRETA:',
            'opcoes': [
                'A) A Lei 13.260/2016 considera terrorismo qualquer manifestação social que cause perturbação à ordem pública.',
                'B) O terrorismo é crime equiparado a hediondo, sendo insuscetível de fiança, graça ou anistia, conforme art. 5º, XLIII, da CF/88.',
                'C) Movimentos sociais com finalidades reivindicatórias podem ser enquadrados como terrorismo, segundo a lei.',
                'D) O terrorismo somente se configura se praticado por organização criminosa internacional.',
                'E) A Lei 13.260/2016 expressamente afastou a aplicação da Lei 8.072/90 ao crime de terrorismo.'
            ],
            'resposta': 'B',
            'explicacao': 'O art. 5º, XLIII, da CF/88 equipara o terrorismo a crime hediondo, tornando-o insuscetível de fiança, graça e anistia. A Lei 13.260/2016 define terrorismo (art. 2º) como prática de atos por razões de xenofobia, discriminação ou preconceito de raça, cor, etnia e religião, com o fim de provocar terror social ou generalizado. O §2º do art. 2º EXCLUI expressamente movimentos sociais, sindicais, religiosos e manifestações políticas de cunho reivindicatório. Portanto, há grande proteção contra o uso desvirtuado do tipo.',
            'dica': 'Terrorismo (Lei 13.260/2016): EQUIPARADO a hediondo (CF, art. 5º, XLIII). Movimentos sociais e reivindicatórios são EXCLUÍDOS (§2º art. 2º).',
            'dificuldade': 'médio',
            'fonte': 'CESPE',
            'ano': 2022,
            'titulo': 'CESPE/PRF/2022 - Lei Antiterrorismo'
        },
        {
            'enunciado': 'Sobre o livramento condicional nos crimes hediondos e equiparados, conforme alterações do Pacote Anticrime (Lei 13.964/2019):',
            'opcoes': [
                'A) Cabe livramento condicional após o cumprimento de 1/3 da pena para o reincidente comum em crime hediondo.',
                'B) Cabe livramento condicional após o cumprimento de 2/3 da pena, se o agente for primário, em crime hediondo SEM resultado morte; é VEDADO se houver resultado morte ou reincidência específica em hediondo.',
                'C) O livramento condicional é incompatível com qualquer crime hediondo, em qualquer hipótese.',
                'D) Aplica-se uniformemente o percentual de 50% do cumprimento da pena para o livramento condicional nos crimes hediondos.',
                'E) O livramento condicional foi revogado pelo Pacote Anticrime para todos os crimes da Lei 8.072/90.'
            ],
            'resposta': 'B',
            'explicacao': 'O art. 83, V, do CP, em conjunto com o art. 112, VI e VIII, da LEP (com redação da Lei 13.964/2019), prevê que o condenado por crime hediondo ou equiparado pode obter LIVRAMENTO CONDICIONAL após cumprir mais de 2/3 da pena, desde que NÃO seja reincidente específico em crime dessa natureza. Há VEDAÇÃO expressa ao livramento condicional quando o crime for hediondo COM RESULTADO MORTE (art. 112, VIII, da LEP) e na reincidência específica em hediondo (art. 83, V, CP).',
            'dica': 'Livramento condicional hediondos: 2/3 (regra). VEDADO se: (a) hediondo com morte, ou (b) reincidência específica em hediondo.',
            'dificuldade': 'difícil',
            'fonte': 'FGV',
            'ano': 2024,
            'titulo': 'FGV/TJ-CE/2024 - Livramento condicional hediondos'
        },
        {
            'enunciado': 'Considere que Mario foi preso em flagrante por trazer consigo 30 gramas de cocaína. Conforme entendimento atual do STJ (Súmula 630) e do STF, julgue a assertiva: Para a distinção entre o tráfico (art. 33) e o porte para consumo pessoal (art. 28) da Lei 11.343/2006, deve o juiz considerar a natureza e a quantidade da droga, o local e as condições da apreensão, as circunstâncias sociais e pessoais e a conduta e os antecedentes do agente, conforme expressamente determina o art. 28, §2º.',
            'opcoes': [
                'A) Verdadeiro',
                'B) Falso'
            ],
            'resposta': 'A',
            'explicacao': 'O art. 28, §2º, da Lei 11.343/2006 determina que, para distinguir o consumo pessoal do tráfico, o juiz considere a natureza e a quantidade da substância, o local e as condições da apreensão, as circunstâncias sociais e pessoais e a conduta e os antecedentes do agente. O STF (RE 635.659, 2024) fixou parâmetro objetivo apenas para a maconha (até 40g/6 plantas), mas para outras drogas (como cocaína) prevalece a análise do conjunto de circunstâncias do caso concreto. A Súmula 630 do STJ reforça a análise individualizada.',
            'dica': 'Distinção tráfico x uso (art. 28, §2º): Natureza da droga + Quantidade + Local + Condições + Circunstâncias + Antecedentes. NQLCCA — analise tudo!',
            'dificuldade': 'fácil',
            'fonte': 'CESPE',
            'ano': 2024,
            'titulo': 'CESPE/PC-PR/2024 - Tráfico x consumo pessoal'
        },
    ],
}
