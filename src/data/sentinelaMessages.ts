// Banco de mensagens do Foco Sentinela.
// Cada mood tem 8-15 mensagens. O sistema escolhe uma que o usuário ainda não viu.

export type SentinelaMood =
  | 'awake'      // estado neutro (default)
  | 'happy'      // streak >0, accuracy >=70%
  | 'proud'      // level up recente / borda nova / accuracy >=85%
  | 'concerned' // accuracy <50% nas últimas sessões
  | 'sleeping'   // inativo há 2+ dias
  | 'excited'    // primeiro acesso depois de >=1 dia
  | 'focused'    // está em sessão de estudo/capítulo
  | 'cheering';  // primeiro login do dia (qualquer dia)

export interface SentinelaMessage {
  id: string;
  text: string;
  author?: string;     // pra citações
  duration?: number;   // ms de exibição (default 8000)
}

export const MESSAGES: Record<SentinelaMood, SentinelaMessage[]> = {
  awake: [
    { id: 'aw1',  text: 'Estou aqui. Pronto quando você estiver.' },
    { id: 'aw2',  text: 'A jornada de mil milhas começa com um passo.', author: 'Lao Tsé' },
    { id: 'aw3',  text: 'Disciplina é a ponte entre objetivos e resultados.', author: 'Jim Rohn' },
    { id: 'aw4',  text: 'Hoje é um bom dia pra começar.' },
    { id: 'aw5',  text: 'Conhece-te a ti mesmo.', author: 'Sócrates' },
    { id: 'aw6',  text: 'Pequenas vitórias diárias constroem grandes resultados.' },
    { id: 'aw7',  text: 'O sucesso é a soma de pequenos esforços repetidos.', author: 'Robert Collier' },
    { id: 'aw8',  text: 'O que você procura também procura você.', author: 'Rumi' },
  ],

  happy: [
    { id: 'hp1',  text: 'Você está afiado hoje. Continue.' },
    { id: 'hp2',  text: 'O sucesso depende da preparação prévia.', author: 'Confúcio' },
    { id: 'hp3',  text: 'Esse é o ritmo de quem passa.' },
    { id: 'hp4',  text: 'Pequenas vitórias compõem grandes histórias.' },
    { id: 'hp5',  text: 'Quem é dono da manhã, é dono do dia.' },
    { id: 'hp6',  text: 'Está sentindo o foco? Aproveite — esse é o estado.' },
    { id: 'hp7',  text: 'A perfeição não é alcançável, mas perseguindo-a alcançamos a excelência.', author: 'Vince Lombardi' },
    { id: 'hp8',  text: 'Você está plantando os frutos do gabarito.' },
  ],

  proud: [
    { id: 'pr1',  text: 'Você cresceu desde a última vez que olhei.' },
    { id: 'pr2',  text: 'A virtude é a sua própria recompensa.', author: 'Marco Aurélio' },
    { id: 'pr3',  text: 'O homem se torna o que pratica todos os dias.', author: 'Aristóteles' },
    { id: 'pr4',  text: 'Olha pra você. Tá lapidando aprovação.' },
    { id: 'pr5',  text: 'A persistência realiza o impossível.', author: 'Provérbio chinês' },
    { id: 'pr6',  text: 'A dor da disciplina pesa gramas. A do arrependimento, toneladas.', author: 'Jim Rohn' },
    { id: 'pr7',  text: 'Você não é mais o concurseiro de ontem.' },
    { id: 'pr8',  text: 'Hoje você venceu a versão antiga de si mesmo.' },
  ],

  concerned: [
    { id: 'cn1',  text: 'O obstáculo é o caminho.', author: 'Marco Aurélio' },
    { id: 'cn2',  text: 'Errar é dado. Não erre nada e você não estuda nada.' },
    { id: 'cn3',  text: 'Caímos sete vezes, levantamos oito.', author: 'Provérbio japonês' },
    { id: 'cn4',  text: 'Não é o que acontece com você, é como você reage.', author: 'Epicteto' },
    { id: 'cn5',  text: 'A dificuldade de hoje é a competência de amanhã.' },
    { id: 'cn6',  text: 'Frio na barriga é só sinal de que tá importando.' },
    { id: 'cn7',  text: 'Cada erro identificado é um ponto a mais na prova.' },
    { id: 'cn8',  text: 'Conheça seu inimigo e conheça a si mesmo: você vencerá cem batalhas.', author: 'Sun Tzu' },
    { id: 'cn9',  text: 'A revisão dos erros é o que separa concurseiro de aprovado.' },
  ],

  sleeping: [
    { id: 'sl1',  text: 'Zzz... Acorda. Sua aprovação tá esperando.', duration: 12000 },
    { id: 'sl2',  text: 'Tempo perdido nunca volta.', author: 'Benjamin Franklin', duration: 12000 },
    { id: 'sl3',  text: 'Você sumiu. O concurso não.', duration: 12000 },
    { id: 'sl4',  text: 'A constância é mais importante que a intensidade.', duration: 12000 },
    { id: 'sl5',  text: 'Bora? Cinco questões pra começar.', duration: 12000 },
    { id: 'sl6',  text: 'O melhor momento pra plantar uma árvore foi há 20 anos. O segundo melhor é agora.', author: 'Provérbio chinês', duration: 14000 },
    { id: 'sl7',  text: 'Quem para, perde o ritmo. Quem volta, recupera.', duration: 12000 },
  ],

  excited: [
    { id: 'ex1',  text: 'Você voltou! Vamos com tudo hoje?' },
    { id: 'ex2',  text: 'Senti sua falta, concurseiro.' },
    { id: 'ex3',  text: 'Bom te ver de novo. Bora retomar?' },
    { id: 'ex4',  text: 'O caminho é longo, mas você está nele de novo.' },
    { id: 'ex5',  text: 'Recomeçar é mais corajoso que começar.' },
    { id: 'ex6',  text: 'Que tal uma sessão pra esquentar?' },
    { id: 'ex7',  text: 'A volta é melhor que a partida.' },
  ],

  focused: [
    { id: 'fc1',  text: 'Concentração é tudo. Estou em silêncio.' },
    { id: 'fc2',  text: 'Respira fundo. Lê com calma. Você sabe disso.' },
    { id: 'fc3',  text: 'Foco no enunciado. As alternativas vêm depois.' },
    { id: 'fc4',  text: 'Onde a atenção vai, a energia flui.' },
    { id: 'fc5',  text: 'Cuidado com pegadinha. Lê duas vezes.' },
    { id: 'fc6',  text: 'Confia no que estudou.' },
    { id: 'fc7',  text: 'A prova é só uma sessão um pouco mais longa.' },
  ],

  cheering: [
    { id: 'ch1',  text: 'Bom dia! Mais um dia pra ficar mais perto da farda.' },
    { id: 'ch2',  text: 'Quem chegou primeiro hoje? Você.' },
    { id: 'ch3',  text: 'Hoje é o dia. Todo dia é o dia.' },
    { id: 'ch4',  text: 'A regra é simples: aparecer.' },
    { id: 'ch5',  text: 'Mais um dia, mais uma chance de progredir.' },
    { id: 'ch6',  text: 'Você apareceu. Já é metade da batalha.' },
    { id: 'ch7',  text: 'Vamos transformar esse dia em XP.' },
  ],
};

// Pega uma mensagem que o usuário ainda não viu nesse mood; se já viu todas, reinicia.
export function pickMessage(mood: SentinelaMood, alreadyShown: string[]): SentinelaMessage {
  const pool = MESSAGES[mood];
  const unseen = pool.filter(m => !alreadyShown.includes(m.id));
  if (unseen.length === 0) {
    return pool[Math.floor(Math.random() * pool.length)];
  }
  return unseen[Math.floor(Math.random() * unseen.length)];
}
