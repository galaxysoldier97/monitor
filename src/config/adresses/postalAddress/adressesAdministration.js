import { t } from 'mt-react-library/functions';

export const streetsHeader = [
  {id: 'streetId', label: t('id'), hidden: true, infoPage: true},
  {id: 'streetCode', label: t('street.streetCode'), filterable: true, addable: true, infoPage: true},
  {id: 'streetName', label: t('street.streetName'), filterable: true, addable: true, infoPage: true},
  {id: 'area', label: t('street.area'), filterable: true, addable: true, infoPage: true},
  {id: 'postalCode', label: t('street.postalCode'), filterable: true, addable: true, infoPage: true},
  {id: 'city', label: t('street.city'), filterable: true, addable: true, infoPage: true},
  {id: 'country', label: t('street.country'), filterable: true, addable: true, infoPage: true},
  {id: 'actions', label: '', cellProps: {style: {whiteSpace: 'nowrap'}}},
];

export const addressesHeader = [
  {id: 'addressId', label: t('id'), hidden: true},
  {id: 'streetNumber', label: t('address.street.number'), filterable: true, addable: true},
  {id: 'streetQualifier', label: t('postal.address.street.qualifier'), filterable: true, addable: true},
  {id: 'sector', label: t('sector.name'), filterable: true, addable: true},
  {id: 'latitude', label: t('address.latitude'), addable: true},
  {id: 'longitude', label: t('address.longitude'), addable: true},
  {id: 'district', label: t('address.district'), addable: true},
  {id: 'actions', label: '', cellProps: {style: {whiteSpace: 'nowrap'}}},
];
