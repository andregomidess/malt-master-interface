import jsPDF from 'jspdf'
import { BatchDetail } from '../interfaces/Brewing'
import {
  formatDate,
  formatGravity,
  formatPercentage,
} from '../interfaces/Brewing'
import logoImage from '../../../assets/logo2.png'

interface BrewPdfData {
  batchDetail: BatchDetail
  measuredValues?: {
    preBoilGravity?: number | null
    preBoilVolume?: number | null
    postBoilGravity?: number | null
    mashPh?: number | null
  }
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

export async function generateBrewPdf(data: BrewPdfData) {
  const { batchDetail, measuredValues } = data
  const { batch, mashSteps, fermentationSteps, hopSchedule } = batchDetail
  const doc = new jsPDF()
  const pageWidth = doc.internal.pageSize.getWidth()
  const pageHeight = doc.internal.pageSize.getHeight()
  const margin = 15
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
    return y + lines.length * (fontSize * 0.4)
  }

  const addSpace = (y: number, space: number = 5) => {
    return y + space
  }

  const addColorSwatch = (x: number, y: number, ebc: number | null) => {
    if (!ebc) return
    const size = 20
    const r = Math.min(255, 200 + ebc * 2)
    const g = Math.min(255, 150 + ebc * 1.5)
    const b = Math.max(0, 100 - ebc * 3)
    doc.setFillColor(r, g, b)
    doc.rect(x, y, size, size, 'F')
    doc.setDrawColor(colors.border[0], colors.border[1], colors.border[2])
    doc.rect(x, y, size, size, 'S')
    addText(`${ebc} EBC`, x, y + size + 5, 8, false, colors.textLight, size)
    return y + size + 8
  }

