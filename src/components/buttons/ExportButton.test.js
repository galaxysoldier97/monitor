import React from 'react';
import renderer from 'react-test-renderer';
import { exportableEntity, ExportButton } from './ExportButton';

test('ExportButton snapshot', () => {
  const component = renderer.create(<ExportButton entity={exportableEntity.simcards} filters={{name: 'peppa'}} />);
  let tree = component.toJSON();
  expect(tree).toMatchSnapshot();
});
