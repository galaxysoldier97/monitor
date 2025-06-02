import { t } from 'mt-react-library/functions';

export const cpeStatus = [
  {
    id: 'statusAll',
    key: '',
    value: t('all'),
  },
  {
    id: 'inStore',
    key: 'INSTORE',
    value: t('cpe.inStore'),
  },
  {
    id: 'available',
    key: 'AVAILABLE',
    value: t('cpe.available'),
  },
  {
    id: 'booked',
    key: 'BOOKED',
    value: t('cpe.booked'),
  },
  {
    id: 'assigned',
    key: 'ASSIGNED',
    value: t('cpe.assigned'),
  },
  {
    id: 'activated',
    key: 'ACTIVATED',
    value: t('cpe.activated'),
  },
  {
    id: 'onHold',
    key: 'ONHOLD',
    value: t('cpe.onHold'),
  },
  {
    id: 'returned',
    key: 'RETURNED',
    value: t('cpe.returned'),
  },
  {
    id: 'notReturned',
    key: 'NOTRETURNED',
    value: t('cpe.notReturned'),
  },
  {
    id: 'deprecated',
    key: 'DEPRECATED',
    value: t('cpe.deprecated'),
  },
  {
    id: 'repackaging',
    key: 'REPACKAGING',
    value: t('cpe.repackaging'),
  },
  {
    id: 'deactivated',
    key: 'DEACTIVATED',
    value: t('cpe.deactivated')
  },
];

export const cpeStatusEventEnum = {
  AVAILABLE: 'available',
  INSTORE: 'instore',
  BOOK: 'book',
  FREE: 'free',
  REPACKAGE: 'repackage',
  UNASSIGN: 'unassign',
  ASSIGN: 'assign',
  ACTIVATE: 'activate',
  DEACTIVATE: 'deactivate',
  ROLLBACK_DEACTIVATE: 'rollback_deactivate',
  SETNOTRETURN: 'setnotreturn',
  ONHOLD: 'onhold',
  SETRETURN: 'setreturn',
  ROLLBACK_ACTIVATE: 'rollback_activate',
  DEPRECIATE: 'depreciate',
  ROLLBACK_ONHOLD: 'rollback_onhold',
  TO_RETURN: 'toreturn'
};

export const cpeStatusEvent = [
  {key: cpeStatusEventEnum.AVAILABLE, value: 'AVAILABLE'},
  {key: cpeStatusEventEnum.INSTORE, value: 'INSTORE'},
  {key: cpeStatusEventEnum.BOOK, value: 'BOOKED'},
  {key: cpeStatusEventEnum.FREE, value: 'FREE'},
  {key: cpeStatusEventEnum.REPACKAGE, value: 'REPACKAGE'},
  {key: cpeStatusEventEnum.UNASSIGN, value: 'UNASSIGN'},
  {key: cpeStatusEventEnum.ASSIGN, value: 'ASSIGNED'},
  {key: cpeStatusEventEnum.ACTIVATE, value: 'ACTIVATED'},
  {key: cpeStatusEventEnum.DEACTIVATE, value: 'DEACTIVATED'},
  {key: cpeStatusEventEnum.ROLLBACK_DEACTIVATE, value: 'ROLLBACK_DEACTIVATE'},
  {key: cpeStatusEventEnum.SETNOTRETURN, value: 'SETNOTRETURN'},
  {key: cpeStatusEventEnum.ONHOLD, value: 'ONHOLD'},
  {key: cpeStatusEventEnum.SETRETURN, value: 'SETRETURN'},
  {key: cpeStatusEventEnum.ROLLBACK_ACTIVATE, value: 'ROLLBACK_ACTIVATE'},
  {key: cpeStatusEventEnum.DEPRECIATE, value: 'DEPRECIATE'},
  {key: cpeStatusEventEnum.ROLLBACK_ONHOLD, value: 'ROLLBACK_ONHOLD'},
  {key: cpeStatusEventEnum.TO_RETURN, values: 'TO_RETURN'}
];
