import { prepareEquipmentsAdmin } from './equipmentsAdminImport';

describe('prepareEquipmentsAdmin', () => {
  test('prepareEquipmentsAdmin with no parameters should return undefined', () => {
    expect(prepareEquipmentsAdmin()).toBeUndefined();
  });

  test('equipmentsAdminImport with operation different from import should return undefined', () => {
    expect(prepareEquipmentsAdmin('testErrorOp', 'testErrorInit')).toBeUndefined();
  });

  test('prepareEquipmentsAdmin with operation import should return prepared import', () => {
    const address = prepareEquipmentsAdmin('import', '');
    expect(address).toHaveProperty('headers');
    expect(address).toHaveProperty('uploadPayloadModifier');
    expect(address).toHaveProperty('operation');
    expect(address).toHaveProperty('meta');
  });
});
