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
  return (
    <View style={styles.container}>
      <Sidebar activeItem={activeMenuItem} />

      <View style={styles.mainContent}>
        <Header
          userName={JSON.parse(localStorage.getItem('user') || '{}').username}
          userAvatar={userAvatar}
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
