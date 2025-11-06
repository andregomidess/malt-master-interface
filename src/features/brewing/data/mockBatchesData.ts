import { Batch, BatchDetail, BrewLog } from '../interfaces/Brewing'

export const mockBatches: Batch[] = [
  {
    id: 'b1',
    name: 'IPA da Casa - Lote 23',
    batchCode: 'L-023',
    status: 'fermenting',
    recipe: {
      id: 'r1',
      name: 'American IPA',
      styleName: 'American IPA',
      og: 1.060,
      fg: 1.012,
      ibu: 55,
      color: 12,
      abv: 6.3
    },
    equipment: { id: 'e1', name: 'Panela 30L - BIAB' },
    brewDate: '2025-10-28',
    plannedVolume: 20,
    finalVolume: null,
    actualOriginalGravity: 1.061,
    actualFinalGravity: null,
    actualIbu: 58,
    actualColor: 13,
    actualAbv: null,
    actualEfficiency: 71,
    observations: 'Dry hop Citra + Mosaic no dia 3.'
  },
  {
    id: 'b2',
    name: 'Irish Stout',
    batchCode: 'L-022',
    status: 'completed',
    recipe: {
      id: 'r2',
      name: 'Irish Stout',
      styleName: 'Irish Dry Stout',
      og: 1.045,
      fg: 1.010,
      ibu: 35,
      color: 80,
      abv: 4.7
    },
    equipment: { id: 'e1', name: 'Panela 30L - BIAB' },
    brewDate: '2025-09-10',
    packagingDate: '2025-09-27',
    plannedVolume: 20,
    finalVolume: 19,
    actualOriginalGravity: 1.046,
    actualFinalGravity: 1.011,
    actualIbu: 34,
    actualColor: 82,
    actualAbv: 4.6,
    actualEfficiency: 69,
    observations: 'Carbonatação natural - 7g/L de açúcar'
  },
  {
    id: 'b3',
    name: 'Saison de Verão',
    batchCode: 'L-024',
    status: 'planned',
    recipe: {
      id: 'r3',
      name: 'Saison',
      styleName: 'Saison',
      og: 1.054,
      fg: 1.006,
      ibu: 28,
      color: 8,
      abv: 6.4
    },
    equipment: { id: 'e2', name: 'Sistema 3 panelas 40L' },
    brewDate: null,
    plannedVolume: 25,
    observations: 'Usar levedura Belle Saison'
  },
  {
    id: 'b4',
    name: 'West Coast IPA',
    batchCode: 'L-025',
    status: 'maturing',
    recipe: {
      id: 'r4',
      name: 'West Coast IPA',
      styleName: 'American IPA',
      og: 1.065,
      fg: 1.013,
      ibu: 70,
      color: 10,
      abv: 6.8
    },
    equipment: { id: 'e1', name: 'Panela 30L - BIAB' },
    brewDate: '2025-11-01',
    plannedVolume: 20,
    finalVolume: 19.5,
    actualOriginalGravity: 1.066,
    actualFinalGravity: 1.012,
    actualIbu: 72,
    actualColor: 11,
    actualAbv: 7.1,
    actualEfficiency: 73,
    observations: 'Cold crash antes de envasar'
  },
  {
    id: 'b5',
    name: 'Witbier Belga',
    batchCode: 'L-021',
    status: 'packaged',
    recipe: {
      id: 'r5',
      name: 'Belgian Witbier',
      styleName: 'Witbier',
      og: 1.048,
      fg: 1.010,
      ibu: 15,
      color: 4,
      abv: 5.0
    },
    equipment: { id: 'e1', name: 'Panela 30L - BIAB' },
    brewDate: '2025-08-15',
    packagingDate: '2025-08-30',
    plannedVolume: 20,
    finalVolume: 18,
    actualOriginalGravity: 1.049,
    actualFinalGravity: 1.011,
    actualIbu: 16,
    actualColor: 5,
    actualAbv: 5.0,
    actualEfficiency: 68
  }
]

