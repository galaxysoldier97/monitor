import { prepareAncillaryEquipments } from './ancillaryEquipmentsImport';

describe('prepareAncillaryEquipments', () => {
  test('prepareAncillaryEquipments with no parameters should return undefined', () => {
    expect(prepareAncillaryEquipments()).toBeUndefined();
  });

  test('prepareAncillaryEquipments with operation different from import should return undefined', () => {
    expect(prepareAncillaryEquipments('testErrorOp', '')).toBeUndefined();
  });

  test('prepareAncillaryEquipments with operation import should return prepared import', () => {
    const address = prepareAncillaryEquipments('import', '');
    expect(address).toHaveProperty('headers');
    expect(address).toHaveProperty('uploadPayloadModifier');
    expect(address).toHaveProperty('operation');
    expect(address).toHaveProperty('meta');
  });

  test('prepareAncillaryEquipments with operation changeStatus should return prepared import', () => {
    const address = prepareAncillaryEquipments('changeStatus', '');
    expect(address).toHaveProperty('headers');
    expect(address).toHaveProperty('operation');
    expect(address).toHaveProperty('meta');
  });
});
