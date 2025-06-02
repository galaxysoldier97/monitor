import axios from 'axios';
import { Backend } from '../../data';
import Auth from '../Auth';

class TecrepPlmnService {
  static getPlmn(filters = {}, page = 0, size = 9999999) {
    const params = new URLSearchParams({...filters, page, size}).toString();
    return axios.get(`${Backend.equipments.plmns.url}?${params}`, Auth.authorize())
    .then(res => res.data);
  }
}

export default TecrepPlmnService;
