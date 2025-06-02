import {APIformat} from "../../../helpers/entityMapper";
import axios from "axios";
import {Backend} from "../../../data";
import Auth from "../../Auth";
export const ServiceEndPoint = {
  getAssociatedProvisioningTags,
  getAssociatedActivationCodes,
  deleteAssociatedProvisioningTag,
  addProvisioningTag,
};
export async function getAssociatedProvisioningTags(filter) {
  const mappedFilter = APIformat(filter);
  try {
    const response = await axios.get(`${Backend.services.service.url}/search`, {params: {...mappedFilter}, ...Auth.authorize()});
    const {_embedded, page} = response.data;
    const rows = _embedded !== undefined ? _embedded.services?.[0]?.serviceTags.map(s => {return {...s.provisioningTag};}) : [];

    return {rows , page };
  } catch (error) {
    console.error('Error fetching service tags:', error);
    throw error;
  }
}
export async function getAssociatedActivationCodes(filter) {
  const mappedFilter = APIformat(filter);
  try {
    const response = await axios.get(`${Backend.services.service.url}/search`, {params: {...mappedFilter}, ...Auth.authorize()});
    const {_embedded, page} = response.data;
    const rows = _embedded !== undefined ? _embedded.services?.[0]?.serviceActivations.map(s => {return {...s.activCode, tagValue: s.activValue};}) : [];
    return {rows , page };
  } catch (error) {
    console.error('Error fetching activation services:', error);
    throw error;
  }
}
export async function addProvisioningTag(item) {
  const { serviceId, tagCode } = item;
  try {
    return await axios.patch(`${Backend.services.service.url}/${serviceId}/changetags`,
      {changeTags: [{tagAction: 'ADD', tagCode}]}, Auth.authorize());

  } catch (error) {
    console.error('Error fetching activation services:', error);
    throw error;
  }
}
export async function deleteAssociatedProvisioningTag(item) {
  const { serviceId, tagCode } = item;
  try {
    return await axios.patch(`${Backend.services.service.url}/${serviceId}/changetags`,
      {changeTags: [{tagAction: 'REMOVE', tagCode}]}, Auth.authorize());
  } catch (error) {
    console.error('Error fetching activation services:', error);
    throw error;
  }
}
