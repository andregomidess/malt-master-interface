import React, { useState, useMemo, useCallback, useRef } from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  FlatList,
  TextInput,
  ViewStyle,
  ListRenderItem,
  ActivityIndicator,
} from 'react-native'
import { COLORS } from '../../../shared/styles/colors'
import {
  FONT_FAMILY,
  FONT_SIZE,
  FONT_WEIGHT,
} from '../../../shared/styles/typography'
import { BiChevronDown, BiCheck, BiSearch } from 'react-icons/bi'

interface SelectOption {
  value: string
  label: string
}

export interface LoadOptionsParams {
  search: string
  page: number
}

export interface LoadOptionsResult {
  options: SelectOption[]
  hasMore: boolean
}

interface SelectProps {
  label?: string
  placeholder?: string
  value?: string
  options: SelectOption[]
  onSelect: (value: string) => void
  error?: boolean
  errorMessage?: string
  containerStyle?: ViewStyle
  disabled?: boolean
  searchPlaceholder?: string
  loadOptions?: (params: LoadOptionsParams) => Promise<LoadOptionsResult>
  selectedLabel?: string
}

const INITIAL_NUM_TO_RENDER = 20
const PAGE_SIZE = 20

export const Select: React.FC<SelectProps> = ({
  label,
  placeholder = 'Selecione uma opção',
  value,
  options,
  onSelect,
  error = false,
  errorMessage,
  containerStyle,
  disabled = false,
  searchPlaceholder = 'Buscar...',
  loadOptions,
  selectedLabel,
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [asyncOptions, setAsyncOptions] = useState<SelectOption[]>([])
  const [asyncPage, setAsyncPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const searchDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const isAsync = !!loadOptions
  const displayOptions = isAsync ? asyncOptions : options

  const selectedOption = useMemo(() => {
    const found =
      options.find(opt => opt.value === value) ??
      displayOptions.find(opt => opt.value === value)
    if (found) return found
    if (value && selectedLabel) return { value, label: selectedLabel }
    return undefined
  }, [value, options, displayOptions, selectedLabel])

  const filteredOptions = useMemo(() => {
    if (isAsync) return displayOptions
    if (!searchQuery.trim()) return options
    const query = searchQuery.toLowerCase().trim()
    return options.filter(opt => opt.label.toLowerCase().includes(query))
  }, [isAsync, displayOptions, options, searchQuery])

  const fetchOptions = useCallback(
    async (search: string, page: number, append: boolean) => {
      if (!loadOptions) return
      const setLoading = page === 1 ? setIsLoading : setIsLoadingMore
      setLoading(true)
      try {
        const result = await loadOptions({ search, page })
        setAsyncOptions(prev =>
          append ? [...prev, ...result.options] : result.options,
        )
        setHasMore(result.hasMore)
        setAsyncPage(page)
      } finally {
        setLoading(false)
      }
    },
    [loadOptions],
  )

  const handleSelect = (optionValue: string) => {
    onSelect(optionValue)
    setIsOpen(false)
    setSearchQuery('')
  }

  const handleClose = () => {
    if (searchDebounceRef.current) {
      clearTimeout(searchDebounceRef.current)
      searchDebounceRef.current = null
    }
    setIsOpen(false)
    setSearchQuery('')
    if (isAsync) {
      setAsyncOptions([])
      setAsyncPage(1)
      setHasMore(true)
    }
  }

  const handleOpen = () => {
    if (!disabled) {
      setSearchQuery('')
      if (isAsync) {
        setAsyncOptions([])
        setAsyncPage(1)
        setHasMore(true)
        fetchOptions('', 1, false)
      }
      setIsOpen(true)
    }
  }

  const handleSearchChange = (text: string) => {
    setSearchQuery(text)
    if (isAsync) {
      if (searchDebounceRef.current) clearTimeout(searchDebounceRef.current)
      searchDebounceRef.current = setTimeout(() => {
        setAsyncOptions([])
        setAsyncPage(1)
        setHasMore(true)
        fetchOptions(text, 1, false)
        searchDebounceRef.current = null
      }, 300)
    }
  }

  const handleLoadMore = useCallback(() => {
    if (isAsync && hasMore && !isLoading && !isLoadingMore) {
      fetchOptions(searchQuery, asyncPage + 1, true)
    }
  }, [
    isAsync,
    hasMore,
    isLoading,
    isLoadingMore,
    searchQuery,
    asyncPage,
    fetchOptions,
  ])

  const renderOption: ListRenderItem<SelectOption> = ({ item }) => (
    <TouchableOpacity
      style={[styles.option, value === item.value && styles.optionSelected]}
      onPress={() => handleSelect(item.value)}
      activeOpacity={0.7}
    >
      <Text
        style={[
          styles.optionText,
          value === item.value && styles.optionTextSelected,
        ]}
      >
        {item.label}
      </Text>
      {value === item.value && (
        <BiCheck size={20} color={COLORS.brand.primary} />
      )}
    </TouchableOpacity>
  )

  return (
    <View style={[styles.wrapper, containerStyle]}>
      {label && <Text style={styles.label}>{label}</Text>}
      <TouchableOpacity
        style={[
          styles.container,
          error && styles.containerError,
          disabled && styles.containerDisabled,
        ]}
        onPress={handleOpen}
        disabled={disabled}
        activeOpacity={0.7}
      >
        <Text
          style={[
            styles.selectedText,
            !selectedOption && styles.placeholderText,
          ]}
        >
          {selectedOption ? selectedOption.label : placeholder}
        </Text>
        <BiChevronDown size={20} color={COLORS.text.secondary} />
      </TouchableOpacity>

      {error && errorMessage && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{errorMessage}</Text>
        </View>
      )}

      <Modal
        visible={isOpen}
        transparent
        animationType="fade"
        onRequestClose={handleClose}
      >
        <View style={styles.modalOverlay}>
          <TouchableOpacity
            style={styles.modalBackdrop}
            activeOpacity={1}
            onPress={handleClose}
          />
          <View
            style={styles.modalContent}
            onStartShouldSetResponder={() => true}
          >
            <View style={styles.searchContainer}>
              <BiSearch
                size={18}
                color={COLORS.text.tertiary}
                style={styles.searchIcon}
              />
              <TextInput
                style={styles.searchInput}
                placeholder={searchPlaceholder}
                placeholderTextColor={COLORS.text.tertiary}
                value={searchQuery}
                onChangeText={handleSearchChange}
              />
            </View>
            {isLoading ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={COLORS.brand.primary} />
                <Text style={styles.loadingText}>Carregando...</Text>
              </View>
            ) : (
              <FlatList
                data={filteredOptions}
                renderItem={renderOption}
                keyExtractor={item => item.value}
                style={styles.optionsList}
                contentContainerStyle={styles.optionsListContent}
                initialNumToRender={INITIAL_NUM_TO_RENDER}
                maxToRenderPerBatch={PAGE_SIZE}
                windowSize={10}
                onEndReached={handleLoadMore}
                onEndReachedThreshold={0.5}
                ListFooterComponent={
                  isLoadingMore ? (
                    <View style={styles.loadingMoreContainer}>
                      <ActivityIndicator
                        size="small"
                        color={COLORS.brand.primary}
                      />
                      <Text style={styles.loadingMoreText}>
                        Carregando mais...
                      </Text>
                    </View>
                  ) : null
                }
                ListEmptyComponent={
                  <View style={styles.emptyContainer}>
                    <Text style={styles.emptyText}>
                      {searchQuery
                        ? 'Nenhum resultado encontrado'
                        : 'Nenhuma opção disponível'}
                    </Text>
                  </View>
                }
              />
            )}
          </View>
        </View>
      </Modal>
    </View>
  )
}

