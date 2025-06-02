import axios from "axios";
import {Backend} from "../../../data";
import Auth from "../../Auth";
import {APIformat} from "../../../helpers/entityMapper";
import {ProviderEndpoint} from "./ProviderService";
export const EquipmentModelEndpoint = {
    getAll,
    add,
    update,
    deleteById
};
export async function getAll(filter = {page: 0, size: 10}) {
    const params = new URLSearchParams({...filter}).toString();

    try {
        const response = await axios.get(`${Backend.equipments.equipmentModel.url}?${params}`, Auth.authorize());
        const {content, pageable, totalElements, totalPages} = response.data;
        const mappedContent = content.map(equipmentModel => {
          const { provider, ...rest } = equipmentModel;
          return {...rest, providerName: provider.name};
        });

        return {rows:  mappedContent, page: {number: pageable.pageNumber, size: pageable.pageSize, totalElements, totalPages } };
    } catch (error) {
        console.error('Error fetching equipment models:', error);
        throw error;
    }
}
export async function add(equipmentModel) {
    try {
        const mappedEquipmentModel = APIformat(equipmentModel);
        const { provider } = mappedEquipmentModel;

        const response = await ProviderEndpoint.getAll({name: provider, size: 1});
        const result = await axios.post(Backend.equipments.equipmentModel.url, {...mappedEquipmentModel, providerId: response?.rows[0]?.id}, Auth.authorize());
        return result;
    } catch (error) {
        console.error(`Error adding equipment model: `, error);
        throw error;
    }
}


export async function update(equipmentModel){
    const mappedEquipmentModel = APIformat(equipmentModel);
    const { providerName , id } = mappedEquipmentModel;

  try{
      const response = await ProviderEndpoint.getAll({name: providerName, size: 1});
      const result = await axios.put(`${Backend.equipments.equipmentModel.url}/${id}`, {...mappedEquipmentModel, providerId: response?.rows[0]?.id}, Auth.authorize());
      return result?.data?.content;
  }catch(error){
    console.error(`Error updating equipment model: ${id}`, error);
    throw error;
  }
}

export async function deleteById(equipmentModelId){
  try{
    return await axios.delete(`${Backend.equipments.equipmentModel.url}/${equipmentModelId}`, Auth.authorize());
  }catch(error){
    console.error(`Error deleting equipment model: ${equipmentModelId}`, error);
    throw error;
  }
}
