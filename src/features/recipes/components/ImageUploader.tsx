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

interface ImageUploaderProps {
  imageUrl?: string | null
  onImageSelect: (imageUrl: string) => void
  containerStyle?: ViewStyle
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({
  imageUrl,
  onImageSelect,
  containerStyle,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = e => {
        const result = e.target?.result as string
        onImageSelect(result)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleClick = () => {
    fileInputRef.current?.click()
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    const file = e.dataTransfer.files[0]
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader()
      reader.onload = e => {
        const result = e.target?.result as string
        onImageSelect(result)
      }
      reader.readAsDataURL(file)
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
