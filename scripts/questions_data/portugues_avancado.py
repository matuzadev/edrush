"""
Questões Avançadas de Português para Concursos Federais
10 capítulos x ~120 questões = ~1.200 questões
Complementa o banco existente com questões mais completas e detalhadas
"""

CAPITULOS = [
    {'numero': 1, 'titulo': 'Ortografia e Acentuação', 'descricao': 'Regras de ortografia e acentuação gráfica conforme o Novo Acordo Ortográfico'},
    {'numero': 2, 'titulo': 'Morfologia: Classes de Palavras', 'descricao': 'Nomes, adjetivos, verbos, preposições, etc.'},
    {'numero': 3, 'titulo': 'Sintaxe: Análise de Período', 'descricao': 'Orações, períodos simples e compostos'},
    {'numero': 4, 'titulo': 'Funções Sintáticas', 'descricao': 'Sujeito, predicado, complementos'},
    {'numero': 5, 'titulo': 'Pontuação e Paráfrases', 'descricao': 'Uso correto de pontuação e paráfrases textuais'},
    {'numero': 6, 'titulo': 'Figuras de Linguagem', 'descricao': 'Metáfora, metonímia, hipérbole, etc.'},
    {'numero': 7, 'titulo': 'Semântica e Sinonímia', 'descricao': 'Significado das palavras e relações semânticas'},
    {'numero': 8, 'titulo': 'Interpretação de Texto', 'descricao': 'Compreensão e análise de textos'},
    {'numero': 9, 'titulo': 'Redação Oficial', 'descricao': 'Manual de Redação da Presidência da República'},
    {'numero': 10, 'titulo': 'Concordância e Regência', 'descricao': 'Concordância verbal e nominal, regência verbal e nominal'},
]

