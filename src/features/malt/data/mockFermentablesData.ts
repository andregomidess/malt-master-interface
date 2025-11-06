// Tipos de fermentáveis baseados no backend
export enum FermentableType {
  BASE = 'base',
  SPECIALTY = 'specialty',
  SUGAR = 'sugar',
  ADJUNCT = 'adjunct',
}

export enum FermentableForm {
  GRAIN = 'grain',
  DRY_EXTRACT = 'dry_extract',
  LIQUID_EXTRACT = 'liquid_extract',
  SYRUP = 'syrup',
}

// Traduções
export const fermentableTypeLabels: Record<FermentableType, string> = {
  [FermentableType.BASE]: 'Malte Base',
  [FermentableType.SPECIALTY]: 'Malte Especial',
  [FermentableType.SUGAR]: 'Açúcar',
  [FermentableType.ADJUNCT]: 'Adjunto',
}

export const fermentableFormLabels: Record<FermentableForm, string> = {
  [FermentableForm.GRAIN]: 'Grãos',
  [FermentableForm.DRY_EXTRACT]: 'Extrato Seco',
  [FermentableForm.LIQUID_EXTRACT]: 'Extrato Líquido',
  [FermentableForm.SYRUP]: 'Xarope',
}

// Interface do fermentável
export interface Fermentable {
  id: string
  name: string
  type: FermentableType
  color: number | null // EBC
  yield: number | null // %
  origin: string | null
  supplier: string | null
  form: FermentableForm
  notes: string | null
  isPublic: boolean
  createdAt: Date
}

// Função para converter EBC em cor hexadecimal (aproximação visual)
export const ebcToColor = (ebc: number | null): string => {
  if (ebc === null || ebc === 0) return '#F9E89F' // Muito claro

  if (ebc <= 4) return '#F9E89F' // Muito Claro (Pilsen)
  if (ebc <= 10) return '#F5D76E' // Claro (Pale Ale)
  if (ebc <= 25) return '#E0B040' // Dourado (Munich)
  if (ebc <= 60) return '#C07020' // Âmbar (Crystal)
  if (ebc <= 100) return '#8B4513' // Marrom Claro
  if (ebc <= 200) return '#6B3410' // Marrom (Chocolate)
  if (ebc <= 300) return '#3D2210' // Marrom Escuro
  return '#1A0A00' // Muito Escuro/Preto (Torrado)
}

// Função para classificar cor
export const getColorClassification = (
  ebc: number | null
): { label: string; color: string } => {
  if (ebc === null || ebc === 0)
    return { label: 'Muito Claro', color: '#10B981' }
  if (ebc <= 10) return { label: 'Muito Claro', color: '#10B981' }
  if (ebc <= 40) return { label: 'Claro', color: '#F59E0B' }
  if (ebc <= 100) return { label: 'Âmbar', color: '#F97316' }
  if (ebc <= 300) return { label: 'Escuro', color: '#B45309' }
  return { label: 'Muito Escuro', color: '#78350F' }
}

// Função para classificar rendimento
export const getYieldLevel = (
  yieldValue: number | null
): { label: string; color: string; bgColor: string } => {
  if (yieldValue === null)
    return { label: 'N/A', color: '#6B7280', bgColor: '#F3F4F6' }
  if (yieldValue > 80)
    return { label: 'Alto', color: '#10B981', bgColor: '#D1FAE5' }
  if (yieldValue > 70)
    return { label: 'Médio', color: '#F59E0B', bgColor: '#FEF3C7' }
  return { label: 'Baixo', color: '#F97316', bgColor: '#FFEDD5' }
}

// Verificar se é malte base essencial
export const isEssentialBaseMalt = (fermentable: Fermentable): boolean => {
  const essentialNames = [
    'pilsen',
    'pale ale',
    'pale malt',
    'munich',
    'vienna',
    'maris otter',
  ]
  return (
    fermentable.type === FermentableType.BASE &&
    essentialNames.some(name =>
      fermentable.name.toLowerCase().includes(name)
    )
  )
}

// Verificar se é malte torrado (cor muito escura)
export const isRoastedMalt = (fermentable: Fermentable): boolean => {
  return (
    fermentable.type === FermentableType.SPECIALTY &&
    (fermentable.color || 0) > 300
  )
}

// Configuração de cores por tipo
export const typeColors: Record<
  FermentableType,
  { color: string; bgColor: string; icon: string }
