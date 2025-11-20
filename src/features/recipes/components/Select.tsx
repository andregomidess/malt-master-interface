import React, { useState } from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  ScrollView,
  ViewStyle,
  TextStyle,
} from 'react-native'
import { COLORS } from '../../../shared/styles/colors'
import { FONT_FAMILY, FONT_SIZE, FONT_WEIGHT } from '../../../shared/styles/typography'
import { BiChevronDown, BiCheck } from 'react-icons/bi'

interface SelectOption {
  value: string
  label: string
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
}

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
}) => {
  const [isOpen, setIsOpen] = useState(false)

  const selectedOption = options.find(opt => opt.value === value)

  const handleSelect = (optionValue: string) => {
    onSelect(optionValue)
    setIsOpen(false)
  }

  return (
    <View style={[styles.wrapper, containerStyle]}>
      {label && <Text style={styles.label}>{label}</Text>}
      <TouchableOpacity
        style={[
          styles.container,
          error && styles.containerError,
          disabled && styles.containerDisabled,
        ]}
        onPress={() => !disabled && setIsOpen(true)}
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
        onRequestClose={() => setIsOpen(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setIsOpen(false)}
        >
          <View style={styles.modalContent}>
            <ScrollView style={styles.optionsList}>
              {options.map(option => (
                <TouchableOpacity
                  key={option.value}
                  style={[
                    styles.option,
                    value === option.value && styles.optionSelected,
                  ]}
                  onPress={() => handleSelect(option.value)}
                  activeOpacity={0.7}
                >
                  <Text
                    style={[
                      styles.optionText,
                      value === option.value && styles.optionTextSelected,
                    ]}
                  >
                    {option.label}
                  </Text>
                  {value === option.value && (
                    <BiCheck size={20} color={COLORS.brand.primary} />
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </TouchableOpacity>
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
  },
  optionsList: {
    maxHeight: 400,
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

