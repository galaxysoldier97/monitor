import { yesNoFilter } from "../../yesNoFilter";

export const AssociatedProvisioningTagFields = [
  { id: 'tagId', label: 'provisioningTag.tagId', infoPage: true, hidden: true },
  { id: 'tagCode', label: 'provisioningTag.tagCode', filterable: true, addable: true, editable: false, type: 'enum', values: [], infoPage: true },
  { id: 'tagCodeSearch', label: 'provisioningTag.tagCode', hidden: true, filterable: false, editable: false, type: 'search', values: 'dynamic' },
  { id: 'description', label: 'provisioningTag.description', editable: true, infoPage: true },
  {
    id: 'activity', label: 'provisioningTag.activity', type: 'enum', values: 'dynamic', filterable: true, editable: true, infoPage: true
  },
  {
    id: 'category', label: 'provisioningTag.category', type: 'enum', values: [
      { id: 'categoryAll', key: '', value: 'all' },
      { id: 'access', key: 'ACCESS', value: 'provisioningTag.access' },
      { id: 'component', key: 'COMPONENT', value: 'provisioningTag.component' },
    ], editable: true, infoPage: true
  },
  {
    id: 'accessType', label: 'provisioningTag.accessType', type: 'enum', values: [
      { id: 'accessTypeAll', key: '', value: 'all' },
      { id: 'docsis', key: 'DOCSIS', value: 'DOCSIS' },
      { id: 'ftth', key: 'FTTH', value: 'FTTH' },
      { id: 'dise', key: 'DISE', value: 'DISE' },
      { id: 'freedhome', key: 'FREEDHOME', value: 'FREEDHOME' },
      { id: 'zattoo', key: 'ZATTOO', value: 'ZATTOO' },
      { id: 'trunksip', key: 'TRUNKSIP', value: 'TRUNKSIP' },
      { id: 'bbhb', key: 'BBHB', value: 'BBHB' },
      { id: 'mobile', key: 'MOBILE', value: 'MOBILE' },
    ], filterable: true, editable: true, infoPage: true
  },
  { id: 'componentType', label: 'provisioningTag.componentType', type: 'string', filterable: true, editable: true, infoPage: true },
  {
    id: 'nature', label: 'provisioningTag.nature', type: 'enum', values: [
      { id: 'natureAll', key: ' ', value: 'all' },
      { id: 'a', key: 'A', value: 'provisioningTag.a' },
      { id: 'c', key: 'C', value: 'provisioningTag.c' },
      { id: 'p', key: 'P', value: 'provisioningTag.p' },
      { id: 'o', key: 'O', value: 'provisioningTag.o' },
      { id: 'e', key: 'E', value: 'provisioningTag.e' },
      { id: 'r', key: 'R', value: 'provisioningTag.r' },
      { id: 'u', key: 'U', value: 'provisioningTag.u' },
    ], filterable: true, editable: true, infoPage: true
  },
  {
    id: 'persistent', label: 'provisioningTag.persistent', type: 'enum', values: yesNoFilter, editable: true, infoPage: true
  },
  {
    id: 'tagParameters',
    label: 'provisioningTag.tagParameters',
    infoPage: true,
    hidden: true
  },
  {
    id: 'tagActivationCodes',
    values: [],
    hidden: true
  },
  { id: 'actions', label: '', cellProps: { style: { whiteSpace: 'nowrap' } } },
];
