export type QuestionType = 'multipla' | 'verdadeiro_falso' | 'discursiva';

export interface Question {
  id: string;
  userId: string;
  subject: string;
  chapter: number;
  difficulty: 'fácil' | 'médio' | 'difícil';
  type: QuestionType;
  question: string;
  tip?: string; // Dica sobre o conteúdo
  correctAnswer: string;
  options?: string[]; // Para multipla escolha (A, B, C, D, E)
  userAnswer?: string;
  isCorrect?: boolean;
  attempts: number;
  lastReviewDate?: string;
  nextReviewDate: string;
  interval: number; // dias
  easeFactor: number; // para algoritmo SM-2
}

// Mock questions para desenvolvimento
export const MOCK_QUESTIONS: Question[] = [
  {
    id: '1',
    userId: 'mock',
    subject: 'Português',
    chapter: 1,
    difficulty: 'fácil',
    type: 'verdadeiro_falso',
    question: 'A acentuação é obrigatória em todas as palavras esdrúxulas?',
    tip: 'Palavras esdrúxulas são aquelas cuja tônica é a antepenúltima sílaba.',
    correctAnswer: 'Verdadeiro',
    attempts: 2,
    nextReviewDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
    interval: 1,
    easeFactor: 2.5,
  },
  {
    id: '2',
    userId: 'mock',
    subject: 'Português',
    chapter: 1,
    difficulty: 'médio',
    type: 'multipla',
    question: 'Qual é a função sintática do adjetivo na frase: "A casa azul é bonita"?',
    tip: 'Observe a posição e o termo que o adjetivo modifica.',
    options: ['Adjunto adnominal', 'Predicativo do sujeito', 'Adjunto adverbial', 'Predicativo do objeto', 'Aposto'],
    correctAnswer: 'Adjunto adnominal',
    attempts: 1,
    nextReviewDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString(),
    interval: 0,
    easeFactor: 2.5,
  },
  {
    id: '3',
    userId: 'mock',
    subject: 'Português',
    chapter: 2,
    difficulty: 'difícil',
    type: 'multipla',
    question: 'Qual alternativa apresenta uma figura de linguagem de metáfora?',
    tip: 'Metáfora é uma comparação implícita entre dois termos.',
    options: ['A vida é uma jornada', 'Saiu para a rua e voltou com amigos', 'A menina, quando chora, é insoportável', 'O professor cansado de explicar', 'Aquele carro corre veloz'],
    correctAnswer: 'A vida é uma jornada',
    attempts: 0,
    nextReviewDate: new Date().toISOString(),
    interval: 0,
    easeFactor: 2.5,
  },
  {
    id: '4',
    userId: 'mock',
    subject: 'Redes de Computadores',
    chapter: 1,
    difficulty: 'médio',
    type: 'verdadeiro_falso',
    question: 'O protocolo TCP garante a entrega dos pacotes em ordem?',
    tip: 'TCP/IP é um protocolo orientado à conexão e confiável.',
    correctAnswer: 'Verdadeiro',
    attempts: 1,
    nextReviewDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
    interval: 3,
    easeFactor: 2.6,
  },
  {
    id: '5',
    userId: 'mock',
    subject: 'Redes de Computadores',
    chapter: 1,
    difficulty: 'fácil',
    type: 'multipla',
    question: 'Qual camada do modelo OSI é responsável pelo roteamento?',
    tip: 'A camada de rede trabalha com endereços IP e roteadores.',
    options: ['Camada de Aplicação', 'Camada de Transporte', 'Camada de Rede', 'Camada de Link de Dados', 'Camada Física'],
    correctAnswer: 'Camada de Rede',
    attempts: 0,
    nextReviewDate: new Date().toISOString(),
    interval: 0,
    easeFactor: 2.5,
  },
  {
    id: '6',
    userId: 'mock',
    subject: 'Redes de Computadores',
    chapter: 2,
    difficulty: 'difícil',
    type: 'multipla',
    question: 'O que é VLAN?',
    tip: 'VLAN significa Virtual Local Area Network.',
    options: ['Uma rede virtual que divide switches em segmentos lógicos', 'Um protocolo de comunicação entre computadores', 'Um tipo de firewall', 'Um algoritmo de criptografia', 'Um sistema de cache de dados'],
    correctAnswer: 'Uma rede virtual que divide switches em segmentos lógicos',
    attempts: 0,
    nextReviewDate: new Date().toISOString(),
    interval: 0,
    easeFactor: 2.5,
  },
];

// Algoritmo SM-2 para espaçamento de revisão
export const calculateNextReview = (
  easeFactor: number,
  interval: number,
  quality: number // 0-5, sendo 5 perfeito
): { nextDate: string; newInterval: number; newEaseFactor: number } => {
  let newEaseFactor = easeFactor + 0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02);
  if (newEaseFactor < 1.3) newEaseFactor = 1.3;

  let newInterval: number;
  if (quality < 3) {
    newInterval = 0;
  } else if (interval === 0) {
    newInterval = 1;
  } else if (interval === 1) {
    newInterval = 3;
  } else {
    newInterval = Math.round(interval * newEaseFactor);
  }

  const nextDate = new Date();
  nextDate.setDate(nextDate.getDate() + newInterval);

  return {
    nextDate: nextDate.toISOString(),
    newInterval,
    newEaseFactor: Math.round(newEaseFactor * 100) / 100,
  };
};

// Buscar questões para revisar (Active Recall)
export const getQuestionsForReview = (questions: Question[]): Question[] => {
  const now = new Date();
  return questions
    .filter(q => new Date(q.nextReviewDate) <= now)
    .sort((a, b) => {
      // Priorizar: nunca respondidas > fáceis > médias > difíceis
      const diffOrder = { fácil: 0, médio: 1, difícil: 2 };
      return diffOrder[a.difficulty] - diffOrder[b.difficulty];
    });
};

// Salvar resposta no banco via API
export const saveQuestionAnswer = async (
  userId: string,
  questionId: string,
  userAnswer: string,
  isCorrect: boolean,
  _qualityRating: number
) => {
  try {
    await fetch('/api/submit-answer', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, questionId, userAnswer, isCorrect }),
    });
  } catch (error) {
    console.error('Erro ao salvar resposta:', error);
  }
};

// Carregar questões — por enquanto retorna mock (pendente integração completa com DB)
export const fetchUserQuestions = async (_userId: string): Promise<Question[]> => {
  return MOCK_QUESTIONS;
};
