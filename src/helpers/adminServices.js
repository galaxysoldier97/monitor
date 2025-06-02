import { StockAdminCategories } from '../config/stock/StockImportableProperties';
import {
  EquipmentAdminCategories,
} from '../config/equipment/EquipmentImportableProperties';
import { ResourceAdminCategories } from '../config/resources/ResourceImportableProperties';
import {ServiceEntityTypes} from "../config/service/serviceTypes";
import {JobServiceEndPoint} from "../services/services/ServicesEndpoint/JobService";
import {ProvisioningTagsEndPoint} from "../services/services/ServicesEndpoint/ProvisioningTagService";
import { ActivationCodeEndPoint } from "../services/services/ServicesEndpoint/ActivationCodeService";
import {TagsAndCodesEndpoint} from "../services/services/ServicesEndpoint/TagsAndCodesService";
import {ProvisioningProductEndpoint} from "../services/services/ServicesEndpoint/ProvisioningProductService";
import {
  ServiceEndPoint as ServiceEndpoint
} from "../services/services/ServicesEndpoint/ServiceEndpoint";
import {ActionParameterEndpoint} from "../services/services/ServicesEndpoint/ActionParameterService";
import {ProvisioningTagActionEndpoint} from "../services/services/ServicesEndpoint/ProvisioningTagActionService";
import {BlockEndPoint} from "../services/resources/ResourcesEndpoint/BlockService";
import {JobResourcesEndPoint} from "../services/resources/ResourcesEndpoint/JobResourcesService";
import {StockWarehouseEndpoint} from "../services/Stock/StockWarehouseService";
import {StockManufacturerEndpoint} from "../services/Stock/StockManufacturerService";
import {PlmnEndpoint} from "../services/equipments/equipmentsEndpoint/PlmnService";
import {ProviderEndpoint} from "../services/equipments/equipmentsEndpoint/ProviderService";
import {EquipmentModelEndpoint} from "../services/equipments/equipmentsEndpoint/EquipmentModelService";
import {WarehouseEndpoint} from "../services/equipments/equipmentsEndpoint/WarehouseService";
import {InventoryPoolEndpoint} from "../services/equipments/equipmentsEndpoint/InventoryPoolService";
import {SimcardConfigurationEndpoint} from "../services/equipments/equipmentsEndpoint/SimcardConfigurationService";
import {ConfigurationFileEndpoint} from "../services/equipments/equipmentsEndpoint/ConfigurationFileService";
import {EquipmentJobsEndpoint} from "../services/equipments/equipmentsEndpoint/EquipmentJobsService";

const equipmentActions = {
  [EquipmentAdminCategories.PROVIDER]: {
    get: (filters) => ProviderEndpoint.getAll(filters),
    add: (item) => ProviderEndpoint.add(item),
    delete: (item) => ProviderEndpoint.deleteById(item.id),
    update: ({ updatedItem }) => ProviderEndpoint.update(updatedItem),
  },

  [EquipmentAdminCategories.WAREHOUSE]: {
    get: (filters) => WarehouseEndpoint.getAll(filters),
    add: (item) => WarehouseEndpoint.add(item),
    delete: (item) => WarehouseEndpoint.deleteById(item.id),
    update: ({ updatedItem }) => WarehouseEndpoint.update(updatedItem),
  },

  [EquipmentAdminCategories.INVENTORY_POOL]: {
    get: (filters) => InventoryPoolEndpoint.getAll(filters),
    add: (item) => InventoryPoolEndpoint.add(item),
    delete: (item) => InventoryPoolEndpoint.deleteByCode(item.code),
    update: ({ oldItem, updatedItem }) => InventoryPoolEndpoint.update({ ...updatedItem, oldCode: oldItem.code }),
  },

  [EquipmentAdminCategories.FILE_CONFIGURATION]: {
    get: (filters) => ConfigurationFileEndpoint.getAll(filters),
    add: (item) => ConfigurationFileEndpoint.add(item),
    delete: (item) => ConfigurationFileEndpoint.deleteByName(item.name),
    update: ({ oldItem, updatedItem }) => ConfigurationFileEndpoint.update({ ...updatedItem, oldName: oldItem.name }),
  },

  [EquipmentAdminCategories.PLMN]: {
    get: (filters) => PlmnEndpoint.getAll(filters),
    add: (item) => PlmnEndpoint.add(item),
    delete: (item) => PlmnEndpoint.deleteById(item.id),
    update: ({ updatedItem }) => PlmnEndpoint.update(updatedItem),
  },

  [EquipmentAdminCategories.SIMCARD_GENERATION_CONFIGURATION]: {
    get: (filters) => SimcardConfigurationEndpoint.getAll(filters),
    add: (item) => SimcardConfigurationEndpoint.add(item),
    delete: (item) => SimcardConfigurationEndpoint.deleteByName(item.name),
    update: ({ updatedItem }) => SimcardConfigurationEndpoint.update(updatedItem),
  },

  [EquipmentAdminCategories.EQUIPMENT_MODEL]: {
    get: (filters) => EquipmentModelEndpoint.getAll(filters),
    add: (item) => EquipmentModelEndpoint.add(item),
    delete: (item) => EquipmentModelEndpoint.deleteById(item.id),
    update: ({ updatedItem }) => EquipmentModelEndpoint.update(updatedItem),
  },

  [EquipmentAdminCategories.JOB_EQUIPMENT]: {
    get: (filters) => EquipmentJobsEndpoint.getAll(filters),
    add: (item) => EquipmentJobsEndpoint.add(item),
    delete: (item) => EquipmentJobsEndpoint.deleteById(item.id),
    update: ({ updatedItem }) => EquipmentJobsEndpoint.update(updatedItem),
  },
};

