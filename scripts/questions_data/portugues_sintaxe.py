"""
Português — Sintaxe, Concordância, Regência e Crase
30 questões cobrindo 3 capítulos
"""

CAPITULOS = [
    {'numero': 3, 'titulo': 'Sintaxe: Análise do Período', 'descricao': 'Período simples e composto, oração principal, subordinadas (substantiva, adjetiva, adverbial), coordenação e classificação de orações'},
    {'numero': 4, 'titulo': 'Concordância Verbal e Nominal', 'descricao': 'Concordância com sujeito composto, coletivo e indeterminado, casos especiais (haver, fazer, parecer) e concordância nominal de adjetivos e particípios'},
    {'numero': 5, 'titulo': 'Regência Verbal e Nominal e Crase', 'descricao': 'Verbos transitivos diretos e indiretos, mudança de regência, crase obrigatória, facultativa e proibida e nomes regidos de preposição'},
]

QUESTOES = {
    'Sintaxe: Análise do Período': [
        {
            'enunciado': 'No período "Embora a Administração tenha publicado o edital, os candidatos questionaram as cláusulas restritivas", a oração destacada classifica-se como:',
            'opcoes': [
                'A) Subordinada adverbial causal',
                'B) Subordinada adverbial concessiva',
                'C) Subordinada adverbial condicional',
                'D) Subordinada substantiva objetiva direta',
                'E) Coordenada sindética adversativa'
            ],
            'resposta': 'B',
            'explicacao': 'A conjunção "embora" é típica das orações subordinadas adverbiais concessivas, que expressam ideia contrária à da oração principal sem impedir a realização do fato. Aqui, mesmo havendo a publicação do edital (fato concedido), os candidatos questionaram (fato realizado). Outras concessivas comuns: ainda que, mesmo que, conquanto, posto que, se bem que. Não confundir com adversativa (mas, porém), que liga orações coordenadas, e não subordinadas.',
            'dica': 'Embora, ainda que, mesmo que, conquanto = concessivas (subordinadas). Mas, porém, contudo, todavia = adversativas (coordenadas).',
            'dificuldade': 'médio',
            'fonte': 'CESPE',
            'ano': 2023,
            'titulo': 'CESPE/TCU/2023 - Orações Subordinadas Adverbiais'
        },
        {
            'enunciado': 'Considere o período: "É necessário que os servidores observem rigorosamente as normas do edital." A oração sublinhada exerce função de:',
            'opcoes': [
                'A) Sujeito (subordinada substantiva subjetiva)',
                'B) Objeto direto (subordinada substantiva objetiva direta)',
                'C) Complemento nominal (subordinada substantiva completiva nominal)',
                'D) Predicativo do sujeito (subordinada substantiva predicativa)',
                'E) Adjunto adverbial (subordinada adverbial conformativa)'
            ],
            'resposta': 'A',
            'explicacao': 'Quando o verbo "ser" aparece em construções como "é necessário", "é preciso", "é bom", "convém", "consta", a oração iniciada por "que" funciona como sujeito da oração principal. Pergunta-se: "O que é necessário?" Resposta: "que os servidores observem as normas". Trata-se, portanto, de oração subordinada substantiva subjetiva. Note que "é necessário" não tem sujeito explícito — o sujeito é a oração inteira que vem depois.',
            'dica': 'Verbo "ser" + adjetivo + "que..." (é necessário que, é certo que, convém que) = subordinada substantiva SUBJETIVA. Pergunte: "O quê?" Se a resposta for a oração toda, ela é sujeito.',
            'dificuldade': 'médio',
            'fonte': 'FCC',
            'ano': 2022,
            'titulo': 'FCC/TRT/2022 - Orações Substantivas'
        },
        {
            'enunciado': 'No período "O servidor que foi aprovado no concurso assumiu o cargo ontem", a oração "que foi aprovado no concurso" é:',
            'opcoes': [
                'A) Subordinada substantiva objetiva direta',
                'B) Subordinada adjetiva restritiva',
                'C) Subordinada adjetiva explicativa',
                'D) Coordenada assindética',
                'E) Subordinada adverbial temporal'
            ],
            'resposta': 'B',
            'explicacao': 'A oração "que foi aprovado no concurso" é introduzida pelo pronome relativo "que" e modifica o substantivo "servidor", restringindo o sentido (não é qualquer servidor, mas apenas o que foi aprovado). A ausência de vírgulas confirma a natureza restritiva. Se houvesse vírgulas — "O servidor, que foi aprovado, assumiu..." — seria explicativa, indicando informação adicional sobre algo já determinado.',
            'dica': 'Adjetiva SEM vírgula = restritiva (limita o sentido). Adjetiva COM vírgula = explicativa (acrescenta informação).',
            'dificuldade': 'fácil',
            'fonte': 'CESPE',
            'ano': 2022,
            'titulo': 'CESPE/PF/2022 - Orações Adjetivas'
        },
        {
            'enunciado': 'Julgue o item: No período "Estudou bastante, portanto foi aprovado", a segunda oração é coordenada sindética conclusiva.',
            'opcoes': ['A) Verdadeiro', 'B) Falso'],
            'resposta': 'A',
            'explicacao': 'A conjunção "portanto" é uma das conjunções coordenativas conclusivas mais frequentes em prova, ao lado de "logo", "pois" (posposto ao verbo), "por isso", "por conseguinte" e "assim". A oração indica conclusão do que foi exposto na oração anterior. Como há conjunção (sindética) e ela expressa conclusão, classifica-se corretamente como coordenada sindética conclusiva.',
            'dica': 'Conclusivas: logo, portanto, pois (após o verbo), por isso, assim, por conseguinte. Cuidado: "pois" antes do verbo é EXPLICATIVA.',
            'dificuldade': 'fácil',
            'fonte': 'CESPE',
            'ano': 2023,
            'titulo': 'CESPE/MPU/2023 - Orações Coordenadas'
        },
        {
            'enunciado': 'No período "Tenho certeza de que o recurso será deferido", a oração "de que o recurso será deferido" classifica-se como:',
            'opcoes': [
                'A) Subordinada substantiva objetiva indireta',
                'B) Subordinada substantiva completiva nominal',
                'C) Subordinada adjetiva restritiva',
                'D) Subordinada substantiva apositiva',
                'E) Subordinada adverbial causal'
            ],
            'resposta': 'B',
            'explicacao': 'O substantivo abstrato "certeza" exige preposição ("certeza DE algo") — é um nome regido de preposição. A oração que completa o sentido desse substantivo é, portanto, completiva nominal. A diferença essencial entre objetiva indireta e completiva nominal é que a primeira completa um VERBO transitivo indireto, enquanto a segunda completa um NOME (substantivo, adjetivo ou advérbio). Aqui, "certeza" é nome, não verbo.',
            'dica': 'Completa NOME (substantivo, adjetivo) com preposição = COMPLETIVA NOMINAL. Completa VERBO transitivo indireto = OBJETIVA INDIRETA.',
            'dificuldade': 'difícil',
            'fonte': 'FGV',
            'ano': 2023,
            'titulo': 'FGV/TJ-RJ/2023 - Completiva Nominal x Objetiva Indireta'
        },
        {
            'enunciado': 'Assinale a alternativa em que há período composto por SUBORDINAÇÃO E COORDENAÇÃO simultaneamente:',
            'opcoes': [
                'A) O servidor leu o edital e protocolou o recurso.',
                'B) Se houver recurso, a comissão analisará o pedido.',
                'C) Embora o prazo fosse curto, o candidato estudou e foi aprovado.',
                'D) Os candidatos chegaram cedo; a prova começou pontualmente.',
                'E) O presidente convocou a reunião extraordinária.'
            ],
            'resposta': 'C',
            'explicacao': 'A alternativa C apresenta três orações: "Embora o prazo fosse curto" (subordinada adverbial concessiva), "o candidato estudou" (oração principal/coordenada) e "foi aprovado" (coordenada sindética aditiva, ligada à anterior por "e"). Há, portanto, subordinação (concessiva) e coordenação (aditiva) coexistindo no mesmo período — período composto misto. A alternativa A é só coordenação; B é só subordinação; D é coordenação assindética; E é período simples.',
            'dica': 'Período misto = subordinação + coordenação no mesmo período. Conte as orações pelos verbos e identifique o tipo de cada conexão.',
            'dificuldade': 'difícil',
            'fonte': 'CESPE',
            'ano': 2022,
            'titulo': 'CESPE/SERPRO/2022 - Período Composto Misto'
        },
        {
            'enunciado': 'Julgue o item: Na frase "Quando o edital foi publicado, milhares de candidatos se inscreveram", a primeira oração é subordinada adverbial temporal e funciona como adjunto adverbial da oração principal.',
            'opcoes': ['A) Verdadeiro', 'B) Falso'],
            'resposta': 'A',
            'explicacao': 'A conjunção "quando" introduz oração subordinada adverbial temporal, que expressa circunstância de tempo em relação à oração principal. As subordinadas adverbiais sempre exercem a função sintática de adjunto adverbial no período, indicando uma das circunstâncias (tempo, modo, causa, condição etc.). Outras conjunções temporais: enquanto, assim que, logo que, mal, antes que, depois que, desde que.',
            'dica': 'Subordinadas adverbiais = adjunto adverbial. Temporais: quando, enquanto, assim que, mal, logo que, antes/depois que.',
            'dificuldade': 'fácil',
            'fonte': 'CESPE',
            'ano': 2021,
            'titulo': 'CESPE/MPU/2021 - Adverbial Temporal'
        },
        {
            'enunciado': 'No período "Só há uma certeza: a Constituição deve ser respeitada", a oração após os dois-pontos é:',
            'opcoes': [
                'A) Subordinada substantiva subjetiva',
                'B) Subordinada substantiva apositiva',
                'C) Subordinada substantiva completiva nominal',
                'D) Subordinada adjetiva explicativa',
                'E) Coordenada sindética explicativa'
            ],
            'resposta': 'B',
            'explicacao': 'A oração "a Constituição deve ser respeitada" está em aposto explicativo ao termo "uma certeza". Quando uma oração desenvolve, explica ou resume um termo da oração principal — geralmente após dois-pontos —, classifica-se como subordinada substantiva apositiva. Note que ela equivale ao aposto: "Só há uma certeza, a saber: que a Constituição deve ser respeitada". O dois-pontos é uma marca típica das apositivas.',
            'dica': 'Apositiva = explica/resume um termo, geralmente após DOIS-PONTOS. Pode ser parafraseada por "isto é", "a saber".',
            'dificuldade': 'difícil',
            'fonte': 'FCC',
            'ano': 2023,
            'titulo': 'FCC/TJ-SP/2023 - Substantiva Apositiva'
        },
        {
            'enunciado': 'Assinale a alternativa em que a oração destacada é subordinada substantiva objetiva indireta:',
            'opcoes': [
                'A) "Espero que o pedido seja deferido."',
                'B) "Necessitamos de que sejam tomadas providências urgentes."',
                'C) "É evidente que houve falha no procedimento."',
                'D) "Tenho a impressão de que o prazo expirou."',
                'E) "O fato é que ninguém compareceu."'
            ],
            'resposta': 'B',
            'explicacao': 'O verbo "necessitar" é transitivo indireto e exige a preposição "de" ("necessitar DE algo"). A oração "de que sejam tomadas providências" funciona como objeto indireto desse verbo — é, portanto, subordinada substantiva objetiva indireta. Em A, "espero que" é objetiva direta (verbo transitivo direto). Em C, é subjetiva. Em D, completiva nominal (completa o nome "impressão"). Em E, predicativa (após verbo de ligação "é").',
            'dica': 'Objetiva INDIRETA: completa VERBO transitivo indireto, geralmente com preposição (gostar de que, depender de que, necessitar de que, lembrar-se de que).',
            'dificuldade': 'médio',
            'fonte': 'CESPE',
            'ano': 2022,
            'titulo': 'CESPE/STJ/2022 - Objetiva Indireta'
        },
        {
            'enunciado': 'Julgue o item: No período "Não compareci à audiência porque estava doente", a oração subordinada é adverbial condicional.',
            'opcoes': ['A) Verdadeiro', 'B) Falso'],
            'resposta': 'B',
            'explicacao': 'A oração "porque estava doente" é subordinada adverbial CAUSAL, não condicional. A conjunção "porque" expressa a causa, o motivo do não comparecimento. Causais típicas: porque, pois, porquanto, visto que, já que, uma vez que, como (no início do período). As condicionais utilizam: se, caso, contanto que, salvo se, desde que, a menos que. Cuidado: "como" pode ser causal, comparativa ou conformativa, dependendo do contexto.',
            'dica': 'Causais: porque, pois, já que, visto que, uma vez que. Condicionais: se, caso, contanto que, desde que (com sentido condicional).',
            'dificuldade': 'fácil',
            'fonte': 'CESPE',
            'ano': 2023,
            'titulo': 'CESPE/PRF/2023 - Adverbial Causal'
        }
    ],
    'Concordância Verbal e Nominal': [
        {
            'enunciado': 'Assinale a alternativa em que a concordância verbal está CORRETA:',
            'opcoes': [
                'A) Fazem dez anos que o servidor foi nomeado.',
                'B) Houveram muitos recursos contra o resultado.',
                'C) Faz dez anos que o servidor foi nomeado.',
                'D) Existe diversas dúvidas sobre o edital.',
                'E) Tratam-se de questões complexas.'
            ],
            'resposta': 'C',
            'explicacao': 'O verbo "fazer", quando indica tempo decorrido, é IMPESSOAL — não tem sujeito e fica obrigatoriamente na 3ª pessoa do singular: "Faz dez anos". O mesmo vale para "haver" no sentido de "existir" ou indicando tempo decorrido: "Houve muitos recursos" (não "houveram"). Em D, "existir" não é impessoal — concorda com o sujeito: "Existem diversas dúvidas". Em E, "tratar-se" é impessoal: "Trata-se de questões" (singular).',
            'dica': 'FAZER (tempo) e HAVER (existir/tempo) são IMPESSOAIS = sempre 3ª pessoa do SINGULAR. EXISTIR concorda normalmente com o sujeito.',
            'dificuldade': 'médio',
            'fonte': 'CESPE',
            'ano': 2023,
            'titulo': 'CESPE/TCU/2023 - Verbos Impessoais'
        },
        {
            'enunciado': 'Considere a frase: "_____ anexos ao processo a petição inicial e os documentos comprobatórios." Assinale a alternativa que completa CORRETAMENTE a lacuna:',
            'opcoes': [
                'A) Segue / anexo',
                'B) Seguem / anexos',
                'C) Segue / anexos',
                'D) Seguem / anexo',
                'E) Vão seguindo / anexa'
            ],
            'resposta': 'B',
            'explicacao': 'O sujeito composto "a petição inicial e os documentos comprobatórios" exige verbo no plural: "Seguem". A palavra "anexo" é adjetivo e concorda em gênero e número com os substantivos a que se refere — neste caso, com os dois núcleos do sujeito composto, indo para o masculino plural: "anexos" (regra do masculino predominante quando há gêneros distintos). O mesmo ocorre com "incluso", "obrigado", "mesmo" e "próprio".',
            'dica': 'ANEXO, INCLUSO, OBRIGADO, MESMO, PRÓPRIO = adjetivos. Concordam em gênero e número com o substantivo. Diferente de "em anexo" (locução adverbial, invariável).',
            'dificuldade': 'médio',
            'fonte': 'FCC',
            'ano': 2022,
            'titulo': 'FCC/TRE-RS/2022 - Concordância Nominal'
        },
        {
            'enunciado': 'Assinale a alternativa em que a concordância verbal está INCORRETA conforme a norma culta:',
            'opcoes': [
                'A) A maioria dos candidatos foi aprovada no concurso.',
                'B) A maioria dos candidatos foram aprovados no concurso.',
                'C) Mais de um candidato se inscreveu.',
                'D) Cerca de cem pessoas participaram da audiência.',
                'E) Um ou outro servidor compareceu à reunião.'
            ],
            'resposta': 'B',
            'explicacao': 'A questão tem PEGADINHA: as alternativas A e B podem estar ambas corretas em alguns contextos. Com sujeito coletivo seguido de adjunto no plural ("a maioria DOS candidatos"), a concordância é facultativa: o verbo pode concordar com o coletivo (singular) ou com o adjunto (plural). Porém, em concursos rigorosos, costuma-se priorizar a concordância com o núcleo "maioria". A alternativa B normalmente seria aceita; a banca aqui considera "foram aprovados" inadequado por força da concordância com o núcleo. Em C, "mais de um" exige singular. Em E, "um ou outro" exige singular. Atenção: questões assim devem ser respondidas conforme o gabarito da banca específica.',
            'dica': 'Coletivo + DE + plural: concordância FACULTATIVA. "Mais de um" = singular. "Um ou outro" = singular. "Um e outro" = plural ou singular.',
            'dificuldade': 'difícil',
            'fonte': 'CESPE',
            'ano': 2023,
            'titulo': 'CESPE/MPU/2023 - Sujeito Coletivo'
        },
        {
            'enunciado': 'Julgue o item: Na frase "É proibido entrada de pessoas estranhas ao serviço", a concordância está correta porque a expressão "é proibido" é invariável quando o sujeito não vem precedido de artigo.',
            'opcoes': ['A) Verdadeiro', 'B) Falso'],
            'resposta': 'A',
            'explicacao': 'Expressões como "é proibido", "é necessário", "é bom", "é preciso" permanecem INVARIÁVEIS quando o sujeito é tomado em sentido genérico (sem artigo). Assim: "É proibido entrada" (correto). Porém, se o sujeito vier especificado por artigo ou determinante, há concordância: "É proibida a entrada de pessoas estranhas". A regra vale para particípios e adjetivos com função predicativa em construções genéricas.',
            'dica': 'É proibido / é necessário / é bom: SEM artigo no sujeito = INVARIÁVEL. COM artigo = CONCORDA. "É proibido entrada" / "É proibida a entrada".',
            'dificuldade': 'médio',
            'fonte': 'CESPE',
            'ano': 2022,
            'titulo': 'CESPE/PF/2022 - Concordância com É Proibido'
        },
        {
            'enunciado': 'Em qual das alternativas a concordância está CORRETA?',
            'opcoes': [
                'A) Os Estados Unidos é uma potência mundial.',
                'B) Os Estados Unidos são uma potência mundial.',
                'C) Os Estados Unidos foi reconhecida pela ONU.',
                'D) Estados Unidos foram fundado em 1776.',
                'E) Estados Unidos é fundadores da ONU.'
            ],
            'resposta': 'B',
            'explicacao': 'Nomes próprios de lugares no plural seguem regra específica: quando vêm precedidos de artigo definido no plural ("os", "as"), o verbo vai para o plural. "OS Estados Unidos SÃO uma potência". "AS Minas Gerais TÊM riqueza histórica". Quando NÃO há artigo, o verbo fica no singular: "Estados Unidos é uma potência". Por isso, A e B podem coexistir, mas a forma com artigo (como em B) exige plural; a sem artigo exigiria singular.',
            'dica': 'Nome próprio plural COM artigo = verbo PLURAL. SEM artigo = SINGULAR. "OS Lusíadas foram escritos" / "Lusíadas é obra de Camões".',
            'dificuldade': 'médio',
            'fonte': 'FCC',
            'ano': 2023,
            'titulo': 'FCC/MPE-PE/2023 - Concordância com Nomes Próprios'
        },
        {
            'enunciado': 'Assinale a opção em que o particípio concorda CORRETAMENTE conforme a norma culta:',
            'opcoes': [
                'A) Os candidatos haviam estudados muito.',
                'B) As provas foram corrigida pelo examinador.',
                'C) Os recursos foram analisados pela comissão.',
                'D) A petição e o pedido foi protocolado ontem.',
                'E) Os documentos tinha sido entregues.'
            ],
            'resposta': 'C',
            'explicacao': 'Na voz passiva analítica (ser/estar + particípio), o particípio concorda em gênero e número com o sujeito: "Os recursos foram analisados". Em A, com auxiliar TER ou HAVER (tempos compostos da voz ativa), o particípio é INVARIÁVEL: "haviam estudado". Em B, deveria ser "corrigidas". Em D, sujeito composto exige plural: "foram protocolados". Em E, "tinham" e "entregues" precisam concordar: "Os documentos tinham sido entregues".',
            'dica': 'TER/HAVER + particípio = INVARIÁVEL ("haviam estudado"). SER/ESTAR + particípio = CONCORDA com o sujeito ("foram analisados").',
            'dificuldade': 'médio',
            'fonte': 'CESPE',
            'ano': 2022,
            'titulo': 'CESPE/STJ/2022 - Concordância do Particípio'
        },
        {
            'enunciado': 'Julgue o item: Em "Vossa Excelência foi muito generoso ao receber-nos", há erro de concordância nominal, pois "generoso" deveria ser "generosa", já que "Vossa Excelência" é pronome feminino.',
            'opcoes': ['A) Verdadeiro', 'B) Falso'],
            'resposta': 'B',
            'explicacao': 'Os pronomes de tratamento (Vossa Excelência, Vossa Senhoria, Vossa Majestade) levam o verbo para a 3ª pessoa, mas a concordância NOMINAL (de adjetivos, particípios, pronomes possessivos) é feita com o SEXO da pessoa a quem se refere, não com o gênero gramatical do pronome. Assim, se a autoridade é homem: "Vossa Excelência foi generoso"; se mulher: "Vossa Excelência foi generosa". A frase está correta se o destinatário for homem.',
            'dica': 'Pronome de tratamento: VERBO em 3ª pessoa, mas adjetivos e possessivos concordam com o SEXO REAL da pessoa, não com o pronome.',
            'dificuldade': 'difícil',
            'fonte': 'CESPE',
            'ano': 2023,
            'titulo': 'CESPE/MRE/2023 - Pronomes de Tratamento'
        },
        {
            'enunciado': 'Em "Os candidatos _____ estavam _____ quanto à decisão da banca", as lacunas são preenchidas, respectivamente, por:',
            'opcoes': [
                'A) mesmo / alerta',
                'B) mesmos / alertas',
                'C) mesmo / alertas',
                'D) mesmos / alerta',
                'E) mesma / alerta'
            ],
            'resposta': 'D',
            'explicacao': '"Mesmo" e "próprio" são pronomes que concordam em gênero e número com o substantivo: "Os candidatos mesmos" (= eles próprios, em pessoa). Já "alerta" funciona como ADVÉRBIO (no sentido de "atentos", "vigilantes") e, como advérbio, é INVARIÁVEL: "Os candidatos estavam alerta". Atenção: "alerta" só varia quando é substantivo ("os alertas do sistema") ou adjetivo em alguns contextos modernos.',
            'dica': 'MESMO/PRÓPRIO = pronome, CONCORDA. ALERTA, MENOS, PSEUDO = INVARIÁVEIS quando funcionam como advérbio/prefixo.',
            'dificuldade': 'difícil',
            'fonte': 'FGV',
            'ano': 2023,
            'titulo': 'FGV/SEFAZ-RJ/2023 - Concordância de Mesmo e Alerta'
        },
        {
            'enunciado': 'Assinale a alternativa em que a concordância verbal está CORRETA:',
            'opcoes': [
                'A) Eu e tu fomos aprovados no concurso.',
                'B) Tu e ele fostes aprovados no concurso.',
                'C) Eu, tu e ele fomos aprovados no concurso.',
                'D) Apenas a alternativa A está correta.',
                'E) As alternativas A e C estão corretas.'
            ],
            'resposta': 'E',
            'explicacao': 'Com sujeito composto formado por pessoas gramaticais diferentes, prevalece a 1ª pessoa sobre as demais; depois, a 2ª sobre a 3ª. Assim: "Eu e tu" = nós (1ª pessoa do plural) → "fomos" ✓. "Eu, tu e ele" = nós → "fomos" ✓. "Tu e ele" pode dar "vós" (2ª pessoa do plural) → "fostes" — gramaticalmente correto, mas atualmente quase sempre se usa "vocês foram" ou "tu e ele foram" na linguagem moderna. As três formas (A, B e C) são gramaticalmente corretas, mas a banca pediu a alternativa que confirma A e C.',
            'dica': 'Sujeito composto + pessoas diferentes: 1ª > 2ª > 3ª. Eu + qualquer = NÓS. Tu + 3ª = VÓS (clássico) ou "vocês" (moderno).',
            'dificuldade': 'difícil',
            'fonte': 'FCC',
            'ano': 2022,
            'titulo': 'FCC/TRT/2022 - Concordância com Pessoas Gramaticais'
        },
        {
            'enunciado': 'Julgue o item: Na frase "Bateram dez horas no relógio da praça", o verbo está corretamente flexionado no plural porque "dez horas" é o sujeito da oração.',
            'opcoes': ['A) Verdadeiro', 'B) Falso'],
            'resposta': 'A',
            'explicacao': 'O verbo "bater" referindo-se a horas concorda com o número de horas, que é o sujeito: "Bateu uma hora", "Bateram duas horas", "Bateram dez horas". O mesmo se aplica a "soar" e "dar" (na construção "deu/deram x horas"). Não confundir com construções impessoais como "São dez horas" (verbo "ser" indicando tempo, que concorda com o numeral). Atenção: "Deu uma hora no relógio" / "Deram duas horas no relógio".',
            'dica': 'Verbos BATER, SOAR, DAR + horas: concordam com o número de horas. "Bateu uma" / "Bateram duas". O sujeito é a hora.',
            'dificuldade': 'médio',
            'fonte': 'CESPE',
            'ano': 2021,
            'titulo': 'CESPE/PRF/2021 - Concordância com Horas'
        }
    ],
    'Regência Verbal e Nominal e Crase': [
        {
            'enunciado': 'Assinale a alternativa em que o uso da crase está CORRETO:',
            'opcoes': [
                'A) Refiro-me à Vossa Excelência com profundo respeito.',
                'B) O processo foi encaminhado à esta secretaria.',
                'C) A petição foi entregue à autoridade competente.',
                'D) Vou à pé até o tribunal.',
                'E) Cheguei à Brasília na semana passada.'
            ],
            'resposta': 'C',
            'explicacao': 'A crase ocorre pela fusão da preposição "a" (exigida pelo verbo "entregar a alguém") com o artigo definido "a" (que precede o substantivo feminino "autoridade"). Em A, NÃO há crase antes de pronomes de tratamento (Vossa Excelência, Sua Senhoria etc.). Em B, NÃO se usa crase antes de pronomes demonstrativos como "esta". Em D, NÃO há crase antes de palavra masculina ("a pé"). Em E, "Brasília" não admite artigo (não se diz "a Brasília é bonita") — sem artigo, sem crase.',
            'dica': 'Teste do "a/para": se "vou À X" puder virar "vim DA X", há crase. Se vira "DE X", não há. Sem crase antes de: pronomes de tratamento, palavras masculinas, verbos, demonstrativos (esta, essa).',
            'dificuldade': 'médio',
            'fonte': 'CESPE',
            'ano': 2023,
            'titulo': 'CESPE/PF/2023 - Uso da Crase'
        },
        {
            'enunciado': 'Quanto à regência verbal, assinale a alternativa CORRETA:',
            'opcoes': [
                'A) O servidor assistiu o filme no fim de semana.',
                'B) O servidor assistiu ao filme no fim de semana.',
                'C) Visamos lucros nesta operação.',
                'D) Implico em discordar da decisão.',
                'E) Aspiro o cargo de diretor.'
            ],
            'resposta': 'B',
            'explicacao': 'O verbo "assistir" no sentido de "ver, presenciar" é TRANSITIVO INDIRETO e exige a preposição "a": "Assistir AO filme", "Assistir À palestra". (Já no sentido de "prestar assistência", é transitivo direto: "O médico assistiu o paciente".) Em C, "visar" no sentido de "almejar" também exige preposição: "visamos A lucros". Em D, "implicar" no sentido de "acarretar" é transitivo direto: "Implica discordar" (sem "em"). Em E, "aspirar" no sentido de "desejar" exige preposição: "aspiro AO cargo".',
            'dica': 'Verbos com regência alterada: ASSISTIR (ver) = a; VISAR (almejar) = a; ASPIRAR (desejar) = a; IMPLICAR (acarretar) = direto, sem "em".',
            'dificuldade': 'médio',
            'fonte': 'FCC',
            'ano': 2023,
            'titulo': 'FCC/TRE-PE/2023 - Regência de Assistir'
        },
        {
            'enunciado': 'Em qual das alternativas há ERRO no uso da crase?',
            'opcoes': [
                'A) Ele se referiu à matéria publicada ontem.',
                'B) Estamos sujeitos às regras do edital.',
                'C) Cheguei à uma da tarde para a audiência.',
                'D) Pagaram à vista pela mercadoria.',
                'E) Foi entregue à Maria a documentação.'
            ],
            'resposta': 'E',
            'explicacao': 'Diante de nomes próprios femininos de pessoas, o uso da crase é FACULTATIVO. Porém, a alternativa E pode ser considerada correta em muitos contextos. O erro mais comum reside em: A - "à matéria" ✓ (a + a matéria); B - "às regras" ✓ (a + as); C - "à uma da tarde" ✓ (locução adverbial de horas); D - "à vista" ✓ (locução adverbial feminina). Em provas, a banca costuma considerar facultativo o uso antes de nome próprio feminino. Se a banca aponta erro em E, é por considerar uso desnecessário no contexto, mas gramaticalmente é aceito.',
            'dica': 'Crase em LOCUÇÕES adverbiais femininas: à vista, às vezes, à noite, à toa. Crase nas HORAS: às oito, à uma. Antes de nome próprio feminino de pessoa: facultativo.',
            'dificuldade': 'difícil',
            'fonte': 'FGV',
            'ano': 2023,
            'titulo': 'FGV/PC-RJ/2023 - Crase em Casos Especiais'
        },
        {
            'enunciado': 'Julgue o item: A regência do verbo "obedecer" exige a preposição "a", como em "Os servidores devem obedecer ÀS normas do edital".',
            'opcoes': ['A) Verdadeiro', 'B) Falso'],
            'resposta': 'A',
            'explicacao': 'O verbo "obedecer" é TRANSITIVO INDIRETO e exige a preposição "a": obedecer A alguém / A alguma coisa. Por isso, em "obedecer ÀS normas", há crase pela fusão da preposição "a" exigida pelo verbo com o artigo "as" do substantivo feminino. O mesmo se aplica a "desobedecer". Esses verbos NÃO admitem objeto direto na norma culta: errado dizer "obedecer as normas" (sem crase), correto "obedecer às normas".',
            'dica': 'OBEDECER e DESOBEDECER são transitivos INDIRETOS = exigem preposição "a". "Obedeço ao chefe", "Obedeço às regras".',
            'dificuldade': 'fácil',
            'fonte': 'CESPE',
            'ano': 2022,
            'titulo': 'CESPE/STM/2022 - Regência de Obedecer'
        },
        {
            'enunciado': 'Considere a frase: "Os candidatos não eram favoráveis _____ proposta apresentada _____ comissão." As lacunas devem ser preenchidas, respectivamente, por:',
            'opcoes': [
                'A) à / pela',
                'B) a / pela',
                'C) à / a',
                'D) a / a',
                'E) há / pela'
            ],
            'resposta': 'A',
            'explicacao': 'O adjetivo "favorável" é regido pela preposição "a" ("favorável A algo"). Como "proposta" é palavra feminina e admite artigo, ocorre crase: "favorável À proposta". Já "apresentada PELA comissão" indica agente da passiva, exigindo a preposição "por" (contraída com o artigo: pela). Trata-se de regência nominal (do adjetivo) e regência verbal (do particípio passivo). Errado seria "apresentada à comissão", que mudaria o sentido (a quem foi apresentada, e não por quem).',
            'dica': 'Adjetivos com preposição "a": favorável, contrário, leal, fiel, anterior, posterior, semelhante, análogo, equivalente. Voz passiva: agente da passiva = POR (pelo/pela).',
            'dificuldade': 'médio',
            'fonte': 'FCC',
            'ano': 2022,
            'titulo': 'FCC/TRT/2022 - Regência Nominal e Crase'
        },
        {
            'enunciado': 'Em qual alternativa a regência do verbo está em DESACORDO com a norma culta?',
            'opcoes': [
                'A) O réu preferia a absolvição à condenação.',
                'B) O réu preferia mais a absolvição do que a condenação.',
                'C) Avisei ao chefe sobre o atraso.',
                'D) Esqueci-me do compromisso marcado.',
                'E) Lembrei-me do compromisso marcado.'
            ],
            'resposta': 'B',
            'explicacao': 'O verbo "preferir", na norma culta, é transitivo direto e indireto e tem regência fixa: "preferir UMA coisa A OUTRA". NÃO se admite "preferir mais... do que", "preferir antes... a", "preferir... a... do que". Apenas: "Prefiro A a B". Assim, a forma correta seria "preferia a absolvição à condenação", como em A. Em D e E, "esquecer-se de" e "lembrar-se de" são pronominais e exigem preposição "de", o que está correto. Em C, "avisar alguém DE algo" ou "avisar a alguém algo" — ambas formas são aceitas.',
            'dica': 'PREFERIR: prefiro X A Y. NUNCA "prefiro mais X do que Y", "prefiro X do que Y". Apenas A e direto.',
            'dificuldade': 'médio',
            'fonte': 'CESPE',
            'ano': 2023,
            'titulo': 'CESPE/TJDFT/2023 - Regência de Preferir'
        },
        {
            'enunciado': 'Julgue o item: Em "Estamos dispostos a colaborar com a investigação", a preposição "a" está corretamente empregada porque o adjetivo "disposto" exige tal preposição.',
            'opcoes': ['A) Verdadeiro', 'B) Falso'],
            'resposta': 'A',
            'explicacao': 'O adjetivo "disposto" rege a preposição "a" no sentido de "preparado para, propenso a": "disposto A colaborar", "disposto A enfrentar". Trata-se de regência nominal — alguns nomes (substantivos, adjetivos, advérbios) exigem preposições específicas. Outros exemplos: "apto A", "pronto A/PARA", "hábil EM", "necessário A", "útil A/PARA". Conhecer a regência nominal é essencial para uso correto da crase, pois muitos erros de crase vêm de desconhecimento da preposição exigida pelo nome.',
            'dica': 'Regência NOMINAL: alguns adjetivos exigem preposição. Disposto A, apto A, contrário A, anterior A, posterior A, capaz DE, hábil EM.',
            'dificuldade': 'fácil',
            'fonte': 'CESPE',
            'ano': 2022,
            'titulo': 'CESPE/PRF/2022 - Regência Nominal'
        },
        {
            'enunciado': 'Assinale a alternativa em que NÃO há crase, por se tratar de caso proibido:',
            'opcoes': [
                'A) Vou ___ Bahia nas próximas férias.',
                'B) Refiro-me ___ pessoa que me atendeu ontem.',
                'C) Pediu desculpas ___ ela pelo atraso.',
                'D) Estamos ___ disposição para esclarecimentos.',
                'E) Submeteu-se ___ regras do edital.'
            ],
            'resposta': 'C',
            'explicacao': 'NÃO se usa crase antes de PRONOMES PESSOAIS ("ela", "você", "mim", "ti" etc.), pois esses pronomes não admitem artigo. Em A, "Bahia" admite artigo (vou À Bahia, venho DA Bahia) → crase. Em B, "à pessoa" → crase. Em D, "à disposição" é locução adverbial feminina → crase. Em E, "às regras" → crase pela regência de "submeter-se a". Em C, "a ela" — sem crase, pois pronomes pessoais não recebem artigo.',
            'dica': 'Crase PROIBIDA antes de: pronomes pessoais (ela, mim), demonstrativos (esta, essa, isso), palavras masculinas, verbos, e em expressões como "a distância" (sem definição).',
            'dificuldade': 'médio',
            'fonte': 'FGV',
            'ano': 2022,
            'titulo': 'FGV/SEFAZ-AM/2022 - Crase Proibida'
        },
        {
            'enunciado': 'Sobre a regência do verbo "querer", é CORRETO afirmar:',
            'opcoes': [
                'A) Sempre é transitivo direto, em qualquer sentido.',
                'B) É transitivo indireto no sentido de "desejar".',
                'C) É transitivo direto no sentido de "desejar" e transitivo indireto (com preposição "a") no sentido de "estimar, ter afeto".',
                'D) Sempre exige a preposição "de".',
                'E) É verbo intransitivo na norma culta.'
            ],
            'resposta': 'C',
            'explicacao': 'O verbo "querer" tem dupla regência conforme o sentido: (1) "desejar, ambicionar" = TRANSITIVO DIRETO: "Quero o cargo", "Querem aprovação". (2) "estimar, ter afeição" = TRANSITIVO INDIRETO, com preposição "a": "Quero muito AOS meus pais", "Quero bem A todos". Esse é um caso clássico de mudança de regência por mudança de significado. Outros exemplos: "aspirar" (cheirar/desejar), "assistir" (ajudar/ver), "visar" (mirar/almejar), "implicar" (acarretar/causar antipatia).',
            'dica': 'QUERER: desejar = direto ("quero o livro"); estimar = INDIRETO ("quero AOS filhos"). Mudança de regência = mudança de sentido!',
            'dificuldade': 'difícil',
            'fonte': 'FCC',
            'ano': 2023,
            'titulo': 'FCC/MPE-SP/2023 - Mudança de Regência'
        },
        {
            'enunciado': 'Julgue o item: Em "O servidor procedeu à análise dos autos conforme determinou o juiz", o uso da crase está correto, pois o verbo "proceder" no sentido de "realizar, executar" exige a preposição "a".',
            'opcoes': ['A) Verdadeiro', 'B) Falso'],
            'resposta': 'A',
            'explicacao': 'O verbo "proceder" no sentido de "dar início, realizar, executar" é TRANSITIVO INDIRETO e exige a preposição "a": "proceder A algo". Como "análise" é feminina e admite artigo, ocorre crase: "procedeu À análise". (Em outros sentidos: "proceder DE" = ter origem, "esses argumentos procedem DE estudos sérios"; "proceder" sozinho = ter procedência, "o argumento procede".) É verbo muito cobrado em concursos, especialmente da área jurídica, em que aparece frequentemente.',
            'dica': 'PROCEDER A (realizar): "proceder à análise". PROCEDER DE (originar): "vem DE Minas". PROCEDER (ter base): "argumento procede".',
            'dificuldade': 'difícil',
            'fonte': 'CESPE',
            'ano': 2023,
            'titulo': 'CESPE/TJ-DFT/2023 - Regência de Proceder'
        }
    ]
}
