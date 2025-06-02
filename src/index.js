import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import { Redirect, Route, Switch } from 'react-router-dom';
import App from './containers/App';
import './css/styles.scss';
import { Auth } from './services/Auth';
import ThemeDefault from './css/theme-default';
import { ThemeProvider } from '@material-ui/styles';
import { MuiThemeProvider } from '@material-ui/core';
import store, { history } from './store';
import { Provider } from 'react-redux';
import { ConnectedRouter } from 'connected-react-router';
import { IntlProvider } from 'react-intl';
import KeycloakLogin from './store/KeycloakLogin';
import EN from "./i18n/en.json";
import FR from "./i18n/fr.json";
import './i18n/i18n';
import './favicon.ico';


const localeData = {EN, FR};

function MainApplication() {
    const [selectedLanguage, setSelectedLanguage] = useState('EN');
  const changeLanguage = (newLanguage) => {
        setSelectedLanguage(newLanguage);
    };

    return (
        <IntlProvider locale={selectedLanguage} messages={localeData[selectedLanguage]}>
            <MuiThemeProvider theme={ThemeDefault}>
                <ThemeProvider theme={ThemeDefault}>
                    <KeycloakLogin>
                        <Provider store={store}>
                            <ConnectedRouter history={history}>
                                <Switch>
                                    <Route
                                        path="/"
                                        render={(props) => (
                                            Auth.isUserAuthenticated() ? (
                                                <App
                                                    {...props}
                                                    changeLanguage={changeLanguage}
                                                    localeData={localeData}
                                                />
                                            ) : (
                                                <Redirect to={`/login?redirect=${props.location.pathname}`} />
                                            )
                                        )}
                                    />
                                </Switch>
                            </ConnectedRouter>
                        </Provider>
                    </KeycloakLogin>
                </ThemeProvider>
            </MuiThemeProvider>
        </IntlProvider>
    );
}

ReactDOM.render(<MainApplication />, document.getElementById('app'));
