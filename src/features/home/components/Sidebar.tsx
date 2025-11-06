import { View, StyleSheet, TouchableOpacity } from 'react-native'
import { Heading, Text } from '../../../shared/components/Typography'
import { COLORS } from '../../../shared/styles/colors'
import {
  BiBeer,
  BiBook,
  BiHomeAlt,
  BiHourglass,
  BiPackage,
  BiStar,
} from 'react-icons/bi'
import logoImage from '../../../assets/logo2.png'
import { Image } from 'react-native-web'
import { PiToolbox } from 'react-icons/pi'
import { GiBubbles } from 'react-icons/gi'
import { IoWaterOutline } from 'react-icons/io5'
import { HopsIcon } from '../icons/HopsIcon'
import { MaltIcon } from '../icons/MaltIcon'
import { useNavigate, useLocation } from 'react-router'

interface MenuItem {
  id: string
  label: string
  icon: React.ComponentType<{ size: number; color: string }>
  path: string
}

const menuItems: MenuItem[] = [
  { id: 'dashboard', label: 'Dashboard', icon: BiHomeAlt, path: '/dashboard' },
  { id: 'recipes', label: 'Receitas', icon: BiBook, path: '/recipes' },
  {
    id: 'brewings',
    label: 'Brassagens',
    icon: BiHourglass,
    path: '/brewings',
  },
  {
    id: 'stock',
    label: 'Estoque',
    icon: BiPackage,
    path: '/stock',
  },
  {
    id: 'equipment',
    label: 'Equipamentos',
    icon: PiToolbox,
    path: '/equipment',
  },
  {
    id: 'beer-styles',
    label: 'Estilos de Cerveja',
    icon: BiBeer,
    path: '/beer-styles',
  },
  {
    id: 'hops',
    label: 'Lúpulo',
    icon: HopsIcon,
    path: '/hops',
  },
  {
    id: 'fermentable',
    label: 'Fermentáveis',
    icon: MaltIcon,
    path: '/fermentable',
  },
  {
    id: 'yeast',
    label: 'Leveduras',
    icon: GiBubbles,
    path: '/yeast',
  },
  {
    id: 'water',
    label: 'Água',
    icon: IoWaterOutline,
    path: '/water',
  },
  {
    id: 'reviews',
    label: 'Avaliações',
    icon: BiStar,
    path: '/reviews',
  },
  // {
  //   id: 'community',
  //   label: 'Comunidade',
  //   icon: MdPeople,
  //   path: '/community',
  // },
  // { id: 'profile', label: 'Perfil', icon: BiUser, path: '/profile' },
]

interface SidebarProps {
  activeItem?: string
  onItemPress?: (itemId: string) => void
}

export const Sidebar = ({ activeItem, onItemPress }: SidebarProps) => {
  const navigate = useNavigate()
  const location = useLocation()

  const handleItemPress = (item: MenuItem) => {
    if (onItemPress) {
      onItemPress(item.id)
    }
    navigate(item.path)
  }

  const getActiveItem = () => {
    if (activeItem) return activeItem

    const currentPath = location.pathname
    const menuItem = menuItems.find(item => item.path === currentPath)
    return menuItem?.id || 'dashboard'
  }

  const currentActiveItem = getActiveItem()

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
          const isActive = currentActiveItem === item.id

          return (
            <TouchableOpacity
              key={item.id}
              style={[styles.menuItem, isActive && styles.menuItemActive]}
              onPress={() => handleItemPress(item)}
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
