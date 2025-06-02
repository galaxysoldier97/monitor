import axios from 'axios';
import { Config } from '../../config';

class TecrepEqmAccessTypeService {

  static getAccessTypes() {
    return axios.get(`${Config.tecrepApiEquipmentsUrl}/public/enums/accesstype`).then(res => res.data);
  }

}

export default TecrepEqmAccessTypeService;
