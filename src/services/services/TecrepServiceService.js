import axios from 'axios';
import { Backend } from '../../data';
import { cyclicGraph } from 'mt-react-library/functions';
import Auth from '../Auth';

class TecrepServiceService {

  static search(filter, page = 0, size = 10) {
    return axios.get(Backend.services.service.url + '/search', {
      params: {
        page,
        size,
        crmServiceId: filter.crmServiceId,
        parentServiceId: filter.parentServiceId,
        customerNo: filter.customerNo,
        serviceActivity: filter.serviceActivity,
        accessType: filter.accessType,
        status: filter.status,
        number: filter.number,
        activationDate: filter.activationDate,
        serviceCategory: filter.serviceCategory,
        serviceId: filter.serviceId,
        equipmentId: filter.equipmentId,
        mainRangeId: filter.mainRangeId,
        accessPointId: filter.serviceAccessPointId || undefined,
        accessServiceId: filter.serviceAccessId,
        ontId: filter.ontId || undefined,
        techId: filter.techId,
        componentType: filter.componentType
      }, ...Auth.authorize(),
    })
    .then(res => res.data);
  }

  /**
   * Delete Service
   * @param {service} service
   * @param {boolean} forced if user wants all associated components deleted
   * @returns {Promise}
   */
  static deleteService(service, forced=false) {
    return axios.delete(`${Backend.services.service.url}/${service.serviceId}?forced=${forced}`, Auth.authorize())
    .then(res => res.data);
  }

  /**
   * Get Service
   * @param {string} serviceId
   * @returns {Promise}
   */
  static getService(serviceId) {
    return axios.get(Backend.services.service.url + '/' + serviceId, Auth.authorize())
    .then(res => cyclicGraph(res.data));
  }

  static searchRevisions(serviceId) {
    return axios.get(Backend.services.service.url + '/' + serviceId + '/revisions', {params: {page: 0, size: 100, sort: '__revisionNumber__,desc'}, ...Auth.authorize()})
    .then(res => res.data);
  }

  static getActivities() {
    return axios.get(Backend.services.activities.url, Auth.authorize()).then(res => res.data);
  }

}

export default TecrepServiceService;
