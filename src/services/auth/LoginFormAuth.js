import { Backend } from '../../data';
import axios from 'axios';
import { Redirect } from 'react-router-dom';
import React from 'react';

export default class LoginFormAuth {

  /**
   * Authorize an HTTP request
   */
  static authorize(additionalConfig = {}) {
    let authorized = Object.assign(additionalConfig, {
      credentials: 'include',
    });
    return authorized;
  }

  /**
   * Authenticate a user. Save a username string in Local Storage
   *
   * @param {Promise} connectedUser
   */
  static authenticateUser(username, password) {
    const body = 'username=' + encodeURIComponent(username) + '&password=' + encodeURIComponent(password);
    let headers = {'Content-Type': 'application/x-www-form-urlencoded'};
    return axios
    .post(Backend.settings.authentication.url, body, {headers: headers, withCredentials: true, timeout: 3 * 60 * 1000})
    .then((res) => {
      localStorage.setItem('connectedUser', username);
      localStorage.setItem('connectedUserRole', res.data.role);
      localStorage.setItem('connectedUserAcl', res.data.acl);
      this.role = res.data;
      Promise.resolve(res);
    })
    .catch(err => Promise.reject(err));
  }

  /**
   * Check if a user is authenticated - check if a connectedUser is saved in Local Storage
   *
   * @returns {boolean}
   */
  static isUserAuthenticated() {
    return localStorage.getItem('connectedUser') !== null;
  }

  /**
   * Deauthenticate a user. Remove a connectedUser from Local Storage.
   *
   */
  static deauthenticateUser() {
    localStorage.removeItem('connectedUser');
    localStorage.removeItem('connectedUserRole');
    localStorage.removeItem('connectedUserAcl');
    axios.post(Backend.settings.logout.url, null, {withCredentials: true});
    window.location.href = '/login';
  }

  /**
   * Get a connectedUser value.
   * @returns {string}
   */

  static getConnectedUser() {
    return localStorage.getItem('connectedUser');
  }

  /**
   * Get connectedUserRole value.
   */
  static getConnectedUserRole() {
    return localStorage.getItem('connectedUserRole');
  }

  /**
   * Verify if connected user has a given permission
   * @param {string} permission
   * @returns {boolean}
   */
  static connectedUserHasPermission(permission) {
    let connectedUserPermissions = (localStorage.getItem('connectedUserAcl') || '').split(',');
    return connectedUserPermissions.indexOf(permission) > -1;
  }


  /**
   * Assert if this authentication method is available
   * @return {boolean}
   */
  static isAvailable() {
    return true;
  }

  /**
   * Return the redirection component
   * @param {string} currentLocation
   * @returns {Array<string>}
   */
  static redirectToLogin(currentLocation) {
    return (
      <Redirect to={{
        pathname: '/login',
        state: {from: currentLocation},
      }} />
    );
  }

  /**
   * Return if error should trigger user logout
   * @param {object} error
   * return {boolean}
   * */
  static shouldTriggerLogout(error) {
    return error.response && (error.response.status === 401 || error.response.status === 403);
  }

  static isSessionExpired() {
    return false;
  }

}
