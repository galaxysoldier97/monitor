import axios from 'axios';
import { Backend } from '../../data';
import Auth from '../Auth';

const prepare = (blockNumber) => ({
  activity: blockNumber.activity,
  blockPrefix: blockNumber.blockPrefix,
  countryCode: blockNumber.countryCode,
  length: blockNumber.length,
  localPrefix: blockNumber.localPrefix,
  zone: blockNumber.zone,
});

class TecrepBlockNumberService {

  /**
   * Get Block Number list
   * @param {Object} filters
   * @param {number} page
   * @param {number} size
   * @returns {Promise}
   */
  static search(filters, page = 0, size = 10) {
    return axios.get(Backend.resources.blockNumbers.url + '/search',
      {params: {page, size, ...filters}, ...Auth.authorize()})
    .then(res => res.data);
  }

  /**
   * Get Block Number
   * @param {string} blockId
   * @returns {Promise}
   */
  static getBlockNumber(blockId) {
    return axios.get(Backend.resources.blockNumbers.url + '/' + blockId, Auth.authorize())
    .then(res => res.data);
  }

  /**
   * Add Block Number
   * @param {object} blockNumber
   * @returns {Promise}
   */
  static addBlockNumber(blockNumber) {
    let prepared = prepare(blockNumber);
    return axios.post(Backend.resources.blockNumbers.url, prepared, Auth.authorize());
  }

  /**
   * Delete Block number
   * @param {object} blockNumber
   * @returns {Promise}
   */
  static deleteBlockNumber(blockNumber) {
    return axios.delete(Backend.resources.blockNumbers.url + '/' + blockNumber.blockId, Auth.authorize());
  }

  static searchRevisions(id, page, size) {
    return axios.get(Backend.resources.blockNumbers.url + '/' + id + '/revisions', {params: {page, size}, ...Auth.authorize()})
    .then(res => res.data);
  }
}

export default TecrepBlockNumberService;

