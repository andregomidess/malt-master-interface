import React, { useState, useEffect } from 'react'
import { View, StyleSheet } from 'react-native'
import { RecipeModal } from '../Modal'
import { Select } from '../Select'
import { Button } from '../../../../shared/components/Button'
import { Text } from '../../../../shared/components/Typography'
import { COLORS } from '../../../../shared/styles/colors'
import {
  useFermentationProfilesLoadOptions,
  useFermentationProfileById,
} from '../../../profiles/hooks/useFermentationProfiles'
import { RecipeFermentation } from '../../context/RecipeContext'

interface SelectFermentationProfileModalProps {
  visible: boolean
  onClose: () => void
  onSelect: (fermentation: RecipeFermentation) => void
  currentFermentationProfileId?: string
}

export const SelectFermentationProfileModal: React.FC<
  SelectFermentationProfileModalProps
> = ({ visible, onClose, onSelect, currentFermentationProfileId }) => {
  const loadFermentationOptions = useFermentationProfilesLoadOptions()
  const [selectedProfileId, setSelectedProfileId] = useState<string>(
    currentFermentationProfileId || '',
  )

  // Resetar seleção quando o modal abrir com um perfil diferente
  useEffect(() => {
    if (visible) {
      setSelectedProfileId(currentFermentationProfileId || '')
    }
  }, [visible, currentFermentationProfileId])

  const { data: selectedProfile } =
    useFermentationProfileById(selectedProfileId)

  const handleSelect = () => {
    if (!selectedProfileId || !selectedProfile) {
      return
    }

    onSelect({
      fermentationProfileId: selectedProfileId,
      fermentationProfile: {
        id: selectedProfile.id,
        name: selectedProfile.name,
        estimatedAttenuation: selectedProfile.estimatedAttenuation,
      },
    })

    onClose()
  }

  const handleRemove = () => {
    onSelect({
      fermentationProfileId: undefined,
      fermentationProfile: undefined,
    })
    onClose()
  }

  const isValid = !!selectedProfileId && !!selectedProfile

  return (
    <RecipeModal
      visible={visible}
      onClose={onClose}
      title="Selecionar Perfil de Fermentação"
    >
      <View style={styles.form}>
        <View style={styles.field}>
          <Select
            label="Perfil de Fermentação *"
            placeholder="Selecione um perfil"
            value={selectedProfileId}
            options={[]}
            loadOptions={loadFermentationOptions}
            selectedLabel={selectedProfile?.name}
            onSelect={setSelectedProfileId}
            error={!selectedProfileId}
            errorMessage={
              !selectedProfileId
                ? 'Selecione um perfil de fermentação'
                : undefined
            }
          />
        </View>

        {selectedProfile && (
          <View style={styles.info}>
            <Text variant="bodySmall" style={styles.infoLabel}>
              Tipo: {selectedProfile.type}
            </Text>
            {selectedProfile.estimatedAttenuation && (
              <Text variant="bodySmall" style={styles.infoLabel}>
                Atenuação Estimada: {selectedProfile.estimatedAttenuation}%
              </Text>
            )}
            {selectedProfile.observations && (
              <Text variant="bodySmall" style={styles.infoText}>
                {selectedProfile.observations}
              </Text>
            )}
          </View>
        )}

        <View style={styles.actions}>
          {currentFermentationProfileId && (
            <Button variant="ghost" size="medium" onPress={handleRemove}>
              <Text variant="button" style={{ color: COLORS.status.error }}>
                Remover
              </Text>
            </Button>
          )}
          <Button variant="ghost" size="medium" onPress={onClose}>
            Cancelar
          </Button>
          <Button
            variant="primary"
            size="medium"
            onPress={handleSelect}
            disabled={!isValid}
          >
            Selecionar
          </Button>
        </View>
      </View>
    </RecipeModal>
  )
}

const styles = StyleSheet.create({
  form: {
    gap: 16,
  },
  field: {
    marginBottom: 8,
  },
  info: {
    backgroundColor: COLORS.neutral.gray[50],
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  infoLabel: {
    fontWeight: '500',
    color: COLORS.text.primary,
    marginBottom: 4,
  },
  infoText: {
    color: COLORS.text.secondary,
    marginTop: 8,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
    marginTop: 8,
  },
})
