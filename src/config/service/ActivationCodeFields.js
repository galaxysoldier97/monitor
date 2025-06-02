export const ActivationCodeFields = [
  {id: 'activationCodeId', label: 'activationCodeId', type: 'string', hidden: true},
  {id: 'code', label: 'activationCode.code', type: 'string', filterable: true, addable: true},
  {id: 'description', label: 'activationCode.description', editable: true, addable: true},
  {
    id: 'nature', label: 'activationCode.nature', type: 'enum', filterable: true, addable: true, editable: true, values: [
      {id: 'natureAll', key: '', value: 'all'},
      {id: 'profile', key: 'PROFILE', value: 'PROFILE'},
      {id: 'option', key: 'OPTION', value: 'OPTION'},
      {id: 'bucket', key: 'BUCKET', value: 'BUCKET'},
      {id: 'booster', key: 'BOOSTER', value: 'BOOSTER'},
      {id: 'barring', key: 'BARRING', value: 'BARRING'},
      {id: 'lock', key: 'LOCK', value: 'LOCK'},
      {id: 'forwarding', key: 'FORWARDING', value: 'FORWARDING'},
      {id: 'config', key: 'CONFIG', value: 'CONFIG'},
    ]
  },
 {
    id: 'networkComponent', label: 'activationCode.networkComponent', type: 'enum', filterable: true, editable: true, addable: true, values: [
      {id: 'networkComponentAll', key: ' ', value: 'all'},
      {id: 'tvcas', key: 'TVCAS', value: 'TVCAS'},
      {id: 'zattoo', key: 'ZATTOO', value: 'ZATTOO'},
      {id: 'pcrf', key: 'PCRF', value: 'PCRF'},
      {id: 'spg', key: 'SPG', value: 'SPG'},
      {id: 'scp', key: 'SCP', value: 'SCP'},
      {id: 'opi', key: 'OPI', value: 'OPI'},
      {id: 'olt', key: 'OLT', value: 'OLT'},
      {id: 'streamwide', key: 'STREAMWIDE', value: 'STREAMWIDE'},
    ]
  }
];
