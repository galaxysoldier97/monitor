import React, { Suspense, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import classNames from 'classnames';
import ThemeDefault from '../css/theme-default';
import Header from '../components/Header';
import LeftDrawer from '../components/LeftDrawer';
import { Redirect, Route } from 'react-router-dom';
import CssBaseline from '@material-ui/core/CssBaseline';
import { System } from '../data';
import { Auth } from '../services/Auth';
import Dashboard from '../containers/DashboardPage';
import Actions from '../actions/Actions';
import { connect } from 'react-redux';
import { ROUTES } from '../config/routes';
import { drawerWidth } from '../config';
import { TecrepUserMenuPreferencesService } from '../services/TecrepUserMenuPreferencesService';
import { TplLoading } from 'mt-react-library/containers/templates';
import { WelcomePage } from './WelcomePage';
import '../config/api';
import { useTranslation } from "react-i18next";



const useStyles = makeStyles(theme => ({
  container: {
    margin: '80px 20px 20px 15px',
  },
  containerMap: {
    marginTop: '70px',
  },
  root: {
    display: 'flex',
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: -drawerWidth,
    overflow: 'scroll',
  },
  contentMap: {
    flexGrow: 1,
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: -drawerWidth,
  },
  contentShift: {
    width: `100%`,
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginLeft: 0,
  },
}));

const AppComponent = ({ session, router, changeLanguage, localeData }) => {
  const classes = useStyles(ThemeDefault);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [userMenu, setUserMenu] = useState(undefined);
  const { i18n } = useTranslation();

  const fetchUserMenu = () => {
    TecrepUserMenuPreferencesService.fetch(Auth.getConnectedUser())
      .then(result => {
        const language = result.language in localeData ? result.language : 'EN';
        changeLanguage(language);
        i18n.changeLanguage(language);
        setUserMenu({ ...result, language });
      })
      .catch();
  };

  useEffect(() => {
    fetchUserMenu();
  }, []);
  useEffect(() => {
    if (session && session.language) {
      changeLanguage(session.language);
    }
  }, [session?.language]);

  const handleDrawerOpen = () => {
    setDrawerOpen(true);
  };

  const handleDrawerClose = () => {
    setDrawerOpen(false);
  };

  if (!Auth.isUserAuthenticated()) {
    return Auth.redirectToLogin();
  }

  // display only menu for whose connectedUser has at least one of the required permissions
  const menus = System.menus.filter(menu => {
    // return !menu.hidden && menu.requiredPermissions.filter(permission => Auth.connectedUserHasPermission(permission)).length > 0;
    const hasPermission = menu.requiredPermissions.filter(permission => Auth.connectedUserHasPermission(permission)).length > 0;
    const excluded = menu.excludedRoles && menu.excludedRoles.some(role => Auth.connectedUserHasRole(role));
    return !menu.hidden && hasPermission && !excluded;
  });

  if (!userMenu) {
    return <TplLoading />;
  }

  return (
    <div className={classes.root}>
      <CssBaseline />
      <Header drawerOpen={drawerOpen} handleDrawerOpen={handleDrawerOpen} handleDrawerClose={handleDrawerClose} />
      <LeftDrawer drawerOpen={drawerOpen} menus={menus} userMenu={userMenu} refreshUserMenu={fetchUserMenu} />
      <Suspense fallback={<TplLoading />}>
        <main className={classNames(router.location.pathname !== '/map' ? classes.content : classes.contentMap, { [classes.contentShift]: drawerOpen })}>
          <div className={classes.drawerHeader} />
          <div className={router.location.pathname !== '/map' ? classes.container : classes.containerMap}>
            <Route exact path="/" render={() => Auth.connectedUserHasPermission('DASHBOARD_READ') ?
              <Redirect to={Actions.DASHBOARD.getRoutePath()} /> : <WelcomePage />} />
            {Auth.connectedUserHasPermission('DASHBOARD_READ') &&
              <Route exact path={Actions.DASHBOARD.getRoutePath()} render={() => <Dashboard />} />
            }
            {Object.values(ROUTES)
              .filter(route => !route.scopes || Auth.connectedUserHasPermission(...route.scopes))
              .map(route => (
                <Route
                  key={route.path}
                  exact={route.exact || false}
                  path={route.path}
                  render={() => route.languageAware ? route.content(userMenu.language) : route.content} />
              ))}
          </div>
        </main>
      </Suspense>
    </div>
  );
};

AppComponent.propTypes = {
  session: PropTypes.object,
  router: PropTypes.router,
  localeData: PropTypes.object,
  changeLanguage: PropTypes.func
};

const mapStateToProps = state => ({
  session: state.session.payload,
  router: state.router,
});

const App = connect(mapStateToProps)(AppComponent);
export default App;