const styles = StyleSheet.create({
  wrapper: {
    width: '100%',
  },
  label: {
    fontFamily: FONT_FAMILY.primary,
    fontSize: FONT_SIZE.sm,
    fontWeight: FONT_WEIGHT.medium,
    color: COLORS.text.primary,
    marginBottom: 8,
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.neutral.white,
    borderWidth: 1,
    borderColor: COLORS.border.light,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 10,
    minHeight: 44,
  },
  containerError: {
    borderColor: COLORS.status.error,
    borderWidth: 2,
  },
  containerDisabled: {
    backgroundColor: COLORS.neutral.gray[100],
    opacity: 0.6,
  },
  selectedText: {
    flex: 1,
    fontFamily: FONT_FAMILY.primary,
    fontSize: FONT_SIZE.sm,
    fontWeight: FONT_WEIGHT.normal,
    color: COLORS.text.primary,
  },
  placeholderText: {
    color: COLORS.text.tertiary,
  },
  errorContainer: {
    marginTop: 4,
    paddingHorizontal: 4,
  },
  errorText: {
    fontFamily: FONT_FAMILY.primary,
    fontSize: FONT_SIZE.xs,
    color: COLORS.status.error,
    fontWeight: FONT_WEIGHT.normal,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalBackdrop: {
    ...StyleSheet.absoluteFillObject,
  },
  modalContent: {
    backgroundColor: COLORS.neutral.white,
    borderRadius: 12,
    width: '80%',
    maxHeight: '60%',
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    overflow: 'hidden',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border.light,
    backgroundColor: COLORS.neutral.gray[50],
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontFamily: FONT_FAMILY.primary,
    fontSize: FONT_SIZE.sm,
    color: COLORS.text.primary,
    paddingVertical: 8,
    paddingHorizontal: 0,
  },
  optionsList: {
    height: 320,
  },
  optionsListContent: {
    paddingBottom: 16,
  },
  loadingContainer: {
    height: 320,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
  },
  loadingText: {
    fontFamily: FONT_FAMILY.primary,
    fontSize: FONT_SIZE.sm,
    color: COLORS.text.tertiary,
  },
  loadingMoreContainer: {
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  loadingMoreText: {
    fontFamily: FONT_FAMILY.primary,
    fontSize: FONT_SIZE.xs,
    color: COLORS.text.tertiary,
  },
  emptyContainer: {
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    fontFamily: FONT_FAMILY.primary,
    fontSize: FONT_SIZE.sm,
    color: COLORS.text.tertiary,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border.light,
  },
  optionSelected: {
    backgroundColor: COLORS.neutral.gray[50],
  },
  optionText: {
    flex: 1,
    fontFamily: FONT_FAMILY.primary,
    fontSize: FONT_SIZE.sm,
    fontWeight: FONT_WEIGHT.normal,
    color: COLORS.text.primary,
  },
  optionTextSelected: {
    fontWeight: FONT_WEIGHT.semiBold,
    color: COLORS.brand.primary,
  },
})
