import { View, StyleSheet } from 'react-native'
import { useMemo } from 'react'
import { Layout } from '../../../shared/components/Layout'
import { ActionCard, StatCard } from '../../../shared/components/Card'
import { Heading, Text } from '../../../shared/components/Typography'
import { Table } from '../../../shared/components/Table'
import { COLORS } from '../../../shared/styles/colors'
import { ColumnDef } from '@tanstack/react-table'
import { MdAssignment, MdBarChart, MdTimer } from 'react-icons/md'
import { BiBookAlt, BiHourglass, BiPackage, BiPlusCircle } from 'react-icons/bi'

interface ActivityRow {
  date: string
  recipe: string
  volume: string
  status: 'Completo' | 'Em Andamento' | 'Pendente'
}

const mockActivityData: ActivityRow[] = [
  {
    date: '2024-07-20',
    recipe: 'Imperial Stout',
    volume: '20L',
    status: 'Completo',
  },
  {
    date: '2024-07-15',
    recipe: 'IPA Cítrica',
    volume: '15L',
    status: 'Completo',
  },
  {
    date: '2024-07-10',
    recipe: 'Weissbier Tradicional',
    volume: '20L',
    status: 'Em Andamento',
  },
  {
    date: '2024-07-05',
    recipe: 'Lager Leve',
    volume: '25L',
    status: 'Pendente',
  },
  {
    date: '2024-06-28',
    recipe: 'Porter Defumada',
    volume: '20L',
    status: 'Completo',
  },
]

const StatusBadge = ({ status }: { status: ActivityRow['status'] }) => {
  const getStatusStyle = () => {
    switch (status) {
      case 'Completo':
        return {
          backgroundColor: '#D1F4E0',
          color: '#0F7B4E',
        }
      case 'Em Andamento':
        return {
          backgroundColor: '#FFF4D6',
          color: '#C77B00',
        }
      case 'Pendente':
        return {
          backgroundColor: '#FFE5DB',
          color: '#D84A1B',
        }
      default:
        return {
          backgroundColor: COLORS.neutral.gray[100],
          color: COLORS.neutral.gray[700],
        }
    }
  }

  const style = getStatusStyle()

  return (
    <View
      style={[styles.statusBadge, { backgroundColor: style.backgroundColor }]}
    >
      <Text style={[styles.statusText, { color: style.color }]}>{status}</Text>
    </View>
  )
}

export const Home = () => {
  const activityColumns = useMemo<ColumnDef<ActivityRow>[]>(
    () => [
      {
        accessorKey: 'date',
        header: 'Data',
        size: 20,
      },
      {
        accessorKey: 'recipe',
        header: 'Receita',
        size: 40,
      },
      {
        accessorKey: 'volume',
        header: 'Volume',
        size: 15,
      },
      {
        accessorKey: 'status',
        header: 'Status',
        size: 25,
        cell: ({ getValue }) => (
          <StatusBadge status={getValue() as ActivityRow['status']} />
        ),
      },
    ],
    [],
  )

  return (
    <Layout activeMenuItem="dashboard" userName="Olá, João Silva">
      <View style={styles.container}>
        <View style={styles.section}>
          <Heading variant="h4" style={styles.sectionTitle}>
            Ações Rápidas
          </Heading>

          <View style={styles.actionsGrid}>
            <View style={styles.actionCardWrapper}>
              <ActionCard
                title="Criar Nova Receita"
                description="Inscreva sua próxima cerveja"
                icon={<BiPlusCircle size={32} color={COLORS.brand.primary} />}
                onPress={() => console.log('Criar receita')}
              />
            </View>

            <View style={styles.actionCardWrapper}>
              <ActionCard
                title="Minhas Receitas"
                description="Gerencie suas criações"
                icon={<BiBookAlt size={32} color={COLORS.brand.primary} />}
                onPress={() => console.log('Minhas receitas')}
              />
            </View>

            <View style={styles.actionCardWrapper}>
              <ActionCard
                title="Inventário"
                description="Controle de ingredientes"
                icon={<BiPackage size={32} color={COLORS.brand.primary} />}
                onPress={() => console.log('Inventário')}
              />
            </View>

            <View style={styles.actionCardWrapper}>
              <ActionCard
                title="Brassagens em Andamento"
                description="Acompanhe seus projetos"
                icon={<BiHourglass size={32} color={COLORS.brand.primary} />}
                onPress={() => console.log('Brassagens')}
              />
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Heading variant="h4" style={styles.sectionTitle}>
            Estatísticas Rápidas
          </Heading>

          <View style={styles.statsGrid}>
            <View style={styles.statCardWrapper}>
              <StatCard
                title="Total de Receitas"
                value="124"
                icon={<MdAssignment size={28} color={COLORS.brand.primary} />}
              />
            </View>

            <View style={styles.statCardWrapper}>
              <StatCard
                title="Cervejas Produzidas"
                value="2.500L"
                icon={<MdBarChart size={28} color={COLORS.brand.primary} />}
              />
            </View>

            <View style={styles.statCardWrapper}>
              <StatCard
                title="Última Brassagem"
                value="Imperial Stout"
                icon={<MdTimer size={28} color={COLORS.brand.primary} />}
              />
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Heading variant="h4" style={styles.sectionTitle}>
            Atividade Recente
          </Heading>

          <Table
            data={mockActivityData}
            columns={activityColumns}
            emptyMessage="Nenhuma atividade recente"
          />
        </View>
      </View>
    </Layout>
  )
}

const styles = StyleSheet.create({
  container: {
    gap: 32,
  },
  section: {
    gap: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.text.primary,
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  actionCardWrapper: {
    flex: 1,
    minWidth: 280,
    maxWidth: '100%',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  statCardWrapper: {
    flex: 1,
    minWidth: 300,
    maxWidth: '100%',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 2,
    borderRadius: 16,
    alignSelf: 'flex-start',
  },
  statusText: {
    fontSize: 13,
    fontWeight: '600',
  },
  sapButton: {
    position: 'fixed',
    bottom: 32,
    left: 32,
    zIndex: 1000,
  },
})