> = {
  [FermentableType.BASE]: {
    color: '#92400E',
    bgColor: '#FEF3C7',
    icon: '🌾',
  },
  [FermentableType.SPECIALTY]: {
    color: '#F97316',
    bgColor: '#FFEDD5',
    icon: '🔥',
  },
  [FermentableType.SUGAR]: {
    color: '#F59E0B',
    bgColor: '#FEF3C7',
    icon: '🍯',
  },
  [FermentableType.ADJUNCT]: {
    color: '#10B981',
    bgColor: '#D1FAE5',
    icon: '🌽',
  },
}

// Função para criar datas relativas
const daysAgo = (days: number): Date => {
  const date = new Date()
  date.setDate(date.getDate() - days)
  return date
}

// Dados mockados - 22 fermentáveis variados
export const mockFermentablesData: Fermentable[] = [
  // MALTES BASE (7 itens)
  {
    id: '1',
    name: 'Malte Pilsen',
    type: FermentableType.BASE,
    color: 3,
    yield: 82,
    origin: '🇩🇪 Alemanha',
    supplier: 'Weyermann',
    form: FermentableForm.GRAIN,
    notes: 'Malte base clássico para lagers e pilsners, sabor limpo e neutro',
    isPublic: true,
    createdAt: daysAgo(200),
  },
  {
    id: '2',
    name: 'Pale Ale Malt',
    type: FermentableType.BASE,
    color: 6,
    yield: 80,
    origin: '🇬🇧 Inglaterra',
    supplier: 'Crisp Malting',
    form: FermentableForm.GRAIN,
    notes: 'Malte base para ales, sabor levemente adocicado e maltado',
    isPublic: true,
    createdAt: daysAgo(180),
  },
  {
    id: '3',
    name: 'Malte Vienna',
    type: FermentableType.BASE,
    color: 8,
    yield: 79,
    origin: '🇩🇪 Alemanha',
    supplier: 'BestMalz',
    form: FermentableForm.GRAIN,
    notes: 'Malte base âmbar, adiciona cor dourada e sabor maltado',
    isPublic: true,
    createdAt: daysAgo(150),
  },
  {
    id: '4',
    name: 'Malte Munich',
    type: FermentableType.BASE,
    color: 20,
    yield: 78,
    origin: '🇩🇪 Alemanha',
    supplier: 'Weyermann',
    form: FermentableForm.GRAIN,
    notes: 'Malte base escuro, sabor maltado intenso e cor dourada profunda',
    isPublic: true,
    createdAt: daysAgo(160),
  },
  {
    id: '5',
    name: 'Wheat Malt (Malte de Trigo)',
    type: FermentableType.BASE,
    color: 4,
    yield: 80,
    origin: '🇩🇪 Alemanha',
    supplier: 'Weyermann',
    form: FermentableForm.GRAIN,
    notes: 'Malte de trigo para weiss e witbier, corpo cremoso',
    isPublic: true,
    createdAt: daysAgo(140),
  },
  {
    id: '6',
    name: 'Maris Otter',
    type: FermentableType.BASE,
    color: 6,
    yield: 81,
    origin: '🇬🇧 Inglaterra',
    supplier: 'Fawcett',
    form: FermentableForm.GRAIN,
    notes: 'Malte base premium inglês, sabor rico e complexo',
    isPublic: false,
    createdAt: daysAgo(120),
  },
  {
    id: '7',
    name: 'Pale Malt 2-Row',
    type: FermentableType.BASE,
    color: 3.5,
    yield: 82,
    origin: '🇺🇸 EUA',
    supplier: 'Rahr Malting',
    form: FermentableForm.GRAIN,
    notes: 'Malte base americano de 2 carreiras, muito versátil',
    isPublic: true,
    createdAt: daysAgo(100),
  },

  // MALTES ESPECIAIS (9 itens)
  {
    id: '8',
    name: 'Caramelo 60L (Crystal 60)',
    type: FermentableType.SPECIALTY,
    color: 120,
    yield: 75,
    origin: '🇺🇸 EUA',
    supplier: 'Briess',
    form: FermentableForm.GRAIN,
    notes: 'Caramelo médio, adiciona dulçor, corpo e cor âmbar',
    isPublic: true,
    createdAt: daysAgo(170),
  },
  {
    id: '9',
    name: 'Caramelo 120L (Crystal 120)',
    type: FermentableType.SPECIALTY,
    color: 240,
    yield: 74,
    origin: '🇺🇸 EUA',
    supplier: 'Briess',
    form: FermentableForm.GRAIN,
    notes: 'Caramelo escuro, sabor intenso de caramelo e uva passa',
    isPublic: true,
    createdAt: daysAgo(160),
  },
  {
    id: '10',
    name: 'Malte Chocolate',
    type: FermentableType.SPECIALTY,
    color: 800,
    yield: 70,
    origin: '🇬🇧 Inglaterra',
    supplier: 'Crisp Malting',
    form: FermentableForm.GRAIN,
    notes: 'Malte torrado, sabor de chocolate e café',
    isPublic: true,
    createdAt: daysAgo(150),
  },
  {
    id: '11',
    name: 'Carafa Special II',
    type: FermentableType.SPECIALTY,
    color: 1400,
    yield: 68,
    origin: '🇩🇪 Alemanha',
    supplier: 'Weyermann',
    form: FermentableForm.GRAIN,
    notes: 'Malte ultra-escuro sem amargor, cor intensa',
    isPublic: true,
    createdAt: daysAgo(130),
  },
  {
    id: '12',
    name: 'Roasted Barley (Cevada Torrada)',
    type: FermentableType.SPECIALTY,
    color: 1400,
    yield: 65,
    origin: '🇮🇪 Irlanda',
    supplier: 'Muntons',
    form: FermentableForm.GRAIN,
    notes: 'Cevada torrada não maltada, cor preta e sabor seco',
    isPublic: true,
    createdAt: daysAgo(110),
  },
  {
    id: '13',
    name: 'Biscuit Malt',
    type: FermentableType.SPECIALTY,
    color: 45,
    yield: 75,
    origin: '🇧🇪 Bélgica',
    supplier: 'Dingemans',
    form: FermentableForm.GRAIN,
    notes: 'Sabor torrado de biscoito e pão',
    isPublic: true,
    createdAt: daysAgo(120),
  },
  {
    id: '14',
    name: 'Victory Malt',
    type: FermentableType.SPECIALTY,
    color: 50,
    yield: 75,
    origin: '🇺🇸 EUA',
    supplier: 'Briess',
    form: FermentableForm.GRAIN,
    notes: 'Sabor de biscoito, noz e torrado',
    isPublic: false,
    createdAt: daysAgo(90),
  },
  {
    id: '15',
    name: 'Aromatic Malt',
    type: FermentableType.SPECIALTY,
    color: 40,
    yield: 76,
    origin: '🇧🇪 Bélgica',
    supplier: 'Dingemans',
    form: FermentableForm.GRAIN,
    notes: 'Aroma maltado intenso, notas de mel',
    isPublic: true,
    createdAt: daysAgo(100),
  },
  {
    id: '16',
    name: 'Melanoidin Malt',
    type: FermentableType.SPECIALTY,
    color: 50,
    yield: 77,
    origin: '🇩🇪 Alemanha',
    supplier: 'Weyermann',
    form: FermentableForm.GRAIN,
    notes: 'Cor avermelhada, sabor maltado complexo',
    isPublic: true,
    createdAt: daysAgo(80),
  },

  // AÇÚCARES (4 itens)
  {
    id: '17',
    name: 'Mel de Flores',
    type: FermentableType.SUGAR,
    color: 10,
    yield: 100,
    origin: '🇧🇷 Brasil',
    supplier: 'Apiário Local',
    form: FermentableForm.SYRUP,
    notes: 'Mel puro, adiciona aroma floral e aumenta álcool',
    isPublic: false,
    createdAt: daysAgo(30),
  },
  {
    id: '18',
    name: 'Açúcar Branco',
    type: FermentableType.SUGAR,
    color: 0,
    yield: 100,
    origin: '🇧🇷 Brasil',
    supplier: 'União',
    form: FermentableForm.GRAIN,
    notes: 'Açúcar refinado, aumenta álcool sem adicionar corpo',
    isPublic: true,
    createdAt: daysAgo(50),
  },
  {
    id: '19',
    name: 'Candy Sugar Claro',
    type: FermentableType.SUGAR,
    color: 15,
    yield: 100,
    origin: '🇧🇪 Bélgica',
    supplier: 'Brewferm',
    form: FermentableForm.SYRUP,
    notes: 'Açúcar belga, sabor complexo para Belgian ales',
    isPublic: true,
    createdAt: daysAgo(70),
  },
  {
    id: '20',
    name: 'Açúcar Mascavo',
    type: FermentableType.SUGAR,
    color: 100,
    yield: 100,
    origin: '🇧🇷 Brasil',
    supplier: 'Native',
    form: FermentableForm.GRAIN,
    notes: 'Açúcar não refinado, sabor de melaço',
    isPublic: false,
    createdAt: daysAgo(40),
  },

  // ADJUNTOS (4 itens)
  {
    id: '21',
    name: 'Aveia em Flocos',
    type: FermentableType.ADJUNCT,
    color: 4,
    yield: 65,
    origin: '🇧🇷 Brasil',
    supplier: 'Quaker',
    form: FermentableForm.GRAIN,
    notes: 'Adiciona cremosidade e corpo sedoso, ideal para Oatmeal Stout',
    isPublic: true,
    createdAt: daysAgo(60),
  },
  {
    id: '22',
    name: 'Milho em Flocos',
    type: FermentableType.ADJUNCT,
    color: 2,
    yield: 80,
    origin: '🇧🇷 Brasil',
    supplier: 'Yoki',
    form: FermentableForm.GRAIN,
    notes: 'Deixa a cerveja mais leve e seca, usado em American Lagers',
    isPublic: true,
    createdAt: daysAgo(55),
  },
  {
    id: '23',
    name: 'Arroz em Flocos',
    type: FermentableType.ADJUNCT,
    color: 1,
    yield: 82,
    origin: '🇧🇷 Brasil',
    supplier: 'Urbano',
    form: FermentableForm.GRAIN,
    notes: 'Corpo muito leve e seco, usado em lagers comerciais',
    isPublic: true,
    createdAt: daysAgo(65),
  },
  {
    id: '24',
    name: 'Trigo não maltado',
    type: FermentableType.ADJUNCT,
    color: 3,
    yield: 72,
    origin: '🇧🇷 Brasil',
    supplier: 'Agrícola',
    form: FermentableForm.GRAIN,
    notes: 'Adiciona turbidez e espuma, usado em Witbier',
    isPublic: true,
    createdAt: daysAgo(45),
  },

  // EXTRATOS (2 itens)
  {
    id: '25',
    name: 'Extrato Seco de Malte Claro',
    type: FermentableType.BASE,
    color: 10,
    yield: 100,
    origin: '🇺🇸 EUA',
    supplier: 'Briess',
    form: FermentableForm.DRY_EXTRACT,
    notes: 'Extrato em pó para cerveja clara, fácil de usar',
    isPublic: true,
    createdAt: daysAgo(85),
  },
  {
    id: '26',
    name: 'Extrato Líquido de Malte Munich',
    type: FermentableType.BASE,
    color: 20,
    yield: 78,
    origin: '🇩🇪 Alemanha',
    supplier: 'Weyermann',
    form: FermentableForm.LIQUID_EXTRACT,
    notes: 'Extrato líquido com sabor maltado intenso',
    isPublic: true,
    createdAt: daysAgo(75),
  },
]

