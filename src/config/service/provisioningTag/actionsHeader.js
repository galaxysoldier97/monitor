import { tagActions } from './tagActions';
import { serviceActions } from './serviceActions';

export const actionsHeader = [
  {id: 'tagActionId', label: 'provisioningTag.action.tagActionId', type: 'number', hidden: true, infoPage: true},
  {id: 'provisioningTagId', label: 'provisioningTag.action.provisioningTag', type: 'number', hidden: true, infoPage: true},
  {id: 'tagAction', label: 'provisioningTag.action.tagAction', type: 'enum', values: tagActions, addable: true, infoPage: true},
  {id: 'serviceAction', label: 'provisioningTag.action.serviceAction', type: 'enum', values: serviceActions, addable: true, infoPage: true},
  {id: 'actions', label: '', cellProps: {style: {whiteSpace: 'nowrap'}}},
];
