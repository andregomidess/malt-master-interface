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
import { MashProfileCard } from '../components/MashProfileCard'
import { useMashProfiles } from '../hooks/useMashProfiles'

export const ListMashProfile = () => {
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 20

  const { data: profiles, isLoading, error } = useMashProfiles()

  const filteredProfiles = useMemo(
    () =>
      profiles?.filter(profile =>
        profile.name.toLowerCase().includes(searchQuery.toLowerCase()),
      ) || [],
    [profiles, searchQuery],
  )

  useEffect(() => {
    setCurrentPage(1)
  }, [searchQuery])

  const totalItems = filteredProfiles.length
  const totalPages = Math.ceil(totalItems / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const paginatedProfiles = filteredProfiles.slice(startIndex, endIndex)

  const handleEdit = (profileId: string) => {
    navigate(`/mash-profiles/${profileId}/edit`)
  }

  const handleAddProfile = () => {
    navigate('/mash-profiles/new')
  }

  return (
    <Layout activeMenuItem="mash-profiles">
      <View style={styles.container}>
        <View style={styles.header}>
          <Heading variant="h3" style={styles.title}>
            Perfis de Mostura
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

        {isLoading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={COLORS.brand.primary} />
            <Text style={styles.loadingText}>
              Carregando perfis de mostura...
            </Text>
          </View>
        )}

        {error && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>
              Erro ao carregar perfis de mostura. Tente novamente.
            </Text>
          </View>
        )}

        {!isLoading && !error && (
          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={styles.scrollContent}
          >
            {paginatedProfiles.length > 0 ? (
              <>
                <View style={styles.profilesGrid}>
                  {paginatedProfiles.map(profile => (
                    <View key={profile.id} style={styles.cardWrapper}>
                      <MashProfileCard
                        profile={profile}
                        onEdit={() => handleEdit(profile.id)}
                      />
                    </View>
                  ))}
                </View>

                {totalPages > 1 && (
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    totalItems={totalItems}
                    itemsPerPage={itemsPerPage}
                    onPageChange={setCurrentPage}
                    itemLabel="perfil"
                    itemLabelPlural="perfis"
                  />
                )}
              </>
            ) : (
              <View style={styles.emptyState}>
                <Text style={styles.emptyStateText}>
                  {searchQuery
                    ? 'Nenhum perfil encontrado para a busca.'
                    : 'Nenhum perfil de mostura cadastrado.'}
                </Text>
              </View>
            )}
          </ScrollView>
        )}

        {!isLoading && !error && filteredProfiles.length === 0 && (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>
              {searchQuery
                ? 'Nenhum perfil encontrado para a busca.'
                : 'Nenhum perfil de mostura cadastrado.'}
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
    alignItems: 'stretch',
    justifyContent: 'flex-start',
  },
  cardWrapper: {
    flex: 1,
    minWidth: 300,
    maxWidth: 300,
    height: 700,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 24,
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
