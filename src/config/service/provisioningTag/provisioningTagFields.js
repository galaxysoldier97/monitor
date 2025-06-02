export const provisioningTagFields = [
  {id: 'tagId', label: 'provisioningTag.tagId', infoPage: true, hidden: true},
  {id: 'tagCode', label: 'provisioningTag.tagCode', filterable: true, addable: true, editable: false, type: '', infoPage: true},
  {id: 'tagCodeSearch', label: 'provisioningTag.tagCode', hidden: true, filterable: false, addable: false, editable: false, type: 'search', values: 'dynamic'},
  {id: 'description', label: 'provisioningTag.description', editable: true, addable: true, infoPage: true},
  {
    id: 'activity', label: 'provisioningTag.activity', type: 'enum', values: 'dynamic', filterable: true, editable: true, addable: true, infoPage: true
  },
  {
    id: 'category', label: 'provisioningTag.category', type: 'enum', values: [
      {id: 'categoryAll', key: '', value: 'all'},
      {id: 'access', key: 'ACCESS', value: 'ACCESS'},
      {id: 'component', key: 'COMPONENT', value: 'COMPONENT'},
    ], filterable: true, editable: true, addable: true, infoPage: true
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
    ], filterable: true, editable: true, addable: true, infoPage: true
  },
  {id: 'componentType', label: 'provisioningTag.componentType', type: 'string', filterable: true, editable: true, addable: true, infoPage: true},
  {
    id: 'nature', label: 'provisioningTag.nature', type: 'enum', values: [
      {id: 'natureAll', key: ' ', value: 'all'},
      {id: 'a', key: 'A', value: 'A'},
      {id: 'c', key: 'C', value: 'C'},
      {id: 'p', key: 'P', value: 'P'},
      {id: 'o', key: 'O', value: 'O'},
      {id: 'e', key: 'E', value: 'E'},
      {id: 'r', key: 'R', value: 'R'},
      {id: 'u', key: 'U', value: 'U'},
    ], filterable: true, editable: true, addable: true, infoPage: true
  },
  {
    id: 'persistent', label: 'provisioningTag.persistent', type: 'enum', values: [
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
    ], editable: true, addable: true, infoPage: true, filterable: true
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
  }
];
