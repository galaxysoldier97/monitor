import axios from 'axios';
import { Backend } from '../../data';
import Auth from '../Auth';

class TecrepWarehouseService {

  static searchWarehouses(page = 0, size = 10) {
    return axios.get(`${Backend.equipments.warehouses.url}?page=${page}&size=${size}`, Auth.authorize())
    .then((res) => res.data)
    .catch((err) => Promise.reject(err));
  }
}

export default TecrepWarehouseService;
