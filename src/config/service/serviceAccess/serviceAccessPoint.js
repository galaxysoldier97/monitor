import { t } from 'mt-react-library/functions';

export const serviceAccessPoint = [
  {id: 'accessPointId', label: t('buildingFlat.accessPointId'), filterable: true},
  {id: 'ptoCode', label: t('buildingFlat.ptocode'), filterable: true},
  {id: 'flatCode', label: t('buildingFlat.flatCode'), filterable: true},
  {id: 'number', label: t('buildingFlat.number'), filterable: false},
  {id: 'qualifier', label: t('buildingFlat.qualifier'), filterable: false},
  {id: 'streetName', label: t('buildingFlat.streetName'), filterable: false},
  {id: 'buildingCode', label: t('buildingFlat.buildingCode'), filterable: true},
  {id: 'buildingName', label: t('buildingFlat.buildingName'), filterable: true},
  {id: 'blockNumber', label: t('buildingFlat.blockNumber'), filterable: true},
  {id: 'floorNumber', label: t('buildingFlat.floorNumber'), filterable: true},
  {id: 'flatNumber', label: t('buildingFlat.flatNumber'), filterable: true},
];
