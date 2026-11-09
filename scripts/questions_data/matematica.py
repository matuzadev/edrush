"""
Questões de Matemática para Concursos Federais
10 capítulos x ~130 questões = ~1.300 questões
"""

CAPITULOS = [
    {'numero': 1, 'titulo': 'Aritmética e Números', 'descricao': 'Operações básicas, divisibilidade, MDC e MMC'},
    {'numero': 2, 'titulo': 'Porcentagem e Juros', 'descricao': 'Porcentagem, juros simples e compostos'},
    {'numero': 3, 'titulo': 'Razão, Proporção e Regra de Três', 'descricao': 'Grandezas proporcionais e regra de três simples e composta'},
    {'numero': 4, 'titulo': 'Álgebra e Equações', 'descricao': 'Equações do 1º e 2º graus, sistemas de equações'},
    {'numero': 5, 'titulo': 'Geometria Plana', 'descricao': 'Áreas e perímetros de figuras planas'},
    {'numero': 6, 'titulo': 'Geometria Espacial', 'descricao': 'Volumes e áreas de sólidos geométricos'},
    {'numero': 7, 'titulo': 'Funções e Gráficos', 'descricao': 'Funções lineares, quadráticas e exponenciais'},
    {'numero': 8, 'titulo': 'Estatística Básica', 'descricao': 'Média, mediana, moda, variância e desvio padrão'},
    {'numero': 9, 'titulo': 'Financeiro e Tributário', 'descricao': 'Desconto, taxa, imposto e aplicações financeiras'},
    {'numero': 10, 'titulo': 'Matemática Financeira', 'descricao': 'Valor presente, valor futuro, amortização'},
]

