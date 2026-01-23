import { View, StyleSheet, TouchableOpacity } from 'react-native'
import { Text } from '../../../shared/components/Typography'
import { COLORS } from '../../../shared/styles/colors'
import { MdEdit, MdDelete } from 'react-icons/md'
import { BiWorld, BiCopy } from 'react-icons/bi'
import { GiWheat, GiHotSpices, GiHoneyJar, GiCorn } from 'react-icons/gi'
import { BsStars, BsFire } from 'react-icons/bs'
import { Fermentable, FermentableType } from '../interfaces/Fermentable'
import {
  fermentableTypeLabels,
  fermentableFormLabels,
} from '../data/mockFermentablesData'
import {
  ebcToColor,
  isRoastedMalt,
  typeColors,
  isEssentialBaseMalt,
  getColorClassification,
  getYieldLevel,
} from '../helpers/fermentableHelpers'

interface FermentableCardProps {
  fermentable: Fermentable
  onEdit?: () => void
  onDelete?: () => void
  onUseAsBase?: () => void
}

export const FermentableCard = ({
  fermentable,
  onEdit,
  onDelete,
  onUseAsBase,
}: FermentableCardProps) => {
  const isPublic = fermentable.user === null
  const typeConfig = typeColors[fermentable.type]

  const getTypeIcon = () => {
    switch (fermentable.type) {
      case FermentableType.BASE:
        return GiWheat
      case FermentableType.SPECIALTY:
        return GiHotSpices
      case FermentableType.SUGAR:
        return GiHoneyJar
      case FermentableType.ADJUNCT:
        return GiCorn
    }
  }

  const TypeIcon = getTypeIcon()

  const colorClass = getColorClassification(fermentable.color ?? null)
  const colorHex = ebcToColor(fermentable.color ?? null)

  const yieldLevel = getYieldLevel(fermentable.yield ?? null)

  const isEssential = isEssentialBaseMalt(fermentable)
  const isRoasted = isRoastedMalt(fermentable)

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View
          style={[
            styles.iconContainer,
            { backgroundColor: typeConfig.bgColor },
          ]}
        >
          <TypeIcon size={32} color={typeConfig.color} />
        </View>
        <View style={styles.headerContent}>
          <View style={styles.titleRow}>
            <Text style={styles.title}>{fermentable.name}</Text>
            {isPublic && (
              <View style={styles.publicBadge}>
                <BiWorld size={12} color="#6B7280" />
                <Text style={styles.publicBadgeText}>Público</Text>
              </View>
            )}
          </View>
          <View style={styles.badges}>
            <View
              style={[styles.badge, { backgroundColor: typeConfig.bgColor }]}
            >
              <Text style={[styles.badgeText, { color: typeConfig.color }]}>
                {fermentableTypeLabels[fermentable.type]}
              </Text>
            </View>
            <View
              style={[
                styles.badge,
                { backgroundColor: COLORS.neutral.gray[100] },
              ]}
            >
              <Text
                style={[styles.badgeText, { color: COLORS.text.secondary }]}
              >
                {fermentableFormLabels[fermentable.form]}
              </Text>
            </View>
          </View>
          {fermentable.origin && (
            <Text style={styles.origin}>{fermentable.origin}</Text>
          )}
        </View>
      </View>

      <View style={styles.content}>
        {(isEssential || isRoasted) && (
          <View style={styles.specialBadges}>
            {isEssential && (
              <View style={styles.essentialBadge}>
                <BsStars size={12} color="#F59E0B" />
                <Text style={styles.essentialBadgeText}>Malte Essencial</Text>
              </View>
            )}
            {isRoasted && (
              <View style={styles.roastedBadge}>
                <BsFire size={12} color="#EF4444" />
                <Text style={styles.roastedBadgeText}>Malte Torrado</Text>
              </View>
            )}
          </View>
        )}

        <View style={styles.colorSection}>
          <Text style={styles.sectionTitle}>Cor:</Text>
          <View style={styles.colorRow}>
            <View style={[styles.colorSample, { backgroundColor: colorHex }]}>
              <View style={styles.colorSampleInner} />
            </View>
            <View style={styles.colorInfo}>
              <Text style={styles.colorValue}>
                {fermentable.color !== null
                  ? `${fermentable.color} EBC`
                  : 'N/A'}
              </Text>
              <View
                style={[
                  styles.colorClassBadge,
                  { backgroundColor: colorClass.color + '20' },
                ]}
              >
                <Text
                  style={[styles.colorClassText, { color: colorClass.color }]}
                >
                  {colorClass.label}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {fermentable.yield !== null && (
          <View style={styles.yieldSection}>
            <Text style={styles.label}>Rendimento:</Text>
            <View style={styles.yieldRow}>
              <Text style={styles.yieldValue}>{fermentable.yield}%</Text>
              <View
                style={[
                  styles.yieldBadge,
                  { backgroundColor: yieldLevel.bgColor },
                ]}
              >
                <Text
                  style={[styles.yieldBadgeText, { color: yieldLevel.color }]}
                >
                  {yieldLevel.label}
                </Text>
              </View>
            </View>
          </View>
        )}

        {fermentable.notes && (
          <View style={styles.notesSection}>
            <Text style={styles.label}>Notas:</Text>
            <Text style={styles.notesText} numberOfLines={3}>
              {fermentable.notes}
            </Text>
          </View>
        )}

        {fermentable.supplier && (
          <View style={styles.supplierRow}>
            <Text style={styles.label}>Fornecedor:</Text>
            <Text style={styles.supplierValue}>{fermentable.supplier}</Text>
          </View>
        )}
      </View>

      <View style={styles.footer}>
        <View style={styles.actions}>
          {isPublic ? (
            onUseAsBase && (
              <TouchableOpacity
                style={styles.useAsBaseButton}
                onPress={onUseAsBase}
              >
                <BiCopy size={16} color={COLORS.brand.primary} />
                <Text style={styles.useAsBaseButtonText}>Usar como Base</Text>
              </TouchableOpacity>
            )
          ) : (
            <>
              {onEdit && (
                <TouchableOpacity style={styles.actionButton} onPress={onEdit}>
                  <MdEdit size={16} color={COLORS.text.secondary} />
                  <Text style={styles.actionButtonText}>Editar</Text>
                </TouchableOpacity>
              )}
              {onDelete && (
                <TouchableOpacity
                  style={styles.deleteButton}
                  onPress={onDelete}
                >
                  <MdDelete size={16} color="#EF4444" />
                  <Text style={styles.deleteButtonText}>Deletar</Text>
                </TouchableOpacity>
              )}
            </>
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
    height: 650,
    flexDirection: 'column',
    justifyContent: 'space-between',
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
  origin: {
    fontSize: 12,
    fontWeight: '500',
    color: COLORS.text.secondary,
  },
  content: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
    flex: 1,
    justifyContent: 'flex-start',
  },
  specialBadges: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 4,
  },
  essentialBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    backgroundColor: '#FEF3C7',
  },
  essentialBadgeText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#F59E0B',
  },
  roastedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    backgroundColor: '#FEE2E2',
  },
  roastedBadgeText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#EF4444',
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.text.secondary,
    marginBottom: 4,
  },
  colorSection: {
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border.light,
  },
  colorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  colorSample: {
    width: 60,
    height: 60,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: COLORS.border.light,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  colorSampleInner: {
    width: '80%',
    height: '80%',
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  colorInfo: {
    flex: 1,
    gap: 4,
  },
  colorValue: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.text.primary,
  },
  colorClassBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  colorClassText: {
    fontSize: 11,
    fontWeight: '600',
  },
  yieldSection: {
    gap: 4,
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.text.secondary,
  },
  yieldRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  yieldValue: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.text.primary,
  },
  yieldBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
  },
  yieldBadgeText: {
    fontSize: 11,
    fontWeight: '600',
  },
  notesSection: {
    gap: 4,
  },
  notesText: {
    fontSize: 13,
    color: COLORS.text.primary,
    lineHeight: 18,
    fontStyle: 'italic',
  },
  supplierRow: {
    flexDirection: 'column',
    gap: 2,
  },
  supplierValue: {
    fontSize: 13,
    fontWeight: '500',
    color: COLORS.text.primary,
  },
  footer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: COLORS.border.light,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
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
  useAsBaseButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  useAsBaseButtonText: {
    fontSize: 13,
    fontWeight: '500',
    color: COLORS.brand.primary,
  },
})
