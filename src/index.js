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

// Interceptar XMLHttpRequest (para capturar el id_token del login)
(function () {
    const originalOpen = XMLHttpRequest.prototype.open;
    const originalSend = XMLHttpRequest.prototype.send;

    XMLHttpRequest.prototype.open = function (method, url, ...rest) {
        this._url = url; // Guarda URL de la petición
        return originalOpen.call(this, method, url, ...rest);
    };

    XMLHttpRequest.prototype.send = function (...args) {
        const originalOnLoad = this.onload;

        this.onload = function () {
            if (this._url && this._url.includes('/protocol/openid-connect/token')) {
                try {
                    const response = JSON.parse(this.responseText);
                    if (response.id_token) {
                        localStorage.setItem('id_token', response.id_token);
                        //console.log('[Keycloak-XHR] id_token guardado desde interceptor.');
                    }
                } catch (e) {
                    console.warn('⚠️ No se pudo parsear respuesta de login:', e);
                }
            }

            if (originalOnLoad) originalOnLoad.call(this);
        };

        return originalSend.call(this, ...args);
    };
})();

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
