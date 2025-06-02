import {ServiceJobOperationEnum} from "./ServiceJobOperationEnum";
export const JobServiceFields = [
  {id: 'id', label: 'id', hidden: true, infoPage: true},
  {id: 'operation', label: 'jobConfiguration.operation', filterable: true, type: 'enum', values: ServiceJobOperationEnum, addable: true, editable: true, infoPage: true},
  {id: 'category', label: 'category', type: 'enum',
      values: [
        {id: 'categoryAll', key: '', value: 'all'},
        {id: 'access', key: 'ACCESS', value: 'provisioningTag.access'},
        {id: 'component', key: 'COMPONENT', value: 'provisioningTag.component'}]
      ,infoPage: true, editable: true, addable: true, filterable: true},
  {id: 'activity', label: 'service.activity', filterable: true, type: 'enum', values: [],infoPage: true, editable: true, addable: true},
  {id: 'status', label: 'jobConfiguration.status', type: 'enum', values: [
          {id: 'status_all', key: ' ', value: 'all'},
          {id: 'pending', key: 'PENDING', value: 'service.access.pending'},
          {id: 'activated', key: 'ACTIVATED', value: 'service.access.activated'},
          {id: 'deactivated', key: 'DEACTIVATED', value: 'service.access.deactivated'},
          {id: 'suspended', key: 'SUSPENDED', value: 'service.access.suspended'},
          {id: 'canceled', key: 'CANCELED', value: 'service.access.canceled'},
          {id: 'barred', key: 'BARRED', value: 'service.access.barred'},
      ] ,addable: true, editable: true, infoPage: true, filterable: true},
  {id: 'days', label: 'jobConfiguration.days', addable: true, editable: true, infoPage: true},
  {id: 'enabled', label: 'jobConfiguration.enabled', filterable: true,type: 'enum', values: [
      {
        id: 'all',
        key: '',
        value: 'all',
      },
      {
        id: 'yes',
        key: 'true',
        value: 'yes',
      },
      {
        id: 'no',
        key: 'false',
        value: 'no',
      },
    ], addable: true, editable: true, infoPage: true},
];
