import { View, StyleSheet, TouchableOpacity } from 'react-native'
import { Text } from '../../../shared/components/Typography'
import { COLORS } from '../../../shared/styles/colors'
import { MdEdit } from 'react-icons/md'
import { BiWorld } from 'react-icons/bi'
import { GiCookingPot } from 'react-icons/gi'
import type { MashProfile } from '../interfaces/MashProfile'
import { MashProfileType } from '../interfaces/MashProfile'

const mashTypeLabels: Record<MashProfileType, string> = {
  [MashProfileType.INFUSION]: 'Infusão',
  [MashProfileType.DECOCTION]: 'Decocção',
  [MashProfileType.STEP_MASH]: 'Step Mash',
  [MashProfileType.BIAB]: 'BIAB',
}

interface MashProfileCardProps {
  profile: MashProfile
  onEdit?: () => void
}

export const MashProfileCard = ({
  profile,
  onEdit,
}: MashProfileCardProps) => {
  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View style={[styles.iconContainer, { backgroundColor: '#FFEDD5' }]}>
          <GiCookingPot size={32} color="#F97316" />
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
              style={[styles.badge, { backgroundColor: '#FFEDD5' }]}
            >
              <Text style={[styles.badgeText, { color: '#F97316' }]}>
                {mashTypeLabels[profile.type]}
              </Text>
            </View>
            {profile.estimatedEfficiency && (
              <View
                style={[styles.badge, { backgroundColor: '#D1FAE5' }]}
              >
                <Text style={[styles.badgeText, { color: '#10B981' }]}>
                  {profile.estimatedEfficiency}% eficiência
                </Text>
              </View>
            )}
          </View>
        </View>
      </View>

      <View style={styles.content}>
        <View style={styles.temperatureRow}>
          <View style={styles.tempItem}>
            <Text style={styles.label}>Temp. Grãos:</Text>
            <Text style={styles.value}>{profile.grainTemperature}°C</Text>
          </View>
          <View style={styles.tempItem}>
            <Text style={styles.label}>Temp. Tun:</Text>
            <Text style={styles.value}>{profile.tunTemperature}°C</Text>
          </View>
          <View style={styles.tempItem}>
            <Text style={styles.label}>Sparge:</Text>
            <Text style={styles.value}>{profile.spargeTemperature}°C</Text>
          </View>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.label}>Espessura do Mash:</Text>
          <Text style={styles.value}>{profile.mashThickness} L/kg</Text>
        </View>

        {profile.steps && profile.steps.length > 0 && (
          <View style={styles.specificInfo}>
            <Text style={styles.sectionTitle}>
              Etapas ({profile.steps.length}):
            </Text>
            {profile.steps.slice(0, 3).map((step, index) => (
              <View key={step.id || index} style={styles.stepItem}>
                <Text style={styles.stepName}>{step.name}</Text>
                <Text style={styles.stepDetails}>
                  {step.temperature}°C por {step.duration} min
                </Text>
              </View>
            ))}
            {profile.steps.length > 3 && (
              <Text style={styles.moreSteps}>
                +{profile.steps.length - 3} etapa(s) adicional(is)
              </Text>
            )}
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
  temperatureRow: {
    flexDirection: 'row',
    gap: 12,
    flexWrap: 'wrap',
  },
  tempItem: {
    flex: 1,
    minWidth: 100,
    gap: 2,
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
  stepItem: {
    paddingVertical: 4,
  },
  stepName: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.text.primary,
  },
  stepDetails: {
    fontSize: 12,
    color: COLORS.text.secondary,
    marginTop: 2,
  },
  moreSteps: {
    fontSize: 12,
    color: COLORS.text.secondary,
    fontStyle: 'italic',
    marginTop: 4,
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

