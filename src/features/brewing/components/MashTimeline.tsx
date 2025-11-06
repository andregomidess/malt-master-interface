import { View, StyleSheet } from 'react-native'
import { Text } from '../../../shared/components/Typography'
import { COLORS } from '../../../shared/styles/colors'
import { MashStep } from '../interfaces/Brewing'

interface MashTimelineProps {
  steps: MashStep[]
}

export function MashTimeline({ steps }: MashTimelineProps) {
  if (steps.length === 0) {
    return (
      <Text style={styles.emptyText}>Nenhum passo de mostura definido</Text>
    )
  }

  return (
    <View style={styles.container}>
      {steps.map((step, index) => (
        <View key={step.id} style={styles.stepContainer}>
          <View style={styles.leftSection}>
            <View style={styles.bulletContainer}>
              <View style={styles.bullet} />
              {index < steps.length - 1 && <View style={styles.line} />}
            </View>
          </View>

          <View style={styles.stepContent}>
            <View style={styles.stepHeader}>
              <Text style={styles.stepTitle}>
                {step.stepOrder}. {step.name}
              </Text>
              <View style={styles.stepType}>
                <Text style={styles.stepTypeText}>
                  {step.stepType.toUpperCase()}
                </Text>
              </View>
            </View>

            <View style={styles.stepDetails}>
              <View style={styles.detailItem}>
                <Text style={styles.detailLabel}>Temperatura:</Text>
                <Text style={styles.detailValue}>{step.temperature}°C</Text>
              </View>

              <View style={styles.detailItem}>
                <Text style={styles.detailLabel}>Duração:</Text>
                <Text style={styles.detailValue}>{step.duration} min</Text>
              </View>

              {step.infusionAmount && (
                <View style={styles.detailItem}>
                  <Text style={styles.detailLabel}>Infusão:</Text>
                  <Text style={styles.detailValue}>
                    {step.infusionAmount} L
                  </Text>
                </View>
              )}

              {step.infusionTemp && (
                <View style={styles.detailItem}>
                  <Text style={styles.detailLabel}>Temp. Infusão:</Text>
                  <Text style={styles.detailValue}>{step.infusionTemp}°C</Text>
                </View>
              )}
            </View>

            {step.description && (
              <Text style={styles.stepDescription}>{step.description}</Text>
            )}
          </View>
        </View>
      ))}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    gap: 0
  },
  stepContainer: {
    flexDirection: 'row',
    gap: 12
  },
  leftSection: {
    width: 24,
    alignItems: 'center'
  },
  bulletContainer: {
    alignItems: 'center'
  },
  bullet: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: COLORS.brand.primary,
    marginTop: 4
  },
  line: {
    width: 2,
    flex: 1,
    backgroundColor: COLORS.border.light,
    minHeight: 40
  },
  stepContent: {
    flex: 1,
    paddingBottom: 20,
    gap: 8
  },
  stepHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 12
  },
  stepTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.text.primary,
    flex: 1
  },
  stepType: {
    backgroundColor: '#F3F4F6',
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 6
  },
  stepTypeText: {
    fontSize: 10,
    fontWeight: '700',
    color: COLORS.text.secondary
  },
  stepDetails: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12
  },
  detailItem: {
    flexDirection: 'row',
    gap: 4
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
  stepDescription: {
    fontSize: 12,
    color: COLORS.text.secondary,
    fontStyle: 'italic'
  },
  emptyText: {
    fontSize: 14,
    color: COLORS.text.secondary,
    textAlign: 'center',
    paddingVertical: 20
  }
})

