import React from 'react';
import renderer from 'react-test-renderer';
import { ResetFilterButton } from './ResetFilterButton';

test('ResetFilterButton snapshot', () => {
  const component = renderer.create(<ResetFilterButton onClick={jest.fn} />);
  let tree = component.toJSON();
  expect(tree).toMatchSnapshot();
});
