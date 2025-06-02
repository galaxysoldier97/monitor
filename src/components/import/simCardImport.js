import Actions from '../../actions/Actions';
import TecrepProviderService from '../../services/equipments/TecrepProviderService';
import TecrepPlmnService from '../../services/equipments/TecrepPlmnService';
import TecrepWarehouseService from '../../services/equipments/TecrepWarehouseService';
import { t } from 'mt-react-library/functions';
import { simCardStatusEvent } from '../../config/equipment/simCard/simCardStatus';
import TecrepEqmAccessTypeService from '../../services/equipments/TecrepEqmAccessTypeService';

const initImport = (next, action, params, handleError, sendNotification) => {
  Promise.all([TecrepProviderService.searchProviders(0, 999), TecrepPlmnService.getPlmn(), TecrepEqmAccessTypeService.getAccessTypes()])
  .then(data => {
    next(Actions.IMPORTER.propagate(action, {
      payload: {
        providers: data[0].content ? data[0].content : [],
        plmns: data[1].content ? data[1].content : [],
        accessTypes: data[2] || [],
      },
      params: [params[0], params[1], 'init'],
    }));
  })
  .catch(err => handleError(err, sendNotification));
};

const prepareImport = init => {
  let prepared = {
    meta: {
      entityCategory: 'equipments',
      title: 'simcard.navigation',
      tag: 'SIMCARD',
    },
    operation: 'simcards',
  };
  const providers = [], plmns = [], accessTypes = [];
  if (init) {
    init.providers.forEach(item => providers.push({key: '' + item.id, value: item.name}));
    init.plmns.forEach(item => plmns.push({key: '' + item.id, value: item.code + ' ' + item.networkName}));
    init.accessTypes.forEach(item => accessTypes.push({key: item, value: item}));
  }
  const statuses = ["AVAILABLE", "INSTORE"].map(x => ({key: x, value: x}));
  prepared.headers = [
    {
      id: 'entity',
      label: t('import.entity'),
      type: 'enum',
      values: [{key: 'SimCard', value: t('simcard.title')}],
    },
    {
      id: 'file',
      type: 'file',
      label: t('import.file'),
      required: true,
    },
    {id: 'accessType', label: t('accessType'), type: 'enum', values: accessTypes, required: true},
    {id: 'providerId', label: t('simcard.provider'), type: 'enum', values: providers, required: true},
    {id: 'plmnId', label: 'PLMN', type: 'search', values: plmns, required: true},
    {id: 'brand', label: t('simcard.brand')},
    {id: 'batchNumber', label: t('batchNumber')},
    {id: 'status', label: t('simcard.status'), values: statuses, type: 'enum'},
    {id: 'preactivated', label: t('preactivated'), type: 'boolean'},

  ];
  prepared.initialValues = {preactivated: false, entity: 'SimCard'};
  prepared.uploadPayloadModifier = payload => Object.assign({}, prepared.meta, payload);
  return prepared;
};

const initChangeStatus = (next, action, params, handleError, sendNotification) => {
  TecrepWarehouseService.searchWarehouses(0, 999)
  .then(data => {
    next(Actions.IMPORTER.propagate(action, {
      payload: {
        warehouses: data.content ? data.content : [],
      },
      params: [params[0], params[1], 'init'],
    }));
  })
  .catch(err => handleError(err, sendNotification));
};

const prepareChangeStatus = init => {
  let prepared = {
    meta: {
      entityCategory: 'equipments',
      title: 'simcard.navigation',
      tag: 'CHANGEWAREHOUSEORSTATUS',
    },
    operation: 'simcardsAndChangewarehouse',
  };
  const warehouses = [];
  if (init) {
    init.warehouses.forEach(item => warehouses.push({key: item.name, value: item.name}));
  }
  prepared.headers = [
    {
      id: 'entity',
      label: t('import.entity'),
      type: 'enum',
      values: [
        {key: 'ChangeWarehouseOrStatus', value: t('ChangeWarehouseOrStatus')},
      ],
    },
    {
      id: 'selection', label: t('selectionMode'), type: 'enum', values: [
        {key: 'BATCH', value: t('byBatchNumber')},
        {key: 'IMSI', value: t('byImsiRange')},
      ],
    },
    {
      id: 'batchNumber', label: t('batchNumber'), computedProps: values => (
        (values.selection === 'BATCH') ? {} : {disabled: true}
      ),
    },
    {
      id: 'startRange', label: t('firstNumber'), type: 'number', computedProps: values => (
        (values.selection === 'IMSI') ? {} : {disabled: true}
      ),
    },
    {
      id: 'finalRange', label: t('lastNumber'), type: 'number', computedProps: values => (
        (values.selection === 'IMSI') ? {} : {disabled: true}
      ),
    },
    {id: 'name', label: t('simcard.warehouse'), type: 'enum', values: warehouses},
    {
      id: 'event', label: t('simcard.status'), type: 'enum', values: simCardStatusEvent,
    },
  ];
  prepared.initialValues = {selection: 'BATCH', type: 'changeWareHouseOrStatus', category: 'SIMCARD', entity: 'ChangeWarehouseOrStatus'};
  prepared.uploadPayloadModifier = (payload, importParams) => {
    importParams.category = 'SIMCARD';
    if (importParams.selection === 'IMSI') {
      delete importParams.batchNumber;
    } else if (importParams.selection === 'BATCH') {
      delete importParams.firstImsi;
      delete importParams.lastImsi;
    }
    return Object.assign({}, prepared.meta, payload);
  };
  return prepared;
};

export const initializeSimCard = (next, action, params, handleError, sendNotification) => {
  switch (params[1]) {
    case 'import' :
      initImport(next, action, params, handleError, sendNotification);
      return;
    case 'changeStatus' :
      initChangeStatus(next, action, params, handleError, sendNotification);
      return;
    default:
  }
};

export const prepareSimCard = (operation, init) => {
  switch (operation) {
    case 'import' :
      return prepareImport(init);
    case 'changeStatus' :
      return prepareChangeStatus(init);
    default:
      return undefined;
  }
};

