export enum BeerTag {
  HOPPY = 'HOPPY',
  MALTY = 'MALTY',
  FRUITY = 'FRUITY',
  SPICY = 'SPICY',
  ROASTED = 'ROASTED',
  DARK = 'DARK',
  LIGHT = 'LIGHT',
  SOUR = 'SOUR',
  SWEET = 'SWEET',
  BITTER = 'BITTER',
  SMOOTH = 'SMOOTH',
  CRISP = 'CRISP',
  REFRESHING = 'REFRESHING',
  COMPLEX = 'COMPLEX',
  TRADITIONAL = 'TRADITIONAL',
  MODERN = 'MODERN',
  SESSIONABLE = 'SESSIONABLE',
  STRONG = 'STRONG',
  WHEAT = 'WHEAT',
  COFFEE = 'COFFEE',
  CHOCOLATE = 'CHOCOLATE',
  CARAMEL = 'CARAMEL',
  CITRUS = 'CITRUS',
  TROPICAL = 'TROPICAL',
  FLORAL = 'FLORAL',
  EARTHY = 'EARTHY',
  HERBAL = 'HERBAL',
  SMOKY = 'SMOKY',
  BALANCED = 'BALANCED',
  ROASTY = 'ROASTY',
}

export enum GlasswareType {
  PINT = 'PINT',
  PILSNER = 'PILSNER',
  WEIZEN = 'WEIZEN',
  TULIP = 'TULIP',
  SNIFTER = 'SNIFTER',
  STOUT_GLASS = 'STOUT_GLASS',
  GOBLET_CHALICE = 'GOBLET_CHALICE',
  STEIN = 'STEIN',
  MUG = 'MUG',
}

export interface User {
  id: string
  name: string
  email: string
}

export interface BeerStyle {
  id: string
  name: string
  user?: User | null
  category?: string | null
  subCategory?: string | null
  minAbv?: number | null
  maxAbv?: number | null
  minOg?: number | null
  maxOg?: number | null
  minFg?: number | null
  maxFg?: number | null
  minIbu?: number | null
  maxIbu?: number | null
  minColorEbc?: number | null
  maxColorEbc?: number | null
  description?: string | null
  aroma?: string | null
  appearance?: string | null
  flavor?: string | null
  mouthfeel?: string | null
  comments?: string | null
  history?: string | null
  ingredients?: string | null
  examples?: string | null
  tags: BeerTag[]
  origin?: string | null
  glassware?: GlasswareType | null
  createdAt: string
  updatedAt?: string | null
}

export interface BeerStyleInput {
  id?: string
  name: string
  category?: string
  subCategory?: string
  minAbv?: number
  maxAbv?: number
  minOg?: number
  maxOg?: number
  minFg?: number
  maxFg?: number
  minIbu?: number
  maxIbu?: number
  minColorEbc?: number
  maxColorEbc?: number
  description?: string
  aroma?: string
  appearance?: string
  flavor?: string
  mouthfeel?: string
  comments?: string
  history?: string
  ingredients?: string
  examples?: string
  tags: BeerTag[]
  origin?: string
  glassware?: GlasswareType
}

export const BeerTagLabels: Record<BeerTag, string> = {
  [BeerTag.HOPPY]: 'Lupulado',
  [BeerTag.MALTY]: 'Maltado',
  [BeerTag.FRUITY]: 'Frutado',
  [BeerTag.SPICY]: 'Condimentado',
  [BeerTag.ROASTED]: 'Torrado',
  [BeerTag.DARK]: 'Escuro',
  [BeerTag.LIGHT]: 'Claro',
  [BeerTag.SOUR]: 'Azedo',
  [BeerTag.SWEET]: 'Doce',
  [BeerTag.BITTER]: 'Amargo',
  [BeerTag.SMOOTH]: 'Suave',
  [BeerTag.CRISP]: 'Refrescante',
  [BeerTag.REFRESHING]: 'Revigorante',
  [BeerTag.COMPLEX]: 'Complexo',
  [BeerTag.TRADITIONAL]: 'Tradicional',
  [BeerTag.MODERN]: 'Moderno',
  [BeerTag.SESSIONABLE]: 'Session',
  [BeerTag.STRONG]: 'Forte',
  [BeerTag.WHEAT]: 'Trigo',
  [BeerTag.COFFEE]: 'Café',
  [BeerTag.CHOCOLATE]: 'Chocolate',
  [BeerTag.CARAMEL]: 'Caramelo',
  [BeerTag.CITRUS]: 'Cítrico',
  [BeerTag.TROPICAL]: 'Tropical',
  [BeerTag.FLORAL]: 'Floral',
  [BeerTag.EARTHY]: 'Terroso',
  [BeerTag.HERBAL]: 'Herbal',
  [BeerTag.SMOKY]: 'Defumado',
  [BeerTag.BALANCED]: 'Equilibrado',
  [BeerTag.ROASTY]: 'Tostado',
}

