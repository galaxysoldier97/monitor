import Actions from '../../actions/Actions';
import { t } from 'mt-react-library/functions';
import { ipAddressesStatusImport } from '../../config/resources/ipAddresses/ipAddressesStatus';
import { ipAddressesActivityImport } from '../../config/resources/ipAddresses/ipAddressesActivity';
import { ipAddressOfferTypes } from '../../config/resources/ipAddresses/ipAddressOfferTypes';

const prepareImport = () => {
  let prepared = {
    meta: {
      entityCategory: 'resources',
      title: 'ipAddresses.navigation',
      tag: 'IP_ADDRESS',
    },
    operation: 'ipAddresses',
    headers: [
      {id: 'file', type: 'file', label: t('import.file'), required: true},
      {id: 'status', label: t('ipAddresses.status'), type: 'enum', values: ipAddressesStatusImport},
      {id: 'activity', label: t('ipAddresses.activity'), type: 'enum', values: ipAddressesActivityImport},
      {id: 'offerType', label: t('ipAddresses.offerType'), type: 'enum', values: ipAddressOfferTypes}
    ],
    uploadPayloadModifier: payload => Object.assign({}, prepared.meta, payload),
    initialValues: {entity: 'IpAddress'},
  };
  return prepared;
};

export const initializeIpAddress = (next, action, params) => {
  if (params[1] === 'import') {
    next(Actions.IMPORTER.propagate(action, {
      payload: {},
      params: [params[0], params[1], 'init'],
    }));
  }
};

export const prepareIpAddresses = (operation) => {
  if (operation === 'import') {
    return prepareImport();
  }
  return undefined;
};
