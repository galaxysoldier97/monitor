import axios from "axios";
import {Backend} from "../../../data";
import Auth from "../../Auth";
import {APIformat} from "../../../helpers/entityMapper";

export const PlmnEndpoint = {
    getAll,
    add,
    update,
    deleteById
};
export async function getAll(filter = {page: 0, size: 10}) {
    const params = new URLSearchParams({...filter}).toString();

    try {
        const response = await axios.get(`${Backend.equipments.plmns.url}?${params}`, Auth.authorize());
        const {content, pageable, totalElements, totalPages} = response.data;
        return {rows:  content, page: {number: pageable.pageNumber, size: pageable.pageSize, totalElements, totalPages } };
    } catch (error) {
        console.error('Error fetching PLMN rows:', error);
        throw error;
    }
}

export async function add(plmn) {
  const mappedPlmn = APIformat(plmn);
  try{
    return await axios.post(Backend.equipments.plmns.url, mappedPlmn, Auth.authorize());
  }catch (error) {
    console.error(`Error adding PLMN: `, error);
    throw error;
  }
}

export async function update(plmn){
  const mappedPlmn = APIformat(plmn);
  const { id } = mappedPlmn;

  try{
    const response = await axios.put(`${Backend.equipments.plmns.url}/${id}`, mappedPlmn, Auth.authorize());
    return response?.data?.content;
  }catch(error){
    console.error(`Error updating PLMN: ${id}`, error);
    throw error;
  }
}
export async function deleteById(plmnId){
  try{
    return await axios.delete(`${Backend.equipments.plmns.url}/${plmnId}`, Auth.authorize());
  }catch(error){
    console.error(`Error deleting PLMN: ${plmnId}`, error);
    throw error;
  }
}
