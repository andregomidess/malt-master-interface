import { View, StyleSheet } from 'react-native'
import { Controller, useFormContext } from 'react-hook-form'
import { InputText } from '../../../shared/components/InputText'
import { COLORS } from '../../../shared/styles/colors'
import { BiUser, BiEnvelope } from 'react-icons/bi'
import { CreateAccountFormData } from './CreateAccountForm'

export const CreateAccountFormStepOne = () => {
  const {
    control,
    formState: { errors },
  } = useFormContext<CreateAccountFormData>()

  return (
    <View style={styles.container}>
      <View style={styles.inputWrapper}>
        <Controller
          control={control}
          name="username"
          render={({ field: { value, onChange } }) => (
            <InputText
              label="Nome de usuário"
              leftIcon={<BiUser size={20} color={COLORS.icons} />}
              placeholder="Nome de usuário"
              value={value}
              onChangeText={onChange}
              autoCapitalize="words"
              error={!!errors.username}
              errorMessage={errors.username?.message}
            />
          )}
        />
      </View>

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
