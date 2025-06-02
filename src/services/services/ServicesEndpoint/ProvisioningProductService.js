import axios from "axios";
import {Backend} from "../../../data";
import Auth from "../../Auth";
import {APIformat} from "../../../helpers/entityMapper";
import {renameKey} from "../../../helpers/entityHelper";

export const ProvisioningProductEndpoint = {
  getAll,
  add,
  deleteById,
  getById,
};

export async function getAll(filter) {
  let mappedFilter = renameKey([filter], "productAction", "action");
  mappedFilter = renameKey(mappedFilter, "productCode", "code")[0];
  mappedFilter = APIformat(mappedFilter);
  const params = new URLSearchParams(mappedFilter).toString();

  let { tagActionId } = mappedFilter;
  tagActionId = tagActionId ? `${tagActionId}/` : '';


  try {
    const response = await axios.get(
      `${Backend.services.provisioningActions.url}/${tagActionId}provisioningsproduct?${params}`,
      Auth.authorize()
    );

    const { content, size, totalElements, number } = response.data;

    const rows = content.map((r) => ({
      ...r,
      tagActionId: r?.provAction?.tagActionId || null,
      serviceAction: r?.provAction?.serviceAction || null,
      tagCode: r?.provAction?.provisioningTag?.tagCode || null,
      tagAction: r?.provAction?.tagAction || null,
    }));

    return {
      rows,
      page: {
        size: size || 0,
        totalElements: totalElements || 0,
        number: number || 0,
      },
    };
  } catch (error) {
    console.error('Error fetching provisioning products', error);
    throw error;
  }
}

export async function getById(actionId, productId) {
  try {
    const response = await axios.get(
      `${Backend.services.provisioningActions.url}/${actionId}/provisioningsproduct/${productId}`,
      Auth.authorize()
    );
    const { provActionParameters } = response.data.provAction;
    const actionParameters = provActionParameters.map(p => {return {...p.technicalParameter, parameterValue: p.parameterValue};});
    response.data.provAction.provActionParameters = actionParameters;
    return response.data;

  } catch (error) {
    console.error('Error fetching the specified provisioning product', error);
    throw error;
  }
}

export async function add(item) {
  const {tagActionId, ...rest} = APIformat(item);

  try{
    return await axios.post(
      `${Backend.services.provisioningActions.url}/${tagActionId}/provisioningsproduct`, rest , Auth.authorize());
  }catch (error) {
    console.error(`Error adding activation code`, error);
    throw error;
  }
}

export async function deleteById(item){
  const {provisioningProductId, tagActionId} = item;
  try{
    return await axios.delete(`${Backend.services.provisioningActions.url}/${tagActionId}/provisioningsproduct/${provisioningProductId}`, Auth.authorize());
  }catch(error){
    console.error(`Error deleting provisioning product: ${"item"}`, error);
    throw error;
  }
}
