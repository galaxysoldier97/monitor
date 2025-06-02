import { prepareNumbers } from './numbersImport';

describe('prepareNumbers', () => {
  test('prepareNumbers with no parameters should return undefined', () => {
    expect(prepareNumbers()).toBeUndefined();
  });

  test('prepareNumbers with operation different from import should return undefined', () => {
    expect(prepareNumbers('testErrorOp', 'testErrorInit')).toBeUndefined();
  });

  test('prepareNumbers with operation import should return prepared import', () => {
    const address = prepareNumbers('import', '');
    expect(address).toHaveProperty('operation');
    expect(address).toHaveProperty('meta');
  });
});
