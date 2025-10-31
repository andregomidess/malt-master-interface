import { View, StyleSheet, TouchableOpacity } from 'react-native'
import { Controller, useFormContext } from 'react-hook-form'
import { InputText } from '../../../shared/components/InputText'
import { COLORS } from '../../../shared/styles/colors'
import { BiWorld } from 'react-icons/bi'
import { CreateAccountFormData } from './CreateAccountForm'
import { Text } from '../../../shared/components/Typography'

export const CreateAccountFormStepThree = () => {
  const {
    control,
    setValue,
    watch,
    formState: { errors },
  } = useFormContext<CreateAccountFormData>()

  const selectedGender = watch('gender')

  // const handlePhotoSelect = () => {
  //   // Aqui você implementaria a lógica de seleção de foto
  //   // Por enquanto, vamos apenas mostrar um placeholder
  //   const input = document.createElement('input')
  //   input.type = 'file'
  //   input.accept = 'image/*'
  //   input.onchange = (e: Event) => {
  //     const target = e.target as HTMLInputElement
  //     const file = target.files?.[0]
  //     if (file) {
  //       const reader = new FileReader()
  //       reader.onload = (event: ProgressEvent<FileReader>) => {
  //         const result = event.target?.result as string
  //         setValue('photo', result)
  //       }
  //       reader.readAsDataURL(file)
  //     }
  //   }
  //   input.click()
  // }

  const handleGenderSelect = (gender: string) => {
    setValue('gender', gender)
  }

  return (
    <View style={styles.container}>
      {/* Seleção de foto */}
      {/* <View style={styles.photoSection}>
        <Text
          variant="bodySmall"
          style={{ color: COLORS.text.secondary, marginBottom: 12 }}
        >
          Foto de perfil (opcional)
        </Text>
        <TouchableOpacity
          style={styles.photoButton}
          onPress={handlePhotoSelect}
        >
          {selectedPhoto ? (
            <Image
              source={{ uri: selectedPhoto }}
              style={styles.photoPreview}
            />
          ) : (
            <View style={styles.photoPlaceholder}>
              <BiCamera size={32} color={COLORS.text.tertiary} />
              <Text
                variant="bodySmall"
                style={{ color: COLORS.text.tertiary, marginTop: 8 }}
              >
                Adicionar foto
              </Text>
            </View>
          )}
        </TouchableOpacity>
      </View> */}

      {/* País */}
      <View style={styles.inputWrapper}>
        <Controller
          control={control}
          name="country"
          render={({ field: { value, onChange } }) => (
            <InputText
              label="País"
              leftIcon={<BiWorld size={20} color={COLORS.icons} />}
              placeholder="País"
              value={value}
              onChangeText={onChange}
              autoCapitalize="words"
              error={!!errors.country}
              errorMessage={errors.country?.message}
            />
          )}
        />
      </View>

      <View style={styles.inputWrapper}>
        <Text
          variant="bodySmall"
          style={{ color: COLORS.text.secondary, marginBottom: 8 }}
        >
          Gênero
        </Text>
        <View style={styles.genderContainer}>
          <TouchableOpacity
            style={[
              styles.genderButton,
              selectedGender === 'male' && styles.genderButtonSelected,
            ]}
            onPress={() => handleGenderSelect('male')}
          >
            <Text
              variant="body"
              style={{
                color:
                  selectedGender === 'male'
                    ? COLORS.neutral.white
                    : COLORS.text.secondary,
              }}
            >
              Masculino
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.genderButton,
              selectedGender === 'female' && styles.genderButtonSelected,
            ]}
            onPress={() => handleGenderSelect('female')}
          >
            <Text
              variant="body"
              style={{
                color:
                  selectedGender === 'female'
                    ? COLORS.neutral.white
                    : COLORS.text.secondary,
              }}
            >
              Feminino
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.genderButton,
              selectedGender === 'other' && styles.genderButtonSelected,
            ]}
            onPress={() => handleGenderSelect('other')}
          >
            <Text
              variant="body"
              style={{
                color:
                  selectedGender === 'other'
                    ? COLORS.neutral.white
                    : COLORS.text.secondary,
              }}
            >
              Outro
            </Text>
          </TouchableOpacity>
        </View>
        {errors.gender && (
          <Text
            variant="bodySmall"
            style={{ color: COLORS.status.error, marginTop: 4 }}
          >
            {errors.gender.message}
          </Text>
        )}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  photoSection: {
    alignItems: 'center',
    marginBottom: 24,
  },
  photoButton: {
    width: 120,
    height: 120,
    borderRadius: 60,
    overflow: 'hidden',
  },
  photoPlaceholder: {
    width: '100%',
    height: '100%',
    backgroundColor: COLORS.neutral.gray[100],
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: COLORS.border.light,
    borderStyle: 'dashed',
  },
  photoPreview: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  inputWrapper: {
    marginBottom: 16,
  },
  genderContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  genderButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.border.light,
    backgroundColor: COLORS.neutral.white,
    alignItems: 'center',
  },
  genderButtonSelected: {
    backgroundColor: COLORS.brand.primary,
    borderColor: COLORS.brand.primary,
  },
})
