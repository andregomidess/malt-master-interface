import { View, StyleSheet } from 'react-native'
import { InputText } from '../../../shared/components/InputText'
import { BiLock } from 'react-icons/bi'
import { COLORS } from '../../../shared/styles/colors'
import { Button } from '../../../shared/components/Button'
import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod/v3'
import { useState } from 'react'
import { EyeIcon, EyeOffIcon } from '../../../shared/components/Icons'

const schema = z
  .object({
    password: z.string().min(8, 'A senha deve ter no mínimo 8 caracteres'),
    confirmPassword: z
      .string()
      .min(8, 'A senha deve ter no mínimo 8 caracteres'),
  })
  .refine(data => data.password === data.confirmPassword, {
    message: 'As senhas não coincidem',
    path: ['confirmPassword'],
  })

export type ChangePasswordFormType = z.infer<typeof schema>

export interface ChangePasswordFormProps {
  onSubmit: (data: ChangePasswordFormType) => void
}

export const ChangePasswordForm = ({ onSubmit }: ChangePasswordFormProps) => {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ChangePasswordFormType>({
    resolver: zodResolver(schema),
  })
  return (
    <View style={styles.container}>
      <View style={styles.inputWrapper}>
        <Controller
          control={control}
          name="password"
          render={({ field: { value, onChange } }) => (
            <InputText
              label="Nova senha"
              leftIcon={<BiLock size={20} color={COLORS.icons} />}
              placeholder="••••••••"
              value={value}
              onChangeText={onChange}
              error={!!errors.password}
              errorMessage={errors.password?.message}
              secureTextEntry={!showPassword}
              rightIcon={showPassword ? <EyeIcon /> : <EyeOffIcon />}
              onRightIconPress={() => setShowPassword(!showPassword)}
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
              error={!!errors.confirmPassword}
              errorMessage={errors.confirmPassword?.message}
              secureTextEntry={!showConfirmPassword}
              rightIcon={showConfirmPassword ? <EyeIcon /> : <EyeOffIcon />}
              onRightIconPress={() =>
                setShowConfirmPassword(!showConfirmPassword)
              }
            />
          )}
        />
      </View>
      <Button children="Alterar senha" onPress={handleSubmit(onSubmit)} />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    paddingHorizontal: 32,
  },
  inputWrapper: {
    marginBottom: 16,
  },
})
