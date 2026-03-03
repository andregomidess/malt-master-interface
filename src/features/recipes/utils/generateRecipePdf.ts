import jsPDF from 'jspdf'
import {
  RecipeFormState,
  RecipeFermentable,
  RecipeHop,
  RecipeYeast,
} from '../context/RecipeContext'
import { RecipeType, recipeTypeLabels } from '../interfaces/Recipe'
import logoImage from '../../../assets/logo2.png'

interface RecipeCalculations {
  originalGravity: number | null
  finalGravity: number | null
  estimatedAbv: number | null
  estimatedIbu: number | null
  estimatedColor: number | null
  estimatedEbc: number | null
  efficiency: number
  strikeWaterVolume?: number | null
  spargeWaterVolume?: number | null
  totalWaterVolume?: number | null
}

interface RecipePdfData {
  recipe: RecipeFormState
  calculations: RecipeCalculations
  batchCode?: string
  brewDate?: string | null
}

async function getImageAsBase64(
  imgPath: string,
): Promise<{ data: string; width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.onload = () => {
      const canvas = document.createElement('canvas')
      canvas.width = img.width
      canvas.height = img.height
      const ctx = canvas.getContext('2d')
      if (ctx) {
        ctx.drawImage(img, 0, 0)
        try {
          const dataURL = canvas.toDataURL('image/png')
          resolve({ data: dataURL, width: img.width, height: img.height })
        } catch (e) {
          reject(e)
        }
      } else {
        reject(new Error('Could not get canvas context'))
      }
    }
    img.onerror = reject
    img.src = imgPath
  })
}

// Constantes de espaçamento para layout organizado
const SPACING = {
  margin: 16,
  sectionGap: 10, // Entre seções principais
  afterHeader: 4, // Após título da seção
  betweenItems: 4, // Entre itens na mesma seção
  subsectionGap: 6, // Entre subseções
  lineHeight: 0.42, // Altura da linha (múltiplo do fontSize)
}

