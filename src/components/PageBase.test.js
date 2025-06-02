import React from 'react';
import renderer from 'react-test-renderer';
import { BrowserRouter } from 'react-router-dom';
import PageBase from './PageBase';
import Button from '@material-ui/core/Button';
import MenuItem from '@material-ui/core/MenuItem';

test('Page base snapshot', () => {
  const component = renderer.create(
    <BrowserRouter>
      <PageBase title="test" children={<div>test</div>} backButton actionButton={<Button>button</Button>} subMenu={<MenuItem>test</MenuItem>}/>
    </BrowserRouter>,
  );
  let tree = component.toJSON();
  expect(tree).toMatchSnapshot();
});
