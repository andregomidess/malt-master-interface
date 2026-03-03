import React, { useState, useEffect } from 'react'
import { View, StyleSheet } from 'react-native'
import { RecipeModal } from '../Modal'
import { Select } from '../Select'
import { Button } from '../../../../shared/components/Button'
import { Text } from '../../../../shared/components/Typography'
import { COLORS } from '../../../../shared/styles/colors'
import {
  useMashProfilesLoadOptions,
  useMashProfileById,
} from '../../../profiles/hooks/useMashProfiles'
import { RecipeMash } from '../../context/RecipeContext'

interface SelectMashProfileModalProps {
  visible: boolean
  onClose: () => void
  onSelect: (mash: RecipeMash) => void
  currentMashProfileId?: string
}

export const SelectMashProfileModal: React.FC<SelectMashProfileModalProps> = ({
  visible,
  onClose,
  onSelect,
  currentMashProfileId,
}) => {
  const loadMashOptions = useMashProfilesLoadOptions()
  const [selectedProfileId, setSelectedProfileId] = useState<string>(
    currentMashProfileId || '',
  )

  // Resetar seleção quando o modal abrir com um perfil diferente
  useEffect(() => {
    if (visible) {
      setSelectedProfileId(currentMashProfileId || '')
    }
  }, [visible, currentMashProfileId])

  const { data: selectedProfile } = useMashProfileById(selectedProfileId)

  const handleSelect = () => {
    if (!selectedProfileId || !selectedProfile) {
      return
    }

    onSelect({
      mashProfileId: selectedProfileId,
      mashProfile: {
        id: selectedProfile.id,
        name: selectedProfile.name,
        estimatedEfficiency: selectedProfile.estimatedEfficiency,
        mashThickness: selectedProfile.mashThickness ?? null,
      },
    })

    onClose()
  }

  const handleRemove = () => {
    onSelect({
      mashProfileId: undefined,
      mashProfile: undefined,
    })
    onClose()
  }

  const isValid = !!selectedProfileId && !!selectedProfile

  return (
    <RecipeModal
      visible={visible}
      onClose={onClose}
      title="Selecionar Perfil de Mostura"
    >
      <View style={styles.form}>
        <View style={styles.field}>
          <Select
            label="Perfil de Mostura *"
            placeholder="Selecione um perfil"
            value={selectedProfileId}
            options={[]}
            loadOptions={loadMashOptions}
            selectedLabel={selectedProfile?.name}
            onSelect={setSelectedProfileId}
            error={!selectedProfileId}
            errorMessage={
              !selectedProfileId ? 'Selecione um perfil de mostura' : undefined
            }
          />
        </View>

        {selectedProfile && (
          <View style={styles.info}>
            <Text variant="bodySmall" style={styles.infoLabel}>
              Tipo: {selectedProfile.type}
            </Text>
            {selectedProfile.estimatedEfficiency && (
              <Text variant="bodySmall" style={styles.infoLabel}>
                Eficiência Estimada: {selectedProfile.estimatedEfficiency}%
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
          {currentMashProfileId && (
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
