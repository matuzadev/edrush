export interface Plan {
  id: string;
  name: string;
  price: number;
  description: string;
  features: string[];
  popular?: boolean;
}

export const PLANS: Plan[] = [
  {
    id: 'starter',
    name: 'EdRush Premium',
    price: 14.99,
    description: 'Estudo ilimitado e recursos avançados',
    popular: true,
    features: [
      'Acesso a 12.000+ questões comentadas',
      'Active Recall ciclo 1-7-30',
      'Analytics por matéria em tempo real',
      'Mapa de todos os concursos do Brasil',
      'Sistema de XP, níveis e medalhas',
      'Perfil público compartilhável',
      'Suporte por email',
    ],
  },
];
