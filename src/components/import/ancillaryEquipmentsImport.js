import Actions from '../../actions/Actions';
import TecrepWarehouseService from '../../services/equipments/TecrepWarehouseService';
import {ancillaryEquipmentName} from '../../config/equipment/ancillaryEquipment/ancillaryEquipmentName';
import {t} from 'mt-react-library/functions';
import {cpeStatusEvent} from '../../config/equipment/cpe/cpeStatus';
import {initImportCpe} from './cpeImport';
import TecrepEquipmentModelService from "../../services/equipments/TecrepEquipmentModelService";

const prepareImport = init => {
  const prepared = {
    meta: {
      entityCategory: 'equipments',
      title: 'ancillaryEquipment.navigation',
    },
    operation: 'ancillaryEquipments',
  };
  const warehouses = !init ? [] : init.warehouses.map(warehouse => ({key: '' + warehouse.id, value: warehouse.name}));
  const equipmentModels = !init ? [] : init.equipmentModels.filter(x => x.category === 'ANCILLARY').map(item => ({
      key: item.name,
      value: item.name
    }));
  const equipmentStatuses = ["AVAILABLE", "INSTORE"].map(x => ({key: x, value: x}));
  prepared.headers = [
    {
      id: 'entity',
      label: t('import.entity'),
      type: 'enum',
      values: [
        {key: 'AncillaryEquipment', value: t('ancillaryEquipment.title')},
      ],
    },
    {
      id: 'file',
      type: 'file',
      label: t('import.file'),
      required: true,
    },
    {id: 'equipmentName', label: t('ancillaryEquipment.equipmentName'), type: 'enum', values: ancillaryEquipmentName, required: true},
    {id: 'modelName', label: t('ancillaryEquipment.model'), type: 'enum', values: equipmentModels, required: true},
    {id: 'batchNumber', label: t('ancillaryEquipment.batchNumber'), type: 'string'},
    {id: 'warehouseId', label: t('ancillaryEquipment.warehouse'), type: 'search', values: warehouses},
    {id: 'status', label: t('ancillaryEquipment.status'), type: 'enum', values: equipmentStatuses},
    {id: 'recyclable', label: t('ancillaryEquipment.recyclable'), type: 'boolean'},
  ];
  prepared.uploadPayloadModifier = payload => Object.assign({}, prepared.meta, payload);
  prepared.initialValues = {entity: 'AncillaryEquipment', recyclable: true};
  return prepared;
};
const prepareChangeStatus = init => {
  let prepared = {
    meta: {
      entityCategory: 'equipments',
      title: 'ancillaryEquipment.navigation',
      tag: 'CHANGEWAREHOUSEORSTATUS',
    },
    operation: 'ancillaryEquipmentsChangeWarehouseStatus',
  };
  const warehouses = [];
  if (init) {
    init.warehouses.forEach(item => warehouses.push({key: item.name, value: item.name}));
  }
  prepared.headers = [
    {
      id: 'entity', label: t('import.entity'), type: 'enum', values: [
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
    {id: 'name', label: t('ancillaryEquipment.warehouse'), type: 'enum', values: warehouses, required: true},
    {
      id: 'event', label: t('ancillaryEquipment.status'), type: 'enum', values: cpeStatusEvent,
    },
  ];
  prepared.initialValues = {
    selection: 'BATCH',
    type: 'changeWareHouseOrStatus',
    category: 'ANCILLARY',
    preactivated: false,
    entity: 'ChangeWarehouseOrStatus'
  };
  return prepared;
};

export const computeConfiguration = (importParams, setImportParams) => {
  // eslint-disable-next-line no-unused-vars
  let target = (({ equipmentName, ...object}) => object)(importParams);

  if (importParams.entity === 'AncillaryEquipment' && importParams?.modelName) {
    TecrepEquipmentModelService.getModels()
      .then(data => {
        if (data.content.length) {
          const element = data.content.filter(x => x.name === importParams.modelName && x.category === 'ANCILLARY');
          if (element.length && element[0] !== undefined) {
            target.configuration = importParams.equipmentName + '_' + element[0].provider.name;
            setImportParams(target);
          }
        }
      }).catch(e => e);
  }
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

export const initializeAncillaryEquipments = (next, action, params, handleError, sendNotification) => {
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

export const prepareAncillaryEquipments = (operation, init) => {
  switch (operation) {
    case 'import' :
      return prepareImport(init);
    case 'changeStatus' :
      return prepareChangeStatus(init);
    default:
      return undefined;
  }
};
