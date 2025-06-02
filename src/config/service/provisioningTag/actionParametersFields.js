import { parameterTypes } from './parameterTypes';
export const actionParametersFields = [
    {id: 'parameterId', label: 'provisioningTag.action.parameter.parameterId', type: 'number', hidden: true},
    {id: 'parameterCode', label: 'provisioningTag.action.parameter.parameterCode', type: 'enum', values: 'dynamic', addable: true},
    {id: 'parameterValue', label: 'provisioningTag.action.parameter.parameterValue', type: 'string', addable: true},
    {id: 'parameterType', label: 'provisioningTag.action.parameter.parameterType', type: 'enum', values: parameterTypes, addable: true},
    {id: 'description', label: 'description', type:'string'},
];
