import {
  View,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  ScrollView,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from 'react-native'
import { useState, useCallback } from 'react'
import { useNavigate } from 'react-router'
import { Layout } from '../../../shared/components/Layout'
import { Heading, Text } from '../../../shared/components/Typography'
import { InputText } from '../../../shared/components/InputText'
import { COLORS } from '../../../shared/styles/colors'
import { BiPlus, BiSearch } from 'react-icons/bi'
import { MdSort, MdRefresh } from 'react-icons/md'
import { BatchCard } from '../components/BatchCard'
import {
  BatchStatus,
  BatchSortBy,
  SortOrder,
  BatchStatusLabels,
} from '../interfaces/Brewing'
import { useBatchesList } from '../hooks/useBatchesList'
import { useDeleteBatch } from '../hooks/useDeleteBatch'
import toast from 'react-hot-toast'

export const ListBrewing = () => {
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState('')
  const [activeFilter, setActiveFilter] = useState<BatchStatus | 'all'>('all')
  const [sortBy, setSortBy] = useState<BatchSortBy>(BatchSortBy.BREW_DATE)
  const [order, setOrder] = useState<SortOrder>(SortOrder.DESC)

  const {
    batches,
    isLoading,
    isFetchingNextPage,
    hasNextPage,
    error,
    refetch,
  } = useBatchesList(
    searchQuery,
    activeFilter === 'all' ? undefined : activeFilter,
    sortBy,
    order,
  )

  const { deleteBatch } = useDeleteBatch()

  const handleDelete = async (id: string) => {
    if (confirm('Tem certeza que deseja deletar esta brassagem?')) {
      try {
        await deleteBatch(id)
        toast.success('Brassagem deletada com sucesso!')
        await refetch()
      } catch {
        toast.error('Erro ao deletar brassagem')
        await refetch()
      }
    }
  }

  const handleScroll = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      const { layoutMeasurement, contentOffset, contentSize } =
        event.nativeEvent
      const isCloseToBottom =
        layoutMeasurement.height + contentOffset.y >= contentSize.height - 50
      if (isCloseToBottom && hasNextPage && !isFetchingNextPage) {
        // fetchNextPage()
      }
    },
    [hasNextPage, isFetchingNextPage],
  )

  const handleRefresh = async () => {
    await refetch()
  }

  const renderErrorState = () => (
    <View style={styles.errorState}>
      <Text style={styles.errorText}>Erro ao carregar brassagens</Text>
      <TouchableOpacity style={styles.retryButton} onPress={handleRefresh}>
        <MdRefresh size={16} color={COLORS.neutral.white} />
        <Text style={styles.retryButtonText}>Tentar Novamente</Text>
      </TouchableOpacity>
    </View>
  )

  const statusOptions: Array<{ id: BatchStatus | 'all'; label: string }> = [
    { id: 'all', label: 'Todas' },
    { id: 'planned', label: BatchStatusLabels.planned },
    { id: 'fermenting', label: BatchStatusLabels.fermenting },
    { id: 'maturing', label: BatchStatusLabels.maturing },
    { id: 'packaged', label: BatchStatusLabels.packaged },
    { id: 'completed', label: BatchStatusLabels.completed },
  ]

  const sortOptions: Array<{ id: BatchSortBy; label: string }> = [
    { id: BatchSortBy.BREW_DATE, label: 'Data de Brassagem' },
    { id: BatchSortBy.NAME, label: 'Nome' },
    { id: BatchSortBy.STATUS, label: 'Status' },
    { id: BatchSortBy.PACKAGING_DATE, label: 'Data de Envasamento' },
    { id: BatchSortBy.READY_DATE, label: 'Data de Pronto' },
  ]

  return (
    <Layout activeMenuItem="brewings">
      <View style={styles.container}>
        <View style={styles.header}>
          <Heading variant="h3" style={styles.title}>
            Brassagens
          </Heading>
          <TouchableOpacity
            style={styles.createButton}
            onPress={() => navigate('/brewings/new')}
          >
            <BiPlus size={20} color={COLORS.neutral.white} />
            <Text style={styles.createButtonText}>Nova Brassagem</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.filtersRow}>
          <View style={styles.tabs}>
            {statusOptions.map(filter => (
              <TouchableOpacity
                key={filter.id}
                style={[
                  styles.tab,
                  activeFilter === filter.id && styles.tabActive,
                ]}
                onPress={() => setActiveFilter(filter.id)}
              >
                <Text
                  style={[
                    styles.tabText,
                    activeFilter === filter.id && styles.tabTextActive,
                  ]}
                >
                  {filter.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.searchAndSortRow}>
          <View style={styles.searchContainer}>
            <BiSearch size={20} color={COLORS.text.secondary} />
            <InputText
              placeholder="Buscar por nome, código ou receita..."
              value={searchQuery}
              onChangeText={setSearchQuery}
              style={styles.searchInput}
            />
          </View>

          <View style={styles.sortContainer}>
            <MdSort size={20} color={COLORS.text.secondary} />
            <Text style={styles.sortLabel}>Ordenar:</Text>
            <View style={styles.sortButtons}>
              {sortOptions.map(option => (
                <TouchableOpacity
                  key={option.id}
                  style={[
                    styles.sortButton,
                    sortBy === option.id && styles.sortButtonActive,
                  ]}
                  onPress={() => setSortBy(option.id)}
                >
                  <Text
                    style={[
                      styles.sortButtonText,
                      sortBy === option.id && styles.sortButtonTextActive,
                    ]}
                  >
                    {option.label}
                  </Text>
                </TouchableOpacity>
              ))}
              <TouchableOpacity
                style={[
                  styles.sortButton,
                  order === SortOrder.ASC && styles.sortButtonActive,
                ]}
                onPress={() =>
                  setOrder(
                    order === SortOrder.ASC ? SortOrder.DESC : SortOrder.ASC,
                  )
                }
              >
                <Text
                  style={[
                    styles.sortButtonText,
                    order === SortOrder.ASC && styles.sortButtonTextActive,
                  ]}
                >
                  {order === SortOrder.ASC ? 'ASC' : 'DESC'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={COLORS.brand.primary} />
            <Text style={styles.loadingText}>Carregando brassagens...</Text>
          </View>
        ) : error ? (
          renderErrorState()
        ) : (
          <ScrollView
            onScroll={handleScroll}
            scrollEventThrottle={400}
            contentContainerStyle={styles.scrollViewContent}
          >
            <View style={styles.batchesList}>
              {batches
                .filter(item => item != null && item.id != null)
                .map(item => (
                  <BatchCard
                    key={item.id}
                    batch={item}
                    onPress={() => navigate(`/brewings/${item.id}/edit`)}
                    onDelete={() => handleDelete(item.id)}
                    onStartSession={() =>
                      navigate(`/brewings/${item.id}/session`)
                    }
                  />
                ))}
            </View>
            {isFetchingNextPage && (
              <ActivityIndicator
                size="small"
                color={COLORS.brand.primary}
                style={styles.loadingMoreIndicator}
              />
            )}
          </ScrollView>
        )}

        {batches.length === 0 && !isLoading && !error && (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>
              Nenhuma brassagem encontrada com os filtros selecionados
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
  createButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: COLORS.brand.primary,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    cursor: 'pointer',
  },
  createButtonText: {
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
    cursor: 'pointer',
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
  searchAndSortRow: {
    gap: 16,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: COLORS.neutral.white,
    borderWidth: 1,
    borderColor: COLORS.border.light,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: COLORS.text.primary,
    borderWidth: 0,
    paddingHorizontal: 0,
    paddingVertical: 0,
    backgroundColor: 'transparent',
  },
  sortContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flexWrap: 'wrap',
  },
  sortLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text.secondary,
  },
  sortButtons: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
  },
  sortButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    backgroundColor: COLORS.neutral.white,
    borderWidth: 1,
    borderColor: COLORS.border.light,
    cursor: 'pointer',
  },
  sortButtonActive: {
    backgroundColor: COLORS.brand.primary,
    borderColor: COLORS.brand.primary,
  },
  sortButtonText: {
    fontSize: 13,
    fontWeight: '500',
    color: COLORS.text.secondary,
  },
  sortButtonTextActive: {
    color: COLORS.neutral.white,
    fontWeight: '600',
  },
  scrollViewContent: {
    paddingBottom: 20,
  },
  batchesList: {
    gap: 16,
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
  loadingMoreIndicator: {
    marginTop: 20,
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
