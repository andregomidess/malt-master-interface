import { View, StyleSheet } from 'react-native'
import { InputText } from '../../../shared/components/InputText'
import { BiEnvelope } from 'react-icons/bi'
import { COLORS } from '../../../shared/styles/colors'
import { Button } from '../../../shared/components/Button'
import { useNavigate } from 'react-router'
import { z } from 'zod/v3'
import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

export interface ForgotPasswordFormProps {
  onSubmit: (data: ForgotPasswordFormType) => void
}

const schema = z.object({
  email: z.string().email('E-mail inválido').min(1, 'O e-mail é obrigatório.'),
})

export type ForgotPasswordFormType = z.infer<typeof schema>

export const ForgotPasswordForm = ({ onSubmit }: ForgotPasswordFormProps) => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormType>({
    resolver: zodResolver(schema),
  })

  const navigate = useNavigate()

  return (
    <View style={styles.container}>
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
      <View style={styles.buttonsContainer}>
        <Button onPress={handleSubmit(onSubmit)}>Enviar</Button>
        <Button
          variant="outline"
          onPress={() => {
            navigate('/sign-in')
          }}
        >
          Voltar para o login
        </Button>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    paddingHorizontal: 32,
  },
  buttonsContainer: {
    gap: 16,
    marginTop: 20,
  },
})
