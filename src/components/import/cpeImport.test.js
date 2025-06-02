import { prepareCPE } from './cpeImport';

describe('prepareCPE', () => {
  test('prepareCPE with no parameters should return undefined', () => {
    expect(prepareCPE()).toBeUndefined();
  });

  test('prepareCPE with operation different from import should return undefined', () => {
    expect(prepareCPE('testErrorOp', '')).toBeUndefined();
  });

  test('prepareCPE with operation import should return prepared import', () => {
    const address = prepareCPE('import', '');
    expect(address).toHaveProperty('headers');
    expect(address).toHaveProperty('uploadPayloadModifier');
    expect(address).toHaveProperty('operation');
    expect(address).toHaveProperty('meta');
  });

  test('prepareCPE with operation changeStatus should return prepared import', () => {
    const address = prepareCPE('changeStatus', '');
    expect(address).toHaveProperty('headers');
    expect(address).toHaveProperty('operation');
    expect(address).toHaveProperty('meta');
  });
});
