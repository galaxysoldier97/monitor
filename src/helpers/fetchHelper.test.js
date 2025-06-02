import React from 'react';
import { FormattedMessage } from 'react-intl';
import { getErrorMessage } from './fetchHelper';

describe('getErrorMessage helper', () => {
  test('getErrorMessage with undefined error should return generic error ', () => {
      expect(getErrorMessage()).toStrictEqual(<FormattedMessage defaultMessage={null} id="error.title" values={{}} />);
    },
  );

  test('getErrorMessage with error response field should return generic error ', () => {
      expect(getErrorMessage({test: 'test'})).toStrictEqual(<FormattedMessage defaultMessage={null} id="error.title" values={{}} />);
    },
  );

  test('getErrorMessage should return response.data.message if available ', () => {
      expect(getErrorMessage({response: {data: {message: 'test', error: 'error'}}})).toStrictEqual('test');
    },
  );

  test('getErrorMessage should return response.data.errorMessage if available ', () => {
      expect(getErrorMessage({response: {data: {errorMessage: 'test'}}})).toStrictEqual('test');
    },
  );

  test('getErrorMessage should return response.data.error if available ', () => {
      expect(getErrorMessage({response: {data: {error: 'error'}}})).toStrictEqual('error');
    },
  );
});
