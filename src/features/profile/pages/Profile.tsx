import { View, StyleSheet } from 'react-native'
import { useNavigate } from 'react-router'
import { Layout } from '../../../shared/components/Layout'
import { Heading, Text } from '../../../shared/components/Typography'
import { Button } from '../../../shared/components/Button'
import { COLORS } from '../../../shared/styles/colors'

export const Profile = () => {
  const navigate = useNavigate()

  const getUserFromStorage = () => {
    try {
      const userData = localStorage.getItem('user')
      if (userData) {
        return JSON.parse(userData)
      }
    } catch (error) {
      console.error('Erro ao ler usuário do localStorage:', error)
    }
    return null
  }

  const user = getUserFromStorage()

  return (
    <Layout activeMenuItem="profile">
      <View style={styles.container}>
        <View style={styles.header}>
          <Heading variant="h3" style={styles.title}>
            Perfil
          </Heading>
          <Button onPress={() => navigate('/profile/edit')}>
            Editar Perfil
          </Button>
        </View>

        {user && (
          <View style={styles.profileInfo}>
            <View style={styles.infoRow}>
              <Text style={styles.label}>Nome de usuário:</Text>
              <Text style={styles.value}>{user.username}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.label}>E-mail:</Text>
              <Text style={styles.value}>{user.email}</Text>
            </View>
            {user.country && (
              <View style={styles.infoRow}>
                <Text style={styles.label}>País:</Text>
                <Text style={styles.value}>{user.country}</Text>
              </View>
            )}
            {user.gender && (
              <View style={styles.infoRow}>
                <Text style={styles.label}>Gênero:</Text>
                <Text style={styles.value}>{user.gender}</Text>
              </View>
            )}
          </View>
        )}
      </View>
    </Layout>
  )
}

const styles = StyleSheet.create({
  container: {
    gap: 24,
    padding: 24,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: COLORS.text.primary,
  },
  profileInfo: {
    gap: 16,
    backgroundColor: COLORS.neutral.white,
    padding: 20,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.border.light,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border.light,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text.secondary,
  },
  value: {
    fontSize: 14,
    fontWeight: '400',
    color: COLORS.text.primary,
  },
})