export const EquipmentServices = {
  getEquipmentFromEntity: (entity, filters) => {
    const action = equipmentActions[entity]?.get;
    return action ? action(filters) : Promise.reject('CATEGORY_NOT_SUPPORTED');
  },
  addEquipmentFromEntity: (entity, item) => {
    const action = equipmentActions[entity]?.add;
    return action ? action(item) : Promise.reject('CATEGORY_NOT_SUPPORTED');
  },
  deleteEquipmentFromEntity: (entity, item) => {
    const action = equipmentActions[entity]?.delete;
    return action ? action(item) : Promise.reject('CATEGORY_NOT_SUPPORTED');
  },
  updateEquipmentFromEntity: (entity, oldItem, updatedItem) => {
    const action = equipmentActions[entity]?.update;
    return action ? action({ oldItem, updatedItem }) : Promise.reject('CATEGORY_NOT_SUPPORTED');
  },
};

export class ResourceServices {
  static getResourceFromEntity = (entity, filters) => {
    switch (entity) {
      case ResourceAdminCategories.JOB:
        return JobResourcesEndPoint.getAll(filters);
      case ResourceAdminCategories.BLOCK:
        return BlockEndPoint.getAll(filters);
      default:
        return new Promise.reject('CATEGORY_NOT_SUPPORTED');

    }
  };

  static addResourceFromEntity = (entity, item) => {
    switch (entity) {
      case ResourceAdminCategories.JOB:
        return JobResourcesEndPoint.add(item);
      case ResourceAdminCategories.BLOCK:
        return BlockEndPoint.add(item);
      default:
        return new Promise.reject('CATEGORY_NOT_SUPPORTED');
    }
  };

  static deleteResourceFromEntity = (entity, item) => {
    switch (entity) {
      case ResourceAdminCategories.JOB:
        return JobResourcesEndPoint.deleteById(item.id);
      case ResourceAdminCategories.BLOCK:
        return BlockEndPoint.deleteById(item.blockId);
      default:
        return Promise.reject('CATEGORY_NOT_SUPPORTED');
    }
  };

  static updateResourceFromEntity = (entity, item) => {
    switch (entity) {
      case ResourceAdminCategories.JOB:
        return JobResourcesEndPoint.update(item);
      default:
        return Promise.reject('CATEGORY_NOT_SUPPORTED');
    }
  };
}

export class StockServices {
  static getStockFromEntity = (entity, filters) => {
    switch (entity) {
      case StockAdminCategories.WAREHOUSE:
        return StockWarehouseEndpoint.getAll(filters);
      case StockAdminCategories.MANUFACTURER:
        return StockManufacturerEndpoint.getAll(filters);
      default:
        return new Promise.reject('CATEGORY_NOT_SUPPORTED');
    }
  };

  static addStockFromEntity = (entity, item) => {
    switch (entity) {
      case StockAdminCategories.WAREHOUSE:
        return StockWarehouseEndpoint.add(item);
      case StockAdminCategories.MANUFACTURER:
        return StockManufacturerEndpoint.add(item);
      default:
        return new Promise.reject('CATEGORY_NOT_SUPPORTED');
    }

  };

  static deleteStockFromEntity = (entity, item) => {
    switch (entity) {
      case StockAdminCategories.WAREHOUSE:
        return StockWarehouseEndpoint.deleteById(item.code);
      case StockAdminCategories.MANUFACTURER:
        return StockManufacturerEndpoint.deleteById(item.id);
      default:
        return;
    }
  };