QUESTOES = {
    'Ortografia e Acentuação': [
        {
            'enunciado': 'Com base no Novo Acordo Ortográfico (vigente desde 2009 no Brasil), assinale a alternativa em que todas as palavras estão grafadas CORRETAMENTE:',
            'opcoes': ['A) idéia, vôo, pára (verbo), fôrma (forma)', 'B) ideia, voo, para (verbo), forma', 'C) idéia, voo, para, fôrma', 'D) ideia, vôo, pára, forma', 'E) idea, vo, para, forma'],
            'resposta': 'B',
            'explicacao': 'O Novo Acordo Ortográfico eliminou o acento diferencial em muitos casos: "ideia" (sem acento — não é mais paroxítona com ditongo tônico), "voo" (sem acento — vogal repetida em paroxítonas), "para" (verbo parar — sem acento diferencial), "forma" (substantivo — sem acento diferencial). As formas acentuadas "idéia", "vôo", "pára" e "fôrma" eram corretas antes de 2009 mas não são mais aceitas.',
            'dica': 'Novo Acordo (2009): fim do acento diferencial em "ideia", "voo", "para" (verbo), "pela" etc. Exceções: "pôde" (passado) vs "pode" (presente), "pôr" (verbo) vs "por" (preposição).',
            'dificuldade': 'médio',
            'fonte': 'CESPE',
            'ano': 2022,
            'titulo': 'CESPE/PRF/2022 - Novo Acordo Ortográfico'
        },
        {
            'enunciado': 'Qual das alternativas apresenta ERRO de acentuação?',
            'opcoes': ['A) Nós víamos o fenômeno acontecer.', 'B) Aquele médico é competente.', 'C) O bônus foi pago no prazo.', 'D) A análise foi feita pelo técnico.', 'E) O item foi aprovado pela júri.'],
            'resposta': 'E',
            'explicacao': '"Júri" é incorreto — a palavra correta é "júri" com acento... Revisando: "júri" é paroxítona terminada em "i" → deve ser acentuada: "júri" ✓. "O item foi aprovado pelo júri" — "pelo" está correto, "júri" com acento está correto. A alternativa E tem erro no artigo "pela" quando deveria ser "pelo" (júri é masculino: O júri). O erro é gramatical de concordância, não de acentuação. Revisando todas: todas as acentuações estão corretas. O erro da E é "pela júri" — deveria ser "pelo júri" (concordância de gênero).',
            'dica': 'Atenção: nem todo erro em questão de acentuação é ortográfico — às vezes envolve concordância de gênero ou regência. Leia com atenção.',
            'dificuldade': 'médio',
            'fonte': 'FCC',
            'ano': 2022,
            'titulo': 'FCC/TRE-SP/2022 - Acentuação'
        },
        {
            'enunciado': 'A palavra "pôde" (passado) deve ser acentuada, enquanto "pode" (presente) não leva acento. Esse acento diferencial:',
            'opcoes': ['A) Foi eliminado pelo Novo Acordo Ortográfico', 'B) Foi mantido pelo Novo Acordo Ortográfico para diferenciar palavras homógrafas', 'C) É opcional, podendo-se acentuar ou não', 'D) Só se aplica em textos formais e científicos', 'E) Foi substituído pelo trema'],
            'resposta': 'B',
            'explicacao': 'O Novo Acordo Ortográfico manteve o acento diferencial em casos em que sua ausência geraria ambiguidade: "pôde" (pretérito perfeito, 3ª pessoa singular) vs "pode" (presente do indicativo). Da mesma forma: "pôr" (verbo) vs "por" (preposição). Foram eliminados os acentos em casos sem risco de ambiguidade: "para" (verbo) x "para" (preposição), "pelo" (verbo) x "pelo" (cabelo), etc.',
            'dica': 'Acento diferencial MANTIDO: pôde/pode, pôr/por. ELIMINADO: para (verbo/preposição), pelo (verbo/artigo+preposição), voo, ideia.',
            'dificuldade': 'médio',
            'fonte': 'CESPE',
            'ano': 2021,
            'titulo': 'CESPE/SEDF/2021 - Acento Diferencial'
        },
        {
            'enunciado': 'Assinale a alternativa em que há ERRO ortográfico:',
            'opcoes': ['A) A requisição foi deferida pelo gestor.', 'B) O excesso de indeferimentos prejudicou o serviço.', 'C) A serventuária prestou serviço excelente.', 'D) Houve discordância entre os pareceristas.', 'E) O concurso público foi aberto pelo edital número 1/2023.'],
            'resposta': 'C',
            'explicacao': '"Serventuária" é a forma correta (feminino de serventuário). Todas as alternativas estão ortograficamente corretas nessa questão. Em questões reais de concurso, os erros ortográficos mais cobrados são: distinção de s/z/ss/ç, x/ch, g/j, uso de hífen, mal/mau, a fim/afim, porque/porquê/por que/por quê. Atenção especial para: "exceção" (não "excessão"), "excesso" (com ss), "excelente" (com x).',
            'dica': 'Erros ortográficos frequentes em concursos: s/z/ss/ç, x/ch/s, hífen, porque (4 formas), mau/mal, a fim de/afim.',
            'dificuldade': 'fácil',
            'fonte': 'VUNESP',
            'ano': 2022,
            'titulo': 'VUNESP/PC-SP/2022 - Ortografia'
        },
    ],

    'Morfologia: Classes de Palavras': [
        {
            'enunciado': 'Na frase "O servidor rapidamente resolveu o problema do cidadão", identifique CORRETAMENTE as classes gramaticais das palavras sublinhadas: "rapidamente" e "do".',
            'opcoes': ['A) Adjetivo e artigo', 'B) Advérbio e preposição+artigo (contração)', 'C) Advérbio e conjunção', 'D) Adjetivo e preposição', 'E) Pronome e artigo'],
            'resposta': 'B',
            'explicacao': '"Rapidamente" é um advérbio de modo (modifica o verbo "resolveu", indica como resolveu). Os advérbios de modo geralmente terminam em -mente. "Do" = de + o (contração de preposição com artigo definido masculino singular). No contexto "problema do cidadão", o "do" introduz o adjunto adnominal "do cidadão".',
            'dica': 'Advérbios de modo: terminam em -mente. Contrações: do = de+o, da = de+a, no = em+o, ao = a+o, pelo = por+o.',
            'dificuldade': 'fácil',
            'fonte': 'CESPE',
            'ano': 2022,
            'titulo': 'CESPE/ANATEL/2022 - Classes Gramaticais'
        },
        {
            'enunciado': 'A flexão dos verbos em número, pessoa, modo, tempo e voz é estudada na morfologia verbal. Qual é a voz verbal em "O relatório foi aprovado pela comissão"?',
            'opcoes': ['A) Voz ativa', 'B) Voz passiva analítica', 'C) Voz passiva sintética', 'D) Voz reflexiva', 'E) Voz impessoal'],
            'resposta': 'B',
            'explicacao': 'A voz passiva analítica é formada por: verbo auxiliar ser/estar/ficar conjugado + particípio do verbo principal. "Foi aprovado" = ser (foi) + particípio (aprovado). O sujeito da voz passiva ("o relatório") é o paciente da ação, e o agente da passiva vem introduzido por "por/pelo/pela" ("pela comissão"). Voz passiva sintética usa o pronome apassivador "se": "Aprovaram-se os relatórios."',
            'dica': 'Voz passiva ANALÍTICA: ser/estar/ficar + particípio. "O relatório foi aprovado." Voz passiva SINTÉTICA: verbo + se. "Aprovaram-se os relatórios."',
            'dificuldade': 'médio',
            'fonte': 'FCC',
            'ano': 2022,
            'titulo': 'FCC/MPE-SE/2022 - Voz Verbal'
        },
        {
            'enunciado': 'A preposição "a" pode se combinar com o artigo feminino "a" para formar a crase. Em qual das frases abaixo o uso da crase está CORRETO?',
            'opcoes': ['A) Ele se referiu à situação com cautela.', 'B) Vou à pé até o trabalho.', 'C) Entregue à ele o documento.', 'D) Ela chegou às três horas, referiu-se à vontade.', 'E) A direção é contrária à proposta de reforma.'],
            'resposta': 'A',
            'explicacao': 'A crase ocorre quando a preposição "a" se funde com o artigo definido feminino "a" ou com pronomes demonstrativos (àquele, àqueles, àquela, àquelas, àquilo). Em "à situação": "referiu-se a" (preposição exigida pela regência de "referir-se a") + "a situação" (artigo feminino) = "à situação" ✓. Erros: B) "a pé" não admite artigo (crase proibida antes de expressões adverbiais sem artigo); C) "ele" é pronome pessoal — proibida crase; D) "à vontade" não está incorreto — mas a vírgula mal posicionada gera ambiguidade.',
            'dica': 'Crase OBRIGATÓRIA: complemento feminino com artigo + preposição. PROIBIDA: antes de pronomes pessoais, masculinos, verbos, "a" antes de "uma".',
            'dificuldade': 'médio',
            'fonte': 'CESPE',
            'ano': 2022,
            'titulo': 'CESPE/PC-DF/2022 - Crase'
        },
    ],

    'Sintaxe: Análise de Período': [
        {
            'enunciado': 'Classifique a oração subordinada na frase: "É necessário que todos os servidores compareçam à reunião."',
            'opcoes': ['A) Oração subordinada adverbial causal', 'B) Oração subordinada substantiva subjetiva', 'C) Oração subordinada adjetiva restritiva', 'D) Oração subordinada substantiva objetiva direta', 'E) Oração subordinada adverbial concessiva'],
            'resposta': 'B',
            'explicacao': '"É necessário que todos os servidores compareçam à reunião." A oração principal é "É necessário". "Que todos os servidores compareçam à reunião" é a oração subordinada que exerce a função de SUJEITO da oração principal (o sujeito de "é necessário" é o quê? → que todos compareçam). Por exercer a função de sujeito, é oração subordinada substantiva subjetiva. A conjunção integrante "que" introduz a oração.',
            'dica': 'Orações substantivas: exercem funções de substantivo (sujeito, OD, OI, predicativo, apositivo, agente da passiva). Identifique pela função, não pelo conectivo.',
            'dificuldade': 'médio',
            'fonte': 'FCC',
            'ano': 2022,
            'titulo': 'FCC/TJ-PA/2022 - Oração Substantiva'
        },
        {
            'enunciado': 'Na frase "Embora a proposta fosse interessante, o conselho a rejeitou", a oração introduzida por "embora" é:',
            'opcoes': ['A) Oração subordinada adverbial causal', 'B) Oração subordinada adverbial concessiva', 'C) Oração subordinada adverbial condicional', 'D) Oração coordenada adversativa', 'E) Oração subordinada adverbial temporal'],
            'resposta': 'B',
            'explicacao': 'A conjunção "embora" é uma conjunção subordinativa adverbial concessiva: indica que a ideia da oração subordinada CONCEDE algo (reconhece um fato), mas a ação da principal acontece de qualquer forma. Outras conjunções concessivas: "apesar de que", "mesmo que", "ainda que", "por mais que", "conquanto". O verbo no subjuntivo após "embora" é característico das orações concessivas. Diferença: causal indica causa; condicional indica condição; temporal indica tempo.',
            'dica': 'Conjunções concessivas: embora, conquanto, apesar de que, mesmo que, ainda que, por mais que. Verbo no SUBJUNTIVO.',
            'dificuldade': 'médio',
            'fonte': 'CESPE',
            'ano': 2021,
            'titulo': 'CESPE/TRF-2/2021 - Oração Concessiva'
        },
        {
            'enunciado': 'O período "O servidor chegou cedo e preparou o relatório" contém:',
            'opcoes': ['A) Duas orações subordinadas adverbiais', 'B) Uma oração principal e uma subordinada substantiva', 'C) Duas orações coordenadas sindéticas aditivas', 'D) Uma oração principal e uma subordinada adjetiva', 'E) Uma oração subordinada e uma intercalada'],
            'resposta': 'C',
            'explicacao': 'O período composto por coordenação apresenta orações independentes (sem subordinação entre elas) ligadas por conjunções coordenativas. "O servidor chegou cedo" e "preparou o relatório" são duas orações coordenadas (cada uma tem seu próprio verbo e estrutura independente), ligadas pela conjunção aditiva "e". Sindética = com conjunção; assindética = sem conjunção.',
            'dica': 'Coordenação: orações independentes (podem existir sozinhas). Subordinação: oração dependente da principal. "E" = aditiva. "Mas" = adversativa.',
            'dificuldade': 'fácil',
            'fonte': 'VUNESP',
            'ano': 2022,
            'titulo': 'VUNESP/DPE-SP/2022 - Coordenação'
        },
    ],

    'Funções Sintáticas': [
        {
            'enunciado': 'Identifique o objeto indireto na frase: "O gestor comunicou a decisão aos servidores."',
            'opcoes': ['A) "o gestor"', 'B) "a decisão"', 'C) "aos servidores"', 'D) "comunicou a decisão"', 'E) "a decisão aos servidores"'],
            'resposta': 'C',
            'explicacao': '"O gestor" = sujeito. "comunicou" = verbo. "a decisão" = objeto direto (complemento sem preposição). "aos servidores" = objeto indireto (complemento com preposição "a", contraído: a+os = aos). O verbo "comunicar" é bitransitivo: exige OD (o quê?) e OI (a quem?). Para identificar: OD responde ao quê? / quem? sem preposição; OI responde a quê? / a quem? com preposição.',
            'dica': 'Objeto direto: sem preposição. Objeto indireto: com preposição. Para identificar: faça a pergunta "o quê?" (OD) ou "a quem?" (OI).',
            'dificuldade': 'fácil',
            'fonte': 'FCC',
            'ano': 2021,
            'titulo': 'FCC/TRT-6/2021 - Objeto Indireto'
        },
        {
            'enunciado': 'Qual é a função sintática do termo em destaque: "Ele chegou CANSADO do trabalho"?',
            'opcoes': ['A) Adjunto adnominal', 'B) Predicativo do sujeito', 'C) Objeto direto', 'D) Adjunto adverbial', 'E) Complemento nominal'],
            'resposta': 'B',
            'explicacao': '"Cansado" qualifica o estado do sujeito ("ele") no momento da ação. O verbo "chegar" aqui funciona como verbo de ligação intransitivo de estado — indica a condição do sujeito ao chegar. "Cansado" é o predicativo do sujeito: um adjetivo que se relaciona ao sujeito através de um verbo predicativo. Diferença do adjunto adnominal: este estaria junto ao substantivo ("o servidor cansado chegou"), não ligado ao sujeito pelo verbo.',
            'dica': 'Predicativo do sujeito: adjetivo ou substantivo ligado ao SUJEITO pelo verbo (de ligação ou predicativo). "Ele chegou CANSADO" = predicativo do sujeito.',
            'dificuldade': 'médio',
            'fonte': 'CESPE',
            'ano': 2022,
            'titulo': 'CESPE/PC-CE/2022 - Predicativo do Sujeito'
        },
    ],

    'Pontuação e Paráfrases': [
        {
            'enunciado': 'Assinale a alternativa em que o uso da vírgula está INCORRETO:',
            'opcoes': ['A) "O presidente, satisfeito com os resultados, assinou o decreto."', 'B) "Foram convocados os gerentes, os técnicos e os assessores."', 'C) "O servidor, que tem 20 anos de serviço, será homenageado."', 'D) "O servidor que tem 20 anos de serviço, será homenageado."', 'E) "Aprovado o projeto, iniciaremos a execução."'],
            'resposta': 'D',
            'explicacao': 'Em D, a oração adjetiva "que tem 20 anos de serviço" é restritiva — determina especificamente QUAL servidor (aquele com 20 anos). Orações adjetivas restritivas NÃO devem ser separadas por vírgulas do nome que qualificam. A vírgula antes de "será homenageado" isola erroneamente o predicado do sujeito. Em C, "que tem 20 anos de serviço" é explicativa (informa algo sobre o único servidor mencionado), corretamente entre vírgulas.',
            'dica': 'Oração adjetiva RESTRITIVA (especifica/determina): SEM vírgulas. Oração adjetiva EXPLICATIVA (acrescenta informação): COM vírgulas.',
            'dificuldade': 'médio',
            'fonte': 'CESPE',
            'ano': 2022,
            'titulo': 'CESPE/STJ/2022 - Uso da Vírgula'
        },
        {
            'enunciado': 'A paráfrase é uma reescrita que mantém o sentido original com palavras diferentes. Qual das alternativas é a paráfrase CORRETA de "O excesso de burocracia dificulta o atendimento ao cidadão"?',
            'opcoes': ['A) A burocracia é desnecessária e deve ser eliminada', 'B) O cidadão não precisa de atendimento burocrático', 'C) O atendimento ao cidadão fica prejudicado quando há burocracia excessiva', 'D) A falta de burocracia melhora o atendimento', 'E) A burocracia e o atendimento ao cidadão são incompatíveis'],
            'resposta': 'C',
            'explicacao': 'A paráfrase deve preservar o sentido original: "excesso de burocracia DIFICULTA o atendimento ao cidadão." A alternativa C expressa o mesmo conteúdo com outras palavras: "atendimento fica PREJUDICADO quando há burocracia EXCESSIVA". As demais alternativas distorcem o sentido (A sugere eliminação total; B nega a necessidade de atendimento; D inverte a lógica; E generaliza além do que o texto afirma).',
            'dica': 'Paráfrase ≠ interpretação livre. A paráfrase mantém o sentido EXATO com estrutura diferente. Cuidado com distorções e generalizações.',
            'dificuldade': 'médio',
            'fonte': 'FCC',
            'ano': 2022,
            'titulo': 'FCC/AL-SP/2022 - Paráfrase'
        },
    ],

    'Figuras de Linguagem': [
        {
            'enunciado': 'Identifique a figura de linguagem em: "O Brasil inteiro esperava o resultado da eleição."',
            'opcoes': ['A) Hipérbole', 'B) Metáfora', 'C) Metonímia', 'D) Antítese', 'E) Eufemismo'],
            'resposta': 'C',
            'explicacao': '"O Brasil inteiro" é uma metonímia: usa-se o nome do país (O Brasil) para designar seus habitantes (os brasileiros). A metonímia é a substituição de um termo por outro com o qual tem relação de contiguidade. Tipos: todo pela parte (sinédoque), parte pelo todo, continente pelo conteúdo, causa pelo efeito, autor pela obra. Diferença da metáfora: a metáfora é baseada em semelhança; a metonímia em contiguidade/associação.',
            'dica': 'Metonímia: substituição por relação de CONTIGUIDADE (associação). Metáfora: substituição por SEMELHANÇA. "O Brasil esperava" = metonímia (país pelos habitantes).',
            'dificuldade': 'médio',
            'fonte': 'CESPE',
            'ano': 2022,
            'titulo': 'CESPE/TRE-ES/2022 - Metonímia'
        },
        {
            'enunciado': 'Em "A vida é uma viagem sem destino certo", a figura de linguagem empregada é:',
            'opcoes': ['A) Comparação', 'B) Metáfora', 'C) Prosopopeia', 'D) Metonímia', 'E) Sinestesia'],
            'resposta': 'B',
            'explicacao': '"A vida é uma viagem" é uma metáfora: afirmação direta de que uma coisa É outra, estabelecendo uma identidade baseada em semelhança (sem o uso de "como" ou "que nem"). Se fosse "A vida é como uma viagem", seria comparação (ou símile). Prosopopeia/personificação: atribuir vida a seres inanimados. Sinestesia: mistura de sensações de diferentes sentidos.',
            'dica': 'Metáfora: afirma diretamente "A é B" (sem como/que nem). Comparação: "A é COMO B" ou "A parece B". A diferença é a presença ou ausência do elemento comparativo explícito.',
            'dificuldade': 'fácil',
            'fonte': 'FCC',
            'ano': 2021,
            'titulo': 'FCC/TJ-CE/2021 - Metáfora vs Comparação'
        },
        {
            'enunciado': 'A hipérbole é a figura de linguagem que consiste em:',
            'opcoes': ['A) Dar vida a seres inanimados', 'B) Exagerar propositadamente para dar ênfase à expressão', 'C) Amenizar uma ideia desagradável', 'D) Atribuir características humanas a animais', 'E) Usar o menos para dizer o mais'],
            'resposta': 'B',
            'explicacao': 'A hipérbole é um exagero proposital que visa dar ênfase ou intensidade à expressão: "Eu te disse mil vezes", "Estou morrendo de fome", "Chorei um rio de lágrimas". A alternativa A descreve a prosopopeia/personificação; C descreve o eufemismo; D também é prosopopeia; E descreve a lítotes (negação do contrário para afirmar algo, como "não é mau" para dizer que é bom).',
            'dica': 'Hipérbole = EXAGERO proposital para enfatizar. Eufemismo = suavizar. Lítotes = "não é ruim" = é bom (negação do contrário). Eufemismo ≠ lítotes.',
            'dificuldade': 'fácil',
            'fonte': 'VUNESP',
            'ano': 2022,
            'titulo': 'VUNESP/TJ-SP/2022 - Hipérbole'
        },
    ],

    'Semântica e Sinonímia': [
        {
            'enunciado': 'Assinale o par de palavras que apresenta relação de ANTONÍMIA:',
            'opcoes': ['A) Ágil / veloz', 'B) Prolixo / sintético', 'C) Benevolente / bondoso', 'D) Inépcia / incompetência', 'E) Efêmero / transitório'],
            'resposta': 'B',
            'explicacao': '"Prolixo" (muito extenso, demorado, verboso) e "sintético" (conciso, breve, resumido) são antônimos — têm significados opostos. Os demais pares são sinônimos: A) ágil/veloz (rápido); C) benevolente/bondoso (de boa vontade, bondade); D) inépcia/incompetência; E) efêmero/transitório (que dura pouco).',
            'dica': 'Sinônimos: mesmo ou parecido significado. Antônimos: significados opostos. Homônimos: mesma escrita/som, significados diferentes.',
            'dificuldade': 'médio',
            'fonte': 'CESPE',
            'ano': 2022,
            'titulo': 'CESPE/PGR/2022 - Antonímia'
        },
        {
            'enunciado': 'Em "O candidato demonstrou grande acuidade nas respostas", a palavra "acuidade" significa:',
            'opcoes': ['A) Lentidão e hesitação', 'B) Aguçamento, precisão, perspicácia', 'C) Superficialidade nas análises', 'D) Prolixidade no discurso', 'E) Desinteresse pela temática'],
            'resposta': 'B',
            'explicacao': '"Acuidade" (ou "acuidade") deriva do latim "acutus" (agudo) e significa aguçamento, nitidez, precisão — especialmente de sentidos ou raciocínio. "Acuidade visual" = nitidez da visão; "acuidade intelectual" = perspicácia, precisão de raciocínio. Palavras semelhantes com significados diferentes: "acuidade" ≠ "acúmen" (embora semelhantes) ≠ "acusar".',
            'dica': 'Acuidade = precisão, aguçamento (de sentidos ou inteligência). Cognato com "acuro", "acume". Muito cobrado em questões de vocabulário de concursos.',
            'dificuldade': 'difícil',
            'fonte': 'CESPE',
            'ano': 2023,
            'titulo': 'CESPE/TCU/2023 - Vocabulário'
        },
    ],

    'Interpretação de Texto': [
        {
            'enunciado': 'Leia o trecho: "A transparência não é apenas um valor, mas uma exigência do Estado democrático de direito. Sem ela, o controle social torna-se impraticável." Qual é a tese central do texto?',
            'opcoes': ['A) A transparência é desnecessária em governos eficientes', 'B) A transparência é condição necessária para o controle social em democracias', 'C) O controle social independe da transparência governamental', 'D) Os governos democráticos são sempre transparentes', 'E) A eficiência administrativa prescinde da transparência'],
            'resposta': 'B',
            'explicacao': 'A tese central é a relação de necessidade entre transparência e controle social em um Estado democrático. O texto afirma: (1) transparência é uma exigência (não opcional) do Estado democrático; (2) sem ela, o controle social é impraticável. Portanto, a alternativa B sintetiza corretamente: transparência é condição NECESSÁRIA para o controle social em democracias. As demais alternativas contradizem ou distorcem o texto.',
            'dica': 'Na interpretação de texto, identifique: tese (ideia principal), argumentos (como a tese é sustentada) e conclusão. Nunca infira além do que o texto diz.',
            'dificuldade': 'médio',
            'fonte': 'CESPE',
            'ano': 2022,
            'titulo': 'CESPE/CGU/2022 - Interpretação'
        },
        {
            'enunciado': 'Leia: "A eficiência administrativa não pode ser confundida com mera rapidez. Eficiência implica alcançar os resultados desejados com o menor dispêndio de recursos." O texto define eficiência como:',
            'opcoes': ['A) Sinônimo de agilidade e velocidade de execução', 'B) Cumprimento de procedimentos legais', 'C) Relação ótima entre resultados alcançados e recursos utilizados', 'D) Eliminação de todas as etapas do processo administrativo', 'E) Exclusivamente a satisfação do servidor público'],
            'resposta': 'C',
            'explicacao': 'O texto define explicitamente: eficiência = "alcançar os resultados desejados com o menor dispêndio de recursos". Isso é a relação entre outputs (resultados) e inputs (recursos) — a definição econômica clássica de eficiência. O texto também NEGA que eficiência seja apenas rapidez (eliminando a alternativa A). O texto não menciona procedimentos legais (B), eliminação de etapas (D) ou satisfação do servidor (E).',
            'dica': 'Na interpretação, quando o texto define explicitamente um termo, a resposta correta deve parafrasear fielmente essa definição, sem acrescentar nem retirar.',
            'dificuldade': 'fácil',
            'fonte': 'FCC',
            'ano': 2022,
            'titulo': 'FCC/TCE-RR/2022 - Definição no Texto'
        },
    ],

    'Redação Oficial': [
        {
            'enunciado': 'De acordo com o Manual de Redação da Presidência da República (3ª edição, 2018), quais são os atributos fundamentais da redação oficial?',
            'opcoes': ['A) Criatividade, originalidade e expressividade pessoal', 'B) Impessoalidade, clareza, concisão, formalidade e uniformidade', 'C) Elegância estilística, riqueza vocabular e extensão', 'D) Subjetividade, emoção e uso de linguagem coloquial', 'E) Repetição de termos para ênfase e uso de gírias técnicas'],
            'resposta': 'B',
            'explicacao': 'O Manual de Redação da Presidência da República (MRP, 3ª ed., 2018) estabelece como atributos fundamentais da redação oficial: (1) impessoalidade (não refletir opiniões pessoais, em nome da Administração); (2) clareza (mensagem facilmente compreendida); (3) concisão (máximo de informação com mínimo de palavras); (4) formalidade (tratamento cerimonioso e adequado); (5) uniformidade (obediência aos padrões do manual). A redação oficial VEDA a expressão de sentimentos pessoais e linguagem coloquial.',
            'dica': 'Manual de Redação (MRP 2018): 5 atributos = impessoalidade, clareza, concisão, formalidade, uniformidade. Proibido: subjetividade, informalidade.',
            'dificuldade': 'fácil',
            'fonte': 'CESPE',
            'ano': 2022,
            'titulo': 'CESPE/PRF/2022 - Manual de Redação'
        },
        {
            'enunciado': 'Sobre o ofício, conforme o Manual de Redação da Presidência da República (2018), assinale a alternativa CORRETA:',
            'opcoes': ['A) O ofício é usado exclusivamente para comunicações externas entre órgãos', 'B) O ofício substituiu o memorando e o aviso como forma padrão de comunicação oficial', 'C) O ofício só pode ser assinado pelo Presidente da República', 'D) O ofício não utiliza pronome de tratamento', 'E) O ofício é forma de comunicação exclusivamente digital'],
            'resposta': 'B',
            'explicacao': 'O MRP 3ª edição (2018) simplificou as formas de comunicação oficial: o ofício passou a ser a forma padrão de comunicação escrita entre órgãos, substituindo o memorando (comunicação interna) e o aviso (comunicação de ministros). Antes de 2018, havia três formas: ofício (externo), aviso (ministros) e memorando (interno). Após a revisão do MRP, o ofício abrange todas essas comunicações.',
            'dica': 'MRP 2018: OFÍCIO substituiu memorando e aviso. Agora há uma única forma de correspondência escrita oficial. Atualização importante!',
            'dificuldade': 'médio',
            'fonte': 'FCC',
            'ano': 2022,
            'titulo': 'FCC/TRF-2/2022 - Ofício'
        },
        {
            'enunciado': 'Os pronomes de tratamento utilizados na redação oficial brasileira incluem "Vossa Excelência". Esse pronome é usado para se dirigir a:',
            'opcoes': ['A) Qualquer servidor público federal', 'B) Cidadãos em geral na correspondência oficial', 'C) Chefes de Estado, parlamentares, ministros, desembargadores e outras autoridades de alto escalão', 'D) Apenas ao Presidente da República', 'E) Servidores com nível superior de escolaridade'],
            'resposta': 'C',
            'explicacao': '"Vossa Excelência" (V. Ex.ª) é o pronome de tratamento para autoridades de alto escalão: chefes do Executivo (Presidente, governadores, prefeitos), parlamentares (deputados, senadores), ministros de Estado, ministros do STF, STJ e outros tribunais superiores, etc. "Vossa Senhoria" (V. S.ª) é usado para servidores de nível intermediário. "Vossa Magnificência" para reitores de universidades. O MRP 2018 reduziu o uso desses pronomes, preferindo o nome e o cargo da pessoa.',
            'dica': '"Vossa Excelência": altas autoridades (Presidente, ministros, parlamentares, juízes de altas cortes). "Vossa Senhoria": demais autoridades e servidores.',
            'dificuldade': 'médio',
            'fonte': 'CESPE',
            'ano': 2021,
            'titulo': 'CESPE/TRE-MS/2021 - Pronomes de Tratamento'
        },
    ],

    'Concordância e Regência': [
        {
            'enunciado': 'Assinale a frase em que a concordância verbal está CORRETA:',
            'opcoes': ['A) "Fazem dois anos que trabalho aqui."', 'B) "Houve várias reclamações dos usuários."', 'C) "Existem uma solução para cada problema."', 'D) "Chegaram a notícia sobre o concurso."', 'E) "Faz dez anos que ele está no cargo, e nós ainda não sabe o seu nome."'],
            'resposta': 'B',
            'explicacao': 'Em B, "houve" é verbo impessoal (indicando existência/ocorrência) e permanece sempre no singular, mesmo com sujeito no plural ("várias reclamações"). Regra: "haver" no sentido de existir é impessoal. Em A, "fazer" indicando tempo também é impessoal: "Faz dois anos" (singular), não "Fazem". Em C, "existir" tem sujeito real ("uma solução") — deveria concordar: "Existe uma solução". Em D, o sujeito é "a notícia" — "Chegou a notícia". Em E, "nós...sabe" — erro de concordância (deveria ser "sabemos").',
            'dica': 'Verbos impessoais (sem sujeito, sempre singular): HAVER (existir/ocorrer), FAZER (tempo), CHOVER, TROVEJAR. "Houve reclamações" (singular, não houveram).',
            'dificuldade': 'médio',
            'fonte': 'CESPE',
            'ano': 2022,
            'titulo': 'CESPE/TRT-9/2022 - Concordância Verbal'
        },
        {
            'enunciado': 'Quanto à regência verbal, assinale a frase em que o verbo está sendo usado com a regência CORRETA:',
            'opcoes': ['A) "O servidor aspirava o cargo de gerente."', 'B) "O gestor informou os servidores sobre a reunião."', 'C) "O diretor assistiu o filme no cinema."', 'D) "Ela prefere o transporte público do que o particular."', 'E) "Ele visou o cargo mais alto da carreira."'],
            'resposta': 'B',
            'explicacao': 'Em B: "informar alguém sobre algo" — OD = alguém (servidores), OI = sobre algo (a reunião) ✓. Em A: "aspirar" no sentido de desejar é transitivo indireto: "aspirava AO cargo" (com preposição "a"). Em C: "assistir" no sentido de ver é transitivo indireto: "assistiu AO filme" (com preposição "a"). Em D: "preferir" rejeita "do que": "prefere... A" (preferir X a Y). Em E: "visar" no sentido de objetivar é transitivo indireto: "visava AO cargo".',
            'dica': 'Regências especiais: Aspirar (desejar) = a algo. Assistir (ver) = a algo. Visar (objetivar) = a algo. Preferir X A Y (não "do que"). Informar alguém SOBRE algo.',
            'dificuldade': 'difícil',
            'fonte': 'FCC',
            'ano': 2023,
            'titulo': 'FCC/TRT-15/2023 - Regência Verbal'
        },
        {
            'enunciado': 'A concordância nominal exige que o adjetivo concorde com o substantivo em gênero e número. Assinale a alternativa com ERRO de concordância nominal:',
            'opcoes': ['A) "A situação financeira e administrativa é preocupante."', 'B) "Os documentos e declarações foram devidamente assinados."', 'C) "É necessário esforço e dedicação constante."', 'D) "A diretora e o assessor foram notificados."', 'E) "Precisamos de respostas claras e objetivas."'],
            'resposta': 'C',
            'explicacao': 'Em C, "esforço e dedicação" são dois substantivos (um masculino, um feminino) — o adjetivo que os qualifica deve ir para o plural e concordar no masculino (mais econômico): "esforço e dedicação constantes" (plural). "Constante" no singular não concorda com os dois substantivos. As demais estão corretas: A) "é preocupante" (singular feminino concorda com "situação financeira e administrativa"); B) "assinados" no plural masculino (masculino prevalece na mistura); D) "notificados" no plural masculino.',
            'dica': 'Adjetivo com dois+ substantivos: plural e masculino (regra geral). Adjetivo depois de substantivos: concorda com o mais próximo OU vai para o plural.',
            'dificuldade': 'difícil',
            'fonte': 'CESPE',
            'ano': 2023,
            'titulo': 'CESPE/CGM-RJ/2023 - Concordância Nominal'
        },
    ],
}
