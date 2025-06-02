import axios from 'axios';
import { Backend } from '../../data';
import Auth from '../Auth';
import { UpdateWizardType } from '../../config/UpdateWizardType';

function prepare(number) {
  return {
    number: number.number,
    orderId: number.orderId,
    status: number.status,
    vanityCategory: number.vanityCategory,
    inventoryPoolCode: number.inventoryPoolCode,
    nature: number.nature,
    intervalNumber: number.intervalNumber,
    blockNumber: number.blockNumber,
    serviceId: number.serviceId,
    offerType: number.offerType,
  };
}

function prepareAdd(number) {
  return {
    number: number.number,
    status: number.statusAdd,
    vanityCategory: number.vanityCategory,
    inventoryPoolCode: number.inventoryPoolCode,
    activity: number.activity,
    nature: number.nature,
    intervalNumber: number.intervalNumber,
    blockNumber: number.blockNumber,
    serviceId: number.serviceId,
    offerType: number.offerType,
  };
}

class TecrepNumberService {

  static search(filter, page, size) {
    return axios.get(Backend.resources.numbers.url + '/search', {
      params: {
        page,
        size,
        number: filter.number || '',
        status: filter.status,
        vanityCategory: filter.vanityCategory,
        activity: filter.activityService,
        nature: filter.nature,
        service: filter.serviceAssociated,
        order: filter.orderAssociated,
        inventoryPoolCode: filter.inventoryPoolCode,
        rangeId: filter.rangeId,
        zone: filter.zone,
        serviceId: filter.serviceId,
        localPhoneNumber: filter.localPhoneNumber,
        zoneId: filter.zoneId,
        offerType: filter.offerType
      }, ...Auth.authorize(),
    })
      .then(res => res.data);
  }

  /**
   * Scroll search to the page that contains the given Number
   * @param {string} number
   * @param {number} page
   * @param {number} size
   * @returns {Promise}
   */
  static scroll(number, page = 0, size = 10) {
    return axios.get(Backend.resources.numbers.url + '/search', {params: {page, size}, ...Auth.authorize()})
      .then(res => {
        if (!res.data.content || res.data.content.find(e => e.number === number)) {
          return TecrepNumberService.getNumber(number);
        }
        if (page + 1 <= res.data.totalPages && res.data.totalPages <= 200) {
          return TecrepNumberService.scroll(number, page + 1, size).then(res => Promise.resolve(res));
        }
        return TecrepNumberService.getNumber(number);
      });
  }

  /**
   * Get Number
   * @param {string} number
   * @returns {Promise}
   */
  static getNumber(number) {
    return axios.get(Backend.resources.numbers.url + '/search', {
      params: {
        page: 0,
        size: 1,
        number
      }, ...Auth.authorize()
    })
      .then(res => res.data.content[0]);
  }

  /**
   * Get Number
   * @param {number} numberId
   * @returns {Promise}
   */
  static getNumberbyId(numberId) {
    return axios.get(Backend.resources.numbers.url + '/id/' + numberId, Auth.authorize())
      .then(res => res.data);
  }

  /**
   * Add Number
   * @param {object} number
   * @returns {Promise}
   */
  static addNumber(number) {
    return axios.post(Backend.resources.numbers.url, prepareAdd(number), Auth.authorize());
  }

  /**
   * Update Number
   * @param {object} number
   * @returns {Promise}
   */
  static editNumber(number) {
    let prepared = prepare(number);
    return axios.put(`${Backend.resources.numbers.url}/${number.number}`, prepared, Auth.authorize());
  }

  /**
   * Update Number
   * @param {object} current
   * @param {object} previous
   * @returns {Promise}
   */
  static changeNumber(current, previous) {
    let prepared = {};
    switch (current.type) {
      case UpdateWizardType.STATUS:
        prepared = {
          transition: current.status || '',
          params: {
            serviceId: (current.service && current.service.serviceId) ? Number(current.service.serviceId) : null,
            orderId: current.orderId ? Number(current.orderId) : null,
            activityService: current.service ? current.service.serviceActivity : null,
            offerType: current.offerType ? current.offerType : null,
          },
        };
        return axios.patch(Backend.resources.numbers.url + '/' + previous.number + '/' + prepared.transition, prepared.params, Auth.authorize());
      case UpdateWizardType.SERVICE:
        prepared = {
          ...prepare(previous),
          serviceId: current.service ? Number(current.service.serviceId) : null,
          orderId: current.orderId ? Number(current.orderId) : null,
          activityService: current.service ? current.service.serviceActivity : null,
        };
        return axios.put(Backend.resources.numbers.url + '/' + previous.number, prepared, Auth.authorize());
    }
  }
  static updateStatus(current, previous) {
    const prepared = {
          transition: current.status || '',
          params: {
            serviceId: Number(current?.serviceId) || null,
            orderId: Number(current?.orderId) || null,
            activityService: current?.activityService || null,
            offerType: current?.offerType || null
          },
        };
    return axios.patch(Backend.resources.numbers.url + '/' + previous.number + '/' + prepared.transition, prepared.params, Auth.authorize());
  }
  static updateService(current, previous){
    const prepared = {
      ...prepare(previous),
      serviceId: Number(current?.serviceId) || null,
      orderId: Number(current?.orderId) || null,
      activityService: current?.serviceActivity || null,
    };
    return axios.put(Backend.resources.numbers.url + '/' + previous.number, prepared, Auth.authorize());
  }

  /**
   * Delete Number
   * @param {object} number
   * @returns {Promise}
   */
  static deleteNumber(number) {
    return axios.delete(Backend.resources.numbers.url + '/' + number.number, Auth.authorize());
  }

  static searchRevisions(id) {
    return axios.get(Backend.resources.numbers.url + '/id/' + id + '/revisions', {
      params: {
        page: 0,
        size: 100,
        sort: '__revisionNumber__,desc'
      }, ...Auth.authorize()
    })
      .then(res => res.data);
  }

  static getActivities() {
    return axios.get(Backend.resources.activities.url, Auth.authorize()).then(res => res.data);
  }

}

export default TecrepNumberService;
