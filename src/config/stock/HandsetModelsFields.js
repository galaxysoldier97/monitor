import { handsetModelsType } from '../../config/stock/handsetModelsType';

export const handsetModelsFields = [
  {
    id: 'code',
    label: 'stock.handsetmodels.code',
    filterable: true,
    addable:true,
  },
  {
    id: 'name',
    label: 'stock.handsetmodels.name',
    filterable: true,
    addable:true,
    editable:true,
  },
  {
    id: 'manufacturer',
    label: 'stock.handsetmodels.manufacturer',
    filterable: true,
    addable:true,
    type: 'enum',
    values: 'dynamic',
    editable:true,
  },
  {
    id: 'type',
    label: 'stock.handsetmodels.type',
    type: 'enum',
    values: handsetModelsType,
    filterable: true,
    addable:true,
    editable:true,
  },
  {id: 'actions', label: '', cellProps: {style: {whiteSpace: 'nowrap'}}},
];