  const drawTemperatureChart = (
    x: number,
    startY: number,
    width: number,
    height: number,
    steps: Array<{ temperature: number; duration: number; name: string }>,
    title: string,
    timeUnit: string = 'min',
  ) => {
    if (steps.length === 0) return startY + height + 5

    let currentY = startY

    const totalTime = steps.reduce((sum, step) => sum + step.duration, 0)
    const temps = steps.map(s => s.temperature)
    const minTemp = Math.min(...temps) - 5
    const maxTemp = Math.max(...temps) + 5
    const tempRange = maxTemp - minTemp

    currentY = addText(title, x, currentY, 10, true, colors.primary, width)
    currentY += 3

    const chartMargin = 5
    const chartX = x + chartMargin
    const chartY = currentY + chartMargin
    const chartWidth = width - chartMargin * 2
    const chartHeight = height - chartMargin * 2 - 20

    doc.setDrawColor(colors.border[0], colors.border[1], colors.border[2])
    doc.setLineWidth(0.5)
    doc.line(
      chartX,
      chartY + chartHeight,
      chartX + chartWidth,
      chartY + chartHeight,
    )
    doc.line(chartX, chartY, chartX, chartY + chartHeight)

    const tempSteps = 5
    for (let i = 0; i <= tempSteps; i++) {
      const temp = minTemp + (tempRange / tempSteps) * i
      const yPos = chartY + chartHeight - (chartHeight / tempSteps) * i
      doc.setDrawColor(colors.border[0], colors.border[1], colors.border[2])
      doc.setLineWidth(0.2)
      doc.line(chartX, yPos, chartX + chartWidth, yPos)
      doc.setTextColor(
        colors.textLight[0],
        colors.textLight[1],
        colors.textLight[2],
      )
      doc.setFontSize(7)
      doc.text(`${Math.round(temp)}°C`, chartX - 15, yPos + 2)
    }

    let currentTime = 0
    doc.setDrawColor(colors.primary[0], colors.primary[1], colors.primary[2])
    doc.setLineWidth(1.5)

    steps.forEach((step, index) => {
      const startX = chartX + (currentTime / totalTime) * chartWidth
      const endX =
        chartX + ((currentTime + step.duration) / totalTime) * chartWidth
      const tempY =
        chartY +
        chartHeight -
        ((step.temperature - minTemp) / tempRange) * chartHeight

      if (index === 0) {
        doc.circle(startX, tempY, 2, 'F')
      }

      doc.line(startX, tempY, endX, tempY)

      doc.circle(endX, tempY, 2, 'F')

      doc.setFontSize(6)
      doc.setTextColor(colors.text[0], colors.text[1], colors.text[2])
      const labelX = startX + (endX - startX) / 2
      const labelY = tempY - 5
      doc.text(step.name, labelX, labelY, {
        align: 'center',
        maxWidth: endX - startX,
      })

      currentTime += step.duration
    })

    doc.setFontSize(7)
    doc.setTextColor(
      colors.textLight[0],
      colors.textLight[1],
      colors.textLight[2],
    )
    const timeSteps = 4
    for (let i = 0; i <= timeSteps; i++) {
      const time = (totalTime / timeSteps) * i
      const xPos = chartX + (i / timeSteps) * chartWidth
      doc.text(
        `${Math.round(time)}${timeUnit}`,
        xPos,
        chartY + chartHeight + 8,
        { align: 'center' },
      )
    }

    doc.setFontSize(8)
    doc.setTextColor(colors.text[0], colors.text[1], colors.text[2])
    doc.text('Temperatura (°C)', x + width / 2, startY, { align: 'center' })
    const finalY = chartY + chartHeight + 20
    doc.text(`Tempo (${timeUnit})`, x + width / 2, finalY, {
      align: 'center',
    })

    return finalY + 8
  }

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
  }

  if (batch.batchCode) {
    yPos = addText(
      `Lote ${batch.batchCode}`,
      margin,
      yPos,
      16,
      true,
      colors.primary,
    )
  }
  if (batch.brewDate) {
    const date = new Date(batch.brewDate)
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
  yPos += 8

  if (batch.recipe) {
    const recipeName = batch.recipe.name || 'Receita'
    yPos = addText(recipeName, margin, yPos, 20, true, colors.primary)
    yPos += 2

    if (batch.recipe.color) {
      yPos = addText(
        `${batch.recipe.color} EBC`,
        margin,
        yPos,
        12,
        false,
        colors.text,
      )
    }
    if (batch.recipe.abv) {
      yPos = addText(
        `${recipeName} - ${batch.recipe.abv}%`,
        margin,
        yPos,
        12,
        false,
        colors.primary,
      )
    }
    const styleName =
      typeof batch.recipe.beerStyle === 'object' && batch.recipe.beerStyle
        ? batch.recipe.beerStyle.name
        : batch.recipe.styleName
    if (styleName) {
      yPos = addText(styleName || '', margin, yPos, 11, false, colors.text)
    }
    yPos += 10
  }

  let leftY = yPos
  let rightY = yPos

  leftY = addSpace(leftY, 3)
  leftY = addText(
    'Estatísticas',
    margin,
    leftY,
    12,
    true,
    colors.primary,
    leftColWidth,
  )
  leftY += 2

  const stats = [
    {
      label: 'IBU',
      value: batch.recipe?.ibu
        ? `${batch.recipe.ibu} (Tinseth)`
        : batch.actualIbu
          ? `${batch.actualIbu}`
          : '—',
    },
    {
      label: 'BU/GU',
      value:
        batch.recipe?.og && batch.recipe?.ibu
          ? (batch.recipe.ibu / ((batch.recipe.og - 1) * 1000)).toFixed(2)
          : '—',
    },
    {
      label: 'Cor',
      value: batch.recipe?.color ? `${batch.recipe.color} EBC` : '—',
    },
    {
      label: 'Carbonatação',
      value: '2.5 CO2-vol',
    },
    {
      label: 'Densidade Pré Fervura',
      value: measuredValues?.preBoilGravity
        ? formatGravity(measuredValues.preBoilGravity)
        : '—',
    },
    {
      label: 'Densidade Original',
      value: formatGravity(
        batch.actualOriginalGravity || batch.recipe?.og || null,
      ),
    },
    {
      label: 'Densidade Final',
      value: formatGravity(
        batch.actualFinalGravity || batch.recipe?.fg || null,
      ),
    },
  ]

  stats.forEach(stat => {
    leftY = addText(
      `${stat.label}: ${stat.value}`,
      margin,
      leftY,
      9,
      false,
      colors.text,
      leftColWidth,
    )
  })

  leftY += 5

  rightY = addSpace(rightY, 3)
  rightY = addText(
    'Volumes e Eficiências',
    rightColStart,
    rightY,
    12,
    true,
    colors.primary,
    rightColWidth,
  )
  rightY += 2

  if (batch.recipe?.color) {
    addColorSwatch(
      rightColStart + rightColWidth - 25,
      rightY - 15,
      batch.recipe.color,
    )
  }

  const volumes = [
    {
      label: 'Volume do Lote',
      value: batch.finalVolume ? `${batch.finalVolume} L` : '—',
    },
    {
      label: 'Volume da Fervura',
      value: measuredValues?.preBoilVolume
        ? `${measuredValues.preBoilVolume} L`
        : batch.plannedVolume
          ? `${batch.plannedVolume} L`
          : '—',
    },
    {
      label: 'Volume Pós Fervura',
      value: batch.finalVolume ? `${batch.finalVolume} L` : '—',
    },
    {
      label: 'Água de Mostura',
      value: batch.plannedVolume ? `${batch.plannedVolume * 0.5} L` : '—',
    },
    {
      label: 'Água de Lavagem',
      value: batch.plannedVolume ? `${batch.plannedVolume * 0.5} L` : '—',
    },
    {
      label: 'Tempo de Fervura',
      value: '90 min',
    },
    {
      label: 'Água Total',
      value: batch.plannedVolume ? `${batch.plannedVolume} L` : '—',
    },
    {
      label: 'Eficiência do Equipamento',
      value: formatPercentage(batch.actualEfficiency),
    },
    {
      label: 'Eficiência da Mostura',
      value: formatPercentage(batch.actualEfficiency),
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

  rightY += 5

  const syncY = Math.max(leftY, rightY)
  yPos = syncY

  if (mashSteps.length > 0) {
    yPos = addSpace(yPos, 3)
    yPos = addText(
      'Perfil de Mostura',
      margin,
      yPos,
      12,
      true,
      colors.primary,
      leftColWidth,
    )
    yPos += 2

    mashSteps.forEach(step => {
      yPos = addText(
        `${step.temperature} °C - ${step.duration} min - ${step.name}`,
        margin,
        yPos,
        9,
        false,
        colors.text,
        leftColWidth,
      )
    })
    yPos += 5

    const chartHeight = 60
    yPos = drawTemperatureChart(
      margin,
      yPos,
      pageWidth - 2 * margin,
      chartHeight,
      mashSteps.map(s => ({
        temperature: s.temperature,
        duration: s.duration,
        name: s.name,
      })),
      'Temperatura vs Tempo',
      'min',
    )
    yPos += 5
  }

  if (fermentationSteps.length > 0) {
    yPos = addSpace(yPos, 3)
    yPos = addText(
      'Perfil de Fermentação',
      rightColStart,
      yPos,
      12,
      true,
      colors.primary,
      rightColWidth,
    )
    yPos += 2

    fermentationSteps.forEach(step => {
      yPos = addText(
        `${step.name || 'Ale'}`,
        rightColStart,
        yPos,
        9,
        false,
        colors.text,
        rightColWidth,
      )
      yPos = addText(
        `${step.temperature} °C - ${step.duration} dias - Primária`,
        rightColStart,
        yPos,
        9,
        false,
        colors.textLight,
        rightColWidth,
      )
    })
    yPos += 5

    const chartHeight = 60
    yPos = drawTemperatureChart(
      margin,
      yPos,
      pageWidth - 2 * margin,
      chartHeight,
      fermentationSteps.map(s => ({
        temperature: s.temperature,
        duration: s.duration,
        name: s.name || 'Ale',
      })),
      'Temperatura vs Tempo',
      'dias',
    )
    yPos += 5
  }

  leftY = yPos
  rightY = yPos

  yPos = addSpace(yPos, 3)
  yPos = addText(
    'Medidas',
    rightColStart,
    yPos,
    12,
    true,
    colors.primary,
    rightColWidth,
  )
  yPos += 2

  const measures = [
    {
      label: 'pH da Mostura',
      value: measuredValues?.mashPh?.toFixed(2) || '—',
    },
    {
      label: 'Volume da Fervura',
      value: measuredValues?.preBoilVolume
        ? `${measuredValues.preBoilVolume} L`
        : '—',
    },
    {
      label: 'Densidade Pré Fervura',
      value: formatGravity(measuredValues?.preBoilGravity || null),
    },
    {
      label: 'Volume Pós Fervura',
      value: batch.finalVolume ? `${batch.finalVolume} L` : '—',
    },
    {
      label: 'Densidade Original',
      value: formatGravity(
        batch.actualOriginalGravity || batch.recipe?.og || null,
      ),
    },
    {
      label: 'Água no Fermentador',
      value: batch.finalVolume ? `${batch.finalVolume} L` : '—',
    },
    {
      label: 'Volume do Fermentador',
      value: batch.finalVolume ? `${batch.finalVolume} L` : '—',
    },
    {
      label: 'Densidade Final',
      value: formatGravity(
        batch.actualFinalGravity || batch.recipe?.fg || null,
      ),
    },
    {
      label: 'Volume de Engarrafamento',
      value: batch.finalVolume ? `${batch.finalVolume} L` : '—',
    },
  ]

  measures.forEach(measure => {
    yPos = addText(
      `${measure.label}: ${measure.value}`,
      rightColStart,
      yPos,
      9,
      false,
      colors.textLight,
      rightColWidth,
    )
  })

  yPos += 10

  if (yPos > pageHeight - 60) {
    doc.addPage()
    yPos = margin
  }

  if (hopSchedule.length > 0) {
    yPos = addSpace(yPos, 3)
    yPos = addText(
      'Lúpulos',
      margin,
      yPos,
      12,
      true,
      colors.primary,
      pageWidth - 2 * margin,
    )
    yPos += 2

    const totalHops = hopSchedule.reduce((sum, h) => sum + h.amount, 0)
    yPos = addText(
      `(${totalHops} ${hopSchedule[0]?.unit || 'g'})`,
      margin,
      yPos,
      9,
      false,
      colors.textLight,
      pageWidth - 2 * margin,
    )
    yPos += 3

    hopSchedule.forEach(hop => {
      const alphaAcid = hop.alphaAcid ? ` - ${hop.alphaAcid}%` : ''
      yPos = addText(
        `${hop.time} min - ${hop.amount} ${hop.unit} - ${hop.name}${alphaAcid}`,
        margin,
        yPos,
        9,
        false,
        colors.text,
        pageWidth - 2 * margin,
      )
    })
    yPos += 5
  }

  yPos = addSpace(yPos, 3)
  yPos = addText(
    'Registro do Lote',
    margin,
    yPos,
    12,
    true,
    colors.primary,
    pageWidth - 2 * margin,
  )
  yPos += 2

  if (batch.brewDate) {
    yPos = addText(
      `${formatDate(batch.brewDate)} Data da Brassagem`,
      margin,
      yPos,
      9,
      false,
      colors.text,
      pageWidth - 2 * margin,
    )
  }
  if (batch.brewDate) {
    const fermentDate = new Date(batch.brewDate)
    fermentDate.setDate(fermentDate.getDate() + 1)
    yPos = addText(
      `${formatDate(fermentDate.toISOString())} Início da Fermentação`,
      margin,
      yPos,
      9,
      false,
      colors.text,
      pageWidth - 2 * margin,
    )
  }
  if (batch.packagingDate) {
    yPos = addText(
      `${formatDate(batch.packagingDate)} Data do Engarrafamento`,
      margin,
      yPos,
      9,
      false,
      colors.text,
      pageWidth - 2 * margin,
    )
  }

  yPos += 5

  if (batch.observations) {
    yPos = addSpace(yPos, 3)
    yPos = addText(
      'Observações',
      margin,
      yPos,
      12,
      true,
      colors.primary,
      pageWidth - 2 * margin,
    )
    yPos += 2
    yPos = addText(
      batch.observations,
      margin,
      yPos,
      9,
      false,
      colors.text,
      pageWidth - 2 * margin,
    )
    yPos += 5
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

  const fileName = `${batch.batchCode || batch.name || 'lote'}_${new Date().toISOString().split('T')[0]}.pdf`
  doc.save(fileName)
}
