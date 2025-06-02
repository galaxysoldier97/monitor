import axios from 'axios';
import { Backend } from '../../data';
import Auth from '../Auth';
import TecrepServiceService from './TecrepServiceService';
import { ServiceComponentWizardFieldType } from "../../config/UpdateWizardType";
import { ServiceRequestOptions } from "../../config/service/serviceAccess/serviceAccessFields";


class TecrepServiceComponentService {

  static search(filter, page = 0, size = 10) {
    return TecrepServiceService.search({...filter, serviceCategory: 'COMPONENT'}, page, size);
  }

  static addServiceComponent(service) {
    return axios.put(Backend.services.service.url, {...service, serviceCategory: 'COMPONENT'}, Auth.authorize());
  }

  static changeComponentService(current, previous) {
    let action = '';
    switch (current.type) {
      case ServiceComponentWizardFieldType.ACCESS_SERVICE :
        action = !current.accessService ? 'removeAccess' : (previous.serviceAccessDTO ? 'changeAccess' : 'addAccess');
        return axios.patch(Backend.services.service.url + '/' + previous.serviceId, {action: action, serviceId: previous.serviceId, accessServiceId: current.accessService ? current.accessService.serviceId : previous.serviceAccessDTO.serviceId}, Auth.authorize());
      case ServiceComponentWizardFieldType.STATUS_CHANGE :
        return axios.patch(Backend.services.service.url + '/setactiononservice', {action: current.status, serviceId: previous.serviceId}, Auth.authorize());
      case ServiceComponentWizardFieldType.NUMBER :
        action = !current.number ? 'removeNumber' : (previous.number ? 'changeNumber' : 'addNumber');
        return axios.patch(Backend.services.service.url + '/' + previous.serviceId, {action: action, serviceId: previous.serviceId, number: current.number ? current.number.number : previous.number, activityNumber: current.number ? current.number.activityService : ''}, Auth.authorize());
      case ServiceComponentWizardFieldType.RANGE :
        action = !current.range || !current.range.rangeId ? 'removeRange' : 'changeRange';
        return axios.patch(Backend.services.service.url + '/' + previous.serviceId, {action, serviceId: previous.serviceId, mainRangeId: current.range && current.range.rangeId}, Auth.authorize());
      case ServiceComponentWizardFieldType.REQUEST_CHANGE:
        switch (current.requestAction) {
          case ServiceRequestOptions.ROLLBACK_ADD_REQUEST:
          case ServiceRequestOptions.CANCEL_REQUEST:
          case ServiceRequestOptions.ACTIVATE_REQUEST:
          case ServiceRequestOptions.TERMINATE_REQUEST:
            return axios.patch(Backend.services.service.url + '/' + current.requestAction, {serviceId: previous.serviceId}, Auth.authorize());
          case ServiceRequestOptions.ADD_REQUEST:
            return axios.patch(Backend.services.service.url + '/' + current.requestAction, {serviceId: previous.serviceId, actionRequest: current.selectedRequest}, Auth.authorize());
          default:
        }
        break;
      default:
    }

  }

  static getComponentTypes() {
    return axios.get(Backend.services.componentTypes.url, Auth.authorize()).then(res => res.data);
  }
}

export default TecrepServiceComponentService;
