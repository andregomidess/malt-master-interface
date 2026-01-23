import {
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from 'react-native'
import { useState, useMemo, useEffect } from 'react'
import { useNavigate } from 'react-router'
import { Layout } from '../../../shared/components/Layout'
import { Heading, Text } from '../../../shared/components/Typography'
import { InputText } from '../../../shared/components/InputText'
import { Pagination } from '../../../shared/components/Pagination'
import { COLORS } from '../../../shared/styles/colors'
import { BiPlus, BiSearch } from 'react-icons/bi'
import { MdSort } from 'react-icons/md'
import { FermentableStats } from '../components/FermentableStats'
import { FermentableCard } from '../components/FermentableCard'
import { useFermentablesPaginated } from '../hooks/useFermentablesPaginated'
import { useDeleteFermentable } from '../hooks/useDeleteFermentable'
import {
  FermentableType,
  FermentableSortBy,
  SortOrder,
} from '../interfaces/Fermentable'
import {
  calculateFermentableStats,
  filterFermentablesByType,
} from '../data/mockFermentablesData'

type FilterType = 'all' | FermentableType
type SortByOption = 'name' | 'color' | 'yield' | 'type'

export const ListFermentable = () => {
  const navigate = useNavigate()
  const [activeFilter, setActiveFilter] = useState<FilterType>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState<SortByOption>('name')
  const [showSortMenu, setShowSortMenu] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const order = SortOrder.DESC

  const mapSortByToBackend = (sort: string): FermentableSortBy => {
    switch (sort) {
      case 'name':
        return FermentableSortBy.NAME
      case 'color':
        return FermentableSortBy.COLOR
      case 'yield':
        return FermentableSortBy.YIELD
      case 'type':
        return FermentableSortBy.TYPE
      default:
        return FermentableSortBy.NAME
    }
  }

  const {
    data: fermentablesData,
    isLoading,
    error,
  } = useFermentablesPaginated(
    currentPage,
    searchQuery,
    mapSortByToBackend(sortBy),
    order,
  )

  const fermentables = useMemo(
    () => fermentablesData?.data || [],
    [fermentablesData?.data],
  )
  const totalItems = fermentablesData?.total || 0
  const totalPages = fermentablesData?.totalPages || 1

  const { deleteFermentable } = useDeleteFermentable()

  // Filtrar por tipo no front-end
  const filteredFermentables = useMemo(() => {
    return filterFermentablesByType(fermentables, activeFilter)
  }, [fermentables, activeFilter])

  // Calcular estatísticas
  const stats = useMemo(
    () => calculateFermentableStats(fermentables),
    [fermentables],
  )

  // Resetar para página 1 quando busca, filtro ou ordenação mudar
  useEffect(() => {
    setCurrentPage(1)
  }, [searchQuery, activeFilter, sortBy])

  const handleEdit = (fermentableId: string) => {
    navigate(`/fermentable/${fermentableId}/edit`)
  }

  const handleAddFermentable = () => {
    navigate('/fermentable/new')
  }

  const handleDelete = async (id: string) => {
    if (confirm('Tem certeza que deseja deletar este fermentável?')) {
      try {
        await deleteFermentable(id)
        alert('Fermentável deletado com sucesso!')
      } catch {
        alert('Erro ao deletar fermentável')
      }
    }
  }

  const filters = [
    { id: 'all' as FilterType, label: 'Todos' },
    { id: FermentableType.BASE as FilterType, label: 'Maltes Base' },
    { id: FermentableType.SPECIALTY as FilterType, label: 'Maltes Especiais' },
    { id: FermentableType.SUGAR as FilterType, label: 'Açúcares' },
    { id: FermentableType.ADJUNCT as FilterType, label: 'Adjuntos' },
  ]

  const sortOptions: { id: SortByOption; label: string }[] = [
    { id: 'name', label: 'Nome' },
    { id: 'color', label: 'Cor (Claro → Escuro)' },
    { id: 'yield', label: 'Rendimento' },
    { id: 'type', label: 'Tipo' },
  ]

  const sortLabels: Record<SortByOption, string> = {
    name: 'Nome',
    color: 'Cor',
    yield: 'Rendimento',
    type: 'Tipo',
  }

  return (
    <Layout activeMenuItem="fermentable">
      <View style={styles.container}>
        <View style={styles.header}>
          <Heading variant="h3" style={styles.title}>
            Catálogo de Fermentáveis
          </Heading>

          <TouchableOpacity
            style={styles.addButton}
            onPress={handleAddFermentable}
          >
            <BiPlus size={20} color={COLORS.neutral.white} />
            <Text style={styles.addButtonText}>Adicionar Fermentável</Text>
          </TouchableOpacity>
        </View>

        <FermentableStats
          totalFermentables={stats.totalFermentables}
          baseMalts={stats.baseMalts}
          specialtyMalts={stats.specialtyMalts}
          sugarsAndAdjuncts={stats.sugarsAndAdjuncts}
        />

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

          <View style={styles.searchAndSortRow}>
            <View style={styles.searchContainer}>
              <View style={styles.searchIcon}>
                <BiSearch size={20} color={COLORS.text.secondary} />
              </View>
              <InputText
                placeholder="Buscar fermentáveis..."
                style={styles.searchInput}
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
            </View>

            <View style={styles.sortContainer}>
              <TouchableOpacity
                style={styles.sortButton}
                onPress={() => setShowSortMenu(!showSortMenu)}
              >
                <MdSort size={20} color={COLORS.text.secondary} />
                <Text style={styles.sortButtonText}>
                  Ordenar: {sortLabels[sortBy]}
                </Text>
              </TouchableOpacity>

              {showSortMenu && (
                <View style={styles.sortMenu}>
                  {sortOptions.map(option => (
                    <TouchableOpacity
                      key={option.id}
                      style={[
                        styles.sortOption,
                        sortBy === option.id && styles.sortOptionActive,
                      ]}
                      onPress={() => {
                        setSortBy(option.id)
                        setShowSortMenu(false)
                      }}
                    >
                      <Text
                        style={[
                          styles.sortOptionText,
                          sortBy === option.id && styles.sortOptionTextActive,
                        ]}
                      >
                        {option.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>
          </View>
        </View>

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
        >
          {isLoading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={COLORS.brand.primary} />
              <Text style={styles.loadingText}>Carregando fermentáveis...</Text>
            </View>
          ) : error ? (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>
                Erro ao carregar fermentáveis: {error.message}
              </Text>
            </View>
          ) : filteredFermentables.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateText}>
                {searchQuery
                  ? 'Nenhum fermentável encontrado para a busca.'
                  : 'Nenhum fermentável nesta categoria.'}
              </Text>
            </View>
          ) : (
            <>
              <View style={styles.fermentablesGrid}>
                {filteredFermentables.map(fermentable => (
                  <View key={fermentable.id} style={styles.cardWrapper}>
                    <FermentableCard
                      fermentable={fermentable}
                      onEdit={
                        fermentable.user
                          ? () => handleEdit(fermentable.id)
                          : undefined
                      }
                      onDelete={
                        fermentable.user
                          ? () => handleDelete(fermentable.id)
                          : undefined
                      }
                      onUseAsBase={
                        !fermentable.user
                          ? () =>
                              navigate(
                                `/fermentable/new?base=${fermentable.id}`,
                              )
                          : undefined
                      }
                    />
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
                  itemLabel="fermentável"
                  itemLabelPlural="fermentáveis"
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
  searchAndSortRow: {
    flexDirection: 'row',
    gap: 12,
    flexWrap: 'wrap',
  },
  searchContainer: {
    flex: 1,
    minWidth: 250,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.neutral.white,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: COLORS.border.light,
    paddingHorizontal: 12,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    borderWidth: 0,
    backgroundColor: 'transparent',
  },
  sortContainer: {
    position: 'relative',
  },
  sortButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: COLORS.border.light,
    backgroundColor: COLORS.neutral.white,
    cursor: 'pointer',
  },
  sortButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: COLORS.text.secondary,
  },
  sortMenu: {
    position: 'absolute',
    top: 48,
    right: 0,
    backgroundColor: COLORS.neutral.white,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: COLORS.border.light,
    minWidth: 200,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    zIndex: 1000,
  },
  sortOption: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    cursor: 'pointer',
  },
  sortOptionActive: {
    backgroundColor: COLORS.brand.primary + '10',
  },
  sortOptionText: {
    fontSize: 14,
    fontWeight: '500',
    color: COLORS.text.secondary,
  },
  sortOptionTextActive: {
    color: COLORS.brand.primary,
    fontWeight: '600',
  },
  fermentablesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    alignItems: 'stretch',
    justifyContent: 'flex-start',
  },
  cardWrapper: {
    flex: 1,
    minWidth: 300,
    maxWidth: 300,
    height: 650,
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
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 24,
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
