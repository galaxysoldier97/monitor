import { t } from 'mt-react-library/functions';

export const configFields = [
  {id: 'id', label: 'config.id', type: 'number', hidden: true},
  {id: 'code', label: 'config.code', type: 'string', editable: true, filterable: true},
  {id: 'value', label: 'config.value', type: 'string', addable: true, filterable: true},
  {id: 'actions', label: '', cellProps: {style: {whiteSpace: 'nowrap'}}},
];

export const dynamicValues = {parameterValue: "peppa"};

export const configFieldDynamic = [
  {id: 'parameterValue', label: 'config.parameterValue', type: 'enum', values: 'dynamic'},
];

export const configFieldsTranslated = [
  {id: 'parameterValue', label: t('config.parameterValue'), type: 'string'},
];

export const configFieldsCompany = [
  {id: 'id', label: 'config.id', type: 'number', hidden: ['EPIC']},
  {id: 'code', label: 'config.code', type: 'string', editable: ['MT'], filterable: ['MT', 'EIR']},
  {id: 'value', label: 'config.value', type: 'string', addable: ['MT'], filterable: ['EIR', 'EPIC']},
];

export const hiddenConditionsMock = {code: true};

export const editableConditionsMock = {value: true};

export const configFieldsConditions = [
  {id: 'id', label: 'config.id', type: 'number', hidden: true},
  {id: 'code', label: 'config.code', type: 'string'},
  {id: 'value', label: 'config.value', type: 'string'},
];