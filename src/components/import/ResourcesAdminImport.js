import Actions from '../../actions/Actions';
import { t } from 'mt-react-library/functions';

const prepareImport = () => {
  const meta = {
    entityCategory: 'resources',
    title: 'resources.navigation',
    tag: 'RESOURCESADMIN',
  };
  return {
    meta,
    operation: 'resources',
    uploadPayloadModifier: payload => Object.assign({}, meta, payload),
    headers: [
      {
        id: 'entity',
        label: t('import.entity'),
        type: 'enum',
        values: [
          {key: 'DeliveryFile', value: t('deliveryFile')},
        ],
      },
      {
        id:'file',
        type:'file',
        label: t('import.file'),
        required: true,
      }
    ],
    initialValues: {entity: 'resources'}
  };
};

export const initializeResourcesAdmin = (next, action, params) => {
  if (params[1] === 'import') {
    next(Actions.IMPORTER.propagate(action, {
      payload: {},
      params: [params[0], params[1], 'init'],
    }));
  }
};

export const prepareResourcesImport = (operation) => {
  return operation === 'import' ? prepareImport() : undefined;
};
