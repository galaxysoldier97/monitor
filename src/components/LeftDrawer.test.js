import React from 'react';
import renderer from 'react-test-renderer';
import { createMuiTheme } from '@material-ui/core';
import { ThemeProvider } from '@material-ui/core/styles';
import { IntlProvider } from 'react-intl';
import LeftDrawer from './LeftDrawer';
import { System } from '../data';
import EN from '../i18n/en.json';
import { BrowserRouter } from 'react-router-dom';

test('Left drawer snapshot', () => {
  const theme = createMuiTheme({drawer: {bgColor: '#000'}});
  const component = renderer.create(
    <IntlProvider key="en" locale="en" messages={EN}>
      <ThemeProvider theme={theme}>
        <BrowserRouter>
          <LeftDrawer drawerOpen={true} menus={System.menus} refreshUserMenu={() => {
          }} userMenu={{id: null, userId: null, language: 'en', preferences: {}}} /></BrowserRouter>
      </ThemeProvider></IntlProvider>,
  );
  let tree = component.toJSON();
  expect(tree).toMatchSnapshot();
});
