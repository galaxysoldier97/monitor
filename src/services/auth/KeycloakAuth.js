import Actions from '../../actions/Actions';
import store from '../../store';
import { isEmpty } from 'mt-react-library/functions';
import { authenticationOptions, userManagement } from '../../config/keycloakConfig';


class KeycloakAuth {

  /**
   * Authorize an HTTP request
   */
  static authorize(additionalConfig = {}) {
    let authorized = Object.assign(additionalConfig, {
      credentials: 'include',
    });
    authorized.headers = Object.assign(additionalConfig.headers || {}, {
      'Authorization': 'Bearer ' + userManagement.getToken(),
    });
    return authorized;
  }

  /**
   * Authenticate a user.
   *
   * @param {function} authentication callback
   */
  static authenticateUser() {
    // Not used, keycloak authentication is preemptive
  }

  /**
   * Check if a user is authenticated
   *
   * @returns {boolean}
   */
  static isUserAuthenticated() {
    return !!userManagement.getToken();
  }

  /**
   * Deauthenticate a user.
   *
   */
  /* static deauthenticateUser() {
    userManagement.logout();
  } */

  //Funcional
  static deauthenticateUser() {
    const idToken = localStorage.getItem('id_token');
    if (!idToken) {
      console.warn('⚠️ No se encontró el id_token en localStorage. Cancelando logout.');
      return;
    }

    const logoutUrl = `${authenticationOptions.url}/realms/${authenticationOptions.realm}/protocol/openid-connect/logout?` +
      `id_token_hint=${idToken}&` +
      `post_logout_redirect_uri=${encodeURIComponent(window.location.origin)}`;

    localStorage.removeItem('id_token');
    store.dispatch({ type: 'LOGOUT' });

    window.location.href = logoutUrl;
  }

  /**
   * Get a connectedUser value.
   * @param field (Optional) The field to get
   * @returns {string}
   */

  static getConnectedUser(field = 'username') {
    let state = store.getState();
    let session = state[Actions.LOGIN.getReducerKey()];
    if (isEmpty(session.payload)) {
      return '';
    }
    return session.payload.user[field];
  }

  /**
   * Get connectedUserRole value.
   */
  static getConnectedUserRole() {
    throw new Error('not relevant');
  }

  /**
   * Verify if connected user has a given permission
   * @param {string} permission
   * @returns {boolean}
   */
  static connectedUserHasPermission(permission) {
    let state = store.getState();
    let session = state[Actions.LOGIN.getReducerKey()];
    if (isEmpty(session.payload)) {
      return undefined;
    }
    return session.payload.authorizations[permission];
  }

   /**
   * Verify if connected user has a given role
   * @param {string} role
   * @returns {boolean}
   */
  static connectedUserHasRole(role) {
    const token = userManagement.getTokenParsed();
    if (!token) {
      return false;
    }
    if (token.realm_access && Array.isArray(token.realm_access.roles) && token.realm_access.roles.includes(role)) {
      return true;
    }
    if (token.resource_access) {
      for (const client of Object.values(token.resource_access)) {
        if (client.roles && client.roles.includes(role)) {
          return true;
        }
      }
    }
    return false;
  }

  /**
   * Assert if this authentication method is available
   * @return {boolean}
   */
  static isAvailable() {
    return typeof authenticationOptions.url !== 'undefined';
  }

  /**
   * Return the redirection component
   * @param {string} currentLoocation
   * @returns {Array<string>}
   */
  static redirectToLogin(currentLocation) {
    store.dispatch({ type: Actions.LOGIN.REQUEST, payload: { redirect: currentLocation } });
  }

  /**
   * Return if error should trigger user logout
   * @param {object} error
   * return {boolean}
   * */
  static shouldTriggerLogout(error) {
    const errorResponse = error.response;
    if (!errorResponse) {
      return;
    }
    let isUnauthorized = errorResponse.status === 401 && errorResponse.config && !errorResponse.config.__isRetryRequest;
    let isFailedPolicyDecision = errorResponse.data && errorResponse.data.message === 'Failed to enforce policy decisions.';
    if (errorResponse.status === 403 && !errorResponse.data) {
      //userManagement.logoutInvalidSession();
      KeycloakAuth.deauthenticateUser();
    }
    return isUnauthorized || isFailedPolicyDecision;
  }

  static isSessionExpired() {
    return userManagement.isTokenExpired();
  }

}

export default KeycloakAuth;
