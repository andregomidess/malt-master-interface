import { View, StyleSheet, TouchableOpacity } from 'react-native'
import { Text } from '../../../shared/components/Typography'
import { COLORS } from '../../../shared/styles/colors'
import { MdEdit, MdDelete } from 'react-icons/md'
import { IoWater } from 'react-icons/io5'
import { WaterProfile } from '../interfaces/WaterProfile'
import {
  calculateSO4ClRatio,
  getProfileType,
  calculateTotalHardness,
  getHardnessLevel,
  calculateResidualAlkalinity,
  getPhLevel,
  hasHighSulfate,
  hasHighChloride,
  hasHighBicarbonate,
  isVerySoftWater,
  profileTypeLabels,
  profileTypeColors,
  hardnessLabels,
  WaterHardness,
} from '../data/mockWaterProfilesData'

interface WaterProfileCardProps {
  profile: WaterProfile
  onEdit?: () => void
  onDelete?: () => void
}

export const WaterProfileCard = ({
  profile,
  onEdit,
  onDelete,
}: WaterProfileCardProps) => {
  const so4ClRatio = calculateSO4ClRatio(profile)
  const profileType = getProfileType(profile)
  const totalHardness = calculateTotalHardness(profile)
  const hardnessLevel = getHardnessLevel(profile)
  const residualAlkalinity = calculateResidualAlkalinity(profile)
  const phLevel = getPhLevel(profile.ph ?? null)

  const highSulfate = hasHighSulfate(profile)
  const highChloride = hasHighChloride(profile)
  const highBicarbonate = hasHighBicarbonate(profile)
  const softWater = isVerySoftWater(profile)

  const typeConfig = profileType
    ? profileTypeColors[profileType]
    : { color: '#6B7280', bgColor: '#F3F4F6' }

  const hardnessColors: Record<
    WaterHardness,
    { color: string; bgColor: string }
  > = {
    [WaterHardness.VERY_SOFT]: { color: '#3B82F6', bgColor: '#DBEAFE' },
    [WaterHardness.SOFT]: { color: '#10B981', bgColor: '#D1FAE5' },
    [WaterHardness.MODERATE]: { color: '#F59E0B', bgColor: '#FEF3C7' },
    [WaterHardness.HARD]: { color: '#EF4444', bgColor: '#FEE2E2' },
  }

  const hardnessConfig = hardnessColors[hardnessLevel]

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View
          style={[
            styles.iconContainer,
            { backgroundColor: typeConfig.bgColor },
          ]}
        >
          <IoWater size={32} color={typeConfig.color} />
        </View>
        <View style={styles.headerContent}>
          <Text style={styles.title}>{profile.name}</Text>
          <View style={styles.badges}>
            {profileType && (
              <View
                style={[styles.badge, { backgroundColor: typeConfig.bgColor }]}
              >
                <Text style={[styles.badgeText, { color: typeConfig.color }]}>
                  {profileTypeLabels[profileType]}
                </Text>
              </View>
            )}
            {profile.origin && (
              <View
                style={[
                  styles.badge,
                  { backgroundColor: COLORS.neutral.gray[100] },
                ]}
              >
                <Text
                  style={[styles.badgeText, { color: COLORS.text.secondary }]}
                >
                  {profile.origin}
                </Text>
              </View>
            )}
          </View>
        </View>
      </View>

      <View style={styles.content}>
        {(softWater || highSulfate || highChloride || highBicarbonate) && (
          <View style={styles.specialBadges}>
            {softWater && (
              <View style={styles.specialBadge}>
                <Text style={styles.specialBadgeText}>💧 Água Macia</Text>
              </View>
            )}
            {highSulfate && (
              <View
                style={[styles.specialBadge, { backgroundColor: '#FFEDD5' }]}
              >
                <Text style={[styles.specialBadgeText, { color: '#F97316' }]}>
                  🔸 Alto Amargor
                </Text>
              </View>
            )}
            {highChloride && (
              <View
                style={[styles.specialBadge, { backgroundColor: '#FEF3C7' }]}
              >
                <Text style={[styles.specialBadgeText, { color: '#F59E0B' }]}>
                  🟡 Maltado
                </Text>
              </View>
            )}
            {highBicarbonate && (
              <View
                style={[styles.specialBadge, { backgroundColor: '#FEE2E2' }]}
              >
                <Text style={[styles.specialBadgeText, { color: '#DC2626' }]}>
                  🟤 P/ Cervejas Escuras
                </Text>
              </View>
            )}
          </View>
        )}

        <View style={styles.compositionSection}>
          <Text style={styles.sectionTitle}>Composição Mineral:</Text>
          <View style={styles.mineralGrid}>
            <View style={styles.mineralColumn}>
              <View style={styles.mineralRow}>
                <Text style={styles.mineralLabel}>Ca²⁺</Text>
                <Text style={styles.mineralValue}>
                  {profile.ca !== null ? `${profile.ca} ppm` : 'N/A'}
                </Text>
              </View>
              <View style={styles.mineralRow}>
                <Text style={styles.mineralLabel}>Mg²⁺</Text>
                <Text style={styles.mineralValue}>
                  {profile.mg !== null ? `${profile.mg} ppm` : 'N/A'}
                </Text>
              </View>
              <View style={styles.mineralRow}>
                <Text style={styles.mineralLabel}>Na⁺</Text>
                <Text style={styles.mineralValue}>
                  {profile.na !== null ? `${profile.na} ppm` : 'N/A'}
                </Text>
              </View>
            </View>

            <View style={styles.mineralColumn}>
              <View style={styles.mineralRow}>
                <Text style={styles.mineralLabel}>SO₄²⁻</Text>
                <Text style={styles.mineralValue}>
                  {profile.so4 !== null ? `${profile.so4} ppm` : 'N/A'}
                </Text>
              </View>
              <View style={styles.mineralRow}>
                <Text style={styles.mineralLabel}>Cl⁻</Text>
                <Text style={styles.mineralValue}>
                  {profile.cl !== null ? `${profile.cl} ppm` : 'N/A'}
                </Text>
              </View>
              <View style={styles.mineralRow}>
                <Text style={styles.mineralLabel}>HCO₃⁻</Text>
                <Text style={styles.mineralValue}>
                  {profile.hco3 !== null ? `${profile.hco3} ppm` : 'N/A'}
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.phRow}>
            <Text style={styles.mineralLabel}>pH:</Text>
            <View style={styles.phValueRow}>
              <Text style={styles.mineralValue}>
                {profile.ph != null ? Number(profile.ph).toFixed(1) : 'N/A'}
              </Text>
              <View
                style={[styles.phBadge, { backgroundColor: phLevel.bgColor }]}
              >
                <Text style={[styles.phBadgeText, { color: phLevel.color }]}>
                  {phLevel.label}
                </Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.indicesSection}>
          <Text style={styles.sectionTitle}>Índices Calculados:</Text>

          {so4ClRatio !== null && (
            <View style={styles.indexRow}>
              <Text style={styles.indexLabel}>Relação SO₄:Cl:</Text>
              <View style={styles.indexValueRow}>
                <Text style={styles.indexValue}>{so4ClRatio.toFixed(2)}</Text>
                {profileType && (
                  <View
                    style={[
                      styles.indexBadge,
                      { backgroundColor: typeConfig.bgColor },
                    ]}
                  >
                    <Text
                      style={[
                        styles.indexBadgeText,
                        { color: typeConfig.color },
                      ]}
                    >
                      {profileTypeLabels[profileType]}
                    </Text>
                  </View>
                )}
              </View>
            </View>
          )}

          <View style={styles.indexRow}>
            <Text style={styles.indexLabel}>Dureza Total:</Text>
            <View style={styles.indexValueRow}>
              <Text style={styles.indexValue}>{totalHardness} ppm</Text>
              <View
                style={[
                  styles.indexBadge,
                  { backgroundColor: hardnessConfig.bgColor },
                ]}
              >
                <Text
                  style={[
                    styles.indexBadgeText,
                    { color: hardnessConfig.color },
                  ]}
                >
                  {hardnessLabels[hardnessLevel]}
                </Text>
              </View>
            </View>
          </View>

          {residualAlkalinity !== null && (
            <View style={styles.indexRow}>
              <Text style={styles.indexLabel}>Alc. Residual (RA):</Text>
              <View style={styles.indexValueRow}>
                <Text style={styles.indexValue}>
                  {residualAlkalinity > 0 ? '+' : ''}
                  {residualAlkalinity.toFixed(0)}
                </Text>
                <View
                  style={[
                    styles.indexBadge,
                    {
                      backgroundColor:
                        residualAlkalinity < 0 ? '#D1FAE5' : '#FFEDD5',
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.indexBadgeText,
                      {
                        color: residualAlkalinity < 0 ? '#10B981' : '#F97316',
                      },
                    ]}
                  >
                    {residualAlkalinity < 0
                      ? 'Cervejas Claras'
                      : 'Cervejas Escuras'}
                  </Text>
                </View>
              </View>
            </View>
          )}
        </View>

        {profile.recommendedStyle && (
          <View style={styles.stylesSection}>
            <Text style={styles.sectionTitle}>Estilos Recomendados:</Text>
            <View style={styles.stylesBadges}>
              {profile.recommendedStyle.split(',').map((style, index) => (
                <View key={index} style={styles.styleBadge}>
                  <Text style={styles.styleBadgeText}>{style.trim()}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {profile.notes && (
          <View style={styles.notesSection}>
            <Text style={styles.notesText} numberOfLines={3}>
              {profile.notes}
            </Text>
          </View>
        )}
      </View>

      <View style={styles.footer}>
        <View style={styles.actions}>
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
    height: 800,
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
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.text.primary,
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
  },
  specialBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    backgroundColor: '#DBEAFE',
  },
  specialBadgeText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#3B82F6',
  },
  compositionSection: {
    gap: 8,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border.light,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.text.primary,
    marginBottom: 4,
  },
  mineralGrid: {
    flexDirection: 'row',
    gap: 16,
  },
  mineralColumn: {
    flex: 1,
    gap: 6,
  },
  mineralRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  mineralLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.text.secondary,
  },
  mineralValue: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.text.primary,
  },
  phRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
  },
  phValueRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  phBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
  },
  phBadgeText: {
    fontSize: 11,
    fontWeight: '600',
  },
  indicesSection: {
    gap: 8,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border.light,
  },
  indexRow: {
    flexDirection: 'column',
    gap: 4,
  },
  indexLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.text.secondary,
  },
  indexValueRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flexWrap: 'wrap',
  },
  indexValue: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.text.primary,
  },
  indexBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
  },
  indexBadgeText: {
    fontSize: 11,
    fontWeight: '600',
  },
  stylesSection: {
    gap: 6,
  },
  stylesBadges: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  styleBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    backgroundColor: '#F3F4F6',
  },
  styleBadgeText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#6B7280',
  },
  notesSection: {
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: COLORS.border.light,
  },
  notesText: {
    fontSize: 12,
    color: COLORS.text.secondary,
    lineHeight: 16,
    fontStyle: 'italic',
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
})
