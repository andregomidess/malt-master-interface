import { View, StyleSheet, TouchableOpacity } from 'react-native'
import { Text } from '../../../shared/components/Typography'
import { COLORS } from '../../../shared/styles/colors'
import { MdEdit, MdDelete } from 'react-icons/md'
import { GiHops } from 'react-icons/gi'
import { BiWorld, BiDollarCircle } from 'react-icons/bi'
import { Hop, HopUse } from '../interfaces/Hop'
import {
  hopFormLabels,
  hopUseLabels,
  getAlphaAcidsLevel,
  isNobleHop,
  isModernHop,
  useColors,
} from '../helpers/hopHelpers'

interface HopCardProps {
  hop: Hop
  onEdit?: () => void
  onDelete?: () => void
}

export const HopCard = ({ hop, onEdit, onDelete }: HopCardProps) => {
  const isPublic = hop.user === null

  // Uso principal (primeiro da lista)
  const primaryUse = hop.uses?.[0] || HopUse.DUAL_PURPOSE
  const primaryUseConfig = useColors[primaryUse]

  // Nível de alfa ácidos
  const alphaLevel = getAlphaAcidsLevel(hop.alphaAcids)

  // Características especiais
  const isNoble = isNobleHop(hop)
  const isModern = isModernHop(hop)

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View
          style={[
            styles.iconContainer,
            { backgroundColor: primaryUseConfig.bgColor },
          ]}
        >
          <GiHops size={32} color={primaryUseConfig.color} />
        </View>
        <View style={styles.headerContent}>
          <View style={styles.titleRow}>
            <Text style={styles.title}>{hop.name}</Text>
            {isPublic && (
              <View style={styles.publicBadge}>
                <BiWorld size={12} color="#6B7280" />
                <Text style={styles.publicBadgeText}>Público</Text>
              </View>
            )}
          </View>
          <View style={styles.badges}>
            <View
              style={[
                styles.badge,
                { backgroundColor: primaryUseConfig.bgColor },
              ]}
            >
              <Text
                style={[styles.badgeText, { color: primaryUseConfig.color }]}
              >
                {hopUseLabels[primaryUse]}
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
                {hopFormLabels[hop.form]}
              </Text>
            </View>
          </View>
          {hop.origin && <Text style={styles.origin}>{hop.origin}</Text>}
        </View>
      </View>

      <View style={styles.content}>
        {hop.aromaFlavor && (
          <View style={styles.aromaSection}>
            <Text style={styles.aromaLabel}>Perfil:</Text>
            <Text style={styles.aromaText} numberOfLines={2}>
              {hop.aromaFlavor}
            </Text>
          </View>
        )}

        <View style={styles.acidsSection}>
          <View style={styles.acidsRow}>
            <View style={styles.alphaContainer}>
              <Text style={styles.label}>Alfa Ácidos:</Text>
              <View style={styles.alphaValueRow}>
                <Text style={styles.alphaValue}>
                  {hop.alphaAcids.toFixed(1)}%
                </Text>
                <View
                  style={[
                    styles.alphaBadge,
                    { backgroundColor: alphaLevel.bgColor },
                  ]}
                >
                  <Text
                    style={[styles.alphaBadgeText, { color: alphaLevel.color }]}
                  >
                    {alphaLevel.level}
                  </Text>
                </View>
              </View>
            </View>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.label}>Beta Ácidos:</Text>
            <Text style={styles.value}>{hop.betaAcids.toFixed(1)}%</Text>
          </View>
        </View>

        {hop.uses.length > 1 && (
          <View style={styles.usesSection}>
            <Text style={styles.sectionTitle}>Usos:</Text>
            <View style={styles.usesBadges}>
              {hop.uses.map(use => (
                <View
                  key={use}
                  style={[
                    styles.useBadge,
                    { backgroundColor: useColors[use].bgColor },
                  ]}
                >
                  <Text
                    style={[
                      styles.useBadgeText,
                      { color: useColors[use].color },
                    ]}
                  >
                    {hopUseLabels[use]}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {(isNoble || isModern) && (
          <View style={styles.specialBadges}>
            {isNoble && (
              <View style={styles.nobleBadge}>
                <Text style={styles.nobleBadgeText}>✨ Lúpulo Nobre</Text>
              </View>
            )}
            {isModern && (
              <View style={styles.modernBadge}>
                <Text style={styles.modernBadgeText}>🚀 Lúpulo Moderno</Text>
              </View>
            )}
          </View>
        )}

        {hop.costPerKilogram != null && (
          <View style={styles.costRow}>
            <BiDollarCircle size={16} color={COLORS.text.secondary} />
            <Text style={styles.label}>Custo:</Text>
            <Text style={styles.costValue}>
              R$ {Number(hop.costPerKilogram).toFixed(2)}/kg
            </Text>
          </View>
        )}

        {(hop.cohumulone || hop.totalOils || hop.harvestYear) && (
          <View style={styles.additionalInfo}>
            <Text style={styles.additionalTitle}>Informações Adicionais:</Text>
            {hop.cohumulone != null && (
              <View style={styles.additionalRow}>
                <Text style={styles.additionalLabel}>Cohumulona:</Text>
                <Text style={styles.additionalValue}>
                  {Number(hop.cohumulone).toFixed(1)}%
                </Text>
              </View>
            )}
            {hop.totalOils != null && (
              <View style={styles.additionalRow}>
                <Text style={styles.additionalLabel}>Óleos Totais:</Text>
                <Text style={styles.additionalValue}>
                  {Number(hop.totalOils).toFixed(1)} ml/100g
                </Text>
              </View>
            )}
            {hop.harvestYear && (
              <View style={styles.additionalRow}>
                <Text style={styles.additionalLabel}>Colheita:</Text>
                <Text style={styles.additionalValue}>{hop.harvestYear}</Text>
              </View>
            )}
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
  acidsSection: {
    gap: 8,
  },
  acidsRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  alphaContainer: {
    flex: 1,
    gap: 4,
  },
  alphaValueRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  alphaValue: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.text.primary,
  },
  alphaBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
  },
  alphaBadgeText: {
    fontSize: 11,
    fontWeight: '600',
  },
  infoRow: {
    flexDirection: 'column',
    gap: 2,
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
  usesSection: {
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: COLORS.border.light,
    gap: 8,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.text.secondary,
  },
  usesBadges: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  useBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  useBadgeText: {
    fontSize: 11,
    fontWeight: '600',
  },
  specialBadges: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  nobleBadge: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
    backgroundColor: '#FEF3C7',
  },
  nobleBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#F59E0B',
  },
  modernBadge: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
    backgroundColor: '#DBEAFE',
  },
  modernBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#3B82F6',
  },
  costRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  costValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#10B981',
  },
  additionalInfo: {
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: COLORS.border.light,
    gap: 6,
  },
  additionalTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.text.secondary,
    marginBottom: 2,
  },
  additionalRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  additionalLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: COLORS.text.secondary,
  },
  additionalValue: {
    fontSize: 11,
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
})
