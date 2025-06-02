import {renameKey} from "../../../helpers/entityHelper";
import axios from "axios";
import {Backend} from "../../../data";
import Auth from "../../Auth";
import {ActivationCodeEndPoint} from "./ActivationCodeService";

export const TagsAndCodesEndpoint = {
  getTagActivationCodes,
  deleteById,
  add,
};
export async function getTagActivationCodes(filter){
  const newFilter = renameKey([filter], "tagCode", "tagCodes")[0];
  const params = new URLSearchParams(newFilter).toString();
  try{
    const response = await axios.get(`${Backend.services.tagActivationCodes.url}/search?${params}`, Auth.authorize());
    const {_embedded, page} = response.data;

    return {rows: _embedded?.tagActivationCodeDetailsDToes?.map(t => ({
        ...t?.activationCode,
        tagValue: t?.tagValue
      })) || [] , page };
  }catch(error){
    console.error(`Error fetching activation codes associated to the tag specified`, error);
    throw error;
  }
}
export async function add(tagsAndCodes) {
  const { tagId, tagValue, code } = tagsAndCodes;
  try {
    const data = await ActivationCodeEndPoint.getAll({ activCode: code });
    const activId = data?.rows?.[0].id;
    const response =  await axios.post(
      Backend.services.tagActivationCodes.url,
      {tagId, activId, tagValue},
      Auth.authorize()
    );
    return {data: response?.data?.activationCode};
  } catch (error) {
    console.error(`Error adding provisioning tag`, error);
    throw error;
  }
}
export async function deleteById(item){
  const {activationCodeId, tagId} = item;
  try{
     await axios.delete(`${Backend.services.tagActivationCodes.url}/${tagId}/${activationCodeId}`, Auth.authorize());
     return {activationCodeId: activationCodeId};
  }catch(error){
    console.error(`Error fetching activation codes associated to the tag specified`, error);
    throw error;
  }
}
