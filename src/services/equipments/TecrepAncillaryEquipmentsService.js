import axios from 'axios';
import { Backend } from '../../data';
import Auth from '../Auth';
import { removeUnsetValuesFromFilter } from '../../helpers/exportHelper';

function mapFilterToParams(filter) {
  return ({
    serialNumber: filter.serialNumber,
    macAddress: filter.macAddress,
    modelName: filter.model ? filter.model.name || filter.model : '',
    equipmentName: filter.equipmentName,
    status: filter.status,
    nature: filter.nature,
    provider: filter.provider ? filter.provider.name || filter.provider : '',
    warehouse: filter.warehouse ? filter.warehouse.name || filter.warehouse : '',
    accessType: filter.accessType,
    pairedEquipmentId: filter.pairedEquipmentId,
    orderId: filter.orderId,
    equipment: filter.equipmentAssociated,
    order: filter.orderAssociated,
    independent: filter.independentFilter,
    externalNumber: filter.externalNumber,
    batchNumber: filter.batchNumber,
    serviceId: filter.serviceId,
  });
}

function prepareAdd(ancillaryEquipment) {
  return {
    macAddress: ancillaryEquipment.macAddress,
    modelName: ancillaryEquipment.model ? ancillaryEquipment.model.name : null,
    accessType: ancillaryEquipment.accessType,
    equipmentName: ancillaryEquipment.equipmentName,
    serialNumber: ancillaryEquipment.serialNumber,
    nature: ancillaryEquipment.nature,
    warehouseName: ancillaryEquipment.warehouse ? ancillaryEquipment.warehouse.name : null,
    // By default new ancillary equipment are independent
    independent: true,
    recyclable: ancillaryEquipment.recyclable,
    sfpVersion: ancillaryEquipment.sfpVersion,
    batchNumber: ancillaryEquipment.batchNumber,
  };
}

class TecrepAncillaryEquipmentsService {

  /**
   * Get Ancillary Equipments list
   * @returns {Promise}
   */
  static getAncillaryEquipments() {
    return axios.get(Backend.equipments.ancillaryEquipments.url + '?page=0&size=9999999', Auth.authorize())
    .then(res => res.data);
  }

  static searchRevisions(id) {
    return axios.get(Backend.equipments.ancillaryEquipments.url + '/' + id + '/revisions', {
      params: {
        page: 0,
        size: 100,
        sort: '__revisionNumber__,desc',
      }, ...Auth.authorize(),
    })
    .then(res => res.data);
  }

  static search(filter, page = 0, size = 10) {
    return axios.get(Backend.equipments.ancillaryEquipments.url, {
      params: {
        page,
        size,
        ...mapFilterToParams(filter)
      }, ...Auth.authorize(),
    })
    .then(res => res.data);
  }

  static addAncillaryEquipment(ancillaryEquipment) {
    return axios.post(Backend.equipments.ancillaryEquipments.url, prepareAdd(ancillaryEquipment), Auth.authorize());
  }

  static deleteAncillaryEquipment(ancillaryEquipment) {
    return axios.delete(Backend.equipments.ancillaryEquipments.url + '/' + ancillaryEquipment.id, Auth.authorize());
  }

  /**
   * Update a Ancillary Equipment
   * @param {object} ancillaryEquipment
   * @returns {Promise}
   */
  static update(ancillaryEquipment) {
    const data = {
      macAddress: ancillaryEquipment.macAddress,
      independent: ancillaryEquipment.independent,
      pairedEquipmentId: ancillaryEquipment.pairedEquipmentId,
      sfpVersion: ancillaryEquipment.sfpVersion,
      warehouseName: ancillaryEquipment.warehouse ? ancillaryEquipment.warehouse.name : null,
      orderId: ancillaryEquipment.orderId,
      serviceId: ancillaryEquipment.serviceId
    };

    return axios.put(Backend.equipments.ancillaryEquipments.url + '/' + ancillaryEquipment.id, data, Auth.authorize());
  }

  /**
   * Update a Ancillary Equipment Status
   * @param {number} id
   * @param {string} event
   * @param {number} pairedEquipmentId
   * @param {number} orderId
   * @returns {Promise}
   */
  static updateState(id, event, pairedEquipmentId, orderId) {
    return axios.patch(Backend.equipments.ancillaryEquipments.url + '/' + id + '/' + event, {
      pairedEquipmentId,
      orderId
    }, Auth.authorize());
  }

  /**
   * Get Ancillary Equipment
   * @param {string} id
   * @returns {Promise}
   */
  static getAncillaryEquipment(id) {
    return axios.get(Backend.equipments.ancillaryEquipments.url + '/' + id, Auth.authorize())
    .then(res => res.data);
  }

  static exportAncillaryEquipments(filters) {
    const headers = {'Content-Type': 'blob'};
    const config = {method: 'GET', responseType: 'arraybuffer', headers};
    const mappedFilters = mapFilterToParams(filters);
    removeUnsetValuesFromFilter(mappedFilters);
    const urlFilters = new URLSearchParams(mappedFilters);
    return axios.get(`${Backend.equipments.ancillaryEquipments.url}/export?${urlFilters}`, {...config, ...Auth.authorize()});
  }

}

export default TecrepAncillaryEquipmentsService;
