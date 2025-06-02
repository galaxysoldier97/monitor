import React from 'react';
import renderer from 'react-test-renderer';
import PieChartBox from './PieChartBox';
import { cyan } from '@material-ui/core/colors';

jest.mock('recharts', () => ({
  ResponsiveContainer: jest.fn,
  Cell: jest.fn,
  Pie: jest.fn,
  PieChart: jest.fn,
}));

test('PieChartBox snapshot', () => {
  const component = renderer.create(<PieChartBox data={[{name: 'test', color: cyan[100], value: 10}, {name: 'test2', color: cyan[200], value: 20}]} name={'test chart'} />);
  let tree = component.toJSON();
  expect(tree).toMatchSnapshot();
});