// Cores para Tags
export const BeerTagColors: Record<
  BeerTag,
  { color: string; bgColor: string }
> = {
  [BeerTag.HOPPY]: { color: '#10B981', bgColor: '#D1FAE5' },
  [BeerTag.MALTY]: { color: '#D97706', bgColor: '#FEF3C7' },
  [BeerTag.FRUITY]: { color: '#EC4899', bgColor: '#FCE7F3' },
  [BeerTag.SPICY]: { color: '#EF4444', bgColor: '#FEE2E2' },
  [BeerTag.ROASTED]: { color: '#451A03', bgColor: '#FED7AA' },
  [BeerTag.DARK]: { color: '#78350F', bgColor: '#FED7AA' },
  [BeerTag.LIGHT]: { color: '#EAB308', bgColor: '#FEF9C3' },
  [BeerTag.SOUR]: { color: '#F59E0B', bgColor: '#FEF3C7' },
  [BeerTag.SWEET]: { color: '#EC4899', bgColor: '#FCE7F3' },
  [BeerTag.BITTER]: { color: '#059669', bgColor: '#D1FAE5' },
  [BeerTag.SMOOTH]: { color: '#3B82F6', bgColor: '#DBEAFE' },
  [BeerTag.CRISP]: { color: '#06B6D4', bgColor: '#CFFAFE' },
  [BeerTag.REFRESHING]: { color: '#14B8A6', bgColor: '#CCFBF1' },
  [BeerTag.COMPLEX]: { color: '#8B5CF6', bgColor: '#EDE9FE' },
  [BeerTag.TRADITIONAL]: { color: '#92400E', bgColor: '#FED7AA' },
  [BeerTag.MODERN]: { color: '#D97706', bgColor: '#FFEDD5' },
  [BeerTag.SESSIONABLE]: { color: '#10B981', bgColor: '#D1FAE5' },
  [BeerTag.STRONG]: { color: '#DC2626', bgColor: '#FEE2E2' },
  [BeerTag.WHEAT]: { color: '#F59E0B', bgColor: '#FEF3C7' },
  [BeerTag.COFFEE]: { color: '#78350F', bgColor: '#FED7AA' },
  [BeerTag.CHOCOLATE]: { color: '#451A03', bgColor: '#FED7AA' },
  [BeerTag.CARAMEL]: { color: '#B45309', bgColor: '#FFEDD5' },
  [BeerTag.CITRUS]: { color: '#F59E0B', bgColor: '#FEF3C7' },
  [BeerTag.TROPICAL]: { color: '#EC4899', bgColor: '#FCE7F3' },
  [BeerTag.FLORAL]: { color: '#A855F7', bgColor: '#F3E8FF' },
  [BeerTag.EARTHY]: { color: '#78350F', bgColor: '#FED7AA' },
  [BeerTag.HERBAL]: { color: '#059669', bgColor: '#D1FAE5' },
  [BeerTag.SMOKY]: { color: '#374151', bgColor: '#E5E7EB' },
  [BeerTag.BALANCED]: { color: '#3B82F6', bgColor: '#DBEAFE' },
  [BeerTag.ROASTY]: { color: '#78350F', bgColor: '#FED7AA' },
}

