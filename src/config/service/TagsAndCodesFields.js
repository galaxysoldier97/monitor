export const TagsAndCodesFields = [
  {id: 'tagId', label: 'provisioningTag.tagId', infoPage: true, hidden: true},
  {id: 'code', label: 'activationCode.code', type: 'enum', values: [], addable: true},
  {id: 'activId', label: 'activId', infoPage: true, hidden: true},
  {id: 'tagValue', label: 'activationCode.tagValue', type: 'number', addable: true, filterable: true},
  {id: 'description', label: 'activationCode.description'},
  {
    id: 'nature', label: 'activationCode.nature', type: 'enum', values: [
      {id: 'natureAll', key: '', value: 'all'},
      {id: 'profile', key: 'PROFILE', value: 'activationCode.profile'},
      {id: 'option', key: 'OPTION', value: 'activationCode.option'},
      {id: 'bucket', key: 'BUCKET', value: 'activationCode.bucket'},
      {id: 'booster', key: 'BOOSTER', value: 'activationCode.booster'},
      {id: 'barring', key: 'BARRING', value: 'activationCode.barring'},
      {id: 'lock', key: 'LOCK', value: 'activationCode.lock'},
      {id: 'forwarding', key: 'FORWARDING', value: 'activationCode.forwarding'},
      {id: 'config', key: 'CONFIG', value: 'activationCode.config'},
    ]
  },
  {
    id: 'networkComponent', label: 'activationCode.networkComponent', type: 'enum', values: [
      {id: 'networkComponentAll', key: ' ', value: 'all'},
      {id: 'tvcas', key: 'TVCAS', value: 'activationCode.tvcas'},
      {id: 'zattoo', key: 'ZATTOO', value: 'activationCode.zattoo'},
      {id: 'pcrf', key: 'PCRF', value: 'activationCode.pcrf'},
      {id: 'spg', key: 'SPG', value: 'activationCode.spg'},
      {id: 'scp', key: 'SCP', value: 'activationCode.scp'},
      {id: 'opi', key: 'OPI', value: 'activationCode.opi'},
      {id: 'olt', key: 'OLT', value: 'activationCode.olt'},
      {id: 'streamwide', key: 'STREAMWIDE', value: 'activationCode.streamwide'},
    ]
  }
];
