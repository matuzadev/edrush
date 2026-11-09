"""
Raciocínio Lógico — Tabelas-Verdade, Equivalências e Argumentos
30 questões cobrindo 3 capítulos
"""

CAPITULOS = [
    {
        'numero': 2,
        'titulo': 'Tabelas-Verdade e Tautologias',
        'descricao': 'Construção de tabelas-verdade para conjunção, disjunção, condicional e bicondicional. Identificação de tautologias, contradições e contingências.'
    },
    {
        'numero': 3,
        'titulo': 'Equivalências e Implicações Lógicas',
        'descricao': 'Leis de De Morgan, contrapositiva, negação de proposições compostas e equivalências fundamentais da condicional (p→q ≡ ¬p∨q ≡ ¬q→¬p).'
    },
    {
        'numero': 4,
        'titulo': 'Silogismos e Argumentos',
        'descricao': 'Estrutura de premissas e conclusão, silogismos categóricos, validade de argumentos, falácias formais e diagramas de Venn.'
    },
]

QUESTOES = {
    'Tabelas-Verdade e Tautologias': [
        {
            'enunciado': 'Considerando as proposições simples p e q, a tabela-verdade da proposição composta (p ∧ q) → p apresenta, na coluna do resultado final, a seguinte sequência de valores lógicos (de cima para baixo, considerando as linhas VV, VF, FV, FF para p e q):',
            'opcoes': ['A) V, V, V, V', 'B) V, F, V, F', 'C) V, V, F, F', 'D) F, F, F, F', 'E) V, F, F, V'],
            'resposta': 'A',
            'explicacao': 'Passo 1: Construímos a tabela com as 4 linhas possíveis. Linha 1: p=V, q=V → p∧q=V → V→V = V. Passo 2: Linha 2: p=V, q=F → p∧q=F → F→V = V. Passo 3: Linha 3: p=F, q=V → p∧q=F → F→F = V. Passo 4: Linha 4: p=F, q=F → p∧q=F → F→F = V. Conclusão: a coluna final é VVVV, ou seja, a proposição é uma TAUTOLOGIA.',
            'dica': 'Toda condicional cujo consequente é uma das premissas do antecedente conjuntivo é tautologia (regra da simplificação: p∧q → p sempre vale).',
            'dificuldade': 'fácil',
            'fonte': 'CESPE',
            'ano': 2023,
            'titulo': 'CESPE/PCF/2023 - Tabela-Verdade Tautologia'
        },
        {
            'enunciado': 'A proposição composta (p ∨ q) ∧ (¬p ∧ ¬q) é classificada como:',
            'opcoes': ['A) Tautologia', 'B) Contradição', 'C) Contingência', 'D) Equivalência lógica', 'E) Bicondicional verdadeira'],
            'resposta': 'B',
            'explicacao': 'Passo 1: Note que (¬p ∧ ¬q) é, pela Lei de De Morgan, equivalente a ¬(p ∨ q). Passo 2: Substituindo, temos (p ∨ q) ∧ ¬(p ∨ q). Passo 3: Toda proposição da forma A ∧ ¬A é sempre falsa. Conclusão: a tabela apresenta F em todas as linhas — trata-se de uma CONTRADIÇÃO.',
            'dica': 'A ∧ ¬A é sempre contradição; A ∨ ¬A é sempre tautologia (princípio do terceiro excluído).',
            'dificuldade': 'fácil',
            'fonte': 'FCC',
            'ano': 2022,
            'titulo': 'FCC/TRT/2022 - Contradição'
        },
        {
            'enunciado': 'Quantas linhas possui a tabela-verdade de uma proposição composta formada por 4 proposições simples distintas (p, q, r, s)?',
            'opcoes': ['A) 8', 'B) 12', 'C) 16', 'D) 24', 'E) 32'],
            'resposta': 'C',
            'explicacao': 'Passo 1: O número de linhas de uma tabela-verdade é dado por 2^n, onde n é o número de proposições simples distintas. Passo 2: Com n = 4, temos 2^4. Passo 3: 2^4 = 16. Conclusão: a tabela tem 16 linhas.',
            'dica': 'Memorize: 1 prop = 2 linhas, 2 = 4, 3 = 8, 4 = 16, 5 = 32. Sempre 2 elevado ao número de proposições.',
            'dificuldade': 'fácil',
            'fonte': 'FGV',
            'ano': 2024,
            'titulo': 'FGV/SEFAZ/2024 - Linhas da Tabela-Verdade'
        },
        {
            'enunciado': 'Sejam p e q proposições simples. A proposição p ↔ q é VERDADEIRA quando:',
            'opcoes': ['A) Apenas quando ambas são verdadeiras', 'B) Apenas quando ambas são falsas', 'C) Quando ambas têm o mesmo valor lógico', 'D) Quando têm valores lógicos diferentes', 'E) Sempre, independentemente dos valores'],
            'resposta': 'C',
            'explicacao': 'Passo 1: A bicondicional p ↔ q é verdadeira quando p e q possuem o MESMO valor lógico (ambos V ou ambos F). Passo 2: VV → V; FF → V; VF → F; FV → F. Conclusão: a alternativa C está correta, pois engloba os dois casos em que p ↔ q é verdadeira.',
            'dica': 'Bicondicional = "se e somente se" = igualdade lógica. Pense em "=": só é V quando os dois lados são iguais.',
            'dificuldade': 'fácil',
            'fonte': 'CESPE',
            'ano': 2023,
            'titulo': 'CESPE/TRF/2023 - Bicondicional'
        },
        {
            'enunciado': 'Julgue o item: A proposição (p → q) ∨ (q → p) é uma tautologia.',
            'opcoes': ['A) Verdadeiro', 'B) Falso'],
            'resposta': 'A',
            'explicacao': 'Passo 1: Construímos a tabela. Caso p=V, q=V: (V→V) ∨ (V→V) = V ∨ V = V. Passo 2: p=V, q=F: (V→F) ∨ (F→V) = F ∨ V = V. Passo 3: p=F, q=V: (F→V) ∨ (V→F) = V ∨ F = V. Passo 4: p=F, q=F: (F→F) ∨ (F→F) = V ∨ V = V. Conclusão: VVVV — é TAUTOLOGIA. Item VERDADEIRO.',
            'dica': 'Em uma disjunção de condicionais com p e q, sempre que uma falhar, a outra se inverte e vale — por isso é tautologia.',
            'dificuldade': 'médio',
            'fonte': 'CESPE',
            'ano': 2023,
            'titulo': 'CESPE/MPU/2023 - Tautologia em Disjunção'
        },
        {
            'enunciado': 'Considere a proposição: "Se chove, então a rua fica molhada". Atribuindo p = "chove" e q = "a rua fica molhada", em qual das situações abaixo a condicional p → q é FALSA?',
            'opcoes': ['A) Chove e a rua fica molhada', 'B) Chove e a rua não fica molhada', 'C) Não chove e a rua fica molhada', 'D) Não chove e a rua não fica molhada', 'E) Em nenhuma situação a condicional é falsa'],
            'resposta': 'B',
            'explicacao': 'Passo 1: A condicional p → q é falsa apenas quando p é V e q é F (antecedente verdadeiro com consequente falso). Passo 2: A alternativa B descreve exatamente essa situação: chove (p=V) e a rua não fica molhada (q=F). Conclusão: B é a resposta correta.',
            'dica': '"Promessa só é quebrada quando a condição se cumpre e o resultado prometido falha". V→F é o único caso falso da condicional.',
            'dificuldade': 'fácil',
            'fonte': 'FCC',
            'ano': 2022,
            'titulo': 'FCC/TRE/2022 - Condicional Falsa'
        },
        {
            'enunciado': 'A proposição [(p → q) ∧ p] → q é classificada como:',
            'opcoes': ['A) Contradição', 'B) Contingência', 'C) Tautologia', 'D) Equivalência da disjunção exclusiva', 'E) Falácia'],
            'resposta': 'C',
            'explicacao': 'Passo 1: Esta é a regra clássica do MODUS PONENS. Passo 2: Construindo a tabela: p=V, q=V: (V∧V)→V = V→V = V. Passo 3: p=V, q=F: (F∧V)→F = F→F = V. Passo 4: p=F, q=V: (V∧F)→V = F→V = V. Passo 5: p=F, q=F: (V∧F)→F = F→F = V. Conclusão: VVVV — TAUTOLOGIA.',
            'dica': 'Modus Ponens: "Se p→q é verdade e p é verdade, então q é verdade". É a base da dedução lógica e sempre tautologia.',
            'dificuldade': 'médio',
            'fonte': 'FGV',
            'ano': 2023,
            'titulo': 'FGV/TJ/2023 - Modus Ponens'
        },
        {
            'enunciado': 'Considere as proposições p, q e r. Sabendo que p é V, q é F e r é V, qual o valor lógico da proposição (p ∧ ¬q) → (r ∨ q)?',
            'opcoes': ['A) Verdadeiro', 'B) Falso', 'C) Indeterminado', 'D) Contradição', 'E) Depende de outra variável'],
            'resposta': 'A',
            'explicacao': 'Passo 1: Calculamos ¬q = ¬F = V. Passo 2: p ∧ ¬q = V ∧ V = V. Passo 3: r ∨ q = V ∨ F = V. Passo 4: V → V = V. Conclusão: o valor lógico final é VERDADEIRO.',
            'dica': 'Resolva por etapas: primeiro as negações, depois conjunções/disjunções, por último os condicionais.',
            'dificuldade': 'médio',
            'fonte': 'CESPE',
            'ano': 2024,
            'titulo': 'CESPE/PRF/2024 - Valor Lógico'
        },
        {
            'enunciado': 'Julgue o item: A proposição (p ∧ ¬p) ↔ (q ∨ ¬q) é uma tautologia.',
            'opcoes': ['A) Verdadeiro', 'B) Falso'],
            'resposta': 'B',
            'explicacao': 'Passo 1: (p ∧ ¬p) é sempre F (contradição). Passo 2: (q ∨ ¬q) é sempre V (tautologia). Passo 3: A bicondicional fica F ↔ V em todas as linhas. Passo 4: F ↔ V = F. Conclusão: a proposição é FALSA em todas as linhas, ou seja, uma CONTRADIÇÃO, não tautologia. Item FALSO.',
            'dica': 'Bicondicional entre uma contradição e uma tautologia é SEMPRE contradição (valores opostos sempre).',
            'dificuldade': 'difícil',
            'fonte': 'CESPE',
            'ano': 2024,
            'titulo': 'CESPE/TCU/2024 - Bicondicional Contradição'
        },
        {
            'enunciado': 'A proposição "(p → q) ∧ (p → ¬q)" é equivalente a:',
            'opcoes': ['A) p', 'B) ¬p', 'C) q ∧ ¬q', 'D) Tautologia', 'E) p ↔ q'],
            'resposta': 'B',
            'explicacao': 'Passo 1: Para que ambas condicionais sejam verdadeiras simultaneamente com p=V, precisaríamos q=V e q=F, o que é impossível. Passo 2: Portanto, p deve ser falso (F→qualquer coisa = V). Passo 3: Quando p=F, ambas as condicionais são V, e a conjunção é V. Passo 4: Quando p=V, pelo menos uma é F, e a conjunção é F. Conclusão: a expressão é V se, e somente se, p é F, ou seja, equivale a ¬p.',
            'dica': 'Se de p decorrem duas conclusões contraditórias, então p tem que ser falso (Reductio ad absurdum).',
            'dificuldade': 'difícil',
            'fonte': 'FGV',
            'ano': 2024,
            'titulo': 'FGV/SEFAZ/2024 - Redução ao Absurdo'
        },
    ],
    'Equivalências e Implicações Lógicas': [
        {
            'enunciado': 'A negação da proposição "Estudo e passo no concurso" é logicamente equivalente a:',
            'opcoes': ['A) Não estudo e não passo no concurso', 'B) Não estudo ou não passo no concurso', 'C) Estudo e não passo no concurso', 'D) Se estudo, então passo no concurso', 'E) Não estudo, então não passo no concurso'],
            'resposta': 'B',
            'explicacao': 'Passo 1: A proposição original é uma conjunção: p ∧ q (p = "estudo", q = "passo"). Passo 2: Pela Lei de De Morgan: ¬(p ∧ q) ≡ ¬p ∨ ¬q. Passo 3: Traduzindo: "Não estudo OU não passo no concurso". Conclusão: alternativa B.',
            'dica': 'De Morgan da CONJUNÇÃO: nega cada parte e troca "e" por "ou". Mnemônico: "nega tudo e inverte o conectivo".',
            'dificuldade': 'fácil',
            'fonte': 'CESPE',
            'ano': 2022,
            'titulo': 'CESPE/PF/2022 - De Morgan Conjunção'
        },
        {
            'enunciado': 'A negação da proposição "João é médico ou Maria é advogada" é:',
            'opcoes': ['A) João não é médico ou Maria não é advogada', 'B) João é médico e Maria não é advogada', 'C) João não é médico e Maria não é advogada', 'D) Se João é médico, então Maria não é advogada', 'E) João não é médico, mas Maria é advogada'],
            'resposta': 'C',
            'explicacao': 'Passo 1: A original é disjunção: p ∨ q. Passo 2: Pela Lei de De Morgan: ¬(p ∨ q) ≡ ¬p ∧ ¬q. Passo 3: Traduzindo: "João não é médico E Maria não é advogada". Conclusão: alternativa C.',
            'dica': 'De Morgan da DISJUNÇÃO: nega cada parte e troca "ou" por "e". Pense: para negar "uma das duas", precisa negar AS DUAS.',
            'dificuldade': 'fácil',
            'fonte': 'FCC',
            'ano': 2023,
            'titulo': 'FCC/TJ/2023 - De Morgan Disjunção'
        },
        {
            'enunciado': 'A proposição "Se eu acordar cedo, então chegarei no horário" é logicamente equivalente, pela contrapositiva, a:',
            'opcoes': ['A) Se eu chegar no horário, então acordei cedo', 'B) Se eu não acordar cedo, então não chegarei no horário', 'C) Se eu não chegar no horário, então não acordei cedo', 'D) Acordo cedo e chego no horário', 'E) Não acordo cedo ou não chego no horário'],
            'resposta': 'C',
            'explicacao': 'Passo 1: A proposição é p → q (p = "acordar cedo", q = "chegar no horário"). Passo 2: A contrapositiva de p → q é ¬q → ¬p. Passo 3: Traduzindo: "Se eu não chegar no horário, então não acordei cedo". Conclusão: alternativa C.',
            'dica': 'Contrapositiva = nega o consequente, nega o antecedente E inverte a ordem. Mnemônico: "nega-nega-inverte".',
            'dificuldade': 'fácil',
            'fonte': 'FGV',
            'ano': 2023,
            'titulo': 'FGV/TJ/2023 - Contrapositiva'
        },
        {
            'enunciado': 'A proposição p → q é logicamente equivalente a:',
            'opcoes': ['A) p ∧ ¬q', 'B) ¬p ∧ q', 'C) ¬p ∨ q', 'D) p ∨ ¬q', 'E) p ↔ q'],
            'resposta': 'C',
            'explicacao': 'Passo 1: Pela equivalência fundamental da condicional: p → q ≡ ¬p ∨ q. Passo 2: Verificação pela tabela-verdade: p=V,q=V: ¬V∨V = F∨V = V. p=V,q=F: F∨F = F. p=F,q=V: V∨V = V. p=F,q=F: V∨F = V. Coincide com a tabela de p→q (VFVV). Conclusão: alternativa C.',
            'dica': 'p→q ≡ ¬p ∨ q. Mnemônico: "nega o primeiro, mantém o segundo, conecta com OU".',
            'dificuldade': 'fácil',
            'fonte': 'CESPE',
            'ano': 2024,
            'titulo': 'CESPE/MPU/2024 - Equivalência Condicional'
        },
        {
            'enunciado': 'A negação da proposição "Se faz sol, então vou à praia" é:',
            'opcoes': ['A) Se não faz sol, então não vou à praia', 'B) Se vou à praia, então faz sol', 'C) Faz sol e não vou à praia', 'D) Não faz sol ou vou à praia', 'E) Não faz sol e não vou à praia'],
            'resposta': 'C',
            'explicacao': 'Passo 1: Sendo p = "faz sol" e q = "vou à praia", a proposição é p → q. Passo 2: Como p → q ≡ ¬p ∨ q, sua negação é ¬(¬p ∨ q) ≡ p ∧ ¬q (De Morgan). Passo 3: Traduzindo: "Faz sol E não vou à praia". Conclusão: alternativa C.',
            'dica': 'Negar "Se A, então B" = "A E não B". Mnemônico: "mantém-mantém-nega-troca-por-E".',
            'dificuldade': 'médio',
            'fonte': 'CESPE',
            'ano': 2023,
            'titulo': 'CESPE/PRF/2023 - Negação da Condicional'
        },
        {
            'enunciado': 'Julgue o item: As proposições "Se Pedro estuda, ele passa" e "Se Pedro não passa, ele não estuda" são logicamente equivalentes.',
            'opcoes': ['A) Verdadeiro', 'B) Falso'],
            'resposta': 'A',
            'explicacao': 'Passo 1: A primeira proposição é p → q (p = "estuda", q = "passa"). Passo 2: A segunda é ¬q → ¬p, que é a CONTRAPOSITIVA de p → q. Passo 3: Sabemos que p → q ≡ ¬q → ¬p. Conclusão: as proposições são equivalentes. Item VERDADEIRO.',
            'dica': 'Toda condicional é equivalente à sua contrapositiva, mas NÃO à recíproca (q→p) nem à inversa (¬p→¬q).',
            'dificuldade': 'médio',
            'fonte': 'FCC',
            'ano': 2022,
            'titulo': 'FCC/TRT/2022 - Equivalência Contrapositiva'
        },
        {
            'enunciado': 'Considere a proposição: "Todo aluno que se dedica passa no concurso". A negação dessa proposição é:',
            'opcoes': ['A) Nenhum aluno que se dedica passa no concurso', 'B) Todo aluno que se dedica não passa no concurso', 'C) Existe pelo menos um aluno que se dedica e não passa no concurso', 'D) Todo aluno que não se dedica não passa no concurso', 'E) Algum aluno passa no concurso sem se dedicar'],
            'resposta': 'C',
            'explicacao': 'Passo 1: A proposição "Todo A é B" é uma proposição universal afirmativa: ∀x (A(x) → B(x)). Passo 2: A negação de uma universal é uma existencial particular negativa: ∃x (A(x) ∧ ¬B(x)). Passo 3: Traduzindo: "Existe pelo menos um aluno que se dedica E não passa no concurso". Conclusão: alternativa C.',
            'dica': 'Negar "TODO A é B" = "EXISTE pelo menos UM A que NÃO É B". Basta um contraexemplo para refutar uma universal.',
            'dificuldade': 'médio',
            'fonte': 'FGV',
            'ano': 2024,
            'titulo': 'FGV/TCE/2024 - Negação de Universal'
        },
        {
            'enunciado': 'A proposição "p ↔ q" NÃO é equivalente a qual das alternativas a seguir?',
            'opcoes': ['A) (p → q) ∧ (q → p)', 'B) (p ∧ q) ∨ (¬p ∧ ¬q)', 'C) (¬p ∨ q) ∧ (¬q ∨ p)', 'D) ¬(p ⊕ q) (negação do "ou exclusivo")', 'E) (p ∧ ¬q) ∨ (¬p ∧ q)'],
            'resposta': 'E',
            'explicacao': 'Passo 1: p ↔ q é V quando p e q têm o mesmo valor lógico. Passo 2: As alternativas A, B, C e D são todas equivalentes a p ↔ q (definição, expansão por casos, dupla condicional, e negação do XOR). Passo 3: A alternativa E, (p ∧ ¬q) ∨ (¬p ∧ q), é a definição do "OU EXCLUSIVO" (p ⊕ q), que é V quando p e q têm valores DIFERENTES — exatamente o oposto de p ↔ q. Conclusão: alternativa E.',
            'dica': 'p↔q é V quando "iguais"; p⊕q é V quando "diferentes". Um é negação do outro.',
            'dificuldade': 'difícil',
            'fonte': 'CESPE',
            'ano': 2024,
            'titulo': 'CESPE/TCU/2024 - Equivalência Bicondicional'
        },
        {
            'enunciado': 'Julgue o item: A proposição ¬(p → q) é logicamente equivalente a p ∧ ¬q.',
            'opcoes': ['A) Verdadeiro', 'B) Falso'],
            'resposta': 'A',
            'explicacao': 'Passo 1: Sabemos que p → q ≡ ¬p ∨ q. Passo 2: Aplicando a negação: ¬(p → q) ≡ ¬(¬p ∨ q). Passo 3: Pela Lei de De Morgan: ¬(¬p ∨ q) ≡ ¬¬p ∧ ¬q ≡ p ∧ ¬q. Conclusão: a equivalência é VERDADEIRA.',
            'dica': 'Negar uma condicional é AFIRMAR o antecedente E NEGAR o consequente. Não vira outra condicional.',
            'dificuldade': 'médio',
            'fonte': 'CESPE',
            'ano': 2023,
            'titulo': 'CESPE/INSS/2023 - Negação Condicional'
        },
        {
            'enunciado': 'Considerando a equivalência (p → q) ≡ (¬q → ¬p), a contrapositiva da proposição "Se o número é divisível por 6, então é divisível por 2" é:',
            'opcoes': ['A) Se o número é divisível por 2, então é divisível por 6', 'B) Se o número não é divisível por 6, então não é divisível por 2', 'C) Se o número não é divisível por 2, então não é divisível por 6', 'D) O número é divisível por 6 e não é divisível por 2', 'E) O número não é divisível por 6 ou é divisível por 2'],
            'resposta': 'C',
            'explicacao': 'Passo 1: Identifique p = "divisível por 6" e q = "divisível por 2". Passo 2: A contrapositiva de p → q é ¬q → ¬p. Passo 3: Traduzindo: "Se o número não é divisível por 2, então não é divisível por 6". Passo 4: Note que essa afirmação é verdadeira matematicamente, confirmando a equivalência. Conclusão: alternativa C.',
            'dica': 'Cuidado para não confundir contrapositiva (¬q→¬p, equivalente) com inversa (¬p→¬q, NÃO equivalente).',
            'dificuldade': 'difícil',
            'fonte': 'FGV',
            'ano': 2024,
            'titulo': 'FGV/SEFAZ/2024 - Contrapositiva Aplicada'
        },
    ],
    'Silogismos e Argumentos': [
        {
            'enunciado': 'Considere o seguinte argumento: "Premissa 1: Todos os concurseiros são dedicados. Premissa 2: João é concurseiro. Conclusão: Logo, João é dedicado." Sobre esse argumento, é correto afirmar que:',
            'opcoes': ['A) É inválido, pois generaliza indevidamente', 'B) É inválido, falácia da afirmação do consequente', 'C) É válido, é um silogismo categórico (modus barbara)', 'D) É inválido, pois usa quantificador universal', 'E) É válido apenas se João existir'],
            'resposta': 'C',
            'explicacao': 'Passo 1: Estrutura do argumento: Todo M é P; S é M; logo, S é P. Passo 2: Esse é o silogismo categórico clássico conhecido como "BARBARA" (AAA-1), considerado válido desde Aristóteles. Passo 3: Se as premissas forem verdadeiras, a conclusão é necessariamente verdadeira. Conclusão: o argumento é VÁLIDO.',
            'dica': 'BARBARA = "Todo A é B; X é A; logo X é B". Sempre válido. É o silogismo mais comum em concursos.',
            'dificuldade': 'fácil',
            'fonte': 'CESPE',
            'ano': 2023,
            'titulo': 'CESPE/PF/2023 - Silogismo Barbara'
        },
        {
            'enunciado': 'No argumento "Se chove, a rua fica molhada. A rua está molhada. Logo, choveu", identifica-se:',
            'opcoes': ['A) Modus Ponens (válido)', 'B) Modus Tollens (válido)', 'C) Falácia da afirmação do consequente (inválido)', 'D) Falácia da negação do antecedente (inválido)', 'E) Silogismo hipotético (válido)'],
            'resposta': 'C',
            'explicacao': 'Passo 1: A estrutura é: p → q; q; logo p. Passo 2: Essa estrutura é INVÁLIDA, pois a rua pode estar molhada por outras razões (regador, mangueira, vazamento). Passo 3: Trata-se da clássica FALÁCIA DA AFIRMAÇÃO DO CONSEQUENTE. Conclusão: alternativa C.',
            'dica': 'Modus Ponens VÁLIDO: afirma o ANTECEDENTE → conclui consequente. Afirmar o consequente = FALÁCIA.',
            'dificuldade': 'médio',
            'fonte': 'FCC',
            'ano': 2023,
            'titulo': 'FCC/TRT/2023 - Falácia do Consequente'
        },
        {
            'enunciado': 'Considere o argumento: "Se estudo, então passo. Não passei. Logo, não estudei." Esse argumento é:',
            'opcoes': ['A) Inválido, falácia da negação do antecedente', 'B) Válido, é um Modus Tollens', 'C) Inválido, falácia da afirmação do consequente', 'D) Válido, é um Modus Ponens', 'E) Inválido por contradição interna'],
            'resposta': 'B',
            'explicacao': 'Passo 1: A estrutura é p → q; ¬q; logo, ¬p. Passo 2: Esta é a forma do MODUS TOLLENS, regra de inferência válida. Passo 3: Se a condicional p→q é verdadeira e o consequente é falso, o antecedente também tem que ser falso (caso contrário, a condicional seria falsa). Conclusão: argumento VÁLIDO.',
            'dica': 'Modus Tollens: "negou o consequente → conclui negação do antecedente". É válido. Muito cobrado em provas.',
            'dificuldade': 'médio',
            'fonte': 'CESPE',
            'ano': 2024,
            'titulo': 'CESPE/PRF/2024 - Modus Tollens'
        },
        {
            'enunciado': 'Julgue o item: O argumento "Se faz frio, uso casaco. Não faz frio. Logo, não uso casaco" é VÁLIDO.',
            'opcoes': ['A) Verdadeiro', 'B) Falso'],
            'resposta': 'B',
            'explicacao': 'Passo 1: A estrutura é p → q; ¬p; logo ¬q. Passo 2: Esta é a FALÁCIA DA NEGAÇÃO DO ANTECEDENTE. Passo 3: A condicional p→q permite que q seja V mesmo com p sendo F (alguém pode usar casaco por estilo, mesmo sem frio). Passo 4: Não há, portanto, conclusão válida sobre q a partir da negação de p. Conclusão: argumento INVÁLIDO. Item FALSO.',
            'dica': 'Negar o ANTECEDENTE não permite concluir nada sobre o consequente. Só a negação do CONSEQUENTE permite concluir a negação do antecedente (Modus Tollens).',
            'dificuldade': 'médio',
            'fonte': 'FGV',
            'ano': 2023,
            'titulo': 'FGV/TJ/2023 - Falácia do Antecedente'
        },
        {
            'enunciado': 'Considere as premissas: "Todos os médicos são formados em Medicina" e "Alguns médicos são pediatras". A conclusão CORRETA é:',
            'opcoes': ['A) Todo pediatra é médico', 'B) Alguns formados em Medicina são pediatras', 'C) Todo formado em Medicina é pediatra', 'D) Nenhum pediatra é formado em Medicina', 'E) Alguns pediatras não são médicos'],
            'resposta': 'B',
            'explicacao': 'Passo 1: P1: Todo médico é formado em Medicina (todo M é F). Passo 2: P2: Alguns médicos são pediatras (alguns M são P). Passo 3: Logo, esses pediatras que são médicos também são formados em Medicina. Passo 4: Portanto, "Alguns formados em Medicina são pediatras" (alguns F são P). Conclusão: alternativa B (silogismo "DARII", válido).',
            'dica': 'Em silogismos com "alguns", lembre: a conclusão particular se transfere pela cadeia "alguns A são B; todo B é C; logo alguns A são C".',
            'dificuldade': 'médio',
            'fonte': 'FCC',
            'ano': 2022,
            'titulo': 'FCC/TJ/2022 - Silogismo Darii'
        },
        {
            'enunciado': 'O argumento "Se p, então q. Se q, então r. Logo, se p, então r" representa qual regra de inferência?',
            'opcoes': ['A) Modus Ponens', 'B) Modus Tollens', 'C) Silogismo Hipotético (transitividade)', 'D) Silogismo Disjuntivo', 'E) Falácia do meio-termo'],
            'resposta': 'C',
            'explicacao': 'Passo 1: A estrutura é (p → q) ∧ (q → r) ⟹ (p → r). Passo 2: Esta é a regra do SILOGISMO HIPOTÉTICO, que expressa a transitividade da condicional. Passo 3: É uma regra válida de inferência. Conclusão: alternativa C.',
            'dica': 'Silogismo Hipotético = transitividade: A→B, B→C, então A→C. Funciona como cadeia: "se A leva a B e B leva a C, então A leva a C".',
            'dificuldade': 'fácil',
            'fonte': 'FGV',
            'ano': 2024,
            'titulo': 'FGV/SEFAZ/2024 - Silogismo Hipotético'
        },
        {
            'enunciado': 'Julgue o item: O argumento "Ou João vai ao cinema ou ao teatro. João não foi ao cinema. Logo, foi ao teatro" é uma aplicação válida do Silogismo Disjuntivo.',
            'opcoes': ['A) Verdadeiro', 'B) Falso'],
            'resposta': 'A',
            'explicacao': 'Passo 1: Estrutura: p ∨ q; ¬p; logo q. Passo 2: Esta é a regra clássica do SILOGISMO DISJUNTIVO (ou Modus Tollendo Ponens). Passo 3: Se ao menos uma das alternativas é verdadeira e uma delas é falsa, a outra deve ser verdadeira. Conclusão: argumento VÁLIDO. Item VERDADEIRO.',
            'dica': 'Silogismo Disjuntivo: "p ou q; não p; logo q". Eliminação por exclusão. Sempre válido.',
            'dificuldade': 'fácil',
            'fonte': 'CESPE',
            'ano': 2023,
            'titulo': 'CESPE/MPU/2023 - Silogismo Disjuntivo'
        },
        {
            'enunciado': 'Considere as premissas: P1) "Nenhum político é honesto". P2) "Carlos é honesto". Qual a conclusão válida?',
            'opcoes': ['A) Carlos é político', 'B) Carlos não é político', 'C) Todo político é desonesto', 'D) Alguns políticos são honestos', 'E) Não é possível concluir nada'],
            'resposta': 'B',
            'explicacao': 'Passo 1: P1: Nenhum P é H, ou seja, todo P implica ¬H. Passo 2: P2: Carlos é H. Passo 3: Pela contrapositiva de P1: se alguém é H, então não é P. Passo 4: Como Carlos é H, então Carlos não é P (não é político). Conclusão: alternativa B (silogismo "CELARENT", válido).',
            'dica': 'Premissa universal negativa + premissa afirmativa singular = conclusão singular negativa. Use a contrapositiva da universal.',
            'dificuldade': 'médio',
            'fonte': 'CESPE',
            'ano': 2024,
            'titulo': 'CESPE/PCF/2024 - Silogismo Celarent'
        },
        {
            'enunciado': 'Sobre validade e verdade em argumentos lógicos, é CORRETO afirmar:',
            'opcoes': ['A) Um argumento válido sempre tem premissas verdadeiras', 'B) Um argumento com premissas falsas é necessariamente inválido', 'C) Um argumento é válido se, supondo as premissas verdadeiras, a conclusão é necessariamente verdadeira', 'D) Validade e verdade são sinônimos em lógica formal', 'E) Um argumento com conclusão verdadeira é sempre válido'],
            'resposta': 'C',
            'explicacao': 'Passo 1: Validade é uma propriedade da ESTRUTURA do argumento, não do conteúdo das premissas. Passo 2: Um argumento é VÁLIDO quando é IMPOSSÍVEL ter todas as premissas verdadeiras e a conclusão falsa. Passo 3: A alternativa C captura essa definição. As demais confundem validade com verdade material das premissas/conclusão. Conclusão: alternativa C.',
            'dica': 'Validade = forma; Verdade = conteúdo. Argumento válido pode ter premissas falsas. Argumento inválido pode ter conclusão verdadeira por acaso.',
            'dificuldade': 'difícil',
            'fonte': 'FGV',
            'ano': 2024,
            'titulo': 'FGV/TCE/2024 - Validade vs Verdade'
        },
        {
            'enunciado': 'Considere o argumento: "Se Ana mente, então Bia chora. Se Bia chora, então Carlos sai. Carlos não saiu. Portanto, Ana não mentiu." Esse argumento é:',
            'opcoes': ['A) Inválido, comete falácia da afirmação do consequente', 'B) Válido, aplicação combinada de Silogismo Hipotético e Modus Tollens', 'C) Inválido, comete falácia da negação do antecedente', 'D) Válido, aplicação direta do Modus Ponens', 'E) Inválido, conclusão não decorre das premissas'],
            'resposta': 'B',
            'explicacao': 'Passo 1: Sejam A = "Ana mente", B = "Bia chora", C = "Carlos sai". Passo 2: Premissas: A→B, B→C, ¬C. Passo 3: Por Silogismo Hipotético: (A→B) ∧ (B→C) ⟹ (A→C). Passo 4: Agora temos A→C e ¬C. Passo 5: Por Modus Tollens: ¬C ⟹ ¬A, ou seja, "Ana não mentiu". Conclusão: argumento VÁLIDO, alternativa B.',
            'dica': 'Argumentos em cadeia: combine Silogismo Hipotético (transitividade) com Modus Tollens (negar o consequente final).',
            'dificuldade': 'difícil',
            'fonte': 'CESPE',
            'ano': 2024,
            'titulo': 'CESPE/TCU/2024 - Cadeia de Inferências'
        },
    ],
}
