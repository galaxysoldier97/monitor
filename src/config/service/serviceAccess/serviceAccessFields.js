import { t } from 'mt-react-library/functions';
import { serviceFields } from '../serviceFields';

export const serviceAccessFields = [
  ...serviceFields,
  {
    id: 'accessType',
    label: 'service.access.accessType',
    type: 'enum',
    values: 'dynamic',
    filterable: true,
    addable: true,
    infoPage: true,
  },
  {
    id: 'equipmentLink',
    label: 'service.access.equipment',
  },
  {
    id: 'serviceAccessPointId',
    label: t('accessPoint.accessPointId'),
    type: 'string',
    filterable: true,
    hidden: true,
  },
  {
    id: 'equipmentId',
    label: 'service.access.equipmentId',
    type: 'number',
    filterable: true,
    hidden: true,
    infoPage: true,
  },
  {
    id: 'ontId',
    label: 'service.access.ontId',
    type: 'string',
    filterable: ['MALTA'],
    hidden: ['EIR', 'EPIC', 'MT'],
    infoPage: true,
  },
  {id: 'parentServiceAccess', hidden:true, infoPage:true},
  {id: 'accessPointId', hidden:true, infoPage:true},
  {id: 'actions', label: '', cellProps: {style: {whiteSpace: 'nowrap'}}},
];

export const ServiceRequestOptions = Object.freeze({
  ADD_REQUEST: 'addrequest',
  CANCEL_REQUEST: 'cancelrequest',
  ACTIVATE_REQUEST: 'activaterequest',
  ROLLBACK_ADD_REQUEST: 'rollbackaddrequest',
  TERMINATE_REQUEST: 'terminaterequest',
});

export const serviceRequestSelectOptions = [
  {name: ServiceRequestOptions.ADD_REQUEST, label: t('service.access.request.addRequest')},
  {name: ServiceRequestOptions.CANCEL_REQUEST, label: t('service.access.request.cancelRequest')},
  {name: ServiceRequestOptions.ACTIVATE_REQUEST, label: t('service.access.request.activateRequest')},
  {name: ServiceRequestOptions.ROLLBACK_ADD_REQUEST, label: t('service.access.request.rollbackAddRequest')},
];

const ServiceRequestActionOptions = Object.freeze({
  ACTIVATION: 'ACTIVATION',
  DEACTIVATION: 'DEACTIVATION',
  SUSP_CLI: 'SUSP_CLI',
  SUSP_OPER: 'SUSP_OPER',
  RESUM_CLI: 'RESUM_CLI',
  RESUM_OPER: 'RESUM_OPER',
  BARRING: 'BARRING',
  UNBARRING: 'UNBARRING',
});

export const serviceRequestActionSelectOptions = [
  {name: ServiceRequestActionOptions.ACTIVATION, label: t('service.access.change.select.request.activation')},
  {name: ServiceRequestActionOptions.DEACTIVATION, label: t('service.access.change.select.request.deactivation')},
  {name: ServiceRequestActionOptions.SUSP_CLI, label: t('service.access.change.select.request.susp_cli')},
  {name: ServiceRequestActionOptions.SUSP_OPER, label: t('service.access.change.select.request.susp_oper')},
  {name: ServiceRequestActionOptions.RESUM_CLI, label: t('service.access.change.select.request.resum_cli')},
  {name: ServiceRequestActionOptions.RESUM_OPER, label: t('service.access.change.select.request.resum_oper')},
  {name: ServiceRequestActionOptions.BARRING, label: t('service.access.change.select.request.barring')},
  {name: ServiceRequestActionOptions.UNBARRING, label: t('service.access.change.select.request.unbarring')},
];
