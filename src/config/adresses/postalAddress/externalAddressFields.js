import { t } from 'mt-react-library/functions';

export const externalAddressFields = [
  {
    id: 'accessType',
    label: 'provisioningTag.accessType',
    type: 'enum',
    values: [
      {id: 'accessTypeAll', key: ' ', value: t('all')},
      {id: 'docsis', key: 'DOCSIS', value: t('provisioningTag.docsis')},
      {id: 'ftth', key: 'FTTH', value: t('provisioningTag.ftth')},
    ], filterable: true, editable: true,
  },
  {id: 'buildingCode', label: 'street.buildingCode', type: 'string', editable: true, filterable: true},
  {id: 'streetNumber', label: 'street.streetNumber', type: 'number', editable: true, filterable: true},
  {id: 'streetQualifier', label: 'street.streetQualifier', type: 'string', editable: true, filterable: true},
  {id: 'streetId', label: 'street.streetId', type: 'string', editable: true, filterable: true},
  {id: 'actions', label: '', cellProps: {style: {whiteSpace: 'nowrap'}}},
];
