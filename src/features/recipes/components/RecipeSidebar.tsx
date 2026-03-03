import React, { useState, useMemo } from 'react'
import {
  View,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
} from 'react-native'
import { useRecipe } from '../context/RecipeContext'
import { useRecipeCalculations } from '../hooks/useRecipeCalculations'
import { Card } from '../../../shared/components/Card'
import { Text, Heading } from '../../../shared/components/Typography'
import { COLORS } from '../../../shared/styles/colors'
import {
  BiChevronDown,
  BiChevronUp,
  BiCheck,
  BiX,
  BiBeer,
  BiDroplet,
  BiCheckCircle,
  BiErrorCircle,
} from 'react-icons/bi'
import { FaFlask, FaLeaf } from 'react-icons/fa'
import { BeerStyle as FullBeerStyle } from '../../beer-style/interfaces/BeerStyle'
import {
  validateStyleRange,
  getValidationTooltip,
  StyleValidationResult,
} from '../utils/validateStyleRanges'
import { StyleRangeBar } from './StyleRangeBar'

interface CollapsibleSectionProps {
  title: string
  icon: React.ReactNode
  children: React.ReactNode
}

const CollapsibleSection: React.FC<CollapsibleSectionProps> = ({
  title,
  icon,
  children,
}) => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <Card style={styles.collapsibleCard}>
      <TouchableOpacity
        style={styles.collapsibleHeader}
        onPress={() => setIsOpen(!isOpen)}
        activeOpacity={0.7}
      >
        <View style={styles.collapsibleHeaderLeft}>
          <View style={styles.iconContainer}>{icon}</View>
          <Text variant="body" style={styles.collapsibleTitle}>
            {title}
          </Text>
        </View>
        {isOpen ? (
          <BiChevronUp size={20} color={COLORS.text.secondary} />
        ) : (
          <BiChevronDown size={20} color={COLORS.text.secondary} />
        )}
      </TouchableOpacity>
      {isOpen && <View style={styles.collapsibleContent}>{children}</View>}
    </Card>
  )
}

interface TooltipProps {
  children: React.ReactNode
  content: string
  show: boolean
}

