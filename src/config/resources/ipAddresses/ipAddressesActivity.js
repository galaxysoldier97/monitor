import { t } from 'mt-react-library/functions';

export const ipAddressesActivityImportValues = Object.freeze({
  INTERNET: 'INTERNET',
  TELEPHONY: 'TELEPHONY'
});

export const ipAddressesActivityImport = [
  {key: 'INTERNET', value: ipAddressesActivityImportValues.INTERNET},
  {key: 'TELEPHONY', value: ipAddressesActivityImportValues.TELEPHONY},
];

export const ipAddressesActivity = [
  {id: 'all', key: '', value: t('all')},
  {id: 'internet', key: 'INTERNET', value: t('ipAddresses.internet')},
  {id: 'telephony', key: 'TELEPHONY', value: t('ipAddresses.telephony')},
];
