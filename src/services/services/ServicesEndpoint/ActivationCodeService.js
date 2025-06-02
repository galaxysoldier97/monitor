import axios from "axios";
import {Backend} from "../../../data";
import Auth from "../../Auth";
import {APIformat} from "../../../helpers/entityMapper";
import {renameKey} from "../../../helpers/entityHelper";
export const ActivationCodeEndPoint = {
  getAll,
  update,
  add,
  deleteById
};
export async function getAll(filter = {page: 0, size: 10}) {
  const formattedFilter = renameKey([filter], "code", "activCode")[0];

  try {
    const response = await axios.get(`${Backend.services.activationCode.url}/search`, { params:
      formattedFilter, ...Auth.authorize()});
    const {_embedded, page} = response.data;
    const rows = _embedded !== undefined ? renameKey(_embedded?.activationcodes, "activationCodeId", "id"): [];
    return {rows:  rows, page };
  } catch (error) {
    console.error('Error fetching activation codes:', error);
    throw error;
  }
}

export async function update(activationCode){
  const mappedActivationCode = APIformat(activationCode);
    try{
      const response = await axios.put(`${Backend.services.activationCode.url}/${mappedActivationCode.id}`, mappedActivationCode, Auth.authorize());
      return response?.data;
    }catch(error){
      console.error('Error updating activation code:', error);
      throw error;
    }

}

export async function add(activationCode) {
  const mappedActivationCode = APIformat(activationCode);
  try{
    return await axios.post(`${Backend.services.activationCode.url}`, mappedActivationCode, Auth.authorize());
  }catch (error) {
    console.error(`Error adding activation code`, error);
    throw error;
  }
}

export async function deleteById(activationCodeId){
  try{
    return await axios.delete(`${Backend.services.activationCode.url}/${activationCodeId}`, Auth.authorize());
  }catch(error){
    console.error(`Error deleting activation code: ${activationCodeId}`, error);
    throw error;
  }
}
