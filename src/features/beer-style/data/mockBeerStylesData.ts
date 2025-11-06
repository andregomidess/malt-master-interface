import { BeerStyle, BeerTag, GlasswareType } from '../interfaces/BeerStyle'

export const mockBeerStyles: BeerStyle[] = [
  {
    id: '1',
    name: 'American IPA',
    category: 'Ale',
    subCategory: 'IPA',
    minAbv: 5.5,
    maxAbv: 7.5,
    minOg: 1.056,
    maxOg: 1.075,
    minFg: 1.010,
    maxFg: 1.018,
    minIbu: 40,
    maxIbu: 70,
    minColorEbc: 12,
    maxColorEbc: 28,
    description:
      'IPA americana com amargor proeminente e sabores lupulados intensos. Equilíbrio inclinado para o lúpulo com final seco.',
    aroma:
      'Aroma intenso de lúpulo com notas cítricas, florais, frutadas ou resinosas. Malte suave de apoio.',
    appearance:
      'Cor dourada a âmbar avermelhado, límpida. Espuma branca a off-white, persistente.',
    flavor:
      'Sabor de lúpulo médio a alto com características cítricas, florais, resinosas ou tropicais. Amargor pronunciado.',
    mouthfeel: 'Corpo médio-leve a médio. Carbonatação média a média-alta.',
    ingredients:
      'Malte base americano, lúpulos americanos (Cascade, Centennial, Columbus, Chinook, Simcoe, Amarillo, etc.)',
    examples: 'Sierra Nevada Torpedo, Stone IPA, Bell\'s Two Hearted Ale',
    tags: [
      BeerTag.HOPPY,
      BeerTag.BITTER,
      BeerTag.CITRUS,
      BeerTag.MODERN,
      BeerTag.CRISP,
    ],
    origin: 'Estados Unidos',
    glassware: GlasswareType.PINT,
    createdAt: '2024-01-01T00:00:00Z',
  },
  {
    id: '2',
    name: 'Czech Pilsner',
    category: 'Lager',
    subCategory: 'Pilsner',
    minAbv: 4.2,
    maxAbv: 5.8,
    minOg: 1.044,
    maxOg: 1.060,
    minFg: 1.013,
    maxFg: 1.017,
    minIbu: 30,
    maxIbu: 45,
    minColorEbc: 7,
    maxColorEbc: 14,
    description:
      'Pilsen original, com caráter complexo e rico de malte Pils, amargor firme mas limpo e final seco.',
    aroma:
      'Complexo aroma de malte Pils com leve caráter de pão. Lúpulo Saaz com notas picantes e florais.',
    appearance: 'Cor dourada clara a profunda, límpida e brilhante. Espuma densa e cremosa.',
    flavor:
      'Rico sabor de malte com caráter de pão e mel. Amargor de lúpulo médio a médio-alto.',
    mouthfeel: 'Corpo médio. Carbonatação média.',
    ingredients: 'Malte Pilsner tcheco, lúpulo Saaz, água mole.',
    examples: 'Pilsner Urquell, Budvar, Kozel',
    tags: [
      BeerTag.MALTY,
      BeerTag.CRISP,
      BeerTag.TRADITIONAL,
      BeerTag.REFRESHING,
      BeerTag.LIGHT,
    ],
    origin: 'República Tcheca',
    glassware: GlasswareType.PILSNER,
    createdAt: '2024-01-02T00:00:00Z',
  },
  {
    id: '3',
    name: 'Irish Stout',
    category: 'Ale',
    subCategory: 'Stout',
    minAbv: 3.8,
    maxAbv: 5.0,
    minOg: 1.036,
    maxOg: 1.044,
    minFg: 1.007,
    maxFg: 1.011,
    minIbu: 25,
    maxIbu: 45,
    minColorEbc: 50,
    maxColorEbc: 80,
    description:
      'Cerveja preta com sabor de malte torrado moderado e cremosidade marcante. Corpo leve apesar da aparência.',
    aroma:
      'Café e grãos torrados moderados. Pode ter leve acidez lática.',
    appearance:
      'Cor preta opaca com reflexos granada. Espuma densa, cremosa e persistente.',
    flavor:
      'Sabor de café e grãos torrados com leve amargor torrado. Final seco.',
    mouthfeel:
      'Corpo médio-leve, cremoso. Carbonatação baixa a moderada.',
    ingredients:
      'Malte Pale, cevada torrada, maltes torrados, lúpulos ingleses.',
    examples: 'Guinness Draught, Murphy\'s, Beamish',
    tags: [
      BeerTag.DARK,
      BeerTag.ROASTED,
      BeerTag.COFFEE,
      BeerTag.SMOOTH,
      BeerTag.SESSIONABLE,
    ],
    origin: 'Irlanda',
    glassware: GlasswareType.STOUT_GLASS,
    createdAt: '2024-01-03T00:00:00Z',
  },
  {
    id: '4',
    name: 'Belgian Tripel',
    category: 'Ale',
    subCategory: 'Belgian Strong Ale',
    minAbv: 7.5,
    maxAbv: 9.5,
    minOg: 1.075,
    maxOg: 1.085,
    minFg: 1.008,
    maxFg: 1.014,
    minIbu: 20,
    maxIbu: 40,
    minColorEbc: 9,
    maxColorEbc: 14,
    description:
      'Cerveja belga forte e pálida com complexidade de especiarias e ésteres. Altamente carbonatada e seca.',
    aroma:
      'Complexo com notas de especiarias (pimenta, cravo), frutado (banana, pera) e álcool.',
    appearance:
      'Cor dourada profunda a âmbar claro. Espuma branca, densa e duradoura.',
    flavor:
      'Malte suave com doçura de açúcar. Especiarias fenólicas e ésteres frutados. Final muito seco.',
    mouthfeel:
      'Corpo médio a médio-leve. Carbonatação alta. Aquecimento alcoólico.',
    ingredients:
      'Malte Pilsner belga, açúcar candi, levedura belga, lúpulos nobres.',
    examples: 'Westmalle Tripel, La Fin du Monde, Tripel Karmeliet',
    tags: [
      BeerTag.STRONG,
      BeerTag.SPICY,
      BeerTag.FRUITY,
      BeerTag.COMPLEX,
      BeerTag.TRADITIONAL,
    ],
    origin: 'Bélgica',
    glassware: GlasswareType.GOBLET_CHALICE,
    createdAt: '2024-01-04T00:00:00Z',
  },
  {
    id: '5',
    name: 'American Pale Ale',
    category: 'Ale',
    subCategory: 'Pale Ale',
    minAbv: 4.5,
    maxAbv: 6.2,
    minOg: 1.045,
    maxOg: 1.060,
    minFg: 1.010,
    maxFg: 1.015,
    minIbu: 30,
    maxIbu: 50,
    minColorEbc: 10,
    maxColorEbc: 22,
    description:
      'Pale ale americana com lúpulo proeminente mas equilibrada. Mais suave que uma IPA.',
    aroma:
      'Lúpulo americano moderado com notas cítricas e florais. Malte limpo.',
    appearance: 'Cor dourada a âmbar claro, límpida. Espuma branca, persistente.',
    flavor:
      'Sabor de lúpulo moderado a médio-alto, cítrico e floral. Amargor moderado.',
    mouthfeel: 'Corpo médio-leve a médio. Carbonatação moderada a alta.',
    ingredients:
      'Malte Pale americano, maltes caramelo, lúpulos americanos.',
    examples: 'Sierra Nevada Pale Ale, Dale\'s Pale Ale, Half Acre Daisy Cutter',
    tags: [
      BeerTag.HOPPY,
      BeerTag.CITRUS,
      BeerTag.REFRESHING,
      BeerTag.MODERN,
      BeerTag.SESSIONABLE,
    ],
    origin: 'Estados Unidos',
    glassware: GlasswareType.PINT,
    createdAt: '2024-01-05T00:00:00Z',
  },
  {
    id: '6',
    name: 'Imperial Stout',
    category: 'Ale',
    subCategory: 'Stout',
    minAbv: 8.0,
    maxAbv: 12.0,
    minOg: 1.075,
    maxOg: 1.115,
    minFg: 1.018,
    maxFg: 1.030,
    minIbu: 50,
    maxIbu: 90,
    minColorEbc: 60,
    maxColorEbc: 80,
    description:
      'Stout intensamente rica e complexa com sabores profundos de malte torrado, chocolate e café.',
    aroma:
      'Complexo com malte torrado, chocolate escuro, café, frutas escuras e álcool.',
    appearance: 'Cor preta profunda e opaca. Espuma marrom, cremosa.',
    flavor:
      'Muito rico com malte torrado intenso, chocolate, café, frutas escuras e leve amargor.',
    mouthfeel:
      'Corpo cheio a muito cheio. Carbonatação baixa a moderada. Aquecimento alcoólico.',
    ingredients:
      'Malte Pale, maltes torrados escuros, cevada torrada, lúpulos ingleses.',
    examples:
      'Russian River Pliny the Elder, Founders KBS, North Coast Old Rasputin',
    tags: [
      BeerTag.DARK,
      BeerTag.STRONG,
      BeerTag.ROASTED,
      BeerTag.CHOCOLATE,
      BeerTag.COFFEE,
      BeerTag.COMPLEX,
    ],
    origin: 'Inglaterra',
    glassware: GlasswareType.SNIFTER,
    createdAt: '2024-01-06T00:00:00Z',
  },
  {
    id: '7',
    name: 'Saison',
    category: 'Ale',
    subCategory: 'Belgian Pale Ale',
    minAbv: 5.0,
    maxAbv: 7.0,
    minOg: 1.048,
    maxOg: 1.065,
    minFg: 1.002,
    maxFg: 1.012,
    minIbu: 20,
    maxIbu: 35,
    minColorEbc: 10,
    maxColorEbc: 28,
    description:
      'Cerveja de fazenda belga altamente atenuada, refrescante e com caráter de especiarias.',
    aroma:
      'Frutado (limão, laranja, pera) e especiado (pimenta). Pode ter caráter herbal.',
    appearance:
      'Cor dourada a âmbar. Espuma branca, densa e persistente.',
    flavor:
      'Sabor frutado e especiado com amargor médio. Final muito seco.',
    mouthfeel:
      'Corpo leve a médio. Carbonatação alta. Final muito seco.',
    ingredients:
      'Malte Pilsner, malte de trigo, levedura saison, lúpulos continentais.',
    examples: 'Saison Dupont, Boulevard Tank 7, Goose Island Sofie',
    tags: [
      BeerTag.FRUITY,
      BeerTag.SPICY,
      BeerTag.CRISP,
      BeerTag.REFRESHING,
      BeerTag.TRADITIONAL,
    ],
    origin: 'Bélgica',
    glassware: GlasswareType.TULIP,
    createdAt: '2024-01-07T00:00:00Z',
  },
  {
    id: '8',
    name: 'Munich Helles',
    category: 'Lager',
    subCategory: 'Pale Lager',
    minAbv: 4.7,
    maxAbv: 5.4,
    minOg: 1.044,
    maxOg: 1.048,
    minFg: 1.006,
    maxFg: 1.012,
    minIbu: 16,
    maxIbu: 22,
    minColorEbc: 7,
    maxColorEbc: 12,
    description:
      'Lager alemã suave e maltada com caráter limpo e equilibrado.',
    aroma: 'Malte suave, adocicado com leves notas de pão. Lúpulo sutil.',
    appearance:
      'Cor amarelo médio a dourado claro, límpida. Espuma branca, cremosa.',
    flavor:
      'Malte adocicado moderado com final suave. Amargor baixo.',
    mouthfeel: 'Corpo médio. Carbonatação média. Final macio.',
    ingredients: 'Malte Pilsner alemão, lúpulos nobres alemães.',
    examples: 'Augustiner Helles, Paulaner Original, Weihenstephaner Original',
    tags: [
      BeerTag.MALTY,
      BeerTag.SMOOTH,
      BeerTag.LIGHT,
      BeerTag.REFRESHING,
      BeerTag.TRADITIONAL,
    ],
    origin: 'Alemanha',
    glassware: GlasswareType.MUG,
    createdAt: '2024-01-08T00:00:00Z',
  },
  {
    id: '9',
    name: 'Berliner Weisse',
    category: 'Ale',
    subCategory: 'Sour Ale',
    minAbv: 2.8,
    maxAbv: 3.8,
    minOg: 1.028,
    maxOg: 1.032,
    minFg: 1.003,
    maxFg: 1.006,
    minIbu: 3,
    maxIbu: 8,
    minColorEbc: 4,
    maxColorEbc: 6,
    description:
      'Cerveja de trigo alemã muito leve, azeda e refrescante com alta carbonatação.',
    aroma: 'Acidez lática acentuada com leve caráter de trigo.',
    appearance:
      'Cor amarelo muito claro a dourado claro, turva. Espuma branca, cremosa mas efêmera.',
    flavor: 'Acidez lática limpa e refrescante. Final muito seco.',
    mouthfeel:
      'Corpo muito leve. Carbonatação muito alta. Refrescante.',
    ingredients: 'Malte Pilsner, malte de trigo, lacto, levedura.',
    examples: 'Berliner Kindl Weisse, 1809 Berliner Style Weisse',
    tags: [
      BeerTag.SOUR,
      BeerTag.LIGHT,
      BeerTag.REFRESHING,
      BeerTag.WHEAT,
      BeerTag.SESSIONABLE,
    ],
    origin: 'Alemanha',
    glassware: GlasswareType.WEIZEN,
    createdAt: '2024-01-09T00:00:00Z',
  },
  {
    id: '10',
    name: 'English Bitter',
    category: 'Ale',
    subCategory: 'Pale Ale',
    minAbv: 3.2,
    maxAbv: 3.8,
    minOg: 1.032,
    maxOg: 1.040,
    minFg: 1.007,
    maxFg: 1.011,
    minIbu: 25,
    maxIbu: 35,
    minColorEbc: 16,
    maxColorEbc: 28,
    description:
      'Pale ale inglesa de baixo teor alcoólico com equilíbrio entre malte e lúpulo.',
    aroma:
      'Malte com notas de pão e caramelo. Lúpulo inglês floral e terroso.',
    appearance:
      'Cor dourada a cobre claro. Espuma off-white, baixa a moderada.',
    flavor:
      'Malte com sabor de pão e caramelo. Amargor moderado. Final seco.',
    mouthfeel: 'Corpo leve a médio-leve. Carbonatação baixa.',
    ingredients:
      'Malte Pale inglês, maltes caramelo, lúpulos ingleses.',
    examples: 'Fuller\'s Chiswick Bitter, Young\'s Bitter',
    tags: [
      BeerTag.MALTY,
      BeerTag.BITTER,
      BeerTag.CARAMEL,
      BeerTag.TRADITIONAL,
      BeerTag.SESSIONABLE,
    ],
    origin: 'Inglaterra',
    glassware: GlasswareType.PINT,
    createdAt: '2024-01-10T00:00:00Z',
  },
  {
    id: '11',
    name: 'Belgian Dubbel',
    category: 'Ale',
    subCategory: 'Belgian Dark Ale',
    minAbv: 6.0,
    maxAbv: 7.6,
    minOg: 1.062,
    maxOg: 1.075,
    minFg: 1.008,
    maxFg: 1.018,
    minIbu: 15,
    maxIbu: 25,
    minColorEbc: 20,
    maxColorEbc: 40,
    description:
      'Cerveja trapista marrom com sabores complexos de malte, frutas escuras e especiarias.',
    aroma:
      'Malte rico com chocolate e caramelo. Frutas escuras (ameixa, uva passa) e especiarias.',
    appearance:
      'Cor âmbar profundo a cobre escuro. Espuma densa, cremosa e duradoura.',
    flavor:
      'Malte rico e doce com chocolate, caramelo e frutas escuras. Especiarias fenólicas.',
    mouthfeel: 'Corpo médio a médio-cheio. Carbonatação média a alta.',
    ingredients:
      'Maltes Munich e caramelo, açúcar candi escuro, levedura belga.',
    examples: 'Westmalle Dubbel, Chimay Red, La Trappe Dubbel',
    tags: [
      BeerTag.DARK,
      BeerTag.MALTY,
      BeerTag.FRUITY,
      BeerTag.SPICY,
      BeerTag.COMPLEX,
      BeerTag.TRADITIONAL,
    ],
    origin: 'Bélgica',
    glassware: GlasswareType.GOBLET_CHALICE,
    createdAt: '2024-01-11T00:00:00Z',
  },
  {
    id: '12',
    name: 'Vienna Lager',
    category: 'Lager',
    subCategory: 'Amber Lager',
    minAbv: 4.7,
    maxAbv: 5.5,
    minOg: 1.048,
    maxOg: 1.055,
    minFg: 1.010,
    maxFg: 1.014,
    minIbu: 18,
    maxIbu: 30,
    minColorEbc: 20,
    maxColorEbc: 32,
    description:
      'Lager âmbar austríaca com caráter maltado rico mas elegante e final seco.',
    aroma: 'Malte com notas de pão torrado e caramelo suave.',
    appearance:
      'Cor âmbar-avermelhado profundo, límpida. Espuma off-white, persistente.',
    flavor:
      'Malte moderado com notas de pão torrado e caramelo. Amargor baixo a moderado.',
    mouthfeel: 'Corpo médio-leve a médio. Carbonatação moderada.',
    ingredients: 'Malte Vienna, lúpulos nobres.',
    examples:
      'Negra Modelo, Brooklyn Lager, Devil\'s Backbone Vienna Lager',
    tags: [
      BeerTag.MALTY,
      BeerTag.CARAMEL,
      BeerTag.SMOOTH,
      BeerTag.TRADITIONAL,
      BeerTag.CRISP,
    ],
    origin: 'Áustria',
    glassware: GlasswareType.PINT,
    createdAt: '2024-01-12T00:00:00Z',
  },
  {
    id: '13',
    name: 'Schwarzbier',
    category: 'Lager',
    subCategory: 'Dark Lager',
    minAbv: 4.4,
    maxAbv: 5.4,
    minOg: 1.046,
    maxOg: 1.052,
    minFg: 1.010,
    maxFg: 1.016,
    minIbu: 20,
    maxIbu: 35,
    minColorEbc: 35,
    maxColorEbc: 60,
    description:
      'Lager alemã escura com sabor suave de malte torrado e final limpo.',
    aroma:
      'Malte torrado suave com notas de chocolate e café. Sem adstringência.',
    appearance:
      'Cor marrom escuro a preta opaca. Espuma bronzeada, persistente.',
    flavor:
      'Malte torrado leve com chocolate. Amargor médio-baixo. Final seco.',
    mouthfeel: 'Corpo médio-leve a médio. Carbonatação moderada a alta.',
    ingredients: 'Malte Pilsner, maltes Munich e torrados, lúpulos nobres.',
    examples: 'Köstritzer Schwarzbier, Einbecker Schwarzbier',
    tags: [
      BeerTag.DARK,
      BeerTag.ROASTED,
      BeerTag.SMOOTH,
      BeerTag.TRADITIONAL,
      BeerTag.CRISP,
    ],
    origin: 'Alemanha',
    glassware: GlasswareType.PINT,
    createdAt: '2024-01-13T00:00:00Z',
  },
  {
    id: '14',
    name: 'New England IPA',
    category: 'Ale',
    subCategory: 'IPA',
    minAbv: 6.0,
    maxAbv: 7.5,
    minOg: 1.060,
    maxOg: 1.085,
    minFg: 1.010,
    maxFg: 1.015,
    minIbu: 25,
    maxIbu: 60,
    minColorEbc: 10,
    maxColorEbc: 28,
    description:
      'IPA turva e frutada com amargor suave e sabor intenso de lúpulo. Textura cremosa.',
    aroma:
      'Lúpulo intenso com frutas tropicais (manga, abacaxi, maracujá) e cítricos.',
    appearance:
      'Cor dourada a âmbar, turva/nebulosa. Espuma branca, persistente.',
    flavor:
      'Sabor de lúpulo muito intenso, frutado e suculento. Amargor baixo a moderado.',
    mouthfeel:
      'Corpo médio a médio-cheio. Textura macia e cremosa. Final suave.',
    ingredients:
      'Malte base, aveia ou trigo, lúpulos aromáticos (dry hop intenso), levedura inglesa.',
    examples: 'The Alchemist Heady Topper, Tree House Julius, Trillium Fort Point',
    tags: [
      BeerTag.HOPPY,
      BeerTag.FRUITY,
      BeerTag.TROPICAL,
      BeerTag.MODERN,
      BeerTag.SMOOTH,
    ],
    origin: 'Estados Unidos',
    glassware: GlasswareType.PINT,
    createdAt: '2024-01-14T00:00:00Z',
  },
  {
    id: '15',
    name: 'Gose',
    category: 'Ale',
    subCategory: 'Sour Ale',
    minAbv: 4.2,
    maxAbv: 4.8,
    minOg: 1.036,
    maxOg: 1.056,
    minFg: 1.006,
    maxFg: 1.010,
    minIbu: 5,
    maxIbu: 12,
    minColorEbc: 6,
    maxColorEbc: 8,
    description:
      'Cerveja de trigo alemã levemente azeda, salgada e temperada com coentro.',
    aroma:
      'Acidez lática leve com coentro e leve salinidade. Pode ter leve caráter de trigo.',
    appearance:
      'Cor amarelo claro a dourado claro, pode ser turva. Espuma branca, massiva mas efêmera.',
    flavor:
      'Acidez lática notável com salinidade e coentro. Final seco e refrescante.',
    mouthfeel:
      'Corpo leve. Carbonatação alta a muito alta. Efervescente.',
    ingredients:
      'Malte Pilsner, malte de trigo, sal, coentro, lacto.',
    examples: 'Westbrook Gose, Anderson Valley Blood Orange Gose',
    tags: [
      BeerTag.SOUR,
      BeerTag.LIGHT,
      BeerTag.REFRESHING,
      BeerTag.WHEAT,
      BeerTag.HERBAL,
      BeerTag.TRADITIONAL,
    ],
    origin: 'Alemanha',
    glassware: GlasswareType.WEIZEN,
    createdAt: '2024-01-15T00:00:00Z',
  },
]

