import {
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  NativeSyntheticEvent,
  NativeScrollEvent,
  ActivityIndicator,
} from 'react-native'
import { useState, useCallback } from 'react'
import { Layout } from '../../../shared/components/Layout'
import { Heading, Text } from '../../../shared/components/Typography'
import { InputText } from '../../../shared/components/InputText'
import { COLORS } from '../../../shared/styles/colors'
import { BiPlus, BiSearch } from 'react-icons/bi'
import { ListCard } from '../../../shared/components/ListCard'
import { useRecipesList } from '../hooks/useRecipes'
import { useDeleteRecipe } from '../hooks/useDeleteRecipe'
import {
  RecipeType,
  RecipeSortBy,
  SortOrder,
  recipeTypeLabels,
} from '../interfaces/Recipe'
import { useNavigate } from 'react-router'

export const ListRecipes = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [activeFilter, setActiveFilter] = useState<RecipeType | 'all'>('all')
  const sortBy = RecipeSortBy.CREATED_AT
  const order = SortOrder.DESC

  const navigate = useNavigate()

  const {
    recipes,
    isLoading,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch,
  } = useRecipesList(
    searchQuery,
    activeFilter !== 'all' ? activeFilter : undefined,
    sortBy,
    order,
  )

  const { deleteRecipe } = useDeleteRecipe()

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

  const handleEdit = (recipeId: string) => {
    navigate(`/recipes/${recipeId}/edit`)
  }

  const handleDelete = async (recipeId: string) => {
    if (confirm('Tem certeza que deseja deletar esta receita?')) {
      try {
        await deleteRecipe(recipeId)
        await refetch()
        alert('Receita deletada com sucesso!')
      } catch {
        alert('Erro ao deletar receita')
      }
    }
  }

  const handleCreateNew = () => {
    navigate('/recipes/new')
  }

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString)
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    })
  }

  return (
    <Layout activeMenuItem="recipes">
      <View style={styles.container}>
        <View style={styles.header}>
          <Heading variant="h3" style={styles.title}>
            Minhas Receitas
          </Heading>

          <TouchableOpacity
            style={styles.createButton}
            onPress={handleCreateNew}
          >
            <BiPlus size={20} color={COLORS.neutral.white} />
            <Text style={styles.createButtonText}>Criar Nova Receita</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.searchContainer}>
          <View style={styles.searchIcon}>
            <BiSearch size={20} color={COLORS.text.secondary} />
          </View>
          <InputText
            placeholder="Buscar receitas..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            style={styles.searchInput}
          />
        </View>

        {/* Filters */}
        <View style={styles.filtersRow}>
          <View style={styles.tabs}>
            <TouchableOpacity
              style={[styles.tab, activeFilter === 'all' && styles.tabActive]}
              onPress={() => setActiveFilter('all')}
            >
              <Text
                style={[
                  styles.tabText,
                  activeFilter === 'all' && styles.tabTextActive,
                ]}
              >
                Todas
              </Text>
            </TouchableOpacity>
            {Object.values(RecipeType).map(type => (
              <TouchableOpacity
                key={type}
                style={[styles.tab, activeFilter === type && styles.tabActive]}
                onPress={() => setActiveFilter(type)}
              >
                <Text
                  style={[
                    styles.tabText,
                    activeFilter === type && styles.tabTextActive,
                  ]}
                >
                  {recipeTypeLabels[type]}
                </Text>
              </TouchableOpacity>
            ))}
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
              <Text style={styles.loadingText}>Carregando receitas...</Text>
            </View>
          ) : error ? (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>
                Erro ao carregar receitas: {error.message}
              </Text>
            </View>
          ) : recipes.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateText}>
                {searchQuery || activeFilter !== 'all'
                  ? 'Nenhuma receita encontrada com os filtros selecionados'
                  : 'Nenhuma receita cadastrada ainda'}
              </Text>
            </View>
          ) : (
            <>
              <View style={styles.recipesGrid}>
                {recipes.map(recipe => (
                  <View key={recipe.id} style={styles.cardWrapper}>
                    <ListCard
                      title={recipe.name}
                      style={recipe.beerStyle?.name ?? 'Estilo não definido'}
                      lastModified={formatDate(recipe.updatedAt)}
                      imageUrl={recipe.imageUrl || undefined}
                      // badge={recipe.isDraft ? 'Rascunho' : undefined}
                      badge={undefined}
                      onEdit={() => handleEdit(recipe.id)}
                      onDelete={() => handleDelete(recipe.id)}
                    />
                  </View>
                ))}
              </View>

              {isFetchingNextPage && (
                <View style={styles.loadingMoreContainer}>
                  <Text style={styles.loadingText}>
                    Carregando mais receitas...
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
    gap: 16,
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
  createButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: COLORS.brand.primary,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 6,
    cursor: 'pointer',
  },
  createButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.neutral.white,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.neutral.white,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: COLORS.border.light,
    paddingHorizontal: 12,
    maxWidth: 400,
    width: '100%',
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    borderWidth: 0,
    backgroundColor: 'transparent',
  },
  recipesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  cardWrapper: {
    flex: 1,
    minWidth: 280,
    maxWidth: 350,
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
