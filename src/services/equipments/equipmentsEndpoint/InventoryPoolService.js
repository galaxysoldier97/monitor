import axios from "axios";
import {Backend} from "../../../data";
import Auth from "../../Auth";
import {APIformat} from "../../../helpers/entityMapper";

export const InventoryPoolEndpoint = {
    getAll,
    add,
    update,
    deleteByCode
};
export async function getAll(filter = {page: 0, size: 10}) {
    const params = new URLSearchParams({...filter}).toString();

    try {
        const response = await axios.get(`${Backend.equipments.inventorypools.url}?${params}`, Auth.authorize());
        const {content, pageable, totalElements, totalPages} = response.data;
        return {rows:  content, page: {number: pageable.pageNumber, size: pageable.pageSize, totalElements, totalPages } };
    } catch (error) {
        console.error('Error fetching inventory pools:', error);
        throw error;
    }
}

export async function add(inventoryPool) {
  const mappedInventoryPool = APIformat(inventoryPool);
  try{
    return await axios.post(Backend.equipments.inventorypools.url, mappedInventoryPool, Auth.authorize());
  }catch (error) {
    console.error(`Error adding inventory pool: `, error);
    throw error;
  }
}

export async function update(inventoryPool){
  const mappedInventoryPool = APIformat(inventoryPool);
  const { oldCode, ...rest } = mappedInventoryPool;

  try{
    const response = await axios.patch(`${Backend.equipments.inventorypools.url}/${oldCode}`, rest, Auth.authorize());
    return response?.data?.content;
  }catch(error){
    console.error(`Error updating inventory pool: ${mappedInventoryPool?.id}`, error);
    throw error;
  }
}
export async function deleteByCode(inventoryPoolCode){
  try{
    return await axios.delete(`${Backend.equipments.inventorypools.url}/${inventoryPoolCode}`, Auth.authorize());
  }catch(error){
    console.error(`Error deleting inventory pool: ${inventoryPoolCode}`, error);
    throw error;
  }
}
