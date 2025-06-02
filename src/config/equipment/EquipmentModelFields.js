export const EquipmentModelFields = [
    {id: 'providerId', label: 'cpe.provider', hidden: true},
    {id: 'name', label: 'name', addable: true, editable: true},
    {id: 'accessType', label: 'accessType', type: 'enum', values: [], addable: true, editable: true},
    {id: 'category', label: 'category', addable: true, editable: true, type: 'enum', values: [{key: 'CPE', value: 'CPE'}, {key: 'ANCILLARY', value: 'ANCILLARY'}]},
    {id: 'providerName', label: 'cpe.provider', editable: true, type: 'enum', values: []},
    {id: 'provider', label: 'cpe.provider', hidden:true, addable: true, type: 'enum', values: []},
    {id: 'currentFirmware', label: 'currentFirmware', addable: true, editable: true}
];
