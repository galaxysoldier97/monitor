import axios from 'axios';
import { Backend } from '../../data';
import Auth from '../Auth';

class TecrepProvisioningTagService {

  static search(tagCode, accessType, activity, nature, componentType, page = 0, size = 10) {
    return axios.get(Backend.services.provisioningTag.url + '/search', {
      params: {page, size, tagCode, accessType, activity, nature, componentType}, ...Auth.authorize(),
    })
    .then(res => res.data);
  }

  static getById(tagId) {
    return axios.get(Backend.services.provisioningTag.url + '/' + tagId, Auth.authorize());
  }

  static getProvTagDetails(tagActionId) {
    return axios.get(`${Backend.services.provisioningActions.url}/${tagActionId}`, Auth.authorize())
    .then(res => res.data);
  }

  static addActionParameter(actionId, technicalParameter, parameterValue) {
    return axios.post(`${Backend.services.provisioningActions.url}/${actionId}/parameters`,
      {
        parameterValue,
        technicalParameter,
      }, Auth.authorize());
  }

  static deleteActionParameter(actionId, parameterId) {
    return axios.delete(`${Backend.services.provisioningActions.url}/${actionId}/parameters/${parameterId}`, Auth.authorize());
  }

  static getTagParameterCodes() {
    return axios.get(Backend.services.technicalParameters.url, Auth.authorize())
    .then(res => res.data);
  }

  static getProductsProvisioning(actionId, pageNumber, pageSize) {
    return axios.get(`${Backend.services.provisioningActions.url}/${actionId}/provisioningsproduct?page=${pageNumber}&size=${pageSize}`, Auth.authorize())
    .then(res => res.data);
  }

  static addProductProvisioning(productProvisioning, actionId) {
    return axios.post(`${Backend.services.provisioningActions.url}/${actionId}/provisioningsproduct`, productProvisioning, Auth.authorize());
  }

  static deleteProductProvisioning(actionId, productProvisioningId) {
    return axios.delete(`${Backend.services.provisioningActions.url}/${actionId}/provisioningsproduct/${productProvisioningId}`, Auth.authorize());
  }

}

export default TecrepProvisioningTagService;

