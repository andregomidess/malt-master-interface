import React, { useState } from 'react'
import {
  View,
  TextInput,
  TextInputProps,
  StyleSheet,
  TouchableOpacity,
  ViewStyle,
  TextStyle,
  Text,
} from 'react-native'
import { COLORS } from '../styles/colors'
import { FONT_FAMILY, FONT_SIZE, FONT_WEIGHT } from '../styles/typography'

interface InputTextProps extends TextInputProps {
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
  onRightIconPress?: () => void
  containerStyle?: ViewStyle
  inputStyle?: TextStyle
  error?: boolean
  errorMessage?: string
}

export const InputText: React.FC<InputTextProps> = ({
  leftIcon,
  rightIcon,
  onRightIconPress,
  containerStyle,
  inputStyle,
  error = false,
  errorMessage,
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false)

  return (
    <View style={styles.wrapper}>
      <View
        style={[
          styles.container,
          isFocused && styles.containerFocused,
          error && styles.containerError,
          containerStyle,
        ]}
      >
        {leftIcon && <View style={styles.iconLeft}>{leftIcon}</View>}

        <TextInput
          style={[
            styles.input,
            leftIcon ? styles.inputWithLeftIcon : undefined,
            rightIcon ? styles.inputWithRightIcon : undefined,
            { outline: 'none' } as TextStyle,
            inputStyle,
          ]}
          placeholderTextColor={COLORS.text.tertiary}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          {...props}
        />

        {rightIcon && (
          <TouchableOpacity
            style={styles.iconRight}
            onPress={onRightIconPress}
            activeOpacity={0.7}
            disabled={!onRightIconPress}
          >
            {rightIcon}
          </TouchableOpacity>
        )}
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
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.neutral.white,
    borderWidth: 1,
    borderColor: COLORS.border.light,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    minHeight: 56,
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
    flex: 1,
    fontFamily: FONT_FAMILY.primary,
    fontSize: FONT_SIZE.base,
    fontWeight: FONT_WEIGHT.normal,
    color: COLORS.text.primary,
    padding: 0,
    margin: 0,
  },
  inputWithLeftIcon: {
    marginLeft: 12,
  },
  inputWithRightIcon: {
    marginRight: 12,
  },
  iconLeft: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconRight: {
    justifyContent: 'center',
    alignItems: 'center',
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
