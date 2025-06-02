import axios from 'axios';
import { Backend } from '../data';

class TecrepConfigurationService {

  /**
   * Get application config
   * @returns {Promise}
   */
  static getApplicationConfig() {
    return axios.get(Backend.settings.configuration.url, {withCredentials: true})
    .then((res) => res)
    .catch((err) => Promise.reject(err));
  }
}

export default TecrepConfigurationService;
