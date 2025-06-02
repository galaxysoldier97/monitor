import { t } from 'mt-react-library/functions';
import { rangeNumberStatus } from '../number/numberStatus';
import { yesNoFilter } from '../../yesNoFilter';

export const rangeNumbersFields = [
  {
    id: 'rangeId',
    label: t('rangeNumbers.rangeId'),
    infoPage: true,
    filterable: true,
  },
  {
    id: 'status',
    label: t('rangeNumbers.status'),
    filterable: true,
    type: 'enum',
    values: rangeNumberStatus,
    editable: true,
    infoPage: true,
  },
  {
    id: 'capacity',
    label: t('rangeNumbers.capacity'),
    filterable: false,
    infoPage: true,
  },
  {
    id: 'firstNumber',
    label: t('rangeNumbers.firstNumber'),
    filterable: false,
    infoPage: true,
  },
  {
    id: 'lastNumber',
    label: t('rangeNumbers.lastNumber'),
    filterable: false,
    infoPage: true,
  },
  {
    id: 'number',
    label: t('rangeNumbers.number'),
    hidden: true,
    filterable: true,
    type: 'string',
  },
  {
    id: 'continuousRange',
    label: t('rangeNumbers.continuousRange'),
    filterable: true,
    type: 'enum',
    values: yesNoFilter,
    addable: true,
    infoPage: true,
  },
  {
    id: 'extendedRange',
    label: t('rangeNumbers.extendedRange'),
    filterable: true,
    type: 'enum',
    values: yesNoFilter,
    infoPage: true,
    editable: true,
  },
  {
    id: 'mainRangeId',
    label: t('rangeNumbers.mainRangeId'),
    filterable: true,
    type: 'number',
    infoPage: true,
    editable: true,
  },
  {
    id: 'serviceId',
    label: t('rangeNumbers.serviceId'),
    filterable: true,
    type: 'number',
    infoPage: true,
  },
  {
    id: 'orderId',
    label: t('rangeNumbers.orderId'),
    filterable: true,
    type: 'string',
    infoPage: true,
    editable: true,
  },
  {
    id: 'actions',
    label: '',
    cellProps: {style: {whiteSpace: 'nowrap'}},
  },
];

export const rangeNumberListHeader = [
  {
    id: 'number',
    label: t('number.number'),
  },
  {
    id: 'status',
    label: t('number.status'),
  },
  {
    id: 'vanityCategory',
    label: t('number.vanityCategory'),
  },
  {
    id: 'activityService',
    label: t('number.activityService'),
  },
  {
    id: 'nature',
    label: t('number.nature'),
  },
  {
    id: 'orderId',
    label: t('number.orderId'),
  },
  {
    id: 'actions',
    label: '',
    cellProps: {style: {whiteSpace: 'nowrap'}},
  },
];

const serviceWizardHeaders = [
  'rangeId', 'status', 'capacity', 'firstNumber', 'lastNumber', 'continuousRange', 'serviceId', 'orderId',
];
export const rangeNumbersHeaderForUpdateServiceWizard = rangeNumbersFields.filter(
  header => serviceWizardHeaders.includes(header.id)
);
