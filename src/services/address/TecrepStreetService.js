import axios from 'axios';
import { Backend } from '../../data';
import Auth from '../../services/Auth';

class TecrepStreetService {

  static getStreets(filter, page, size) {
    return axios.get(`${Backend.address.streets.url}/search`, {params: {...filter, page, size}, ...Auth.authorize()})
    .then(res => res.data);
  }

  static getStreetDetails(streetId) {
    return axios.get(`${Backend.address.streets.url}/${streetId}`, Auth.authorize())
    .then(res => res.data);
  }

  static addStreet(street) {
    return axios.post(Backend.address.streets.url, street, Auth.authorize());
  }

  static editStreet(street) {
    return axios.put(`${Backend.address.streets.url}/${street.streetId}`, street, Auth.authorize());
  }

  static deleteStreet(streetId) {
    return axios.delete(`${Backend.address.streets.url}/${streetId}`, Auth.authorize());
  }

}

export default TecrepStreetService;
