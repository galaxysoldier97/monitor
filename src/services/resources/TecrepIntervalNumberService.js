import axios from 'axios';
import Auth from '../Auth';
import { Backend } from '../../data';

function prepare(blockNumber, intervalNumber) {
  return {
    firstNumber: intervalNumber.firstNumber,
    lastNumber: intervalNumber.lastNumber,
    numberOfRange: intervalNumber.numberOfRange,
    blockId: blockNumber.blockId,
    activity: intervalNumber.activity,
    system: Boolean(intervalNumber.system),
    portability: Boolean(intervalNumber.portability),
    inventoryPoolCode: intervalNumber.inventoryPoolCode,
    offerType: intervalNumber.offerType
  };
}

class TecrepIntervalNumberService {

  /**
   * Fetch all interval numbers
   */
  static fetch(page = 0, size = 20) {
    return axios.get(Backend.resources.intervalNumbers.url, {params: {page, size}, ...Auth.authorize()})
    .then(res => res.data);
  }

  /**
   * Get Block Number list
   * @param {object} filters
   * @param {number} page
   * @param {number} size
   * @returns {Promise}
   */
  static search(filters, page = 0, size = 10) {
    return axios.get(Backend.resources.intervalNumbers.url + '/search', {
      params: {
        page,
        size,
        blockNumberId: filters.blockNumberId,
        firstNumber: filters.firstNumber,
        activity: filters.activity,
        system: filters.system,
        portability: filters.portability,
      }, ...Auth.authorize(),
    })
    .then(res => res.data);
  }

  /**
   * Add Interval Number
   * @param {Number} blockNumber
   * @param {object} intervalNumber
   * @returns {Promise}
   */
  static addIntervalNumber(blockNumber, intervalNumber) {
    let prepared = prepare(blockNumber, intervalNumber);
    return axios.post(Backend.resources.intervalNumbers.url, prepared, Auth.authorize());
  }

  /**
   * Delete Interval number
   * @param {object} intervalNumber
   * @returns {Promise}
   */
  static deleteIntervalNumber(intervalNumber) {
    return axios.delete(Backend.resources.intervalNumbers.url + '/' + intervalNumber.intervalId, Auth.authorize());
  }
}

export default TecrepIntervalNumberService;
