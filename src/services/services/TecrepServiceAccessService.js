import axios from 'axios';
import { Backend } from '../../data';
import TecrepServiceService from './TecrepServiceService';
import Auth from '../Auth';
import { ServiceAccessWizardFieldType } from '../../config/UpdateWizardType';
import { ServiceRequestOptions } from '../../config/service/serviceAccess/serviceAccessFields';

function prepare(accessService) {
  return {
    serviceId: accessService.serviceId,
    crmServiceId: accessService.crmServiceId,
    customerNo: parseInt(accessService.customerNo, 10),
    techId: accessService.techId,
    actions: ["changeCrmRef", "changeTechId"],
  };
}

class TecrepServiceAccessService {

  static search(filter, page = 0, size = 10) {
    return TecrepServiceService.search({...filter, serviceCategory: 'ACCESS'}, page, size);
  }

  static scroll(serviceId, page = 0, size = 10) {
    return axios.get(Backend.services.service.url + '/search', {params: {serviceCategory: 'ACCESS', page: page, size: size}, ...Auth.authorize()})
    .then(res => {
      if (!res.data._embedded || res.data._embedded.serviceaccesses.find(e => e.serviceId === serviceId)) {
        return TecrepServiceService.getService(serviceId);
      }
      if (page + 1 <= res.data.page.totalPages && res.data.page.totalPages <= 200) {
        return TecrepServiceAccessService.scroll(serviceId, page + 1, size).then(resScroll => Promise.resolve(resScroll));
      }
      return TecrepServiceService.getService(serviceId);
    });
  }

  /**
   * Update Access Service
   * @param {object} accessService
   * @returns {Promise}
   */
  static editAccessService(accessService) {
    return axios.patch(Backend.services.service.url + '/' + accessService.serviceId, prepare(accessService), Auth.authorize());
  }

  static addAccessService(accessService) {
    return axios.put(Backend.services.service.url, {...accessService, serviceCategory: 'ACCESS'}, Auth.authorize());
  }

  /**
   * Change Access Service
   * @param {object} current
   * @param {object} previous
   * @returns {Promise}
   */
  static changeAccessService(current, previous) {
    let action = '';
    const backendServicesUrl = `${Backend.services.service.url}/${previous.serviceId}`;
    const {PARENT_SERVICE, SIM_CARD,NUMBER,  RANGE, CPE,
      ANCILLARY_EQUIPMENT, ACCESS_POINT,  STATUS_CHANGE, REQUEST_CHANGE} = ServiceAccessWizardFieldType;

    switch (current.type) {
      case PARENT_SERVICE :
        action = !current.parentService ? 'removeParent' : previous.parentServiceAccess?.serviceId ? 'changeParent' : 'addParent';
        return axios.patch(backendServicesUrl, {action, serviceId: previous.serviceId, parentServiceId: current.parentService?.serviceId || previous.parentServiceAccess?.serviceId || null}, Auth.authorize());
      case SIM_CARD :
        action = !current.simCard ? 'removeEqt' : (previous.equipmentId ? 'changeEqt' : 'addEqt');
        return axios.patch(backendServicesUrl, {action, serviceId: previous.serviceId, equipmentId: current.simCard?.id || previous.equipmentId, equipmentCategory: current.simCard ? 'SIMCARD' : null}, Auth.authorize());
      case NUMBER :
        action = !current.number ? 'removeNumber' : (previous.number ? 'changeNumber' : 'addNumber');
        return axios.patch(backendServicesUrl, {action, serviceId: previous.serviceId, number: current?.number?.number || previous.number, activityNumber: current.number?.activityService }, Auth.authorize());
      case RANGE :
        action = !current.range || !current.range.rangeId ? 'removeRange' : 'changeRange';
        return axios.patch(backendServicesUrl, {action, serviceId: previous.serviceId, mainRangeId: current.range?.rangeId}, Auth.authorize());
      case CPE :
        action = !current.cpe ? 'removeEqt' : (previous.equipmentId ? 'changeEqt' : 'addEqt');
        return axios.patch(backendServicesUrl, {action, serviceId: previous.serviceId, equipmentId: current.cpe?.id || previous.equipmentId, equipmentCategory: current.cpe ? 'CPE' : null}, Auth.authorize());
      case ANCILLARY_EQUIPMENT :
        action = !current.ancillaryEquipment ? 'removeEqt' : (previous.equipmentId ? 'changeEqt' : 'addEqt');
        return axios.patch(backendServicesUrl, {action, serviceId: previous.serviceId, equipmentId: current.ancillaryEquipment?.id || previous.equipmentId, equipmentCategory: current.ancillaryEquipment ? 'ANCILLARY' : null}, Auth.authorize());
      case ACCESS_POINT :
        action = !current.accessPoint ? 'removeAccPoint' : (previous.accessPointId ? 'changeAccPoint' : 'addAccPoint');
        return axios.patch(backendServicesUrl, {action, serviceId: previous.serviceId, accessPointId: current.accessPoint?.accessPointId || previous.accessPointId}, Auth.authorize());
      case STATUS_CHANGE :
        return axios.patch(`${Backend.services.service.url}/setactiononservice`, {action: current.status, serviceId: previous.serviceId}, Auth.authorize());
      case REQUEST_CHANGE: {
        const {ROLLBACK_ADD_REQUEST, CANCEL_REQUEST, ACTIVATE_REQUEST, ADD_REQUEST} = ServiceRequestOptions;

        switch (current.requestAction) {
          case ROLLBACK_ADD_REQUEST:
          case CANCEL_REQUEST:
          case ACTIVATE_REQUEST:
            return axios.patch(`${Backend.services.service.url}/${current.requestAction}`, {serviceId: previous.serviceId}, Auth.authorize());
          case ADD_REQUEST:
            return axios.patch(`${Backend.services.service.url}/current.requestAction`, {serviceId: previous.serviceId, actionRequest: current.selectedRequest
            }, Auth.authorize());
          default:
            throw new Error('UNSUPPORTED_REQUEST_ACTION');
        }
      }
    }
  }
}

export default TecrepServiceAccessService;
