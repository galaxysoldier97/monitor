import React from 'react';
import renderer from 'react-test-renderer';
import EmptyComponent from './EmptyComponent';

test('Empty component snapshot', () => {
  const component = renderer.create(<EmptyComponent message="test" />);
  let tree = component.toJSON();
  expect(tree).toMatchSnapshot();
});
