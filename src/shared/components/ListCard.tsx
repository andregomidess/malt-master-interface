import { View, StyleSheet, TouchableOpacity, Image } from 'react-native'
import { Text } from './Typography'
import { COLORS } from '../styles/colors'
import { MdEdit, MdDelete } from 'react-icons/md'

interface RecipeCardProps {
  title: string
  style: string
  lastModified: string
  imageUrl?: string
  badge?: string
  onEdit?: () => void
  onDelete?: () => void
}

export const ListCard = ({
  title,
  style: beerStyle,
  lastModified,
  imageUrl,
  badge,
  onEdit,
  onDelete,
}: RecipeCardProps) => {
  const defaultImageUrl =
    'https://images.unsplash.com/photo-1535958636474-b021ee887b13?w=100&h=100&fit=crop'

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Image
          source={{ uri: imageUrl || defaultImageUrl }}
          style={styles.image}
        />
        <View style={styles.titleRow}>
          <Text style={styles.title}>{title}</Text>
          {badge ? (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{badge}</Text>
            </View>
          ) : null}
        </View>
      </View>

      <View style={styles.content}>
        <View style={styles.infoRow}>
          <Text style={styles.label}>Estilo:</Text>
          <Text style={styles.value}>{beerStyle}</Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.label}>Última Modificação:</Text>
          <Text style={styles.value}>{lastModified}</Text>
        </View>
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
    alignItems: 'center',
    backgroundColor: COLORS.neutral.white,
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border.light,
    gap: 12,
  },
  image: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.neutral.gray[200],
  },
  titleRow: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: 8,
  },
  title: {
    flexShrink: 1,
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.text.primary,
  },
  badge: {
    backgroundColor: COLORS.neutral.gray[200],
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    alignSelf: 'flex-start',
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '600',
    color: COLORS.text.secondary,
  },
  content: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 8,
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
