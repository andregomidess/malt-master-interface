import { useState } from 'react'
import { View, StyleSheet, TouchableOpacity } from 'react-native'
import { Layout } from '../../../shared/components/Layout'
import { Heading, Text } from '../../../shared/components/Typography'
import { InputText } from '../../../shared/components/InputText'
import { COLORS } from '../../../shared/styles/colors'
import { BiPlus, BiSearch } from 'react-icons/bi'
import { MdSort } from 'react-icons/md'
import {
  mockWaterProfilesData,
  ProfileType,
  calculateWaterStats,
  filterProfilesByType,
  searchProfiles,
  sortProfiles,
  WaterSortBy,
  profileTypeLabels,
} from '../data/mockWaterProfilesData'
import { WaterProfileStats } from '../components/WaterProfileStats'
import { WaterProfileCard } from '../components/WaterProfileCard'

export const ListWater = () => {
  const [activeFilter, setActiveFilter] = useState<ProfileType | 'all'>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState<WaterSortBy>('name')

  const stats = calculateWaterStats(mockWaterProfilesData)

  let filteredProfiles = filterProfilesByType(
    mockWaterProfilesData,
    activeFilter,
  )

  if (searchQuery) {
    filteredProfiles = searchProfiles(filteredProfiles, searchQuery)
  }

  filteredProfiles = sortProfiles(filteredProfiles, sortBy)

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

  const sortOptions: Array<{ id: WaterSortBy; label: string }> = [
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
          <TouchableOpacity style={styles.addButton}>
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

        <View style={styles.profilesGrid}>
          {filteredProfiles.map(profile => (
            <View key={profile.id} style={styles.profileCardWrapper}>
              <WaterProfileCard
                profile={profile}
                onEdit={() => console.log('Editar', profile.id)}
              />
            </View>
          ))}
        </View>

        {filteredProfiles.length === 0 && (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>
              Nenhum perfil de água encontrado com os filtros selecionados
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
})
