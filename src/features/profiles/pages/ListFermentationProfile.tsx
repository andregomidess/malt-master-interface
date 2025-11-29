import {
  View,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native'
import { useState } from 'react'
import { useNavigate } from 'react-router'
import { Layout } from '../../../shared/components/Layout'
import { Heading, Text } from '../../../shared/components/Typography'
import { InputText } from '../../../shared/components/InputText'
import { COLORS } from '../../../shared/styles/colors'
import { BiPlus, BiSearch } from 'react-icons/bi'
import { FermentationProfileCard } from '../components/FermentationProfileCard'
import { useFermentationProfiles } from '../hooks/useFermentationProfiles'

export const ListFermentationProfile = () => {
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState('')

  const { data: profiles, isLoading, error } = useFermentationProfiles()

  const filteredProfiles = profiles?.filter(profile =>
    profile.name.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const handleEdit = (profileId: string) => {
    navigate(`/fermentation-profiles/${profileId}/edit`)
  }

  const handleAddProfile = () => {
    navigate('/fermentation-profiles/new')
  }

  return (
    <Layout activeMenuItem="fermentation-profiles">
      <View style={styles.container}>
        <View style={styles.header}>
          <Heading variant="h3" style={styles.title}>
            Perfis de Fermentação
          </Heading>

          <TouchableOpacity style={styles.addButton} onPress={handleAddProfile}>
            <BiPlus size={20} color={COLORS.neutral.white} />
            <Text style={styles.addButtonText}>Adicionar Perfil</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.searchContainer}>
          <View style={styles.searchIcon}>
            <BiSearch size={20} color={COLORS.text.secondary} />
          </View>
          <InputText
            placeholder="Buscar perfis..."
            style={styles.searchInput}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        {/* Loading */}
        {isLoading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={COLORS.brand.primary} />
            <Text style={styles.loadingText}>
              Carregando perfis de fermentação...
            </Text>
          </View>
        )}

        {/* Error */}
        {error && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>
              Erro ao carregar perfis de fermentação. Tente novamente.
            </Text>
          </View>
        )}

        {/* Lista de perfis */}
        {!isLoading && !error && (
          <View style={styles.profilesGrid}>
            {filteredProfiles?.map(profile => (
              <View key={profile.id} style={styles.cardWrapper}>
                <FermentationProfileCard
                  profile={profile}
                  onEdit={() => handleEdit(profile.id)}
                />
              </View>
            ))}
          </View>
        )}

        {/* Empty state */}
        {!isLoading &&
          !error &&
          (!filteredProfiles || filteredProfiles.length === 0) && (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateText}>
                {searchQuery
                  ? 'Nenhum perfil encontrado para a busca.'
                  : 'Nenhum perfil de fermentação cadastrado.'}
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
  searchContainer: {
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
  profilesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  cardWrapper: {
    flex: 1,
    minWidth: 320,
    maxWidth: 400,
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
})
