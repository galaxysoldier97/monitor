import axios from 'axios';
import { Backend } from '../../data';
import Auth from '../Auth';

class TecrepActivationCodeService {

  /**
   * Delete Activation Code
   * @param {number} activationCodeId
   * @returns {Promise}
   */
  static delete(activationCodeId) {
    return axios.delete(Backend.services.activationCode.url + '/' + activationCodeId, Auth.authorize());
  }

  /**
   * Add Activation Code
   * @param {object} activationCode
   * @returns {Promise}
   */
  static add(activationCode) {
    return axios.post(Backend.services.activationCode.url, activationCode, Auth.authorize());
  }

  /**
   * Update Activation Code
   * @param {object} activationCode
   * @returns {Promise}
   */
  static update(activationCode) {
    const data = {
      code: activationCode.code,
      description: activationCode.description,
      nature: activationCode.nature,
      networkComponent: activationCode.networkComponent,
    };
    return axios.put(Backend.services.activationCode.url + '/' + activationCode.activationCodeId, data, Auth.authorize());
  }

  /**
   * Get Activation Code list
   * @returns {Promise}
   */
  static getActivationCodes() {
    return axios.get(Backend.services.activationCode.url + '?page=0&size=9999999', Auth.authorize())
    .then(res => res.data);
  }

  /**
   * Search Activation Code
   * @param {string} code
   * @param {string} networkComponent
   * @param {string} nature
   * @param page
   * @param size
   * @returns {Promise}
   */
  static search(code, nature, networkComponent, page = 0, size = 10) {
    return axios.get(Backend.services.activationCode.url + '/search', {
      params: {page: page, size: size, activCode: code, networkComponent: networkComponent, nature: nature}, ...Auth.authorize(),
    })
    .then(res => res.data);
  }
}

export default TecrepActivationCodeService;

