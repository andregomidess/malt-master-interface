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
// Utilização de lúpulos pós-fervura (baseado em BeerSmith/Brewfather)
const WHIRLPOOL_HOT_UTILIZATION = 0.15 // Whirlpool quente: 10-20% (média 15%)
const WHIRLPOOL_COLD_UTILIZATION = 0.05 // Whirlpool frio: ~5%
const DRY_HOP_UTILIZATION = 0.0 // Dry hop: 0 IBU (apenas aroma)
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
      // CÁLCULO DE OG (Original Gravity) - MODO SIMPLIFICADO
      // Fórmula Padrão: OG = 1 + (Total PPL/L * Eficiência) / (Volume Final * 1000)
      //
      // ⚠️ LIMITAÇÃO: Este cálculo assume que todo o mosto extraído chega ao fermentador.
      // Softwares profissionais (BeerSmith/Brewfather) consideram:
      // - Eficiência de mostura (extração de açúcares)
      // - Eficiência de lauter (separação do mosto)
      // - Eficiência de fervura (evaporação e concentração)
      // - Perdas no processo (trub, chiller, transferência)
      // - Trabalham com: preBoilVolume → postBoilVolume → fermenterVolume
      //
      // 🔧 MELHORIA FUTURA: Implementar cálculo em etapas:
      // 1. OG pré-fervura (baseado em preBoilVolume)
      // 2. Concentração na fervura (evaporação)
      // 3. OG pós-fervura (baseado em postBoilVolume)
      // 4. Perdas (trub, chiller, fermentador)
      // 5. OG no fermentador (baseado em fermenterVolume)
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
      // Nota: A eficiência aqui representa a eficiência total do sistema
      // (mostura + lauter + fervura - perdas), simplificada em um único valor
      const ogPoints =
        (totalPointsPerLiterExtracted * (efficiency / 100)) / finalVolume

      // 3. Converter para Specific Gravity
      og = SPECIFIC_GRAVITY_BASE + ogPoints / GRAVITY_POINTS_DIVISOR
      og = Math.round(og * 1000) / 1000 // Arredonda para 3 casas decimais
    }

    // ----------------------------------------------------
    // CÁLCULO DE FG (Final Gravity) - CORRETO
    // Fórmula: FG = 1 + (OG - 1) * (1 - Atenuação)
    //
    // ✔️ Este cálculo está correto e alinhado com BeerSmith/Brewfather (modo simples).
    //
    // 🔧 MELHORIAS FUTURAS (softwares profissionais consideram):
    // 1. Atenuação aparente vs real
    //    - Aparente: o que o densímetro mede (afetado pelo álcool)
    //    - Real: atenuação verdadeira dos açúcares
    // 2. Açúcares não fermentáveis
    //    - Caramelo, lactose, maltodextrina aumentam o FG
    // 3. Perfil de mostura (temperatura afeta fermentabilidade)
    //    - Mash a 63°C → mais fermentável → FG menor
    //    - Mash a 69°C → menos fermentável → FG maior
    //    - Fórmula: effectiveAttenuation = yeastAttenuation * mashFermentabilityFactor
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
    //
    // ✔️ Esta é exatamente a fórmula padrão do BeerSmith (modo simples).
    // Brewfather permite trocar para fórmulas mais precisas (Cutaia, Daniels),
    // mas isso é opcional avançado. Este cálculo está perfeito para uso geral.
    // ----------------------------------------------------
    let abv: number | null = null
    if (og && fg) {
      abv = (og - fg) * ABV_CONVERSION_FACTOR
      abv = Math.round(abv * 10) / 10 // Arredonda para 1 casa decimal
    }

    // ----------------------------------------------------
    // CÁLCULO DE IBU (Tinseth) - MELHORADO
    //
    // ✔️ Implementação correta da fórmula de Tinseth:
    // - Gravidade corrigindo utilização
    // - Tempo respeitando 0 min
    // - Separação boil vs post-boil
    // - Conversão correta para mg/L
    //
    // ⚠️ LIMITAÇÃO: Usa OG final, mas softwares profissionais usam gravidade pré-fervura
    // para cálculos de IBU durante a fervura (mais preciso).
    //
    // 🔧 MELHORIAS IMPLEMENTADAS:
    // - Whirlpool quente: 15% utilização (10-20% em softwares profissionais)
    // - Whirlpool frio: 5% utilização
    // - Dry hop: 0 IBU (apenas aroma, sem amargor)
    // ----------------------------------------------------
    let ibu: number | null = null
    if (recipe.hops.length > 0 && finalVolume > 0) {
      // Nota: Idealmente deveria usar gravidade pré-fervura, mas como não temos esse dado,
      // usamos a OG final. Softwares profissionais calculam IBU baseado na gravidade no
      // momento da adição do lúpulo (pré-fervura para lúpulos de fervura).
      const ogForIbuCalc = og !== null ? og : 1.05

      // Acumula as contribuições de IBU de todos os lúpulos
      // (não é massa de alfa ácidos, mas sim gramas de AA isomerizados)
      const totalIbuContribution = recipe.hops.reduce((total, hop) => {
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

        let utilization: number
        if (stage === 'dry_hop') {
          // Dry hop: 0 IBU (apenas aroma, sem isomerização de alfa ácidos)
          utilization = DRY_HOP_UTILIZATION
        } else if (stage === 'whirlpool') {
          // Whirlpool: assumimos quente por padrão (15% utilização)
          // Nota: Em softwares profissionais, whirlpool quente tem curva própria baseada
          // em temperatura e tempo, não valor fixo. Aqui simplificamos para 15%.
          utilization = WHIRLPOOL_HOT_UTILIZATION
        } else if (stage === 'boil') {
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
        } else {
          // Outros estágios pós-fervura (fallback para whirlpool frio)
          utilization = WHIRLPOOL_COLD_UTILIZATION
        }

        // Massa de alfa ácidos (em gramas)
        const alphaAcidMass = hopAmount * (alphaAcidPercentage / 100)
        // Contribuição de IBU (Gramas de AA Isomerizados)
        const ibuContribution = alphaAcidMass * utilization

        return total + ibuContribution
      }, 0)

      // IBU = (Total de gramas de AA isomerizados / Volume em L) * 1000 mg/g
      if (totalIbuContribution > 0) {
        ibu =
          (totalIbuContribution / Math.max(finalVolume, 1)) *
          IBU_METRIC_CONVERSION_FACTOR
        ibu = Math.round(ibu * 10) / 10
      }
    }

    // ----------------------------------------------------
    // CÁLCULO DE SRM (Morey) e EBC - 100% CORRETO
    //
    // ✔️ MCU correto
    // ✔️ Fórmula de Morey correta
    // ✔️ Conversão SRM → EBC correta
    // 👉 Exatamente o que BeerSmith e Brewfather fazem.
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
