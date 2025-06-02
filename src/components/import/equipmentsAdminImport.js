import Actions from '../../actions/Actions';
import { categoriesEquipmentImport } from '../../config/equipment/EquipmentImportableProperties';
import { t } from 'mt-react-library/functions';

const prepareImport = () => {
  let prepared = {
    meta: {
      entityCategory: 'equipments',
      title: 'equipmentsAdmin.navigation',
      tag: 'EQUIPMENTSADMIN',
    },
    headers: [
      {
        id: 'entity',
        label: t('import.entity'),
        type: 'enum',
        values: categoriesEquipmentImport,
      },
      {
        id:'file',
        type:'file',
        label: t('import.file'),
        required: true,
      },
    ],
    operation: 'equipments',
    uploadPayloadModifier: payload => Object.assign({}, prepared.meta, payload),
  };
  return prepared;
};

export const initializeEquipmentsAdmin = (next, action, params) => {
  if (params[1] === 'import') {
      next(Actions.IMPORTER.propagate(action, {
        payload: {},
        params: [params[0], params[1], 'init'],
      }));
  }
};

export const prepareEquipmentsAdmin = (operation) => {
  if (operation === 'import') {
    return prepareImport();
  }
  return undefined;
};

