import { View, StyleSheet, TouchableOpacity } from 'react-native'
import { Text } from '../../../shared/components/Typography'
import { COLORS } from '../../../shared/styles/colors'
import { MdEdit } from 'react-icons/md'
import {
  GiCookingPot,
  GiBarrel,
  GiWaterRecycling,
  GiThermometerCold,
} from 'react-icons/gi'
import { BsLightningChargeFill } from 'react-icons/bs'
import { BiWorld } from 'react-icons/bi'
import {
  Equipment,
  EquipmentType,
  KettleEquipment,
  FermenterEquipment,
  ChillerEquipment,
  equipmentTypeLabels,
  materialLabels,
  heatingSourceLabels,
  coolingTypeLabels,
  chillerTypeLabels,
} from '../data/mockEquipmentData'

interface EquipmentCardProps {
  equipment: Equipment
  onEdit?: () => void
}

export const EquipmentCard = ({ equipment, onEdit }: EquipmentCardProps) => {
  // Configuração de cores por tipo
  const typeConfig = {
    [EquipmentType.KETTLE]: {
      label: equipmentTypeLabels[EquipmentType.KETTLE],
      color: '#F97316',
      bgColor: '#FFEDD5',
      icon: GiCookingPot,
    },
    [EquipmentType.FERMENTER]: {
      label: equipmentTypeLabels[EquipmentType.FERMENTER],
      color: '#8B5CF6',
      bgColor: '#EDE9FE',
      icon: GiBarrel,
    },
    [EquipmentType.CHILLER]: {
      label: equipmentTypeLabels[EquipmentType.CHILLER],
      color: '#3B82F6',
      bgColor: '#DBEAFE',
      icon: GiWaterRecycling,
    },
  }

  const config = typeConfig[equipment.type]
  const Icon = config.icon

  // Verificar características especiais
  const isHighCapacity = equipment.totalCapacity > 50
  const isHighPower =
    equipment.type === EquipmentType.KETTLE &&
    (equipment as KettleEquipment).heatingPower > 5000

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View
          style={[styles.iconContainer, { backgroundColor: config.bgColor }]}
        >
          <Icon size={32} color={config.color} />
        </View>
        <View style={styles.headerContent}>
          <View style={styles.titleRow}>
            <Text style={styles.title}>{equipment.name}</Text>
            {equipment.isPublic && (
              <View style={styles.publicBadge}>
                <BiWorld size={12} color="#6B7280" />
                <Text style={styles.publicBadgeText}>Público</Text>
              </View>
            )}
          </View>
          <View style={styles.badges}>
            <View style={[styles.badge, { backgroundColor: config.bgColor }]}>
              <Text style={[styles.badgeText, { color: config.color }]}>
                {config.label}
              </Text>
            </View>
            <View
              style={[
                styles.badge,
                { backgroundColor: COLORS.neutral.gray[100] },
              ]}
            >
              <Text
                style={[styles.badgeText, { color: COLORS.text.secondary }]}
              >
                {materialLabels[equipment.material]}
              </Text>
            </View>
          </View>
        </View>
      </View>

      <View style={styles.content}>
        {/* Descrição */}
        {equipment.description && (
          <View style={styles.descriptionContainer}>
            <Text style={styles.description} numberOfLines={2}>
              {equipment.description}
            </Text>
          </View>
        )}

        {/* Capacidade */}
        <View style={styles.capacityRow}>
          <View style={styles.capacityItem}>
            <Text style={styles.label}>Capacidade Total:</Text>
            <Text style={styles.value}>
              {equipment.totalCapacity}L
              {isHighCapacity && <Text style={styles.highlight}> (Alta)</Text>}
            </Text>
          </View>
          <View style={styles.capacityItem}>
            <Text style={styles.label}>Volume Útil:</Text>
            <Text style={styles.value}>{equipment.usableVolume}L</Text>
          </View>
        </View>

        {/* Informações específicas por tipo */}
        {equipment.type === EquipmentType.KETTLE && (
          <View style={styles.specificInfo}>
            <Text style={styles.sectionTitle}>Características:</Text>
            <View style={styles.infoRow}>
              <BsLightningChargeFill
                size={14}
                color={isHighPower ? '#10B981' : COLORS.text.secondary}
              />
              <Text style={styles.label}>Potência:</Text>
              <Text style={styles.value}>
                {(equipment as KettleEquipment).heatingPower}W
                {isHighPower && <Text style={styles.highlight}> (Alta)</Text>}
              </Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.label}>Fonte de Calor:</Text>
              <Text style={styles.value}>
                {
                  heatingSourceLabels[
                    (equipment as KettleEquipment).heatingSource
                  ]
                }
              </Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.label}>Taxa de Evaporação:</Text>
              <Text style={styles.value}>
                {(equipment as KettleEquipment).evaporationRate}%
              </Text>
            </View>
          </View>
        )}

        {equipment.type === EquipmentType.FERMENTER && (
          <View style={styles.specificInfo}>
            <Text style={styles.sectionTitle}>Características:</Text>
            {(equipment as FermenterEquipment).hasTemperatureControl && (
              <View style={styles.temperatureControlBadge}>
                <GiThermometerCold size={16} color="#10B981" />
                <Text style={styles.temperatureControlText}>
                  Controle de Temperatura
                </Text>
              </View>
            )}
            <View style={styles.infoRow}>
              <Text style={styles.label}>Faixa de Temperatura:</Text>
              <Text style={styles.value}>
                {(equipment as FermenterEquipment).minTemperature}°C a{' '}
                {(equipment as FermenterEquipment).maxTemperature}°C
              </Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.label}>Resfriamento:</Text>
              <Text style={styles.value}>
                {
                  coolingTypeLabels[
                    (equipment as FermenterEquipment).coolingType
                  ]
                }
              </Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.label}>Pressão Máxima:</Text>
              <Text style={styles.value}>
                {(equipment as FermenterEquipment).maxPressure} PSI
              </Text>
            </View>
          </View>
        )}

        {equipment.type === EquipmentType.CHILLER && (
          <View style={styles.specificInfo}>
            <Text style={styles.sectionTitle}>Características:</Text>
            <View style={styles.infoRow}>
              <Text style={styles.label}>Tipo:</Text>
              <Text style={styles.value}>
                {chillerTypeLabels[(equipment as ChillerEquipment).chillerType]}
              </Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.label}>Taxa de Fluxo:</Text>
              <Text style={styles.value}>
                {(equipment as ChillerEquipment).flowRate} L/min
              </Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.label}>Delta T:</Text>
              <Text style={styles.value}>
                {(equipment as ChillerEquipment).inletTemperature}°C →{' '}
                {(equipment as ChillerEquipment).outletTemperature}°C
              </Text>
            </View>
          </View>
        )}
      </View>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.editButton} onPress={onEdit}>
          <MdEdit size={16} color={COLORS.text.secondary} />
          <Text style={styles.editButtonText}>Editar</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.neutral.white,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.border.light,
    overflow: 'hidden',
    width: '100%',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: COLORS.neutral.white,
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border.light,
    gap: 12,
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerContent: {
    flex: 1,
    gap: 6,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flexWrap: 'wrap',
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.text.primary,
    flex: 1,
  },
  publicBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    backgroundColor: '#F3F4F6',
  },
  publicBadgeText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#6B7280',
  },
  badges: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '600',
  },
  content: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
  },
  descriptionContainer: {
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border.light,
  },
  description: {
    fontSize: 13,
    color: COLORS.text.secondary,
    lineHeight: 18,
  },
  capacityRow: {
    flexDirection: 'row',
    gap: 16,
    flexWrap: 'wrap',
  },
  capacityItem: {
    flex: 1,
    minWidth: 120,
    gap: 2,
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.text.secondary,
  },
  value: {
    fontSize: 14,
    fontWeight: '500',
    color: COLORS.text.primary,
  },
  highlight: {
    color: '#10B981',
    fontWeight: '600',
  },
  specificInfo: {
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: COLORS.border.light,
    gap: 8,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.text.primary,
    marginBottom: 4,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flexWrap: 'wrap',
  },
  temperatureControlBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
    backgroundColor: '#D1FAE5',
    borderRadius: 6,
    alignSelf: 'flex-start',
    marginBottom: 4,
  },
  temperatureControlText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#10B981',
  },
  footer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: COLORS.border.light,
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 4,
  },
  editButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: COLORS.text.secondary,
  },
})
