import { productActions } from './productActions';

export const productsProvisioningHeaders = [
  {id: 'provisioningProductId', label: 'provisioningTag.action.provisioning.provisioningProductId', type: 'number', hidden: true},
  {id: 'productCode', label: 'provisioningTag.action.provisioning.productCode', type: 'string', addable: true},
  {id: 'productAction', label: 'provisioningTag.action.provisioning.productAction', type: 'enum', values: productActions, addable: true},
  {id: 'actions', label: '', cellProps: {style: {whiteSpace: 'nowrap'}}},
];