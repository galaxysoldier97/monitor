import Actions from '../../actions/Actions';
import { isEmpty } from 'mt-react-library/functions';
import KeycloakAuth from '../auth/KeycloakAuth';
import { Auth } from '../Auth';
import { userManagement } from '../../config/keycloakConfig';

const loginRedux = (next, action, params) => {
  if (Auth.isResolvingTo(KeycloakAuth)) {
    switch (action.type) {
      case Actions.LOGIN.REQUEST:
        if (!isEmpty(action.user)) {
          const authorizations = {};
          Object.values(action.user.permissions).forEach(permissionsScopes => {
              permissionsScopes.forEach(scope => authorizations[scope] = true);
            },
          );
          next({type: Actions.LOGIN.DATA, payload: {authorizations, user: action.user}, params: params});
        }
        return true;
      case Actions.LOGOUT.REQUEST:
        if (!isEmpty(userManagement.getToken())) {
          userManagement.logout();
        }
        return true;
      default:
        return false;
    }
  }
  return false;
};

export default loginRedux;
