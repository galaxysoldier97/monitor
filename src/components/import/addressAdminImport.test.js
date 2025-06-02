import { prepareAddressAdmin } from './addressAdminImport';

describe('prepareAddressAdmin', () => {
  test('prepareAddressAdmin with no parameters should return undefined', () => {
    expect(prepareAddressAdmin()).toBeUndefined();
  });

  test('prepareAddressAdmin with operation different from import should return undefined', () => {
    expect(prepareAddressAdmin('testErrorOp')).toBeUndefined();
  });

  test('prepareAddressAdmin with operation import should return prepared import', () => {
    const address = prepareAddressAdmin('import', '');
    expect(address).toHaveProperty('headers');
    expect(address).toHaveProperty('uploadPayloadModifier');
    expect(address).toHaveProperty('operation');
    expect(address).toHaveProperty('meta');
  });
});
