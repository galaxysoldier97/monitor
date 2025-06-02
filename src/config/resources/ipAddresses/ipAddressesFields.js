import { ipAddressesActivity } from './ipAddressesActivity';
import { ipAddressesStatus } from './ipAddressesStatus';
import { ipAddressOfferTypes } from './ipAddressOfferTypes';

export const ipAddressesFields = [
  {id: 'id', hidden: true},
  {id: 'ipAddress', label: 'ipAddresses.ipAddress', filterable: true, infoPage: true},
  {id: 'port', label: 'ipAddresses.port', infoPage: true, editable: true, filterable: true},
  {id: 'status', label: 'ipAddresses.status', type: 'enum', values: ipAddressesStatus, filterable: true, infoPage: true},
  {id: 'activity', label: 'ipAddresses.activity', type: 'enum', values: ipAddressesActivity, filterable: true, infoPage: true},
  {id: 'serviceId', label: 'ipAddresses.serviceId', type: 'number', infoPage: true, filterable: true},
  {id: 'orderId', label: 'ipAddresses.orderId', infoPage: true, filterable: true, editable: true},
  {id: 'offerType', label: 'ipAddresses.offerType', type: 'enum', values: ipAddressOfferTypes, editable: true, filterable: true, infoPage: true},
  {id: 'comment', label: 'ipAddresses.comment', hidden: true, infoPage: true, editable: true},
  {id: 'domain', label: 'ipAddresses.domain', hidden: true, infoPage: true, editable: true, filterable: true},
  {id: 'actions', label: '', cellProps: {style: {whiteSpace: 'nowrap'}}},
];
