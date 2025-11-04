import { View, StyleSheet, ScrollView } from 'react-native'
import { ReactNode } from 'react'
import { Sidebar } from './Sidebar'
import { Header } from './Header'
import { COLORS } from '../../../shared/styles/colors'

interface DashboardLayoutProps {
  children: ReactNode
  activeMenuItem?: string
  userName?: string
  userAvatar?: string
  notificationCount?: number
  onMenuItemPress?: (itemId: string) => void
  onNotificationPress?: () => void
  onProfilePress?: () => void
}

export const DashboardLayout = ({
  children,
  activeMenuItem = 'dashboard',
  userName,
  userAvatar,
  onMenuItemPress,
  onProfilePress,
}: DashboardLayoutProps) => {
  return (
    <View style={styles.container}>
      <Sidebar activeItem={activeMenuItem} onItemPress={onMenuItemPress} />

      <View style={styles.mainContent}>
        <Header
          userName={userName}
          userAvatar={userAvatar}
          onProfilePress={onProfilePress}
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
