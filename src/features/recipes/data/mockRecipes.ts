export interface Recipe {
  id: string
  title: string
  style: string
  lastModified: string
  imageUrl?: string
}

export const generateMoreRecipes = (
  startId: number,
  count: number,
): Recipe[] => {
  const beerStyles = [
    'American IPA',
    'Imperial Stout',
    'Belgian Witbier',
    'German Pilsner',
    'English Pale Ale',
    'Irish Red Ale',
    'American Porter',
    'Weissbier',
    'Saison',
    'American Lager',
    'Double IPA',
    'Brown Ale',
    'Scotch Ale',
    'Blonde Ale',
    'Amber Ale',
  ]

  const beerNames = [
    'Lúpulo Tropical',
    'Escuridão Imperial',
    'Trigo Belga',
    'Pilsen Dourada',
    'Pale Inglesa',
    'Rubi Irlandesa',
    'Porter Americano',
    'Weizen Bávara',
    'Fazenda de Verão',
    'Lager Cristalina',
    'IPA Lupulada',
    'Marrom Suave',
    'Escocesa Forte',
    'Loira Refrescante',
    'Âmbar Clássica',
  ]

  const beerImages = [
    'https://images.unsplash.com/photo-1535958636474-b021ee887b13?w=100&h=100&fit=crop',
    'https://images.unsplash.com/photo-1608270586620-248524c67de9?w=100&h=100&fit=crop',
    'https://images.unsplash.com/photo-1532634922-8fe0b757fb13?w=100&h=100&fit=crop',
    'https://images.unsplash.com/photo-1612528443702-f6741f70a049?w=100&h=100&fit=crop',
    'https://images.unsplash.com/photo-1527281400328-e5c178b80f0f?w=100&h=100&fit=crop',
    'https://images.unsplash.com/photo-1618885472179-5e474019f2a9?w=100&h=100&fit=crop',
  ]

  const recipes: Recipe[] = []

  for (let i = 0; i < count; i++) {
    const id = startId + i
    const nameIndex = id % beerNames.length
    const styleIndex = id % beerStyles.length
    const imageIndex = id % beerImages.length
    const daysAgo = Math.floor(Math.random() * 365)
    const date = new Date()
    date.setDate(date.getDate() - daysAgo)

    recipes.push({
      id: id.toString(),
      title: `${beerNames[nameIndex]} ${id}`,
      style: beerStyles[styleIndex],
      lastModified: date.toISOString().split('T')[0],
      imageUrl: beerImages[imageIndex],
    })
  }

  return recipes
}
