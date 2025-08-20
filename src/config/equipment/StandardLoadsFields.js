export const StandardLoadsFields = [
  {id: 'id', label: 'ID', hidden: false, addable: false, editable: true},
  {id: 'name', label: 'standardLoads.name', addable: true, editable: true},
  {id: 'status', label: 'standardLoads.status', addable: true, editable: true, type: 'enum', values: [
    {id: 'enable', key: 'enable', value: 'standardLoads.status.enable'},
    {id: 'disable', key: 'disable', value: 'standardLoads.status.disable'}
  ]},
  {id: 'creationDate', label: 'creationDate', addable: false, editable: false, translate: false},
  {id: 'updateDate', label: 'updateDate', addable: false, editable: false, translate: false},
];
