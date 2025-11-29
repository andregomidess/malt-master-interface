import React, { useRef } from 'react'
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native'
import toast from 'react-hot-toast'
import { COLORS } from '../../../shared/styles/colors'
import {
  FONT_FAMILY,
  FONT_SIZE,
  FONT_WEIGHT,
} from '../../../shared/styles/typography'
import { BiCamera } from 'react-icons/bi'

const MAX_FILE_SIZE = 500 * 1024
const MAX_BASE64_SIZE = 670 * 1024

interface ProfilePhotoUploaderProps {
  imageUrl?: string | null
  onImageSelect: (imageUrl: string) => void
}

export const ProfilePhotoUploader: React.FC<ProfilePhotoUploaderProps> = ({
  imageUrl,
  onImageSelect,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Validação de tipo de arquivo
    if (!file.type.startsWith('image/')) {
      toast.error('Por favor, selecione um arquivo de imagem')
      return
    }

    // Validação de tamanho do arquivo
    if (file.size > MAX_FILE_SIZE) {
      const sizeInMB = (MAX_FILE_SIZE / (1024 * 1024)).toFixed(1)
      toast.error(`A imagem deve ter no máximo ${sizeInMB}MB`)
      return
    }

    // Converte para base64
    const reader = new FileReader()
    reader.onload = e => {
      const result = e.target?.result as string

      // Validação adicional do tamanho do base64
      if (result.length > MAX_BASE64_SIZE) {
        toast.error(
          'A imagem é muito grande. Por favor, escolha uma imagem menor',
        )
        return
      }

      onImageSelect(result)
      toast.success('Foto selecionada com sucesso!')
    }
    reader.onerror = () => {
      toast.error('Erro ao processar a imagem')
    }
    reader.readAsDataURL(file)
  }

  const handleClick = () => {
    fileInputRef.current?.click()
  }

  return (
    <View style={styles.container}>
      {imageUrl ? (
        <View style={styles.imageContainer}>
          <Image source={{ uri: imageUrl }} style={styles.image} />
          <TouchableOpacity
            style={styles.changeButton}
            onPress={handleClick}
            activeOpacity={0.7}
          >
            <BiCamera size={20} color={COLORS.neutral.white} />
          </TouchableOpacity>
        </View>
      ) : (
        <TouchableOpacity
          style={styles.uploadArea}
          onPress={handleClick}
          activeOpacity={0.7}
        >
          <BiCamera size={32} color={COLORS.text.tertiary} />
          <Text style={styles.uploadText}>Adicionar foto</Text>
        </TouchableOpacity>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        style={{ display: 'none' }}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  imageContainer: {
    width: 150,
    height: 150,
    borderRadius: 75,
    overflow: 'hidden',
    borderWidth: 3,
    borderColor: COLORS.border.light,
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  changeButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    left: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    paddingVertical: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  uploadArea: {
    width: 150,
    height: 150,
    borderRadius: 75,
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: COLORS.border.default,
    backgroundColor: COLORS.neutral.gray[50],
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  uploadText: {
    fontFamily: FONT_FAMILY.primary,
    fontSize: FONT_SIZE.sm,
    fontWeight: FONT_WEIGHT.medium,
    color: COLORS.text.secondary,
    textAlign: 'center',
  },
})
