import { StockAdminCategories } from '../config/stock/StockImportableProperties';
import { ResourceAdminCategories } from '../config/resources/ResourceImportableProperties';
import { EquipmentAdminCategories } from '../config/equipment/EquipmentImportableProperties';
import {EquipmentServices, ResourceServices, ServiceServices, StockServices} from './adminServices';

export const getFromEntity = async (entity, filters) => {
  let targetedEntity;
  try{
    if (entity instanceof EquipmentAdminCategories) {
      targetedEntity = await EquipmentServices.getEquipmentFromEntity(entity, filters);
    } else if (entity instanceof ResourceAdminCategories) {
      targetedEntity = await ResourceServices.getResourceFromEntity(entity, filters);
    } else if (entity instanceof StockAdminCategories) {
      targetedEntity = await StockServices.getStockFromEntity(entity, filters);
    } else {
      targetedEntity = await ServiceServices.getServiceFromEntity(entity, filters);
    }
  }catch(error){
    console.error(error);
    throw (error);
  }
  return targetedEntity;
};

export const deleteFromEntity = async (entity, item) => {
  let deletedEntity;
  try{
    if (entity instanceof EquipmentAdminCategories) {
      deletedEntity =  await EquipmentServices.deleteEquipmentFromEntity(entity, item);
    } else if (entity instanceof ResourceAdminCategories) {
      deletedEntity =   await ResourceServices.deleteResourceFromEntity(entity, item);
    } else if (entity instanceof StockAdminCategories) {
      deletedEntity =   await StockServices.deleteStockFromEntity(entity, item);
    } else {
      deletedEntity = await ServiceServices.deleteServiceFromEntity(entity, item);
    }
  }catch(error){
    console.error(error);
    throw(error);
  }
  return deletedEntity;
};

export const addFromEntity = async (entity, item) => {
  let addedEntity;
  try{
    if (entity instanceof EquipmentAdminCategories) {
      addedEntity = await EquipmentServices.addEquipmentFromEntity(entity, item);
    } else if (entity instanceof ResourceAdminCategories) {
      addedEntity = await ResourceServices.addResourceFromEntity(entity, item);
    } else if (entity instanceof StockAdminCategories) {
      addedEntity = await StockServices.addStockFromEntity(entity, item);
    } else {
      addedEntity = await ServiceServices.addServiceFromEntity(entity, item);
    }
  }catch(error){
    console.error(error);
    throw(error);
  }
  return addedEntity;
};

export const updateFromEntity = async (entity, oldItem = {}, updatedItem) => {
  // eslint-disable-next-line no-unused-vars
  const {index, ...item} = updatedItem;
  let updatedEntity;
  try{
    if (entity instanceof EquipmentAdminCategories) {
      updatedEntity = await EquipmentServices.updateEquipmentFromEntity(entity, oldItem, item);
    } else if (entity instanceof ResourceAdminCategories) {
      updatedEntity =  await ResourceServices.updateResourceFromEntity(entity, item);
    } else if (entity instanceof StockAdminCategories) {
      updatedEntity =  await StockServices.updateStockFromEntity(entity, item);
    } else {
      updatedEntity = await ServiceServices.updateServiceFromEntity(entity, item);
    }
  }catch(error){
    console.error(error);
    throw(error);
  }
  return updatedEntity;
};
