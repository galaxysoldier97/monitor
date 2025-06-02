import React from 'react';
import renderer from 'react-test-renderer';
import { InfoBloc } from './InfoBloc';
import { createMuiTheme } from '@material-ui/core';
import { ThemeProvider } from '@material-ui/core/styles';
import { IntlProvider } from 'react-intl';

test('InfoBloc snapshot', () => {
  const theme = createMuiTheme({});
  const component = renderer.create(
    <IntlProvider key="en" locale="en" messages={{test: 'test', vtest: 'vtest'}}><ThemeProvider theme={theme}><InfoBloc label="test" value="vtest" /></ThemeProvider></IntlProvider>,
  );
  let tree = component.toJSON();
  expect(tree).toMatchSnapshot();
});
