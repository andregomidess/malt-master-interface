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
import { YeastStats } from '../components/YeastStats'
import { YeastCard } from '../components/YeastCard'
import { useYeastsPaginated } from '../hooks/useYeastsPaginated'
import { useDeleteYeast } from '../hooks/useDeleteYeast'
import {
  YeastType,
  YeastSortBy,
  SortOrder,
  yeastTypeLabels,
} from '../interfaces/Yeast'
import { calculateYeastStats, filterYeastsByType } from '../data/mockYeastsData'

type FilterType = YeastType | 'all' | 'wild-bacteria'
type SortByOption = 'name' | 'attenuation' | 'temperature' | 'type'

export const ListYeast = () => {
  const navigate = useNavigate()
  const [activeFilter, setActiveFilter] = useState<FilterType>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState<SortByOption>('name')
  const [currentPage, setCurrentPage] = useState(1)
  const order = SortOrder.DESC

  const mapSortByToBackend = (sort: string): YeastSortBy => {
    switch (sort) {
      case 'name':
        return YeastSortBy.NAME
      case 'attenuation':
        return YeastSortBy.ATTENUATION
      case 'temperature':
        return YeastSortBy.CREATED_AT // Backend não tem temperatura como sort, usar data
      case 'type':
        return YeastSortBy.TYPE
      default:
        return YeastSortBy.NAME
    }
  }

  const {
    data: yeastsData,
    isLoading,
    error,
  } = useYeastsPaginated(
    currentPage,
    searchQuery,
    mapSortByToBackend(sortBy),
    order,
  )

  const yeasts = useMemo(() => yeastsData?.data || [], [yeastsData?.data])
  const totalItems = yeastsData?.total || 0
  const totalPages = yeastsData?.totalPages || 1

  const { deleteYeast } = useDeleteYeast()

  const filteredYeasts = useMemo(() => {
    if (activeFilter === 'wild-bacteria') {
      return yeasts.filter(
        y => y.type === YeastType.WILD || y.type === YeastType.BACTERIA,
      )
    }
    return filterYeastsByType(yeasts, activeFilter)
  }, [yeasts, activeFilter])

  const stats = useMemo(() => calculateYeastStats(yeasts), [yeasts])

  useEffect(() => {
    setCurrentPage(1)
  }, [searchQuery, activeFilter, sortBy])

  const handleDelete = async (id: string) => {
    if (confirm('Tem certeza que deseja deletar esta levedura?')) {
      try {
        await deleteYeast(id)
        alert('Levedura deletada com sucesso!')
      } catch {
        alert('Erro ao deletar levedura')
      }
    }
  }

  const filters: Array<{
    id: FilterType
    label: string
  }> = [
    { id: 'all', label: 'Todos' },
    { id: YeastType.ALE, label: yeastTypeLabels[YeastType.ALE] },
    { id: YeastType.LAGER, label: yeastTypeLabels[YeastType.LAGER] },
    { id: 'wild-bacteria', label: 'Selvagens & Bactérias' },
  ]

  const sortOptions: Array<{ id: SortByOption; label: string }> = [
    { id: 'name', label: 'Nome' },
    { id: 'attenuation', label: 'Atenuação' },
    { id: 'temperature', label: 'Temperatura' },
    { id: 'type', label: 'Tipo' },
  ]

  return (
    <Layout activeMenuItem="yeast">
      <View style={styles.container}>
        <View style={styles.header}>
          <Heading variant="h3" style={styles.title}>
            Catálogo de Leveduras
          </Heading>
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => navigate('/yeast/new')}
          >
            <BiPlus size={20} color={COLORS.neutral.white} />
            <Text style={styles.addButtonText}>Adicionar Levedura</Text>
          </TouchableOpacity>
        </View>

        <YeastStats
          totalYeasts={stats.totalYeasts}
          ales={stats.ales}
          lagers={stats.lagers}
          wildAndBacteria={stats.wildAndBacteria}
        />

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

        <View style={styles.searchAndSortRow}>
          <View style={styles.searchContainer}>
            <BiSearch size={20} color={COLORS.text.secondary} />
            <InputText
              placeholder="Buscar por nome, fornecedor ou perfil..."
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

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
        >
          {isLoading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={COLORS.brand.primary} />
              <Text style={styles.loadingText}>Carregando leveduras...</Text>
            </View>
          ) : error ? (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>
                Erro ao carregar leveduras: {error.message}
              </Text>
            </View>
          ) : filteredYeasts.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateText}>
                {searchQuery
                  ? 'Nenhuma levedura encontrada para a busca.'
                  : 'Nenhuma levedura encontrada com os filtros selecionados'}
              </Text>
            </View>
          ) : (
            <>
              <View style={styles.yeastsGrid}>
                {filteredYeasts.map(yeast => (
                  <View key={yeast.id} style={styles.yeastCardWrapper}>
                    <YeastCard
                      yeast={yeast}
                      onEdit={
                        yeast.user
                          ? () => navigate(`/yeast/${yeast.id}/edit`)
                          : undefined
                      }
                      onDelete={
                        yeast.user ? () => handleDelete(yeast.id) : undefined
                      }
                      onUseAsBase={
                        !yeast.user
                          ? () => navigate(`/yeast/new?base=${yeast.id}`)
                          : undefined
                      }
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
                  itemLabel="levedura"
                  itemLabelPlural="leveduras"
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
    cursor: 'pointer',
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
  yeastsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 20,
    alignItems: 'stretch',
    justifyContent: 'flex-start',
  },
  yeastCardWrapper: {
    flex: 1,
    minWidth: 300,
    maxWidth: 300,
    height: 800,
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
