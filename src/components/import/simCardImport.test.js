import { prepareSimCard } from './simCardImport';

describe('prepareSimCard', () => {
  test('prepareSimCard with no parameters should return undefined', () => {
    expect(prepareSimCard()).toBeUndefined();
  });

  test('prepareSimCard with operation different from import should return undefined', () => {
    expect(prepareSimCard('testErrorOp', 'testErrorInit')).toBeUndefined();
  });

  test('prepareSimCard with operation import should return prepared import', () => {
    const address = prepareSimCard('import', '');
    expect(address).toHaveProperty('uploadPayloadModifier');
    expect(address).toHaveProperty('operation');
    expect(address).toHaveProperty('meta');
  });
});
