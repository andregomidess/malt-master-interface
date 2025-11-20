import { useMemo } from 'react'
import { useRecipe } from '../context/RecipeContext'
import { RecipeType } from '../interfaces/Recipe'

// Constantes conforme os padrões de cálculo
const DEFAULT_EFFICIENCY = 70 // Eficiência padrão de mostura (70%)
const DEFAULT_YIELD = 37 // PPG

/**
 * Calcula a eficiência efetiva seguindo a mesma lógica do backend
 *
 * Ordem de prioridade (igual ao backend):
 * 1. plannedEfficiency (se definido manualmente pelo usuário)
 * 2. estimatedEfficiency do mash profile (quando disponível - futuro)
 * 3. Eficiência padrão baseada no tipo de receita (apenas para Extract)
 * 4. DEFAULT_EFFICIENCY como fallback final
 *
 * Nota: A eficiência não é "calculada" - é um parâmetro de entrada que representa
 * a capacidade do sistema de extrair açúcares. O tipo de receita não determina
 * a eficiência, mas Extract não precisa de eficiência de mostura (100%).
 */
const getEffectiveEfficiency = (
  plannedEfficiency: number | null | undefined,
  recipeType: RecipeType | '',
  mashProfileEstimatedEfficiency?: number | null,
): number => {
  // 1. Prioridade: eficiência planejada definida manualmente
  if (plannedEfficiency && plannedEfficiency > 0) {
    return plannedEfficiency
  }

  // 2. Prioridade: eficiência estimada do perfil de mash
  // TODO: Quando o mash profile completo estiver disponível no frontend,
  // buscar estimatedEfficiency e usar aqui
  if (mashProfileEstimatedEfficiency && mashProfileEstimatedEfficiency > 0) {
    return mashProfileEstimatedEfficiency
  }

  // 3. Para Extract, não há perda de eficiência na mostura
  if (recipeType === RecipeType.EXTRACT) {
    return 100
  }

  // 4. Fallback: eficiência padrão (70%)
  // Nota: Para All Grain e Partial Mash, a eficiência real depende do
  // equipamento e processo, não do tipo. O usuário deve ajustar manualmente
  // ou usar o mash profile com estimatedEfficiency.
  return DEFAULT_EFFICIENCY
}
const PPG_TO_METRIC_CONVERSION = 8.345404 // Fator de conversão PPG -> PPL/L
const GRAVITY_POINTS_DIVISOR = 1000
const SPECIFIC_GRAVITY_BASE = 1.0
const ABV_CONVERSION_FACTOR = 131.25 // Fator para a fórmula ABV = (OG - FG) * 131.25
const TYPICAL_ATTENUATION_PERCENTAGE = 0.75
const POST_BOIL_HOP_UTILIZATION = 0.05
const IBU_METRIC_CONVERSION_FACTOR = 1000 // Para converter g/L para mg/L
const DEFAULT_ALPHA_ACIDS = 6.0
const DEFAULT_COLOR_LOVIBOND = 2
const KG_TO_LBS = 2.20462
const LITERS_TO_GALLONS = 0.264172
const MOREY_COEFFICIENT = 1.4922
const MOREY_EXPONENT = 0.6859
// Constantes da Fórmula de IBU Tinseth
const TINSETH_GRAVITY_COEFFICIENT = 1.65
const TINSETH_GRAVITY_BASE = 0.000125
const TINSETH_TIME_COEFFICIENT = 0.04
const TINSETH_TIME_DIVISOR = 4.15 // 4.15 é o denominador do Fator Tempo
const SRM_TO_EBC = 1.97

