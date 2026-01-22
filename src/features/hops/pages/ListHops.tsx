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
import { HopStats } from '../components/HopStats'
import { HopCard } from '../components/HopCard'
import { useHopsPaginated } from '../hooks/useHopsPaginated'
import { useDeleteHop } from '../hooks/useDeleteHop'
import { HopUse, HopSortBy, SortOrder } from '../interfaces/Hop'
import { calculateHopStats, filterHopsByUse } from '../helpers/hopHelpers'

type FilterType = 'all' | HopUse
type SortByOption = 'name' | 'alphaAcids' | 'cost' | 'origin'

export const ListHops = () => {
  const navigate = useNavigate()
  const [activeFilter, setActiveFilter] = useState<FilterType>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState<SortByOption>('name')
  const [showSortMenu, setShowSortMenu] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const order = SortOrder.DESC

  const mapSortByToBackend = (sort: string): HopSortBy => {
    switch (sort) {
      case 'name':
        return HopSortBy.NAME
      case 'alphaAcids':
        return HopSortBy.ALPHA_ACIDS
      case 'cost':
        return HopSortBy.COST
      case 'origin':
        return HopSortBy.NAME // Backend não tem origem como sort, usar nome
      default:
        return HopSortBy.NAME
    }
  }

  const {
    data: hopsData,
    isLoading,
    error,
  } = useHopsPaginated(
    currentPage,
    searchQuery,
    mapSortByToBackend(sortBy),
    order,
  )

  const hops = useMemo(() => hopsData?.data || [], [hopsData?.data])
  const totalItems = hopsData?.total || 0
  const totalPages = hopsData?.totalPages || 1

  const { deleteHop } = useDeleteHop()

  const filteredHops = useMemo(() => {
    return filterHopsByUse(hops, activeFilter)
  }, [hops, activeFilter])

  const stats = useMemo(() => calculateHopStats(hops), [hops])

  useEffect(() => {
    setCurrentPage(1)
  }, [searchQuery, activeFilter, sortBy])

  const handleEdit = (hopId: string) => {
    navigate(`/hops/${hopId}/edit`)
  }

  const handleAddHop = () => {
    navigate('/hops/new')
  }

  const handleDelete = async (id: string) => {
    if (confirm('Tem certeza que deseja deletar este lúpulo?')) {
      try {
        await deleteHop(id)
        alert('Lúpulo deletado com sucesso!')
      } catch {
        alert('Erro ao deletar lúpulo')
      }
    }
  }

  const filters = [
    { id: 'all' as FilterType, label: 'Todos' },
    { id: HopUse.BITTERING as FilterType, label: 'Amargor' },
    { id: HopUse.AROMA as FilterType, label: 'Aroma' },
    { id: HopUse.DRY_HOPPING as FilterType, label: 'Dry Hopping' },
    { id: HopUse.DUAL_PURPOSE as FilterType, label: 'Duplo Propósito' },
  ]

  const sortOptions: { id: SortByOption; label: string }[] = [
    { id: 'name', label: 'Nome' },
    { id: 'alphaAcids', label: 'Alfa Ácidos' },
    { id: 'cost', label: 'Custo' },
    { id: 'origin', label: 'Origem' },
  ]

  const sortLabels: Record<SortByOption, string> = {
    name: 'Nome',
    alphaAcids: 'Alfa Ácidos',
    cost: 'Custo',
    origin: 'Origem',
  }

  return (
    <Layout activeMenuItem="hops">
      <View style={styles.container}>
        <View style={styles.header}>
          <Heading variant="h3" style={styles.title}>
            Catálogo de Lúpulos
          </Heading>

          <TouchableOpacity style={styles.addButton} onPress={handleAddHop}>
            <BiPlus size={20} color={COLORS.neutral.white} />
            <Text style={styles.addButtonText}>Adicionar Lúpulo</Text>
          </TouchableOpacity>
        </View>

        <HopStats
          totalHops={stats.totalHops}
          bitteringCount={stats.bitteringCount}
          aromaCount={stats.aromaCount}
          dualPurposeCount={stats.dualPurposeCount}
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
                placeholder="Buscar lúpulos..."
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
              <Text style={styles.loadingText}>Carregando lúpulos...</Text>
            </View>
          ) : error ? (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>
                Erro ao carregar lúpulos: {error.message}
              </Text>
            </View>
          ) : filteredHops.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateText}>
                {searchQuery
                  ? 'Nenhum lúpulo encontrado para a busca.'
                  : 'Nenhum lúpulo nesta categoria.'}
              </Text>
            </View>
          ) : (
            <>
              <View style={styles.hopsGrid}>
                {filteredHops.map(hop => (
                  <View key={hop.id} style={styles.cardWrapper}>
                    <HopCard
                      hop={hop}
                      onEdit={() => handleEdit(hop.id)}
                      onDelete={() => handleDelete(hop.id)}
                    />
                  </View>
                ))}
              </View>

              {totalPages > 1 && (
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  totalItems={totalItems}
                  itemsPerPage={20}
                  onPageChange={setCurrentPage}
                  itemLabel="lúpulo"
                  itemLabelPlural="lúpulos"
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
    minWidth: 180,
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
  hopsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  cardWrapper: {
    flex: 1,
    minWidth: 280,
    maxWidth: 350,
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
