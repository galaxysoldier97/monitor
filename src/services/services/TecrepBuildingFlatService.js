import axios from 'axios';
import { Backend } from '../../data';
import Auth from '../Auth';
import { cyclicGraph } from 'mt-react-library/functions';

class TecrepBuildingFlatService {

  /**
   * Scroll search to the page that contains the given Number
   * @param {string} accessPointId
   * @returns {Promise}
   */
  static scroll(accessPointId, page = 0, size = 10) {
    return axios.get(Backend.address.buildingFlat.url + '/search', {params: {page: page, size: size}, ...Auth.authorize()})
    .then(res => {
      if (!res.data._embedded || res.data._embedded.buildingFlatDToes.find(e => e.accessPointId === accessPointId)) {
        return TecrepBuildingFlatService.getService(accessPointId);
      }
      if (page + 1 <= res.data.page.totalPages && res.data.page.totalPages <= 200) {
        return TecrepBuildingFlatService.scroll(accessPointId, page + 1, size).then(res => Promise.resolve(res));
      }
      return TecrepBuildingFlatService.getService(accessPointId);
    })
    .catch((err) => Promise.reject(err));
  }

  /**
   * Get BuildingFlat
   * @param {string} serviceId
   * @returns {Promise}
   */
  static getService(buildingFlatId) {
    return axios.get(Backend.address.buildingFlat.url + '/accessPointId/' + buildingFlatId, Auth.authorize())
    .then((res) => cyclicGraph(res.data))
    .catch((err) => Promise.reject(err));
  }

  /**
   * Get Access Service list
   * @param {string} accessPointId
   * @param {long} buildingId
   * @param {string} buildingCode
   * @returns {Promise}
   */
  static search(accessPointId, buildingId, buildingCode, page = 0, size = 10) {
    return axios.get(Backend.address.buildingFlat.url + '/search', {params: {page: page, size: size, accessPointId: accessPointId, buildingId: buildingId, buildingCode: buildingCode}, ...Auth.authorize()})
    .then((res) => res.data)
    .catch((err) => Promise.reject(err));
  }
}

export default TecrepBuildingFlatService;
