import { t } from 'mt-react-library/functions';

export class EquipmentAdminCategories {
  static PROVIDER = new EquipmentAdminCategories('Provider', false);
  static WAREHOUSE = new EquipmentAdminCategories('Warehouse', false);
  static JOB_EQUIPMENT = new EquipmentAdminCategories('JobEquipment', true);
  static INVENTORY_POOL = new EquipmentAdminCategories('InventoryPool', false);
  static SIMCARD_GENERATION_CONFIGURATION = new EquipmentAdminCategories('SimCardGenerationConfiguration', false);
  static FILE_CONFIGURATION = new EquipmentAdminCategories('FileConfiguration', false);
  static EQUIPMENT_MODEL = new EquipmentAdminCategories('EquipmentModel', false);
  static PLMN = new EquipmentAdminCategories('Plmn', true);

  constructor(category, isFilterable) {
    this.category = category;
    this.isFilterable = isFilterable;
  }

  toString() {
    return this.category;
  }
}
export const categoriesEquipmentImport = [
  {key: 'Plmn', value: t('plmn')},
  {key: 'Provider', value: t('cpe.provider')},
  {key: 'Warehouse', value: t('cpe.warehouse')},
  {key: 'InventoryPool', value: t('inventoryPool')},
  {key: 'JobEquipment', value: t('jobEquipment')},
  {key: 'SimCardGenerationConfiguration', value: t('simCardGenerationConfiguration')},
  {key: 'FileConfiguration', value: t('fileConfiguration')},
  {key: 'DeliveryFile', value: t('deliveryFile')}
];
