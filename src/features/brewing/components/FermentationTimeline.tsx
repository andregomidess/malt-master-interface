import { View, StyleSheet } from 'react-native'
import { Text } from '../../../shared/components/Typography'
import { COLORS } from '../../../shared/styles/colors'
import { FermentationStep } from '../interfaces/Brewing'

interface FermentationTimelineProps {
  steps: FermentationStep[]
}

export function FermentationTimeline({ steps }: FermentationTimelineProps) {
  if (steps.length === 0) {
    return (
      <Text style={styles.emptyText}>
        Nenhuma etapa de fermentação definida
      </Text>
    )
  }

  return (
    <View style={styles.container}>
      {steps.map(step => (
        <View key={step.id} style={styles.stepCard}>
          <View style={styles.stepHeader}>
            <View style={styles.stepNumber}>
              <Text style={styles.stepNumberText}>{step.stepOrder}</Text>
            </View>
            <Text style={styles.stepName}>{step.name}</Text>
          </View>

          <View style={styles.stepDetails}>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Temperatura:</Text>
              <Text style={styles.detailValue}>{step.temperature}°C</Text>
            </View>

            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Duração:</Text>
              <Text style={styles.detailValue}>
                {step.duration} {step.duration === 1 ? 'dia' : 'dias'}
              </Text>
            </View>
          </View>
        </View>
      ))}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12
  },
  stepCard: {
    minWidth: 200,
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: COLORS.border.light,
    borderRadius: 10,
    padding: 14,
    gap: 10
  },
  stepHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10
  },
  stepNumber: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: COLORS.brand.primary,
    alignItems: 'center',
    justifyContent: 'center'
  },
  stepNumberText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF'
  },
  stepName: {
    flex: 1,
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.text.primary
  },
  stepDetails: {
    gap: 6
  },
  detailRow: {
    flexDirection: 'row',
    gap: 6
  },
  detailLabel: {
    fontSize: 13,
    color: COLORS.text.secondary,
    fontWeight: '500'
  },
  detailValue: {
    fontSize: 13,
    color: COLORS.text.primary,
    fontWeight: '700'
  },
  emptyText: {
    fontSize: 14,
    color: COLORS.text.secondary,
    textAlign: 'center',
    paddingVertical: 20
  }
})

