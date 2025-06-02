import { t } from 'mt-react-library/functions';

export const intervalNumbersFields = [
  {
    id: 'firstNumber', label: t('block.firstNumber'), type: 'number', editable: true, filterable: true,
  },
  {
    id: 'lastNumber', label: t('block.lastNumber'), type: 'number', editable: true,
  },
  {
    id: 'activity', label: t('block.activity'), type: 'enum', values: 'dynamic', editable: true, filterable: true,
  },
  {
    id: 'system', label: t('block.system'), type: 'boolean', editable: true, filterable: false,
  },
  {
    id: 'portability', label: t('block.portability'), type: 'boolean', editable: true, filterable: false,
  },
  {
    id: 'inventoryPoolCode', label: t('number.inventoryPoolCode'), type: 'enum', values: 'dynamic', addable: ['EPIC', 'EIR'], filterable: false, hidden: true,
  },
  {
    id: 'offerType', label: t('number.offerType'), type: 'string', addable: ['EPIC', 'EIR'], filterable: false, hidden: true,
  },
  {
    id: 'actions',
  },
];
