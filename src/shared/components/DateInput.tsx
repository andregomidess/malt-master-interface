import React, { useState, useRef } from 'react'
import {
  View,
  StyleSheet,
  TouchableOpacity,
  ViewStyle,
  TextStyle,
  Text,
  Platform,
} from 'react-native'
import { BiCalendar } from 'react-icons/bi'
import { COLORS } from '../styles/colors'
import { FONT_FAMILY, FONT_SIZE, FONT_WEIGHT } from '../styles/typography'

interface DateInputProps {
  label?: string
  value?: string
  onChange?: (date: string | null) => void
  placeholder?: string
  containerStyle?: ViewStyle
  error?: boolean
  errorMessage?: string
  minDate?: string
  maxDate?: string
  disabled?: boolean
}

export const DateInput: React.FC<DateInputProps> = ({
  label,
  value,
  onChange,
  placeholder = 'Selecione uma data',
  containerStyle,
  error = false,
  errorMessage,
  minDate,
  maxDate,
  disabled = false,
}) => {
  const [isFocused, setIsFocused] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value || null
    onChange?.(newValue)
  }

  const handleContainerPress = () => {
    if (!disabled && inputRef.current) {
      if (typeof inputRef.current.showPicker === 'function') {
        inputRef.current.showPicker()
      } else {
        inputRef.current.click()
      }
    }
  }

  const formatDateForDisplay = (dateString: string | undefined): string => {
    if (!dateString) return ''

    try {
      const date = new Date(dateString + 'T00:00:00')
      if (isNaN(date.getTime())) return dateString

      const day = String(date.getDate()).padStart(2, '0')
      const month = String(date.getMonth() + 1).padStart(2, '0')
      const year = date.getFullYear()

      return `${day}/${month}/${year}`
    } catch {
      return dateString
    }
  }

  const displayValue = formatDateForDisplay(value)

  return (
    <View style={styles.wrapper}>
      {label && <Text style={styles.label}>{label}</Text>}
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={handleContainerPress}
        disabled={disabled}
        style={[
          styles.container,
          isFocused && styles.containerFocused,
          error && styles.containerError,
          disabled && styles.containerDisabled,
          containerStyle,
        ]}
      >
        <View style={styles.iconLeft}>
          <BiCalendar size={20} color={COLORS.icons} />
        </View>

        <View style={styles.inputWrapper}>
          {Platform.OS === 'web' ? (
            <>
              <input
                ref={inputRef}
                type="date"
                value={value || ''}
                onChange={handleDateChange}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                min={minDate}
                max={maxDate}
                disabled={disabled}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  opacity: 0,
                  cursor: 'pointer',
                  zIndex: 2,
                  border: 'none',
                  background: 'transparent',
                  padding: 0,
                  margin: 0,
                  fontSize: 'inherit',
                  fontFamily: 'inherit',
                }}
                aria-label={label || 'Selecione uma data'}
              />
              <Text
                style={[
                  styles.displayText,
                  !value && styles.placeholderText,
                  disabled && styles.disabledText,
                ]}
                pointerEvents="none"
              >
                {value ? displayValue : placeholder}
              </Text>
            </>
          ) : (
            <Text
              style={[
                styles.displayText,
                !value && styles.placeholderText,
                disabled && styles.disabledText,
              ]}
            >
              {value ? displayValue : placeholder}
            </Text>
          )}
        </View>
      </TouchableOpacity>

      {error && errorMessage && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{errorMessage}</Text>
        </View>
      )}
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
    backgroundColor: COLORS.neutral.white,
    borderWidth: 1,
    borderColor: COLORS.border.light,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 10,
    ...(Platform.OS === 'web' && { cursor: 'pointer' }),
  } as ViewStyle,
  containerFocused: {
    borderColor: COLORS.brand.primary,
    borderWidth: 2,
  },
  containerError: {
    borderColor: COLORS.status.error,
    borderWidth: 2,
  },
  containerDisabled: {
    backgroundColor: COLORS.neutral.gray[100],
    opacity: 0.6,
    ...(Platform.OS === 'web' && { cursor: 'not-allowed' }),
  } as ViewStyle,
  iconLeft: {
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  inputWrapper: {
    flex: 1,
    position: 'relative',
  },
  displayText: {
    fontFamily: FONT_FAMILY.primary,
    fontSize: FONT_SIZE.sm,
    fontWeight: FONT_WEIGHT.normal,
    color: COLORS.text.primary,
  } as TextStyle,
  placeholderText: {
    color: COLORS.text.tertiary,
  } as TextStyle,
  disabledText: {
    color: COLORS.text.tertiary,
  } as TextStyle,
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
})
