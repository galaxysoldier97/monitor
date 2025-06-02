import { t } from 'mt-react-library/functions';
import { cpeStatusEvent } from '../cpe/cpeStatus';

export const simCardStatus = [
  {id: 'statusAll', key: '', value: t('all')},
  {id: 'inStore', key: 'INSTORE', value: t('simcard.inStore')},
  {id: 'available', key: 'AVAILABLE', value: t('simcard.available')},
  {id: 'booked', key: 'BOOKED', value: t('simcard.booked')},
  {id: 'assigned', key: 'ASSIGNED', value: t('simcard.assigned')},
  {id: 'activated', key: 'ACTIVATED', value: t('simcard.activated')},
  {id: 'onHold', key: 'ONHOLD', value: t('simcard.onhold')},
  {id: 'returned', key: 'RETURNED', value: t('simcard.returned')},
  {id: 'notReturned', key: 'NOTRETURNED', value: t('simcard.notReturned')},
  {id: 'deprecated', key: 'DEPRECATED', value: t('simcard.deprecated')},
  {id: 'repackaging', key: 'REPACKAGING', value: t('simcard.repackaging')},
  {id: 'deactivated', key: 'DEACTIVATED', value: t('simcard.deactivated')},
  {id: 'final', key: 'FINAL', value: t('simcard.final')},
];

export const simCardStatusEvent = cpeStatusEvent;
