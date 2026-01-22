import {
  View,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
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
import { EquipmentStats } from '../components/EquipmentStats'
import { EquipmentCard } from '../components/EquipmentCard'
import { useEquipmentsPaginated } from '../hooks/useEquipmentsPaginated'
import { calculateEquipmentStats } from '../utils/equipmentHelpers'
import {
  EquipmentType,
  EquipmentSortBy,
  SortOrder,
  type FilterType,
  type SortBy,
} from '../interfaces/equipment'

export const ListEquipment = () => {
  const navigate = useNavigate()
  const [activeFilter, setActiveFilter] = useState<FilterType>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState<SortBy>('name')
  const [showSortMenu, setShowSortMenu] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)

  const mapSortByToBackend = (sort: SortBy): EquipmentSortBy => {
    switch (sort) {
      case 'name':
        return EquipmentSortBy.NAME
      case 'capacity':
        return EquipmentSortBy.CAPACITY
      case 'date':
        return EquipmentSortBy.CREATED_AT
      default:
        return EquipmentSortBy.NAME
    }
  }

  const queryParams = useMemo(
    () => ({
      type: activeFilter !== 'all' ? activeFilter : undefined,
      search: searchQuery || undefined,
      sortBy: mapSortByToBackend(sortBy),
      order: SortOrder.DESC,
      take: 20,
    }),
    [activeFilter, searchQuery, sortBy],
  )

  const {
    data: equipmentData,
    isLoading,
    error,
  } = useEquipmentsPaginated(currentPage, queryParams)

  const equipments = useMemo(
    () => equipmentData?.data || [],
    [equipmentData?.data],
  )
  const totalItems = equipmentData?.total || 0
  const totalPages = equipmentData?.totalPages || 1

  const stats = useMemo(() => calculateEquipmentStats(equipments), [equipments])

  // Resetar para página 1 quando busca, filtro ou ordenação mudar
  useEffect(() => {
    setCurrentPage(1)
  }, [searchQuery, activeFilter, sortBy])

  const handleEdit = (equipmentId: string) => {
    navigate(`/equipment/${equipmentId}/edit`)
  }

  const handleAddEquipment = () => {
    navigate('/equipment/new')
  }

  const filters = [
    { id: 'all' as FilterType, label: 'Todos' },
    { id: EquipmentType.KETTLE as FilterType, label: 'Panelas' },
    { id: EquipmentType.FERMENTER as FilterType, label: 'Fermentadores' },
    { id: EquipmentType.CHILLER as FilterType, label: 'Resfriadores' },
  ]

  const sortOptions: { id: SortBy; label: string }[] = [
    { id: 'name', label: 'Nome' },
    { id: 'capacity', label: 'Capacidade' },
    { id: 'date', label: 'Data de Criação' },
  ]

  const sortLabels: Record<SortBy, string> = {
    name: 'Nome',
    capacity: 'Capacidade',
    date: 'Data',
  }

  return (
    <Layout activeMenuItem="equipment">
      <View style={styles.container}>
        <View style={styles.header}>
          <Heading variant="h3" style={styles.title}>
            Meus Equipamentos
          </Heading>

          <TouchableOpacity
            style={styles.addButton}
            onPress={handleAddEquipment}
          >
            <BiPlus size={20} color={COLORS.neutral.white} />
            <Text style={styles.addButtonText}>Adicionar Equipamento</Text>
          </TouchableOpacity>
        </View>

        <EquipmentStats
          totalEquipments={stats.totalEquipments}
          kettles={stats.kettles}
          fermenters={stats.fermenters}
          chillers={stats.chillers}
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
                placeholder="Buscar equipamentos..."
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

        {/* Loading */}
        {isLoading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={COLORS.brand.primary} />
            <Text style={styles.loadingText}>Carregando equipamentos...</Text>
          </View>
        )}

        {/* Error */}
        {error && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>
              Erro ao carregar equipamentos. Tente novamente.
            </Text>
          </View>
        )}

        {/* Lista de equipamentos */}
        {!isLoading && !error && (
          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={styles.scrollContent}
          >
            {equipments.length > 0 ? (
              <>
                <View style={styles.equipmentsGrid}>
                  {equipments.map((equipment: (typeof equipments)[0]) => (
                    <View key={equipment.id} style={styles.cardWrapper}>
                      <EquipmentCard
                        equipment={equipment}
                        onEdit={() => handleEdit(equipment.id)}
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
                    itemLabel="equipamento"
                    itemLabelPlural="equipamentos"
                  />
                )}
              </>
            ) : (
              <View style={styles.emptyState}>
                <Text style={styles.emptyStateText}>
                  {searchQuery
                    ? 'Nenhum equipamento encontrado para a busca.'
                    : 'Nenhum equipamento nesta categoria.'}
                </Text>
              </View>
            )}
          </ScrollView>
        )}

        {!isLoading && !error && equipments.length === 0 && (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>
              {searchQuery
                ? 'Nenhum equipamento encontrado para a busca.'
                : 'Nenhum equipamento nesta categoria.'}
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
  equipmentsGrid: {
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
    height: 550,
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
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 48,
    gap: 16,
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
    backgroundColor: '#FEE2E2',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#FCA5A5',
  },
  errorText: {
    fontSize: 14,
    color: '#DC2626',
    textAlign: 'center',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 24,
  },
})
