import React, { useState, useEffect } from 'react'
import { View, StyleSheet } from 'react-native'
import { RecipeModal } from '../Modal'
import { Select } from '../Select'
import { Button } from '../../../../shared/components/Button'
import { Text } from '../../../../shared/components/Typography'
import { COLORS } from '../../../../shared/styles/colors'
import {
  useCarbonationProfilesLoadOptions,
  useCarbonationProfileById,
} from '../../../profiles/hooks/useCarbonationProfiles'
import { RecipeCarbonation } from '../../context/RecipeContext'

interface SelectCarbonationProfileModalProps {
  visible: boolean
  onClose: () => void
  onSelect: (carbonation: RecipeCarbonation) => void
  currentCarbonationProfileId?: string
}

export const SelectCarbonationProfileModal: React.FC<
  SelectCarbonationProfileModalProps
> = ({ visible, onClose, onSelect, currentCarbonationProfileId }) => {
  const loadCarbonationOptions = useCarbonationProfilesLoadOptions()
  const [selectedProfileId, setSelectedProfileId] = useState<string>(
    currentCarbonationProfileId || '',
  )

  // Resetar seleção quando o modal abrir com um perfil diferente
  useEffect(() => {
    if (visible) {
      setSelectedProfileId(currentCarbonationProfileId || '')
    }
  }, [visible, currentCarbonationProfileId])

  const { data: selectedProfile } = useCarbonationProfileById(selectedProfileId)

  const handleSelect = () => {
    if (!selectedProfileId || !selectedProfile) {
      return
    }

    onSelect({
      carbonationProfileId: selectedProfileId,
      carbonationProfile: {
        id: selectedProfile.id,
        name: selectedProfile.name,
        targetCO2Volumes: selectedProfile.targetCO2Volumes,
      },
    })

    onClose()
  }

  const handleRemove = () => {
    onSelect({
      carbonationProfileId: undefined,
      carbonationProfile: undefined,
    })
    onClose()
  }

  const isValid = !!selectedProfileId && !!selectedProfile

  return (
    <RecipeModal
      visible={visible}
      onClose={onClose}
      title="Selecionar Perfil de Carbonatação"
    >
      <View style={styles.form}>
        <View style={styles.field}>
          <Select
            label="Perfil de Carbonatação *"
            placeholder="Selecione um perfil"
            value={selectedProfileId}
            options={[]}
            loadOptions={loadCarbonationOptions}
            selectedLabel={selectedProfile?.name}
            onSelect={setSelectedProfileId}
            error={!selectedProfileId}
            errorMessage={
              !selectedProfileId
                ? 'Selecione um perfil de carbonatação'
                : undefined
            }
          />
        </View>

        {selectedProfile && (
          <View style={styles.info}>
            <Text variant="bodySmall" style={styles.infoLabel}>
              Tipo: {selectedProfile.type}
            </Text>
            <Text variant="bodySmall" style={styles.infoLabel}>
              CO2 Volumes: {selectedProfile.targetCO2Volumes}
            </Text>
            {selectedProfile.observations && (
              <Text variant="bodySmall" style={styles.infoText}>
                {selectedProfile.observations}
              </Text>
            )}
          </View>
        )}

        <View style={styles.actions}>
          {currentCarbonationProfileId && (
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
