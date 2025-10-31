import { View, TouchableOpacity, StyleSheet } from 'react-native'
import { useState } from 'react'
import { COLORS } from '../../../shared/styles/colors'
import { FONT_FAMILY } from '../../../shared/styles/typography'
import { Text } from '../../../shared/components/Typography'
import { Button } from '../../../shared/components/Button'
import { BiEnvelope, BiLock } from 'react-icons/bi'
import { InputText } from '../../../shared/components/InputText'
import { EyeIcon, EyeOffIcon } from '../../../shared/components/Icons'
import { z } from 'zod/v3'
import { zodResolver } from '@hookform/resolvers/zod'
import { Controller, useForm } from 'react-hook-form'
import { useNavigate } from 'react-router'

export interface SignInFormProps {
  onSubmit: (body: SignInFormType) => void
}

const schema = z.object({
  email: z.string().email('E-mail inválido').min(1, 'O e-mail é obrigatório.'),
  password: z.string().min(1, 'A senha é obrigatória.'),
})

export type SignInFormType = z.infer<typeof schema>

export const SignInForm = ({ onSubmit }: SignInFormProps) => {
  const [showPassword, setShowPassword] = useState(false)
  const navigate = useNavigate()
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInFormType>({
    resolver: zodResolver(schema),
  })

  return (
    <View style={styles.container}>
      <View style={styles.inputWrapper}>
        <Controller
          control={control}
          name="email"
          render={({ field: { value, onChange } }) => (
            <InputText
              label="E-mail"
              leftIcon={<BiEnvelope size={20} color={COLORS.icons} />}
              placeholder="seu@email.com"
              value={value}
              onChangeText={onChange}
              keyboardType="email-address"
              autoCapitalize="none"
              autoComplete="email"
              error={!!errors.email}
              errorMessage={errors.email?.message}
            />
          )}
        />
      </View>

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
              errorMessage={errors.password?.message}
              error={!!errors.password}
            />
          )}
        />
      </View>

      <View style={styles.optionsRow}>
        <TouchableOpacity onPress={() => navigate('/forgot-password')}>
          <Text style={styles.forgotLink}>Esqueci minha senha</Text>
        </TouchableOpacity>
      </View>

      <Button onPress={handleSubmit(onSubmit)} style={styles.submitButton}>
        Entrar 🍺
      </Button>
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
  icon: {
    fontSize: 18,
    marginRight: 8,
  },
  input: {
    flex: 1,
    height: 48,
    fontSize: 14,
    fontFamily: FONT_FAMILY.primary,
    borderWidth: 0,
    paddingHorizontal: 0,
  },
  eyeButton: {
    padding: 4,
  },
  eyeIcon: {
    fontSize: 18,
  },
  optionsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 24,
  },
  rememberMe: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  rememberText: {
    fontSize: 14,
    fontFamily: FONT_FAMILY.primary,
    color: COLORS.text.secondary,
  },
  forgotLink: {
    fontSize: 14,
    fontFamily: FONT_FAMILY.primary,
    fontWeight: '500',
    color: COLORS.brand.primary,
  },
  submitButton: {
    marginBottom: 20,
  },
})