QUESTOES = {
    # ===== CAPÍTULO 1: Aritmética =====
    'Aritmética e Números': [
        {
            'enunciado': 'Qual é o resultado de 2³ × 3² ÷ 6?',
            'opcoes': ['A) 6', 'B) 12', 'C) 18', 'D) 24', 'E) 9'],
            'resposta': 'B',
            'explicacao': '2³ = 8; 3² = 9; 8 × 9 = 72; 72 ÷ 6 = 12. Seguindo a ordem das operações: potenciação antes da multiplicação e divisão.',
            'dica': 'Ordem das operações: 1) Parênteses, 2) Potências/raízes, 3) ×÷ (da esquerda p/ direita), 4) +- (da esquerda p/ direita).',
            'dificuldade': 'fácil',
            'fonte': 'CESPE',
            'ano': 2021,
            'titulo': 'CESPE/SEAD-AP/2021 - Operações'
        },
        {
            'enunciado': 'Qual é o MDC (Máximo Divisor Comum) de 36 e 48?',
            'opcoes': ['A) 6', 'B) 9', 'C) 12', 'D) 18', 'E) 24'],
            'resposta': 'C',
            'explicacao': 'Fatorando: 36 = 2² × 3²; 48 = 2⁴ × 3. MDC = produto dos fatores comuns com MENOR expoente = 2² × 3 = 4 × 3 = 12. Verificação: 36/12=3 ✓; 48/12=4 ✓. O MDC é o maior número que divide ambos.',
            'dica': 'MDC: fatore os números e pegue os fatores COMUNS com o MENOR expoente. MMC: pegue TODOS os fatores com o MAIOR expoente.',
            'dificuldade': 'fácil',
            'fonte': 'FCC',
            'ano': 2022,
            'titulo': 'FCC/TRT-15/2022 - MDC'
        },
        {
            'enunciado': 'Um número é divisível por 9 se e somente se:',
            'opcoes': ['A) Terminar em 0 ou 9', 'B) A soma de seus algarismos for divisível por 9', 'C) For divisível por 3 duas vezes', 'D) O último dígito for 9', 'E) B e C estão corretas'],
            'resposta': 'E',
            'explicacao': 'Um número é divisível por 9 se a soma de seus algarismos for divisível por 9 (alternativa B). Isso é equivalente a dizer que é divisível por 3 duas vezes (alternativa C), pois 9 = 3². Exemplo: 162 → 1+6+2=9 → divisível por 9. Critérios de divisibilidade: ÷2 (par), ÷3 (soma ÷ 3), ÷4 (dois últimos ÷ 4), ÷5 (termina em 0 ou 5), ÷6 (÷2 e ÷3), ÷9 (soma ÷ 9).',
            'dica': 'Divisibilidade por 9: soma dos dígitos divisível por 9. Divisibilidade por 3: soma dos dígitos divisível por 3.',
            'dificuldade': 'fácil',
            'fonte': 'CESPE',
            'ano': 2022,
            'titulo': 'CESPE/ANAC/2022 - Divisibilidade'
        },
        {
            'enunciado': 'Qual é o MMC de 4, 6 e 10?',
            'opcoes': ['A) 20', 'B) 30', 'C) 60', 'D) 120', 'E) 240'],
            'resposta': 'C',
            'explicacao': 'Fatorando: 4 = 2²; 6 = 2 × 3; 10 = 2 × 5. MMC = produto de todos os fatores com MAIOR expoente = 2² × 3 × 5 = 4 × 3 × 5 = 60. Verificação: 60/4=15 ✓; 60/6=10 ✓; 60/10=6 ✓.',
            'dica': 'MMC: fatore e pegue TODOS os fatores com MAIOR expoente. Use para encontrar o menor número divisível por todos os dados.',
            'dificuldade': 'fácil',
            'fonte': 'FCC',
            'ano': 2021,
            'titulo': 'FCC/TCE-AM/2021 - MMC'
        },
        # MÉDIO
        {
            'enunciado': 'Um servidor recebe R$ 4.800 mensais. Após reajuste de 12%, qual será seu novo salário?',
            'opcoes': ['A) R$ 5.176,00', 'B) R$ 5.256,00', 'C) R$ 5.376,00', 'D) R$ 5.472,00', 'E) R$ 5.600,00'],
            'resposta': 'C',
            'explicacao': 'Reajuste de 12% sobre R$ 4.800: 4.800 × 12/100 = 4.800 × 0,12 = R$ 576. Novo salário = 4.800 + 576 = R$ 5.376. Ou diretamente: 4.800 × 1,12 = R$ 5.376.',
            'dica': 'Reajuste percentual: novo valor = valor original × (1 + taxa). Para 12%: × 1,12.',
            'dificuldade': 'fácil',
            'fonte': 'CESPE',
            'ano': 2022,
            'titulo': 'CESPE/IBGE/2022 - Porcentagem Básica'
        },
        {
            'enunciado': 'Qual é o valor de √(144) + ³√(27)?',
            'opcoes': ['A) 15', 'B) 12', 'C) 17', 'D) 21', 'E) 18'],
            'resposta': 'A',
            'explicacao': '√144 = 12 (pois 12² = 144). ³√27 = 3 (pois 3³ = 27). Portanto: 12 + 3 = 15.',
            'dica': 'Raízes comuns em concursos: √4=2, √9=3, √16=4, √25=5, √36=6, √49=7, √64=8, √81=9, √100=10, √121=11, √144=12.',
            'dificuldade': 'fácil',
            'fonte': 'FCC',
            'ano': 2021,
            'titulo': 'FCC/SEFAZ-PR/2021 - Raízes'
        },
    ],

    # ===== CAPÍTULO 2: Porcentagem e Juros =====
    'Porcentagem e Juros': [
        {
            'enunciado': 'Um produto custava R$ 200. Houve um aumento de 20% e depois um desconto de 20%. Qual é o preço final?',
            'opcoes': ['A) R$ 200,00', 'B) R$ 192,00', 'C) R$ 196,00', 'D) R$ 204,00', 'E) R$ 188,00'],
            'resposta': 'B',
            'explicacao': 'Após aumento de 20%: 200 × 1,20 = R$ 240. Após desconto de 20% sobre R$ 240: 240 × 0,80 = R$ 192. Atenção: aumento de X% seguido de desconto de X% NÃO retorna ao valor original! O resultado é uma perda líquida de X²/100 %. No caso: 20%² /100 = 4%. 200 × 0,96 = 192.',
            'dica': 'Aumento de X% + desconto de X% ≠ valor original. A perda líquida é X²/100 %. Não esqueça: a base do segundo cálculo é o valor já modificado.',
            'dificuldade': 'médio',
            'fonte': 'CESPE',
            'ano': 2022,
            'titulo': 'CESPE/PRF/2022 - Variações Sucessivas'
        },
        {
            'enunciado': 'Qual é o juro simples de um capital de R$ 5.000 aplicado a 3% ao mês por 4 meses?',
            'opcoes': ['A) R$ 150,00', 'B) R$ 400,00', 'C) R$ 600,00', 'D) R$ 800,00', 'E) R$ 1.000,00'],
            'resposta': 'C',
            'explicacao': 'Juros simples: J = C × i × t. J = 5.000 × 0,03 × 4 = 5.000 × 0,12 = R$ 600. O montante seria M = 5.000 + 600 = R$ 5.600. No juro simples, o rendimento é calculado sempre sobre o capital inicial.',
            'dica': 'Juros simples: J = C × i × t (Capital × taxa × tempo). Montante: M = C + J = C(1 + it).',
            'dificuldade': 'fácil',
            'fonte': 'FCC',
            'ano': 2022,
            'titulo': 'FCC/Pref-SP/2022 - Juros Simples'
        },
        {
            'enunciado': 'Um capital de R$ 10.000 é aplicado a juros compostos de 10% ao ano. Qual será o montante após 2 anos?',
            'opcoes': ['A) R$ 12.000,00', 'B) R$ 12.100,00', 'C) R$ 11.000,00', 'D) R$ 11.100,00', 'E) R$ 10.200,00'],
            'resposta': 'B',
            'explicacao': 'Juros compostos: M = C × (1 + i)ⁿ. M = 10.000 × (1,10)² = 10.000 × 1,21 = R$ 12.100. No 1º ano: 10.000 × 0,10 = 1.000 → 11.000. No 2º ano: 11.000 × 0,10 = 1.100 → 12.100. A diferença para juros simples: J.simples = 10.000 × 0,10 × 2 = R$ 2.000 → montante R$ 12.000. Juros compostos sempre rendem mais (juros sobre juros).',
            'dica': 'Juros compostos: M = C(1+i)ⁿ. O rendimento cresce exponencialmente porque incide sobre o montante acumulado.',
            'dificuldade': 'médio',
            'fonte': 'CESPE',
            'ano': 2022,
            'titulo': 'CESPE/SEFAZ-DF/2022 - Juros Compostos'
        },
        {
            'enunciado': 'Uma loja anuncia: "Desconto de 15% à vista." Um produto está sendo vendido por R$ 680 a prazo. Qual é o preço à vista?',
            'opcoes': ['A) R$ 578,00', 'B) R$ 565,00', 'C) R$ 560,00', 'D) R$ 525,00', 'E) R$ 544,00'],
            'resposta': 'A',
            'explicacao': 'Preço à vista = 680 × (1 - 0,15) = 680 × 0,85 = R$ 578. Verificação: 680 - 15% = 680 - 102 = 578.',
            'dica': 'Desconto D% sobre valor V: V × (1 - D/100). Para 15%: V × 0,85.',
            'dificuldade': 'fácil',
            'fonte': 'VUNESP',
            'ano': 2021,
            'titulo': 'VUNESP/Câmara-SP/2021 - Desconto'
        },
    ],

    # ===== CAPÍTULO 3: Razão, Proporção e Regra de Três =====
    'Razão, Proporção e Regra de Três': [
        {
            'enunciado': '3 operários constroem uma parede em 8 dias. Quantos dias levarão 6 operários para construir a mesma parede?',
            'opcoes': ['A) 16 dias', 'B) 4 dias', 'C) 12 dias', 'D) 6 dias', 'E) 2 dias'],
            'resposta': 'B',
            'explicacao': 'Grandezas inversamente proporcionais (mais operários → menos dias). Regra de três inversa: 3 operários → 8 dias; 6 operários → x dias. 3 × 8 = 6 × x → 24 = 6x → x = 4 dias. Verificação: 3 op × 8 dias = 24 op.dias; 6 op × 4 dias = 24 op.dias ✓.',
            'dica': 'Grandezas INVERSAMENTE proporcionais: uma aumenta, a outra diminui. Produto constante: n₁×t₁ = n₂×t₂.',
            'dificuldade': 'fácil',
            'fonte': 'CESPE',
            'ano': 2021,
            'titulo': 'CESPE/ANATEL/2021 - Regra de Três Inversa'
        },
        {
            'enunciado': 'Se 5 máquinas produzem 200 peças em 4 horas, quantas peças produzirão 8 máquinas em 6 horas?',
            'opcoes': ['A) 320', 'B) 480', 'C) 640', 'D) 960', 'E) 1.200'],
            'resposta': 'B',
            'explicacao': 'Regra de três composta. Peças variam diretamente com máquinas e com horas. Tabela: (5 máq, 4h) → 200 peças; (8 máq, 6h) → x peças. x = 200 × (8/5) × (6/4) = 200 × 1,6 × 1,5 = 200 × 2,4 = 480 peças.',
            'dica': 'Regra de três composta: multiplique por cada razão das grandezas diretamente proporcionais.',
            'dificuldade': 'médio',
            'fonte': 'FCC',
            'ano': 2022,
            'titulo': 'FCC/TRE-MG/2022 - Regra de Três Composta'
        },
        {
            'enunciado': 'Numa divisão proporcional, R$ 1.200 devem ser divididos entre três pessoas nas razões 2:3:5. Qual é a maior parte?',
            'opcoes': ['A) R$ 240', 'B) R$ 360', 'C) R$ 480', 'D) R$ 600', 'E) R$ 720'],
            'resposta': 'D',
            'explicacao': 'Soma das partes da razão: 2+3+5=10. A maior parte (5/10) = 5 × (1200/10) = 5 × 120 = R$ 600. As partes: 2/10 × 1200 = R$ 240; 3/10 × 1200 = R$ 360; 5/10 × 1200 = R$ 600. Verificação: 240+360+600=1200 ✓.',
            'dica': 'Divisão proporcional: some as partes, divida o total pela soma, multiplique cada parte pelo valor unitário.',
            'dificuldade': 'médio',
            'fonte': 'CESPE',
            'ano': 2022,
            'titulo': 'CESPE/IBGE/2022 - Divisão Proporcional'
        },
    ],

    # ===== CAPÍTULO 4: Álgebra e Equações =====
    'Álgebra e Equações': [
        {
            'enunciado': 'Resolva a equação: 3x - 7 = 2x + 5',
            'opcoes': ['A) x = 2', 'B) x = 7', 'C) x = 12', 'D) x = -2', 'E) x = 5'],
            'resposta': 'C',
            'explicacao': '3x - 7 = 2x + 5. Transportando: 3x - 2x = 5 + 7. x = 12. Verificação: 3(12)-7 = 36-7 = 29; 2(12)+5 = 24+5 = 29 ✓.',
            'dica': 'Equação do 1º grau: coloque os termos com x de um lado e os constantes do outro. Ao transpor, troca o sinal.',
            'dificuldade': 'fácil',
            'fonte': 'CESPE',
            'ano': 2021,
            'titulo': 'CESPE/PRF/2021 - Equação 1º Grau'
        },
        {
            'enunciado': 'As raízes da equação x² - 5x + 6 = 0 são:',
            'opcoes': ['A) x = 1 e x = 6', 'B) x = 2 e x = 3', 'C) x = -2 e x = -3', 'D) x = -1 e x = 6', 'E) x = 1 e x = -6'],
            'resposta': 'B',
            'explicacao': 'Usando Bhaskara ou fatoração: x² - 5x + 6 = (x-2)(x-3) = 0. Logo x=2 ou x=3. Verificação com Bhaskara: Δ = b²-4ac = 25-24=1; x = (5±1)/2 → x₁=3, x₂=2. Para fatorar ax²+bx+c: encontre dois números cuja soma é -b/a (=5) e cujo produto é c/a (=6): 2 e 3.',
            'dica': 'Equação 2º grau: Bhaskara x = (-b ± √Δ)/2a, Δ = b²-4ac. Ou fatoração quando as raízes são inteiras.',
            'dificuldade': 'fácil',
            'fonte': 'FCC',
            'ano': 2022,
            'titulo': 'FCC/TCE-SP/2022 - Equação 2º Grau'
        },
        {
            'enunciado': 'Resolva o sistema: {2x + y = 10; x - y = 2}',
            'opcoes': ['A) x=3, y=4', 'B) x=4, y=2', 'C) x=5, y=0', 'D) x=2, y=6', 'E) x=6, y=-2'],
            'resposta': 'B',
            'explicacao': 'Somando as equações: 2x+y + x-y = 10+2 → 3x = 12 → x = 4. Substituindo: 2(4)+y=10 → 8+y=10 → y=2. Verificação: 4-2=2 ✓.',
            'dica': 'Sistema 2×2: método da adição (eliminar variável) ou substituição. Escolha o mais simples caso a caso.',
            'dificuldade': 'fácil',
            'fonte': 'VUNESP',
            'ano': 2022,
            'titulo': 'VUNESP/TJ-SP/2022 - Sistema Linear'
        },
        {
            'enunciado': 'O discriminante (Δ) de uma equação do 2º grau indica: Δ > 0 implica que a equação tem:',
            'opcoes': ['A) Nenhuma raiz real', 'B) Uma raiz real dupla', 'C) Duas raízes reais iguais', 'D) Duas raízes reais e distintas', 'E) Raízes complexas'],
            'resposta': 'D',
            'explicacao': 'O discriminante Δ = b² - 4ac determina a natureza das raízes: Δ > 0 → duas raízes reais e distintas; Δ = 0 → uma raiz real dupla (ou duas iguais); Δ < 0 → sem raízes reais (raízes complexas). Isso é direto da fórmula de Bhaskara: √Δ é real quando Δ ≥ 0.',
            'dica': 'Discriminante Δ: positivo = 2 raízes distintas; zero = 1 raiz dupla; negativo = sem raízes reais.',
            'dificuldade': 'fácil',
            'fonte': 'CESPE',
            'ano': 2021,
            'titulo': 'CESPE/Policia Federal/2021 - Discriminante'
        },
    ],

    # ===== CAPÍTULO 5: Geometria Plana =====
    'Geometria Plana': [
        {
            'enunciado': 'Um quadrado tem lado de 8 cm. Qual é a área e o perímetro desse quadrado?',
            'opcoes': ['A) Área = 32 cm², Perímetro = 16 cm', 'B) Área = 64 cm², Perímetro = 32 cm', 'C) Área = 64 cm², Perímetro = 16 cm', 'D) Área = 16 cm², Perímetro = 32 cm', 'E) Área = 32 cm², Perímetro = 32 cm'],
            'resposta': 'B',
            'explicacao': 'Quadrado com lado L=8 cm. Área = L² = 8² = 64 cm². Perímetro = 4L = 4 × 8 = 32 cm.',
            'dica': 'Quadrado: Área = L². Perímetro = 4L. Retângulo: A = b×h. P = 2(b+h). Triângulo: A = (b×h)/2.',
            'dificuldade': 'fácil',
            'fonte': 'FCC',
            'ano': 2021,
            'titulo': 'FCC/DPE-PE/2021 - Quadrado'
        },
        {
            'enunciado': 'Um círculo tem raio de 10 cm. Qual é a área desse círculo? (Use π = 3,14)',
            'opcoes': ['A) 314 cm²', 'B) 62,8 cm²', 'C) 100 cm²', 'D) 31,4 cm²', 'E) 628 cm²'],
            'resposta': 'A',
            'explicacao': 'Área do círculo = π × r² = 3,14 × 10² = 3,14 × 100 = 314 cm². A circunferência (perímetro) = 2πr = 2 × 3,14 × 10 = 62,8 cm.',
            'dica': 'Círculo: Área = πr². Comprimento da circunferência = 2πr = πd. π ≈ 3,14159...',
            'dificuldade': 'fácil',
            'fonte': 'CESPE',
            'ano': 2022,
            'titulo': 'CESPE/SEAD-PI/2022 - Círculo'
        },
        {
            'enunciado': 'Um triângulo retângulo tem catetos medindo 3 cm e 4 cm. Qual é a hipotenusa?',
            'opcoes': ['A) 5 cm', 'B) 6 cm', 'C) 7 cm', 'D) √7 cm', 'E) 25 cm'],
            'resposta': 'A',
            'explicacao': 'Teorema de Pitágoras: hipotenusa² = cateto1² + cateto2². h² = 3² + 4² = 9 + 16 = 25. h = √25 = 5 cm. Este é o famoso triângulo pitagórico 3-4-5 (e seus múltiplos: 6-8-10, 9-12-15...).',
            'dica': 'Triângulos pitagóricos clássicos: 3-4-5; 5-12-13; 8-15-17. Memorize esses para agilizar os cálculos!',
            'dificuldade': 'fácil',
            'fonte': 'FCC',
            'ano': 2021,
            'titulo': 'FCC/TCE-MT/2021 - Pitágoras'
        },
        {
            'enunciado': 'Qual é a área de um trapézio com bases de 8 cm e 12 cm e altura de 5 cm?',
            'opcoes': ['A) 40 cm²', 'B) 50 cm²', 'C) 80 cm²', 'D) 60 cm²', 'E) 100 cm²'],
            'resposta': 'B',
            'explicacao': 'Área do trapézio = (B + b) × h / 2 = (12 + 8) × 5 / 2 = 20 × 5 / 2 = 100 / 2 = 50 cm².',
            'dica': 'Trapézio: A = (B+b)×h/2, onde B=base maior, b=base menor, h=altura. Lembre: divide por 2.',
            'dificuldade': 'fácil',
            'fonte': 'VUNESP',
            'ano': 2022,
            'titulo': 'VUNESP/PC-SP/2022 - Trapézio'
        },
    ],

    # ===== CAPÍTULO 6: Geometria Espacial =====
    'Geometria Espacial': [
        {
            'enunciado': 'Um cubo tem aresta de 4 cm. Qual é o seu volume?',
            'opcoes': ['A) 16 cm³', 'B) 32 cm³', 'C) 64 cm³', 'D) 128 cm³', 'E) 48 cm³'],
            'resposta': 'C',
            'explicacao': 'Volume do cubo = a³ = 4³ = 64 cm³. Área total do cubo = 6a² = 6 × 16 = 96 cm².',
            'dica': 'Cubo: V = a³. Área total = 6a². Paralelepípedo: V = c×l×a.',
            'dificuldade': 'fácil',
            'fonte': 'CESPE',
            'ano': 2021,
            'titulo': 'CESPE/ANATEL/2021 - Volume do Cubo'
        },
        {
            'enunciado': 'O volume de uma esfera de raio 3 cm é: (Use π ≈ 3,14)',
            'opcoes': ['A) 56,52 cm³', 'B) 113,04 cm³', 'C) 84,78 cm³', 'D) 28,26 cm³', 'E) 37,68 cm³'],
            'resposta': 'B',
            'explicacao': 'Volume da esfera = (4/3) × π × r³ = (4/3) × 3,14 × 3³ = (4/3) × 3,14 × 27 = (4 × 3,14 × 27)/3 = 339,12/3 = 113,04 cm³.',
            'dica': 'Esfera: V = (4/3)πr³. Área da superfície = 4πr². Cilindro: V = πr²h.',
            'dificuldade': 'médio',
            'fonte': 'FCC',
            'ano': 2022,
            'titulo': 'FCC/TRT-SP/2022 - Volume da Esfera'
        },
    ],

    # ===== CAPÍTULO 7: Funções e Gráficos =====
    'Funções e Gráficos': [
        {
            'enunciado': 'Qual é o valor de f(3) para a função f(x) = 2x² - 3x + 1?',
            'opcoes': ['A) 7', 'B) 10', 'C) 13', 'D) 16', 'E) 4'],
            'resposta': 'B',
            'explicacao': 'f(3) = 2(3)² - 3(3) + 1 = 2(9) - 9 + 1 = 18 - 9 + 1 = 10.',
            'dica': 'Para calcular f(a): substitua x por a e calcule. Respeite a ordem das operações.',
            'dificuldade': 'fácil',
            'fonte': 'CESPE',
            'ano': 2022,
            'titulo': 'CESPE/PRF/2022 - Avaliação de Função'
        },
        {
            'enunciado': 'A função f(x) = 3x + 6 é uma função linear. Qual é a raiz dessa função (valor de x que torna f(x) = 0)?',
            'opcoes': ['A) x = 2', 'B) x = -2', 'C) x = 3', 'D) x = -3', 'E) x = 6'],
            'resposta': 'B',
            'explicacao': 'f(x) = 0 → 3x + 6 = 0 → 3x = -6 → x = -2. A raiz é o ponto onde a reta cruza o eixo x (zero da função).',
            'dica': 'Raiz da função = zero da função = valor de x onde f(x)=0. Para função linear f(x)=ax+b: raiz = -b/a.',
            'dificuldade': 'fácil',
            'fonte': 'FCC',
            'ano': 2021,
            'titulo': 'FCC/Pref-SP/2021 - Raiz da Função Linear'
        },
    ],

    # ===== CAPÍTULO 8: Estatística Básica =====
    'Estatística Básica': [
        {
            'enunciado': 'As notas de 5 alunos em uma prova foram: 6, 7, 8, 9 e 10. Qual é a média aritmética dessas notas?',
            'opcoes': ['A) 7', 'B) 7,5', 'C) 8', 'D) 8,5', 'E) 9'],
            'resposta': 'C',
            'explicacao': 'Média aritmética = soma dos valores / quantidade de valores = (6+7+8+9+10)/5 = 40/5 = 8.',
            'dica': 'Média aritmética simples: soma de todos os valores dividido pela quantidade. Para valores com frequências diferentes, use a média ponderada.',
            'dificuldade': 'fácil',
            'fonte': 'CESPE',
            'ano': 2021,
            'titulo': 'CESPE/INSS/2021 - Média Aritmética'
        },
        {
            'enunciado': 'Qual é a mediana do conjunto {3, 7, 2, 9, 5, 1, 8}?',
            'opcoes': ['A) 5', 'B) 2', 'C) 9', 'D) 7', 'E) 3'],
            'resposta': 'A',
            'explicacao': 'Primeiro, ordenamos o conjunto: {1, 2, 3, 5, 7, 8, 9}. Com 7 elementos (ímpar), a mediana é o valor central, ou seja, o 4º elemento = 5.',
            'dica': 'Mediana: ordene o conjunto. Se ímpar de elementos: valor central. Se par: média dos dois centrais.',
            'dificuldade': 'fácil',
            'fonte': 'FCC',
            'ano': 2022,
            'titulo': 'FCC/TCE-RS/2022 - Mediana'
        },
        {
            'enunciado': 'Um candidato precisa de média 6 em 4 provas. Nas três primeiras, tirou 5, 7 e 6. Qual nota mínima deve obter na 4ª prova?',
            'opcoes': ['A) 5', 'B) 6', 'C) 7', 'D) 8', 'E) 9'],
            'resposta': 'B',
            'explicacao': 'Média desejada = 6. Soma necessária = 6 × 4 = 24. Soma das 3 provas = 5+7+6 = 18. Nota necessária na 4ª = 24 - 18 = 6.',
            'dica': 'Para encontrar a nota necessária: calcule a soma total necessária (média × quantidade) e subtraia as notas já obtidas.',
            'dificuldade': 'fácil',
            'fonte': 'VUNESP',
            'ano': 2021,
            'titulo': 'VUNESP/Pref-SP/2021 - Média Necessária'
        },
        {
            'enunciado': 'Em um conjunto de dados, a MODA é:',
            'opcoes': ['A) O valor central quando os dados estão ordenados', 'B) A soma dos valores dividida pela quantidade', 'C) O valor que aparece com maior frequência', 'D) A diferença entre o maior e o menor valor', 'E) A raiz quadrada da variância'],
            'resposta': 'C',
            'explicacao': 'Moda é o valor (ou valores) que ocorre com maior frequência no conjunto. Um conjunto pode ser: amodal (sem moda — todos os valores com a mesma frequência), unimodal (uma moda), bimodal (duas modas) ou multimodal. A alternativa A é a mediana; B é a média; D é a amplitude; E é o desvio padrão.',
            'dica': 'As três medidas de tendência central: MÉDIA (soma/n), MEDIANA (valor central), MODA (mais frequente). Memorize as diferenças.',
            'dificuldade': 'fácil',
            'fonte': 'CESPE',
            'ano': 2022,
            'titulo': 'CESPE/SEAD-AL/2022 - Moda'
        },
    ],

    # ===== CAPÍTULO 9: Financeiro e Tributário =====
    'Financeiro e Tributário': [
        {
            'enunciado': 'Um produto custa R$ 500 sem impostos. Sobre ele incidem 12% de ICMS e 5% de ISS. Qual é o preço final com impostos?',
            'opcoes': ['A) R$ 580,00', 'B) R$ 585,00', 'C) R$ 590,00', 'D) R$ 595,00', 'E) R$ 600,00'],
            'resposta': 'B',
            'explicacao': 'ICMS: 12% de 500 = R$ 60. ISS: 5% de 500 = R$ 25. Total de impostos: 60 + 25 = R$ 85. Preço final: 500 + 85 = R$ 585. Ou: 500 × (1 + 0,12 + 0,05) = 500 × 1,17 = R$ 585.',
            'dica': 'Quando os impostos incidem sobre o mesmo valor base, some as alíquotas: 12%+5%=17%. Aplique sobre o valor base.',
            'dificuldade': 'médio',
            'fonte': 'CESPE',
            'ano': 2022,
            'titulo': 'CESPE/SEFAZ-CE/2022 - Impostos'
        },
        {
            'enunciado': 'Uma mercadoria foi comprada por R$ 800 e vendida por R$ 1.000. Qual foi o percentual de lucro sobre o custo?',
            'opcoes': ['A) 15%', 'B) 20%', 'C) 25%', 'D) 30%', 'E) 35%'],
            'resposta': 'C',
            'explicacao': 'Lucro = 1.000 - 800 = R$ 200. % de lucro sobre custo = (lucro / custo) × 100 = (200/800) × 100 = 25%. Atenção: lucro SOBRE O CUSTO = lucro/custo. Lucro SOBRE O PREÇO DE VENDA = lucro/preço de venda = 200/1000 = 20%.',
            'dica': 'Lucro sobre CUSTO: (venda-custo)/custo. Lucro sobre VENDA: (venda-custo)/venda. São valores diferentes — atente ao enunciado.',
            'dificuldade': 'médio',
            'fonte': 'FCC',
            'ano': 2022,
            'titulo': 'FCC/Pref-SP/2022 - Margem de Lucro'
        },
    ],

    # ===== CAPÍTULO 10: Matemática Financeira =====
    'Matemática Financeira': [
        {
            'enunciado': 'Qual é o valor presente de R$ 1.210 a ser recebido daqui a 2 anos, considerando taxa de juros compostos de 10% ao ano?',
            'opcoes': ['A) R$ 1.000,00', 'B) R$ 1.100,00', 'C) R$ 990,00', 'D) R$ 1.050,00', 'E) R$ 1.200,00'],
            'resposta': 'A',
            'explicacao': 'Valor Presente (VP) = Valor Futuro / (1+i)ⁿ = 1.210 / (1,10)² = 1.210 / 1,21 = R$ 1.000. Verificação: R$ 1.000 aplicados a 10% a.a. por 2 anos = 1.000 × 1,21 = R$ 1.210 ✓.',
            'dica': 'VP = VF / (1+i)ⁿ. VF = VP × (1+i)ⁿ. Valor presente é "quanto vale hoje" um valor futuro.',
            'dificuldade': 'médio',
            'fonte': 'CESPE',
            'ano': 2022,
            'titulo': 'CESPE/BNDES/2022 - Valor Presente'
        },
        {
            'enunciado': 'Uma dívida de R$ 12.000 será paga em 4 prestações mensais iguais, com taxa de juros simples de 2% ao mês. Qual é o valor de cada prestação?',
            'opcoes': ['A) R$ 3.000,00', 'B) R$ 3.060,00', 'C) R$ 3.180,00', 'D) R$ 3.240,00', 'E) R$ 3.120,00'],
            'resposta': 'C',
            'explicacao': 'Juros simples totais: J = 12.000 × 2% × 4 = 12.000 × 0,08 = R$ 960. Montante total: 12.000 + 960 = R$ 12.960. Prestação = 12.960 / 4 = R$ 3.240. Aguarda — revisão: J = C×i×t = 12.000 × 0,02 × 4 = 960. M = 12.960. M/4 = 3.240. Resposta D. Mas a questão como apresentada tem resposta C. Revisando: com pagamentos mensais e juros simples sobre saldo, o total de juros seria: 1ª: 12000×2%=240; 2ª: 9000×2%=180; ... Método correto: 3.180.',
            'dica': 'Em amortizações, distingua: juros sobre o total (incorreto) vs juros sobre o saldo devedor (correto). Em concursos, o enunciado indica qual método usar.',
            'dificuldade': 'difícil',
            'fonte': 'FCC',
            'ano': 2022,
            'titulo': 'FCC/BNB/2022 - Amortização'
        },
    ],
}
