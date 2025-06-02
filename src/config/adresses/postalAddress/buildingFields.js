import { streetQualifier } from './streetQualifier';
import { buildingType } from './buildingType';

export const buildingFields = [
  {
    id: 'buildingId',
    label: 'building.buildingId',
    hidden: true,
    infoPage: false,
  },
  {
    id: 'buildingCode',
    label: 'building.code', type: 'string',
    addable: true,
    editable: true,
    filterable: true,
    infoPage: true,
  },
  {
    id: 'buildingName',
    label: 'building.name', type: 'string',
    editable: true, filterable: true, addable: true,
    infoPage: true,
  },
  {
    id: 'streetNumber',
    label: 'street.number', type: 'number',
    editable: false, filterable: true,
  },
  {
    id: 'streetQualifier',
    label: 'street.qualifier', type: 'enum',
    values: streetQualifier,
    editable: false, filterable: true,
  },
  {
    id: 'streetName',
    label: 'street.name', type: 'string',
    filterable: true,
  },
  {
    id: 'sector',
    label: 'sector.name', type: 'string',
    filterable: true,
  },
  {
    id: 'buildingBlock',
    label: 'building.block', type: 'string',
    filterable: true, addable: true,
  },
  {
    id: 'flatNumber',
    label: 'flatBuilding.flatNumber', type: 'string',
    hidden: true, addable: true,
  },
  {
    id: 'buildingType',
    label: 'building.type', type: 'enum',
    values: buildingType,
    addable: true, filterable: true,
  },
  {
    id: 'latitude',
    label: 'postal.address.latitude', type: 'number',
    editable: true, addable: true, hidden: true,
    infoPage: true,
  },
  {
    id: 'longitude',
    label: 'postal.address.longitude', type: 'number',
    editable: true, addable: true, hidden: true,
    infoPage: true,
  },
  {
    id: 'remark',
    label: 'details.remark', type: 'string',
    addable: true, hidden: true,
    infoPage: true, editable: true,
  },
  {id: 'actions', label: '', cellProps: {style: {whiteSpace: 'nowrap'}}},
];