  static updateStockFromEntity = (entity, updatedItem) => {
    switch (entity) {
      case StockAdminCategories.WAREHOUSE:
        return StockWarehouseEndpoint.update(updatedItem);
      case StockAdminCategories.MANUFACTURER:
        return StockManufacturerEndpoint.update(updatedItem);
      default:
        return;
    }
  };
}


export class ServiceServices {
  static getServiceFromEntity = (entity, filters) => {
    switch (entity) {
      case ServiceEntityTypes.JOBS:
        return JobServiceEndPoint.getAll(filters);
      case ServiceEntityTypes.PROVISIONING_TAGS:
        return ProvisioningTagsEndPoint.getAll(filters);
      case ServiceEntityTypes.ACTIVATION_CODE:
        return ActivationCodeEndPoint.getAll(filters);
      case ServiceEntityTypes.TAGS_AND_CODES:
        return TagsAndCodesEndpoint.getTagActivationCodes(filters);
      case ServiceEntityTypes.ASSOCIATED_PROVISIONING_TAGS:
        return ServiceEndpoint.getAssociatedProvisioningTags(filters);
      case ServiceEntityTypes.ASSOCIATED_ACTIVATION_CODES:
        return ServiceEndpoint.getAssociatedActivationCodes(filters);
      case ServiceEntityTypes.PROVISIONING_PRODUCT:
        return ProvisioningProductEndpoint.getAll(filters);
      case ServiceEntityTypes.PROVISIONING_TAG_ACTION_PARAMETERS:
        return ActionParameterEndpoint.getById(filters);
      case ServiceEntityTypes.PROVISIONING_TAG_ACTION:
        return ProvisioningTagActionEndpoint.getAll(filters);
      default:
        return new Promise.reject('CATEGORY_NOT_SUPPORTED');
    }
  };

  static addServiceFromEntity = (entity, item) => {
    switch (entity) {
      case ServiceEntityTypes.JOBS:
        return JobServiceEndPoint.add(item);
      case ServiceEntityTypes.PROVISIONING_TAGS:
        return ProvisioningTagsEndPoint.add(item);
      case ServiceEntityTypes.ACTIVATION_CODE:
        return ActivationCodeEndPoint.add(item);
      case ServiceEntityTypes.TAGS_AND_CODES:
        return TagsAndCodesEndpoint.add(item);
      case ServiceEntityTypes.ASSOCIATED_PROVISIONING_TAGS:
        return ServiceEndpoint.addProvisioningTag(item);
      case ServiceEntityTypes.PROVISIONING_TAG_ACTION_PARAMETERS:
        return ActionParameterEndpoint.add(item);
      case ServiceEntityTypes.PROVISIONING_PRODUCT:
        return ProvisioningProductEndpoint.add(item);
      case ServiceEntityTypes.PROVISIONING_TAG_ACTION:
        return ProvisioningTagActionEndpoint.add(item);
      default:
        return new Promise.reject('CATEGORY_NOT_SUPPORTED');
    }
  };

  static deleteServiceFromEntity = (entity, item) => {
    switch (entity) {
      case ServiceEntityTypes.JOBS:
        return JobServiceEndPoint.deleteById(item?.['id']);
      case ServiceEntityTypes.PROVISIONING_TAGS:
        return ProvisioningTagsEndPoint.deleteById(item);
      case ServiceEntityTypes.ACTIVATION_CODE:
        return ActivationCodeEndPoint.deleteById(item?.['id']);
      case ServiceEntityTypes.TAGS_AND_CODES:
        return TagsAndCodesEndpoint.deleteById(item);
      case ServiceEntityTypes.ASSOCIATED_PROVISIONING_TAGS:
        return ServiceEndpoint.deleteAssociatedProvisioningTag(item);
      case ServiceEntityTypes.PROVISIONING_PRODUCT:
        return ProvisioningProductEndpoint.deleteById(item);
      case ServiceEntityTypes.PROVISIONING_TAG_ACTION_PARAMETERS:
        return ActionParameterEndpoint.deleteById(item);
      case ServiceEntityTypes.PROVISIONING_TAG_ACTION:
        return ProvisioningTagActionEndpoint.deleteById(item);
      default:
        return new Promise.reject('CATEGORY_NOT_SUPPORTED');
    }
  };

  static updateServiceFromEntity = (entity, item) => {
    switch (entity) {
      case ServiceEntityTypes.JOBS:
        return JobServiceEndPoint.update(item);
      case ServiceEntityTypes.PROVISIONING_TAGS:
        return ProvisioningTagsEndPoint.update(item);
      case ServiceEntityTypes.ACTIVATION_CODE:
        return ActivationCodeEndPoint.update(item);
      default:
        return new Promise.reject('CATEGORY_NOT_SUPPORTED');
    }
  };
}
