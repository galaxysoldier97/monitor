import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import Actions from '../actions/Actions';
import store from './index';
import KeycloakAuth from '../services/auth/KeycloakAuth';
import { Auth } from '../services/Auth';
import { userManagement } from '../config/keycloakConfig';
import { TplLoading } from 'mt-react-library/containers/templates';

const KeycloakLogin = ({children}) => {

  const [authenticated, setAuthenticated] = useState(false);
  const enabled = Auth.isResolvingTo(KeycloakAuth);

  useEffect(() => {
    if (!enabled) {
      return;
    }
    if (!authenticated) {
      userManagement.login().then((user) => {
        setAuthenticated(!!user.username);
        store.dispatch({type: Actions.LOGIN.REQUEST, user: {...user, getToken: userManagement.getToken, logout: userManagement.logout}});
      });
    }
  });

  if (authenticated || !enabled) {
    return children;
  }
  return <TplLoading />;
};

KeycloakLogin.propTypes = {
  children: PropTypes.object.isRequired,
};

export default KeycloakLogin;


