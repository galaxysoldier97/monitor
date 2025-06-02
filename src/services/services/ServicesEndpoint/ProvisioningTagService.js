import axios from "axios";
import {Backend} from "../../../data";
import Auth from "../../Auth";
import {APIformat} from "../../../helpers/entityMapper";
export const ProvisioningTagsEndPoint = {
  getAll,
  update,
  add,
  deleteById,
  getTagCodes,
};
export async function getAll(filter = {page: 0, size: 10}) {
  const mappedFilter = APIformat(filter);
  try {
    const response = await axios.get(`${Backend.services.provisioningTag.url}/search`, { params:
      mappedFilter, ...Auth.authorize(),
    });
    const {_embedded, page} = response.data;
    const rows = _embedded !== undefined ? _embedded.provisioningtags : [];
    return { rows, page };
  } catch (error) {
    console.error('Error fetching provisioning tags service:', error);
    throw error;
  }
}
export async function update(provisioningTag){
  const { componentType } = provisioningTag;
  const mappedProvisioningTag = APIformat(provisioningTag);
  if(!componentType){
    mappedProvisioningTag.componentType = "";
  }
  try{
    const response = await axios.put(`${Backend.services.provisioningTag.url}/${mappedProvisioningTag.tagId}`, mappedProvisioningTag, Auth.authorize());
    return response?.data;
  }catch(error){
    console.error('Error updating provisioning tag:', error);
    throw error;
  }

}
export async function add(provisioningTag) {
  const mappedProvisioningTag = APIformat(provisioningTag);
  try{
    return await axios.post(`${Backend.services.provisioningTag.url}`, mappedProvisioningTag, Auth.authorize());
  }catch (error) {
    console.error(`Error adding provisioning tag`, error);
    throw error;
  }
}

export async function deleteById(item){
  const { tagId } = item;

  try{
    return await axios.delete(`${Backend.services.provisioningTag.url}/${tagId}`, Auth.authorize());
  }catch(error){
    console.error(`Error deleting provisioning tag: ${tagId}`, error);
    throw error;
  }
}

export async function getTagCodes(activity, category) {
  try{
    const response = await axios.get(`${Backend.services.provisioningTag.url}?page=0&size=9999999`, Auth.authorize());
    const { _embedded } = response?.data;
    if(activity && category){
      return _embedded?.provisioningtags
          .filter(a => a.activity === activity && category === a.category && a.persistent)
          .map(p => {return {id: p.tagCode, key: p.tagCode, value: p.tagCode};});
    }
    return _embedded?.provisioningtags.map(p => {return {id: p.tagCode, key: p.tagCode, value: p.tagCode};});
  }catch(error){
    console.error(`Error while fetching tag activation codes`, error);
    throw error;
  }
}
