import axios from 'axios';
import { Backend } from '../../data';
import Auth from '../../services/Auth';

class TecrepAddressService {

  static getAddressesByStreetId(streetId, page, size) {
    return axios.get(`${Backend.address.address.url}/street/${streetId}`, {params: {page, size}, ...Auth.authorize()})
    .then(res => res.data);
  }

  static searchAddresses(page, size, filter) {
    return axios.get(`${Backend.address.address.url}/search`, {params: {...filter, page, size}, ...Auth.authorize()})
    .then(res => res.data);
  }

  static addAddress(address, streetId) {
    return axios.post(Backend.address.address.url, {...address, streetId}, Auth.authorize());
  }

  static editAddress(address) {
    return axios.put(`${Backend.address.address.url}/${address.addressId}`, {...address, streetId: address.street.streetId}, Auth.authorize());
  }

  static deleteAddress(addressId) {
    return axios.delete(`${Backend.address.address.url}/${addressId}`, Auth.authorize());
  }

}

export default TecrepAddressService;
