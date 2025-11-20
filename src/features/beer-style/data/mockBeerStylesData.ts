import { BeerStyle } from '../interfaces/BeerStyle'

export type BeerStyleCategory = 'Ale' | 'Lager' | 'Híbrido' | 'Selvagem' | 'all'

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
