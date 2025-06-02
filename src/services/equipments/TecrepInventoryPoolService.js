import axios from 'axios';
import { Backend } from '../../data';
import Auth from '../Auth';

class TecrepInventoryPoolService {

  static searchInventoryPools(page = 0, size = 10) {
    return axios.get(`${Backend.equipments.inventorypools.url}?page=${page}&size=${size}`, Auth.authorize())
    .then((res) => res.data);
  }
}

export default TecrepInventoryPoolService;
