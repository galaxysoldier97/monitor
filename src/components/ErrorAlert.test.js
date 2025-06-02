import React from 'react';
import renderer from 'react-test-renderer';
import { ErrorAlert } from './ErrorAlert';
import { createMuiTheme } from '@material-ui/core';
import { ThemeProvider } from '@material-ui/core/styles';
import { IntlProvider } from 'react-intl';
import EN from '../i18n/en.json';

test('ErrorAlert snapshot', () => {
  const theme = createMuiTheme({});
  const component = renderer.create(
    <IntlProvider locale="en" messages={EN}>
      <ThemeProvider theme={theme}>
        <ErrorAlert message="test" />
      </ThemeProvider>,
    </IntlProvider>,
  );
  let tree = component.toJSON();
  expect(tree).toMatchSnapshot();
});
