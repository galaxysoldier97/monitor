import { getAddressDescription, getDisplayedDate, isConfigSet, printObject, isObject } from './commonHelper';
import { address1 } from '../../mocks/adress.mock';

describe('getDisplayedDate', () => {
  test('getDisplayedDate with no argument should display empty string', () => {
      expect(getDisplayedDate()).toBe('');
    },
  );
  test('getDisplayedDate should display correct date format', () => {
    expect(getDisplayedDate(1)).toBe('01/01/1970');
  });
});

describe('printObject', () => {
  test('printObject with no argument should display empty string', () => {
      expect(printObject()).toBe('');
    },
  );
  test('printObject should print key value of an object', () => {
      expect(printObject({name: 'peppa', age: '1'})).toBe(' - name : peppa - age : 1');
    },
  );
  test('printObject should not print value if it is not a string', () => {
      expect(printObject({name: 'peppa', age: 1, fat: true})).toBe(' - name : peppa');
    },
  );
});

describe('getAddressDescription', () => {
  test('getAddressDescription with no argument should display empty string', () => {
      expect(getAddressDescription()).toBe('');
    },
  );
  test('getAddressDescription should display address', () => {
    expect(getAddressDescription(address1)).toBe('1 bis, peppaStreet');
  });
});

describe('isConfigSet', () => {
  test('isConfigSet returns', () => {
      expect(isConfigSet(null)).toBe(false);
      expect(isConfigSet({})).toBe(false);
      expect(isConfigSet({values: []})).toBe(false);
      expect(isConfigSet({values: ''})).toBe(false);
      expect(isConfigSet({values: [{}]})).toBe(false);
      expect(isConfigSet({values: [{}, {}]})).toBe(true);
    },
  );
});

describe('isObject', () => {
  test('isObject returns', () => {
      expect(isObject(null)).toBe(false);
      expect(isObject({})).toBe(true);
    },
  );
});
