import axios from "axios";
import {Backend} from "../../../data";
import Auth from "../../Auth";

export const ActionParameterEndpoint = {
  getById,
  add,
  deleteById
};

export async function getById(filters) {
  const { tagActionId, provisioningProductId } = filters;
  try {
    const response = await axios.get(
      `${Backend.services.provisioningActions.url}/${tagActionId}/provisioningsproduct/${provisioningProductId}`,
      Auth.authorize()
    );
    const { provActionParameters } = response.data.provAction;
    const rows = provActionParameters.map(p => {return {...p.technicalParameter, parameterValue: p.parameterValue};});
    return { rows };

  } catch (error) {
    console.error('Error fetching the specified provisioning product', error);
    throw error;
  }
}

export async function add(item) {
  const { tagActionId, parameterValue, ...rest} = item;

  try{
    const response = await axios.get(`${Backend.services.technicalParameters.url}/search?code=${rest?.parameterCode}`, Auth.authorize());
    const parameterId = response?.data?._embedded?.technicalParameterDToes?.find(p => p.parameterType === rest.parameterType).parameterId;
    const technicalParameter = {...rest, parameterId};
    return await axios.post(`${Backend.services.provisioningActions.url}/${tagActionId}/parameters`, { parameterValue, technicalParameter}, Auth.authorize());
  }catch(error){
    console.error(`Error while trying to add the specified action parameter`, error);
    throw error;
  }
}
export async function deleteById(item) {
  const { tagActionId, parameterId } = item;
  try{
      return await axios.delete(`${Backend.services.provisioningActions.url}/${tagActionId}/parameters/${parameterId}`, Auth.authorize());
  }catch(error){
    console.error(`Error while trying to delete the action parameter: ${parameterId}`, error);
    throw error;
  }
}
