import { View, StyleSheet, TouchableOpacity } from 'react-native'
import { useState } from 'react'
import { Layout } from '../../../shared/components/Layout'
import { Heading, Text } from '../../../shared/components/Typography'
import { InputText } from '../../../shared/components/InputText'
import { COLORS } from '../../../shared/styles/colors'
import { generateMoreRecipes, Recipe } from '../data/mockRecipes'
import { BiPlus, BiSearch } from 'react-icons/bi'
import { ListCard } from '../../../shared/components/ListCard'

export const ListRecipes = () => {
  const [recipes] = useState<Recipe[]>(generateMoreRecipes(1, 12))

  const handleEdit = (recipeId: string) => {
    console.log('Editar receita:', recipeId)
  }

  const handleCreateNew = () => {
    console.log('Criar nova receita')
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
            style={styles.searchInput}
          />
        </View>

        <View style={styles.recipesGrid}>
          {recipes.map(item => (
            <View key={item.id} style={styles.cardWrapper}>
              <ListCard
                title={item.title}
                style={item.style}
                lastModified={item.lastModified}
                imageUrl={item.imageUrl}
                onEdit={() => handleEdit(item.id)}
              />
            </View>
          ))}
        </View>
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
})
