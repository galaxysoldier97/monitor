import React from 'react';
import renderer from 'react-test-renderer';
import Header from './Header';
import { ThemeProvider } from '@material-ui/styles';
import { createMuiTheme } from '@material-ui/core';

test('Header snapshot', () => {
  const theme = createMuiTheme({toolbar:{bgColor:'#000000'}});
  const component = renderer.create(<ThemeProvider theme={theme}><Header /></ThemeProvider>);
  let tree = component.toJSON();
  expect(tree).toMatchSnapshot();
});
