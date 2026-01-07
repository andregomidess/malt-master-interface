import {
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  Pressable,
} from 'react-native'
import { useState } from 'react'
import { Text } from '../../../shared/components/Typography'
import { COLORS } from '../../../shared/styles/colors'
import { MdKeyboardArrowDown, MdPerson, MdLogout } from 'react-icons/md'

interface HeaderProps {
  userName: string
  userAvatar?: string
  onProfilePress?: () => void
  onLogoutPress?: () => void
}

export const Header = ({
  userName,
  userAvatar,
  onProfilePress,
  onLogoutPress,
}: HeaderProps) => {
  const [menuVisible, setMenuVisible] = useState(false)

  const handleProfilePress = () => {
    setMenuVisible(!menuVisible)
  }

  const handleMenuItemPress = (action: () => void) => {
    setMenuVisible(false)
    action()
  }

  return (
    <>
      <View style={styles.container}>
        <View style={styles.leftSection}>
          <Text style={styles.greeting}>{`Olá, ${userName}`}</Text>
        </View>

        <View style={styles.rightSection}>
          <View style={styles.profileContainer}>
            <TouchableOpacity
              style={styles.profileButton}
              onPress={handleProfilePress}
              activeOpacity={0.7}
            >
              {userAvatar && userAvatar.trim() !== '' ? (
                <Image source={{ uri: userAvatar }} style={styles.avatar} />
              ) : (
                <View style={styles.avatarPlaceholder}>
                  <Text style={styles.avatarText}>
                    {userName
                      .split(' ')
                      .map(n => n[0])
                      .join('')
                      .substring(0, 2)}
                  </Text>
                </View>
              )}
              <View
                style={{
                  transform: [{ rotate: menuVisible ? '180deg' : '0deg' }],
                }}
              >
                <MdKeyboardArrowDown size={20} color={COLORS.icons} />
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {menuVisible && (
        <>
          <Pressable
            style={styles.overlay}
            onPress={() => setMenuVisible(false)}
          />
          <View style={styles.dropdownMenu}>
            <View style={styles.dropdownContent}>
              <TouchableOpacity
                style={styles.menuItem}
                onPress={() =>
                  handleMenuItemPress(
                    onProfilePress || (() => console.log('Ir para perfil')),
                  )
                }
                activeOpacity={0.6}
              >
                <MdPerson size={20} color={COLORS.text.secondary} />
                <Text style={styles.menuItemText}>Meu Perfil</Text>
              </TouchableOpacity>

              <View style={styles.menuDivider} />

              <TouchableOpacity
                style={styles.menuItem}
                onPress={() =>
                  handleMenuItemPress(
                    onLogoutPress || (() => console.log('Fazer logout')),
                  )
                }
                activeOpacity={0.6}
              >
                <MdLogout size={20} color={COLORS.status.error} />
                <Text style={[styles.menuItemText, styles.logoutText]}>
                  Sair
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </>
      )}
    </>
  )
}

const styles = StyleSheet.create({
  container: {
    height: 72,
    backgroundColor: COLORS.neutral.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border.light,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 32,
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  greeting: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.text.primary,
  },
  rightSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  profileContainer: {
    position: 'relative',
    zIndex: 1000,
  },
  profileButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 24,
    backgroundColor: COLORS.neutral.gray[50],
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 9998,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
  },
  dropdownMenu: {
    position: 'absolute',
    top: 60,
    right: 20,
    zIndex: 9999,
  },
  dropdownContent: {
    backgroundColor: COLORS.neutral.white,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.border.light,
    minWidth: 200,
    paddingVertical: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 10,
    paddingHorizontal: 16,
    backgroundColor: 'transparent',
  },
  menuItemHover: {
    backgroundColor: COLORS.neutral.gray[50],
  },
  menuItemText: {
    fontSize: 14,
    fontWeight: '500',
    color: COLORS.text.primary,
    flex: 1,
  },
  logoutText: {
    color: COLORS.status.error,
  },
  menuDivider: {
    height: 1,
    backgroundColor: COLORS.border.light,
    marginVertical: 4,
    marginHorizontal: 8,
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
  },
  avatarPlaceholder: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.brand.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.neutral.white,
  },
})
