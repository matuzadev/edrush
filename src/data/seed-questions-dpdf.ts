import type { SeedDifficulty, SeedQuestion } from './seed-questions';

type Fact = readonly [concept: string, meaning: string, application: string];
type ChapterFacts = { chapter: string; facts: readonly Fact[] };
type SubjectFacts = { subject: string; chapters: readonly ChapterFacts[] };

const COMMON_FACTS: SubjectFacts[] = [
  {
    subject: 'dpdf-conhecimentos-basicos',
    chapters: [
      {
        chapter: 'Língua Portuguesa',
        facts: [
          ['Tese', 'É a ideia central que o autor procura defender.', 'Uma redação sustenta que ampliar a assistência jurídica reduz barreiras de acesso à Justiça.'],
          ['Coesão referencial', 'Retoma ou antecipa elementos do texto por pronomes, sinônimos ou expressões equivalentes.', 'Para evitar repetir “a Defensoria”, um parágrafo usa “a instituição” para retomar o mesmo referente.'],
          ['Coesão sequencial', 'Conecta partes do texto por articuladores que indicam relações lógico-semânticas.', 'A expressão “portanto” introduz uma conclusão decorrente do argumento anterior.'],
          ['Concordância verbal', 'A forma verbal deve concordar com o núcleo do sujeito, observadas as regras aplicáveis.', 'Na frase “as equipes realizaram o atendimento”, o verbo acompanha o núcleo plural “equipes”.'],
          ['Regência verbal', 'Define a relação entre o verbo e seus complementos, inclusive a preposição exigida.', 'Na construção “o servidor obedeceu à orientação”, o verbo exige a preposição “a”.'],
          ['Crase', 'Assinala a fusão da preposição “a” com o artigo ou pronome demonstrativo iniciado por “a”, quando exigida.', 'A redação registra que o atendimento foi prestado “à comunidade”, com preposição exigida e artigo feminino.'],
          ['Pontuação', 'Organiza a estrutura sintática e os sentidos do texto, sem separar indevidamente termos que mantêm relação direta.', 'O revisor retira a vírgula entre sujeito e verbo em “A equipe de atendimento, analisou o pedido”.'],
          ['Concordância nominal', 'Estabelece a correspondência de gênero e número entre nomes e seus determinantes ou modificadores.', 'Na expressão “medidas necessárias”, o adjetivo concorda em gênero e número com o substantivo.'],
          ['Inferência textual', 'É conclusão construída a partir de pistas do texto, sem se confundir com informação explicitamente declarada.', 'O leitor conclui que o serviço foi ampliado ao comparar a informação atual com a situação anterior descrita.'],
          ['Coerência', 'É a unidade de sentido do texto, construída pela compatibilidade lógica entre suas ideias e o contexto.', 'O autor revisa uma conclusão que contradizia os argumentos apresentados nos parágrafos anteriores.'],
        ],
      },
      {
        chapter: 'Organização e legislação aplicada à DPDF',
        facts: [
          ['Acesso à Justiça', 'Compreende meios efetivos para que as pessoas conheçam e exerçam seus direitos.', 'Uma unidade oferece orientação e representação jurídica a uma pessoa sem recursos para contratar advogado.'],
          ['Assistência jurídica integral e gratuita', 'A Constituição assegura assistência jurídica a quem comprovar insuficiência de recursos.', 'Uma pessoa hipossuficiente recebe orientação e defesa judicial sem custear o serviço.'],
          ['Missão institucional da Defensoria', 'A Defensoria presta orientação jurídica, promove direitos humanos e atua na defesa judicial e extrajudicial dos necessitados.', 'Uma equipe acompanha uma negociação extrajudicial e também ajuíza medida para proteger pessoa vulnerável.'],
          ['Atuação extrajudicial', 'A proteção de direitos pode ocorrer fora do processo judicial, por orientação, mediação ou solução consensual.', 'Antes de ajuizar ação, a equipe promove reunião entre as partes para buscar acordo voluntário.'],
          ['Defesa de direitos individuais e coletivos', 'A atuação institucional pode proteger tanto uma pessoa quanto grupos atingidos por lesão comum.', 'Uma ação busca corrigir falha de atendimento que afeta simultaneamente usuários de um serviço público.'],
          ['Autonomia funcional', 'Assegura independência técnica no exercício das funções institucionais, nos limites constitucionais e legais.', 'A defensora forma convicção jurídica com independência, sem receber ordens sobre o conteúdo de sua atuação processual.'],
          ['Unidade institucional', 'Expressa que a Defensoria é instituição una, embora organizada em órgãos e unidades de atuação.', 'Uma pessoa atendida pode ter seu caso encaminhado entre unidades sem que isso crie instituições distintas.'],
          ['Indivisibilidade institucional', 'Permite substituição de membros no exercício das funções sem prejuízo da continuidade institucional, conforme a lei.', 'A distribuição interna permite que outro membro dê continuidade ao atendimento dentro das regras institucionais.'],
          ['Promoção dos direitos humanos', 'Integra as funções institucionais da Defensoria e orienta atuação para proteger a dignidade e direitos das pessoas.', 'Uma equipe documenta e encaminha denúncia de violação de direitos de grupo em situação de vulnerabilidade.'],
          ['Vulnerabilidade', 'É condição que pode dificultar o exercício de direitos e deve ser considerada na organização da orientação e da defesa.', 'O atendimento adapta linguagem e procedimento para permitir que pessoa vulnerável compreenda e exerça seus direitos.'],
        ],
      },
      {
        chapter: 'Noções de Direito Constitucional e Administrativo',
        facts: [
          ['Dignidade da pessoa humana', 'É fundamento constitucional que orienta a proteção da pessoa e a interpretação dos direitos fundamentais.', 'Uma política pública é revisada para preservar condições mínimas de atendimento às pessoas vulneráveis.'],
          ['Princípio da legalidade administrativa', 'O agente público deve atuar conforme a lei e dentro das competências que ela lhe atribui.', 'Um servidor deixa de criar requisito de atendimento que não está previsto em norma.'],
          ['Impessoalidade', 'Veda favorecimentos e perseguições e exige atuação orientada ao interesse público.', 'A ordem de atendimento segue critérios objetivos, sem preferência por conhecidos da equipe.'],
          ['Publicidade', 'A administração deve dar transparência aos atos, ressalvadas hipóteses legais de sigilo.', 'O órgão publica critérios e resultados de seleção, preservando dados pessoais protegidos.'],
          ['Contraditório e ampla defesa', 'Em processo que possa afetar direitos, a pessoa deve conhecer os atos e ter oportunidade efetiva de resposta e defesa.', 'Antes de decidir medida desfavorável, a autoridade comunica a acusação e permite apresentação de documentos.'],
          ['Eficiência administrativa', 'Exige atuação orientada a resultados e uso adequado de recursos, sem afastar a legalidade e os demais princípios.', 'A unidade reorganiza etapas repetidas para reduzir demora sem eliminar verificações obrigatórias.'],
          ['Concurso público', 'É regra constitucional de acesso a cargos e empregos públicos, ressalvadas as hipóteses previstas na Constituição.', 'Uma administração seleciona servidor efetivo por aprovação em concurso público conforme a natureza do cargo.'],
          ['Devido processo legal', 'Impede privação de liberdade ou bens sem processo adequado e garante proteção processual e material.', 'Uma sanção administrativa é precedida de procedimento com regras, motivação e oportunidade de defesa.'],
          ['Motivação do ato', 'Expõe os fundamentos de fato e de direito que sustentam a decisão administrativa quando exigida.', 'A autoridade apresenta razões verificáveis para indeferir pedido e indica a norma aplicável.'],
          ['Separação de poderes', 'Distribui funções estatais entre Poderes independentes e harmônicos, com mecanismos constitucionais de controle recíproco.', 'Uma questão distingue a função administrativa do Executivo da função legislativa do Parlamento.'],
        ],
      },
      {
        chapter: 'Realidade étnica, social, histórica, geográfica, cultural e político-econômica do DF e da RIDE',
        facts: [
          ['Distrito Federal', 'É ente federativo autônomo que acumula competências legislativas estaduais e municipais, conforme a Constituição.', 'Uma questão distingue a organização federativa do DF da de um município comum.'],
          ['Regiões Administrativas', 'Organizam administrativamente o território do DF e não constituem municípios autônomos.', 'Um candidato identifica que uma Região Administrativa não possui prefeito nem câmara municipal própria.'],
          ['RIDE-DF', 'A Região Integrada de Desenvolvimento do Distrito Federal e Entorno articula entes federativos para enfrentar questões de interesse regional comum.', 'Governos cooperam em ações de transporte e saúde que produzem efeitos além dos limites do DF.'],
          ['Migração e formação do DF', 'Fluxos migratórios de diferentes regiões do país contribuíram para a composição social e cultural do Distrito Federal.', 'Uma análise relaciona a diversidade cultural local às trajetórias de famílias que migraram para a construção e expansão de Brasília.'],
          ['Integração metropolitana', 'Deslocamentos cotidianos entre o DF e municípios do Entorno conectam mercados de trabalho e serviços públicos.', 'Uma política de mobilidade considera moradores que residem em município goiano e trabalham no DF.'],
          ['Brasília como capital federal', 'Brasília é a capital federal e sede dos Poderes da União, conforme a organização constitucional brasileira.', 'Uma questão diferencia a capital do país da sede de um governo estadual.'],
          ['Urbanização do DF', 'O crescimento urbano do DF envolve o Plano Piloto e diversas áreas urbanas com dinâmicas sociais e econômicas próprias.', 'Um estudo compara acesso a serviços e expansão urbana em diferentes partes do território distrital.'],
          ['Mobilidade pendular', 'É o deslocamento recorrente entre local de residência e local de trabalho ou estudo, frequentemente entre municípios próximos.', 'Moradores do Entorno viajam diariamente ao DF para trabalhar e retornam às suas residências.'],
          ['Desigualdade socioespacial', 'Refere-se à distribuição desigual de recursos, serviços e oportunidades entre áreas e grupos sociais.', 'Um diagnóstico identifica diferenças de acesso a transporte e equipamentos públicos entre regiões.'],
          ['Cooperação interfederativa', 'Coordena ações de diferentes entes federativos em temas que ultrapassam os limites administrativos de cada um.', 'DF, Goiás e municípios do Entorno planejam conjuntamente serviço com demanda regional compartilhada.'],
        ],
      },
      {
        chapter: 'Ética no serviço público',
        facts: [
          ['Probidade', 'Exige honestidade e integridade no exercício da função pública.', 'Um agente recusa vantagem oferecida para alterar a ordem de análise de um pedido.'],
          ['Conflito de interesses', 'Ocorre quando interesse privado pode comprometer a imparcialidade ou o interesse público no exercício da função.', 'Uma servidora comunica que seu familiar é parte interessada e se afasta da análise do caso.'],
          ['Dever de urbanidade', 'Impõe tratamento respeitoso e adequado às pessoas no serviço público.', 'Mesmo diante de usuário irritado, o atendente explica os procedimentos sem humilhação ou agressividade.'],
          ['Dever de sigilo', 'Protege informação legalmente restrita e dados pessoais acessados em razão do cargo.', 'Um servidor evita compartilhar em grupo informal documento que contém dados de assistido.'],
          ['Responsabilidade funcional', 'O agente deve responder por atos e omissões praticados no exercício das atribuições, conforme o regime aplicável.', 'Ao perceber erro em registro sob sua responsabilidade, a servidora comunica a chefia e providencia correção documentada.'],
          ['Finalidade pública', 'Orienta o uso das competências e dos recursos públicos para os objetivos legalmente previstos.', 'Um agente recusa utilizar veículo oficial em atividade particular sem relação com o serviço.'],
          ['Transparência responsável', 'Promove acesso à informação pública sem divulgar conteúdo protegido por sigilo legal ou privacidade.', 'O órgão publica despesas e resultados, mas oculta dados pessoais cuja divulgação não tem base legal.'],
          ['Imparcialidade', 'Exige decisão sem favorecimento pessoal e com consideração objetiva dos fatos e das regras aplicáveis.', 'A comissão avalia todas as candidaturas pelos mesmos critérios previamente divulgados.'],
          ['Prestação de contas ética', 'Impõe explicar decisões e uso de recursos, com registros suficientes para controle e responsabilização.', 'A gestora documenta a finalidade e os comprovantes de despesa realizada em atividade institucional.'],
          ['Recebimento de vantagem indevida', 'A aceitação de benefício em razão do cargo pode violar deveres de integridade e as normas aplicáveis.', 'Um fornecedor oferece presente de alto valor a agente que participa da decisão de contratação, e este o recusa e comunica o fato.'],
        ],
      },
      {
        chapter: 'Dissertação sobre tema atual de relevância social, jurídica ou administrativa',
        facts: [
          ['Delimitação temática', 'Define o recorte específico do tema para que a dissertação desenvolva uma questão manejável.', 'Diante de “acesso à Justiça”, o texto delimita o impacto da exclusão digital no atendimento jurídico.'],
          ['Tese argumentativa', 'Apresenta a posição que será defendida e orienta a seleção dos argumentos.', 'A introdução afirma que combinar atendimento presencial e digital reduz barreiras sem excluir pessoas com baixa conectividade.'],
          ['Argumento com evidência', 'Sustenta a tese com razões verificáveis, exemplos pertinentes ou dados contextualizados.', 'O texto relaciona uma afirmação sobre desigualdade de acesso a dados identificados e à fonte correspondente.'],
          ['Progressão argumentativa', 'Organiza ideias em sequência lógica, fazendo cada parágrafo contribuir para o desenvolvimento da tese.', 'Após apresentar o problema, o texto explica suas causas e então avalia uma proposta de solução.'],
          ['Conclusão propositiva', 'Retoma a discussão e apresenta encaminhamento coerente com os argumentos desenvolvidos.', 'A conclusão propõe atendimento híbrido e capacitação, medidas que respondem aos obstáculos expostos no texto.'],
          ['Introdução dissertativa', 'Apresenta o tema e conduz o leitor à tese, sem desenvolver de forma dispersa todo o conteúdo do texto.', 'O primeiro parágrafo contextualiza o acesso à Justiça e encerra com a posição que será defendida.'],
          ['Unidade temática do parágrafo', 'Mantém as frases de um parágrafo relacionadas a uma ideia principal identificável.', 'O redator remove uma frase sobre assunto alheio ao argumento desenvolvido naquele parágrafo.'],
          ['Tópico frasal', 'Apresenta a ideia central de um parágrafo e orienta a leitura dos detalhes que a desenvolvem.', 'A primeira frase anuncia que a exclusão digital é uma barreira e as seguintes explicam suas causas.'],
          ['Registro formal', 'Emprega linguagem adequada à situação, com precisão vocabular e respeito às convenções da escrita formal.', 'Na dissertação, o candidato substitui expressão coloquial por formulação objetiva e compatível com o gênero.'],
          ['Articulação de proposta', 'Relaciona uma medida proposta ao problema discutido e explicita como ela contribui para enfrentá-lo.', 'O texto propõe atendimento presencial itinerante para enfrentar a distância de comunidades até os serviços.'],
        ],
      },
    ],
  },
];

