import { t } from 'mt-react-library/functions';

export const ipAddressesStatusImportValues = Object.freeze({
  AVAILABLE: 'AVAILABLE',
  LOCKEDZONE: 'LOCKEDZONE',
  PORTEDIN: 'PORTEDIN',
});

export const ipAddressesStatusImport = [
  {key: 'AVAILABLE', value: ipAddressesStatusImportValues.AVAILABLE},
  {key: 'PORTEDIN', value: ipAddressesStatusImportValues.PORTEDIN},
];

export const ipAddressesStatusValues = Object.freeze({
  ...ipAddressesStatusImportValues,
  ACTIVATED: 'ACTIVATED',
  ASSIGNED: 'ASSIGNED',
  BOOKED: 'BOOKED',
  DEACTIVATED: 'DEACTIVATED',
  LOCKEDUSER: 'LOCKEDUSER',
});

export const ipAddressesStatus = [
  {id: 'all', key: '', value: t('all')},
  {id: 'activated', key: ipAddressesStatusValues.ACTIVATED, value: 'ACTIVATED'},
  {id: 'assigned', key: ipAddressesStatusValues.ASSIGNED, value: 'ASSIGNED'},
  {id: 'available', key: ipAddressesStatusValues.AVAILABLE, value: 'AVAILABLE'},
  {id: 'booked', key: ipAddressesStatusValues.BOOKED, value: 'BOOKED'},
  {id: 'deactivated', key: ipAddressesStatusValues.DEACTIVATED, value: 'DEACTIVATED'},
  {id: 'lockedZone', key: ipAddressesStatusValues.LOCKEDZONE, value: 'LOCKEDZONE'},
  {id: 'lockedUser', key: ipAddressesStatusValues.LOCKEDUSER, value: 'LOCKEDUSER'},
  {id: 'portedIn', key: ipAddressesStatusValues.PORTEDIN, value: 'PORTEDIN'},
];

export const ipAddressesStatusForCreation = [
  {id: 'available', key: ipAddressesStatusValues.AVAILABLE, value: 'AVAILABLE'},
  {id: 'portedIn', key: ipAddressesStatusValues.PORTEDIN, value: 'PORTEDIN'},
];