export const GlasswareLabels: Record<GlasswareType, string> = {
  [GlasswareType.PINT]: 'Pint',
  [GlasswareType.PILSNER]: 'Pilsner',
  [GlasswareType.WEIZEN]: 'Weizen',
  [GlasswareType.TULIP]: 'Tulip',
  [GlasswareType.SNIFTER]: 'Snifter',
  [GlasswareType.STOUT_GLASS]: 'Copo Stout',
  [GlasswareType.GOBLET_CHALICE]: 'Taça/Cálice',
  [GlasswareType.STEIN]: 'Caneca',
  [GlasswareType.MUG]: 'Canecão',
}

export const GlasswareEmojis: Record<GlasswareType, string> = {
  [GlasswareType.PINT]: '🍺',
  [GlasswareType.PILSNER]: '🍺',
  [GlasswareType.WEIZEN]: '🍺',
  [GlasswareType.TULIP]: '🍷',
  [GlasswareType.SNIFTER]: '🥃',
  [GlasswareType.STOUT_GLASS]: '🍺',
  [GlasswareType.GOBLET_CHALICE]: '🍷',
  [GlasswareType.STEIN]: '🍺',
  [GlasswareType.MUG]: '🍺',
}

export const getAbvIntensity = (
  abv?: number,
): { label: string; color: string; bgColor: string } => {
  if (!abv) return { label: 'N/A', color: '#6B7280', bgColor: '#F3F4F6' }
  if (abv < 4) return { label: 'Leve', color: '#10B981', bgColor: '#D1FAE5' }
  if (abv < 6)
    return { label: 'Moderado', color: '#F59E0B', bgColor: '#FEF3C7' }
  if (abv < 8) return { label: 'Forte', color: '#F97316', bgColor: '#FFEDD5' }
  return { label: 'Muito Forte', color: '#EF4444', bgColor: '#FEE2E2' }
}

export const getIbuIntensity = (
  ibu?: number,
): { label: string; color: string; bgColor: string } => {
  if (!ibu) return { label: 'N/A', color: '#6B7280', bgColor: '#F3F4F6' }
  if (ibu < 20) return { label: 'Suave', color: '#F59E0B', bgColor: '#FEF3C7' }
  if (ibu < 40)
    return { label: 'Moderado', color: '#D97706', bgColor: '#FFEDD5' }
  if (ibu < 60)
    return { label: 'Lupulado', color: '#10B981', bgColor: '#D1FAE5' }
  return { label: 'Muito Lupulado', color: '#059669', bgColor: '#D1FAE5' }
}

export const ebcToRgb = (ebc?: number): string => {
  if (!ebc) return '#F59E0B'
  if (ebc < 8) return '#F9E076'
  if (ebc < 16) return '#F8D568'
  if (ebc < 24) return '#E8A629'
  if (ebc < 32) return '#D98C2B'
  if (ebc < 40) return '#C47223'
  if (ebc < 50) return '#A85C1F'
  if (ebc < 60) return '#8C461B'
  if (ebc < 80) return '#6D3517'
  return '#301F11'
}

export const formatRange = (
  min?: number | null,
  max?: number | null,
  unit: string = '',
): string => {
  if (min !== null && min !== undefined && max !== null && max !== undefined) {
    return `${min}-${max}${unit}`
  }
  if (min !== null && min !== undefined) return `${min}+${unit}`
  if (max !== null && max !== undefined) return `até ${max}${unit}`
  return 'N/A'
}

export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text
  return text.substring(0, maxLength) + '...'
}

export const countryFlags: Record<string, string> = {
  'Estados Unidos': '🇺🇸',
  Alemanha: '🇩🇪',
  Inglaterra: '🏴󠁧󠁢󠁥󠁮󠁧󠁿',
  Irlanda: '🇮🇪',
  Bélgica: '🇧🇪',
  'República Tcheca': '🇨🇿',
  França: '🇫🇷',
  Áustria: '🇦🇹',
  Brasil: '🇧🇷',
}

export enum BeerStyleSortBy {
  NAME = 'name',
  CREATED_AT = 'createdAt',
  CATEGORY = 'category',
}

export enum SortOrder {
  ASC = 'ASC',
  DESC = 'DESC',
}

export interface BeerStyleQueryParams {
  search?: string
  sortBy?: BeerStyleSortBy
  order?: SortOrder
  page?: number
  take?: number
}

export interface PaginatedBeerStyles {
  data: BeerStyle[]
  total: number
  page: number
  totalPages: number
}
