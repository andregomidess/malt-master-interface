import {
  View,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  ScrollView,
} from 'react-native'
import { useState } from 'react'
import { Layout } from '../../../shared/components/Layout'
import { Text } from '../../../shared/components/Typography'
import { COLORS } from '../../../shared/styles/colors'
import { useBatchDetail } from '../hooks/useBatchDetail'
import { BatchStatusBadge } from '../components/BatchStatusBadge'
import { MashTimeline } from '../components/MashTimeline'
import { FermentationTimeline } from '../components/FermentationTimeline'
import { HopSchedule } from '../components/HopSchedule'
import { BrewLogTable } from '../components/BrewLogTable'

type TabType = 'mash' | 'fermentation' | 'logs' | 'stats'

interface BrewSessionProps {
  batchId: string
}

export function BrewSession({ batchId }: BrewSessionProps) {
  const { detail, logs, loading, error } = useBatchDetail(batchId)
  const [activeTab, setActiveTab] = useState<TabType>('mash')

  if (loading) {
    return (
      <Layout activeMenuItem="brewings">
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={COLORS.brand.primary} />
        </View>
      </Layout>
    )
  }

  if (error || !detail) {
    return (
      <Layout activeMenuItem="brewings">
        <View style={styles.centerContainer}>
          <Text style={styles.errorText}>{error || 'Lote não encontrado'}</Text>
        </View>
      </Layout>
    )
  }

  const { batch, mashSteps, fermentationSteps, hopSchedule } = detail

  const tabs: Array<{ key: TabType; label: string }> = [
    { key: 'mash', label: 'Mostura & Fervura' },
    { key: 'fermentation', label: 'Fermentação' },
    { key: 'logs', label: 'Medições' },
    { key: 'stats', label: 'Estatísticas' },
  ]

  return (
    <Layout activeMenuItem="brewings">
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.container}
      >
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <View style={styles.headerLeft}>
              <Text style={styles.title}>
                {batch.name || batch.recipe?.name}
              </Text>
              <Text style={styles.code}>{batch.batchCode || '—'}</Text>
            </View>
            <BatchStatusBadge status={batch.status} />
          </View>

          <View style={styles.summaryGrid}>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Estilo</Text>
              <Text style={styles.summaryValue}>
                {batch.recipe?.styleName || '—'}
              </Text>
            </View>

            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Equipamento</Text>
              <Text style={styles.summaryValue}>
                {batch.equipment?.name || '—'}
              </Text>
            </View>

            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Volume Planejado</Text>
              <Text style={styles.summaryValue}>
                {batch.plannedVolume ? `${batch.plannedVolume} L` : '—'}
              </Text>
            </View>

            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>OG Alvo / Real</Text>
              <Text style={styles.summaryValue}>
                {batch.recipe?.og?.toFixed(3) || '—'} /{' '}
                {batch.actualOriginalGravity?.toFixed(3) || '—'}
              </Text>
            </View>

            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>FG Alvo / Real</Text>
              <Text style={styles.summaryValue}>
                {batch.recipe?.fg?.toFixed(3) || '—'} /{' '}
                {batch.actualFinalGravity?.toFixed(3) || '—'}
              </Text>
            </View>

            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>ABV</Text>
              <Text style={styles.summaryValue}>
                {batch.actualAbv ? `${batch.actualAbv}%` : '—'}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.tabs}>
          {tabs.map(tab => (
            <TouchableOpacity
              key={tab.key}
              onPress={() => setActiveTab(tab.key)}
              style={[styles.tab, activeTab === tab.key && styles.tabActive]}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.tabText,
                  activeTab === tab.key && styles.tabTextActive,
                ]}
              >
                {tab.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.content}>
          {activeTab === 'mash' && (
            <>
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Perfil de Mostura</Text>
                <MashTimeline steps={mashSteps} />
              </View>

              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Cronograma de Lúpulos</Text>
                <HopSchedule hops={hopSchedule} />
              </View>
            </>
          )}

          {activeTab === 'fermentation' && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Perfil de Fermentação</Text>
              <FermentationTimeline steps={fermentationSteps} />
            </View>
          )}

          {activeTab === 'logs' && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Histórico de Medições</Text>
              <BrewLogTable logs={logs} />
            </View>
          )}

          {activeTab === 'stats' && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Estatísticas</Text>
              <View style={styles.statsGrid}>
                <View style={styles.statCard}>
                  <Text style={styles.statLabel}>Eficiência Real</Text>
                  <Text style={styles.statValue}>
                    {batch.actualEfficiency
                      ? `${batch.actualEfficiency}%`
                      : '—'}
                  </Text>
                </View>

                <View style={styles.statCard}>
                  <Text style={styles.statLabel}>ABV Real</Text>
                  <Text style={styles.statValue}>
                    {batch.actualAbv ? `${batch.actualAbv}%` : '—'}
                  </Text>
                </View>

                <View style={styles.statCard}>
                  <Text style={styles.statLabel}>IBU Real</Text>
                  <Text style={styles.statValue}>{batch.actualIbu || '—'}</Text>
                </View>

                <View style={styles.statCard}>
                  <Text style={styles.statLabel}>Cor Real (EBC)</Text>
                  <Text style={styles.statValue}>
                    {batch.actualColor || '—'}
                  </Text>
                </View>
              </View>
            </View>
          )}
        </View>
      </ScrollView>
    </Layout>
  )
}

const styles = StyleSheet.create({
  container: {
    gap: 24,
    paddingBottom: 40,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  errorText: {
    fontSize: 14,
    color: COLORS.status.error,
    textAlign: 'center',
  },
  header: {
    gap: 16,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 12,
  },
  headerLeft: {
    flex: 1,
    gap: 6,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: COLORS.text.primary,
  },
  code: {
    fontSize: 15,
    color: COLORS.text.secondary,
    fontWeight: '600',
  },
  summaryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    backgroundColor: COLORS.neutral.white,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border.light,
  },
  summaryItem: {
    minWidth: '30%',
    gap: 4,
  },
  summaryLabel: {
    fontSize: 12,
    color: COLORS.text.secondary,
    fontWeight: '500',
  },
  summaryValue: {
    fontSize: 14,
    color: COLORS.text.primary,
    fontWeight: '700',
  },
  tabs: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
  },
  tab: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: COLORS.neutral.white,
    borderWidth: 1,
    borderColor: COLORS.border.light,
  },
  tabActive: {
    backgroundColor: COLORS.brand.primary,
    borderColor: COLORS.brand.primary,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.text.primary,
  },
  tabTextActive: {
    color: '#FFFFFF',
  },
  content: {
    gap: 24,
  },
  section: {
    gap: 16,
    backgroundColor: COLORS.neutral.white,
    padding: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border.light,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.text.primary,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  statCard: {
    minWidth: 150,
    backgroundColor: '#F9FAFB',
    padding: 16,
    borderRadius: 10,
    gap: 8,
  },
  statLabel: {
    fontSize: 13,
    color: COLORS.text.secondary,
    fontWeight: '500',
  },
  statValue: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.brand.primary,
  },
})
