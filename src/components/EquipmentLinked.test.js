import React from 'react';
import renderer from 'react-test-renderer';
import EquipmentLinked from './EquipmentLinked';
import { BrowserRouter } from 'react-router-dom';

test('Equipment linked id and category null', () => {
  const component = renderer.create(<BrowserRouter>
    <EquipmentLinked pairedEqPath="test" eqmId={null} eqmCategory={null} /></BrowserRouter>);
  let tree = component.toJSON();
  expect(tree).toMatchSnapshot();
});

test('Equipment linked id not null and category null', () => {
  const component = renderer.create(<BrowserRouter>
    <EquipmentLinked pairedEqPath="test" eqmId={123} eqmCategory={null} /></BrowserRouter>);
  let tree = component.toJSON();
  expect(tree).toMatchSnapshot();
});

test('Equipment linked id null and category not null', () => {
  const component = renderer.create(<BrowserRouter>
    <EquipmentLinked pairedEqPath="test" eqmId={null} eqmCategory="test" /></BrowserRouter>);
  let tree = component.toJSON();
  expect(tree).toMatchSnapshot();
});

test('Equipment linked id and category not null', () => {
  const component = renderer.create(<BrowserRouter>
    <EquipmentLinked pairedEqPath="test" eqmId={123} eqmCategory="test" /></BrowserRouter>);
  let tree = component.toJSON();
  expect(tree).toMatchSnapshot();
});
