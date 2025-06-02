import axios from "axios";
import {Backend} from "../../data";
import Auth from "../Auth";
import {APIformat} from "../../helpers/entityMapper";

export const StockManufacturerEndpoint = {
  getAll,
  add,
  update,
  deleteById
};
export async function getAll(filter) {
  try {
    const mappedFilter = APIformat(filter);
    const queryParams = new URLSearchParams(mappedFilter).toString();
    const response = await axios.get(`${Backend.stock.manufacturers.url}?${queryParams}`, Auth.authorize());
    const {content, pageable, totalElements, totalPages} = response.data;
    return {rows:  content, page: {number: pageable.pageNumber, size: pageable.pageSize, totalElements, totalPages } };
  } catch (error) {
    console.error('Error fetching manufacturers:', error);
    throw error;
  }
}

export async function add(manufacturer) {
  try{
    return await axios.post(`${Backend.stock.manufacturers.url}`, manufacturer, Auth.authorize());
  }catch (error) {
    console.error(`Error adding manufacturer`, error);
    throw error;
  }
}

export async function update(manufacturer) {
  const { id } = manufacturer;
  try{
    return await axios.patch(`${Backend.stock.manufacturers.url}/${id}`, manufacturer, Auth.authorize());
  }catch (error) {
    console.error(`Error adding manufacturer`, error);
    throw error;
  }
}

export async function deleteById(manufacturerId){
  try{
    return await axios.delete(`${Backend.stock.manufacturers.url}/${manufacturerId}`, Auth.authorize());
  }catch(error){
    console.error(`Error deleting manufacturer: ${manufacturerId}`, error);
    throw error;
  }
}
