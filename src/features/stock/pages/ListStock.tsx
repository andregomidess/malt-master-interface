import { View, StyleSheet, TouchableOpacity, ScrollView } from 'react-native'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router'
import { Layout } from '../../../shared/components/Layout'
import { Heading, Text } from '../../../shared/components/Typography'
import { InputText } from '../../../shared/components/InputText'
import { Pagination } from '../../../shared/components/Pagination'
import { COLORS } from '../../../shared/styles/colors'
import { BiPlus, BiSearch } from 'react-icons/bi'
import { StockStats } from '../components/StockStats'
import { StockCard } from '../components/StockCard'
import { useInventoryItemsPaginated } from '../hooks/useInventoryItemsPaginated'
import { useInventoryStats } from '../hooks/useInventoryStats'
import { InventoryItemType } from '../interfaces/inventory'

type FilterType = 'all' | InventoryItemType

export const ListStock = () => {
  const navigate = useNavigate()
  const [activeFilter, setActiveFilter] = useState<FilterType>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [currentPage, setCurrentPage] = useState(1)

  const {
    data: inventoryData,
    isLoading,
    isError,
    error,
  } = useInventoryItemsPaginated(currentPage, activeFilter, searchQuery)

  const items = inventoryData?.items || []
  const totalItems = inventoryData?.meta.total || 0
  const totalPages = inventoryData?.meta.totalPages || 1

  const {
    data: stats,
    isLoading: isLoadingStats,
    isError: isErrorStats,
  } = useInventoryStats()

  // Resetar para página 1 quando busca ou filtro mudar
  useEffect(() => {
    setCurrentPage(1)
  }, [searchQuery, activeFilter])

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
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
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

              {/* Componente de Paginação */}
              {totalPages > 1 && (
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  totalItems={totalItems}
                  itemsPerPage={20}
                  onPageChange={setCurrentPage}
                  itemLabel="item"
                  itemLabelPlural="itens"
                />
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
})
