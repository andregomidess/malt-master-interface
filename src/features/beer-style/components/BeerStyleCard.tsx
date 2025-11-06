import { View, StyleSheet, TouchableOpacity } from 'react-native'
import { Text } from '../../../shared/components/Typography'
import { COLORS } from '../../../shared/styles/colors'
import { MdEdit, MdDelete } from 'react-icons/md'
import { IoMdEye } from 'react-icons/io'
import { BiWorld } from 'react-icons/bi'
import {
  BeerStyle,
  BeerTagLabels,
  BeerTagColors,
  GlasswareEmojis,
  GlasswareLabels,
  getAbvIntensity,
  getIbuIntensity,
  ebcToRgb,
  formatRange,
  truncateText,
  countryFlags,
} from '../interfaces/BeerStyle'

interface BeerStyleCardProps {
  beerStyle: BeerStyle
  onView?: () => void
  onEdit?: () => void
  onDelete?: () => void
}

export const BeerStyleCard = ({
  beerStyle,
  onView,
  onEdit,
  onDelete,
}: BeerStyleCardProps) => {
  const isPublic = !beerStyle.user

  // Intensidades
  const abvIntensity = getAbvIntensity(beerStyle.maxAbv || undefined)
  const ibuIntensity = getIbuIntensity(beerStyle.maxIbu || undefined)

  // Cor EBC
  const colorRgb = ebcToRgb(beerStyle.maxColorEbc || undefined)

  // Emoji do copo
  const glassEmoji = beerStyle.glassware
    ? GlasswareEmojis[beerStyle.glassware]
    : '🍺'

  // Bandeira do país
  const countryFlag = beerStyle.origin
    ? countryFlags[beerStyle.origin] || '🌍'
    : null

  // Tags visíveis (máximo 5)
  const visibleTags = beerStyle.tags.slice(0, 5)
  const remainingTags = beerStyle.tags.length - 5

  return (
    <View style={styles.card}>
      {/* Header */}
      <View style={styles.header}>
        <View style={[styles.iconContainer, { backgroundColor: '#FEF3C7' }]}>
          <Text style={styles.glassEmoji}>{glassEmoji}</Text>
        </View>
        <View style={styles.headerContent}>
          <View style={styles.titleRow}>
            <Text style={styles.title}>{beerStyle.name}</Text>
            {isPublic && (
              <View style={styles.publicBadge}>
                <BiWorld size={12} color="#6B7280" />
                <Text style={styles.publicBadgeText}>Público</Text>
              </View>
            )}
          </View>
          <View style={styles.badges}>
            {beerStyle.category && (
              <View
                style={[
                  styles.badge,
                  { backgroundColor: COLORS.brand.primary + '20' },
                ]}
              >
                <Text
                  style={[
                    styles.badgeText,
                    { color: COLORS.brand.primary },
                  ]}
                >
                  {beerStyle.category}
                </Text>
              </View>
            )}
            {beerStyle.subCategory && (
              <View
                style={[
                  styles.badge,
                  { backgroundColor: COLORS.neutral.gray[100] },
                ]}
              >
                <Text
                  style={[styles.badgeText, { color: COLORS.text.secondary }]}
                >
                  {beerStyle.subCategory}
                </Text>
              </View>
            )}
          </View>
          {beerStyle.glassware && (
            <Text style={styles.glassware}>
              {GlasswareLabels[beerStyle.glassware]}
            </Text>
          )}
        </View>
      </View>

      {/* Content */}
      <View style={styles.content}>
        {/* Parâmetros Técnicos */}
        <View style={styles.parametersSection}>
          <Text style={styles.sectionTitle}>Parâmetros Técnicos</Text>
          <View style={styles.parametersGrid}>
            {/* ABV */}
            <View style={styles.parameterItem}>
              <Text style={styles.parameterLabel}>ABV</Text>
              <Text style={styles.parameterValue}>
                {formatRange(beerStyle.minAbv, beerStyle.maxAbv, '%')}
              </Text>
              <View
                style={[
                  styles.intensityBadge,
                  { backgroundColor: abvIntensity.bgColor },
                ]}
              >
                <Text
                  style={[
                    styles.intensityText,
                    { color: abvIntensity.color },
                  ]}
                >
                  {abvIntensity.label}
                </Text>
              </View>
            </View>

            {/* IBU */}
            <View style={styles.parameterItem}>
              <Text style={styles.parameterLabel}>IBU</Text>
              <Text style={styles.parameterValue}>
                {formatRange(beerStyle.minIbu, beerStyle.maxIbu)}
              </Text>
              <View
                style={[
                  styles.intensityBadge,
                  { backgroundColor: ibuIntensity.bgColor },
                ]}
              >
                <Text
                  style={[
                    styles.intensityText,
                    { color: ibuIntensity.color },
                  ]}
                >
                  {ibuIntensity.label}
                </Text>
              </View>
            </View>

            {/* OG */}
            <View style={styles.parameterItem}>
              <Text style={styles.parameterLabel}>OG</Text>
              <Text style={styles.parameterValue}>
                {formatRange(beerStyle.minOg, beerStyle.maxOg)}
              </Text>
            </View>

            {/* FG */}
            <View style={styles.parameterItem}>
              <Text style={styles.parameterLabel}>FG</Text>
              <Text style={styles.parameterValue}>
                {formatRange(beerStyle.minFg, beerStyle.maxFg)}
              </Text>
            </View>

            {/* Cor EBC */}
            <View style={styles.parameterItem}>
              <Text style={styles.parameterLabel}>Cor EBC</Text>
              <View style={styles.colorRow}>
                <View
                  style={[styles.colorSample, { backgroundColor: colorRgb }]}
                />
                <Text style={styles.parameterValue}>
                  {formatRange(beerStyle.minColorEbc, beerStyle.maxColorEbc)}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Tags */}
        {beerStyle.tags.length > 0 && (
          <View style={styles.tagsSection}>
            <Text style={styles.sectionTitle}>Características</Text>
            <View style={styles.tagsGrid}>
              {visibleTags.map(tag => {
                const tagConfig = BeerTagColors[tag]
                return (
                  <View
                    key={tag}
                    style={[
                      styles.tagBadge,
                      { backgroundColor: tagConfig.bgColor },
                    ]}
                  >
                    <Text style={[styles.tagText, { color: tagConfig.color }]}>
                      {BeerTagLabels[tag]}
                    </Text>
                  </View>
                )
              })}
              {remainingTags > 0 && (
                <View
                  style={[
                    styles.tagBadge,
                    { backgroundColor: COLORS.neutral.gray[100] },
                  ]}
                >
                  <Text
                    style={[styles.tagText, { color: COLORS.text.secondary }]}
                  >
                    +{remainingTags}
                  </Text>
                </View>
              )}
            </View>
          </View>
        )}

        {/* Descrição */}
        {beerStyle.description && (
          <View style={styles.descriptionSection}>
            <Text style={styles.sectionTitle}>Descrição</Text>
            <Text style={styles.descriptionText} numberOfLines={3}>
              {truncateText(beerStyle.description, 150)}
            </Text>
          </View>
        )}

        {/* Aroma/Sabor */}
        {(beerStyle.aroma || beerStyle.flavor) && (
          <View style={styles.sensorySection}>
            {beerStyle.aroma && (
              <View style={styles.sensoryItem}>
                <Text style={styles.sensoryLabel}>🍃 Aroma:</Text>
                <Text style={styles.sensoryText} numberOfLines={2}>
                  {truncateText(beerStyle.aroma, 100)}
                </Text>
              </View>
            )}
            {beerStyle.flavor && (
              <View style={styles.sensoryItem}>
                <Text style={styles.sensoryLabel}>👅 Sabor:</Text>
                <Text style={styles.sensoryText} numberOfLines={2}>
                  {truncateText(beerStyle.flavor, 100)}
                </Text>
              </View>
            )}
          </View>
        )}
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        {beerStyle.origin && (
          <View style={styles.originContainer}>
            <Text style={styles.originText}>
              {countryFlag} {beerStyle.origin}
            </Text>
          </View>
        )}
        <View style={styles.actions}>
          {onView && (
            <TouchableOpacity style={styles.actionButton} onPress={onView}>
              <IoMdEye size={16} color={COLORS.text.secondary} />
              <Text style={styles.actionButtonText}>Ver</Text>
            </TouchableOpacity>
          )}
          {onEdit && (
            <TouchableOpacity style={styles.actionButton} onPress={onEdit}>
              <MdEdit size={16} color={COLORS.text.secondary} />
              <Text style={styles.actionButtonText}>Editar</Text>
            </TouchableOpacity>
          )}
          {onDelete && (
            <TouchableOpacity style={styles.deleteButton} onPress={onDelete}>
              <MdDelete size={16} color="#EF4444" />
              <Text style={styles.deleteButtonText}>Deletar</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.neutral.white,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.border.light,
    overflow: 'hidden',
    width: '100%',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: COLORS.neutral.white,
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border.light,
    gap: 12,
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  glassEmoji: {
    fontSize: 32,
  },
  headerContent: {
    flex: 1,
    gap: 6,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flexWrap: 'wrap',
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.text.primary,
    flex: 1,
  },
  publicBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    backgroundColor: '#F3F4F6',
  },
  publicBadgeText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#6B7280',
  },
  badges: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '600',
  },
  glassware: {
    fontSize: 12,
    fontWeight: '500',
    color: COLORS.text.secondary,
  },
  content: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
  },
  parametersSection: {
    gap: 8,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.text.secondary,
  },
  parametersGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  parameterItem: {
    flex: 1,
    minWidth: '45%',
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: '#F9FAFB',
    borderRadius: 6,
    gap: 4,
  },
  parameterLabel: {
    fontSize: 10,
    fontWeight: '600',
    color: COLORS.text.secondary,
  },
  parameterValue: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.text.primary,
  },
  intensityBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  intensityText: {
    fontSize: 10,
    fontWeight: '600',
  },
  colorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  colorSample: {
    width: 24,
    height: 24,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: COLORS.border.light,
  },
  tagsSection: {
    gap: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: COLORS.border.light,
  },
  tagsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  tagBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  tagText: {
    fontSize: 11,
    fontWeight: '600',
  },
  descriptionSection: {
    gap: 4,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: COLORS.border.light,
  },
  descriptionText: {
    fontSize: 13,
    color: COLORS.text.primary,
    lineHeight: 18,
  },
  sensorySection: {
    gap: 8,
  },
  sensoryItem: {
    gap: 2,
  },
  sensoryLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.text.secondary,
  },
  sensoryText: {
    fontSize: 12,
    color: COLORS.text.primary,
    lineHeight: 16,
    fontStyle: 'italic',
  },
  footer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: COLORS.border.light,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 12,
  },
  originContainer: {
    flex: 1,
  },
  originText: {
    fontSize: 13,
    fontWeight: '500',
    color: COLORS.text.secondary,
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  actionButtonText: {
    fontSize: 13,
    fontWeight: '500',
    color: COLORS.text.secondary,
  },
  deleteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  deleteButtonText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#EF4444',
  },
})

