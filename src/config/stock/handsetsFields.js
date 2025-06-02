import { handsetsStatus } from '../../config/stock/handsetsStatus';

export const handsetsFields = [
  {
    id: 'handsetId',
    label: 'stock.handsets.deviceid',
    hidden: true,
  },
  {
    id: 'imei',
    label: 'stock.handsets.imei',
    filterable: true,
    addable: true
  },
  {
    id: 'packId',
    label: 'stock.handsets.packId',
    filterable: true,
    addable: true,
    editable: true,
  },
  {
    id: 'orderId',
    label: 'stock.handsets.orderId',
    filterable: true,
    addable: true,
    editable: true,
  },
  {
    id: 'status',
    label: 'stock.handsets.status',
    type: 'enum',
    values: handsetsStatus,
    filterable: true,
    addable: true,
  },
  {
    id: 'model',
    label: 'stock.handsets.model',
    addable: true,
    type: 'enum',
    values: 'dynamic',
    editable: true,
  },
  {
    id: 'warehouse',
    label: 'stock.handsets.warehouse',
    addable: true,
    type: 'enum',
    values: 'dynamic',
    editable: true,
  },
  {id: 'actions', label: '', cellProps: {style: {whiteSpace: 'nowrap'}}},
];
