import { View, StyleSheet, TouchableOpacity } from 'react-native'
import { useState } from 'react'
import { Layout } from '../../../shared/components/Layout'
import { Heading, Text } from '../../../shared/components/Typography'
import { InputText } from '../../../shared/components/InputText'
import { COLORS } from '../../../shared/styles/colors'
import { BiPlus, BiSearch } from 'react-icons/bi'
import { MdSort } from 'react-icons/md'
import { FermentableStats } from '../components/FermentableStats'
import { FermentableCard } from '../components/FermentableCard'
import {
  mockFermentablesData,
  calculateFermentableStats,
  filterFermentablesByType,
  searchFermentables,
  sortFermentables,
  FermentableType,
  FermentableSortBy,
} from '../data/mockFermentablesData'

type FilterType = 'all' | FermentableType

export const ListFermentable = () => {
  const [activeFilter, setActiveFilter] = useState<FilterType>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState<FermentableSortBy>('name')
  const [showSortMenu, setShowSortMenu] = useState(false)

  const filteredByType = filterFermentablesByType(
    mockFermentablesData,
    activeFilter,
  )
  const filteredBySearch = searchQuery
    ? searchFermentables(filteredByType, searchQuery)
    : filteredByType
  const sortedFermentables = sortFermentables(filteredBySearch, sortBy)

  const stats = calculateFermentableStats(mockFermentablesData)

  const handleEdit = (fermentableId: string) => {
    console.log('Editar fermentável:', fermentableId)
  }

  const handleAddFermentable = () => {
    console.log('Adicionar novo fermentável')
  }

  const filters = [
    { id: 'all' as FilterType, label: 'Todos' },
    { id: FermentableType.BASE as FilterType, label: 'Maltes Base' },
    { id: FermentableType.SPECIALTY as FilterType, label: 'Maltes Especiais' },
    { id: FermentableType.SUGAR as FilterType, label: 'Açúcares' },
    { id: FermentableType.ADJUNCT as FilterType, label: 'Adjuntos' },
  ]

  const sortOptions: { id: FermentableSortBy; label: string }[] = [
    { id: 'name', label: 'Nome' },
    { id: 'color', label: 'Cor (Claro → Escuro)' },
    { id: 'yield', label: 'Rendimento' },
    { id: 'type', label: 'Tipo' },
  ]

  const sortLabels: Record<FermentableSortBy, string> = {
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

        <View style={styles.fermentablesGrid}>
          {sortedFermentables.map(fermentable => (
            <View key={fermentable.id} style={styles.cardWrapper}>
              <FermentableCard
                fermentable={fermentable}
                onEdit={() => handleEdit(fermentable.id)}
              />
            </View>
          ))}
        </View>

        {sortedFermentables.length === 0 && (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>
              {searchQuery
                ? 'Nenhum fermentável encontrado para a busca.'
                : 'Nenhum fermentável nesta categoria.'}
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
})
