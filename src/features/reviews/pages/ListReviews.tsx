import {
  View,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native'
import { useState } from 'react'
import { Layout } from '../../../shared/components/Layout'
import { Heading, Text } from '../../../shared/components/Typography'
import { COLORS } from '../../../shared/styles/colors'
import { TastingNoteCard } from '../components/TastingNoteCard'
import { TastingNoteStats } from '../components/TastingNoteStats'
import { useTastingNotes } from '../hooks/useTastingNotes'
import { useTastingNoteStats } from '../hooks/useTastingNoteStats'
import { useDeleteTastingNote } from '../hooks/useDeleteTastingNote'
import { BiPlus } from 'react-icons/bi'
import { MdRefresh } from 'react-icons/md'

export const ListReviews = () => {
  const { tastingNotes, isLoading, error, refetch } = useTastingNotes()
  const {
    statistics,
    isLoading: isLoadingStats,
    refetch: refetchStats,
  } = useTastingNoteStats()
  const { deleteNote } = useDeleteTastingNote()

  const [searchQuery] = useState('')
  const [filterScore, setFilterScore] = useState<
    'all' | 'high' | 'medium' | 'low'
  >('all')

  // Filtrar notas
  const filteredNotes = tastingNotes.filter(note => {
    const batchName =
      note.batch.name ||
      note.batch.batchCode ||
      `Lote #${note.batch.id.slice(0, 8)}`

    const matchesSearch = batchName
      .toLowerCase()
      .includes(searchQuery.toLowerCase())

    const matchesFilter =
      filterScore === 'all' ||
      (filterScore === 'high' && note.overallScore >= 8) ||
      (filterScore === 'medium' &&
        note.overallScore >= 5 &&
        note.overallScore < 8) ||
      (filterScore === 'low' && note.overallScore < 5)

    return matchesSearch && matchesFilter
  })

  const handleDelete = async (id: string) => {
    // Aqui você pode adicionar um modal de confirmação
    if (confirm('Tem certeza que deseja deletar esta avaliação?')) {
      try {
        await deleteNote(id)
        await refetch()
        await refetchStats()
        alert('Avaliação deletada com sucesso!')
      } catch {
        alert('Erro ao deletar avaliação')
      }
    }
  }

  const handleRefresh = async () => {
    await Promise.all([refetch(), refetchStats()])
  }

  const renderErrorState = () => (
    <View style={styles.errorState}>
      <Text style={styles.errorText}>Erro ao carregar avaliações</Text>
      <TouchableOpacity style={styles.retryButton} onPress={handleRefresh}>
        <MdRefresh size={16} color={COLORS.neutral.white} />
        <Text style={styles.retryButtonText}>Tentar Novamente</Text>
      </TouchableOpacity>
    </View>
  )

  return (
    <Layout activeMenuItem="reviews">
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Heading variant="h3" style={styles.title}>
            Avaliações de Degustação
          </Heading>
          <TouchableOpacity style={styles.addButton}>
            <BiPlus size={20} color={COLORS.neutral.white} />
            <Text style={styles.addButtonText}>Nova Avaliação</Text>
          </TouchableOpacity>
        </View>

        {/* Statistics */}
        {!isLoadingStats && <TastingNoteStats statistics={statistics} />}

        {/* Filters */}
        <View style={styles.filtersRow}>
          <View style={styles.tabs}>
            <TouchableOpacity
              style={[styles.tab, filterScore === 'all' && styles.tabActive]}
              onPress={() => setFilterScore('all')}
            >
              <Text
                style={[
                  styles.tabText,
                  filterScore === 'all' && styles.tabTextActive,
                ]}
              >
                Todas
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.tab, filterScore === 'high' && styles.tabActive]}
              onPress={() => setFilterScore('high')}
            >
              <Text
                style={[
                  styles.tabText,
                  filterScore === 'high' && styles.tabTextActive,
                ]}
              >
                Excelente (8-10)
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.tab, filterScore === 'medium' && styles.tabActive]}
              onPress={() => setFilterScore('medium')}
            >
              <Text
                style={[
                  styles.tabText,
                  filterScore === 'medium' && styles.tabTextActive,
                ]}
              >
                Bom (5-7.9)
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.tab, filterScore === 'low' && styles.tabActive]}
              onPress={() => setFilterScore('low')}
            >
              <Text
                style={[
                  styles.tabText,
                  filterScore === 'low' && styles.tabTextActive,
                ]}
              >
                Regular (&lt;5)
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Content */}
        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={COLORS.brand.primary} />
            <Text style={styles.loadingText}>Carregando avaliações...</Text>
          </View>
        ) : error ? (
          renderErrorState()
        ) : (
          <View style={styles.notesGrid}>
            {filteredNotes.map(note => (
              <View key={note.id} style={styles.noteCardWrapper}>
                <TastingNoteCard
                  tastingNote={note}
                  onView={() => console.log('Ver detalhes:', note.id)}
                  onEdit={() => console.log('Editar:', note.id)}
                  onDelete={() => handleDelete(note.id)}
                />
              </View>
            ))}
          </View>
        )}

        {filteredNotes.length === 0 && !isLoading && !error && (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>
              {searchQuery || filterScore !== 'all'
                ? 'Nenhuma avaliação encontrada com os filtros selecionados'
                : 'Nenhuma avaliação cadastrada ainda'}
            </Text>
          </View>
        )}
      </View>
    </Layout>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: 24,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: COLORS.text.primary,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: COLORS.brand.primary,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
  addButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.neutral.white,
  },
  filtersRow: {
    gap: 16,
  },
  tabs: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
  },
  tab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: COLORS.neutral.white,
    borderWidth: 1,
    borderColor: COLORS.border.light,
  },
  tabActive: {
    backgroundColor: COLORS.brand.primary,
    borderColor: COLORS.brand.primary,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '500',
    color: COLORS.text.secondary,
  },
  tabTextActive: {
    color: COLORS.neutral.white,
    fontWeight: '600',
  },
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    gap: 12,
  },
  loadingText: {
    fontSize: 14,
    color: COLORS.text.secondary,
  },
  notesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 20,
  },
  noteCardWrapper: {
    flex: 1,
    minWidth: 320,
    maxWidth: 420,
  },
  emptyState: {
    paddingVertical: 60,
    alignItems: 'center',
  },
  emptyStateText: {
    fontSize: 16,
    color: COLORS.text.secondary,
    textAlign: 'center',
  },
  errorState: {
    backgroundColor: COLORS.neutral.white,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.border.light,
    padding: 48,
    alignItems: 'center',
    gap: 16,
  },
  errorText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.status.error,
  },
  retryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: COLORS.brand.primary,
    borderRadius: 8,
  },
  retryButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.neutral.white,
  },
})
