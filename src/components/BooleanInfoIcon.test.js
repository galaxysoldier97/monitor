import React from 'react';
import renderer from 'react-test-renderer';
import { BooleanInfoIcon } from './BooleanInfoIcon';

test('BooleanInfoIcon snapshot', () => {
  const component = renderer.create(<BooleanInfoIcon value={false} />);
  let tree = component.toJSON();
  expect(tree).toMatchSnapshot();
});
