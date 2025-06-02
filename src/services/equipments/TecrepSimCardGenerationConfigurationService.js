import axios from 'axios';
import Auth from '../Auth';
import {Backend} from "../../data";

class TecrepSimCardGenerationConfigurationService {
  static getSimCardGenerationConfiguration(page = 0, size = 100) {
    return axios.get(`${Backend.equipments.simcardConfiguration.url}?page=${page}&size=${size}`, Auth.authorize())
    .then((res) => res.data);
  }
}

export default TecrepSimCardGenerationConfigurationService;
