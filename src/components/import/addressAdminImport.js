import Actions from '../../actions/Actions';
import { t } from 'mt-react-library/functions';

const prepareImport = () => {
  const meta = {
    entityCategory: 'address',
    title: 'addressAdmin.navigation',
    tag: 'ADDRESSESADMIN',
  };
  return {
    meta,
    operation: 'addresses',
    uploadPayloadModifier: payload => Object.assign({}, meta, payload),
    headers: [
      {
        id: 'entity',
        label: t('import.entity'),
        type: 'enum',
        values: [
          {key: 'Address', value: t('address')},
          {key: 'ExternalRefAddress', value: t('externalRefAddress')},
          {key: 'BuildingFlat', value: t('buildingFlat')},
          {key: 'BuildingStatus', value: t('buildingStatus')},
          {key: 'Building', value: t('postalAddress')},
          {key: 'Street', value: t('street')},
        ],
      },
      {
        id:'file',
        type:'file',
        label: t('import.file'),
        required: true,
      },
      {
        id: 'accessType', label: t('accessType'), type: 'enum', values: [
          {key: 'FTTH', value: 'FTTH'},
          {key: 'DOCSIS', value: 'DOCSIS'},
        ],
      },
    ],
  };
};

export const initializeAddressAdmin = (next, action, params) => {
  if (params[1] === 'import') {
    next(Actions.IMPORTER.propagate(action, {
      payload: {},
      params: [params[0], params[1], 'init'],
    }));
  }
};

export const prepareAddressAdmin = (operation) => {
  return operation === 'import' ? prepareImport() : undefined;
};
