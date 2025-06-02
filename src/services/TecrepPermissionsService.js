import axios from 'axios';
import { Backend } from '../data';

class TecrepPermissionsService {

  /**
   * Get the list of application permissions
   * @returns {Promise}
   */
  static getAllPermissions() {
    return axios.get(Backend.settings.permissions.url, {withCredentials: true})
    .then((res) => res)
    .catch((err) => Promise.reject(err));
  }

  /**
   * Get the list of application roles
   * @returns {Promise}
   */
  static getAllRoles() {
    return axios.get(Backend.settings.roles.url, {withCredentials: true})
    .then((res) => res)
    .catch((err) => Promise.reject(err));
  }

  /**
   * Add roles
   * @param {string} role
   * @returns {Promise}
   */
  static addRole(role) {
    return axios.post(Backend.settings.roles.url + '/addrole/' + role, null, {withCredentials: true})
    .then((res) => res)
    .catch((err) => Promise.reject(err));
  }

  /**
   * Update roles
   * @param {number} id
   * @returns {Promise}
   */
  static updateRole(data) {
    return axios.put(Backend.settings.roles.url + '/updaterole/' + data.id + '/' + data.role, null, {withCredentials: true})
    .then((res) => res)
    .catch((err) => Promise.reject(err));
  }

  /**
   * Delete roles
   * @param {number} id
   * @returns {Promise}
   */
  static deleteRole(id) {
    return axios.delete(Backend.settings.roles.url + '/deleterole/' + id, {withCredentials: true})
    .then((res) => res)
    .catch((err) => Promise.reject(err));
  }

  /**
   * Permit Role to perform permission
   * @param {string} permission
   * @param {string} role
   * @returns {Promise}
   */
  static permit(permission, role) {
    return axios.post(Backend.settings.permissions.url + '/permit', {}, {withCredentials: true, params: {role: role, permission: permission}})
    .then((res) => res)
    .catch((err) => Promise.reject(err));
  }

  /**
   * Deny Role from performing permission
   * @param {string} permission
   * @param {string} role
   * @returns {Promise}
   */
  static deny(permission, role) {
    return axios.post(Backend.settings.permissions.url + '/deny', {}, {withCredentials: true, params: {role: role, permission: permission}})
    .then((res) => res)
    .catch((err) => Promise.reject(err));
  }

}

export default TecrepPermissionsService;
