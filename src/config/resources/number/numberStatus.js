import { t } from 'mt-react-library/functions';
import {StatusChangeEnum} from "../../StatusChangeEnum";

export const NumberStatusValuesEnum = Object.freeze({
  AVAILABLE: 'AVAILABLE',
  BOOKED: 'BOOKED',
  ASSIGNED: 'ASSIGNED',
  ACTIVATED: 'ACTIVATED',
  DEACTIVATED: 'DEACTIVATED',
  LOCKEDZONE: 'LOCKEDZONE',
  LOCKEDUSER: 'LOCKEDUSER',
  PORTEDOUT: 'PORTEDOUT',
  PORTEDIN: 'PORTEDIN',
  PAIRED: 'PAIRED'
});

export const rangeNumberStatus = [
  {id: 'statusAll', key: '', value: t('all')},
  {id: 'available', key: NumberStatusValuesEnum.AVAILABLE, value: t('number.available')},
  {id: 'booked', key: NumberStatusValuesEnum.BOOKED, value: t('number.booked')},
  {id: 'assigned', key: NumberStatusValuesEnum.ASSIGNED, value: t('number.assigned')},
  {id: 'activated', key: NumberStatusValuesEnum.ACTIVATED, value: t('number.activated')},
  {id: 'deactivated', key: NumberStatusValuesEnum.DEACTIVATED, value: t('number.deactivated')},
  {id: 'lockedZone', key: NumberStatusValuesEnum.LOCKEDZONE, value: t('number.lockedZone')},
  {id: 'lockedUser', key: NumberStatusValuesEnum.LOCKEDUSER, value: t('number.lockedUser')},
  {id: 'portedIn', key: NumberStatusValuesEnum.PORTEDIN, value: t('number.portedin')},
];

export const numberStatus = [
  ...rangeNumberStatus,
  {id: 'portedOut', key: NumberStatusValuesEnum.PORTEDOUT, value: t('number.portedOut')},
  {id: 'paired', key: NumberStatusValuesEnum.PAIRED, value: t('number.paired')},
];

export const numberStatusChange = [
  {id: 'assign', key: StatusChangeEnum.assign, value: t('number.assigned')},
  {id: 'activate', key: StatusChangeEnum.activate, value: t('number.activate')},
  {id: 'available', key: StatusChangeEnum.available, value: t('number.available')},
  {id: 'book', key: StatusChangeEnum.book, value: t('number.booked')},
  {id: 'portOut', key: StatusChangeEnum.portOut, value: t('number.portOut')},
  {id: 'lockUser', key: StatusChangeEnum.lockUser, value: t('number.lockUser')},
  {id: 'lockZone', key: StatusChangeEnum.lockZone, value: t('number.lockZone')},
  {id: 'free', key: StatusChangeEnum.free, value: t('number.free')},
  {id: 'unlockUser', key: StatusChangeEnum.unlockUser, value: t('number.unlockUser')},
  {id: 'unlockZone', key: StatusChangeEnum.unlockZone, value: t('number.unlockZone')},
  {id: 'unassign', key: StatusChangeEnum.unassign, value: t('number.unassign')},
  {id: 'deactivate', key: StatusChangeEnum.deactivate, value: t('number.deactivated')},
  {id: 'rollbackActivate', key: StatusChangeEnum.rollbackActivate, value: t('number.rollbackActivate')},
  {id: 'rollbackDeactivate', key: StatusChangeEnum.rollbackDeactivate, value: t('number.rollbackDeactivate')},
  {id: 'purged', key: StatusChangeEnum.purged, value: t('number.purged')},
  {id: 'repatriate', key: StatusChangeEnum.repatriate, value: t('number.repatriate')},
  {id: 'pair', key: StatusChangeEnum.pair, value: t('number.pair')},
  {id: 'unpair', key: StatusChangeEnum.unpair, value: t('number.unpair')},
  {id: 'delete', key: StatusChangeEnum.delete, value: t('number.delete')},
  {id: 'rollbackDelete', key: StatusChangeEnum.rollbackDelete, value: t('number.rollbackDelete')},
  {id: 'portIn', key: StatusChangeEnum.portIn, value: t('number.portIn')},
];

export const numberStatusAdd = [
  {id: 'portedIn', key: 'PORTEDIN', value: t('number.portedin')},
  {id: 'available', key: 'AVAILABLE', value: t('number.available')},
  {id: 'deactivated', key: 'DEACTIVATED', value: t('number.deactivated')}
];
