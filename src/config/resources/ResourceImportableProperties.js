import { t } from 'mt-react-library/functions';
import { resourcesJobOperationEnum } from './ResourcesJobOperationEnum';
import { yesNoFilter } from '../yesNoFilter';

export class ResourceAdminCategories {
  static BLOCK = new ResourceAdminCategories('Block', true);
  static JOB = new ResourceAdminCategories('Job', true);

  constructor(category, isFilterable) {
    this.category = category;
    this.isFilterable = isFilterable;
  }

  toString() {
    return this.category;
  }
}

export const categoriesResourceConfig = [
  {key: 'Block', value: ResourceAdminCategories.BLOCK, label: t('block')},
  {key: 'Job', value: ResourceAdminCategories.JOB, label: t('job')},
];

export const blockHeader = [
  {id: 'blockId', label: 'id', hidden: true},
  {id: 'blockPrefix', label: t('block.blockPrefix'), filterable: true, addable: true},
  {id: 'countryCode', label: t('block.countryCode'), filterable: true, addable: true},
  {id: 'length', label: t('block.length'), hidden: true, addable: true},
  {id: 'localPrefix', label: t('block.localPrefix'), addable: true},
  {id: 'zone', label: t('block.zone'), editable: true, addable: true},
  {id: 'actions', label: '', cellProps: {style: {whiteSpace: 'nowrap'}}},
];

export const jobHeader = [
  {id: 'id', label: t('id'), hidden: true, infoPage: true},
  {id: 'operation', label: t('jobConfiguration.operation'), type: 'enum', values: resourcesJobOperationEnum, filterable: true, addable: true, editable: true, infoPage: true},
  {id: 'activity', label: t('jobConfiguration.activity'), type: 'enum', filterable: true, addable: true, editable: true, infoPage: true},
  {id: 'inventoryPool', label: t('jobConfiguration.inventoryPool'), hidden:true, addable: true, editable: true, infoPage: true},
  {id: 'offerType', label: t('jobConfiguration.offerType'), filterable: true, addable: true, editable: true, infoPage: true},
  {id: 'days', label: t('jobConfiguration.days'), addable: true, editable: true, infoPage: true},
  {id: 'enabled', label: t('jobConfiguration.enabled'),type: 'enum', values: yesNoFilter, addable: true, editable: true, infoPage: true},
  {id: 'actions', label: '', cellProps: {style: {whiteSpace: 'nowrap'}}},
];
