import { TastingNote, TastingNoteStatistics } from '../interfaces/TastingNote'

export const mockTastingNotes: TastingNote[] = [
  {
    id: '1',
    batch: {
      id: 'batch-1',
      batchCode: 'IPA-001',
      name: 'West Coast IPA',
      brewDate: '2024-10-15T00:00:00Z',
      status: 'completed',
      recipe: {
        id: 'recipe-1',
        name: 'IPA Clássica',
        style: 'American IPA',
      },
    },
    user: {
      id: 'user-1',
      name: 'André Silva',
      email: 'andre@maltmaster.com',
    },
    tastingDate: '2024-11-01T18:30:00Z',
    appearanceScore: 8.5,
    aromaScore: 9.0,
    flavorScore: 8.8,
    mouthfeelScore: 8.2,
    overallScore: 8.6,
    pros:
      'Excelente amargor equilibrado, aroma cítrico intenso, corpo médio perfeito para o estilo.',
    cons: 'Carbonatação poderia ser um pouco mais alta.',
    generalNotes:
      'Uma das melhores IPAs que produzi. O dry hopping ficou perfeito, conferindo notas de grapefruit e pinho. A transparência está excelente.',
    createdAt: '2024-11-01T18:30:00Z',
    updatedAt: '2024-11-01T18:30:00Z',
  },
  {
    id: '2',
    batch: {
      id: 'batch-2',
      batchCode: 'STOUT-001',
      name: 'Imperial Stout',
      brewDate: '2024-09-20T00:00:00Z',
      status: 'completed',
      recipe: {
        id: 'recipe-2',
        name: 'Russian Imperial Stout',
        style: 'Imperial Stout',
      },
    },
    user: {
      id: 'user-1',
      name: 'André Silva',
      email: 'andre@maltmaster.com',
    },
    tastingDate: '2024-10-28T20:00:00Z',
    appearanceScore: 9.5,
    aromaScore: 9.2,
    flavorScore: 9.4,
    mouthfeelScore: 9.3,
    overallScore: 9.4,
    pros:
      'Complexidade incrível, notas de chocolate, café e baunilha bem presentes. Corpo aveludado e cremoso.',
    cons: 'Álcool um pouco perceptível, mas dentro do esperado para o estilo.',
    generalNotes:
      'Melhor lote até agora! A maturação de 6 semanas valeu muito a pena. Vai melhorar ainda mais com o tempo.',
    createdAt: '2024-10-28T20:00:00Z',
    updatedAt: '2024-10-28T20:00:00Z',
  },
  {
    id: '3',
    batch: {
      id: 'batch-3',
      batchCode: 'LAGER-001',
      name: 'Czech Pilsner',
      brewDate: '2024-10-01T00:00:00Z',
      status: 'maturing',
      recipe: {
        id: 'recipe-3',
        name: 'Bohemian Pilsner',
        style: 'Czech Pilsner',
      },
    },
    user: {
      id: 'user-1',
      name: 'André Silva',
      email: 'andre@maltmaster.com',
    },
    tastingDate: '2024-10-25T16:00:00Z',
    appearanceScore: 7.8,
    aromaScore: 7.5,
    flavorScore: 7.2,
    mouthfeelScore: 7.4,
    overallScore: 7.5,
    pros:
      'Boa limpeza de sabor, amargor suave e agradável. Cor dourada brilhante.',
    cons:
      'Ainda não atingiu o pico. Precisa de mais tempo de maturação. Aroma poderia ser mais pronunciado.',
    generalNotes:
      'Primeira degustação. Vai melhorar significativamente nas próximas semanas de lagering.',
    createdAt: '2024-10-25T16:00:00Z',
    updatedAt: '2024-10-25T16:00:00Z',
  },
  {
    id: '4',
    batch: {
      id: 'batch-4',
      batchCode: 'PALE-001',
      name: 'American Pale Ale',
      brewDate: '2024-10-10T00:00:00Z',
      status: 'completed',
      recipe: {
        id: 'recipe-4',
        name: 'APA Cascade',
        style: 'American Pale Ale',
      },
    },
    user: {
      id: 'user-1',
      name: 'André Silva',
      email: 'andre@maltmaster.com',
    },
    tastingDate: '2024-10-30T19:00:00Z',
    appearanceScore: 8.0,
    aromaScore: 8.3,
    flavorScore: 8.1,
    mouthfeelScore: 7.9,
    overallScore: 8.1,
    pros: 'Lúpulos Cascade brilhando, notas florais e cítricas. Bebibilidade alta.',
    cons: 'Corpo um pouco leve demais.',
    generalNotes:
      'Ótima cerveja de sessão. Perfeita para um dia quente. Considerando aumentar um pouco os maltes caramelo na próxima leva.',
    createdAt: '2024-10-30T19:00:00Z',
    updatedAt: '2024-10-30T19:00:00Z',
  },
  {
    id: '5',
    batch: {
      id: 'batch-5',
      batchCode: 'EXP-001',
      name: 'Experimental Saison',
      brewDate: '2024-10-05T00:00:00Z',
      status: 'fermenting',
      recipe: {
        id: 'recipe-5',
        name: 'Saison Experimental',
        style: 'Saison',
      },
    },
    user: {
      id: 'user-1',
      name: 'André Silva',
      email: 'andre@maltmaster.com',
    },
    tastingDate: '2024-10-22T17:00:00Z',
    appearanceScore: 6.5,
    aromaScore: 5.8,
    flavorScore: 5.2,
    mouthfeelScore: 6.0,
    overallScore: 5.9,
    pros: 'Atenuação alta, seco como esperado para o estilo.',
    cons:
      'Ésteres frutados muito agressivos. Fenóis apimentados desbalanceados. Precisa de mais tempo.',
    generalNotes:
      'Teste de fermentação em temperatura mais alta. Não deu muito certo. Vai precisar de bastante tempo para amadurecer.',
    createdAt: '2024-10-22T17:00:00Z',
    updatedAt: '2024-10-22T17:00:00Z',
  },
]

export const mockStatistics: TastingNoteStatistics = {
  totalTastings: 5,
  averageAppearance: 8.06,
  averageAroma: 7.96,
  averageFlavor: 7.74,
  averageMouthfeel: 7.76,
  averageOverall: 7.9,
  highestScore: 9.4,
  lowestScore: 5.9,
}

// Função auxiliar para gerar avaliações mock aleatórias (para testes)
export const generateMockTastingNote = (
  batchId: string,
  batchName: string,
): TastingNote => {
  const randomScore = (min: number, max: number) =>
    Math.round((Math.random() * (max - min) + min) * 10) / 10

  const overallScore = randomScore(5, 10)

  return {
    id: `mock-${Date.now()}-${Math.random()}`,
    batch: {
      id: batchId,
      batchCode: `BATCH-${Math.floor(Math.random() * 1000)}`,
      name: batchName,
      brewDate: new Date(
        Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000,
      ).toISOString(),
      status: ['planned', 'fermenting', 'maturing', 'packaged', 'completed'][
        Math.floor(Math.random() * 5)
      ] as any,
    },
    user: {
      id: 'user-1',
      name: 'André Silva',
      email: 'andre@maltmaster.com',
    },
    tastingDate: new Date(
      Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000,
    ).toISOString(),
    appearanceScore: randomScore(6, 10),
    aromaScore: randomScore(6, 10),
    flavorScore: randomScore(6, 10),
    mouthfeelScore: randomScore(6, 10),
    overallScore,
    pros: 'Boas características gerais da cerveja.',
    cons: 'Alguns pontos a melhorar.',
    generalNotes: 'Avaliação geral da degustação.',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
}

