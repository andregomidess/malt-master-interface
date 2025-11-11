import type {
  EquipmentWithPublicFlag,
  EquipmentStats,
} from '../interfaces/equipment'

export const calculateEquipmentStats = (
  equipments: EquipmentWithPublicFlag[],
): EquipmentStats => {
  return {
    totalEquipments: equipments.length,
    kettles: equipments.filter(e => e.type === 'kettle').length,
    fermenters: equipments.filter(e => e.type === 'fermenter').length,
    chillers: equipments.filter(e => e.type === 'chiller').length,
  }
}
