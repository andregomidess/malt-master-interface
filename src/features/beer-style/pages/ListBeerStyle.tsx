import {
  View,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  ScrollView,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from 'react-native'
import { useState, useCallback, useMemo } from 'react'
import { useNavigate } from 'react-router'
import { Layout } from '../../../shared/components/Layout'
import { Heading, Text } from '../../../shared/components/Typography'
import { InputText } from '../../../shared/components/InputText'
import { COLORS } from '../../../shared/styles/colors'
import { BiPlus, BiSearch } from 'react-icons/bi'
import { MdSort } from 'react-icons/md'
import { BeerStyleCard } from '../components/BeerStyleCard'
import { BeerStyleStats } from '../components/BeerStyleStats'
import { useBeerStylesList } from '../hooks/useBeerStyles'
import { useDeleteBeerStyle } from '../hooks/useDeleteBeerStyle'
import {
  calculateBeerStyleStats,
  BeerStyleCategory,
} from '../data/mockBeerStylesData'
import { BeerStyleSortBy, SortOrder } from '../interfaces/BeerStyle'

type SortByOption = 'name' | 'category' | 'date'

export const ListBeerStyle = () => {
  const navigate = useNavigate()
  const [activeFilter, setActiveFilter] = useState<BeerStyleCategory>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState<SortByOption>('name')
  const order = SortOrder.DESC

  const mapSortByToBackend = (sort: string): BeerStyleSortBy => {
    switch (sort) {
      case 'name':
        return BeerStyleSortBy.NAME
      case 'category':
        return BeerStyleSortBy.CATEGORY
      case 'date':
        return BeerStyleSortBy.CREATED_AT
      default:
        return BeerStyleSortBy.NAME
    }
  }

  const {
    beerStyles,
    isLoading,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useBeerStylesList(searchQuery, mapSortByToBackend(sortBy), order)

  const { deleteStyle } = useDeleteBeerStyle()

  // Filtrar por categoria no front-end (já que o backend não suporta filtro por categoria ainda)
  const filteredStyles = useMemo(() => {
    if (activeFilter === 'all') return beerStyles
    return beerStyles.filter(style => {
      if (activeFilter === 'Ale') return style.category === 'Ale'
      if (activeFilter === 'Lager') return style.category === 'Lager'
      if (activeFilter === 'Selvagem')
        return style.subCategory?.includes('Sour')
      return true
    })
  }, [beerStyles, activeFilter])

  // Calcular estatísticas
  const stats = useMemo(() => calculateBeerStyleStats(beerStyles), [beerStyles])

  const handleScroll = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      const { layoutMeasurement, contentOffset, contentSize } =
        event.nativeEvent
      const paddingToBottom = 20

      const isCloseToBottom =
        layoutMeasurement.height + contentOffset.y >=
        contentSize.height - paddingToBottom

      if (isCloseToBottom && hasNextPage && !isFetchingNextPage) {
        fetchNextPage()
      }
    },
    [hasNextPage, isFetchingNextPage, fetchNextPage],
  )

  // Filtros
  const filters: Array<{
    id: BeerStyleCategory
    label: string
  }> = [
    { id: 'all', label: 'Todos' },
    { id: 'Ale', label: 'Ales' },
    { id: 'Lager', label: 'Lagers' },
    { id: 'Selvagem', label: 'Selvagens' },
  ]

  // Opções de ordenação
  const sortOptions: Array<{ id: SortByOption; label: string }> = [
    { id: 'name', label: 'Nome' },
    { id: 'category', label: 'Categoria' },
    { id: 'date', label: 'Data' },
  ]

  const handleDelete = async (id: string) => {
    if (confirm('Tem certeza que deseja deletar este estilo?')) {
      try {
        await deleteStyle(id)
        alert('Estilo deletado com sucesso!')
      } catch {
        alert('Erro ao deletar estilo')
      }
    }
  }

  return (
    <Layout activeMenuItem="beer-styles">
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Heading variant="h3" style={styles.title}>
            Catálogo de Estilos de Cerveja
          </Heading>
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => navigate('/beer-styles/new')}
          >
            <BiPlus size={20} color={COLORS.neutral.white} />
            <Text style={styles.addButtonText}>Adicionar Estilo</Text>
          </TouchableOpacity>
        </View>

        {/* Statistics */}
        {!isLoading && (
          <BeerStyleStats
            total={stats.total}
            ales={stats.ales}
            lagers={stats.lagers}
            sours={stats.sours}
          />
        )}

        {/* Filters */}
        <View style={styles.filtersRow}>
          <View style={styles.tabs}>
            {filters.map(filter => (
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

        {/* Search and Sort */}
        <View style={styles.searchAndSortRow}>
          <View style={styles.searchContainer}>
            <BiSearch size={20} color={COLORS.text.secondary} />
            <InputText
              placeholder="Buscar por nome, categoria ou tags..."
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
            </View>
          </View>
        </View>

        {/* Content */}
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          onScroll={handleScroll}
          scrollEventThrottle={400}
        >
          {isLoading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={COLORS.brand.primary} />
              <Text style={styles.loadingText}>Carregando estilos...</Text>
            </View>
          ) : error ? (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>
                Erro ao carregar estilos: {error.message}
              </Text>
            </View>
          ) : filteredStyles.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateText}>
                {searchQuery
                  ? 'Nenhum estilo encontrado para a busca.'
                  : 'Nenhum estilo encontrado com os filtros selecionados'}
              </Text>
            </View>
          ) : (
            <>
              <View style={styles.stylesGrid}>
                {filteredStyles.map(style => (
                  <View key={style.id} style={styles.styleCardWrapper}>
                    <BeerStyleCard
                      beerStyle={style}
                      onView={() => console.log('Ver detalhes:', style.id)}
                      onEdit={() => navigate(`/beer-styles/${style.id}/edit`)}
                      onDelete={() => handleDelete(style.id)}
                    />
                  </View>
                ))}
              </View>

              {isFetchingNextPage && (
                <View style={styles.loadingMoreContainer}>
                  <Text style={styles.loadingText}>
                    Carregando mais estilos...
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
  stylesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 20,
  },
  styleCardWrapper: {
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
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 24,
  },
  loadingMoreContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 24,
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
