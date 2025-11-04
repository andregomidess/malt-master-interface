import { View, StyleSheet, TouchableOpacity } from 'react-native'
import { Heading, Text } from '../../../shared/components/Typography'
import { COLORS } from '../../../shared/styles/colors'
import { MdPeople } from 'react-icons/md'
import {
  BiBook,
  BiHomeAlt,
  BiHourglass,
  BiPackage,
  BiStar,
  BiUser,
} from 'react-icons/bi'
import logoImage from '../../../assets/logo2.png'
import { Image } from 'react-native-web'
import { PiToolbox } from 'react-icons/pi'
import { MaltIcon, HopsIcon } from '../icons'
import { GiBubbles } from 'react-icons/gi'
import { IoWaterOutline } from 'react-icons/io5'

interface MenuItem {
  id: string
  label: string
  icon: React.ComponentType<{ size: number; color: string }>
  path: string
}

const menuItems: MenuItem[] = [
  { id: 'dashboard', label: 'Dashboard', icon: BiHomeAlt, path: '/' },
  { id: 'receitas', label: 'Receitas', icon: BiBook, path: '/receitas' },
  {
    id: 'brassagens',
    label: 'Brassagens',
    icon: BiHourglass,
    path: '/brassagens',
  },
  {
    id: 'estoque',
    label: 'Estoque',
    icon: BiPackage,
    path: '/estoque',
  },
  {
    id: 'equipamentos',
    label: 'Equipamentos',
    icon: PiToolbox,
    path: '/equipamentos',
  },
  {
    id: 'lupulo',
    label: 'Lúpulo',
    icon: HopsIcon,
    path: '/lupulo',
  },
  {
    id: 'malte',
    label: 'Malte',
    icon: MaltIcon,
    path: '/malte',
  },
  {
    id: 'leveduras',
    label: 'Leveduras',
    icon: GiBubbles,
    path: '/leveduras',
  },
  {
    id: 'agua',
    label: 'Água',
    icon: IoWaterOutline,
    path: '/agua',
  },
  {
    id: 'avaliacoes',
    label: 'Avaliações',
    icon: BiStar,
    path: '/avaliacoes',
  },
  {
    id: 'comunidade',
    label: 'Comunidade',
    icon: MdPeople,
    path: '/comunidade',
  },
  { id: 'perfil', label: 'Perfil', icon: BiUser, path: '/perfil' },
]

interface SidebarProps {
  activeItem?: string
  onItemPress?: (itemId: string) => void
}

export const Sidebar = ({
  activeItem = 'dashboard',
  onItemPress,
}: SidebarProps) => {
  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <Image source={{ uri: logoImage }} style={styles.logoImage} />
        <Heading variant="h4" style={{ color: COLORS.brand.primary }}>
          MaltMaster
        </Heading>
      </View>

      <View>
        {menuItems.map(item => {
          const Icon = item.icon
          const isActive = activeItem === item.id

          return (
            <TouchableOpacity
              key={item.id}
              style={[styles.menuItem, isActive && styles.menuItemActive]}
              onPress={() => onItemPress?.(item.id)}
              activeOpacity={0.7}
            >
              <Icon
                size={20}
                color={isActive ? COLORS.brand.primary : COLORS.text.secondary}
              />
              <Text
                style={[
                  styles.menuItemText,
                  isActive && styles.menuItemTextActive,
                ]}
              >
                {item.label}
              </Text>
            </TouchableOpacity>
          )
        })}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    width: 260,
    height: '100%',
    backgroundColor: COLORS.neutral.white,
    borderRightWidth: 1,
    borderRightColor: COLORS.border.light,
    paddingVertical: 24,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    marginBottom: 32,
    gap: 4,
  },
  logoImage: {
    width: 40,
    height: 40,
  },

  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 6,
    gap: 12,
    cursor: 'pointer',
  },
  menuItemActive: {
    backgroundColor: COLORS.neutral.gray[100],
    borderLeftWidth: 3,
    borderLeftColor: COLORS.brand.primary,
  },
  menuItemText: {
    fontSize: 15,
    color: COLORS.text.secondary,
    fontWeight: '500',
  },
  menuItemTextActive: {
    color: COLORS.text.primary,
    fontWeight: '600',
  },
})
