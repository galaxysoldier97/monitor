import axios from 'axios';
import { Backend } from '../../data';
import Auth from '../Auth';

class TecrepIpAddressesService {

  static search(page, size, filter) {
    return axios.get(Backend.resources.ipAddresses.url , {
      params: {
        page,
        size,
        ipAddress: filter.ipAddress,
        status: filter.status,
        activity: filter.activity,
        serviceId: filter.serviceId,
        orderId: filter.orderId,
        offerType: filter.offerType || null,
        domain: filter.domain,
        port: filter.port,
      }, ...Auth.authorize(),
    })
    .then(res => res.data);
  }

  static find(ipAddressId) {
    return axios.get(`${Backend.resources.ipAddresses.url}/${ipAddressId}` , {...Auth.authorize()})
    .then(res => res.data);
  }

  static update(ipAddress) {
    const data = {
      comment: ipAddress.comment,
      offerType: ipAddress.offerType,
      orderId: ipAddress.orderId,
      domain: ipAddress.domain,
      port: ipAddress.port,
    };
    return axios.patch(`${Backend.resources.ipAddresses.url}/${ipAddress.ipAddress}`, data, Auth.authorize());
  }

  static updateStatus(ipAddress, action, orderId, serviceId) {
    const data = {
      ...(orderId ? {orderId} : {}),
      ...(serviceId ? {serviceId} : {}),
    };
    return axios.patch(`${Backend.resources.ipAddresses.url}/${ipAddress.ipAddress}/${action}`, data, Auth.authorize());
  }

  static updateService(ipAddress, serviceId) {
    const data = {...ipAddress, serviceId};
    return axios.patch(`${Backend.resources.ipAddresses.url}/${ipAddress.ipAddress}`, data, Auth.authorize());
  }

  static searchRevisions(id) {
    return axios.get(Backend.resources.ipAddresses.url + '/' + id + '/revisions', {
      params: {page: 0, size: 100, sort: '__revisionNumber__,desc'},
      ...Auth.authorize()
    })
      .then(res => res.data);
  }

  static create(input) {
    const data = {
      ipAddress: input.ipAddress,
      port: input.port,
      status: input.status,
      activity: input.activity,
      offerType: input.offerType || null,
      comment: input.comment,
      domain: input.domain,
    };
    return axios.post(Backend.resources.ipAddresses.url, data, Auth.authorize());
  }

  static delete(ipAddress) {
    return axios.delete(`${Backend.resources.ipAddresses.url}/${ipAddress.ipAddress}`, Auth.authorize());
  }
}

export default TecrepIpAddressesService;
