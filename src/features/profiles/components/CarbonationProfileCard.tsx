import { View, StyleSheet, TouchableOpacity } from 'react-native'
import { Text } from '../../../shared/components/Typography'
import { COLORS } from '../../../shared/styles/colors'
import { MdEdit } from 'react-icons/md'
import { BiWorld } from 'react-icons/bi'
import { GiBubbles } from 'react-icons/gi'
import type { CarbonationProfile } from '../interfaces/CarbonationProfile'
import { CarbonationType, PrimingSugarType } from '../interfaces/CarbonationProfile'

const carbonationTypeLabels: Record<CarbonationType, string> = {
  [CarbonationType.NATURAL_PRIMING]: 'Priming Natural',
  [CarbonationType.FORCED_CO2]: 'CO2 Forçado',
  [CarbonationType.BOTTLE_CONDITIONING]: 'Condicionamento em Garrafa',
}

const primingSugarTypeLabels: Record<PrimingSugarType, string> = {
  [PrimingSugarType.TABLE_SUGAR]: 'Açúcar de Mesa',
  [PrimingSugarType.CORN_SUGAR]: 'Açúcar de Milho',
  [PrimingSugarType.DME]: 'DME',
  [PrimingSugarType.HONEY]: 'Mel',
  [PrimingSugarType.MAPLE_SYRUP]: 'Xarope de Bordo',
}

interface CarbonationProfileCardProps {
  profile: CarbonationProfile
  onEdit?: () => void
}

export const CarbonationProfileCard = ({
  profile,
  onEdit,
}: CarbonationProfileCardProps) => {
  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View style={[styles.iconContainer, { backgroundColor: '#DBEAFE' }]}>
          <GiBubbles size={32} color="#3B82F6" />
        </View>
        <View style={styles.headerContent}>
          <View style={styles.titleRow}>
            <Text style={styles.title}>{profile.name}</Text>
            {profile.isPublic && (
              <View style={styles.publicBadge}>
                <BiWorld size={12} color="#6B7280" />
                <Text style={styles.publicBadgeText}>Público</Text>
              </View>
            )}
          </View>
          <View style={styles.badges}>
            <View
              style={[styles.badge, { backgroundColor: '#DBEAFE' }]}
            >
              <Text style={[styles.badgeText, { color: '#3B82F6' }]}>
                {carbonationTypeLabels[profile.type]}
              </Text>
            </View>
          </View>
        </View>
      </View>

      <View style={styles.content}>
        <View style={styles.infoRow}>
          <Text style={styles.label}>CO₂ Volumes:</Text>
          <Text style={styles.value}>{profile.targetCO2Volumes}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.label}>Temp. Serviço:</Text>
          <Text style={styles.value}>{profile.servingTemperature}°C</Text>
        </View>

        {profile.type === CarbonationType.NATURAL_PRIMING &&
          profile.primingSugarType && (
            <View style={styles.specificInfo}>
              <Text style={styles.sectionTitle}>Priming:</Text>
              <View style={styles.infoRow}>
                <Text style={styles.label}>Tipo:</Text>
                <Text style={styles.value}>
                  {primingSugarTypeLabels[profile.primingSugarType]}
                </Text>
              </View>
              {profile.primingSugarAmount && (
                <View style={styles.infoRow}>
                  <Text style={styles.label}>Quantidade:</Text>
                  <Text style={styles.value}>
                    {profile.primingSugarAmount}g/L
                  </Text>
                </View>
              )}
            </View>
          )}

        {profile.type === CarbonationType.FORCED_CO2 &&
          profile.kegPressure && (
            <View style={styles.specificInfo}>
              <Text style={styles.sectionTitle}>Pressão:</Text>
              <View style={styles.infoRow}>
                <Text style={styles.label}>Pressão do Keg:</Text>
                <Text style={styles.value}>{profile.kegPressure} PSI</Text>
              </View>
            </View>
          )}

        {profile.carbonationTime && (
          <View style={styles.infoRow}>
            <Text style={styles.label}>Tempo:</Text>
            <Text style={styles.value}>{profile.carbonationTime} dias</Text>
          </View>
        )}

        {profile.observations && (
          <View style={styles.observationsContainer}>
            <Text style={styles.observations} numberOfLines={2}>
              {profile.observations}
            </Text>
          </View>
        )}
      </View>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.editButton} onPress={onEdit}>
          <MdEdit size={16} color={COLORS.text.secondary} />
          <Text style={styles.editButtonText}>Editar</Text>
        </TouchableOpacity>
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
  content: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flexWrap: 'wrap',
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.text.secondary,
  },
  value: {
    fontSize: 14,
    fontWeight: '500',
    color: COLORS.text.primary,
  },
  specificInfo: {
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: COLORS.border.light,
    gap: 8,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.text.primary,
    marginBottom: 4,
  },
  observationsContainer: {
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: COLORS.border.light,
  },
  observations: {
    fontSize: 13,
    color: COLORS.text.secondary,
    lineHeight: 18,
  },
  footer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: COLORS.border.light,
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 4,
  },
  editButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: COLORS.text.secondary,
  },
})

