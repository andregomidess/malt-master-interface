import { View, StyleSheet } from 'react-native'
import { Controller, useFormContext } from 'react-hook-form'
import { InputText } from '../../../shared/components/InputText'
import { COLORS } from '../../../shared/styles/colors'
import { BiLock } from 'react-icons/bi'
import { EyeIcon, EyeOffIcon } from '../../../shared/components/Icons'
import { useState } from 'react'
import { CreateAccountFormData } from './CreateAccountForm'

export const CreateAccountFormStepTwo = () => {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const {
    control,
    formState: { errors },
  } = useFormContext<CreateAccountFormData>()

  return (
    <View style={styles.container}>
      <View style={styles.inputWrapper}>
        <Controller
          control={control}
          name="password"
          render={({ field: { value, onChange } }) => (
            <InputText
              label="Senha"
              leftIcon={<BiLock size={20} color={COLORS.icons} />}
              placeholder="••••••••"
              value={value}
              onChangeText={onChange}
              secureTextEntry={!showPassword}
              autoCapitalize="none"
              rightIcon={showPassword ? <EyeIcon /> : <EyeOffIcon />}
              onRightIconPress={() => setShowPassword(!showPassword)}
              error={!!errors.password}
              errorMessage={errors.password?.message}
            />
          )}
        />
      </View>

      <View style={styles.inputWrapper}>
        <Controller
          control={control}
          name="confirmPassword"
          render={({ field: { value, onChange } }) => (
            <InputText
              label="Confirmar senha"
              leftIcon={<BiLock size={20} color={COLORS.icons} />}
              placeholder="••••••••"
              value={value}
              onChangeText={onChange}
              secureTextEntry={!showConfirmPassword}
              autoCapitalize="none"
              rightIcon={showConfirmPassword ? <EyeIcon /> : <EyeOffIcon />}
              onRightIconPress={() =>
                setShowConfirmPassword(!showConfirmPassword)
              }
              error={!!errors.confirmPassword}
              errorMessage={errors.confirmPassword?.message}
            />
          )}
        />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  inputWrapper: {
    marginBottom: 16,
  },
})
