import { View, StyleSheet } from 'react-native'
import { useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod/v3'
import { CreateAccountFormStepOne } from './CreateAccountFormStepOne'
import { CreateAccountFormStepTwo } from './CreateAccountFormStepTwo'
import { CreateAccountFormStepThree } from './CreateAccountFormStepThree'
import { Button } from '../../../shared/components/Button'
import { COLORS } from '../../../shared/styles/colors'
import { useNavigate } from 'react-router'

// Schema completo de validação
const createAccountSchema = z
  .object({
    username: z.string().min(3, 'O nome deve ter no mínimo 3 caracteres'),
    email: z.string().email('E-mail inválido').min(1, 'O e-mail é obrigatório'),
    password: z
      .string()
      .min(8, 'A senha deve ter no mínimo 8 caracteres')
      .regex(/[A-Z]/, 'A senha deve conter pelo menos uma letra maiúscula')
      .regex(/[a-z]/, 'A senha deve conter pelo menos uma letra minúscula')
      .regex(/[0-9]/, 'A senha deve conter pelo menos um número'),
    confirmPassword: z.string().min(1, 'Confirme sua senha'),
    photo: z.string().optional(),
    country: z.string().min(2, 'O país é obrigatório'),
    gender: z.string().min(1, 'O gênero é obrigatório'),
  })
  .refine(data => data.password === data.confirmPassword, {
    message: 'As senhas não coincidem',
    path: ['confirmPassword'],
  })

export type CreateAccountFormData = z.infer<typeof createAccountSchema>

export const CreateAccountForm = ({
  onSubmitRequest,
}: {
  onSubmitRequest: (data: CreateAccountFormData) => void
}) => {
  const [currentStep, setCurrentStep] = useState(1)
  const navigate = useNavigate()

  const methods = useForm<CreateAccountFormData>({
    resolver: zodResolver(createAccountSchema),
    mode: 'onChange',
    defaultValues: {
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
      country: '',
      gender: '',
    },
  })

  const handleNext = async () => {
    const fieldsToValidate = {
      1: ['username', 'email'],
      2: ['password', 'confirmPassword'],
      3: ['country', 'gender'],
    }[currentStep] as Array<keyof CreateAccountFormData>

    const isValid = await methods.trigger(fieldsToValidate)

    if (!isValid) return

    if (currentStep < 3) {
      setCurrentStep(currentStep + 1)
    } else {
      methods.handleSubmit(onSubmit)()
    }
  }

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    } else {
      navigate('/sign-in')
    }
  }

  const onSubmit = (data: CreateAccountFormData) => onSubmitRequest(data)

  const renderStepIndicators = () => (
    <View style={styles.indicatorsContainer}>
      {[1, 2, 3].map(step => (
        <View
          key={step}
          style={[
            styles.indicator,
            step === currentStep && styles.indicatorActive,
            step < currentStep && styles.indicatorCompleted,
          ]}
        />
      ))}
    </View>
  )

  return (
    <FormProvider {...methods}>
      <View style={styles.container}>
        {renderStepIndicators()}

        <View style={styles.formContent}>
          {currentStep === 1 && <CreateAccountFormStepOne />}
          {currentStep === 2 && <CreateAccountFormStepTwo />}
          {currentStep === 3 && <CreateAccountFormStepThree />}
        </View>

        <View style={styles.buttonsContainer}>
          <Button variant="outline" onPress={handleBack} style={styles.button}>
            {currentStep === 1 ? 'Voltar para login' : 'Voltar'}
          </Button>
          <Button onPress={handleNext} style={styles.button}>
            {currentStep === 3 ? 'Criar conta' : 'Próximo'}
          </Button>
        </View>
      </View>
    </FormProvider>
  )
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    paddingHorizontal: 32,
  },
  indicatorsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
  },
  indicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: COLORS.neutral.gray[200],
  },
  indicatorActive: {
    backgroundColor: COLORS.brand.primary,
    width: 14,
    height: 14,
    borderRadius: 7,
  },
  indicatorCompleted: {
    backgroundColor: COLORS.status.success,
  },
  formContent: {
    marginBottom: 16,
  },
  buttonsContainer: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 20,
  },
  button: {
    flex: 1,
  },
})
