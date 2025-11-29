import { View, StyleSheet, ScrollView } from 'react-native'
import { ReactNode } from 'react'
import { Sidebar } from '../../features/home/components/Sidebar'
import { Header } from '../../features/home/components/Header'
import { COLORS } from '../styles/colors'
import { useNavigate } from 'react-router'

interface DashboardLayoutProps {
  children: ReactNode
  activeMenuItem?: string
  userAvatar?: string
}

export const Layout = ({
  children,
  activeMenuItem,
  userAvatar,
}: DashboardLayoutProps) => {
  const navigate = useNavigate()
  
  // Obtém o usuário do localStorage para pegar o pictureUrl
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
  const avatarUrl = userAvatar || user?.pictureUrl || undefined

  return (
    <View style={styles.container}>
      <Sidebar activeItem={activeMenuItem} />

      <View style={styles.mainContent}>
        <Header
          userName={user?.username || ''}
          userAvatar={avatarUrl}
          onProfilePress={() => navigate('/profile')}
          onLogoutPress={() => navigate('/sign-in')}
        />

        <ScrollView
          style={styles.content}
          contentContainerStyle={styles.contentContainer}
          showsVerticalScrollIndicator={false}
        >
          {children}
        </ScrollView>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: COLORS.background,
  },
  mainContent: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 32,
  },
})