const SPECIALTY_FACTS: SubjectFacts[] = [
  {
    subject: 'dpdf-direito-legislacao',
    chapters: [
      {
        chapter: 'Direito Constitucional aprofundado',
        facts: [
          ['Controle concentrado de constitucionalidade', 'Examina a compatibilidade de normas em tese com a Constituição por ações próprias e legitimados definidos constitucionalmente.', 'Um legitimado questiona diretamente, perante o STF, a validade abstrata de uma lei federal em face da Constituição.'],
          ['Repartição de competências', 'Distribui atribuições legislativas e administrativas entre União, estados, Distrito Federal e municípios.', 'Para identificar quem pode legislar sobre determinado tema, a análise parte das competências constitucionais expressas e concorrentes.'],
          ['Eficácia dos direitos fundamentais', 'A aplicação dos direitos fundamentais orienta a atuação estatal e, conforme o caso, também relações entre particulares.', 'Uma instituição interpreta regra interna de modo a compatibilizá-la com a igualdade e a proteção da pessoa.'],
          ['Defensoria Pública na Constituição', 'É instituição essencial à função jurisdicional do Estado e instrumento de orientação jurídica e defesa dos necessitados.', 'Uma questão sobre a posição constitucional da Defensoria a distingue de órgão subordinado ao Poder Judiciário.'],
        ],
      },
      {
        chapter: 'Direito Administrativo aprofundado',
        facts: [
          ['Anulação do ato administrativo', 'Retira ato ilegal do ordenamento, observados competência, devido processo e proteção da confiança nos termos aplicáveis.', 'A administração identifica vício de legalidade em ato próprio e instaura procedimento para invalidá-lo.'],
          ['Revogação do ato administrativo', 'Extingue ato válido por conveniência e oportunidade, respeitados direitos adquiridos e limites legais.', 'Uma autorização discricionária válida deixa de ser conveniente ao interesse público e é retirada com motivação.'],
          ['Poder de polícia', 'Condiciona ou restringe direitos e atividades em benefício do interesse público, dentro dos limites legais.', 'A autoridade aplica medida prevista em lei para impedir atividade que oferece risco à coletividade.'],
          ['Responsabilidade civil objetiva do Estado', 'Em regra, exige dano e nexo causal com atuação de agente público, sem exigir prova de culpa da vítima contra o Estado.', 'Uma pessoa busca reparação por dano causado por agente público no exercício da função e demonstra o nexo com a atuação estatal.'],
        ],
      },
      {
        chapter: 'Direito Civil e Direito Processual Civil',
        facts: [
          ['Boa-fé objetiva', 'Impõe padrão de lealdade e cooperação e cria deveres anexos na formação e execução das relações jurídicas.', 'Mesmo sem cláusula expressa, as partes devem informar circunstância relevante que afeta o cumprimento do contrato.'],
          ['Prescrição', 'Atinge a pretensão pelo decurso do prazo legal, sem se confundir com a extinção do direito em si.', 'O titular deixa transcorrer o prazo previsto em lei para exigir judicialmente uma prestação violada.'],
          ['Tutela provisória de urgência', 'Pode ser concedida quando presentes probabilidade do direito e perigo de dano ou risco ao resultado útil do processo.', 'Documentos indicam plausibilidade do direito e a demora pode tornar irreversível a perda de tratamento essencial.'],
          ['Ônus da prova', 'Distribui entre as partes a responsabilidade processual de demonstrar fatos relevantes, conforme regras legais e decisão fundamentada.', 'O juiz avalia quem deve provar determinado fato e, em hipótese legal, redistribui o encargo de forma motivada.'],
        ],
      },
      {
        chapter: 'Direito Penal e Direito Processual Penal',
        facts: [
          ['Tipicidade penal', 'Verifica se a conduta corresponde aos elementos descritos em tipo penal, sem dispensar os demais requisitos do delito.', 'A análise compara ação e resultado narrados com os elementos objetivos e subjetivos previstos no tipo.'],
          ['Dolo e culpa', 'Dolo envolve vontade ou assunção do risco nos termos legais; culpa decorre de violação do dever de cuidado sem intenção do resultado.', 'A investigação distingue quem queria o resultado de quem o produziu por imprudência, negligência ou imperícia.'],
          ['Presunção de inocência', 'Ninguém será considerado culpado até o trânsito em julgado de sentença penal condenatória, observada a Constituição.', 'Uma autoridade evita apresentar investigado como culpado antes da decisão definitiva.'],
          ['Cadeia de custódia da prova', 'Registra e preserva a história cronológica do vestígio, permitindo rastrear coleta, guarda e manuseio.', 'Cada transferência de um objeto apreendido é documentada para permitir verificar sua integridade e origem.'],
        ],
      },
      {
        chapter: 'Direitos Humanos e tutela coletiva',
        facts: [
          ['Universalidade dos direitos humanos', 'Reconhece direitos a todas as pessoas, sem discriminação baseada em características pessoais ou sociais.', 'Uma política de atendimento não exclui pessoa por origem, gênero, deficiência ou condição econômica.'],
          ['Controle de convencionalidade', 'Compara normas e atos internos com tratados de direitos humanos aplicáveis, segundo a competência da autoridade e o sistema jurídico.', 'Um julgador examina se a interpretação de norma doméstica é compatível com tratado de direitos humanos vigente.'],
          ['Legitimidade coletiva', 'A lei atribui a determinados sujeitos legitimidade para defender em juízo direitos difusos, coletivos ou individuais homogêneos.', 'Uma instituição ajuíza ação coletiva para proteger grupo atingido por origem comum, dentro de suas atribuições legais.'],
          ['Direitos difusos', 'São transindividuais, indivisíveis e pertencem a pessoas indeterminadas ligadas por circunstâncias de fato.', 'A preservação de bem ambiental de uso comum interessa a pessoas não individualizadas.'],
        ],
      },
      {
        chapter: 'Direito do Consumidor e Estatuto da Criança e do Adolescente (ECA)',
        facts: [
          ['Vulnerabilidade do consumidor', 'Reconhece a posição de vulnerabilidade do consumidor no mercado e fundamenta a proteção prevista no CDC.', 'Uma cláusula é analisada considerando a desigualdade informacional entre fornecedor profissional e consumidor.'],
          ['Dever de informação', 'Exige informação adequada, clara e ostensiva sobre produtos, serviços, riscos e condições da contratação.', 'Antes da contratação, o fornecedor informa preço total, limitações e riscos relevantes de maneira compreensível.'],
          ['Proteção integral da criança e do adolescente', 'Reconhece crianças e adolescentes como sujeitos de direitos e orienta proteção prioritária e integral.', 'A atuação estatal considera desenvolvimento, segurança e direitos da criança em vez de tratá-la como objeto de tutela.'],
          ['Prioridade absoluta', 'Determina preferência na efetivação de direitos de crianças e adolescentes, conforme a Constituição e o ECA.', 'Um serviço organiza atendimento prioritário para criança em situação de risco e justifica a medida na proteção legal.'],
        ],
      },
      {
        chapter: 'Três questões discursivas específicas de Direito e Legislação',
        facts: [
          ['Enquadramento jurídico', 'Identifica fatos juridicamente relevantes e relaciona-os às normas aplicáveis sem presumir elementos ausentes.', 'A resposta separa fatos comprovados de alegações antes de indicar as regras que podem incidir no caso.'],
          ['Fundamentação normativa', 'Expõe a regra jurídica pertinente e explica sua relação com os fatos apresentados.', 'A manifestação cita a norma aplicável e demonstra como os elementos do caso satisfazem seus requisitos.'],
          ['Distinção entre direito material e processual', 'Diferencia regras que definem direitos e obrigações daquelas que disciplinam a atuação em juízo.', 'A análise separa a existência do direito alegado do procedimento adequado para buscá-lo.'],
          ['Adequação da tutela', 'Relaciona a medida jurídica pretendida ao direito ameaçado ou violado e aos requisitos legais.', 'A proposta seleciona providência capaz de impedir dano iminente sem exceder o pedido ou a competência.'],
          ['Proporcionalidade', 'Avalia adequação, necessidade e proporcionalidade em sentido estrito de uma medida restritiva de direitos.', 'Uma resposta compara a eficácia de alternativas e escolhe a menos gravosa que atenda à finalidade legítima.'],
          ['Tutela coletiva e origem comum', 'Reconhece quando uma lesão compartilhada pode justificar defesa coletiva, conforme a natureza do direito e a lei.', 'Vários consumidores sofrem a mesma prática e a análise considera a via coletiva adequada.'],
          ['Proteção prioritária de crianças', 'Interpreta medidas relativas a crianças e adolescentes à luz da prioridade e da proteção integral previstas em lei.', 'A conclusão considera segurança, desenvolvimento e o melhor interesse da criança nos fatos descritos.'],
          ['Solução consensual', 'Avalia a possibilidade de composição voluntária sem renunciar a direitos indisponíveis ou afastar garantias legais.', 'A resposta propõe mediação para conflito disponível e prevê orientação clara sobre os efeitos do acordo.'],
          ['Uso de precedente', 'Aplica entendimento jurisprudencial pertinente após verificar similitude dos fatos e alcance da decisão.', 'A análise compara os fundamentos de precedente citado com a situação concreta antes de utilizá-lo.'],
          ['Conclusão jurídica', 'Apresenta resposta objetiva e coerente com fatos, fundamentos e limites da questão proposta.', 'Ao final, a manifestação indica medida cabível e ressalva requisito que ainda depende de prova.'],
        ],
      },
    ],
  },
  {
    subject: 'dpdf-contabilidade',
    chapters: [
      {
        chapter: 'Contabilidade Geral e Avançada',
        facts: [
          ['Regime de competência', 'Reconhece receitas e despesas no período em que são geradas, independentemente do recebimento ou pagamento.', 'Uma despesa de dezembro paga em janeiro é reconhecida no período a que se refere, conforme o regime de competência.'],
          ['Equação patrimonial', 'Expressa a igualdade entre ativo, passivo exigível e patrimônio líquido.', 'Ao analisar um balanço, o profissional confere se os recursos se igualam às obrigações e ao patrimônio líquido.'],
          ['Depreciação', 'Aloca sistematicamente o valor depreciável de ativo imobilizado ao longo de sua vida útil.', 'O custo de um equipamento sujeito a desgaste é distribuído pelos períodos em que se espera utilizá-lo.'],
          ['Provisão contábil', 'Registra obrigação presente de valor ou prazo incerto quando os critérios de reconhecimento são satisfeitos.', 'Há obrigação provável originada por evento passado e estimativa confiável, embora o valor final ainda seja incerto.'],
        ],
      },
      {
        chapter: 'Contabilidade Pública e CASP',
        facts: [
          ['Variação patrimonial aumentativa', 'Aumenta o patrimônio líquido do setor público, sem depender necessariamente de ingresso de caixa no mesmo momento.', 'Um direito tributário é reconhecido por competência antes da arrecadação financeira.'],
          ['Variação patrimonial diminutiva', 'Reduz o patrimônio líquido público pelo consumo de bens, serviços ou reconhecimento de obrigações.', 'O serviço recebido no período gera reconhecimento patrimonial mesmo que o pagamento ocorra depois.'],
          ['Balanço patrimonial público', 'Evidencia ativos, passivos e patrimônio líquido segundo a estrutura aplicável ao setor público.', 'A equipe usa a demonstração para avaliar posição patrimonial e obrigações em uma data-base.'],
          ['Restos a pagar', 'Correspondem a despesas empenhadas e não pagas até 31 de dezembro, observadas as regras de inscrição e classificação.', 'Uma despesa empenhada no exercício permanece sem pagamento no encerramento e é analisada para inscrição conforme a norma.'],
        ],
      },
      {
        chapter: 'Administração Financeira e Orçamentária (AFO)',
        facts: [
          ['PPA', 'Estabelece diretrizes, objetivos e metas da administração pública para despesas de capital e programas de duração continuada.', 'Uma ação plurianual é vinculada aos objetivos e metas do plano de médio prazo do governo.'],
          ['LDO', 'Orienta a elaboração da lei orçamentária anual e dispõe sobre prioridades e metas, conforme a Constituição e a legislação fiscal.', 'Na preparação do orçamento anual, a equipe consulta as prioridades e regras fiscais estabelecidas para o exercício.'],
          ['LOA', 'Estima receitas e fixa despesas para o exercício financeiro, observadas as normas constitucionais e legais.', 'A previsão anual discrimina recursos autorizados para programas e despesas públicas.'],
          ['Empenho da despesa', 'É o ato que cria para o Estado obrigação de pagamento, pendente ou não de condição, nos termos da lei.', 'Antes de contratar serviço com dotação disponível, a administração emite o ato orçamentário que reserva o crédito.'],
        ],
      },
      {
        chapter: 'Auditoria Governamental e Controle Interno e Externo',
        facts: [
          ['Evidência de auditoria', 'Informação usada para fundamentar conclusões e deve ser suficiente e apropriada em relação ao objetivo do trabalho.', 'A auditoria cruza documentos, confirmações e registros para sustentar uma conclusão sobre despesa examinada.'],
          ['Materialidade', 'Considera a relevância de uma distorção ou irregularidade para decisões dos usuários e objetivos da auditoria.', 'Uma equipe prioriza exame de valores e riscos capazes de alterar significativamente a conclusão do trabalho.'],
          ['Controle interno', 'Conjunto de processos e medidas que oferece segurança razoável para objetivos operacionais, de informação e conformidade.', 'A segregação entre quem autoriza e quem paga reduz o risco de erro ou fraude no processo.'],
          ['Controle externo', 'É exercido pelo Poder Legislativo com auxílio dos tribunais de contas, nos termos constitucionais.', 'A fiscalização das contas públicas ocorre pela instância legislativa competente com o apoio técnico do tribunal de contas.'],
        ],
      },
      {
        chapter: 'Legislação Fiscal e Tributária',
        facts: [
          ['Obrigação tributária principal', 'Surge com a ocorrência do fato gerador e tem por objeto pagamento de tributo ou penalidade pecuniária.', 'A ocorrência definida em lei como fato gerador constitui obrigação de pagar o tributo correspondente.'],
          ['Obrigação tributária acessória', 'Consiste em prestações positivas ou negativas instituídas no interesse da arrecadação ou fiscalização.', 'Mesmo sem imposto devido em certa operação, a lei pode exigir declaração ou emissão de documento fiscal.'],
          ['Lançamento tributário', 'Constitui o crédito tributário mediante procedimento que verifica fato gerador, matéria tributável e sujeito passivo.', 'A autoridade apura ocorrência e valor do tributo e identifica formalmente o contribuinte responsável.'],
          ['Anterioridade tributária', 'Limita temporalmente a cobrança de tributos após a publicação da lei, ressalvadas as exceções constitucionais.', 'Uma equipe verifica se a nova exação pode ser cobrada no exercício ou período previsto pela Constituição.'],
        ],
      },
      {
        chapter: 'Três questões discursivas específicas de Contabilidade',
        facts: [
          ['Conciliação contábil', 'Compara registros independentes para identificar diferenças, erros e itens pendentes de regularização.', 'A equipe compara extrato bancário com razão contábil e documenta diferenças antes do fechamento.'],
          ['Estimativa contábil', 'Usa premissas e dados disponíveis para mensurar item cujo valor não pode ser observado diretamente.', 'A área documenta método, premissas e incerteza usados para estimar obrigação ainda não liquidada.'],
          ['Análise de variação orçamentária', 'Compara valores previstos e realizados e investiga causas relevantes para apoiar decisão e controle.', 'O relatório explica por que a execução de determinada ação ficou abaixo da dotação aprovada.'],
          ['Rastreabilidade do lançamento', 'Permite percorrer a trilha entre documento de origem, registro contábil e demonstração divulgada.', 'Um auditor parte de um valor publicado e recupera os documentos e aprovações que o sustentam.'],
          ['Segregação de funções contábeis', 'Distribui etapas incompatíveis entre pessoas distintas para reduzir risco de erro e fraude.', 'A mesma pessoa não solicita, aprova e registra sozinha uma despesa pública.'],
          ['Prestação de contas', 'Demonstra de forma documentada a legalidade, legitimidade e resultados da gestão de recursos públicos.', 'O gestor apresenta documentos, indicadores e justificativas para permitir avaliação de recursos executados.'],
          ['Ajuste de competência', 'Reconhece no período adequado receitas ou despesas já incorridas, ainda que o fluxo financeiro ocorra em outro momento.', 'No encerramento, a equipe registra serviço recebido e ainda não pago para refletir a obrigação do período.'],
          ['Risco de distorção relevante', 'É a possibilidade de informação contábil conter erro significativo antes da aplicação de procedimentos de auditoria.', 'O planejamento direciona testes adicionais a uma conta complexa e de alto valor sujeita a estimativa.'],
          ['Consistência de políticas contábeis', 'Favorece comparabilidade ao aplicar critérios contábeis de modo uniforme, salvo mudança justificada e divulgada.', 'Uma alteração de critério é fundamentada, aplicada conforme a norma e explicada nas notas.'],
          ['Comunicação de achados', 'Apresenta condição, critério, causa e efeito de forma clara e suportada por evidências.', 'O relatório distingue o procedimento inadequado observado do padrão esperado e do impacto identificado.'],
        ],
      },
    ],
  },
  {
    subject: 'dpdf-banco-de-dados',
    chapters: [
      {
        chapter: 'Modelagem relacional e não relacional (NoSQL)',
        facts: [
          ['Chave primária', 'Identifica univocamente cada linha de uma relação e não deve conter valor nulo.', 'Uma tabela de processos usa identificador único para diferenciar registros com partes de mesmo nome.'],
          ['Chave estrangeira', 'Representa referência a chave de outra tabela e ajuda a preservar integridade referencial.', 'Uma tabela de atendimentos referencia o cadastro de assistidos por identificador existente.'],
          ['Normalização', 'Organiza relações para reduzir redundância e anomalias de inserção, atualização e exclusão.', 'Um cadastro separa dados repetidos de endereço em uma relação própria e referencia o registro correspondente.'],
          ['Documento em banco NoSQL', 'Armazena dados em estruturas de documento flexíveis, frequentemente organizadas em coleções.', 'Registros com atributos opcionais e evolução frequente são armazenados como documentos sem esquema tabular rígido.'],
        ],
      },
      {
        chapter: 'SQL avançada, otimização, tuning e indexação',
        facts: [
          ['Índice composto', 'Indexa mais de uma coluna, e sua utilidade depende da ordem e dos predicados das consultas.', 'Uma consulta filtra primeiro por unidade e depois ordena por data; um índice compatível é avaliado no plano.'],
          ['Plano de execução', 'Descreve as operações que o SGBD pretende executar para atender uma consulta.', 'Antes de ajustar uma consulta lenta, a equipe verifica se o mecanismo faz varredura completa ou usa índice.'],
          ['Transação', 'Agrupa operações em uma unidade lógica sujeita às propriedades ACID.', 'Uma operação transfere saldo entre contas garantindo que débito e crédito sejam confirmados juntos ou desfeitos.'],
          ['Isolamento de transação', 'Controla a interferência entre transações concorrentes e os fenômenos de leitura permitidos.', 'Duas sessões atualizam dados simultaneamente, e a equipe escolhe nível de isolamento para evitar leitura inconsistente.'],
        ],
      },
      {
        chapter: 'Administração e arquitetura de PostgreSQL, Oracle, MySQL e SQL Server',
        facts: [
          ['Backup consistente', 'Produz cópia recuperável que respeita a consistência dos dados e a estratégia de recuperação definida.', 'Uma restauração de teste confirma que a cópia e os logs permitem recuperar o banco até o ponto esperado.'],
          ['Replicação', 'Mantém cópias de dados em instâncias distintas para disponibilidade, distribuição de leitura ou recuperação.', 'Uma réplica recebe alterações da instância primária e é monitorada quanto a atraso e consistência.'],
          ['Controle de acesso por privilégio mínimo', 'Concede a cada conta apenas permissões necessárias às tarefas autorizadas.', 'Uma aplicação de consulta recebe permissão de leitura em tabelas específicas, sem privilégio administrativo.'],
          ['Alta disponibilidade', 'Combina mecanismos para manter ou restaurar serviço diante de falhas dentro de objetivos definidos.', 'O serviço detecta indisponibilidade da instância primária e promove réplica conforme procedimento testado.'],
        ],
      },
      {
        chapter: 'Data Warehouse, Business Intelligence e Big Data',
        facts: [
          ['Data warehouse', 'Repositório integrado e orientado à análise que reúne dados históricos de diferentes fontes.', 'Analistas consolidam dados de atendimento de vários sistemas para estudar tendências ao longo dos anos.'],
          ['Processo ETL', 'Extrai dados de fontes, transforma-os conforme regras e carrega o resultado no destino analítico.', 'Um fluxo padroniza códigos e datas de sistemas legados antes de carregar a área analítica.'],
          ['Esquema estrela', 'Modelo dimensional com tabela de fatos ligada a tabelas dimensionais para facilitar consultas analíticas.', 'Uma solução organiza ocorrências como fatos e relaciona dimensões de tempo, unidade e tipo de serviço.'],
          ['Data lake', 'Armazena dados em formatos variados, frequentemente em estado bruto, para usos analíticos posteriores.', 'Arquivos estruturados e registros semiestruturados são preservados para processamento futuro sob governança definida.'],
        ],
      },
      {
        chapter: 'Governança de dados, segurança da informação e LGPD',
        facts: [
          ['Controlador de dados pessoais', 'É quem toma decisões referentes ao tratamento de dados pessoais, nos termos da LGPD.', 'A organização define finalidades e meios essenciais para tratar dados de usuários e responde como controladora.'],
          ['Operador de dados pessoais', 'Realiza tratamento em nome do controlador e conforme suas instruções, nos termos da LGPD.', 'Um fornecedor processa cadastro em nuvem de acordo com instruções documentadas do órgão controlador.'],
          ['Minimização de dados', 'Limita o tratamento aos dados adequados, pertinentes e não excessivos para a finalidade.', 'Um formulário deixa de solicitar informação pessoal que não é necessária para prestar o serviço.'],
          ['Anonimização', 'Usa meios técnicos razoáveis e disponíveis para impedir associação direta ou indireta dos dados a uma pessoa.', 'Um conjunto analítico é transformado para que registros não possam ser razoavelmente vinculados a titulares identificáveis.'],
        ],
      },
      {
        chapter: 'Três questões discursivas específicas de Banco de Dados',
        facts: [
          ['Integridade referencial', 'Impede referências inconsistentes entre registros relacionados e preserva regras de relacionamento.', 'No desenho de cadastro de processos, a equipe explica como evitar atendimento apontando para assistido inexistente.'],
          ['Consistência transacional', 'Garante que uma transação leve o banco de um estado válido a outro estado válido.', 'Uma operação em múltiplas tabelas deve ser atômica para não deixar registros parcialmente atualizados.'],
          ['Tuning orientado por evidência', 'Otimiza o banco a partir de métricas, perfil de consulta e plano de execução, evitando alterações sem diagnóstico.', 'Diante de lentidão, a resposta propõe medir consultas e analisar plano antes de criar índices indiscriminadamente.'],
          ['Política de retenção', 'Define por quanto tempo dados são mantidos e como são eliminados ou arquivados conforme finalidade e obrigação aplicável.', 'A área estabelece prazos, responsáveis e descarte seguro para dados cuja finalidade de tratamento terminou.'],
          ['Qualidade de dados', 'Avalia dimensões como completude, exatidão, consistência e atualidade em relação ao uso pretendido.', 'Um relatório verifica campos obrigatórios ausentes e divergências entre cadastros antes de consolidar indicadores.'],
          ['Governança de metadados', 'Documenta significado, origem, formato, responsável e regras de uso dos dados.', 'Uma equipe mantém catálogo que explica o significado e a origem de cada indicador divulgado.'],
          ['Pseudonimização', 'Substitui identificadores diretos por informação separada, reduzindo associação imediata sem tornar os dados necessariamente anônimos.', 'Uma base analítica troca nomes por códigos, mas mantém chave adicional que permite reidentificação controlada.'],
          ['Gestão de privilégios', 'Revê e remove permissões quando deixam de ser necessárias, mantendo trilha de concessões e alterações.', 'Após mudança de função, o acesso antigo é revogado e os privilégios remanescentes são recertificados.'],
          ['Recuperação pontual', 'Restaura banco para um instante específico usando cópia de segurança e registros de transação disponíveis.', 'Após exclusão acidental, a equipe recupera ambiente até pouco antes do incidente e valida os dados restaurados.'],
          ['Comunicação de arquitetura de dados', 'Expõe componentes, fluxos, decisões e riscos de modo adequado aos responsáveis técnicos e institucionais.', 'A proposta apresenta origem dos dados, integrações, controles de acesso e justificativa das escolhas para avaliação.'],
        ],
      },
    ],
  },
  {
    subject: 'dpdf-desenvolvimento-sistemas',
    chapters: [
      {
        chapter: 'Engenharia de Software e metodologias ágeis (Scrum e Kanban)',
        facts: [
          ['História de usuário', 'Descreve necessidade sob a perspectiva do usuário e explicita valor esperado.', 'A equipe registra “como assistido, quero acompanhar o protocolo para saber o andamento do pedido”.'],
          ['Critério de aceitação', 'Define condições verificáveis que uma entrega deve satisfazer para ser aceita.', 'Uma funcionalidade só é aprovada quando exibe protocolo válido e informa estado atualizado ao usuário.'],
          ['Backlog do produto', 'É a lista ordenada e evolutiva de itens de trabalho necessários ao produto.', 'O responsável reprioriza funcionalidades conforme valor público, riscos e retorno dos usuários.'],
          ['Fluxo puxado do Kanban', 'Limita trabalho em andamento e inicia nova tarefa conforme capacidade disponível do fluxo.', 'A equipe não começa novo item quando o limite da coluna ativa foi atingido.'],
        ],
      },
      {
        chapter: 'Programação Orientada a Objetos e Java, Python, C#, PHP e JavaScript',
        facts: [
          ['Encapsulamento', 'Agrupa estado e comportamento e controla acesso à implementação interna de um objeto.', 'Uma classe protege seus atributos e permite alterações apenas por métodos que validam regras.'],
          ['Polimorfismo', 'Permite tratar objetos de tipos relacionados por uma interface comum, com comportamentos específicos.', 'Diferentes formas de notificação respondem ao mesmo método enviar, cada uma com implementação própria.'],
          ['Composição', 'Constrói um objeto usando outros objetos como componentes, favorecendo relações de “tem um”.', 'Um serviço de protocolo contém componentes de validação e armazenamento em vez de herdar suas implementações.'],
          ['Tratamento de exceções', 'Permite detectar e tratar condições excepcionais sem confundi-las com o fluxo normal de execução.', 'Uma falha de conexão é registrada e convertida em resposta controlada, sem expor detalhes internos ao usuário.'],
        ],
      },
      {
        chapter: 'Desenvolvimento Web, APIs RESTful e microsserviços',
        facts: [
          ['Idempotência HTTP', 'Uma operação idempotente produz o mesmo efeito pretendido quando repetida, embora a resposta possa variar.', 'Repetir uma solicitação de atualização para definir um recurso no mesmo estado não cria cópias adicionais.'],
          ['Autenticação e autorização', 'Autenticação verifica identidade; autorização determina ações permitidas para essa identidade.', 'Após validar a sessão do usuário, a API ainda verifica se ele tem permissão para acessar o protocolo solicitado.'],
          ['Validação de entrada', 'Confere formato, tipo, tamanho e regras de negócio de dados recebidos antes de processá-los.', 'A API rejeita identificador inválido e campos fora do limite antes de executar a consulta.'],
          ['Contrato de API', 'Documenta operações, parâmetros, formatos de dados e respostas esperadas entre consumidores e provedores.', 'Times acordam esquema e códigos de resposta antes de integrar o portal ao serviço de protocolo.'],
        ],
      },
      {
        chapter: 'Arquitetura de Software e padrões de projeto',
        facts: [
          ['Inversão de dependência', 'Módulos de alto nível dependem de abstrações, não de detalhes concretos de implementação.', 'Um serviço usa interface de repositório, permitindo trocar banco sem reescrever regras de negócio.'],
          ['Injeção de dependência', 'Fornece dependências a um componente externamente, em vez de ele construí-las diretamente.', 'O ambiente entrega ao serviço um cliente de armazenamento configurado para teste ou produção.'],
          ['Separação de responsabilidades', 'Organiza componentes para que cada um tenha responsabilidade coesa e mudanças localizadas.', 'Validação de negócio deixa o controlador HTTP e passa para serviço dedicado.'],
          ['Padrão Strategy', 'Encapsula algoritmos intercambiáveis sob uma interface comum para escolher comportamento em execução.', 'O sistema seleciona uma estratégia de cálculo conforme o tipo de solicitação sem encadear condicionais extensos.'],
        ],
      },
      {
        chapter: 'Testes de Software, CI/CD e DevSecOps',
        facts: [
          ['Teste unitário', 'Verifica comportamento de unidade pequena de software de forma isolada e com resultado esperado.', 'Um teste executa função de cálculo com entradas controladas e confere o valor retornado.'],
          ['Teste de integração', 'Verifica interação entre componentes ou sistemas, como aplicação e banco de dados.', 'A equipe confirma que a API grava e recupera protocolo usando instância de teste do banco.'],
          ['Integração contínua', 'Automatiza integração frequente de alterações com execução de verificações e testes.', 'Cada alteração enviada inicia análise estática e testes antes de poder ser incorporada.'],
          ['Análise estática de segurança', 'Examina código ou dependências sem executar a aplicação para identificar padrões de risco conhecidos.', 'O pipeline alerta sobre uso de componente vulnerável e bloqueia publicação até avaliação do risco.'],
        ],
      },
      {
        chapter: 'Três questões discursivas específicas de Desenvolvimento de Sistemas',
        facts: [
          ['Levantamento de requisitos', 'Identifica necessidades, restrições e critérios de sucesso com usuários e partes interessadas.', 'Antes de implementar agendamento, a equipe entrevista atendentes e mapeia regras e exceções do serviço.'],
          ['Acessibilidade digital', 'Projeta interfaces utilizáveis por pessoas com diferentes capacidades e tecnologias assistivas.', 'Uma tela oferece navegação por teclado, rótulos acessíveis e contraste adequado.'],
          ['Defesa contra falhas de autorização', 'Verifica permissão no servidor para cada recurso, sem confiar apenas em controles visuais do cliente.', 'A API confirma vínculo e autorização antes de retornar dados mesmo quando o identificador foi alterado na URL.'],
          ['Observabilidade', 'Usa logs, métricas e rastreamento para compreender estado e comportamento de um sistema em execução.', 'Após erro intermitente, o time correlaciona identificador de requisição, métricas e eventos entre serviços.'],
          ['Versionamento de API', 'Gerencia mudanças de contrato de modo a comunicar incompatibilidades e preservar consumidores.', 'Uma mudança incompatível é publicada em versão separada com período de migração documentado.'],
          ['Tratamento de dados pessoais', 'Aplica finalidade, necessidade, segurança e transparência ao ciclo de vida de dados pessoais no sistema.', 'Uma funcionalidade coleta apenas campos necessários e define acesso e retenção compatíveis com o serviço.'],
          ['Pipeline de entrega segura', 'Integra testes e controles de segurança às etapas automatizadas de compilação e publicação.', 'Antes de liberar versão, o pipeline executa testes, análise de dependências e validações de configuração.'],
          ['Gestão de configuração', 'Mantém configurações separadas do código e evita expor segredos em repositórios ou registros.', 'Credenciais são fornecidas pelo ambiente protegido e não são gravadas no controle de versão.'],
          ['Migração de banco de dados', 'Versiona mudanças de esquema com procedimento de aplicação, validação e recuperação compatível.', 'A alteração de tabela é testada e planejada para evitar indisponibilidade e permitir reversão segura.'],
          ['Decisão arquitetural documentada', 'Registra contexto, alternativas, decisão e consequências para orientar manutenção futura.', 'A equipe documenta por que escolheu integração assíncrona e quais riscos e limites essa escolha traz.'],
        ],
      },
    ],
  },
  {
    subject: 'dpdf-redes',
    chapters: [
      {
        chapter: 'Arquitetura de redes e modelos OSI e TCP/IP',
        facts: [
          ['Camada de enlace', 'Transporta quadros entre nós conectados ao mesmo enlace e trata endereçamento local conforme a tecnologia.', 'Um switch encaminha quadro dentro da rede local com base no endereço MAC de destino.'],
          ['Camada de rede', 'Endereça e encaminha pacotes entre redes distintas.', 'Um roteador escolhe próximo salto para encaminhar pacote IP a outra sub-rede.'],
          ['DNS', 'Traduz nomes de domínio em informações como endereços IP por meio de consultas ao sistema de nomes.', 'O cliente consulta resolvedor para localizar o endereço associado ao nome do serviço institucional.'],
          ['TCP', 'Oferece transporte orientado a conexão com entrega ordenada e mecanismos de controle de fluxo e retransmissão.', 'Uma transferência de arquivo precisa detectar perda e recompor dados na ordem original.'],
        ],
      },
      {
        chapter: 'Roteamento, switching e protocolos de rede',
        facts: [
          ['Roteamento estático', 'Define rotas manualmente pelo administrador, sem aprendizado automático por protocolo de roteamento.', 'Uma rede pequena mantém rota fixa para uma saída conhecida e de topologia estável.'],
          ['Roteamento dinâmico', 'Aprende e atualiza rotas por protocolos que trocam informações entre roteadores.', 'Após falha de enlace, roteadores recalculam caminhos com base em atualizações do protocolo.'],
          ['VLAN', 'Segmenta logicamente uma rede de camada 2 em domínios de broadcast separados.', 'Estações de setores diferentes compartilham switches físicos, mas ficam em redes locais virtuais distintas.'],
          ['Spanning Tree Protocol', 'Previne loops de camada 2 bloqueando enlaces redundantes e mantendo topologia lógica sem ciclos.', 'Com enlaces redundantes entre switches, o protocolo desativa caminho alternativo para evitar tempestade de broadcast.'],
        ],
      },
      {
        chapter: 'Segurança de redes: firewalls, IDS/IPS, VPN e Zero Trust',
        facts: [
          ['Firewall com estado', 'Filtra tráfego considerando estado e contexto das conexões, além de regras de rede.', 'A resposta de conexão iniciada internamente é permitida porque corresponde a sessão válida registrada.'],
          ['IDS', 'Detecta e alerta sobre eventos ou padrões suspeitos sem necessariamente bloquear o tráfego automaticamente.', 'Uma ferramenta sinaliza comunicação anômala para análise da equipe de segurança.'],
          ['IPS', 'Inspeciona tráfego e pode bloquear atividade identificada como maliciosa conforme regras configuradas.', 'Ao reconhecer assinatura de ataque, o equipamento interrompe o fluxo antes que alcance o servidor protegido.'],
          ['Princípio Zero Trust', 'Não presume confiança por localização de rede e exige verificação explícita e contínua de acesso.', 'Mesmo conectado à rede corporativa, o usuário precisa autenticar-se e satisfazer políticas antes de acessar o recurso.'],
        ],
      },
      {
        chapter: 'Administração de Linux e Windows Server',
        facts: [
          ['Privilégio mínimo', 'Concede a contas e processos apenas permissões estritamente necessárias para suas funções.', 'Um serviço de sistema executa com conta sem privilégios administrativos quando a tarefa não exige elevação.'],
          ['Registro de eventos', 'Registra eventos relevantes para diagnóstico, auditoria e investigação de incidentes.', 'A equipe centraliza eventos de autenticação para detectar tentativas repetidas e apoiar análise posterior.'],
          ['Atualização de segurança', 'Aplica correções validadas para reduzir exposição a vulnerabilidades conhecidas.', 'Servidores recebem patches após avaliação de compatibilidade e plano de implantação controlado.'],
          ['Hardening', 'Reduz a superfície de ataque por configuração segura, remoção de serviços desnecessários e controles adequados.', 'Uma imagem de servidor desativa protocolos obsoletos e restringe serviços às funções necessárias.'],
        ],
      },
      {
        chapter: 'Computação em nuvem (AWS e Azure) e virtualização',
        facts: [
          ['Elasticidade', 'Ajusta recursos de computação para acompanhar variações de demanda, ampliando ou reduzindo capacidade.', 'O ambiente aumenta instâncias durante pico de acesso e as reduz quando a demanda cai.'],
          ['Responsabilidade compartilhada', 'Distribui deveres de segurança entre provedor de nuvem e cliente conforme o serviço contratado.', 'O provedor protege a infraestrutura física, enquanto o órgão configura identidades e acessos da aplicação.'],
          ['Máquina virtual', 'Emula um sistema computacional isolado sobre hipervisor e compartilha recursos físicos do hospedeiro.', 'Dois servidores convidados executam sistemas operacionais distintos no mesmo host físico.'],
          ['Grupo de segurança', 'Controla tráfego permitido para recursos em nuvem por regras de origem, destino, protocolo e porta.', 'Uma instância aceita conexões administrativas apenas de faixa de endereços autorizada.'],
        ],
      },
      {
        chapter: 'Três questões discursivas específicas de Redes',
        facts: [
          ['Segmentação de rede', 'Separa zonas e fluxos para limitar exposição e movimento lateral entre sistemas.', 'A proposta mantém estações de usuário separadas de servidores de dados e define comunicações estritamente necessárias.'],
          ['Acesso remoto por VPN', 'Estabelece túnel protegido para acesso remoto, com autenticação e políticas compatíveis com o risco.', 'A equipe habilita conexão remota criptografada e restringe os recursos conforme identidade e necessidade funcional.'],
          ['Resposta a incidente de rede', 'Identifica, contém, erradica e recupera a operação com preservação de evidências e comunicação apropriada.', 'Diante de tráfego suspeito, a equipe isola o segmento, coleta registros e restaura serviço após remover a causa.'],
          ['Monitoramento de disponibilidade', 'Acompanha indicadores e alertas para detectar degradação ou indisponibilidade de serviços de rede.', 'A operação mede perda, latência e disponibilidade entre unidades para identificar falhas antes das reclamações.'],
          ['DNS seguro e resiliente', 'Protege integridade e disponibilidade da resolução de nomes por controles, redundância e monitoramento.', 'A arquitetura separa resolvedores internos, restringe alterações de zona e mantém cópias e monitoramento.'],
          ['Gerência de mudanças', 'Avalia, aprova, documenta e acompanha alterações para reduzir impacto operacional e permitir recuperação.', 'Antes de mudar roteamento, a equipe registra justificativa, janela, testes, responsáveis e plano de retorno.'],
          ['Controle de acesso administrativo', 'Protege interfaces de gerenciamento por autenticação forte, origem restrita e contas individualizadas.', 'A administração de switches exige conta nominal com MFA e acesso apenas a partir de estação gerenciada.'],
          ['Redundância de enlaces', 'Mantém caminhos alternativos para reduzir interrupção diante da falha de um enlace.', 'Uma unidade conecta-se por dois caminhos independentes e testa a comutação automática entre eles.'],
          ['Criptografia em trânsito', 'Protege confidencialidade e integridade dos dados enquanto trafegam entre sistemas.', 'A integração entre unidades usa protocolo criptográfico atualizado para impedir leitura e alteração no caminho.'],
          ['Plano de continuidade de rede', 'Define serviços prioritários, responsáveis, recursos alternativos e procedimentos de recuperação após interrupção.', 'O plano especifica enlaces de contingência e testes periódicos para restaurar conectividade essencial.'],
        ],
      },
    ],
  },
];

