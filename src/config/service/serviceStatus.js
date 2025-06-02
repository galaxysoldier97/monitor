import {t} from "mt-react-library/functions";

export const serviceStatus = [
  {id: 'status_all', key: ' ', value: t('all')},
  {id: 'pending', key: 'PENDING', value: t('service.access.pending')},
  {id: 'activated', key: 'ACTIVATED', value: t('service.access.activated')},
  {id: 'deactivated', key: 'DEACTIVATED', value: t('service.access.deactivated')},
  {id: 'suspended', key: 'SUSPENDED', value: t('service.access.suspended')},
  {id: 'canceled', key: 'CANCELED', value: t('service.access.canceled')},
  {id: 'barred', key: 'BARRED', value: t('service.access.barred')},
];
