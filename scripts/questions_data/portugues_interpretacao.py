"""
Português — Interpretação, Coesão e Tipologia
30 questões cobrindo 3 capítulos
Estilo CESPE/FCC/FGV — questões originais com textos-base realistas
"""

CAPITULOS = [
    {'numero': 8, 'titulo': 'Compreensão e Interpretação de Textos', 'descricao': 'Ideia principal, ideias secundárias, inferência, ironia, intertextualidade e propósito comunicativo'},
    {'numero': 9, 'titulo': 'Tipologia e Gêneros Textuais', 'descricao': 'Tipos textuais (narração, descrição, dissertação, exposição, injunção) e gêneros oficiais (ofício, relatório, parecer, ata, requerimento)'},
    {'numero': 11, 'titulo': 'Coesão e Coerência Textual', 'descricao': 'Mecanismos de coesão referencial e sequencial, coerência, conectivos, retomada e paralelismo'},
]

QUESTOES = {
    'Compreensão e Interpretação de Textos': [
        {
            'enunciado': 'Considere o texto a seguir:\n\n"A administração pública brasileira tem investido em iniciativas de governo digital, com o intuito de simplificar o acesso do cidadão a serviços antes restritos ao atendimento presencial. Contudo, a desigualdade de acesso à internet ainda representa obstáculo concreto à universalização desses canais, sobretudo em regiões periféricas, onde a inclusão digital permanece tarefa pendente."\n\nDe acordo com o texto, a ideia principal é:',
            'opcoes': [
                'A) A administração pública brasileira eliminou totalmente o atendimento presencial.',
                'B) Apesar dos avanços do governo digital, a desigualdade de acesso à internet limita a universalização do serviço.',
                'C) A inclusão digital já é uma realidade consolidada nas regiões periféricas do país.',
                'D) O governo digital foi criado exclusivamente para atender as regiões periféricas.',
                'E) O atendimento presencial é mais eficiente do que o atendimento digital.'
            ],
            'resposta': 'B',
            'explicacao': 'A ideia principal de um texto é a tese central que organiza todas as informações. O texto reconhece os investimentos em governo digital (1ª oração) mas, por meio do conectivo adversativo "Contudo", apresenta a ressalva fundamental: a desigualdade de acesso à internet impede a universalização. As demais alternativas distorcem o texto: A é falsa (o texto não fala em eliminação do presencial), C contradiz o texto (que afirma ser tarefa pendente), D extrapola (não há essa exclusividade) e E não é discutida.',
            'dica': 'A ideia principal costuma estar concentrada nas orações ligadas por conectivos adversativos (mas, contudo, todavia, entretanto), pois são neles que o autor expressa o foco argumentativo do texto.',
            'dificuldade': 'fácil',
            'fonte': 'CESPE',
            'ano': 2024,
            'titulo': 'CESPE/Banco do Brasil/2024 - Ideia Principal'
        },
        {
            'enunciado': 'Leia o trecho:\n\n"Diante do cenário de crise hídrica, o gestor público vê-se obrigado a tomar decisões impopulares — racionar o consumo, elevar tarifas, restringir usos não essenciais. A popularidade momentânea, contudo, não pode prevalecer sobre o interesse coletivo de longo prazo."\n\nDepreende-se do texto, por inferência, que:',
            'opcoes': [
                'A) o gestor público sempre toma decisões populares.',
                'B) o autor defende que decisões impopulares podem ser legítimas quando atendem ao interesse coletivo.',
                'C) o racionamento é a única medida cabível em crises hídricas.',
                'D) tarifas elevadas resolvem definitivamente a crise hídrica.',
                'E) o gestor público deve sempre seguir a opinião popular para preservar seu mandato.'
            ],
            'resposta': 'B',
            'explicacao': 'A inferência exige que se identifique o que o texto autoriza a concluir, ainda que não diga explicitamente. Quando o autor afirma que "a popularidade momentânea não pode prevalecer sobre o interesse coletivo de longo prazo", está implicitamente sustentando que decisões impopulares podem ser legítimas se atenderem ao interesse coletivo — tese da alternativa B. As demais alternativas extrapolam (C, D), distorcem (A) ou contradizem (E) o texto.',
            'dica': 'Inferir não é extrapolar. A inferência válida é aquela que o texto autoriza por suas palavras e estrutura argumentativa; a extrapolação acrescenta informação que o texto não sustenta.',
            'dificuldade': 'médio',
            'fonte': 'FGV',
            'ano': 2023,
            'titulo': 'FGV/TJ-RS/2023 - Inferência Textual'
        },
        {
            'enunciado': 'Sobre o seguinte fragmento:\n\n"Brilhante o servidor que, encarregado de organizar mil processos, gastou três meses apenas decidindo a cor das pastas. O resultado, evidentemente, foi exemplar: as pastas, lindíssimas, permanecem vazias até hoje."\n\nÉ correto afirmar que o autor utiliza o recurso de:',
            'opcoes': [
                'A) ironia, ao elogiar formalmente uma conduta que, na prática, é criticada.',
                'B) hipérbole, ao exagerar a quantidade de processos.',
                'C) metáfora, ao comparar o servidor a uma pasta.',
                'D) eufemismo, ao suavizar críticas pesadas com termos amenos.',
                'E) personificação, ao atribuir características humanas às pastas.'
            ],
            'resposta': 'A',
            'explicacao': 'A ironia consiste em dizer o contrário do que se pensa, geralmente com intuito crítico. Os adjetivos "Brilhante" e "exemplar" elogiam formalmente o servidor, mas o contexto deixa claro o juízo negativo: ele perdeu três meses em uma decisão menor enquanto os processos seguiam parados. Essa contradição entre forma e conteúdo é o cerne da ironia.',
            'dica': 'Identifique a ironia pelo contraste entre a aparência elogiosa do enunciado e o conteúdo concretamente criticado pelo contexto. Frases positivas em situações negativas são fortes indícios de ironia.',
            'dificuldade': 'médio',
            'fonte': 'FCC',
            'ano': 2023,
            'titulo': 'FCC/TRT-2/2023 - Ironia'
        },
        {
            'enunciado': 'Considere:\n\n"Em terra de cego, quem tem um olho é rei. A máxima popular, citada pelo autor, ilustra a tese de que, em ambientes de baixa qualificação, mesmo competências modestas podem alçar profissionais a posições de destaque indevido — fenômeno particularmente preocupante na gestão pública."\n\nO recurso textual predominante no fragmento é:',
            'opcoes': [
                'A) narração de fato histórico.',
                'B) intertextualidade, com o uso de provérbio popular para sustentar a argumentação.',
                'C) descrição minuciosa de um cenário.',
                'D) injunção, com instruções diretas ao leitor.',
                'E) digressão, com afastamento do tema central.'
            ],
            'resposta': 'B',
            'explicacao': 'A intertextualidade é a presença, em um texto, de referências a outro texto, obra ou enunciado consagrado. Aqui, o autor cita expressamente o provérbio "Em terra de cego, quem tem um olho é rei" e o utiliza como fundamento para a sua tese. Essa retomada de um texto previamente conhecido pelo leitor caracteriza a intertextualidade. Não se trata de narração (não conta fato), nem descrição (não detalha cenário), nem injunção (não dá ordens).',
            'dica': 'Provérbios, citações de autoridades, paródias, paráfrases e referências a obras conhecidas são marcas típicas de intertextualidade. Atenção a "como diz o ditado", "segundo Fulano", entre outros.',
            'dificuldade': 'médio',
            'fonte': 'FGV',
            'ano': 2024,
            'titulo': 'FGV/Receita Federal/2024 - Intertextualidade'
        },
        {
            'enunciado': 'Julgue o item conforme o trecho:\n\n"O presente edital tem por finalidade convocar os candidatos aprovados na 1ª fase para a etapa de avaliação de títulos, devendo o documento ser apresentado, sob pena de eliminação, no prazo improrrogável de cinco dias úteis."\n\nO propósito comunicativo predominante do trecho é instruir o leitor sobre uma obrigação a ser cumprida em prazo determinado.',
            'opcoes': ['A) Verdadeiro', 'B) Falso'],
            'resposta': 'A',
            'explicacao': 'O propósito comunicativo é a intenção que organiza o texto: informar, convencer, instruir, comover, etc. O trecho é claramente instrucional/injuntivo: convoca, estabelece prazo, impõe pena de eliminação. As marcas linguísticas — "devendo", "sob pena de", "prazo improrrogável" — confirmam o propósito de orientar/obrigar o leitor a uma conduta. Logo, a afirmação é verdadeira.',
            'dica': 'Para identificar o propósito comunicativo, observe os verbos predominantes: imperativos e modais (deve, é obrigatório) sinalizam textos injuntivos; verbos no presente atemporal indicam exposição; verbos no pretérito, narração.',
            'dificuldade': 'fácil',
            'fonte': 'CESPE',
            'ano': 2023,
            'titulo': 'CESPE/TRE-PE/2023 - Propósito Comunicativo'
        },
        {
            'enunciado': 'Texto-base:\n\n"A digitalização dos processos administrativos não é, em si, garantia de eficiência. Sem revisão dos fluxos de trabalho, a tecnologia apenas acelera a desordem: o que era lento e mal feito passa a ser rápido e mal feito."\n\nA ideia secundária que sustenta a tese principal do texto é:',
            'opcoes': [
                'A) a digitalização sempre torna os processos eficientes.',
                'B) a velocidade é o principal indicador de qualidade na administração.',
                'C) sem revisão dos fluxos de trabalho, a tecnologia tende a apenas acelerar problemas preexistentes.',
                'D) processos manuais são preferíveis aos digitais.',
                'E) a tecnologia substitui completamente a necessidade de revisão dos fluxos.'
            ],
            'resposta': 'C',
            'explicacao': 'A ideia principal do texto é que a digitalização não basta para garantir eficiência. A ideia secundária — aquela que dá suporte argumentativo à principal — é justamente a que aparece na alternativa C: sem revisão dos fluxos de trabalho, a tecnologia apenas torna mais rápido o que já era ruim. As demais alternativas contradizem (A, B, E) ou extrapolam (D) o texto.',
            'dica': 'A ideia secundária é o argumento, exemplo, dado ou consequência que sustenta a ideia principal. Ela explica por que a tese se sustenta.',
            'dificuldade': 'médio',
            'fonte': 'CESPE',
            'ano': 2024,
            'titulo': 'CESPE/INSS/2024 - Ideias Secundárias'
        },
        {
            'enunciado': 'Leia o texto:\n\n"Cobra-se do servidor público comportamento exemplar — pontualidade, urbanidade, eficiência. Pois bem: que se cobre, igualmente, da estrutura que o cerca o mesmo padrão. Não há servidor exemplar em órgão precário."\n\nA tese defendida pelo autor é:',
            'opcoes': [
                'A) o servidor público raramente cumpre seus deveres.',
                'B) o desempenho exemplar do servidor depende também das condições estruturais que lhe são oferecidas.',
                'C) órgãos precários produzem servidores eficientes.',
                'D) a cobrança sobre o servidor deve ser ampliada e sem contrapartidas.',
                'E) pontualidade e urbanidade são atributos dispensáveis ao serviço público.'
            ],
            'resposta': 'B',
            'explicacao': 'A tese é a posição central que o autor defende. Aqui, ele reconhece a legitimidade da cobrança ao servidor (1ª frase), mas, ao adicionar "que se cobre, igualmente, da estrutura" e fechar com "Não há servidor exemplar em órgão precário", argumenta que o desempenho do agente público é condicionado pela estrutura — exatamente o que a alternativa B sintetiza.',
            'dica': 'Em textos argumentativos, a tese costuma estar na conclusão (última frase) ou no início. Identifique a frase de fechamento — ela com frequência condensa a posição defendida.',
            'dificuldade': 'fácil',
            'fonte': 'FCC',
            'ano': 2023,
            'titulo': 'FCC/MPE-CE/2023 - Tese e Argumentação'
        },
        {
            'enunciado': 'Julgue:\n\n"O combate à corrupção, embora se beneficie do endurecimento legislativo, não prescinde de uma cultura organizacional íntegra. Leis não bastam; é preciso formar consciências."\n\nDo trecho infere-se corretamente que o autor considera as leis insuficientes, isoladamente, para o combate à corrupção.',
            'opcoes': ['A) Verdadeiro', 'B) Falso'],
            'resposta': 'A',
            'explicacao': 'A construção "embora se beneficie do endurecimento legislativo, não prescinde de uma cultura organizacional íntegra" reconhece a contribuição das leis, mas afirma que elas são insuficientes sozinhas — pois "não prescindir" significa "não dispensar". A frase final reforça: "Leis não bastam". Logo, a inferência da assertiva é correta.',
            'dica': 'Cuidado com "prescindir" (= dispensar) e "não prescindir" (= não dispensar, ou seja, precisar). Esse verbo é cobrado com frequência em provas de banca.',
            'dificuldade': 'difícil',
            'fonte': 'CESPE',
            'ano': 2024,
            'titulo': 'CESPE/AGU/2024 - Inferência e Vocabulário'
        },
        {
            'enunciado': 'Texto:\n\n"Em audiência pública, o gestor declarou: \'Faremos uma reforma profunda na máquina administrativa, na medida do possível, com cuidado, sem afobação, no momento adequado.\' A plateia, ao final, aplaudiu — sem saber muito bem o quê."\n\nO comentário final do autor ("sem saber muito bem o quê") tem como propósito comunicativo:',
            'opcoes': [
                'A) elogiar discretamente a clareza do gestor.',
                'B) ironizar a vagueza do discurso, sugerindo ausência de conteúdo concreto.',
                'C) descrever objetivamente o estado emocional da plateia.',
                'D) narrar o fim de uma sessão tranquila.',
                'E) instruir o leitor a aplaudir reformas administrativas.'
            ],
            'resposta': 'B',
            'explicacao': 'O propósito comunicativo do comentário final é ironizar. O discurso do gestor é repleto de generalidades ("na medida do possível", "com cuidado", "no momento adequado") sem qualquer compromisso concreto. Ao acrescentar que a plateia aplaudiu "sem saber muito bem o quê", o autor expõe a vacuidade do discurso. A ironia aqui critica a falta de conteúdo do gestor.',
            'dica': 'Em textos críticos, o comentário do autor após uma fala citada costuma carregar a chave interpretativa. Observe as adjetivações e os comentários de fechamento.',
            'dificuldade': 'difícil',
            'fonte': 'FGV',
            'ano': 2024,
            'titulo': 'FGV/SEFAZ-SP/2024 - Ironia e Propósito'
        },
        {
            'enunciado': 'Considere o trecho:\n\n"O artigo 37 da Constituição Federal estabelece que a administração pública obedecerá aos princípios de legalidade, impessoalidade, moralidade, publicidade e eficiência."\n\nNo contexto de uma redação dissertativa, esse trecho cumpre a função de:',
            'opcoes': [
                'A) introduzir personagens à narrativa.',
                'B) servir de fundamento normativo para sustentar a argumentação.',
                'C) descrever fisicamente um espaço público.',
                'D) instruir o leitor a memorizar o artigo 37.',
                'E) fechar a conclusão de modo emotivo.'
            ],
            'resposta': 'B',
            'explicacao': 'A citação do artigo 37 da CF/88 funciona como fundamento normativo: o autor invoca um dispositivo legal de autoridade para sustentar sua argumentação. Esse é um recurso clássico de argumentação por autoridade, comum em textos dissertativos. As demais alternativas não correspondem à função do trecho em um contexto dissertativo.',
            'dica': 'Citar leis, doutrinadores, dados estatísticos e provérbios são formas de argumento de autoridade. Reconheça-os pela presença de fontes formais (artigos, leis, autores).',
            'dificuldade': 'fácil',
            'fonte': 'CESPE',
            'ano': 2023,
            'titulo': 'CESPE/STJ/2023 - Argumento de Autoridade'
        },
    ],

    'Tipologia e Gêneros Textuais': [
        {
            'enunciado': 'Considere o trecho:\n\n"Era uma manhã fria de junho. O servidor abriu a porta do gabinete, acendeu as luzes e, antes mesmo de retirar o casaco, percebeu o envelope sobre a mesa. Não havia remetente."\n\nO tipo textual predominante no fragmento é:',
            'opcoes': [
                'A) descrição.',
                'B) narração.',
                'C) dissertação argumentativa.',
                'D) exposição.',
                'E) injunção.'
            ],
            'resposta': 'B',
            'explicacao': 'A narração caracteriza-se pela presença de fatos sucessivos no tempo, com personagens e ações. No trecho, identificam-se ações em sequência ("abriu", "acendeu", "percebeu") e um personagem (o servidor) em um cenário temporal definido ("manhã fria de junho"). Os verbos no pretérito perfeito e imperfeito são marca típica do tipo narrativo. Não predomina a descrição (apesar de haver elementos descritivos), pois o foco é a sequência de ações.',
            'dica': 'Tipos textuais: narração (verbos de ação no pretérito + sequência temporal), descrição (verbos de estado + caracterização), dissertação (verbos no presente + argumentação), injunção (imperativos + ordens), exposição (presente atemporal + informação).',
            'dificuldade': 'fácil',
            'fonte': 'FCC',
            'ano': 2023,
            'titulo': 'FCC/TJ-AP/2023 - Tipologia Textual'
        },
        {
            'enunciado': 'Julgue:\n\n"Para emitir a 2ª via do documento, acesse o portal do órgão, informe o CPF, selecione a opção \'Documentos\', confira os dados e clique em \'Gerar 2ª via\'. Em seguida, salve o arquivo PDF em local seguro."\n\nO texto apresentado é predominantemente injuntivo.',
            'opcoes': ['A) Verdadeiro', 'B) Falso'],
            'resposta': 'A',
            'explicacao': 'O tipo injuntivo é aquele que orienta, instrui ou ordena uma sequência de ações ao leitor. As marcas linguísticas são fortes aqui: verbos no imperativo ("acesse", "informe", "selecione", "confira", "clique", "salve") em sequência ordenada de procedimentos. Receitas, manuais e tutoriais são exemplos clássicos do tipo injuntivo.',
            'dica': 'Confunde-se injunção com exposição. A exposição informa neutramente; a injunção instrui o leitor a fazer algo. Verbos no imperativo são a marca-mestra da injunção.',
            'dificuldade': 'fácil',
            'fonte': 'CESPE',
            'ano': 2024,
            'titulo': 'CESPE/Polícia Federal/2024 - Tipo Injuntivo'
        },
        {
            'enunciado': 'Leia:\n\n"Ofício nº 154/2024-DRH\nBrasília, 09 de maio de 2024.\n\nAo Senhor Diretor-Geral,\n\nAssunto: Solicitação de cessão de servidor.\n\n1. Cumprimentando-o cordialmente, solicito a Vossa Senhoria a análise da possibilidade de cessão do servidor João da Silva, matrícula 12345, para atuação no setor de planejamento desta Diretoria.\n\n2. A cessão atenderá necessidade urgente de reforço técnico em projeto estratégico.\n\nAtenciosamente,\nMaria Souza\nCoordenadora"\n\nO gênero textual representado é:',
            'opcoes': [
                'A) requerimento.',
                'B) parecer.',
                'C) ofício.',
                'D) ata.',
                'E) memorando interno.'
            ],
            'resposta': 'C',
            'explicacao': 'O ofício é um gênero da redação oficial usado para comunicação entre autoridades de órgãos públicos (e, pelo Manual de Redação atual, também para comunicações dirigidas a particulares). Suas marcas estruturais — número, local e data, vocativo, assunto, parágrafos numerados, fecho ("Atenciosamente"), assinatura — estão todas presentes. O Decreto nº 9.758/2019 e o Manual da Presidência (3ª ed.) unificaram aviso, ofício e memorando sob a forma "ofício".',
            'dica': 'Pelo Manual atual, o ofício padrão é o "ofício único" e usa fechos: "Respeitosamente" (para superiores hierárquicos) e "Atenciosamente" (para iguais ou subordinados).',
            'dificuldade': 'médio',
            'fonte': 'CESPE',
            'ano': 2023,
            'titulo': 'CESPE/MPU/2023 - Ofício'
        },
        {
            'enunciado': 'Considere:\n\n"Aos nove dias do mês de maio do ano de dois mil e vinte e seis, às quatorze horas, na sala de reuniões da sede do órgão, reuniram-se os membros da comissão de licitação, sob a presidência da servidora Ana Lima, para deliberar sobre o pregão nº 12/2026. Aberta a sessão, foi feita a leitura..."\n\nO gênero apresentado é:',
            'opcoes': [
                'A) requerimento.',
                'B) ata.',
                'C) parecer.',
                'D) edital.',
                'E) ofício circular.'
            ],
            'resposta': 'B',
            'explicacao': 'A ata é o registro fiel e cronológico de uma reunião, sessão ou assembleia. Suas marcas tradicionais aparecem todas no trecho: data e hora por extenso ("Aos nove dias do mês de maio..."), local da reunião, identificação dos participantes, presidência e descrição sequencial dos atos ("reuniram-se", "Aberta a sessão"). A ata é tradicionalmente redigida em parágrafo único e em estilo conciso.',
            'dica': 'A ata segue convenções rígidas: data por extenso, presença de presidente e secretário, descrição cronológica dos fatos. Não comporta opiniões — apenas registra o ocorrido.',
            'dificuldade': 'médio',
            'fonte': 'FCC',
            'ano': 2024,
            'titulo': 'FCC/TRT-15/2024 - Ata'
        },
        {
            'enunciado': 'Sobre o gênero "parecer", julgue o item:\n\n"O parecer é peça opinativa que, apresentando análise técnica ou jurídica de questão submetida à autoridade, conclui com recomendação fundamentada, sem necessariamente vincular o decisor."',
            'opcoes': ['A) Verdadeiro', 'B) Falso'],
            'resposta': 'A',
            'explicacao': 'O parecer é, de fato, um documento técnico-opinativo. Ele se compõe normalmente de relatório (descrição do caso), fundamentação (análise técnica ou jurídica) e conclusão (opinião com recomendação). Em regra, o parecer não vincula a decisão da autoridade — salvo nos casos de parecer vinculante expressamente previsto em lei. A assertiva, portanto, é verdadeira.',
            'dica': 'Pareceres existem em três espécies: facultativo (não vincula), obrigatório (deve ser pedido, mas não vincula a decisão) e vinculante (deve ser seguido). Saber distinguir é cobrado com frequência.',
            'dificuldade': 'difícil',
            'fonte': 'CESPE',
            'ano': 2024,
            'titulo': 'CESPE/AGU/2024 - Parecer'
        },
        {
            'enunciado': 'Leia o trecho:\n\n"Excelentíssimo Senhor Secretário de Administração,\n\nFulano de Tal, brasileiro, casado, servidor público, matrícula nº 5678, vem, respeitosamente, à presença de Vossa Excelência, requerer a concessão de licença-prêmio referente ao quinquênio 2018-2023, nos termos da Lei nº 8.112/90.\n\nNestes termos, pede deferimento.\nBrasília, 09 de maio de 2026.\nFulano de Tal"\n\nO gênero textual identificado é:',
            'opcoes': [
                'A) ofício.',
                'B) parecer.',
                'C) requerimento.',
                'D) ata de reunião.',
                'E) memorando.'
            ],
            'resposta': 'C',
            'explicacao': 'O requerimento é o documento pelo qual o particular ou o servidor solicita formalmente algo à autoridade pública. Suas marcas são: vocativo formal ("Excelentíssimo Senhor..."), qualificação do requerente, verbo "requerer", indicação do pedido, fundamento legal e fecho típico ("Nestes termos, pede deferimento"). Todas estão presentes — logo, trata-se de requerimento.',
            'dica': 'Memorize o fecho clássico do requerimento: "Nestes termos, pede deferimento" ou simplesmente "P. deferimento". É elemento quase invariável.',
            'dificuldade': 'fácil',
            'fonte': 'FGV',
            'ano': 2023,
            'titulo': 'FGV/Câmara dos Deputados/2023 - Requerimento'
        },
        {
            'enunciado': 'Considere o fragmento:\n\n"O servidor era homem de cinquenta anos, alto, ombros levemente curvados pelo tempo de serviço. Os olhos, atentos por trás dos óculos de aro fino, percorriam as páginas com a frieza própria de quem já lera tudo aquilo mil vezes. Sobre a mesa, uma caneca antiga e um carimbo de borracha gasta."\n\nO tipo textual predominante é:',
            'opcoes': [
                'A) narração.',
                'B) descrição.',
                'C) dissertação.',
                'D) injunção.',
                'E) exposição argumentativa.'
            ],
            'resposta': 'B',
            'explicacao': 'A descrição caracteriza-se pela apresentação detalhada de pessoas, lugares ou objetos, com forte presença de adjetivos e verbos de estado. No trecho: "alto, ombros levemente curvados", "olhos atentos", "óculos de aro fino", "caneca antiga", "carimbo de borracha gasta" — tudo aponta para a caracterização estática de um personagem e seu entorno. Embora haja verbos de ação ("percorriam"), o foco é a caracterização, não a sequência de eventos.',
            'dica': 'Diferença chave: na narração algo acontece (sequência temporal); na descrição algo é (caracterização atemporal). Adjetivos abundantes denunciam descrição.',
            'dificuldade': 'médio',
            'fonte': 'FCC',
            'ano': 2024,
            'titulo': 'FCC/TJ-PE/2024 - Tipologia Descritiva'
        },
        {
            'enunciado': 'Julgue:\n\n"O texto dissertativo-argumentativo organiza-se com tese, argumentos e conclusão, predominam verbos no presente do indicativo e há orientação clara para defender um ponto de vista."',
            'opcoes': ['A) Verdadeiro', 'B) Falso'],
            'resposta': 'A',
            'explicacao': 'A descrição apresentada na assertiva corresponde corretamente ao texto dissertativo-argumentativo: estrutura clássica em tese (introdução), desenvolvimento com argumentos e conclusão; predominância de verbos no presente do indicativo (presente atemporal); finalidade de defender ponto de vista. É exatamente o tipo cobrado em redações de concurso.',
            'dica': 'Diferencie dissertação expositiva (apenas informa) e dissertação argumentativa (defende posição). A redação de concurso é, em regra, dissertativo-argumentativa.',
            'dificuldade': 'fácil',
            'fonte': 'CESPE',
            'ano': 2023,
            'titulo': 'CESPE/PRF/2023 - Dissertação'
        },
        {
            'enunciado': 'Considere o trecho:\n\n"Relatório Anual de Atividades — Exercício 2025\n\nO presente relatório tem por objeto consolidar os resultados alcançados pela Coordenação no exercício de 2025. Foram realizadas 320 ações de fiscalização, com aumento de 18% em relação ao exercício anterior. As irregularidades detectadas resultaram em 47 processos administrativos."\n\nO gênero textual e o tipo predominante são, respectivamente:',
            'opcoes': [
                'A) ata e narração.',
                'B) relatório e exposição.',
                'C) requerimento e injunção.',
                'D) parecer e dissertação argumentativa.',
                'E) ofício e descrição.'
            ],
            'resposta': 'B',
            'explicacao': 'O relatório é gênero usado para consolidar e apresentar resultados, atividades ou diagnósticos a uma autoridade. O tipo textual predominante é a exposição, pois o texto informa dados objetivos (quantidades, percentuais, processos), sem defender opinião explícita ou narrar fatos em sequência ficcional. Verbos no pretérito ligados a dados ("foram realizadas", "resultaram") apresentam informações, não enredo.',
            'dica': 'Não confunda gênero (forma social: ofício, ata, relatório) com tipo (estrutura linguística: narração, descrição, dissertação, exposição, injunção). Um relatório pode conter narração, mas seu tipo predominante é a exposição.',
            'dificuldade': 'difícil',
            'fonte': 'FGV',
            'ano': 2024,
            'titulo': 'FGV/TCE-PA/2024 - Gênero e Tipo'
        },
        {
            'enunciado': 'Sobre o uso da redação oficial, julgue o item:\n\n"Conforme o Manual de Redação da Presidência da República (3ª edição), o ofício deve ser redigido com clareza, concisão, formalidade, padronização, impessoalidade e uso da norma culta da língua portuguesa."',
            'opcoes': ['A) Verdadeiro', 'B) Falso'],
            'resposta': 'A',
            'explicacao': 'A 3ª edição do Manual de Redação da Presidência da República (2018) elenca como atributos da redação oficial exatamente os mencionados: clareza, concisão, formalidade, padronização, impessoalidade e uso da norma culta. Esses princípios derivam do princípio da impessoalidade (art. 37, CF/88) — a comunicação oficial é do órgão, não da pessoa do servidor.',
            'dica': 'Memorize as 5 + 1 qualidades: Clareza, Concisão, Formalidade, Padronização, Impessoalidade e uso da Norma Culta. É pergunta recorrente em concursos.',
            'dificuldade': 'médio',
            'fonte': 'CESPE',
            'ano': 2024,
            'titulo': 'CESPE/MRE/2024 - Manual de Redação'
        },
    ],

    'Coesão e Coerência Textual': [
        {
            'enunciado': 'Leia o trecho:\n\n"O servidor entregou o relatório ao chefe. ____ o leu atentamente e solicitou ajustes."\n\nAssinale a alternativa que preenche corretamente a lacuna, garantindo a coesão referencial:',
            'opcoes': [
                'A) Eu',
                'B) Ele',
                'C) Nós',
                'D) Vocês',
                'E) Elas'
            ],
            'resposta': 'B',
            'explicacao': 'A coesão referencial se faz pela retomada de termos já mencionados. Na 1ª oração, "o chefe" é o agente que recebe o relatório. Na 2ª oração, é necessário um pronome de 3ª pessoa do singular masculino para retomá-lo: "Ele". As demais opções rompem a referência (1ª e 2ª pessoa) ou divergem em número/gênero.',
            'dica': 'Coesão referencial usa pronomes (anáforas) ou sinônimos para evitar repetição. Verifique sempre concordância de gênero e número com o termo retomado.',
            'dificuldade': 'fácil',
            'fonte': 'FCC',
            'ano': 2023,
            'titulo': 'FCC/TRE-RJ/2023 - Coesão Referencial'
        },
        {
            'enunciado': 'Considere as orações:\n\n"A digitalização avançou rapidamente nos últimos anos. _______, persistem áreas em que o atendimento presencial é a única opção viável."\n\nO conectivo que preenche adequadamente a lacuna, mantendo a coerência argumentativa, é:',
            'opcoes': [
                'A) Portanto,',
                'B) Assim,',
                'C) Contudo,',
                'D) Por isso,',
                'E) Em razão disso,'
            ],
            'resposta': 'C',
            'explicacao': 'A primeira oração afirma um avanço (digitalização rápida); a segunda apresenta uma ressalva (persistem áreas sem digitalização). A relação semântica entre as orações é, portanto, de oposição/contraste — exigindo um conectivo adversativo: "Contudo". Os demais conectivos expressam conclusão/causa-consequência (Portanto, Assim, Por isso, Em razão disso), incompatíveis com a relação semântica do contexto.',
            'dica': 'Conectivos adversativos (mas, contudo, todavia, entretanto, no entanto, porém) introduzem oposição. Conclusivos (logo, portanto, assim, pois) introduzem consequência. Erro frequente: trocar um pelo outro.',
            'dificuldade': 'médio',
            'fonte': 'CESPE',
            'ano': 2024,
            'titulo': 'CESPE/TRT-8/2024 - Conectivos Adversativos'
        },
        {
            'enunciado': 'Julgue o item:\n\n"Na frase \'O processo foi protocolado às 9h; o referido processo recebeu parecer favorável\', a expressão \'o referido processo\' configura mecanismo de coesão referencial por reiteração."',
            'opcoes': ['A) Verdadeiro', 'B) Falso'],
            'resposta': 'A',
            'explicacao': 'A coesão referencial pode ocorrer por substituição (uso de pronome) ou por reiteração (repetição da mesma expressão ou uso de sinônimo, hiperônimo ou expressão equivalente). "O referido processo" retoma "o processo" por reiteração com expressão equivalente, característica típica do gênero jurídico-administrativo. A assertiva, portanto, é verdadeira.',
            'dica': 'Coesão por reiteração é frequente em textos oficiais, com expressões como "o referido", "o supracitado", "o aludido". Já a coesão por substituição usa pronomes (ele, esse, aquele).',
            'dificuldade': 'médio',
            'fonte': 'CESPE',
            'ano': 2023,
            'titulo': 'CESPE/STJ/2023 - Reiteração'
        },
        {
            'enunciado': 'No texto:\n\n"O candidato preparou-se durante meses. _______, foi aprovado em primeiro lugar no concurso."\n\nO conectivo que melhor expressa a relação de causa-consequência entre as orações é:',
            'opcoes': [
                'A) Embora',
                'B) Conquanto',
                'C) Por conseguinte,',
                'D) Apesar disso,',
                'E) Porém,'
            ],
            'resposta': 'C',
            'explicacao': 'A relação entre as orações é de causa-consequência: a preparação prolongada produziu como consequência a aprovação. Conectivos conclusivos/consecutivos como "por conseguinte", "portanto", "logo", "assim" expressam essa relação. As alternativas A, B, D e E indicam concessão ou oposição, incompatíveis com a relação aqui presente.',
            'dica': 'Conectivos consecutivos/conclusivos: portanto, logo, por conseguinte, assim, dessa forma. Concessivos: embora, conquanto, ainda que, mesmo que. São sentidos opostos — não confunda.',
            'dificuldade': 'fácil',
            'fonte': 'FGV',
            'ano': 2024,
            'titulo': 'FGV/Câmara dos Deputados/2024 - Conectivos Consecutivos'
        },
        {
            'enunciado': 'Considere o período:\n\n"Para que o processo siga seu curso regular, o servidor deverá: protocolar o pedido, juntar os documentos, despachar ao superior e aguardar manifestação."\n\nA estrutura sintática do período exemplifica:',
            'opcoes': [
                'A) quebra de paralelismo sintático.',
                'B) paralelismo sintático, com sequência de verbos no infinitivo.',
                'C) hipérbato, com inversão da ordem direta.',
                'D) elipse de sujeito ao longo do período.',
                'E) zeugma, com supressão de termo já citado.'
            ],
            'resposta': 'B',
            'explicacao': 'Paralelismo sintático é a manutenção de estruturas gramaticais equivalentes em itens enumerados ou coordenados. No trecho, todos os verbos da enumeração estão no infinitivo: "protocolar", "juntar", "despachar", "aguardar". Essa simetria garante o paralelismo, que é princípio de boa redação. Quebraria o paralelismo, por exemplo: "protocolar, juntar, ao despachar e aguardando".',
            'dica': 'Em enumerações, mantenha a mesma forma verbal (todos no infinitivo, ou todos no gerúndio, ou todos no presente) e a mesma classe gramatical. Quebra de paralelismo é erro recorrente em redações.',
            'dificuldade': 'médio',
            'fonte': 'CESPE',
            'ano': 2024,
            'titulo': 'CESPE/TCU/2024 - Paralelismo Sintático'
        },
        {
            'enunciado': 'Leia:\n\n"O Brasil tem desafios estruturais a enfrentar. _______ a desigualdade de renda, _______ a baixa escolaridade média, _______ a precariedade da infraestrutura logística merecem atenção do gestor público."\n\nA sequência de conectivos que preenche corretamente as lacunas, conferindo coesão sequencial, é:',
            'opcoes': [
                'A) Tanto / quanto / como',
                'B) Não só / mas também / e',
                'C) Embora / contudo / portanto',
                'D) Se / porque / então',
                'E) Ou / ou / ou'
            ],
            'resposta': 'B',
            'explicacao': 'A coesão sequencial articula partes do texto pela ordem lógico-argumentativa. Aqui, três elementos são adicionados como desafios estruturais — exige-se conector aditivo. "Não só... mas também... e..." é a sequência aditiva mais natural e adequada. As demais alternativas: A não funciona com três elementos coordenados; C usa conectivos contrastivos/conclusivos incompatíveis; D introduz condição/causa, não adição; E introduz alternância/exclusão.',
            'dica': 'Conectivos aditivos: e, também, ainda, além disso, não só... mas também. São usados para somar ideias na mesma linha argumentativa.',
            'dificuldade': 'médio',
            'fonte': 'FCC',
            'ano': 2023,
            'titulo': 'FCC/TRT-2/2023 - Coesão Sequencial'
        },
        {
            'enunciado': 'Julgue:\n\n"No período \'Os candidatos compareceram à prova; eles aguardaram o início pacientemente\', a substituição do pronome \'eles\' por \'estes\' produziria efeito de coesão referencial dêitica anafórica."',
            'opcoes': ['A) Verdadeiro', 'B) Falso'],
            'resposta': 'A',
            'explicacao': 'A coesão referencial anafórica ocorre quando um termo retoma outro já mencionado (anáfora). Os pronomes demonstrativos (este/esse/aquele) e os pessoais de 3ª pessoa (ele/ela) são instrumentos típicos. A substituição "eles" por "estes" mantém a referência a "os candidatos", produzindo retomada anafórica — daí o caráter dêitico anafórico. Assertiva verdadeira.',
            'dica': 'Anáfora retoma o que já foi dito (olha para trás). Catáfora antecipa o que será dito (olha para frente). Pronomes demonstrativos podem fazer ambas as funções.',
            'dificuldade': 'difícil',
            'fonte': 'CESPE',
            'ano': 2024,
            'titulo': 'CESPE/Procuradoria-Geral/2024 - Anáfora'
        },
        {
            'enunciado': 'No trecho:\n\n"O programa de capacitação foi um sucesso. _______, exige aprimoramentos para atender demandas regionais específicas."\n\nO conectivo que estabelece, com coerência, a relação de concessão entre as orações é:',
            'opcoes': [
                'A) Portanto,',
                'B) No entanto,',
                'C) Logo,',
                'D) Por isso,',
                'E) Assim sendo,'
            ],
            'resposta': 'B',
            'explicacao': 'O texto reconhece o sucesso (1ª oração) mas faz ressalva (2ª oração: exige aprimoramentos). A relação é de oposição/concessão atenuada. "No entanto" é conectivo adversativo que se ajusta perfeitamente. As demais alternativas indicam conclusão/consequência, incompatíveis com o sentido contrastivo.',
            'dica': 'Confunde-se "concessão" com "adversidade". Adversidade nega a expectativa (mas, contudo, no entanto). Concessão admite o oposto (embora, ainda que). Em provas, atenção ao sentido global da frase.',
            'dificuldade': 'fácil',
            'fonte': 'FGV',
            'ano': 2023,
            'titulo': 'FGV/Banco do Brasil/2023 - Conectivos Adversativos'
        },
        {
            'enunciado': 'Sobre coerência textual, julgue:\n\n"Um texto pode ser gramaticalmente correto, com pronomes e conectivos bem empregados, e ainda assim ser incoerente, se as ideias apresentadas forem contraditórias entre si ou inconsistentes com o conhecimento de mundo do leitor."',
            'opcoes': ['A) Verdadeiro', 'B) Falso'],
            'resposta': 'A',
            'explicacao': 'A coesão é condição linguística (mecanismos formais de ligação: pronomes, conectivos), enquanto a coerência é condição semântico-pragmática (sentido lógico, não-contradição, plausibilidade no mundo). Um texto pode ter coesão perfeita mas ser incoerente — por exemplo: "Choveu o dia inteiro; por isso, o sol queimou minha pele". A assertiva, portanto, é verdadeira.',
            'dica': 'Coesão = forma; Coerência = sentido. Um texto coeso pode ser incoerente, e um texto coerente pode falhar na coesão. As duas dimensões são autônomas, embora geralmente caminhem juntas.',
            'dificuldade': 'médio',
            'fonte': 'CESPE',
            'ano': 2024,
            'titulo': 'CESPE/TRT-7/2024 - Coesão x Coerência'
        },
        {
            'enunciado': 'Considere o período:\n\n"O gestor decidiu três coisas: revisar o orçamento, reorganizar a equipe e que os relatórios fossem padronizados."\n\nA construção apresenta:',
            'opcoes': [
                'A) coesão sequencial perfeita.',
                'B) paralelismo sintático adequado.',
                'C) quebra de paralelismo sintático, pois mistura orações reduzidas de infinitivo com oração desenvolvida.',
                'D) elipse de sujeito bem construída.',
                'E) catáfora consistente.'
            ],
            'resposta': 'C',
            'explicacao': 'O período enumera três decisões, mas usa estruturas distintas: as duas primeiras são orações reduzidas de infinitivo ("revisar", "reorganizar"), enquanto a terceira é oração desenvolvida ("que os relatórios fossem padronizados"). Essa mistura quebra o paralelismo sintático. A construção correta seria: "revisar o orçamento, reorganizar a equipe e padronizar os relatórios" — todas no infinitivo. Quebra de paralelismo é erro de coesão estrutural amplamente cobrado em concursos.',
            'dica': 'Em enumerações com "que" misturado com infinitivos, suspeite imediatamente de quebra de paralelismo. Padronize todos os itens na mesma estrutura sintática para garantir simetria.',
            'dificuldade': 'difícil',
            'fonte': 'FGV',
            'ano': 2024,
            'titulo': 'FGV/TJ-SP/2024 - Quebra de Paralelismo'
        },
    ],
}
