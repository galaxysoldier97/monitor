import axios from "axios";
import {Backend} from "../../../data";
import Auth from "../../Auth";
import {APIformat} from "../../../helpers/entityMapper";

export const SimcardConfigurationEndpoint = {
  getAll,
  add,
  update,
  deleteByName
};
export async function getAll(filter = {page: 0, size: 10}) {
  const params = new URLSearchParams({...filter}).toString();

  try {
    const response = await axios.get(`${Backend.equipments.simcardConfiguration.url}?${params}`, Auth.authorize());
    const {content, pageable, totalElements, totalPages} = response.data;

    return {rows:  content.map(row => {
        const {plmn, importFileConfiguration, exportFileConfiguration, ...rest} = row;
        return {...rest,
          plmnCode: plmn?.id,
          importFileConfigurationName: importFileConfiguration?.name,
          exportFileConfigurationName: exportFileConfiguration?.name
        };}), page: {number: pageable.pageNumber, size: pageable.pageSize, totalElements, totalPages } };
  } catch (error) {
    console.error('Error fetching simcard configuration:', error);
    throw error;
  }
}

export async function add(configuration) {
  const mappedSimcardConfiguration = APIformat(configuration);

  try {
    return await axios.post(Backend.equipments.simcardConfiguration.url, mappedSimcardConfiguration, Auth.authorize());
  } catch (error) {
    console.error(`Error simcard configuration: `, error);
    throw error;
  }
}


export async function update(configuration){
  const mappedSimcardConfiguration = APIformat(configuration);
  const { name } = mappedSimcardConfiguration;

  try{
    const response = await axios.patch(`${Backend.equipments.simcardConfiguration.url}/${name}`, mappedSimcardConfiguration, Auth.authorize());
    return response?.data?.content;
  }catch(error){
    console.error(`Error updating simcard configuration: ${name}`, error);
    throw error;
  }
}
export async function deleteByName(configurationId){
  try{
    return await axios.delete(`${Backend.equipments.simcardConfiguration.url}/${configurationId}`, Auth.authorize());
  }catch(error){
    console.error(`Error deleting simcard configuration: ${configurationId}`, error);
    throw error;
  }
}
