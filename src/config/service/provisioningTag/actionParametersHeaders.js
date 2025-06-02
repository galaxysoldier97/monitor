import { parameterTypes } from './parameterTypes';
import {t} from "mt-react-library/functions";
export const actionParametersHeader = [
  {id: 'parameterId', label: t('provisioningTag.action.parameter.parameterId'), type: 'number', hidden: true},
  {id: 'parameterCode', label: t('provisioningTag.action.parameter.parameterCode'), type: 'enum', values: 'dynamic', addable: true},
  {id: 'parameterValue', label: t('provisioningTag.action.parameter.parameterValue'), type: 'string', addable: true},
  {id: 'parameterType', label: t('provisioningTag.action.parameter.parameterType'), type: 'enum', values: parameterTypes, addable: true},
  {id: 'description', label: t('description'), type:'string'},
  {id: 'actions', label: '', cellProps: {style: {whiteSpace: 'nowrap'}}},
];
