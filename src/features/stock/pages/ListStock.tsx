import {
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from 'react-native'
import { useState, useRef, useCallback } from 'react'
import { useNavigate } from 'react-router'
import { Layout } from '../../../shared/components/Layout'
import { Heading, Text } from '../../../shared/components/Typography'
import { InputText } from '../../../shared/components/InputText'
import { COLORS } from '../../../shared/styles/colors'
import { BiPlus, BiSearch } from 'react-icons/bi'
import { StockStats } from '../components/StockStats'
import { StockCard } from '../components/StockCard'
import { useInfiniteInventoryItems } from '../hooks/useInfiniteInventoryItems'
import { useInventoryStats } from '../hooks/useInventoryStats'
import { InventoryItemType } from '../interfaces/inventory'

type FilterType = 'all' | InventoryItemType

export const ListStock = () => {
  const navigate = useNavigate()
  const [activeFilter, setActiveFilter] = useState<FilterType>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const scrollViewRef = useRef<ScrollView>(null)

  const {
    items,
    totalItems,
    isLoading,
    isError,
    error,
    fetchNextPage,
    hasMore,
    isFetchingNextPage,
  } = useInfiniteInventoryItems(activeFilter, searchQuery)

  const {
    data: stats,
    isLoading: isLoadingStats,
    isError: isErrorStats,
  } = useInventoryStats()

  const handleScroll = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      const { layoutMeasurement, contentOffset, contentSize } =
        event.nativeEvent
      const paddingToBottom = 20

      const isCloseToBottom =
        layoutMeasurement.height + contentOffset.y >=
        contentSize.height - paddingToBottom

      if (isCloseToBottom && hasMore && !isFetchingNextPage) {
        fetchNextPage()
      }
    },
    [hasMore, isFetchingNextPage, fetchNextPage],
  )

  const handleEdit = (itemId: string) => {
    navigate(`/stock/${itemId}/edit`)
  }

  const handleAddItem = () => {
    navigate('/stock/new')
  }

  const filters = [
    { id: 'all' as FilterType, label: 'Todos' },
    { id: InventoryItemType.FERMENTABLE as FilterType, label: 'Fermentáveis' },
    { id: InventoryItemType.HOP as FilterType, label: 'Lúpulos' },
    { id: InventoryItemType.YEAST as FilterType, label: 'Leveduras' },
  ]

  if (isError) {
    return (
      <Layout activeMenuItem="stock">
        <View style={styles.container}>
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>
              Erro ao carregar inventário: {error?.message}
            </Text>
          </View>
        </View>
      </Layout>
    )
  }

  return (
    <Layout activeMenuItem="stock">
      <View style={styles.container}>
        <View style={styles.header}>
          <Heading variant="h3" style={styles.title}>
            Meu Estoque
          </Heading>

          <TouchableOpacity style={styles.addButton} onPress={handleAddItem}>
            <BiPlus size={20} color={COLORS.neutral.white} />
            <Text style={styles.addButtonText}>Adicionar Item ao Estoque</Text>
          </TouchableOpacity>
        </View>

        {isLoadingStats ? (
          <View style={styles.loadingContainer}>
            <Text style={styles.loadingText}>Carregando estatísticas...</Text>
          </View>
        ) : isErrorStats ? (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>Erro ao carregar estatísticas</Text>
          </View>
        ) : stats ? (
          <StockStats
            totalItems={stats.totalItems}
            totalValue={stats.totalValue}
            itemsNearExpiry={stats.itemsNearExpiry}
            itemsExpired={stats.expiredItems}
          />
        ) : null}

        <View style={styles.filtersSection}>
          <View style={styles.filterTabs}>
            {filters.map(filter => (
              <TouchableOpacity
                key={filter.id}
                style={[
                  styles.filterTab,
                  activeFilter === filter.id && styles.filterTabActive,
                ]}
                onPress={() => setActiveFilter(filter.id)}
              >
                <Text
                  style={[
                    styles.filterTabText,
                    activeFilter === filter.id && styles.filterTabTextActive,
                  ]}
                >
                  {filter.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.searchContainer}>
            <View style={styles.searchIcon}>
              <BiSearch size={20} color={COLORS.text.secondary} />
            </View>
            <InputText
              placeholder="Buscar itens do estoque..."
              style={styles.searchInput}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>
        </View>

        <ScrollView
          ref={scrollViewRef}
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          onScroll={handleScroll}
          scrollEventThrottle={400}
        >
          {isLoading ? (
            <View style={styles.loadingContainer}>
              <Text style={styles.loadingText}>Carregando itens...</Text>
            </View>
          ) : items.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateText}>
                {searchQuery
                  ? 'Nenhum item encontrado para a busca.'
                  : 'Nenhum item nesta categoria.'}
              </Text>
            </View>
          ) : (
            <>
              <View style={styles.itemsGrid}>
                {items.map(item => (
                  <View key={item.id} style={styles.cardWrapper}>
                    <StockCard item={item} onEdit={() => handleEdit(item.id)} />
                  </View>
                ))}
              </View>

              {isFetchingNextPage && (
                <View style={styles.loadingMoreContainer}>
                  <Text style={styles.loadingText}>
                    Carregando mais itens...
                  </Text>
                </View>
              )}

              {!hasMore && items.length > 0 && (
                <View style={styles.endMessageContainer}>
                  <Text style={styles.endMessageText}>
                    {items.length} de {totalItems} itens carregados
                  </Text>
                </View>
              )}
            </>
          )}
        </ScrollView>
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
    gap: 12,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: COLORS.text.primary,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: COLORS.brand.primary,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 6,
    cursor: 'pointer',
  },
  addButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.neutral.white,
  },
  filtersSection: {
    gap: 16,
  },
  filterTabs: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
  },
  filterTab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: COLORS.border.light,
    backgroundColor: COLORS.neutral.white,
    cursor: 'pointer',
  },
  filterTabActive: {
    backgroundColor: COLORS.brand.primary,
    borderColor: COLORS.brand.primary,
  },
  filterTabText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text.secondary,
  },
  filterTabTextActive: {
    color: COLORS.neutral.white,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.neutral.white,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: COLORS.border.light,
    paddingHorizontal: 12,
    maxWidth: 400,
    width: '100%',
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    borderWidth: 0,
    backgroundColor: 'transparent',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 24,
  },
  itemsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  cardWrapper: {
    flex: 1,
    minWidth: 280,
    maxWidth: 350,
  },
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 48,
  },
  loadingText: {
    fontSize: 14,
    color: COLORS.text.secondary,
  },
  loadingMoreContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 24,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 48,
  },
  emptyStateText: {
    fontSize: 14,
    color: COLORS.text.secondary,
  },
  errorContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 48,
    paddingHorizontal: 24,
  },
  errorText: {
    fontSize: 14,
    color: '#EF4444',
    textAlign: 'center',
  },
  endMessageContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
  },
  endMessageText: {
    fontSize: 12,
    color: COLORS.text.secondary,
  },
})