export async function generateRecipePdf(data: RecipePdfData) {
  const { recipe, calculations, batchCode, brewDate } = data
  const doc = new jsPDF()
  const pageWidth = doc.internal.pageSize.getWidth()
  const pageHeight = doc.internal.pageSize.getHeight()
  const margin = SPACING.margin
  const leftColWidth = 95
  const rightColWidth = 95
  const rightColStart = pageWidth - margin - rightColWidth
  let yPos = margin

  const colors = {
    primary: [0, 102, 51],
    secondary: [255, 193, 7],
    text: [51, 51, 51],
    textLight: [128, 128, 128],
    border: [200, 200, 200],
  }
  const addText = (
    text: string,
    x: number,
    y: number,
    fontSize: number = 10,
    isBold: boolean = false,
    color: number[] = colors.text,
    maxWidth?: number,
  ) => {
    doc.setFontSize(fontSize)
    doc.setFont('helvetica', isBold ? 'bold' : 'normal')
    doc.setTextColor(color[0], color[1], color[2])
    const width = maxWidth || pageWidth - 2 * margin
    const lines = doc.splitTextToSize(text, width)
    doc.text(lines, x, y)
    return y + lines.length * (fontSize * SPACING.lineHeight)
  }

  const addSpace = (y: number, space?: number) => {
    return y + (space ?? SPACING.betweenItems)
  }

  const addSectionHeader = (
    title: string,
    x: number,
    y: number,
    maxWidth: number,
  ) => {
    let newY = addText(title, x, y, 12, true, colors.primary, maxWidth)
    doc.setDrawColor(colors.border[0], colors.border[1], colors.border[2])
    doc.setLineWidth(0.3)
    doc.line(x, newY + 2, x + maxWidth, newY + 2)
    newY += SPACING.afterHeader + 2
    return newY
  }

  const addColorSwatch = (
    x: number,
    y: number,
    ebc: number | null,
    showLabel: boolean = true,
  ) => {
    if (!ebc) return
    const size = 18
    const r = Math.min(255, 200 + ebc * 2)
    const g = Math.min(255, 150 + ebc * 1.5)
    const b = Math.max(0, 100 - ebc * 3)
    doc.setFillColor(r, g, b)
    doc.rect(x, y, size, size, 'F')
    doc.setDrawColor(colors.border[0], colors.border[1], colors.border[2])
    doc.rect(x, y, size, size, 'S')
    if (showLabel) {
      addText(`${ebc} EBC`, x, y + size + 4, 8, false, colors.textLight, size)
    }
    return y + size + 8
  }

  let headerRightBottom = margin + 12
  try {
    const logoData = await getImageAsBase64(logoImage)
    const maxWidth = 40
    const maxHeight = 15
    const aspectRatio = logoData.width / logoData.height
    let logoWidth = maxWidth
    let logoHeight = maxWidth / aspectRatio

    if (logoHeight > maxHeight) {
      logoHeight = maxHeight
      logoWidth = maxHeight * aspectRatio
    }

    doc.addImage(
      logoData.data,
      'PNG',
      rightColStart,
      margin,
      logoWidth,
      logoHeight,
    )
    addText(
      'www.maltmaster.app',
      rightColStart,
      margin + logoHeight + 2,
      7,
      false,
      colors.textLight,
      rightColWidth,
    )
    headerRightBottom = margin + logoHeight + 10
  } catch (error) {
    console.warn('Erro ao carregar logo:', error)
    addText(
      'Malt Master',
      rightColStart,
      margin,
      12,
      true,
      colors.primary,
      rightColWidth,
    )
    headerRightBottom = margin + 18
  }

  if (calculations.estimatedEbc) {
    addColorSwatch(
      pageWidth - margin - 90,
      headerRightBottom,
      calculations.estimatedEbc,
      true,
    )
  }

  if (batchCode) {
    yPos = addText(`Lote ${batchCode}`, margin, yPos, 16, true, colors.primary)
  }
  if (brewDate) {
    const date = new Date(brewDate)
    const formattedDate = date.toLocaleDateString('pt-BR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    })
    yPos = addText(
      `- ${formattedDate}`,
      margin,
      yPos,
      12,
      false,
      colors.textLight,
    )
  }
  yPos += SPACING.sectionGap

  const recipeName = recipe.name || 'Receita sem nome'
  yPos = addText(recipeName, margin, yPos, 20, true, colors.primary)
  yPos += SPACING.afterHeader

  const ebcText = `${calculations.estimatedEbc || '—'} EBC`
  const abvText = `${calculations.estimatedAbv || '—'}%`
  const styleText = recipe.beerStyle?.name || 'Estilo não definido'

  yPos = addText(ebcText, margin, yPos, 12, false, colors.text)
  yPos = addText(
    `${recipeName} - ${abvText}`,
    margin,
    yPos,
    12,
    false,
    colors.primary,
  )
  yPos = addText(styleText, margin, yPos, 11, false, colors.text)

  yPos = addText(
    `Tipo: ${recipeTypeLabels[recipe.type as RecipeType] || recipe.type}`,
    margin,
    yPos,
    9,
    false,
    colors.textLight,
  )
  yPos += SPACING.sectionGap

  let leftY = yPos
  let rightY = yPos

  leftY = addSectionHeader('Estatísticas', margin, leftY, leftColWidth)

  const stats = [
    {
      label: 'IBU',
      value: calculations.estimatedIbu?.toFixed(1) || '—',
      suffix: calculations.estimatedIbu ? ' (Tinseth)' : '',
    },
    {
      label: 'BU/GU',
      value:
        calculations.originalGravity && calculations.estimatedIbu
          ? (
              calculations.estimatedIbu /
              ((calculations.originalGravity - 1) * 1000)
            ).toFixed(2)
          : '—',
      suffix: '',
    },
    {
      label: 'Cor',
      value: `${calculations.estimatedEbc || '—'} EBC`,
      suffix: '',
    },
    {
      label: 'Carbonatação',
      value: recipe.carbonation?.co2Volumes
        ? `${recipe.carbonation.co2Volumes} CO2-vol`
        : '—',
      suffix: '',
    },
    {
      label: 'Densidade Pré Fervura',
      value: '—',
      suffix: '',
    },
    {
      label: 'Densidade Original',
      value: calculations.originalGravity?.toFixed(3) || '—',
      suffix: '',
    },
    {
      label: 'Densidade Final',
      value: calculations.finalGravity?.toFixed(3) || '—',
      suffix: '',
    },
  ]

  stats.forEach(stat => {
    leftY = addText(
      `${stat.label}: ${stat.value}${stat.suffix}`,
      margin,
      leftY,
      9,
      false,
      colors.text,
      leftColWidth,
    )
  })

  leftY += SPACING.subsectionGap

  rightY = addSectionHeader(
    'Volumes e Eficiências',
    rightColStart,
    rightY,
    rightColWidth,
  )

  const preBoilDisplay = recipe.preBoilVolume ?? null
  const strikeWater =
    calculations.strikeWaterVolume ?? recipe.mashVolume ?? null
  const spargeWater =
    calculations.spargeWaterVolume ??
    (recipe.mashVolume ? recipe.mashVolume * 0.5 : null)
  const totalWater =
    calculations.totalWaterVolume ??
    (recipe.mashVolume ? recipe.mashVolume * 1.5 : null)

  const volumes = [
    {
      label: 'Volume do Lote',
      value: recipe.finalVolume ? `${recipe.finalVolume} L` : '—',
    },
    {
      label: 'Volume da Fervura',
      value: preBoilDisplay ? `${preBoilDisplay} L` : '—',
    },
    {
      label: 'Volume Pós Fervura',
      value: recipe.finalVolume ? `${recipe.finalVolume} L` : '—',
    },
    {
      label: 'Água de Mostura',
      value: strikeWater != null ? `${strikeWater} L` : '—',
    },
    {
      label: 'Água de Lavagem',
      value: spargeWater != null ? `${spargeWater} L` : '—',
    },
    {
      label: 'Tempo de Fervura',
      value: recipe.boilTime
        ? `${typeof recipe.boilTime === 'number' ? recipe.boilTime : parseFloat(String(recipe.boilTime)) || 0} min`
        : '—',
    },
    {
      label: 'Água Total',
      value: totalWater != null ? `${totalWater} L` : '—',
    },
    {
      label: 'Eficiência do Equipamento',
      value: `${calculations.efficiency}%`,
    },
    {
      label: 'Eficiência da Mostura',
      value: recipe.mash?.mashProfile?.estimatedEfficiency
        ? `${recipe.mash.mashProfile.estimatedEfficiency}%`
        : `${calculations.efficiency}%`,
    },
  ]

  volumes.forEach(vol => {
    rightY = addText(
      `${vol.label}: ${vol.value}`,
      rightColStart,
      rightY,
      9,
      false,
      colors.text,
      rightColWidth,
    )
  })

  rightY += SPACING.subsectionGap

  // Sincroniza as colunas para a próxima linha ficarem alinhadas
  const syncY = Math.max(leftY, rightY)
  leftY = syncY
  rightY = syncY

  if (recipe.mash?.mashProfile) {
    leftY = addSectionHeader('Perfil de Mostura', margin, leftY, leftColWidth)
    leftY = addText(
      recipe.mash.mashProfile.name || 'Perfil de Mostura',
      margin,
      leftY,
      9,
      false,
      colors.text,
      leftColWidth,
    )
    leftY += SPACING.subsectionGap
  }

  if (recipe.fermentation?.fermentationProfile) {
    rightY = addSectionHeader(
      'Perfil de Fermentação',
      rightColStart,
      rightY,
      rightColWidth,
    )
    rightY = addText(
      recipe.fermentation.fermentationProfile.name || 'Perfil de Fermentação',
      rightColStart,
      rightY,
      9,
      false,
      colors.text,
      rightColWidth,
    )
    rightY = addText(
      '20 °C - 14 dias - Primária',
      rightColStart,
      rightY,
      9,
      false,
      colors.textLight,
      rightColWidth,
    )
    rightY += SPACING.subsectionGap
  }

  yPos = Math.max(leftY, rightY) + SPACING.sectionGap

  yPos = addSectionHeader('Medidas', margin, yPos, pageWidth - 2 * margin)

  const measures = [
    'pH da Mostura:',
    'Volume da Fervura:',
    'Densidade Pré Fervura:',
    'Volume Pós Fervura:',
    'Densidade Original:',
    'Água no Fermentador:',
    'Volume do Fermentador:',
    'Densidade Final:',
    'Volume de Engarrafamento:',
  ]

  measures.forEach(measure => {
    yPos = addText(
      measure,
      margin,
      yPos,
      9,
      false,
      colors.textLight,
      pageWidth - 2 * margin,
    )
  })

  yPos += SPACING.sectionGap

  if (yPos > pageHeight - 60) {
    doc.addPage()
    yPos = margin
  }

  if (recipe.fermentables.length > 0) {
    yPos = addSectionHeader(
      'Fermentáveis',
      margin,
      yPos,
      pageWidth - 2 * margin,
    )

    const totalFermentables = recipe.fermentables.reduce(
      (sum: number, f: RecipeFermentable) => {
        const amount =
          typeof f.amount === 'number'
            ? f.amount
            : parseFloat(String(f.amount || 0)) || 0
        return sum + amount
      },
      0,
    )

    yPos = addText(
      `(${totalFermentables.toFixed(2)} kg)`,
      margin,
      yPos,
      9,
      false,
      colors.textLight,
      pageWidth - 2 * margin,
    )
    yPos += SPACING.betweenItems

    recipe.fermentables.forEach((f: RecipeFermentable) => {
      const amount =
        typeof f.amount === 'number'
          ? f.amount
          : parseFloat(String(f.amount || 0)) || 0
      const percentage =
        totalFermentables > 0
          ? ((amount / totalFermentables) * 100).toFixed(1)
          : '0'
      const color = f.fermentable?.color || 0
      const name = f.fermentable?.name || 'Fermentável'
      const amountText =
        amount >= 1
          ? `${amount.toFixed(1)} kg`
          : `${(amount * 1000).toFixed(0)} g`
      yPos = addText(
        `${amountText} - ${name} ${color} EBC (${percentage}%)`,
        margin,
        yPos,
        9,
        false,
        colors.text,
        pageWidth - 2 * margin,
      )
    })
    yPos += SPACING.sectionGap
  }

  if (yPos > pageHeight - 60) {
    doc.addPage()
    yPos = margin
  }

  if (recipe.hops.length > 0) {
    yPos = addSectionHeader('Lúpulos', margin, yPos, pageWidth - 2 * margin)

    const totalHops = recipe.hops.reduce((sum: number, h: RecipeHop) => {
      const amount =
        typeof h.amount === 'number'
          ? h.amount
          : parseFloat(String(h.amount || 0)) || 0
      return sum + amount
    }, 0)

    yPos = addText(
      `(${totalHops} g)`,
      margin,
      yPos,
      9,
      false,
      colors.textLight,
      pageWidth - 2 * margin,
    )
    yPos += SPACING.betweenItems

    const boilHops = recipe.hops.filter((h: RecipeHop) => h.stage === 'boil')
    const whirlpoolHops = recipe.hops.filter(
      (h: RecipeHop) => h.stage === 'whirlpool',
    )
    const dryHops = recipe.hops.filter((h: RecipeHop) => h.stage === 'dry_hop')

    boilHops.forEach((h: RecipeHop) => {
      const boilTime =
        typeof h.boilTime === 'number'
          ? h.boilTime
          : typeof recipe.boilTime === 'number'
            ? recipe.boilTime
            : parseFloat(String(recipe.boilTime || 60)) || 60
      const alphaAcids =
        typeof h.hop?.alphaAcids === 'number' ? h.hop.alphaAcids : 0
      const amount =
        typeof h.amount === 'number'
          ? h.amount
          : parseFloat(String(h.amount || 0)) || 0
      const name = h.hop?.name || 'Lúpulo'
      const ibu = calculations.estimatedIbu
        ? ((amount / totalHops) * calculations.estimatedIbu).toFixed(0)
        : '—'
      yPos = addText(
        `${boilTime} min - ${amount} g - ${name} - ${alphaAcids}% (${ibu} IBU)`,
        margin,
        yPos,
        9,
        false,
        colors.text,
        pageWidth - 2 * margin,
      )
    })

    if (whirlpoolHops.length > 0) {
      yPos += SPACING.subsectionGap
      yPos = addText(
        'Hop Stand',
        margin,
        yPos,
        10,
        true,
        colors.primary,
        pageWidth - 2 * margin,
      )
      yPos = addText(
        '20 min infusão @ 80 °C',
        margin,
        yPos,
        9,
        false,
        colors.textLight,
        pageWidth - 2 * margin,
      )
      whirlpoolHops.forEach((h: RecipeHop) => {
        const alphaAcids =
          typeof h.hop?.alphaAcids === 'number' ? h.hop.alphaAcids : 0
        const amount =
          typeof h.amount === 'number'
            ? h.amount
            : parseFloat(String(h.amount || 0)) || 0
        const name = h.hop?.name || 'Lúpulo'
        const ibu = calculations.estimatedIbu
          ? ((amount / totalHops) * calculations.estimatedIbu * 0.1).toFixed(0)
          : '—'
        yPos = addText(
          `20 min 80 °C - ${amount} g - ${name} - ${alphaAcids}% (${ibu} IBU)`,
          margin,
          yPos,
          9,
          false,
          colors.text,
          pageWidth - 2 * margin,
        )
      })
    }

    if (dryHops.length > 0) {
      yPos += SPACING.subsectionGap
      yPos = addText(
        'Dry Hops',
        margin,
        yPos,
        10,
        true,
        colors.primary,
        pageWidth - 2 * margin,
      )
      dryHops.forEach((h: RecipeHop) => {
        const amount =
          typeof h.amount === 'number'
            ? h.amount
            : parseFloat(String(h.amount || 0)) || 0
        const name = h.hop?.name || 'Lúpulo'
        yPos = addText(
          `7 dias - ${amount} g - ${name}`,
          margin,
          yPos,
          9,
          false,
          colors.text,
          pageWidth - 2 * margin,
        )
      })
    }

    yPos += SPACING.sectionGap
  }

  if (yPos > pageHeight - 60) {
    doc.addPage()
    yPos = margin
  }

  yPos = addSectionHeader('Diversos', margin, yPos, pageWidth - 2 * margin)

  if (recipe.yeasts.length > 0) {
    yPos = addSpace(yPos, SPACING.betweenItems)
    yPos = addText(
      'Levedura',
      margin,
      yPos,
      11,
      true,
      colors.primary,
      pageWidth - 2 * margin,
    )
    yPos += SPACING.afterHeader

    recipe.yeasts.forEach((y: RecipeYeast) => {
      const name = y.yeast?.name || 'Levedura'
      const amountNum =
        typeof y.amount === 'number'
          ? y.amount
          : y.amount
            ? parseFloat(String(y.amount))
            : null
      const amount = amountNum ? `${amountNum} pct` : '1 pct'
      yPos = addText(
        `${amount} - ${name}`,
        margin,
        yPos,
        9,
        false,
        colors.text,
        pageWidth - 2 * margin,
      )
    })
    yPos += SPACING.subsectionGap
  }

  yPos = addSpace(yPos, SPACING.betweenItems)
  yPos = addText(
    'Células',
    margin,
    yPos,
    11,
    true,
    colors.primary,
    pageWidth - 2 * margin,
  )
  yPos += SPACING.afterHeader
  yPos = addText(
    '7 milhões células / ml',
    margin,
    yPos,
    9,
    false,
    colors.text,
    pageWidth - 2 * margin,
  )
  yPos += SPACING.subsectionGap

  if (recipe.notes) {
    yPos = addSpace(yPos, SPACING.betweenItems)
    yPos = addText(
      'Anotações da Receita',
      margin,
      yPos,
      12,
      true,
      colors.primary,
      pageWidth - 2 * margin,
    )
    yPos += SPACING.afterHeader
    yPos = addText(
      recipe.notes,
      margin,
      yPos,
      9,
      false,
      colors.text,
      pageWidth - 2 * margin,
    )
    yPos += SPACING.subsectionGap
  }

  const footerY = pageHeight - 10
  doc.setFontSize(7)
  doc.setTextColor(
    colors.textLight[0],
    colors.textLight[1],
    colors.textLight[2],
  )
  const now = new Date()
  const generatedText = `Generated ${now.toLocaleString('pt-BR')} - Malt Master - https://www.maltmaster.app`
  doc.text(generatedText, margin, footerY)

  const fileName = `${recipe.name || 'receita'}_${new Date().toISOString().split('T')[0]}.pdf`
  doc.save(fileName)
}
