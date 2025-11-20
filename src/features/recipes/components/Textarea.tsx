import React, { useState } from 'react'
import {
  View,
  Text,
  TextInput,
  TextInputProps,
  StyleSheet,
  ViewStyle,
  TextStyle,
} from 'react-native'
import { COLORS } from '../../../shared/styles/colors'
import {
  FONT_FAMILY,
  FONT_SIZE,
  FONT_WEIGHT,
} from '../../../shared/styles/typography'

interface TextareaProps extends Omit<TextInputProps, 'multiline'> {
  label?: string
  containerStyle?: ViewStyle
  inputStyle?: TextStyle
  error?: boolean
  errorMessage?: string
  rows?: number
}

export const Textarea: React.FC<TextareaProps> = ({
  label,
  containerStyle,
  inputStyle,
  error = false,
  errorMessage,
  rows = 4,
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false)

  return (
    <View style={[styles.wrapper, containerStyle]}>
      {label && <Text style={styles.label}>{label}</Text>}
      <View
        style={[
          styles.container,
          isFocused && styles.containerFocused,
          error && styles.containerError,
        ]}
      >
        <TextInput
          style={[
            styles.input,
            { minHeight: rows * 24 },
            { outline: 'none' } as TextStyle,
            inputStyle,
          ]}
          placeholderTextColor={COLORS.text.tertiary}
          multiline
          textAlignVertical="top"
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          {...props}
        />
      </View>
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
    backgroundColor: COLORS.neutral.white,
    borderWidth: 1,
    borderColor: COLORS.border.light,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  containerFocused: {
    borderColor: COLORS.brand.primary,
    borderWidth: 2,
  },
  containerError: {
    borderColor: COLORS.status.error,
    borderWidth: 2,
  },
  input: {
    fontFamily: FONT_FAMILY.primary,
    fontSize: FONT_SIZE.sm,
    fontWeight: FONT_WEIGHT.normal,
    color: COLORS.text.primary,
    padding: 0,
    margin: 0,
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
})
