import { View, StyleSheet, TouchableOpacity } from 'react-native'
import { Text } from '../../../shared/components/Typography'
import { COLORS } from '../../../shared/styles/colors'
import { MdEdit, MdDelete } from 'react-icons/md'
import { IoMdEye } from 'react-icons/io'
import { GiBeerBottle } from 'react-icons/gi'
import {
  TastingNote,
  getScoreColor,
  formatTastingDate,
  truncateText,
  BatchStatusLabels,
  BatchStatusColors,
} from '../interfaces/TastingNote'

interface TastingNoteCardProps {
  tastingNote: TastingNote
  onView?: () => void
  onEdit?: () => void
  onDelete?: () => void
}

export const TastingNoteCard = ({
  tastingNote,
  onView,
  onEdit,
  onDelete,
}: TastingNoteCardProps) => {
  const overallScore =
    typeof tastingNote.overallScore === 'number'
      ? tastingNote.overallScore
      : Number(tastingNote.overallScore) || 0

  const overallScoreConfig = getScoreColor(overallScore)
  const batchStatusConfig =
    BatchStatusColors[tastingNote.batch.status || 'planned']

  const batchName =
    tastingNote.batch.name ||
    tastingNote.batch.batchCode ||
    `Lote #${tastingNote.batch.id.slice(0, 8)}`

  const secondaryScores = [
    {
      label: 'Aparência',
      value: tastingNote.appearanceScore,
      emoji: '👁️',
    },
    { label: 'Aroma', value: tastingNote.aromaScore, emoji: '👃' },
    { label: 'Sabor', value: tastingNote.flavorScore, emoji: '👅' },
    { label: 'Sensação', value: tastingNote.mouthfeelScore, emoji: '🫧' },
  ]
    .filter(score => score.value !== null && score.value !== undefined)
    .map(score => ({
      ...score,
      value:
        typeof score.value === 'number' ? score.value : Number(score.value),
    }))
    .filter(score => !isNaN(score.value))

  return (
    <View style={styles.card}>
      {/* Header */}
      <View style={styles.header}>
        <View
          style={[
            styles.iconContainer,
            { backgroundColor: overallScoreConfig.bgColor },
          ]}
        >
          <GiBeerBottle size={32} color={overallScoreConfig.color} />
        </View>
        <View style={styles.headerContent}>
          <View style={styles.titleRow}>
            <Text style={styles.title}>{batchName}</Text>
          </View>
          <View style={styles.badges}>
            <View
              style={[
                styles.badge,
                { backgroundColor: batchStatusConfig.bgColor },
              ]}
            >
              <Text
                style={[styles.badgeText, { color: batchStatusConfig.color }]}
              >
                {BatchStatusLabels[tastingNote.batch.status || 'planned']}
              </Text>
            </View>
            {tastingNote.batch.recipe?.name && (
              <View
                style={[
                  styles.badge,
                  { backgroundColor: COLORS.neutral.gray[100] },
                ]}
              >
                <Text
                  style={[styles.badgeText, { color: COLORS.text.secondary }]}
                >
                  {tastingNote.batch.recipe.name}
                </Text>
              </View>
            )}
          </View>
          <Text style={styles.date}>
            {formatTastingDate(tastingNote.tastingDate)}
          </Text>
        </View>
      </View>

      {/* Content */}
      <View style={styles.content}>
        {/* Nota Geral */}
        <View style={styles.overallScoreSection}>
          <View style={styles.overallScoreLeft}>
            <Text style={styles.overallScoreLabel}>Nota Geral</Text>
            <View
              style={[
                styles.overallScoreBadge,
                { backgroundColor: overallScoreConfig.bgColor },
              ]}
            >
              <Text
                style={[
                  styles.overallScoreBadgeText,
                  { color: overallScoreConfig.color },
                ]}
              >
                {overallScoreConfig.label}
              </Text>
            </View>
          </View>
          <View
            style={[
              styles.overallScoreCircle,
              { backgroundColor: overallScoreConfig.bgColor },
            ]}
          >
            <Text
              style={[
                styles.overallScoreValue,
                { color: overallScoreConfig.color },
              ]}
            >
              {overallScore.toFixed(1)}
            </Text>
          </View>
        </View>

        {/* Scores Secundários */}
        {secondaryScores.length > 0 && (
          <View style={styles.secondaryScoresSection}>
            <Text style={styles.secondaryScoresTitle}>Outras Notas</Text>
            <View style={styles.secondaryScoresGrid}>
              {secondaryScores.map((score, index) => {
                const scoreConfig = getScoreColor(score.value)
                return (
                  <View key={index} style={styles.secondaryScoreItem}>
                    <Text style={styles.secondaryScoreEmoji}>
                      {score.emoji}
                    </Text>
                    <View style={styles.secondaryScoreInfo}>
                      <Text style={styles.secondaryScoreLabel}>
                        {score.label}
                      </Text>
                      <View
                        style={[
                          styles.secondaryScoreBadge,
                          { backgroundColor: scoreConfig.bgColor },
                        ]}
                      >
                        <Text
                          style={[
                            styles.secondaryScoreValue,
                            { color: scoreConfig.color },
                          ]}
                        >
                          {score.value.toFixed(1)}
                        </Text>
                      </View>
                    </View>
                  </View>
                )
              })}
            </View>
          </View>
        )}

        {/* Pros */}
        {tastingNote.pros && (
          <View style={styles.textSection}>
            <Text style={styles.textLabel}>✅ Pontos Positivos</Text>
            <Text style={styles.textContent} numberOfLines={2}>
              {truncateText(tastingNote.pros, 100)}
            </Text>
          </View>
        )}

        {/* Cons */}
        {tastingNote.cons && (
          <View style={styles.textSection}>
            <Text style={styles.textLabel}>⚠️ Pontos Negativos</Text>
            <Text style={styles.textContent} numberOfLines={2}>
              {truncateText(tastingNote.cons, 100)}
            </Text>
          </View>
        )}

        {/* General Notes */}
        {tastingNote.generalNotes && (
          <View style={styles.textSection}>
            <Text style={styles.textLabel}>📝 Observações Gerais</Text>
            <Text style={styles.textContent} numberOfLines={2}>
              {truncateText(tastingNote.generalNotes, 100)}
            </Text>
          </View>
        )}
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        {onView && (
          <TouchableOpacity style={styles.actionButton} onPress={onView}>
            <IoMdEye size={16} color={COLORS.text.secondary} />
            <Text style={styles.actionButtonText}>Ver Detalhes</Text>
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
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.text.primary,
    flex: 1,
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
  date: {
    fontSize: 12,
    fontWeight: '500',
    color: COLORS.text.secondary,
  },
  content: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
  },
  overallScoreSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
  },
  overallScoreLeft: {
    flex: 1,
    gap: 6,
  },
  overallScoreLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.text.secondary,
  },
  overallScoreBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  overallScoreBadgeText: {
    fontSize: 11,
    fontWeight: '600',
  },
  overallScoreCircle: {
    width: 70,
    height: 70,
    borderRadius: 35,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  overallScoreValue: {
    fontSize: 28,
    fontWeight: '700',
  },
  secondaryScoresSection: {
    gap: 8,
  },
  secondaryScoresTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.text.secondary,
  },
  secondaryScoresGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  secondaryScoreItem: {
    flex: 1,
    minWidth: '45%',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: '#F9FAFB',
    borderRadius: 6,
  },
  secondaryScoreEmoji: {
    fontSize: 18,
  },
  secondaryScoreInfo: {
    flex: 1,
    gap: 3,
  },
  secondaryScoreLabel: {
    fontSize: 10,
    fontWeight: '600',
    color: COLORS.text.secondary,
  },
  secondaryScoreBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  secondaryScoreValue: {
    fontSize: 13,
    fontWeight: '700',
  },
  textSection: {
    gap: 4,
  },
  textLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.text.secondary,
  },
  textContent: {
    fontSize: 13,
    color: COLORS.text.primary,
    lineHeight: 18,
  },
  footer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: COLORS.border.light,
    flexDirection: 'row',
    gap: 12,
    flexWrap: 'wrap',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 4,
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: COLORS.text.secondary,
  },
  deleteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 4,
    marginLeft: 'auto',
  },
  deleteButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#EF4444',
  },
})
