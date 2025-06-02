import Actions from '../../actions/Actions';
import {t} from 'mt-react-library/functions';
import TecrepNumberService from "../../services/resources/TecrepNumberService";
import {handleError} from "../../services/redux/functions";

const prepareImport = init => {
  const activities = [];
  if (init) {
    init.activities.forEach(item => activities.push({key: '' + item, value: item}));
  }
  let prepared = {
    meta: {
      entityCategory: 'resources',
      title: 'number.navigation',
      tag: 'NUMBER',
    },
    operation: 'numbers',
    headers: [
      {
        id: 'entity',
        label: t('import.entity'),
        type: 'enum',
        values: [
          {key: 'Number', value: t('number.title')},
        ],
      },
      {
        id: 'file',
        type: 'file',
        label: t('import.file'),
        required: true,
      },
      {
        id: 'activity', label: t('number.activity'), type: 'enum', values: activities,
      },
      {
        id: 'offerType', label: t('number.offerType'), type: ''
      }
    ],
    uploadPayloadModifier: payload => Object.assign({}, prepared.meta, payload),
    initialValues: {entity: 'Number'},
  };
  return prepared;
};


export const initializeNumbers = (next, action, params) => {
  if (params[1] === 'import') {
    TecrepNumberService.getActivities()
      .then(data => {
        next(Actions.IMPORTER.propagate(action, {
          payload: {
            activities: data ? data : []
          },
          params: [params[0], params[1], 'init'],
        }));
      })
      .catch(err => handleError(err, sendNotification));
  }
};

export const prepareNumbers = (operation, init) => {
  if (operation === 'import') {
    return prepareImport(init);
  }
  return undefined;
};