export const useRecipeCalculations = () => {
  const { recipe } = useRecipe()

  const calculations = useMemo(() => {
    // Calcula eficiência efetiva seguindo a mesma lógica do backend
    // Agora usa estimatedEfficiency do mash profile quando disponível
    const mashProfileEstimatedEfficiency =
      recipe.mash?.mashProfile?.estimatedEfficiency ?? null

    const efficiency = getEffectiveEfficiency(
      recipe.plannedEfficiency,
      recipe.type,
      mashProfileEstimatedEfficiency,
    )

    const finalVolume = recipe.finalVolume || 20 // Volume final em Litros

    let og: number | null = null
    if (recipe.fermentables.length > 0 && finalVolume > 0) {
      // ----------------------------------------------------
      // CÁLCULO DE OG (Original Gravity) - CORRIGIDO E SIMPLIFICADO
      // Fórmula Padrão: OG = 1 + (Total PPL/L * Eficiência) / (Volume Final * 1000)
      // ----------------------------------------------------

      // 1. Calcular o total de Pontos por Litro (PPL/L) extraíveis de todos os maltes
      const totalPointsPerLiterExtracted = recipe.fermentables.reduce(
        (total, f) => {
          const amount = f.amount || 0 // em kg
          const yieldPPG = f.fermentable?.yield || DEFAULT_YIELD
          // Converter Yield PPG para PPL/L (Yield PPG * Fator)
          const yieldPPL = yieldPPG * PPG_TO_METRIC_CONVERSION
          // Pontos totais extraíveis (PPL/L * kg)
          return total + amount * yieldPPL
        },
        0,
      )

      // 2. Aplicar eficiência e normalizar por Volume Final
      const ogPoints =
        (totalPointsPerLiterExtracted * (efficiency / 100)) / finalVolume

      // 3. Converter para Specific Gravity
      og = SPECIFIC_GRAVITY_BASE + ogPoints / GRAVITY_POINTS_DIVISOR
      og = Math.round(og * 1000) / 1000 // Arredonda para 3 casas decimais
    }

    // ----------------------------------------------------
    // CÁLCULO DE FG (Final Gravity) - CORRETO
    // Fórmula: FG = 1 + (OG - 1) * (1 - Atenuação)
    // ----------------------------------------------------
    let fg: number | null = null

    const getAttenuation = (): number | null => {
      if (recipe.yeasts.length === 0) {
        return null // Sem levedura, não calcula FG
      }

      const totalAttenuation = recipe.yeasts.reduce((sum, y) => {
        let yeastAttenuation = y.yeast?.attenuation
        if (yeastAttenuation === undefined || yeastAttenuation === null) {
          yeastAttenuation = TYPICAL_ATTENUATION_PERCENTAGE * 100
        }

        const attenuationNum =
          typeof yeastAttenuation === 'string'
            ? parseFloat(yeastAttenuation)
            : yeastAttenuation
        // Garantir que a atenuação esteja em decimal (ex: 0.75)
        const decimalAttenuation =
          attenuationNum > 1 ? attenuationNum / 100 : attenuationNum
        return sum + decimalAttenuation
      }, 0)

      return totalAttenuation / recipe.yeasts.length
    }

    const attenuation = getAttenuation()

    if (attenuation !== null) {
      const ogForCalc = og || 1.05 // Usar OG calculado ou padrão (1.050)
      const gravityPoints = ogForCalc - SPECIFIC_GRAVITY_BASE
      const remainingPoints = gravityPoints * (1 - attenuation)
      fg = SPECIFIC_GRAVITY_BASE + remainingPoints
      fg = Math.round(fg * 1000) / 1000
    }

    // ----------------------------------------------------
    // CÁLCULO DE ABV (Alcohol by Volume) - CORRETO
    // Fórmula: ABV = (OG - FG) * 131.25
    // ----------------------------------------------------
    let abv: number | null = null
    if (og && fg) {
      abv = (og - fg) * ABV_CONVERSION_FACTOR
      abv = Math.round(abv * 10) / 10 // Arredonda para 1 casa decimal
    }

    // ----------------------------------------------------
    // CÁLCULO DE IBU (Tinseth) - CORRIGIDO
    // ----------------------------------------------------
    let ibu: number | null = null
    if (recipe.hops.length > 0 && finalVolume > 0) {
      const ogForIbuCalc = og !== null ? og : 1.05

      const totalAlphaAcidMass = recipe.hops.reduce((total, hop) => {
        const hopAmount = hop.amount || 0 // em gramas
        const alphaAcidPercentage = hop.hop?.alphaAcids || DEFAULT_ALPHA_ACIDS
        const stage = hop.stage || 'boil'

        // Corrigindo a lógica de boilTime: 0 minutos deve ser respeitado!
        let boilTimeForCalc = 0
        if (stage === 'boil') {
          // Se o tempo não foi explicitamente definido (undefined/null), usa-se o tempo da receita.
          // Se foi definido como 0, ele permanece 0 (o que zera a utilização no Tinseth, correto).
          if (hop.boilTime !== undefined && hop.boilTime !== null) {
            boilTimeForCalc = hop.boilTime
          } else {
            boilTimeForCalc = recipe.boilTime || 60
          }
        }
        // Lúpulos pós-fervura (whirlpool, dry hop) terão utilização fixa (abaixo)

        let utilization: number
        if (stage !== 'boil') {
          // Utilização fixa para lúpulos pós-fervura (Dry Hop, Whirpool frio, etc.)
          utilization = POST_BOIL_HOP_UTILIZATION
        } else {
          // Fórmula de Tinseth para fervura
          const gravityPoints = ogForIbuCalc - SPECIFIC_GRAVITY_BASE
          // Fator Gravidade: 1.65 * 0.000125^(OG - 1)
          const gravityFactor =
            TINSETH_GRAVITY_COEFFICIENT *
            Math.pow(TINSETH_GRAVITY_BASE, gravityPoints)
          // Fator Tempo: (1 - e^(-0.04 * tempo)) / 4.15
          const exponentialDecay =
            1 - Math.exp(-TINSETH_TIME_COEFFICIENT * boilTimeForCalc)
          const timeFactor = exponentialDecay / TINSETH_TIME_DIVISOR
          // Utilização = Fator Gravidade * Fator Tempo
          utilization = gravityFactor * timeFactor
        }

        // Massa de alfa ácidos (em gramas)
        const alphaAcidMass = hopAmount * (alphaAcidPercentage / 100)
        // Contribuição de IBU (Gramas de AA Isomerizados)
        const ibuContribution = alphaAcidMass * utilization

        return total + ibuContribution
      }, 0)

      // IBU = (Massa total de AA isomerizados em g / Volume em L) * 1000 mg/g
      if (totalAlphaAcidMass > 0) {
        ibu =
          (totalAlphaAcidMass / Math.max(finalVolume, 1)) *
          IBU_METRIC_CONVERSION_FACTOR
        ibu = Math.round(ibu * 10) / 10
      }
    }

    // ----------------------------------------------------
    // CÁLCULO DE SRM (Morey) e EBC - CORRETO
    // ----------------------------------------------------
    let srm: number | null = null
    let ebc: number | null = null
    if (recipe.fermentables.length > 0 && finalVolume > 0) {
      const volumeGallons = finalVolume * LITERS_TO_GALLONS

      // MCU = (lbs * L) / galões
      const mcu = recipe.fermentables.reduce((total, f) => {
        const amountKg = f.amount || 0
        const colorLovibond = f.fermentable?.color || DEFAULT_COLOR_LOVIBOND
        const amountLbs = amountKg * KG_TO_LBS
        return total + (amountLbs * colorLovibond) / volumeGallons
      }, 0)

      // Fórmula de Morey: SRM = 1.4922 × (MCU^0.6859)
      srm = MOREY_COEFFICIENT * Math.pow(mcu, MOREY_EXPONENT)
      srm = Math.round(srm * 10) / 10

      // Conversão para EBC: EBC = SRM × 1.97
      ebc = srm * SRM_TO_EBC
      ebc = Math.round(ebc * 10) / 10
    }

    return {
      originalGravity: og,
      finalGravity: fg,
      estimatedAbv: abv,
      estimatedIbu: ibu,
      estimatedColor: srm,
      estimatedEbc: ebc,
      efficiency: efficiency,
    }
  }, [
    recipe.fermentables,
    recipe.hops,
    recipe.yeasts,
    recipe.finalVolume,
    recipe.plannedEfficiency,
    recipe.boilTime,
    recipe.type, // Incluir tipo de receita nas dependências
    recipe.mash?.mashProfile?.estimatedEfficiency, // Incluir eficiência do mash profile
  ])

  return calculations
}
