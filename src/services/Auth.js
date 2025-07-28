import LoginFormAuth from './auth/LoginFormAuth';
import KeycloakAuth from './auth/KeycloakAuth';


function resolveImplementation() {
  if (KeycloakAuth.isAvailable()) {
    return KeycloakAuth;
  }
  return LoginFormAuth;
}

export class Auth {

  /**
   * Authorize an HTTP request
   */
  static authorize(additionalConfig) {
    return resolveImplementation().authorize(additionalConfig);
  }

  /**
   * Authenticate a user. Save a username string in Local Storage
   *
   * @param {Promise} connectedUser
   */
  static authenticateUser(username, password) {
    return resolveImplementation().authenticateUser(username, password);
  }

  /**
   * Check if a user is authenticated - check if a connectedUser is saved in Local Storage
   *
   * @returns {boolean}
   */
  static isUserAuthenticated() {
    return resolveImplementation().isUserAuthenticated();
  }

  /**
   * Deauthenticate a user. Remove a connectedUser from Local Storage.
   *
   */
  static deauthenticateUser() {
    resolveImplementation().deauthenticateUser();
  }

  /**
   * Log off if the given HTTP error is a result of a not allowed / expired session.
   */
  static checkErrorSession(error) {
    if (resolveImplementation().shouldTriggerLogout(error)) {
      Auth.deauthenticateUser();
    }
    return Promise.reject(error);
  }

  /**
   * Get a connectedUser value.
   * @param field (Optional) The field to get
   * @returns {string}
   */

  static getConnectedUser(field) {
    return resolveImplementation().getConnectedUser(field);
  }

  /**
   * Get connectedUserRole value.
   */
  static getConnectedUserRole() {
    return resolveImplementation().getConnectedUserRole();
  }

  /**
   * Verify if connected user has any of the given permissions
   * @param {string} permissions
   * @returns {boolean}
   */
  static connectedUserHasPermission(...permissions) {
    for (let p of permissions) {
      let hasPermission = resolveImplementation().connectedUserHasPermission(p);
      if (hasPermission) {
        return true;
      }
    }
    return false;
  }

    /**
   * Verify if connected user has the given role
   * @param {string} role
   * @returns {boolean}
   */
  static connectedUserHasRole(role) {
    return resolveImplementation().connectedUserHasRole(role);
  }

  /**
   * Return the redirection component
   * @param {string} currentLocation
   * @returns {Array<string>}
   */
  static redirectToLogin(currentLocation) {
    return resolveImplementation().redirectToLogin(currentLocation);
  }

  /**
   * @param implementation
   * @return true if the Auth façade resolves to the given implementaiton class
   */
  static isResolvingTo(implementation) {
    return resolveImplementation() === implementation;
  }

  static checkSession() {
    if (resolveImplementation().isSessionExpired()) {
      this.deauthenticateUser();
    }
  }
}

export default Auth;
