import React, { useRef, useState, useCallback } from 'react'
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  ScrollView,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from 'react-native'
import { COLORS } from '../../../shared/styles/colors'
import {
  FONT_FAMILY,
  FONT_SIZE,
  FONT_WEIGHT,
} from '../../../shared/styles/typography'
import { BiChevronLeft, BiChevronRight } from 'react-icons/bi'

interface Tab {
  key: string
  label: string
}

interface TabsProps {
  tabs: Tab[]
  activeTab: string
  onTabChange: (tabKey: string) => void
}

export const Tabs: React.FC<TabsProps> = ({ tabs, activeTab, onTabChange }) => {
  const scrollViewRef = useRef<ScrollView>(null)
  const [showLeftArrow, setShowLeftArrow] = useState(false)
  const [showRightArrow, setShowRightArrow] = useState(true)

  const handleScroll = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      const { contentOffset, contentSize, layoutMeasurement } =
        event.nativeEvent
      const scrollX = contentOffset.x
      const scrollWidth = contentSize.width
      const containerWidth = layoutMeasurement.width

      setShowLeftArrow(scrollX > 0)
      setShowRightArrow(scrollX < scrollWidth - containerWidth - 10)
    },
    [],
  )

  const scrollLeft = useCallback(() => {
    scrollViewRef.current?.scrollTo({ x: 0, animated: true })
  }, [])

  const scrollRight = useCallback(() => {
    scrollViewRef.current?.scrollToEnd({ animated: true })
  }, [])

  const scrollToTab = useCallback(
    (tabKey: string) => {
      const tabIndex = tabs.findIndex(tab => tab.key === tabKey)
      if (tabIndex !== -1 && scrollViewRef.current) {
        // Estimativa: cada tab tem aproximadamente 100px de largura
        const estimatedTabWidth = 100
        const scrollX = tabIndex * estimatedTabWidth
        scrollViewRef.current.scrollTo({ x: scrollX, animated: true })
      }
    },
    [tabs],
  )

  // Scroll para a tab ativa quando ela mudar
  React.useEffect(() => {
    scrollToTab(activeTab)
  }, [activeTab, scrollToTab])

  return (
    <View style={styles.container}>
      {showLeftArrow && (
        <TouchableOpacity
          style={styles.arrowButton}
          onPress={scrollLeft}
          activeOpacity={0.7}
        >
          <BiChevronLeft size={20} color={COLORS.brand.primary} />
        </TouchableOpacity>
      )}
      <ScrollView
        ref={scrollViewRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.scrollView}
        contentContainerStyle={[
          styles.contentContainer,
          showLeftArrow && styles.contentContainerWithLeftArrow,
          showRightArrow && styles.contentContainerWithRightArrow,
        ]}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        onContentSizeChange={() => {
          // Verificar se precisa mostrar setas quando o conteúdo carrega
          if (scrollViewRef.current) {
            setTimeout(() => {
              // Trigger um scroll mínimo para atualizar estado das setas
              scrollViewRef.current?.scrollTo({ x: 0, animated: false })
            }, 50)
          }
        }}
      >
        {tabs.map(tab => {
          const isActive = activeTab === tab.key
          return (
            <TouchableOpacity
              key={tab.key}
              style={styles.tab}
              onPress={() => onTabChange(tab.key)}
              activeOpacity={0.7}
            >
              <Text style={[styles.tabText, isActive && styles.tabTextActive]}>
                {tab.label}
              </Text>
              {isActive && <View style={styles.indicator} />}
            </TouchableOpacity>
          )
        })}
      </ScrollView>
      {showRightArrow && (
        <TouchableOpacity
          style={[styles.arrowButton, styles.arrowButtonRight]}
          onPress={scrollRight}
          activeOpacity={0.7}
        >
          <BiChevronRight size={20} color={COLORS.brand.primary} />
        </TouchableOpacity>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border.light,
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 0,
  },
  contentContainerWithLeftArrow: {
    paddingLeft: 40,
  },
  contentContainerWithRightArrow: {
    paddingRight: 40,
  },
  tab: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    paddingBottom: 12,
    position: 'relative',
    marginRight: 4,
    minHeight: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabText: {
    fontFamily: FONT_FAMILY.primary,
    fontSize: FONT_SIZE.sm,
    fontWeight: FONT_WEIGHT.medium,
    color: COLORS.text.secondary,
  },
  tabTextActive: {
    color: COLORS.brand.primary,
    fontWeight: FONT_WEIGHT.semiBold,
  },
  indicator: {
    position: 'absolute',
    bottom: -1,
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: COLORS.brand.primary,
    borderRadius: 2,
  },
  arrowButton: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 40,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.neutral.white,
    zIndex: 10,
    borderRightWidth: 1,
    borderRightColor: COLORS.border.light,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 2, height: 0 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  arrowButtonRight: {
    left: 'auto',
    right: 0,
    borderRightWidth: 0,
    borderLeftWidth: 1,
    borderLeftColor: COLORS.border.light,
    shadowOffset: { width: -2, height: 0 },
  },
})
