import React from 'react';
import renderer from 'react-test-renderer';
import DropdownMenu from './DropdownMenu';

test('Dropdown menu snapshot', () => {
  const component = renderer.create(<DropdownMenu children={() => "test"} />);
  let tree = component.toJSON();
  expect(tree).toMatchSnapshot();
});