// Função para calcular estatísticas dos fermentáveis
export const calculateFermentableStats = (fermentables: Fermentable[]) => {
  const totalFermentables = fermentables.length
  const baseMalts = fermentables.filter(
    f => f.type === FermentableType.BASE
  ).length
  const specialtyMalts = fermentables.filter(
    f => f.type === FermentableType.SPECIALTY
  ).length
  const sugarsAndAdjuncts = fermentables.filter(
    f =>
      f.type === FermentableType.SUGAR || f.type === FermentableType.ADJUNCT
  ).length

  return {
    totalFermentables,
    baseMalts,
    specialtyMalts,
    sugarsAndAdjuncts,
  }
}

// Função para filtrar fermentáveis por tipo
export const filterFermentablesByType = (
  fermentables: Fermentable[],
  type: FermentableType | 'all'
): Fermentable[] => {
  if (type === 'all') return fermentables
  return fermentables.filter(fermentable => fermentable.type === type)
}

// Função para buscar fermentáveis
export const searchFermentables = (
  fermentables: Fermentable[],
  query: string
): Fermentable[] => {
  const lowerQuery = query.toLowerCase()
  return fermentables.filter(
    fermentable =>
      fermentable.name.toLowerCase().includes(lowerQuery) ||
      fermentable.origin?.toLowerCase().includes(lowerQuery) ||
      fermentable.notes?.toLowerCase().includes(lowerQuery)
  )
}

// Função para ordenar fermentáveis
export type FermentableSortBy = 'name' | 'color' | 'yield' | 'type'

export const sortFermentables = (
  fermentables: Fermentable[],
  sortBy: FermentableSortBy
): Fermentable[] => {
  const sorted = [...fermentables]

  switch (sortBy) {
    case 'name':
      return sorted.sort((a, b) => a.name.localeCompare(b.name))
    case 'color':
      return sorted.sort((a, b) => (a.color || 0) - (b.color || 0))
    case 'yield':
      return sorted.sort((a, b) => (b.yield || 0) - (a.yield || 0))
    case 'type':
      return sorted.sort((a, b) => a.type.localeCompare(b.type))
    default:
      return sorted
  }
}

