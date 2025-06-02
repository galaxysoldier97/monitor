import { streetQualifier } from './streetQualifier';
import { buildingType } from './buildingType';

export const postalAddressFields = [
  {
    id: 'streetNumber',
    label: 'street.number',
    type: 'number',
    editable: true,
    filterable: true,
  },
  {
    id: 'streetQualifier',
    label: 'street.qualifier',
    type: 'enum',
    values: streetQualifier, editable: false, filterable: true,
  },
  {
    id: 'streetName',
    label: 'street.name',
    type: 'string',
    addable: true,
    filterable: true,
  },
  {
    id: 'district',
    label: 'postal.address.district',
    type: 'string',
    addable: true,
    filterable: true,
  },
  {
    id: 'sector',
    label: 'sector.name',
    type: 'string',
    addable: true,
    filterable: true,
  },
  {
    id: 'buildingCode',
    label: 'building.code',
    type: 'string',
    addable: true,
    filterable: true,
    infoPage: true,
  },
  {
    id: 'buildingName',
    label: 'building.name',
    type: 'string',
    editable: true,
    filterable: true,
    infoPage: true,
  },
  {
    id: 'buildingBlock',
    label: 'building.block',
    type: 'string',
    addable: true,
    filterable: true,
    infoPage: true,
  },
  {
    id: 'buildingType',
    label: 'building.type',
    type: 'enum',
    values: buildingType,
    addable: false,
    filterable: true,
    infoPage: true,
  },
  {id: 'actions', label: '', cellProps: {style: {whiteSpace: 'nowrap'}}},
];
