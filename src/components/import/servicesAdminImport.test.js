import { prepareServicesAdmin } from './servicesAdminImport';

describe('prepareServicesAdmin', () => {
  test('prepareServicesAdmin with no parameters should return undefined', () => {
    expect(prepareServicesAdmin()).toBeUndefined();
  });

  test('prepareServicesAdmin with operation different from import should return undefined', () => {
    expect(prepareServicesAdmin('testErrorOp', 'testErrorInit')).toBeUndefined();
  });

  test('prepareServicesAdmin with operation import should return prepared import', () => {
    const address = prepareServicesAdmin('import', '');
    expect(address).toHaveProperty('operation');
    expect(address).toHaveProperty('meta');
  });
});
