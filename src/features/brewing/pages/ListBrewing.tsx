import {
  View,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  TextInput,
  FlatList,
} from 'react-native'
import { Layout } from '../../../shared/components/Layout'
import { Text } from '../../../shared/components/Typography'
import { COLORS } from '../../../shared/styles/colors'
import { useBatches } from '../hooks/useBatches'
import { BatchCard } from '../components/BatchCard'
import { BatchStatus } from '../interfaces/Brewing'
import { MdRefresh } from 'react-icons/md'

export const ListBrewing = () => {
  const {
    data,
    loading,
    error,
    statusFilter,
    setStatusFilter,
    searchQuery,
    setSearchQuery,
    sortBy,
    setSortBy,
    refetch,
  } = useBatches()

  const statusOptions: Array<{ value: BatchStatus | 'all'; label: string }> = [
    { value: 'all', label: 'Todas' },
    { value: 'planned', label: 'Planejadas' },
    { value: 'fermenting', label: 'Fermentando' },
    { value: 'maturing', label: 'Maturando' },
    { value: 'packaged', label: 'Envasadas' },
    { value: 'completed', label: 'Finalizadas' },
  ]

  const sortOptions: Array<{
    value: 'recent' | 'name' | 'status'
    label: string
  }> = [
    { value: 'recent', label: 'Mais Recentes' },
    { value: 'name', label: 'Nome' },
    { value: 'status', label: 'Status' },
  ]

  return (
    <Layout activeMenuItem="brewings">
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Brassagens</Text>
          <TouchableOpacity
            style={styles.addButton}
            activeOpacity={0.85}
            onPress={() => console.log('Criar nova brassagem')}
          >
            <Text style={styles.addButtonText}>+ Nova Brassagem</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.filters}>
          <TextInput
            placeholder="Buscar por nome, código ou receita..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            style={styles.searchInput}
          />

          <View style={styles.filterRow}>
            <Text style={styles.filterLabel}>Status:</Text>
            <View style={styles.pills}>
              {statusOptions.map(option => (
                <TouchableOpacity
                  key={option.value}
                  onPress={() => setStatusFilter(option.value)}
                  style={[
                    styles.pill,
                    statusFilter === option.value && styles.pillActive,
                  ]}
                  activeOpacity={0.7}
                >
                  <Text
                    style={[
                      styles.pillText,
                      statusFilter === option.value && styles.pillTextActive,
                    ]}
                  >
                    {option.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.filterRow}>
            <Text style={styles.filterLabel}>Ordenar:</Text>
            <View style={styles.pills}>
              {sortOptions.map(option => (
                <TouchableOpacity
                  key={option.value}
                  onPress={() => setSortBy(option.value)}
                  style={[
                    styles.pill,
                    sortBy === option.value && styles.pillActive,
                  ]}
                  activeOpacity={0.7}
                >
                  <Text
                    style={[
                      styles.pillText,
                      sortBy === option.value && styles.pillTextActive,
                    ]}
                  >
                    {option.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>

        {loading && (
          <View style={styles.centerContainer}>
            <ActivityIndicator size="large" color={COLORS.brand.primary} />
          </View>
        )}

        {error && (
          <View style={styles.centerContainer}>
            <Text style={styles.errorText}>{error}</Text>
            <TouchableOpacity
              style={styles.retryButton}
              onPress={refetch}
              activeOpacity={0.85}
            >
              <MdRefresh size={18} color={COLORS.brand.primary} />
              <Text style={styles.retryText}>Tentar Novamente</Text>
            </TouchableOpacity>
          </View>
        )}

        {!loading && !error && data.length === 0 && (
          <View style={styles.centerContainer}>
            <Text style={styles.emptyText}>
              {searchQuery || statusFilter !== 'all'
                ? 'Nenhuma brassagem encontrada com os filtros aplicados.'
                : 'Você ainda não tem brassagens cadastradas.'}
            </Text>
          </View>
        )}

        {!loading && !error && data.length > 0 && (
          <FlatList
            data={data}
            keyExtractor={item => item.id}
            renderItem={({ item }) => (
              <BatchCard
                batch={item}
                onPress={() => console.log('Abrir sessão:', item.id)}
              />
            )}
            contentContainerStyle={styles.list}
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>
    </Layout>
  )
}

const styles = StyleSheet.create({
  container: {
    gap: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 12,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: COLORS.text.primary,
  },
  addButton: {
    backgroundColor: COLORS.brand.primary,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
  filters: {
    gap: 12,
  },
  searchInput: {
    backgroundColor: COLORS.neutral.white,
    borderWidth: 1,
    borderColor: COLORS.border.light,
    borderRadius: 10,
    padding: 12,
    fontSize: 14,
    color: COLORS.text.primary,
  },
  filterRow: {
    gap: 10,
  },
  filterLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text.primary,
  },
  pills: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  pill: {
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 20,
    backgroundColor: COLORS.neutral.white,
    borderWidth: 1,
    borderColor: COLORS.border.light,
  },
  pillActive: {
    backgroundColor: COLORS.brand.primary,
    borderColor: COLORS.brand.primary,
  },
  pillText: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.text.primary,
  },
  pillTextActive: {
    color: '#FFFFFF',
  },
  centerContainer: {
    paddingVertical: 60,
    alignItems: 'center',
    gap: 16,
  },
  errorText: {
    fontSize: 14,
    color: COLORS.status.error,
    textAlign: 'center',
  },
  retryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.brand.primary,
  },
  retryText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.brand.primary,
  },
  emptyText: {
    fontSize: 14,
    color: COLORS.text.secondary,
    textAlign: 'center',
    maxWidth: 400,
  },
  list: {
    gap: 16,
    paddingBottom: 20,
  },
})
