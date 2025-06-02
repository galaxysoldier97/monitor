import axios from "axios";
import {Backend} from "../../data";
import Auth from "../Auth";
import {APIformat} from "../../helpers/entityMapper";

export const StockWarehouseEndpoint = {
  getAll,
  add,
  update,
  deleteById
};
export async function getAll(filter) {
  try {
    const mappedFilter = APIformat(filter);
    const queryParams = new URLSearchParams(mappedFilter).toString();
    const response = await axios.get(`${Backend.stock.warehouses.url}?${queryParams}`, Auth.authorize());
    const {content, pageable, totalElements, totalPages} = response.data;
    return {rows:  content, page: {number: pageable.pageNumber, size: pageable.pageSize, totalElements, totalPages } };
  } catch (error) {
    console.error('Error fetching warehouses:', error);
    throw error;
  }
}

export async function add(warehouse) {
  try{
    return await axios.post(`${Backend.stock.warehouses.url}`, warehouse, Auth.authorize());
  }catch (error) {
    console.error(`Error adding warehouse`, error);
    throw error;
  }
}

export async function update(warehouse) {
  const { code } = warehouse;
  try{
    return await axios.patch(`${Backend.stock.warehouses.url}/${code}`, warehouse, Auth.authorize());
  }catch (error) {
    console.error(`Error adding warehouse`, error);
    throw error;
  }
}

export async function deleteById(warehouseId){
  try{
    return await axios.delete(`${Backend.stock.warehouses.url}/${warehouseId}`, Auth.authorize());
  }catch(error){
    console.error(`Error deleting warehouse: ${warehouseId}`, error);
    throw error;
  }
}
