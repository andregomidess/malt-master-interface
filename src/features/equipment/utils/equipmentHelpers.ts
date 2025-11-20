import type {
  EquipmentWithPublicFlag,
  EquipmentStats,
} from '../interfaces/equipment'

// TODO: should be in bck-end
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
