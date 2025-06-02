import { serviceFields } from '../serviceFields';

export const serviceComponentFields = [
  ...serviceFields,
  {
    id: 'componentType',
    label: 'service.component.componentType',
    type: 'string',
    filterable: true,
    addable: true,
    infoPage: true
  },
  {
    id: 'serviceAccessLink',
    label: 'service.component.serviceAccess',
  },
  {
    id: 'serviceAccessId',
    label: 'service.serviceAccessId',
    hidden: true,
    type: 'number',
    filterable: true,
    infoPage: true,
  },
  {id: 'actions', label: '', cellProps: {style: {whiteSpace: 'nowrap'}}},
];
