import axios from 'axios';
import { Backend } from '../data';
import Auth from './Auth';

class TecrepDashboardService {

  /**
   * Get Resources statistics
   * @returns {Promise}
   */
  static getResourcesStats() {
    return axios.get(Backend.resources.dashboard.url, Auth.authorize())
    .then((res) => res)
    .catch((err) => Promise.reject(err));
  }

  /**
   * Get Services statistics
   * @returns {Promise}
   */
  static getServicesStats() {
    return axios.get(Backend.services.dashboard.url, Auth.authorize())
    .then((res) => res)
    .catch((err) => Promise.reject(err));
  }

  /**
   * Get Equipments statistics
   * @returns {Promise}
   */
  static getEquipmentsStats() {
    return axios.get(Backend.equipments.dashboard.url, Auth.authorize())
    .then((res) => res)
    .catch((err) => Promise.reject(err));
  }

}

export default TecrepDashboardService;
