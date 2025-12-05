import React, { useRef } from 'react'
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ViewStyle,
} from 'react-native'
import { COLORS } from '../../../shared/styles/colors'
import {
  FONT_FAMILY,
  FONT_SIZE,
  FONT_WEIGHT,
} from '../../../shared/styles/typography'
import { BiImage, BiUpload } from 'react-icons/bi'
import toast from 'react-hot-toast'

interface ImageUploaderProps {
  imageUrl?: string | null
  onImageSelect: (imageUrl: string) => void
  containerStyle?: ViewStyle
}

// Limite máximo de tamanho do base64 (80KB para deixar margem de segurança)
const MAX_BASE64_SIZE = 80 * 1024
// Largura máxima da imagem (mantém proporção)
const MAX_IMAGE_WIDTH = 1200
// Qualidade de compressão (0.0 a 1.0)
const COMPRESSION_QUALITY = 0.7

// Função para comprimir imagem
const compressImage = (
  file: File,
  maxWidth: number,
  quality: number,
): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = e => {
      const img = new window.Image()
      img.onload = () => {
        const canvas = document.createElement('canvas')
        let width = img.width
        let height = img.height

        // Redimensiona se necessário
        if (width > maxWidth) {
          height = (height * maxWidth) / width
          width = maxWidth
        }

        canvas.width = width
        canvas.height = height

        const ctx = canvas.getContext('2d')
        if (!ctx) {
          reject(new Error('Não foi possível criar contexto do canvas'))
          return
        }

        ctx.drawImage(img, 0, 0, width, height)

        let currentQuality = quality
        let dataUrl = canvas.toDataURL('image/jpeg', currentQuality)
        let currentWidth = width
        let currentHeight = height

        while (dataUrl.length > MAX_BASE64_SIZE && currentQuality > 0.1) {
          currentQuality -= 0.1
          dataUrl = canvas.toDataURL('image/jpeg', currentQuality)
        }

        while (dataUrl.length > MAX_BASE64_SIZE && currentWidth > 200) {
          currentWidth = Math.floor(currentWidth * 0.8)
          currentHeight = Math.floor(currentHeight * 0.8)
          canvas.width = currentWidth
          canvas.height = currentHeight
          ctx.drawImage(img, 0, 0, currentWidth, currentHeight)
          dataUrl = canvas.toDataURL('image/jpeg', 0.6)
        }

        resolve(dataUrl)
      }
      img.onerror = () => {
        reject(new Error('Erro ao carregar imagem'))
      }
      img.src = e.target?.result as string
    }
    reader.onerror = () => {
      reject(new Error('Erro ao ler arquivo'))
    }
    reader.readAsDataURL(file)
  })
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({
  imageUrl,
  onImageSelect,
  containerStyle,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Validação de tipo de arquivo
    if (!file.type.startsWith('image/')) {
      toast.error('Por favor, selecione um arquivo de imagem')
      return
    }

    try {
      // Comprime a imagem antes de converter para base64
      const compressedBase64 = await compressImage(
        file,
        MAX_IMAGE_WIDTH,
        COMPRESSION_QUALITY,
      )

      if (compressedBase64.length > MAX_BASE64_SIZE) {
        toast.error(
          'A imagem é muito grande mesmo após compressão. Por favor, escolha uma imagem menor',
        )
        return
      }

      onImageSelect(compressedBase64)
    } catch (error) {
      console.error('Erro ao processar imagem:', error)
      toast.error('Erro ao processar a imagem')
    }
  }

  const handleClick = () => {
    fileInputRef.current?.click()
  }

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault()
    const file = e.dataTransfer.files[0]
    if (!file || !file.type.startsWith('image/')) {
      return
    }

    try {
      const compressedBase64 = await compressImage(
        file,
        MAX_IMAGE_WIDTH,
        COMPRESSION_QUALITY,
      )

      if (compressedBase64.length > MAX_BASE64_SIZE) {
        toast.error(
          'A imagem é muito grande mesmo após compressão. Por favor, escolha uma imagem menor',
        )
        return
      }

      onImageSelect(compressedBase64)
    } catch (error) {
      console.error('Erro ao processar imagem:', error)
      toast.error('Erro ao processar a imagem')
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  return (
    <View style={[styles.container, containerStyle]}>
      {imageUrl ? (
        <View style={styles.imageContainer}>
          <Image source={{ uri: imageUrl }} style={styles.image} />
          <TouchableOpacity
            style={styles.changeButton}
            onPress={handleClick}
            activeOpacity={0.7}
          >
            <Text style={styles.changeButtonText}>Alterar imagem</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <div
          style={styles.uploadArea as React.CSSProperties}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
        >
          <BiImage size={48} color={COLORS.text.tertiary} />
          <Text style={styles.uploadText}>
            Arraste e solte sua imagem aqui, ou
          </Text>
          <TouchableOpacity
            style={styles.uploadButton}
            onPress={handleClick}
            activeOpacity={0.7}
          >
            <BiUpload size={20} color={COLORS.brand.primary} />
            <Text style={styles.uploadButtonText}>Procure por uma imagem</Text>
          </TouchableOpacity>
          <Text style={styles.uploadHint}>Formato 16:9 recomendado</Text>
        </div>
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
    width: '100%',
  },
  imageContainer: {
    width: '100%',
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: COLORS.border.light,
  },
  image: {
    width: '100%',
    aspectRatio: 16 / 9,
    resizeMode: 'cover',
  },
  changeButton: {
    position: 'absolute',
    bottom: 16,
    right: 16,
    backgroundColor: COLORS.neutral.white,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  changeButtonText: {
    fontFamily: FONT_FAMILY.primary,
    fontSize: FONT_SIZE.sm,
    fontWeight: FONT_WEIGHT.medium,
    color: COLORS.brand.primary,
  },
  uploadArea: {
    width: '100%',
    aspectRatio: 16 / 9,
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: COLORS.border.default,
    borderRadius: 12,
    backgroundColor: COLORS.neutral.gray[50],
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    padding: 24,
  },
  uploadText: {
    fontFamily: FONT_FAMILY.primary,
    fontSize: FONT_SIZE.sm,
    fontWeight: FONT_WEIGHT.normal,
    color: COLORS.text.secondary,
    textAlign: 'center',
  },
  uploadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: COLORS.neutral.white,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.brand.primary,
  },
  uploadButtonText: {
    fontFamily: FONT_FAMILY.primary,
    fontSize: FONT_SIZE.sm,
    fontWeight: FONT_WEIGHT.medium,
    color: COLORS.brand.primary,
  },
  uploadHint: {
    fontFamily: FONT_FAMILY.primary,
    fontSize: FONT_SIZE.xs,
    fontWeight: FONT_WEIGHT.normal,
    color: COLORS.text.tertiary,
  },
})
