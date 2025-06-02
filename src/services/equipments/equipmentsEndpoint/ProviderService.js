import axios from "axios";
import {Backend} from "../../../data";
import Auth from "../../Auth";
import {APIformat} from "../../../helpers/entityMapper";

export const ProviderEndpoint = {
    getAll,
    add,
    update,
    deleteById
};
export async function getAll(filter = {page: 0, size: 10}) {
    const params = new URLSearchParams({...filter}).toString();

    try {
        const response = await axios.get(`${Backend.equipments.providers.url}?${params}`, Auth.authorize());
        const {content, pageable, totalElements, totalPages} = response.data;
        return {rows:  content, page: {number: pageable.pageNumber, size: pageable.pageSize, totalElements, totalPages } };
    } catch (error) {
        console.error('Error fetching providers:', error);
        throw error;
    }
}


export async function add(provider) {
  const mappedProvider = APIformat(provider);
  try{
    return await axios.post(Backend.equipments.providers.url, mappedProvider, Auth.authorize());
  }catch (error) {
    console.error(`Error adding provider: `, error);
    throw error;
  }
}

export async function update(provider){
  const mappedProvider = APIformat(provider);
  const { id } = mappedProvider;

  try{
    const response = await axios.put(`${Backend.equipments.providers.url}/${id}`, mappedProvider, Auth.authorize());
    return response?.data?.content;
  }catch(error){
    console.error(`Error updating provider: ${id}`, error);
    throw error;
  }
}
export async function deleteById(providerId){
  try{
    return await axios.delete(`${Backend.equipments.providers.url}/${providerId}`, Auth.authorize());
  }catch(error){
    console.error(`Error deleting provider: ${providerId}`, error);
    throw error;
  }
}
