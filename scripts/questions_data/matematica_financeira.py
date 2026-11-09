"""
Matemática Financeira — Juros, Porcentagem e Amortização
30 questões cobrindo 3 capítulos
"""

CAPITULOS = [
    {
        'numero': 1,
        'titulo': 'Juros Simples e Compostos',
        'descricao': 'Regime de capitalização simples e composta: fórmulas de montante, capital, taxa e prazo; equivalência de taxas; comparação entre os dois regimes em diferentes prazos.'
    },
    {
        'numero': 2,
        'titulo': 'Porcentagem, Aumentos e Descontos',
        'descricao': 'Conceito de razão centesimal, fator de atualização, variações percentuais sucessivas, descontos comerciais (por fora) e racionais (por dentro), margem de lucro bruto e líquido.'
    },
    {
        'numero': 3,
        'titulo': 'Sistemas de Amortização e Equivalência de Capitais',
        'descricao': 'Tabela Price (prestações constantes) e SAC (amortização constante); fluxo de caixa, valor presente e valor futuro; equivalência de capitais em diferentes datas focais.'
    },
]

QUESTOES = {
    'Juros Simples e Compostos': [
        {
            'enunciado': 'Um capital de R$ 5.000,00 foi aplicado a juros simples à taxa de 2% ao mês durante 8 meses. Qual o montante obtido ao final do período?',
            'opcoes': ['A) R$ 5.600,00', 'B) R$ 5.700,00', 'C) R$ 5.800,00', 'D) R$ 5.900,00', 'E) R$ 6.000,00'],
            'resposta': 'C',
            'explicacao': 'Passo 1: J = C·i·n = 5000 · 0,02 · 8 = 800. Passo 2: M = C + J = 5000 + 800 = 5800. Resultado: R$ 5.800,00.',
            'dica': 'Fórmula: M = C·(1 + i·n) no regime de juros simples.',
            'dificuldade': 'fácil',
            'fonte': 'FCC',
            'ano': 2023,
            'titulo': 'FCC/TRT/2023 - Juros Simples'
        },
        {
            'enunciado': 'Uma pessoa aplicou R$ 10.000,00 a juros compostos pelo prazo de 2 anos à taxa de 10% ao ano. O montante final será de:',
            'opcoes': ['A) R$ 11.000,00', 'B) R$ 11.500,00', 'C) R$ 12.000,00', 'D) R$ 12.100,00', 'E) R$ 12.500,00'],
            'resposta': 'D',
            'explicacao': 'Passo 1: M = C·(1+i)^n = 10000·(1,10)^2. Passo 2: (1,10)^2 = 1,21. Passo 3: M = 10000 · 1,21 = 12100. Resultado: R$ 12.100,00.',
            'dica': 'Fórmula: M = C·(1 + i)^n no regime de juros compostos.',
            'dificuldade': 'fácil',
            'fonte': 'CESPE',
            'ano': 2024,
            'titulo': 'CESPE/BB/2024 - Juros Compostos'
        },
        {
            'enunciado': 'No regime de juros simples, se aplicarmos um capital por um prazo inferior a um período de capitalização, o montante obtido será sempre maior do que o obtido no regime de juros compostos com a mesma taxa nominal. (Verdadeiro ou Falso?)',
            'opcoes': ['A) Verdadeiro', 'B) Falso'],
            'resposta': 'A',
            'explicacao': 'Para n < 1, vale (1+i·n) > (1+i)^n, ou seja, juros simples rende mais que juros compostos em prazos fracionários inferiores ao período de capitalização. Para n = 1 são iguais; para n > 1 compostos supera simples.',
            'dica': 'Comparação simples × compostos: simples > compostos para 0 < n < 1; iguais em n = 1; compostos > simples para n > 1.',
            'dificuldade': 'médio',
            'fonte': 'FGV',
            'ano': 2022,
            'titulo': 'FGV/Senado/2022 - Comparação de Regimes'
        },
        {
            'enunciado': 'A taxa de 24% ao ano, no regime de juros simples, equivale a qual taxa mensal proporcional?',
            'opcoes': ['A) 1% ao mês', 'B) 1,5% ao mês', 'C) 2% ao mês', 'D) 2,4% ao mês', 'E) 3% ao mês'],
            'resposta': 'C',
            'explicacao': 'Passo 1: Em juros simples, taxas proporcionais são obtidas por divisão direta. Passo 2: i_mensal = 24%/12 = 2%. Resultado: 2% ao mês.',
            'dica': 'Em juros simples taxas equivalentes = taxas proporcionais (i_a / k).',
            'dificuldade': 'fácil',
            'fonte': 'FCC',
            'ano': 2023,
            'titulo': 'FCC/SEFAZ/2023 - Taxas Proporcionais'
        },
        {
            'enunciado': 'Qual a taxa anual equivalente, no regime de juros compostos, à taxa mensal de 1%? (Use (1,01)^12 ≈ 1,1268)',
            'opcoes': ['A) 10,00% a.a.', 'B) 11,00% a.a.', 'C) 12,00% a.a.', 'D) 12,68% a.a.', 'E) 13,50% a.a.'],
            'resposta': 'D',
            'explicacao': 'Passo 1: i_a = (1 + i_m)^12 − 1. Passo 2: (1,01)^12 ≈ 1,1268. Passo 3: i_a ≈ 1,1268 − 1 = 0,1268 = 12,68%. Resultado: 12,68% a.a.',
            'dica': 'Em juros compostos: (1 + i_a) = (1 + i_m)^12.',
            'dificuldade': 'médio',
            'fonte': 'CESPE',
            'ano': 2023,
            'titulo': 'CESPE/CGU/2023 - Taxa Equivalente Composta'
        },
        {
            'enunciado': 'Um capital aplicado a juros simples por 10 meses, à taxa de 3% ao mês, gerou juros de R$ 1.500,00. Qual foi o capital aplicado?',
            'opcoes': ['A) R$ 4.000,00', 'B) R$ 4.500,00', 'C) R$ 5.000,00', 'D) R$ 5.500,00', 'E) R$ 6.000,00'],
            'resposta': 'C',
            'explicacao': 'Passo 1: J = C·i·n → 1500 = C · 0,03 · 10. Passo 2: 1500 = 0,30·C. Passo 3: C = 1500/0,30 = 5000. Resultado: R$ 5.000,00.',
            'dica': 'Isolando C na fórmula: C = J / (i·n).',
            'dificuldade': 'fácil',
            'fonte': 'FGV',
            'ano': 2024,
            'titulo': 'FGV/Pref/2024 - Cálculo do Capital'
        },
        {
            'enunciado': 'Um investidor aplicou R$ 8.000,00 a juros compostos durante 3 anos e obteve um montante de R$ 10.648,00. Qual foi a taxa anual de juros?',
            'opcoes': ['A) 8% a.a.', 'B) 9% a.a.', 'C) 10% a.a.', 'D) 11% a.a.', 'E) 12% a.a.'],
            'resposta': 'C',
            'explicacao': 'Passo 1: M/C = (1+i)^n → 10648/8000 = 1,331. Passo 2: 1,331 = (1+i)^3 → 1+i = ∛1,331 = 1,10. Passo 3: i = 0,10 = 10%. Resultado: 10% a.a.',
            'dica': 'Para isolar i: (1+i) = (M/C)^(1/n).',
            'dificuldade': 'médio',
            'fonte': 'CESPE',
            'ano': 2024,
            'titulo': 'CESPE/TCU/2024 - Cálculo da Taxa'
        },
        {
            'enunciado': 'Um título de R$ 2.000,00 foi aplicado a juros simples à taxa de 5% ao mês. Em quantos meses o montante atingirá R$ 3.000,00?',
            'opcoes': ['A) 8 meses', 'B) 9 meses', 'C) 10 meses', 'D) 12 meses', 'E) 15 meses'],
            'resposta': 'C',
            'explicacao': 'Passo 1: J = M − C = 3000 − 2000 = 1000. Passo 2: J = C·i·n → 1000 = 2000·0,05·n. Passo 3: 1000 = 100·n → n = 10. Resultado: 10 meses.',
            'dica': 'Para isolar n: n = J / (C·i).',
            'dificuldade': 'fácil',
            'fonte': 'FCC',
            'ano': 2022,
            'titulo': 'FCC/TRT/2022 - Cálculo do Prazo'
        },
        {
            'enunciado': 'João aplicou R$ 4.000,00 e Maria aplicou R$ 5.000,00, ambos a juros compostos pela mesma taxa de 5% ao mês. Após 2 meses, qual a diferença entre os montantes de Maria e João? (Use (1,05)^2 = 1,1025)',
            'opcoes': ['A) R$ 1.000,00', 'B) R$ 1.102,50', 'C) R$ 1.205,00', 'D) R$ 1.500,00', 'E) R$ 2.205,00'],
            'resposta': 'B',
            'explicacao': 'Passo 1: M_João = 4000·1,1025 = 4410,00. Passo 2: M_Maria = 5000·1,1025 = 5512,50. Passo 3: Diferença = 5512,50 − 4410,00 = 1102,50. Resultado: R$ 1.102,50.',
            'dica': 'A diferença entre montantes = (diferença entre capitais)·(1+i)^n. Aqui: 1000·1,1025 = 1.102,50.',
            'dificuldade': 'médio',
            'fonte': 'FGV',
            'ano': 2023,
            'titulo': 'FGV/Banco/2023 - Comparação de Aplicações'
        },
        {
            'enunciado': 'Uma aplicação de R$ 1.000,00 rende juros compostos a 20% ao ano. Após quantos anos, aproximadamente, o capital dobrará? (Use log 2 ≈ 0,301 e log 1,2 ≈ 0,079)',
            'opcoes': ['A) Cerca de 3 anos', 'B) Cerca de 3,8 anos', 'C) Cerca de 5 anos', 'D) Cerca de 6 anos', 'E) Cerca de 7,2 anos'],
            'resposta': 'B',
            'explicacao': 'Passo 1: 2C = C·(1,2)^n → (1,2)^n = 2. Passo 2: n·log(1,2) = log 2. Passo 3: n = 0,301/0,079 ≈ 3,81. Resultado: ≈ 3,8 anos.',
            'dica': 'Para resolver (1+i)^n = k, use n = log(k) / log(1+i).',
            'dificuldade': 'difícil',
            'fonte': 'CESPE',
            'ano': 2024,
            'titulo': 'CESPE/BACEN/2024 - Tempo para Dobrar Capital'
        },
    ],

    'Porcentagem, Aumentos e Descontos': [
        {
            'enunciado': 'Em uma loja, uma camisa custa R$ 80,00. Durante uma promoção, ela teve um desconto de 15%. Qual o novo preço da camisa?',
            'opcoes': ['A) R$ 65,00', 'B) R$ 67,00', 'C) R$ 68,00', 'D) R$ 70,00', 'E) R$ 72,00'],
            'resposta': 'C',
            'explicacao': 'Passo 1: Desconto = 80 · 0,15 = 12. Passo 2: Preço final = 80 − 12 = 68. Alternativa: 80·(1−0,15) = 80·0,85 = 68. Resultado: R$ 68,00.',
            'dica': 'Fator de desconto: P_final = P_inicial · (1 − d).',
            'dificuldade': 'fácil',
            'fonte': 'FCC',
            'ano': 2023,
            'titulo': 'FCC/Pref/2023 - Desconto Simples'
        },
        {
            'enunciado': 'O salário de um servidor sofreu um aumento de 20%, depois um novo aumento de 10% sobre o valor já reajustado. O aumento percentual total foi de:',
            'opcoes': ['A) 28%', 'B) 30%', 'C) 32%', 'D) 33%', 'E) 35%'],
            'resposta': 'C',
            'explicacao': 'Passo 1: Fator total = 1,20 · 1,10 = 1,32. Passo 2: Aumento total = 1,32 − 1 = 0,32 = 32%. Resultado: 32%.',
            'dica': 'Aumentos sucessivos não somam: multiplique os fatores (1+i1)·(1+i2).',
            'dificuldade': 'médio',
            'fonte': 'CESPE',
            'ano': 2023,
            'titulo': 'CESPE/INSS/2023 - Aumentos Sucessivos'
        },
        {
            'enunciado': 'Uma mercadoria sofreu dois descontos sucessivos de 20% e 25%. O desconto único equivalente foi de:',
            'opcoes': ['A) 40%', 'B) 42%', 'C) 45%', 'D) 50%', 'E) 55%'],
            'resposta': 'A',
            'explicacao': 'Passo 1: Fator final = 0,80 · 0,75 = 0,60. Passo 2: Desconto equivalente = 1 − 0,60 = 0,40 = 40%. Resultado: 40%.',
            'dica': 'Descontos sucessivos: multiplique (1−d1)·(1−d2) e o desconto único é 1 menos esse produto.',
            'dificuldade': 'médio',
            'fonte': 'FGV',
            'ano': 2024,
            'titulo': 'FGV/SEFAZ/2024 - Descontos Sucessivos'
        },
        {
            'enunciado': 'Um comerciante compra um produto por R$ 200,00 e deseja obter um lucro de 25% sobre o preço de venda. Qual deve ser o preço de venda?',
            'opcoes': ['A) R$ 240,00', 'B) R$ 250,00', 'C) R$ 260,00', 'D) R$ 266,67', 'E) R$ 280,00'],
            'resposta': 'D',
            'explicacao': 'Passo 1: PV = PC + 0,25·PV → 0,75·PV = 200. Passo 2: PV = 200 / 0,75 ≈ 266,67. Resultado: R$ 266,67.',
            'dica': 'Lucro sobre venda: PV = PC / (1 − margem). Lucro sobre custo: PV = PC · (1 + margem).',
            'dificuldade': 'difícil',
            'fonte': 'CESPE',
            'ano': 2024,
            'titulo': 'CESPE/SEFAZ/2024 - Lucro sobre Venda'
        },
        {
            'enunciado': 'Um produto custava R$ 500,00 e teve seu preço aumentado em 40%. Para que o preço retorne ao valor original, qual deve ser o desconto aplicado sobre o novo preço?',
            'opcoes': ['A) 25,00%', 'B) 28,57%', 'C) 30,00%', 'D) 35,00%', 'E) 40,00%'],
            'resposta': 'B',
            'explicacao': 'Passo 1: Novo preço = 500·1,40 = 700. Passo 2: Para voltar a 500, desconto = (700 − 500)/700 = 200/700 ≈ 0,2857. Resultado: ≈ 28,57%.',
            'dica': 'Desconto = (Novo − Original) / Novo · 100%.',
            'dificuldade': 'médio',
            'fonte': 'FCC',
            'ano': 2023,
            'titulo': 'FCC/TRT/2023 - Aumento e Desconto Reverso'
        },
        {
            'enunciado': 'No desconto comercial simples (por fora), o desconto é calculado sobre o valor nominal do título; no desconto racional simples (por dentro), é calculado sobre o valor atual (presente) do título. Para uma mesma taxa e prazo, o desconto racional é sempre maior que o desconto comercial. (Verdadeiro ou Falso?)',
            'opcoes': ['A) Verdadeiro', 'B) Falso'],
            'resposta': 'B',
            'explicacao': 'O desconto comercial (por fora) incide sobre o valor nominal (maior) e portanto é maior que o desconto racional (por dentro), que incide sobre o valor atual (menor). Logo, D_comercial > D_racional. A afirmação inverteu a relação.',
            'dica': 'Memorize: D_comercial = N·d·n; D_racional = N·d·n / (1+d·n). Sempre D_c > D_r.',
            'dificuldade': 'médio',
            'fonte': 'CESPE',
            'ano': 2022,
            'titulo': 'CESPE/CGU/2022 - Desconto Comercial × Racional'
        },
        {
            'enunciado': 'Uma duplicata de R$ 10.000,00 foi descontada 3 meses antes do vencimento, à taxa de desconto comercial simples de 4% ao mês. Qual o valor líquido recebido?',
            'opcoes': ['A) R$ 8.500,00', 'B) R$ 8.700,00', 'C) R$ 8.800,00', 'D) R$ 8.900,00', 'E) R$ 9.200,00'],
            'resposta': 'C',
            'explicacao': 'Passo 1: D = N·d·n = 10000·0,04·3 = 1200. Passo 2: Valor líquido = N − D = 10000 − 1200 = 8800. Resultado: R$ 8.800,00.',
            'dica': 'Desconto comercial simples: D = N·d·n; Valor atual = N·(1 − d·n).',
            'dificuldade': 'médio',
            'fonte': 'FGV',
            'ano': 2023,
            'titulo': 'FGV/Banco/2023 - Desconto de Duplicata'
        },
        {
            'enunciado': 'O preço de um produto subiu 50% e em seguida caiu 50%. Qual a variação percentual total em relação ao preço original?',
            'opcoes': ['A) 0% (preço retornou ao original)', 'B) Aumento de 25%', 'C) Queda de 25%', 'D) Queda de 50%', 'E) Aumento de 50%'],
            'resposta': 'C',
            'explicacao': 'Passo 1: Fator total = 1,50 · 0,50 = 0,75. Passo 2: Variação = 0,75 − 1 = −0,25 = −25%. Resultado: queda de 25%.',
            'dica': 'Aumento e queda do mesmo percentual NÃO se anulam: o resultado é uma queda igual ao quadrado da taxa.',
            'dificuldade': 'fácil',
            'fonte': 'FCC',
            'ano': 2024,
            'titulo': 'FCC/Pref/2024 - Variações Percentuais'
        },
        {
            'enunciado': 'Em uma empresa, 60% dos funcionários são homens. Sabendo-se que 40% dos homens e 30% das mulheres possuem nível superior, qual o percentual total de funcionários com nível superior?',
            'opcoes': ['A) 32%', 'B) 35%', 'C) 36%', 'D) 38%', 'E) 40%'],
            'resposta': 'C',
            'explicacao': 'Passo 1: Homens com superior = 0,60·0,40 = 0,24 = 24%. Passo 2: Mulheres com superior = 0,40·0,30 = 0,12 = 12%. Passo 3: Total = 24% + 12% = 36%. Resultado: 36%.',
            'dica': 'Em problemas de subgrupos, multiplique a fração do grupo pela fração interna e some.',
            'dificuldade': 'médio',
            'fonte': 'CESPE',
            'ano': 2023,
            'titulo': 'CESPE/IBGE/2023 - Porcentagem de Subgrupos'
        },
        {
            'enunciado': 'Uma loja vende um produto por R$ 360,00, sobre o qual incidem 8% de impostos (calculados sobre o preço de venda) e 20% de comissão do vendedor (calculada sobre o preço de venda). Se o custo de aquisição é R$ 200,00, qual o lucro líquido obtido pela loja em cada unidade vendida?',
            'opcoes': ['A) R$ 30,80', 'B) R$ 50,80', 'C) R$ 59,20', 'D) R$ 60,00', 'E) R$ 100,80'],
            'resposta': 'C',
            'explicacao': 'Passo 1: Impostos = 0,08·360 = 28,80. Passo 2: Comissão = 0,20·360 = 72,00. Passo 3: Receita líquida = 360 − 28,80 − 72,00 = 259,20. Passo 4: Lucro líquido = 259,20 − 200 = 59,20. Resultado: R$ 59,20.',
            'dica': 'Lucro líquido = Receita − Impostos − Comissões − Custo de aquisição.',
            'dificuldade': 'difícil',
            'fonte': 'FGV',
            'ano': 2024,
            'titulo': 'FGV/SEFAZ/2024 - Lucro Bruto × Líquido'
        },
    ],

    'Sistemas de Amortização e Equivalência de Capitais': [
        {
            'enunciado': 'No Sistema de Amortização Constante (SAC), a parcela de amortização do principal é igual em todas as prestações, enquanto os juros decrescem ao longo do tempo, fazendo com que a prestação total também decresça. (Verdadeiro ou Falso?)',
            'opcoes': ['A) Verdadeiro', 'B) Falso'],
            'resposta': 'A',
            'explicacao': 'No SAC, a amortização (A) é constante: A = PV/n. Como o saldo devedor decresce, os juros (que incidem sobre o saldo) também decrescem; logo, a prestação (A + J_k) decresce a cada período. A afirmação está correta.',
            'dica': 'SAC: amortização constante, juros e prestações decrescentes. Price: prestação constante, juros decrescentes e amortizações crescentes.',
            'dificuldade': 'fácil',
            'fonte': 'CESPE',
            'ano': 2024,
            'titulo': 'CESPE/BB/2024 - Conceitos SAC × Price'
        },
        {
            'enunciado': 'Um financiamento de R$ 60.000,00 será pago em 6 parcelas mensais pelo SAC, à taxa de 2% ao mês. Qual o valor da primeira prestação?',
            'opcoes': ['A) R$ 10.000,00', 'B) R$ 10.600,00', 'C) R$ 11.000,00', 'D) R$ 11.200,00', 'E) R$ 12.000,00'],
            'resposta': 'D',
            'explicacao': 'Passo 1: Amortização A = 60000/6 = 10000. Passo 2: Juros do 1º mês = 60000·0,02 = 1200. Passo 3: 1ª prestação = A + J = 10000 + 1200 = 11200. Resultado: R$ 11.200,00.',
            'dica': 'SAC, 1ª parcela: P_1 = A + i·SD_inicial, onde A = PV/n.',
            'dificuldade': 'médio',
            'fonte': 'FCC',
            'ano': 2023,
            'titulo': 'FCC/CEF/2023 - Primeira Parcela SAC'
        },
        {
            'enunciado': 'No Sistema Price, um financiamento de R$ 10.000,00 deve ser pago em 4 parcelas mensais iguais, à taxa de 5% ao mês. Qual o valor da prestação? (Use a^(-4)|5% = 3,5460)',
            'opcoes': ['A) R$ 2.500,00', 'B) R$ 2.620,11', 'C) R$ 2.820,11', 'D) R$ 2.910,00', 'E) R$ 3.000,00'],
            'resposta': 'C',
            'explicacao': 'Passo 1: PMT = PV / a_n|i. Passo 2: PMT = 10000 / 3,5460 ≈ 2820,11. Resultado: R$ 2.820,11.',
            'dica': 'Tabela Price: PMT = PV · [i·(1+i)^n] / [(1+i)^n − 1] = PV / a_n|i.',
            'dificuldade': 'médio',
            'fonte': 'CESPE',
            'ano': 2024,
            'titulo': 'CESPE/CEF/2024 - Prestação Price'
        },
        {
            'enunciado': 'Qual o valor presente de um pagamento único de R$ 12.100,00 a ser realizado daqui a 2 anos, considerando uma taxa de juros compostos de 10% ao ano?',
            'opcoes': ['A) R$ 9.500,00', 'B) R$ 10.000,00', 'C) R$ 10.500,00', 'D) R$ 11.000,00', 'E) R$ 11.500,00'],
            'resposta': 'B',
            'explicacao': 'Passo 1: PV = FV / (1+i)^n. Passo 2: PV = 12100 / (1,10)^2 = 12100 / 1,21. Passo 3: PV = 10000. Resultado: R$ 10.000,00.',
            'dica': 'Valor presente: PV = FV / (1 + i)^n.',
            'dificuldade': 'fácil',
            'fonte': 'FGV',
            'ano': 2023,
            'titulo': 'FGV/Banco/2023 - Valor Presente'
        },
        {
            'enunciado': 'Dois capitais são equivalentes a 5% ao mês (juros compostos): R$ X hoje e R$ 1.102,50 daqui a 2 meses. Qual o valor de X?',
            'opcoes': ['A) R$ 950,00', 'B) R$ 980,00', 'C) R$ 1.000,00', 'D) R$ 1.050,00', 'E) R$ 1.100,00'],
            'resposta': 'C',
            'explicacao': 'Passo 1: X = 1102,50 / (1,05)^2. Passo 2: (1,05)^2 = 1,1025. Passo 3: X = 1102,50 / 1,1025 = 1000. Resultado: R$ 1.000,00.',
            'dica': 'Equivalência de capitais (compostos): basta levar todos para a mesma data focal usando (1+i)^n.',
            'dificuldade': 'médio',
            'fonte': 'CESPE',
            'ano': 2023,
            'titulo': 'CESPE/BACEN/2023 - Equivalência de Capitais'
        },
        {
            'enunciado': 'Um financiamento de R$ 100.000,00 é pago em 10 prestações anuais pelo SAC, com taxa de 8% ao ano. Qual o valor dos juros pagos na 3ª prestação?',
            'opcoes': ['A) R$ 6.400,00', 'B) R$ 6.800,00', 'C) R$ 7.200,00', 'D) R$ 7.600,00', 'E) R$ 8.000,00'],
            'resposta': 'A',
            'explicacao': 'Passo 1: A = 100000/10 = 10000. Passo 2: Saldo após 2 amortizações = 100000 − 2·10000 = 80000. Passo 3: Juros do 3º período = 80000·0,08 = 6400. Resultado: R$ 6.400,00.',
            'dica': 'No SAC: Juros do k-ésimo período = i · SD_(k-1) = i · [PV − (k−1)·A].',
            'dificuldade': 'médio',
            'fonte': 'FCC',
            'ano': 2024,
            'titulo': 'FCC/CEF/2024 - Juros no SAC'
        },
        {
            'enunciado': 'Uma série uniforme de 5 pagamentos mensais de R$ 1.000,00, postecipados, à taxa de 2% ao mês. Qual o valor presente da série? (Use a_5|2% = 4,7135)',
            'opcoes': ['A) R$ 4.500,00', 'B) R$ 4.713,50', 'C) R$ 4.900,00', 'D) R$ 5.000,00', 'E) R$ 5.204,00'],
            'resposta': 'B',
            'explicacao': 'Passo 1: PV = PMT · a_n|i. Passo 2: PV = 1000 · 4,7135 = 4713,50. Resultado: R$ 4.713,50.',
            'dica': 'Série uniforme postecipada: PV = PMT · [(1+i)^n − 1] / [i·(1+i)^n].',
            'dificuldade': 'médio',
            'fonte': 'FGV',
            'ano': 2023,
            'titulo': 'FGV/SEFAZ/2023 - Valor Presente de Série'
        },
        {
            'enunciado': 'No Sistema Price, considere um financiamento de R$ 1.000,00 em 2 prestações mensais iguais a R$ 576,19, à taxa de 10% ao mês. Qual o valor da amortização contida na 1ª parcela?',
            'opcoes': ['A) R$ 100,00', 'B) R$ 376,19', 'C) R$ 476,19', 'D) R$ 500,00', 'E) R$ 576,19'],
            'resposta': 'C',
            'explicacao': 'Passo 1: Juros do 1º mês = 1000·0,10 = 100,00. Passo 2: Amortização_1 = Prestação − Juros = 576,19 − 100,00 = 476,19. Resultado: R$ 476,19.',
            'dica': 'Em qualquer sistema: A_k = PMT_k − J_k, onde J_k = i · SD_(k−1).',
            'dificuldade': 'difícil',
            'fonte': 'CESPE',
            'ano': 2024,
            'titulo': 'CESPE/CEF/2024 - Amortização Price'
        },
        {
            'enunciado': 'Um investidor depositará R$ 500,00 ao final de cada mês durante 12 meses em uma aplicação que rende 1% ao mês (juros compostos). Qual o montante acumulado ao final do 12º mês? (Use s_12|1% = 12,6825)',
            'opcoes': ['A) R$ 6.000,00', 'B) R$ 6.341,25', 'C) R$ 6.500,00', 'D) R$ 6.700,50', 'E) R$ 7.000,00'],
            'resposta': 'B',
            'explicacao': 'Passo 1: FV = PMT · s_n|i. Passo 2: FV = 500 · 12,6825 = 6341,25. Resultado: R$ 6.341,25.',
            'dica': 'Montante de série uniforme postecipada: FV = PMT · [(1+i)^n − 1] / i.',
            'dificuldade': 'médio',
            'fonte': 'FCC',
            'ano': 2023,
            'titulo': 'FCC/CEF/2023 - Montante de Série Uniforme'
        },
        {
            'enunciado': 'Pedro tem duas dívidas: R$ 5.000,00 vencendo em 1 mês e R$ 8.000,00 vencendo em 3 meses. Pretende substituí-las por um único pagamento ao final de 2 meses. Considerando juros compostos de 10% ao mês, qual o valor desse pagamento único? (Use 1,10 e 1,1^(-1) ≈ 0,9091)',
            'opcoes': ['A) R$ 12.500,00', 'B) R$ 12.772,73', 'C) R$ 12.800,00', 'D) R$ 13.000,00', 'E) R$ 13.272,73'],
            'resposta': 'B',
            'explicacao': 'Passo 1: Levar 5000 (em t=1) para t=2: 5000·1,10 = 5500. Passo 2: Trazer 8000 (em t=3) para t=2: 8000/1,10 ≈ 7272,73. Passo 3: Pagamento único = 5500 + 7272,73 = 12772,73. Resultado: R$ 12.772,73.',
            'dica': 'Equivalência: leve cada fluxo até a data focal usando (1+i)^Δn (frente) ou (1+i)^(-Δn) (trás) e some.',
            'dificuldade': 'difícil',
            'fonte': 'FGV',
            'ano': 2024,
            'titulo': 'FGV/Banco/2024 - Equivalência com Data Focal'
        },
    ],
}
