import {
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  NativeSyntheticEvent,
  NativeScrollEvent,
  ActivityIndicator,
} from 'react-native'
import { useState, useCallback, useMemo } from 'react'
import { useNavigate } from 'react-router'
import { Layout } from '../../../shared/components/Layout'
import { Heading, Text } from '../../../shared/components/Typography'
import { InputText } from '../../../shared/components/InputText'
import { COLORS } from '../../../shared/styles/colors'
import { BiPlus, BiSearch } from 'react-icons/bi'
import { MdSort } from 'react-icons/md'
import { WaterProfileStats } from '../components/WaterProfileStats'
import { WaterProfileCard } from '../components/WaterProfileCard'
import { useWaterProfilesList } from '../hooks/useWaterProfiles'
import { useDeleteWaterProfile } from '../hooks/useDeleteWaterProfile'
import {
  ProfileType,
  WaterProfileSortBy,
  SortOrder,
  profileTypeLabels,
} from '../interfaces/WaterProfile'
import {
  calculateWaterStats,
  filterProfilesByType,
} from '../data/mockWaterProfilesData'

type SortByOption = 'name' | 'hardness' | 'sulfate' | 'ratio'

export const ListWater = () => {
  const navigate = useNavigate()
  const [activeFilter, setActiveFilter] = useState<ProfileType | 'all'>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState<SortByOption>('name')
  const order = SortOrder.DESC

  const mapSortByToBackend = (sort: string): WaterProfileSortBy => {
    switch (sort) {
      case 'name':
        return WaterProfileSortBy.NAME
      case 'sulfate':
        return WaterProfileSortBy.SO4
      case 'hardness':
      case 'ratio':
        return WaterProfileSortBy.CREATED_AT // Backend não tem esses sorts, usar data
      default:
        return WaterProfileSortBy.NAME
    }
  }

  const {
    waterProfiles,
    isLoading,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useWaterProfilesList(searchQuery, mapSortByToBackend(sortBy), order)

  const { deleteWaterProfile } = useDeleteWaterProfile()

  // Filtrar por tipo no front-end
  const filteredProfiles = useMemo(() => {
    return filterProfilesByType(waterProfiles, activeFilter)
  }, [waterProfiles, activeFilter])

  // Calcular estatísticas
  const stats = useMemo(
    () => calculateWaterStats(waterProfiles),
    [waterProfiles],
  )

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

  const handleDelete = async (id: string) => {
    if (confirm('Tem certeza que deseja deletar este perfil de água?')) {
      try {
        await deleteWaterProfile(id)
        alert('Perfil de água deletado com sucesso!')
      } catch {
        alert('Erro ao deletar perfil de água')
      }
    }
  }

  const filters: Array<{
    id: ProfileType | 'all'
    label: string
  }> = [
    { id: 'all', label: 'Todos' },
    {
      id: ProfileType.BALANCED,
      label: profileTypeLabels[ProfileType.BALANCED],
    },
    { id: ProfileType.HOPPY, label: profileTypeLabels[ProfileType.HOPPY] },
    { id: ProfileType.MALTY, label: profileTypeLabels[ProfileType.MALTY] },
  ]

  const sortOptions: Array<{ id: SortByOption; label: string }> = [
    { id: 'name', label: 'Nome' },
    { id: 'hardness', label: 'Dureza' },
    { id: 'sulfate', label: 'Sulfato' },
    { id: 'ratio', label: 'Relação SO4:Cl' },
  ]

  return (
    <Layout activeMenuItem="water">
      <View style={styles.container}>
        <View style={styles.header}>
          <Heading variant="h3" style={styles.title}>
            Perfis de Água
          </Heading>
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => navigate('/water/new')}
          >
            <BiPlus size={20} color={COLORS.neutral.white} />
            <Text style={styles.addButtonText}>Adicionar Perfil</Text>
          </TouchableOpacity>
        </View>

        <WaterProfileStats
          totalProfiles={stats.totalProfiles}
          balanced={stats.balanced}
          hoppy={stats.hoppy}
          malty={stats.malty}
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
              placeholder="Buscar por nome, origem ou estilo..."
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
          onScroll={handleScroll}
          scrollEventThrottle={400}
        >
          {isLoading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={COLORS.brand.primary} />
              <Text style={styles.loadingText}>
                Carregando perfis de água...
              </Text>
            </View>
          ) : error ? (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>
                Erro ao carregar perfis de água: {error.message}
              </Text>
            </View>
          ) : filteredProfiles.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateText}>
                {searchQuery
                  ? 'Nenhum perfil de água encontrado para a busca.'
                  : 'Nenhum perfil de água encontrado com os filtros selecionados'}
              </Text>
            </View>
          ) : (
            <>
              <View style={styles.profilesGrid}>
                {filteredProfiles.map(profile => (
                  <View key={profile.id} style={styles.profileCardWrapper}>
                    <WaterProfileCard
                      profile={profile}
                      onEdit={() => navigate(`/water/${profile.id}/edit`)}
                      onDelete={() => handleDelete(profile.id)}
                    />
                  </View>
                ))}
              </View>

              {isFetchingNextPage && (
                <View style={styles.loadingMoreContainer}>
                  <Text style={styles.loadingText}>
                    Carregando mais perfis...
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
  profilesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 20,
  },
  profileCardWrapper: {
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
