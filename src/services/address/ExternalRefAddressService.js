import axios from 'axios';
import { Backend } from '../../data';
import Auth from '../Auth';


class ExternalRefAddressService {

  static delete(externalRefAddressId) {
    return axios.delete(Backend.address.externalRefAddresses.url + '/' + externalRefAddressId, Auth.authorize())
    .then((res) => res)
    .catch((err) => Promise.reject(err));
  }

  static add(externalRefAddress, postalAddressId) {
    return axios.post(Backend.address.externalRefAddresses.url, {
      postalAddressId: postalAddressId, accessType: externalRefAddress.accessType,
      buildingCode: externalRefAddress.buildingCode, streetQualifier: externalRefAddress.streetQualifier, streetNumber: externalRefAddress.streetNumber, streetId: externalRefAddress.streetId,
    }, Auth.authorize())
    .then((res) => res)
    .catch((err) => Promise.reject(err));
  }

  static edit(externalRefAddress) {
    return axios.put(Backend.address.externalRefAddresses.url + '/' + externalRefAddress.externalRefAddressId, {
      accessType: externalRefAddress.accessType,
      buildingCode: externalRefAddress.buildingCode, streetQualifier: externalRefAddress.streetQualifier, streetNumber: externalRefAddress.streetNumber, streetId: externalRefAddress.streetId,
    }, Auth.authorize())
    .then((res) => res)
    .catch((err) => Promise.reject(err));
  }
}

export default ExternalRefAddressService;
