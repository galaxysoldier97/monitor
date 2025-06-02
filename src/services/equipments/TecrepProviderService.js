import axios from 'axios';
import { Backend } from '../../data';
import Auth from '../Auth';

class TecrepProviderService {

  static searchProviders(page = 0, size = 10) {
    return axios.get(`${Backend.equipments.providers.url}?page=${page}&size=${size}`, Auth.authorize())
    .then((res) => res.data)
    .catch((err) => Promise.reject(err));
  }

  static getProviderById(id){
    return axios.get(`${Backend.equipments.providers.url}/${id}`, Auth.authorize())
      .then((res ) => res.data)
      .catch((err) => Promise.reject(err));
  }
}

export default TecrepProviderService;
