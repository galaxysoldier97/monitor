import Actions from '../../actions/Actions';
import { t } from 'mt-react-library/functions';

const initImport = (next, action, params) => {
  next(Actions.IMPORTER.propagate(action, {
    payload: {},
    params: [params[0], params[1], 'init'],
  }));
};

const prepareImport = () => {
  let prepared = {
    meta: {
      entityCategory: 'services',
      title: 'serviceAdmin.navigation',
      tag: 'SERVICESADMIN',
    },
    headers: [
      {
        id: 'entity',
        label: t('import.entity'),
        type: 'enum',
        values: [
          {key: 'Provisioning', value: 'Provisioning'}
        ],
      },
      {
        id:'file',
        type:'file',
        label: t('import.file'),
        required: true,
      },
    ],
    operation: 'services',
    uploadPayloadModifier: payload => Object.assign({}, prepared.meta, payload),
  };
  prepared.initialValues = {entity: 'Provisioning'};
  return prepared;
};

export const initializeServicesAdmin = (next, action, params) => {
  if (params[1] === 'import') {
      initImport(next, action, params);
  }
};

export const prepareServicesAdmin = (operation) => {
  if (operation === 'import') {
      return prepareImport();
  }
  return undefined;
};

