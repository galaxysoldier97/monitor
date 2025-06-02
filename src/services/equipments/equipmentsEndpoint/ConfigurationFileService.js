import axios from "axios";
import {Backend} from "../../../data";
import Auth from "../../Auth";
import {APIformat} from "../../../helpers/entityMapper";

export const ConfigurationFileEndpoint = {
    getAll,
    add,
    update,
    deleteByName
};
export async function getAll(filter = {page: 0, size: 10}) {
    const params = new URLSearchParams({...filter}).toString();

    try {
        const response = await axios.get(`${Backend.equipments.fileConfigurations.url}?${params}`, Auth.authorize());
        const {content, pageable, totalElements, totalPages} = response.data;
        return {rows:  content, page: {number: pageable.pageNumber, size: pageable.pageSize, totalElements, totalPages } };
    } catch (error) {
        console.error('Error fetching configuration file: ', error);
        throw error;
    }
}

export async function add(configurationFile) {
  const mappedConfigurationFile = APIformat(configurationFile);
  try{
    return await axios.post(Backend.equipments.fileConfigurations.url, mappedConfigurationFile, Auth.authorize());
  }catch (error) {
    console.error(`Error adding configuration file: `, error);
    throw error;
  }
}

export async function update(configurationFile){
  const {oldName, ...rest} = configurationFile;
  const mappedConfigurationFile = APIformat(rest);

  try{
    const response = await axios.patch(`${Backend.equipments.fileConfigurations.url}/${oldName}`, mappedConfigurationFile, Auth.authorize());
    return response?.data?.content;
  }catch(error){
    console.error(`Error updating configuration file: ${mappedConfigurationFile?.id}`, error);
    throw error;
  }
}
export async function deleteByName(configurationFileName){
  try{
    return await axios.delete(`${Backend.equipments.fileConfigurations.url}/${configurationFileName}`, Auth.authorize());
  }catch(error){
    console.error(`Error deleting configuration file: ${configurationFileName}`, error);
    throw error;
  }
}