// Funções auxiliares para filtrar e ordenar
export type BeerStyleCategory = 'Ale' | 'Lager' | 'Híbrido' | 'Selvagem' | 'all'
export type BeerStyleSortBy = 'name' | 'abv' | 'ibu' | 'color' | 'category'

export const filterByCategory = (
  styles: BeerStyle[],
  category: BeerStyleCategory,
): BeerStyle[] => {
  if (category === 'all') return styles
  if (category === 'Selvagem') {
    return styles.filter(s => s.subCategory?.includes('Sour'))
  }
  return styles.filter(s => s.category === category)
}

export const searchStyles = (
  styles: BeerStyle[],
  query: string,
): BeerStyle[] => {
  const lowerQuery = query.toLowerCase()
  return styles.filter(
    s =>
      s.name.toLowerCase().includes(lowerQuery) ||
      s.category?.toLowerCase().includes(lowerQuery) ||
      s.subCategory?.toLowerCase().includes(lowerQuery) ||
      s.tags.some(tag => tag.toLowerCase().includes(lowerQuery)),
  )
}

export const sortStyles = (
  styles: BeerStyle[],
  sortBy: BeerStyleSortBy,
): BeerStyle[] => {
  return [...styles].sort((a, b) => {
    switch (sortBy) {
      case 'name':
        return a.name.localeCompare(b.name)
      case 'abv':
        return (b.maxAbv || 0) - (a.maxAbv || 0)
      case 'ibu':
        return (b.maxIbu || 0) - (a.maxIbu || 0)
      case 'color':
        return (b.maxColorEbc || 0) - (a.maxColorEbc || 0)
      case 'category':
        return (a.category || '').localeCompare(b.category || '')
      default:
        return 0
    }
  })
}

export const calculateBeerStyleStats = (styles: BeerStyle[]) => {
  const total = styles.length
  const ales = styles.filter(s => s.category === 'Ale').length
  const lagers = styles.filter(s => s.category === 'Lager').length
  const sours = styles.filter(s => s.subCategory?.includes('Sour')).length
  const publicStyles = styles.filter(s => !s.user).length
  const customStyles = styles.filter(s => s.user).length

  return {
    total,
    ales,
    lagers,
    sours,
    publicStyles,
    customStyles,
  }
}

