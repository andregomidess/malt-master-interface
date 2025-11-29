import React, { useEffect } from 'react'
import { View, StyleSheet, ScrollView } from 'react-native'
import { useNavigate } from 'react-router'
import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod/v3'
import { Layout } from '../../../shared/components/Layout'
import { Heading, Text } from '../../../shared/components/Typography'
import { InputText } from '../../../shared/components/InputText'
import { Button } from '../../../shared/components/Button'
import { Select } from '../../recipes/components/Select'
import { ProfilePhotoUploader } from '../components/ProfilePhotoUploader'
import { COLORS } from '../../../shared/styles/colors'
import { BiUser } from 'react-icons/bi'
import { countries } from '../../../shared/utils/countries'
import { useUserById } from '../hooks/useUserById'
import { useUpdateUser } from '../hooks/useUpdateUser'
import { UserGender, genderLabels } from '../interfaces/User'

const editProfileSchema = z.object({
  username: z.string().min(3, 'O nome deve ter no mínimo 3 caracteres'),
  country: z.string().min(2, 'O país é obrigatório'),
  gender: z.nativeEnum(UserGender, {
    required_error: 'O gênero é obrigatório',
  }),
  pictureUrl: z
    .string()
    .optional()
    .nullable()
    .refine(
      val => {
        if (!val) return true
        const MAX_BASE64_SIZE = 670 * 1024
        return val.length <= MAX_BASE64_SIZE
      },
      {
        message:
          'A imagem é muito grande. Por favor, escolha uma imagem menor (máximo 500KB)',
      },
    ),
})

export type EditProfileFormData = z.infer<typeof editProfileSchema>

export const EditProfile = () => {
  const navigate = useNavigate()

  // Pega o ID do usuário do localStorage
  const getUserFromStorage = () => {
    try {
      const userData = localStorage.getItem('user')
      if (userData) {
        const user = JSON.parse(userData)
        return user.id
      }
    } catch (error) {
      console.error('Erro ao ler usuário do localStorage:', error)
    }
    return undefined
  }

  const userId = getUserFromStorage()
  const { data: user, isLoading } = useUserById(userId)
  const { mutate: updateUser, isPending: isUpdating } = useUpdateUser()

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isValid },
  } = useForm<EditProfileFormData>({
    resolver: zodResolver(editProfileSchema),
    mode: 'onChange',
    defaultValues: {
      username: '',
      country: '',
      gender: UserGender.MALE,
      pictureUrl: null,
    },
  })

  useEffect(() => {
    if (user) {
      reset({
        username: user.username,
        country: user.country,
        gender: user.gender,
        pictureUrl: user.pictureUrl || null,
      })
    }
  }, [user, reset])

  const onSubmit = (data: EditProfileFormData) => {
    if (!userId) {
      return
    }

    // Não enviamos a senha nem o email, o backend vai preservar ambos
    updateUser(
      {
        id: userId,
        username: data.username,
        country: data.country,
        gender: data.gender,
        pictureUrl: data.pictureUrl,
      },
      {
        onSuccess: () => {
          setTimeout(() => {
            navigate('/profile')
          }, 500) // Pequeno delay para mostrar o toast
        },
      },
    )
  }

  const handleCancel = () => {
    navigate('/profile')
  }

  const genderOptions = Object.values(UserGender).map(gender => ({
    value: gender,
    label: genderLabels[gender],
  }))

  if (isLoading) {
    return (
      <Layout activeMenuItem="profile">
        <View style={styles.container}>
          <Text>Carregando...</Text>
        </View>
      </Layout>
    )
  }

  return (
    <Layout activeMenuItem="profile">
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
      >
        <View style={styles.header}>
          <Heading variant="h3" style={styles.title}>
            Editar Perfil
          </Heading>
        </View>

        <View style={styles.form}>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Foto de Perfil</Text>
            <Controller
              control={control}
              name="pictureUrl"
              render={({ field: { value, onChange } }) => (
                <View style={styles.profilePhotoContainer}>
                  <ProfilePhotoUploader
                    imageUrl={value || null}
                    onImageSelect={onChange}
                  />
                </View>
              )}
            />
          </View>

          <View style={styles.section}>
            <Controller
              control={control}
              name="username"
              render={({ field: { value, onChange } }) => (
                <InputText
                  label="Nome de usuário *"
                  leftIcon={<BiUser size={20} color={COLORS.icons} />}
                  placeholder="Nome de usuário"
                  value={value || ''}
                  onChangeText={onChange}
                  autoCapitalize="words"
                  error={!!errors.username}
                  errorMessage={errors.username?.message}
                />
              )}
            />
          </View>

          <View style={styles.section}>
            <Controller
              control={control}
              name="country"
              render={({ field: { value, onChange } }) => (
                <Select
                  label="País *"
                  placeholder="Selecione um país"
                  value={value || ''}
                  options={countries}
                  onSelect={onChange}
                  error={!!errors.country}
                  errorMessage={errors.country?.message}
                />
              )}
            />
          </View>

          <View style={styles.section}>
            <Controller
              control={control}
              name="gender"
              render={({ field: { value, onChange } }) => (
                <Select
                  label="Gênero *"
                  placeholder="Selecione o gênero"
                  value={value || ''}
                  options={genderOptions}
                  onSelect={onChange}
                  error={!!errors.gender}
                  errorMessage={errors.gender?.message}
                />
              )}
            />
          </View>

          <View style={styles.actions}>
            <Button variant="ghost" size="medium" onPress={handleCancel}>
              Cancelar
            </Button>
            <Button
              variant="primary"
              size="medium"
              onPress={handleSubmit(onSubmit)}
              disabled={!isValid || isUpdating}
            >
              {isUpdating ? 'Salvando...' : 'Salvar'}
            </Button>
          </View>
        </View>
      </ScrollView>
    </Layout>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 24,
    paddingBottom: 48,
  },
  header: {
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: COLORS.text.primary,
  },
  form: {
    gap: 16,
  },
  section: {
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text.primary,
    marginBottom: 12,
  },
  profilePhotoContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
    marginTop: 24,
    paddingTop: 24,
    borderTopWidth: 1,
    borderTopColor: COLORS.border.light,
  },
})
