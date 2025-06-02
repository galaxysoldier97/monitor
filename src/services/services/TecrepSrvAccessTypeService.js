import axios from 'axios';
import { Config } from '../../config';

class TecrepSrvAccessTypeService {

  static getAccessTypes() {
    return axios.get(`${Config.tecrepApiServicesUrl}/public/enums/network`).then(res => res.data);
  }

}

export default TecrepSrvAccessTypeService;