export const mockDetails: Record<string, BatchDetail> = {
  b1: {
    batch: mockBatches[0],
    mashSteps: [
      {
        id: 'm1',
        stepOrder: 1,
        name: 'Aquecimento',
        stepType: 'temperature',
        temperature: 50,
        duration: 10,
        description: 'Aquecimento inicial do mosto'
      },
      {
        id: 'm2',
        stepOrder: 2,
        name: 'Sacarificação',
        stepType: 'temperature',
        temperature: 66,
        duration: 60,
        description: 'Conversão de amidos em açúcares'
      },
      {
        id: 'm3',
        stepOrder: 3,
        name: 'Mash Out',
        stepType: 'temperature',
        temperature: 76,
        duration: 10,
        description: 'Parada das enzimas'
      }
    ],
    fermentationSteps: [
      {
        id: 'f1',
        stepOrder: 1,
        name: 'Fermentação Primária',
        temperature: 19,
        duration: 7
      },
      {
        id: 'f2',
        stepOrder: 2,
        name: 'Maturação',
        temperature: 2,
        duration: 5
      }
    ],
    hopSchedule: [
      { time: 60, name: 'Magnum', amount: 20, unit: 'g', alphaAcid: 12.0 },
      { time: 15, name: 'Citra', amount: 30, unit: 'g', alphaAcid: 12.5 },
      { time: 5, name: 'Mosaic', amount: 30, unit: 'g', alphaAcid: 12.2 },
      { time: 0, name: 'Citra + Mosaic', amount: 40, unit: 'g', alphaAcid: 12.3 }
    ]
  },
  b2: {
    batch: mockBatches[1],
    mashSteps: [
      {
        id: 'm1',
        stepOrder: 1,
        name: 'Sacarificação',
        stepType: 'temperature',
        temperature: 66,
        duration: 60
      },
      {
        id: 'm2',
        stepOrder: 2,
        name: 'Mash Out',
        stepType: 'temperature',
        temperature: 76,
        duration: 10
      }
    ],
    fermentationSteps: [
      {
        id: 'f1',
        stepOrder: 1,
        name: 'Fermentação Primária',
        temperature: 18,
        duration: 10
      }
    ],
    hopSchedule: [
      { time: 60, name: 'East Kent Goldings', amount: 25, unit: 'g', alphaAcid: 5.5 }
    ]
  },
  b3: {
    batch: mockBatches[2],
    mashSteps: [
      {
        id: 'm1',
        stepOrder: 1,
        name: 'Sacarificação',
        stepType: 'temperature',
        temperature: 65,
        duration: 60
      }
    ],
    fermentationSteps: [
      {
        id: 'f1',
        stepOrder: 1,
        name: 'Fermentação Primária',
        temperature: 24,
        duration: 14
      }
    ],
    hopSchedule: [
      { time: 60, name: 'Hallertau', amount: 15, unit: 'g', alphaAcid: 4.0 },
      { time: 10, name: 'Saaz', amount: 20, unit: 'g', alphaAcid: 3.5 }
    ]
  },
  b4: {
    batch: mockBatches[3],
    mashSteps: [
      {
        id: 'm1',
        stepOrder: 1,
        name: 'Sacarificação',
        stepType: 'temperature',
        temperature: 64,
        duration: 60
      },
      {
        id: 'm2',
        stepOrder: 2,
        name: 'Mash Out',
        stepType: 'temperature',
        temperature: 76,
        duration: 10
      }
    ],
    fermentationSteps: [
      {
        id: 'f1',
        stepOrder: 1,
        name: 'Fermentação Primária',
        temperature: 18,
        duration: 10
      },
      {
        id: 'f2',
        stepOrder: 2,
        name: 'Dry Hop',
        temperature: 18,
        duration: 3
      },
      {
        id: 'f3',
        stepOrder: 3,
        name: 'Cold Crash',
        temperature: 2,
        duration: 2
      }
    ],
    hopSchedule: [
      { time: 60, name: 'Warrior', amount: 25, unit: 'g', alphaAcid: 15.0 },
      { time: 20, name: 'Cascade', amount: 30, unit: 'g', alphaAcid: 7.0 },
      { time: 10, name: 'Centennial', amount: 30, unit: 'g', alphaAcid: 10.0 },
      { time: 0, name: 'Simcoe', amount: 40, unit: 'g', alphaAcid: 13.0 }
    ]
  }
}

export const mockLogs: BrewLog[] = [
  {
    id: 'l1',
    batchId: 'b1',
    timestamp: '2025-10-28T11:00:00Z',
    gravity: 1.061,
    temperature: 19.0,
    note: 'OG após inoculação',
    event: 'other'
  },
  {
    id: 'l2',
    batchId: 'b1',
    timestamp: '2025-10-31T11:00:00Z',
    gravity: 1.020,
    temperature: 19.5,
    note: '3º dia - fermentação ativa'
  },
  {
    id: 'l3',
    batchId: 'b1',
    timestamp: '2025-11-02T11:00:00Z',
    gravity: 1.014,
    temperature: 19.0,
    note: 'Adição de dry hop',
    event: 'dry_hop'
  },
  {
    id: 'l4',
    batchId: 'b1',
    timestamp: '2025-11-04T11:00:00Z',
    gravity: 1.012,
    temperature: 18.5,
    note: 'Gravidade estável'
  },
  {
    id: 'l5',
    batchId: 'b2',
    timestamp: '2025-09-10T10:00:00Z',
    gravity: 1.046,
    temperature: 18.0,
    note: 'OG'
  },
  {
    id: 'l6',
    batchId: 'b2',
    timestamp: '2025-09-20T10:00:00Z',
    gravity: 1.011,
    temperature: 17.5,
    note: 'FG'
  }
]

