import { t } from 'mt-react-library/functions';

export const handsetsStatus = [
  {
    id: 'statusAll',
    key: '',
    value: t('all'),
  },
  {
    id: 'instore',
    key: 'INSTORE',
    value: t('stock.handsets.status.instore'),
  },
  {
    id: 'available',
    key: 'AVAILABLE',
    value: t('stock.handsets.status.available'),
  },
  {
    id: 'booked',
    key: 'BOOKED',
    value: t('stock.handsets.status.booked'),
  },
  {
    id: 'assigned',
    key: 'ASSIGNED',
    value: t('stock.handsets.status.assigned'),
  },
  {
    id: 'blacklisted',
    key: 'BLACKLISTED',
    value: t('stock.handsets.status.blacklisted'),
  },
  {
    id: 'deactivated',
    key: 'DEACTIVATED',
    value: t('stock.handsets.status.deactivated'),
  },
];
