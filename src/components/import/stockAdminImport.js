import Actions from '../../actions/Actions';
import { t } from 'mt-react-library/functions';

const prepareImport = () => {
  const meta = {
    entityCategory: 'DeliveryFile',
    title: 'stock.admin.navigation',
    tag: 'DELIVERYFILE',
  };
  return {
    meta,
    operation: 'DeliveryFile',
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
    initialValues: {entity: 'DeliveryFile'}
  };
};

export const initializeStockAdmin = (next, action, params) => {

  if (params[1] === 'import') {
    next(Actions.IMPORTER.propagate(action, {
      payload: {},
      params: [params[0], params[1], 'init'],
    }));
  }
};

export const prepareStockImport = (operation) => {
  return operation === 'import' ? prepareImport() : undefined;
};