const Tooltip: React.FC<TooltipProps> = ({ children, content, show }) => {
  const [isPressed, setIsPressed] = useState(false)

  if (!show) return <>{children}</>

  return (
    <TouchableOpacity
      style={styles.tooltipContainer}
      onPressIn={() => setIsPressed(true)}
      onPressOut={() => setIsPressed(false)}
      activeOpacity={1}
    >
      {children}
      {isPressed && (
        <View style={styles.tooltip}>
          <Text variant="caption" style={styles.tooltipText}>
            {content}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  )
}

interface StatCardProps {
  label: string
  value: string | number
  validation?: StyleValidationResult | null
  cardStyle?: object
}

const StatCard: React.FC<StatCardProps> = ({
  label,
  value,
  validation,
  cardStyle,
}) => {
  const displayValue = value
  const hasValidation = validation && validation.isValid !== null
  const isValid = validation?.isValid
  const tooltipContent = validation ? getValidationTooltip(validation) : ''
  const showTooltip = isValid === false && tooltipContent !== ''

  const cardStyles = hasValidation
    ? [
        cardStyle,
        {
          borderWidth: 2,
          borderColor:
            isValid === true
              ? COLORS.status.success
              : isValid === false
                ? COLORS.status.error
                : COLORS.border.light,
        },
      ]
    : cardStyle

  const cardContent = (
    <Card style={cardStyles as object}>
      <View style={styles.statCardHeader}>
        <Text variant="caption" style={styles.statLabel}>
          {label}
        </Text>
        {hasValidation && (
          <View style={styles.validationIconSmall}>
            {isValid === true ? (
              <BiCheckCircle size={16} color={COLORS.status.success} />
            ) : isValid === false ? (
              <BiErrorCircle size={16} color={COLORS.status.error} />
            ) : null}
          </View>
        )}
      </View>
      <Heading variant="h4" style={styles.statValue}>
        {displayValue}
      </Heading>
      {validation && validation.range !== '—' && (
        <Text variant="caption" style={styles.statRange}>
          Estilo: {validation.range}
        </Text>
      )}
    </Card>
  )

  return (
    <Tooltip content={tooltipContent} show={showTooltip}>
      {cardContent}
    </Tooltip>
  )
}

export const RecipeSidebar: React.FC = () => {
  const { recipe } = useRecipe()
  const calculations = useRecipeCalculations()

  const hasWaterVolumes =
    (calculations.strikeWaterVolume != null &&
      calculations.strikeWaterVolume > 0) ||
    !!recipe.mashVolume

  const validations = {
    basic:
      !!recipe.name &&
      !!recipe.beerStyle &&
      !!recipe.type &&
      !!recipe.equipment &&
      !!recipe.finalVolume &&
      (recipe.type === 'extract' || hasWaterVolumes) &&
      !!recipe.boilTime,
    fermentables: recipe.fermentables.length > 0,
    hops: recipe.hops.length > 0,
    yeasts: recipe.yeasts.length > 0,
    waters: recipe.waters.length > 0,
    mash: !!recipe.mash,
    fermentation: !!recipe.fermentation,
    carbonation: !!recipe.carbonation,
  }

  const styleValidations = useMemo(() => {
    const beerStyle = recipe.beerStyle as FullBeerStyle | null
    if (!beerStyle) {
      return {
        og: null as StyleValidationResult | null,
        fg: null as StyleValidationResult | null,
        abv: null as StyleValidationResult | null,
        ibu: null as StyleValidationResult | null,
        ebc: null as StyleValidationResult | null,
      }
    }

    return {
      og: validateStyleRange(
        calculations.originalGravity,
        beerStyle.minOg,
        beerStyle.maxOg,
        'OG (Original Gravity)',
      ),
      fg: validateStyleRange(
        calculations.finalGravity,
        beerStyle.minFg,
        beerStyle.maxFg,
        'FG (Final Gravity)',
      ),
      abv: validateStyleRange(
        calculations.estimatedAbv,
        beerStyle.minAbv,
        beerStyle.maxAbv,
        'ABV (Álcool por Volume)',
      ),
      ibu: validateStyleRange(
        calculations.estimatedIbu,
        beerStyle.minIbu,
        beerStyle.maxIbu,
        'IBU (Unidades de Amargor)',
      ),
      ebc: validateStyleRange(
        calculations.estimatedEbc,
        beerStyle.minColorEbc,
        beerStyle.maxColorEbc,
        'EBC (Cor)',
      ),
    }
  }, [recipe.beerStyle, calculations])

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <Card style={styles.previewCard}>
        {recipe.imageUrl ? (
          <Image
            source={{ uri: recipe.imageUrl }}
            style={styles.previewImage}
          />
        ) : (
          <View style={styles.previewImagePlaceholder} />
        )}
        <Heading variant="h5" style={styles.previewName}>
          {recipe.name || 'Nome da Receita'}
        </Heading>
        <Text variant="bodySmall" style={styles.previewStyle}>
          {recipe.beerStyle?.name || 'Estilo não selecionado'}
        </Text>
      </Card>

      <View style={styles.statsSection}>
        <Text variant="body" style={styles.sectionTitle}>
          Estatísticas
        </Text>
        {recipe.beerStyle && (
          <Text variant="caption" style={styles.styleHint}>
            Validação baseada no estilo: {recipe.beerStyle.name}
          </Text>
        )}
        <View style={styles.statsGrid}>
          <StyleRangeBar
            label="OG Calculado"
            validation={styleValidations.og}
            valueFormat="gravity"
            cardBgColor="#FFE5CC"
            containerStyle={styles.statBarWrapper48}
          />

          <StyleRangeBar
            label="FG Esperado"
            validation={styleValidations.fg}
            valueFormat="gravity"
            cardBgColor="#FFCCCC"
            containerStyle={styles.statBarWrapper48}
          />

          <StyleRangeBar
            label="ABV Percentual"
            validation={styleValidations.abv}
            valueFormat="percent"
            cardBgColor="#FFE5CC"
            containerStyle={styles.statBarWrapper48}
          />

          <StyleRangeBar
            label="IBU Soma Lúpulos"
            validation={styleValidations.ibu}
            valueFormat="decimal"
            cardBgColor="#FFCCCC"
            containerStyle={styles.statBarWrapper48}
          />

          <StatCard
            label="SRM Cor"
            value={calculations.estimatedColor || '—'}
            validation={null}
            cardStyle={styles.statCardYellow}
          />

          <StyleRangeBar
            label="EBC Cor"
            validation={styleValidations.ebc}
            valueFormat="decimal"
            cardBgColor="#FFF4CC"
            containerStyle={styles.statBarWrapper43}
          />

          <Card
            style={[styles.statCardWhite, styles.statCardFullWidth] as object}
          >
            <Text variant="caption" style={styles.statLabel}>
              Eficiência
            </Text>
            <Heading variant="h4" style={styles.statValue}>
              {calculations.efficiency} %
            </Heading>
          </Card>
        </View>
      </View>

      <View style={styles.ingredientsSection}>
        <Text variant="body" style={styles.sectionTitle}>
          Resumo dos Ingredientes
        </Text>

        <CollapsibleSection
          title="Fermentáveis"
          icon={<FaFlask size={20} color={COLORS.brand.primary} />}
        >
          {recipe.fermentables.length === 0 ? (
            <Text variant="bodySmall" style={styles.emptyText}>
              Nenhum fermentável adicionado
            </Text>
          ) : (
            <View style={styles.ingredientList}>
              {recipe.fermentables.map(f => (
                <View key={f.id} style={styles.ingredientItem}>
                  <Text variant="bodySmall">
                    {f.fermentable?.name || 'Fermentável'} - {f.amount} kg
                  </Text>
                </View>
              ))}
            </View>
          )}
        </CollapsibleSection>

        <CollapsibleSection
          title="Lúpulos"
          icon={<FaLeaf size={20} color={COLORS.brand.primary} />}
        >
          {recipe.hops.length === 0 ? (
            <Text variant="bodySmall" style={styles.emptyText}>
              Nenhum lúpulo adicionado
            </Text>
          ) : (
            <View style={styles.ingredientList}>
              {recipe.hops.map(h => (
                <View key={h.id} style={styles.ingredientItem}>
                  <Text variant="bodySmall">
                    {h.hop?.name || 'Lúpulo'} - {h.amount} g
                  </Text>
                </View>
              ))}
            </View>
          )}
        </CollapsibleSection>

        <CollapsibleSection
          title="Leveduras"
          icon={<BiBeer size={20} color={COLORS.brand.primary} />}
        >
          {recipe.yeasts.length === 0 ? (
            <Text variant="bodySmall" style={styles.emptyText}>
              Nenhuma levedura adicionada
            </Text>
          ) : (
            <View style={styles.ingredientList}>
              {recipe.yeasts.map(y => (
                <View key={y.id} style={styles.ingredientItem}>
                  <Text variant="bodySmall">{y.yeast?.name || 'Levedura'}</Text>
                </View>
              ))}
            </View>
          )}
        </CollapsibleSection>

        <CollapsibleSection
          title="Água"
          icon={<BiDroplet size={20} color={COLORS.brand.primary} />}
        >
          {recipe.waters.length === 0 ? (
            <Text variant="bodySmall" style={styles.emptyText}>
              Nenhuma água adicionada
            </Text>
          ) : (
            <View style={styles.ingredientList}>
              {recipe.waters.map(w => (
                <View key={w.id} style={styles.ingredientItem}>
                  <Text variant="bodySmall">
                    {w.water?.name || 'Água'} - {w.amount} L
                  </Text>
                </View>
              ))}
            </View>
          )}
        </CollapsibleSection>
      </View>

      {/* Validação */}
      <View style={styles.validationSection}>
        <Text variant="body" style={styles.sectionTitle}>
          Validação
        </Text>
        <Card style={styles.validationCard}>
          {[
            { key: 'basic', label: 'Básico' },
            { key: 'fermentables', label: 'Fermentáveis' },
            { key: 'hops', label: 'Lúpulos' },
            { key: 'yeasts', label: 'Leveduras' },
            { key: 'waters', label: 'Água' },
            { key: 'mash', label: 'Mostura' },
            { key: 'fermentation', label: 'Fermentação' },
            { key: 'carbonation', label: 'Carbonatação' },
          ].map(item => {
            const isValid = validations[item.key as keyof typeof validations]
            return (
              <View key={item.key} style={styles.validationItem}>
                <View style={styles.validationIcon}>
                  {isValid ? (
                    <BiCheck size={20} color={COLORS.status.success} />
                  ) : (
                    <BiX size={20} color={COLORS.status.error} />
                  )}
                </View>
                <Text
                  variant="bodySmall"
                  style={[
                    styles.validationLabel,
                    isValid && styles.validationLabelValid,
                  ]}
                >
                  {item.label}
                </Text>
              </View>
            )
          })}
        </Card>
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  previewCard: {
    alignItems: 'center',
    padding: 16,
    marginBottom: 24,
  },
  previewImage: {
    width: 60,
    height: 60,
    borderRadius: 60,
    marginBottom: 12,
  },
  previewImagePlaceholder: {
    width: 60,
    height: 60,
    borderRadius: 60,
    backgroundColor: COLORS.brand.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  previewName: {
    textAlign: 'center',
    marginBottom: 4,
    color: COLORS.text.primary,
  },
  previewStyle: {
    textAlign: 'center',
    color: COLORS.text.secondary,
  },
  statsSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontWeight: '600',
    color: COLORS.text.primary,
    marginBottom: 12,
  },
  styleHint: {
    color: COLORS.text.secondary,
    marginBottom: 8,
    fontStyle: 'italic',
  },
  statCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  validationIconSmall: {
    width: 16,
    height: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statRange: {
    color: COLORS.text.secondary,
    marginTop: 4,
    fontSize: 10,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  statBarWrapper48: {
    flex: 1,
    minWidth: '48%',
  },
  statBarWrapper43: {
    flex: 1,
    minWidth: '43%',
  },
  statCardOrange: {
    flex: 1,
    minWidth: '48%',
    padding: 12,
    minHeight: 80,
    backgroundColor: '#FFE5CC',
  },
  statCardRed: {
    flex: 1,
    minWidth: '48%',
    padding: 12,
    minHeight: 80,
    backgroundColor: '#FFCCCC',
  },
  statCardYellow: {
    // flex: 1,
    minWidth: '49%',
    padding: 12,
    minHeight: 80,
    backgroundColor: '#FFF4CC',
  },
  statCardWhite: {
    flex: 1,
    minWidth: '48%',
    padding: 12,
    minHeight: 80,
    backgroundColor: COLORS.neutral.white,
  },
  statCardFullWidth: {
    minWidth: '100%',
    flex: 0,
  },
  statLabel: {
    color: COLORS.text.secondary,
    marginBottom: 4,
  },
  statValue: {
    color: COLORS.text.primary,
  },
  ingredientsSection: {
    marginBottom: 24,
    gap: 12,
  },
  collapsibleCard: {
    marginBottom: 8,
  },
  collapsibleHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  collapsibleHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  iconContainer: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: COLORS.neutral.gray[100],
    alignItems: 'center',
    justifyContent: 'center',
  },
  collapsibleTitle: {
    fontWeight: '500',
    color: COLORS.text.primary,
  },
  collapsibleContent: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: COLORS.border.light,
  },
  ingredientList: {
    gap: 8,
  },
  ingredientItem: {
    paddingVertical: 4,
  },
  emptyText: {
    color: COLORS.text.tertiary,
    fontStyle: 'italic',
  },
  validationSection: {
    marginBottom: 24,
  },
  validationCard: {
    gap: 12,
  },
  validationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  validationIcon: {
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  validationLabel: {
    color: COLORS.text.secondary,
  },
  validationLabelValid: {
    color: COLORS.text.primary,
    fontWeight: '500',
  },
  tooltipContainer: {
    position: 'relative',
    width: '48.5%',
  },
  tooltip: {
    position: 'absolute',
    bottom: '100%',
    left: 0,
    right: 0,
    marginBottom: 8,
    backgroundColor: COLORS.text.primary,
    padding: 8,
    borderRadius: 6,
    zIndex: 1000,
    maxWidth: 250,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  tooltipText: {
    color: COLORS.neutral.white,
    fontSize: 11,
    lineHeight: 14,
  },
})
