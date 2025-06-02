import {productActions} from "./provisioningTag/productActions";
import {tagActions} from "./provisioningTag/tagActions";
import {serviceActions} from "./provisioningTag/serviceActions";
export const ProvisioningProductFields =  [
    {id: 'provisioningProductId', label: 'provisioningTag.action.provisioning.provisioningProductId', type: 'number', hidden: true, infoPage: true},
    {id: 'productCode', label: 'provisioningTag.action.provisioning.productCode', filterable: true, type: 'string', addable: true, infoPage: true},
    {id: 'productAction', label: 'provisioningTag.action.provisioning.productAction', filterable: true, type: 'enum', values: productActions, addable: true, infoPage: true},
    {id: 'tagCode', label: 'provisioningTag.tagCode', filterable: true, addable: true, editable: false, type: '', infoPage: true},
    {id: 'tagAction', label: 'provisioningTag.action.tagAction', filterable: true, type: 'enum', values: tagActions, addable: true, infoPage: true},
    {id: 'serviceAction', label: 'provisioningTag.action.serviceAction', filterable: true, type: 'enum', values: serviceActions, addable: true, infoPage: true},
];
