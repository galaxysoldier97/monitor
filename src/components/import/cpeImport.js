import Actions from '../../actions/Actions';
import TecrepProviderService from '../../services/equipments/TecrepProviderService';
import { t } from 'mt-react-library/functions';
import TecrepWarehouseService from '../../services/equipments/TecrepWarehouseService';
import { cpeStatusEvent } from '../../config/equipment/cpe/cpeStatus';
import TecrepEqmAccessTypeService from '../../services/equipments/TecrepEqmAccessTypeService';
import TecrepEquipmentModelService from '../../services/equipments/TecrepEquipmentModelService';

export const initImportCpe = (next, action, params, handleError, sendNotification) => {
  Promise.all([
    TecrepProviderService.searchProviders(0, 999),
    TecrepWarehouseService.searchWarehouses(0, 999),
    TecrepEqmAccessTypeService.getAccessTypes(),
    TecrepEquipmentModelService.getModels(),
  ])
  .then(data => {
    next(Actions.IMPORTER.propagate(action, {
      payload: {
        warehouses: data[1].content ? data[1].content : [],
        accessTypes: data[2] || [],
        equipmentModels: data[3].content || [],
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
      title: 'cpe.navigation',
      tag: 'CPE',
    },
    operation: 'cpe',
  };
  const warehouses = !init ? [] : init.warehouses.map(warehouse => ({key: '' + warehouse.id, value: warehouse.name}));
  const equipmentModels = !init ? [] : init.equipmentModels.filter(x => x.category === 'CPE').map(item => ({key: item.name, value: item.name}));
  const accessTypes = !init ? [] : init.accessTypes.map(item => ({key: item, value: item}));

  prepared.headers = [
    {id: 'entity', label: t('import.entity'), type: 'enum', values: [{key: 'CPE', value: t('cpe.title')},],},
    {id: 'file', type: 'file', label: t('import.file'), required: true,},
    {id: 'modelName', label: t('cpe.model'), type: 'enum', values: equipmentModels, required: true},
    {id: 'accessType', label: t('cpe.accessType'), type: 'enum', values: accessTypes, required: true},
    {id: 'batchNumber', label: t('batchNumber')},
    {id: 'warehouseId', label: t('cpe.warehouse'), type: 'search', values: warehouses},
    {id: 'status', label: t('cpe.status'), type: 'enum', values: ["AVAILABLE", "INSTORE"].map(x => ({key: x, value: x}))},
    {id: 'recyclable', label: t('cpe.recyclable'), type: 'boolean', default: true},
  ];
  prepared.initialValues = {preactivated: false, entity: 'CPE', recyclable:true};
  prepared.uploadPayloadModifier = payload => Object.assign({}, prepared.meta, payload);
  return prepared;
};

const prepareChangeStatus = init => {
  let prepared = {
    meta: {
      entityCategory: 'equipments',
      title: 'cpe.navigation',
      tag: 'CHANGEWAREHOUSEORSTATUS',
    },
    operation: 'cpeAndChangewarehouse',
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
        {key: 'SERIAL_NUMBER', value: t('bySerialNumber')},
        {key: 'FILE', value: t('byFile')},
      ],
    },
    {
      id: 'file',
      type: 'file',
      label: t('import.file'),
      required: true,
      computedProps: values => (
        (values.selection === 'FILE') ? {} : {disabled: true, type: ''}
      ),
    },
    {
      id: 'batchNumber', label: t('batchNumber'), computedProps: values => (
        (values.selection === 'BATCH') ? {} : {disabled: true}
      ),
    },
    {
      id: 'startRange', label: t('firstNumber'), type: '', computedProps: values => (
        (values.selection === 'SERIAL_NUMBER') ? {} : {disabled: true}
      ),
    },
    {
      id: 'finalRange', label: t('lastNumber'), type: '', computedProps: values => (
        (values.selection === 'SERIAL_NUMBER') ? {} : {disabled: true}
      ),
    },
    {id: 'name', label: t('cpe.warehouse'), type: 'enum', values: warehouses},
    {
      id: 'event', label: t('cpe.status'), type: 'enum', values: cpeStatusEvent,
    },
  ];
  prepared.initialValues = {selection: 'BATCH', type: 'changeWareHouseOrStatus', category: 'CPE', entity: 'ChangeWarehouseOrStatus'};
  prepared.uploadPayloadModifier = (payload, importParams) => {
    importParams.category = 'CPE';
    if (importParams.selection === 'SERIAL_NUMBER') {
      delete importParams.batchNumber;
    } else if (importParams.selection === 'BATCH') {
      delete importParams.firstSerialNumber;
      delete importParams.lastSerialNumber;
    }
    return Object.assign({}, prepared.meta, payload);
  };
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

export const initializeCPE = (next, action, params, handleError, sendNotification) => {
  switch (params[1]) {
    case 'import' :
      initImportCpe(next, action, params, handleError, sendNotification);
      return;
    case 'changeStatus' :
      initChangeStatus(next, action, params, handleError, sendNotification);
      return;
    default:
  }
};

export const prepareCPE = (operation, init) => {
  switch (operation) {
    case 'import' :
      return prepareImport(init);
    case 'changeStatus' :
      return prepareChangeStatus(init);
    default:
      return undefined;
  }
};
