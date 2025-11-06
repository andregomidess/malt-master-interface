import {
  View,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native'
import { useState } from 'react'
import { Layout } from '../../../shared/components/Layout'
import { Heading, Text } from '../../../shared/components/Typography'
import { InputText } from '../../../shared/components/InputText'
import { COLORS } from '../../../shared/styles/colors'
import { BiPlus, BiSearch } from 'react-icons/bi'
import { MdSort } from 'react-icons/md'
import { BeerStyleCard } from '../components/BeerStyleCard'
import { BeerStyleStats } from '../components/BeerStyleStats'
import { useBeerStyles } from '../hooks/useBeerStyles'
import { useDeleteBeerStyle } from '../hooks/useDeleteBeerStyle'
import {
  filterByCategory,
  searchStyles,
  sortStyles,
  calculateBeerStyleStats,
  BeerStyleCategory,
  BeerStyleSortBy,
} from '../data/mockBeerStylesData'

export const ListBeerStyle = () => {
  const { beerStyles, isLoading, refetch } = useBeerStyles()
  const { deleteStyle } = useDeleteBeerStyle()

  const [activeFilter, setActiveFilter] = useState<BeerStyleCategory>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState<BeerStyleSortBy>('name')

  // Calcular estatísticas
  const stats = calculateBeerStyleStats(beerStyles)

  // Aplicar filtros, busca e ordenação
  let filteredStyles = filterByCategory(beerStyles, activeFilter)
  if (searchQuery) {
    filteredStyles = searchStyles(filteredStyles, searchQuery)
  }
  filteredStyles = sortStyles(filteredStyles, sortBy)

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
  const sortOptions: Array<{ id: BeerStyleSortBy; label: string }> = [
    { id: 'name', label: 'Nome' },
    { id: 'abv', label: 'ABV' },
    { id: 'ibu', label: 'IBU' },
    { id: 'color', label: 'Cor' },
  ]

  const handleDelete = async (id: string) => {
    if (confirm('Tem certeza que deseja deletar este estilo?')) {
      try {
        await deleteStyle(id)
        await refetch()
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
          <TouchableOpacity style={styles.addButton}>
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
        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={COLORS.brand.primary} />
            <Text style={styles.loadingText}>Carregando estilos...</Text>
          </View>
        ) : (
          <View style={styles.stylesGrid}>
            {filteredStyles.map(style => (
              <View key={style.id} style={styles.styleCardWrapper}>
                <BeerStyleCard
                  beerStyle={style}
                  onView={() => console.log('Ver detalhes:', style.id)}
                  onEdit={() => console.log('Editar:', style.id)}
                  onDelete={() => handleDelete(style.id)}
                />
              </View>
            ))}
          </View>
        )}

        {/* Empty State */}
        {filteredStyles.length === 0 && !isLoading && (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>
              Nenhum estilo encontrado com os filtros selecionados
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
})