export const DPDF_QUESTION_SOURCE =
  'EdRush — questão inédita alinhada ao conteúdo programático informado para o DPDF';

function createOptions(facts: readonly Fact[], correctIndex: number): {
  options: string[];
  answer: string;
} {
  const selected: string[] = [facts[correctIndex][0]];
  for (let offset = 1; offset < facts.length && selected.length < 5; offset += 1) {
    const concept = facts[(correctIndex + offset) % facts.length][0];
    if (!selected.includes(concept)) selected.push(concept);
  }
  const answerIndex = (correctIndex * 3 + 1) % selected.length;
  const [correct] = selected.splice(0, 1);
  selected.splice(answerIndex, 0, correct);
  const labels = ['A', 'B', 'C', 'D', 'E'];
  return {
    options: selected.map((option, index) => `${labels[index]}) ${option}`),
    answer: labels[answerIndex],
  };
}

function buildQuestions(subjects: readonly SubjectFacts[]): SeedQuestion[] {
  const questions: SeedQuestion[] = [];

  for (const subject of subjects) {
    for (const chapter of subject.chapters) {
      if (chapter.facts.length < 4) {
        throw new Error(`O capítulo "${chapter.chapter}" precisa de ao menos quatro conceitos para gerar alternativas.`);
      }

      chapter.facts.forEach(([concept, meaning, application], index) => {
        const { options, answer } = createOptions(chapter.facts, index);
        const difficulty: SeedDifficulty[] = ['fácil', 'médio', 'difícil'];
        const common = {
          disciplina: subject.subject,
          capitulo: chapter.chapter,
          tipo: 'multipla_escolha' as const,
          opcoes: options,
          resposta_correta: answer,
          dificuldade: difficulty[index % difficulty.length],
          fonte: DPDF_QUESTION_SOURCE,
          explicacao: `${concept}: ${meaning}`,
          dica: 'Identifique a ideia central do enunciado e compare-a com o conceito correspondente.',
        };

        questions.push({
          ...common,
          titulo: `DPDF — ${concept}: conceito`,
          enunciado: `Qual conceito corresponde à seguinte descrição? ${meaning}`,
        });
        questions.push({
          ...common,
          titulo: `DPDF — ${concept}: aplicação`,
          enunciado: `Situação: ${application} Qual conceito está diretamente representado?`,
          explicacao: `A situação exemplifica ${concept}. ${meaning}`,
        });
      });
    }
  }

  return questions;
}

export const DPDF_QUESTIONS: SeedQuestion[] = buildQuestions([
  ...COMMON_FACTS,
  ...SPECIALTY_FACTS,
]);

export const DPDF_CHAPTERS = [...COMMON_FACTS, ...SPECIALTY_FACTS].flatMap((subject) =>
  subject.chapters.map((chapter, index) => ({
    disciplina: subject.subject,
    numero: index + 1,
    titulo: chapter.chapter,
    descricao: `${chapter.facts.length * 2} questões originais sobre ${chapter.chapter}.`,
    is_primeiro: index === 0,
  })),
);
