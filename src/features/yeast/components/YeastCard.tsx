import { View, StyleSheet, TouchableOpacity } from 'react-native'
import { Text } from '../../../shared/components/Typography'
import { COLORS } from '../../../shared/styles/colors'
import { MdEdit } from 'react-icons/md'
import { BiWorld, BiDroplet } from 'react-icons/bi'
import { GiChemicalDrop } from 'react-icons/gi'
import { BsSnow, BsStars, BsLightningChargeFill } from 'react-icons/bs'
import { FaBacteria } from 'react-icons/fa'
import {
  Yeast,
  YeastType,
  yeastTypeLabels,
  yeastFormatLabels,
  yeastFlocculationLabels,
  getAttenuationLevel,
  getTempLevel,
  getFlocculationConfig,
  isCleanYeast,
  isCharacteristicYeast,
  isHighAttenuation,
  isHighGravity,
  typeColors,
} from '../data/mockYeastsData'

interface YeastCardProps {
  yeast: Yeast
  onEdit?: () => void
}

export const YeastCard = ({ yeast, onEdit }: YeastCardProps) => {
  const typeConfig = typeColors[yeast.type]

  // Ícone baseado no tipo
  const getTypeIcon = () => {
    switch (yeast.type) {
      case YeastType.ALE:
        return GiChemicalDrop
      case YeastType.LAGER:
        return BsSnow
      case YeastType.WILD:
      case YeastType.BACTERIA:
        return FaBacteria
    }
  }

  const TypeIcon = getTypeIcon()

  // Classificações
  const attenuationLevel = getAttenuationLevel(yeast.attenuationMax || yeast.attenuation)
  const tempLevel = getTempLevel(yeast.minTemp, yeast.maxTemp)
  const flocculationConfig = getFlocculationConfig(yeast.flocculation)

  // Características especiais
  const isClean = isCleanYeast(yeast)
  const isCharacteristic = isCharacteristicYeast(yeast)
  const hasHighAttenuation = isHighAttenuation(yeast)
  const hasHighGravity = isHighGravity(yeast)

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View
          style={[styles.iconContainer, { backgroundColor: typeConfig.bgColor }]}
        >
          <TypeIcon size={32} color={typeConfig.color} />
        </View>
        <View style={styles.headerContent}>
          <View style={styles.titleRow}>
            <Text style={styles.title}>{yeast.name}</Text>
            {yeast.isPublic && (
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
                {yeastTypeLabels[yeast.type]}
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
                {yeastFormatLabels[yeast.format]}
              </Text>
            </View>
          </View>
          {(yeast.supplier || yeast.origin) && (
            <Text style={styles.supplier}>
              {yeast.supplier}
              {yeast.supplier && yeast.origin && ' • '}
              {yeast.origin}
            </Text>
          )}
        </View>
      </View>

      <View style={styles.content}>
        {(isClean || isCharacteristic || hasHighAttenuation || hasHighGravity) && (
          <View style={styles.specialBadges}>
            {isClean && (
              <View style={styles.cleanBadge}>
                <BsStars size={12} color="#3B82F6" />
                <Text style={styles.cleanBadgeText}>Perfil Limpo</Text>
              </View>
            )}
            {isCharacteristic && (
              <View style={styles.characteristicBadge}>
                <BsLightningChargeFill size={12} color="#8B5CF6" />
                <Text style={styles.characteristicBadgeText}>
                  Perfil Característico
                </Text>
              </View>
            )}
            {hasHighAttenuation && (
              <View style={styles.highAttenuationBadge}>
                <Text style={styles.highAttenuationBadgeText}>
                  Super Atenuação
                </Text>
              </View>
            )}
            {hasHighGravity && (
              <View style={styles.highGravityBadge}>
                <Text style={styles.highGravityBadgeText}>High Gravity</Text>
              </View>
            )}
          </View>
        )}

        {yeast.aromaFlavor && (
          <View style={styles.aromaSection}>
            <Text style={styles.aromaLabel}>Perfil:</Text>
            <Text style={styles.aromaText} numberOfLines={2}>
              {yeast.aromaFlavor}
            </Text>
          </View>
        )}

        <View style={styles.fermentationSection}>
          <Text style={styles.sectionTitle}>Fermentação:</Text>

          {yeast.minTemp !== null && yeast.maxTemp !== null && (
            <View style={styles.infoRow}>
              <Text style={styles.label}>Temperatura:</Text>
              <View style={styles.valueRow}>
                <Text style={styles.value}>
                  {yeast.minTemp}°C - {yeast.maxTemp}°C
                </Text>
                <View
                  style={[
                    styles.levelBadge,
                    { backgroundColor: tempLevel.bgColor },
                  ]}
                >
                  <Text style={[styles.levelBadgeText, { color: tempLevel.color }]}>
                    {tempLevel.label}
                  </Text>
                </View>
              </View>
            </View>
          )}

          {yeast.attenuation !== null && (
            <View style={styles.infoRow}>
              <Text style={styles.label}>Atenuação:</Text>
              <View style={styles.valueRow}>
                <Text style={styles.value}>
                  {yeast.attenuation}
                  {yeast.attenuationMax && `-${yeast.attenuationMax}`}%
                </Text>
                <View
                  style={[
                    styles.levelBadge,
                    { backgroundColor: attenuationLevel.bgColor },
                  ]}
                >
                  <Text
                    style={[
                      styles.levelBadgeText,
                      { color: attenuationLevel.color },
                    ]}
                  >
                    {attenuationLevel.label}
                  </Text>
                </View>
              </View>
            </View>
          )}

          <View style={styles.infoRow}>
            <Text style={styles.label}>Floculação:</Text>
            <View
              style={[
                styles.levelBadge,
                { backgroundColor: flocculationConfig.bgColor },
              ]}
            >
              <BiDroplet size={14} color={flocculationConfig.color} />
              <Text
                style={[
                  styles.levelBadgeText,
                  { color: flocculationConfig.color },
                ]}
              >
                {yeastFlocculationLabels[yeast.flocculation]}
              </Text>
            </View>
          </View>

          {yeast.alcoholTolerance !== null && (
            <View style={styles.infoRow}>
              <Text style={styles.label}>Tolerância ao Álcool:</Text>
              <Text style={styles.value}>{yeast.alcoholTolerance}% ABV</Text>
            </View>
          )}
        </View>

        {(yeast.rehydrationNotes || yeast.starterNotes) && (
          <View style={styles.notesSection}>
            <Text style={styles.sectionTitle}>Notas Técnicas:</Text>
            {yeast.rehydrationNotes && (
              <View style={styles.noteItem}>
                <Text style={styles.noteLabel}>Reidratação:</Text>
                <Text style={styles.noteText} numberOfLines={2}>
                  {yeast.rehydrationNotes}
                </Text>
              </View>
            )}
            {yeast.starterNotes && (
              <View style={styles.noteItem}>
                <Text style={styles.noteLabel}>Starter:</Text>
                <Text style={styles.noteText} numberOfLines={2}>
                  {yeast.starterNotes}
                </Text>
              </View>
            )}
          </View>
        )}

        {yeast.notes && (
          <View style={styles.generalNotesSection}>
            <Text style={styles.generalNotesText} numberOfLines={2}>
              {yeast.notes}
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
  supplier: {
    fontSize: 12,
    fontWeight: '500',
    color: COLORS.text.secondary,
  },
  content: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
  },
  specialBadges: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 4,
  },
  cleanBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    backgroundColor: '#DBEAFE',
  },
  cleanBadgeText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#3B82F6',
  },
  characteristicBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    backgroundColor: '#EDE9FE',
  },
  characteristicBadgeText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#8B5CF6',
  },
  highAttenuationBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    backgroundColor: '#FFEDD5',
  },
  highAttenuationBadgeText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#F97316',
  },
  highGravityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    backgroundColor: '#FEE2E2',
  },
  highGravityBadgeText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#EF4444',
  },
  aromaSection: {
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border.light,
  },
  aromaLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.text.secondary,
    marginBottom: 4,
  },
  aromaText: {
    fontSize: 13,
    color: COLORS.text.primary,
    lineHeight: 18,
    fontStyle: 'italic',
  },
  fermentationSection: {
    gap: 8,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.text.primary,
    marginBottom: 4,
  },
  infoRow: {
    flexDirection: 'column',
    gap: 4,
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.text.secondary,
  },
  valueRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flexWrap: 'wrap',
  },
  value: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text.primary,
  },
  levelBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
  },
  levelBadgeText: {
    fontSize: 11,
    fontWeight: '600',
  },
  notesSection: {
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: COLORS.border.light,
    gap: 8,
  },
  noteItem: {
    gap: 2,
  },
  noteLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.text.secondary,
  },
  noteText: {
    fontSize: 12,
    color: COLORS.text.primary,
    lineHeight: 16,
  },
  generalNotesSection: {
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: COLORS.border.light,
  },
  generalNotesText: {
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

