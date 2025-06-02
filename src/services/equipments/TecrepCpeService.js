import axios from 'axios';
import { Backend } from '../../data';
import Auth from '../Auth';
import { UpdateWizardType } from '../../config/UpdateWizardType';
import { removeUnsetValuesFromFilter } from '../../helpers/exportHelper';

function mapFilterToParams(filter) {
  return {
    serialNumber: filter.serialNumber,
    macAddressCpe: filter.macAddressCpe,
    macAddressRouter: filter.macAddressRouter,
    macAddressVoip: filter.macAddressVoip,
    macAddressLan: filter.macAddressLan,
    macAddress5G: filter.macAddress5G,
    macAddress4G: filter.macAddress4G,
    modelName: filter.model ? filter.model.name || filter.model : undefined,
    hwVersion: filter.hwVersion,
    status: filter.status,
    nature: filter.nature,
    provider: filter.provider ? filter.provider.name || filter.provider : undefined,
    warehouse: filter.warehouse ? filter.warehouse.name || filter.warehouse : undefined,
    accessType: filter.accessType,
    externalNumber: filter.externalNumber,
    batchNumber: filter.batchNumber,
    orderId: filter.orderId,
    serviceId: filter.serviceId,
    order: filter.orderAssociated ? filter.orderAssociated : undefined,
    service: filter.serviceAssociated ? filter.serviceAssociated : undefined,
  };
}

function prepareEdit(cpe) {
  return {
    macAddressCpe: cpe.macAddressCpe,
    macAddressRouter: cpe.macAddressRouter,
    macAddressVoip: cpe.macAddressVoip,
    macAddressLan: cpe.macAddressLan,
    macAddress5G: cpe.macAddress5G,
    macAddress4G: cpe.macAddress4G,
    hwVersion: cpe.hwVersion,
    stbSerialNumber: cpe.stbSerialNumber,
    chipsetId: cpe.chipsetId,
    wifiSsid: cpe.wifiSsid,
    wifiPassword: cpe.wifiPassword,
    modelName: cpe.model ? cpe.model.name : null,
    serviceId: cpe.serviceId,
    id: cpe.id,
    orderId: cpe.orderId,
    serialNumber: cpe.serialNumber,
    externalNumber: cpe.externalNumber,
    accessType: cpe.accessType,
    status: cpe.status,
    nature: cpe.nature,
    recyclable: cpe.recyclable,
    preactivated: cpe.preactivated,
    batchNumber: cpe.batchNumber,
    warehouseName: cpe.warehouse ? cpe.warehouse.name : null,
  };
}

function prepareAdd(cpe) {
  return {
    serialNumber: cpe.serialNumber,
    accessType: cpe.accessType,
    nature: cpe.nature,
    batchNumber: cpe.batchNumber,
    modelName: cpe.model ? cpe.model.name : null,
    macAddressCpe: cpe.macAddressCpe,
    macAddressVoip: cpe.macAddressVoip,
    macAddressRouter: cpe.macAddressRouter,
    macAddressLan: cpe.macAddressLan,
    macAddress5G: cpe.macAddress5G,
    macAddress4G: cpe.macAddress4G,
    hwVersion: cpe.hwVersion,
    warehouseName: cpe.warehouse ? cpe.warehouse.name : null,
  };
}

class TecrepCpeService {

  /**
   * Get CPE list
   * @returns {Promise}
   */
  static getCPEs() {
    return axios.get(Backend.equipments.cpes.url + '?page=0&size=9999999', Auth.authorize())
    .then(res => res.data);
  }

  static search(filter, page = 0, size = 10) {
    return axios.get(Backend.equipments.cpes.url, {
      params: {
        ...mapFilterToParams(filter),
        page,
        size,
      }, ...Auth.authorize(),
    })
    .then(res => res.data);
  }

  static searchRevisions(id) {
    return axios.get(Backend.equipments.cpes.url + '/' + id + '/revisions', {
      params: {
        page: 0,
        size: 100,
        sort: '__revisionNumber__,desc',
      }, ...Auth.authorize(),
    })
    .then(res => res.data);
  }

  /**
   * Update CPE
   * @param {object} cpe
   * @returns {Promise}
   */
  static editCPE(cpe) {
    return axios.put(Backend.equipments.cpes.url + '/' + cpe.id, prepareEdit(cpe), Auth.authorize());
  }

  /**
   * Add CPE
   * @param {object} cpe
   * @returns {Promise}
   */
  static addCPE(cpe) {
    return axios.post(Backend.equipments.cpes.url, prepareAdd(cpe), Auth.authorize());
  }

  /**
   * Get CPE
   * @param {string} id
   * @returns {Promise}
   */
  static getCPE(id) {
    return axios.get(Backend.equipments.cpes.url + '/' + id, Auth.authorize())
    .then(res => res.data);
  }

  /**
   * Delete CPE
   * @param {object} cpe
   * @param {boolean} forced if user wants paired equipment deleted
   * @returns {Promise}
   */
  static deleteCPE(cpe, forced = false) {
    return axios.delete(`${Backend.equipments.cpes.url}/${cpe.id}?forced=${forced}`, Auth.authorize());
  }

  /**
   * Change CPE
   * @param {object} current
   * @param {object} previous
   * @returns {Promise}
   */
  static changeCPE(current, previous) {
    let prepared = {};
    switch (current.type) {
      case UpdateWizardType.STATUS:
        prepared = {
          transition: current.status || '',
          params: {serviceId: current.service ? current.service.serviceId : undefined, orderId: current.orderId ? current.orderId : undefined},
        };
        return axios.patch(Backend.equipments.cpes.url + '/' + previous.id + '/' + prepared.transition, prepared.params, Auth.authorize());
      case UpdateWizardType.SERVICE:
        prepared = Object.assign(prepareEdit(previous), {serviceId: current.service ? current.service.serviceId : null, orderId: current.orderId ? current.orderId : undefined});
        return axios.put(Backend.equipments.cpes.url + '/' + previous.id, prepared, Auth.authorize());
    }
  }

  static scroll(id, page = 0, size = 10) {
    return axios.get(Backend.equipments.cpes.url, {params: {page: page, size: size}, ...Auth.authorize()})
    .then(res => {
      if (!res.data.content || res.data.content.find(e => e.id === id)) {
        return TecrepCpeService.getCPE(id);
      }
      if (page + 1 <= res.data.totalPages && res.data.totalPages <= 200) {
        return TecrepCpeService.scroll(id, page + 1, size).then(res => Promise.resolve(res));
      }
      return TecrepCpeService.getCPE(id);
    });
  }

  static exportCpe(filters) {
    const headers = {'Content-Type': 'blob'};
    const config = {method: 'GET', responseType: 'arraybuffer', headers};
    const mappedFilters = mapFilterToParams(filters);
    removeUnsetValuesFromFilter(mappedFilters);
    const urlFilters = new URLSearchParams(mappedFilters);
    return axios.get(`${Backend.equipments.cpes.url}/export?${urlFilters}`, {...config, ...Auth.authorize()});
  }

}

export default TecrepCpeService;
