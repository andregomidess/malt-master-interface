import { useInfiniteQuery } from '@tanstack/react-query'
import { recipesApi } from '../api/recipesApi'
import type { RecipeQueryParams } from '../interfaces/Recipe'
import { RecipeSortBy, SortOrder, RecipeType } from '../interfaces/Recipe'
import { useMemo } from 'react'

export const useRecipes = (params?: Omit<RecipeQueryParams, 'page'>) => {
  return useInfiniteQuery({
    queryKey: ['recipes', params] as const,
    queryFn: async ({ pageParam }: { pageParam: number }) => {
      const result = await recipesApi.findAllPaginated({
        ...params,
        page: pageParam,
      })
      return result
    },
    initialPageParam: 1,
    getNextPageParam: lastPage => {
      return lastPage.page < lastPage.totalPages ? lastPage.page + 1 : undefined
    },
  })
}

export const useRecipesList = (
  searchQuery?: string,
  type?: RecipeType,
  sortBy?: RecipeSortBy,
  order?: SortOrder,
) => {
  const queryParams = useMemo(
    () => ({
      search: searchQuery || undefined,
      type: type || undefined,
      sortBy: sortBy || RecipeSortBy.CREATED_AT,
      order: order || SortOrder.DESC,
      take: 20,
    }),
    [searchQuery, type, sortBy, order],
  )

  const query = useRecipes(queryParams)

  const recipes = useMemo(() => {
    if (!query.data?.pages) return []
    return query.data.pages.flatMap(page => page.data)
  }, [query.data])

  return {
    ...query,
    recipes,
  }
}
