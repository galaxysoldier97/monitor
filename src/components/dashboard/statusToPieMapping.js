import { cyan, green, indigo, lime, orange, pink, purple, yellow } from '@material-ui/core/colors';

export const statusToPieMapping = {
  LOCKEDOPERATOR: {
    color: pink[400],
    name: 'Locked zone',
  },
  ASSIGNED: {
    color: purple[600],
    name: 'Assigned',
  },
  PORTEDIN: {
    color: cyan[300],
    name: 'Ported in',
  },
  AVAILABLE: {
    color: green[300],
    name: 'Available',
  },
  PORTEDOUT: {
    color: cyan[600],
    name: 'Ported out',
  },
  BOOKED: {
    color: purple[300],
    name: 'Booked',
  },
  ACTIVATED: {
    color: green[800],
    name: 'Activated',
  },
  LOCKEDUSER: {
    color: pink[600],
    name: 'Locked user',
  },
  DEACTIVATED: {
    color: orange[600],
    name: 'Deactivated',
  },
  INSTORE: {
    color: indigo[500],
    name: 'In store',
  },
  ONHOLD: {
    color: yellow[700],
    name: 'On hold',
  },
  RETURNED: {
    color: lime[500],
    name: 'Returned',
  },
  BILLABLE: {
    color: indigo[400],
    name: 'Billable',
  },
  PENDING: {
    color: indigo[600],
    name: 'Pending',
  },
  DRAFT: {
    color: lime[500],
    name: 'Draft',
  },
  CANCELED: {
    color: orange[900],
    name: 'Canceled',
  },
  PAIRED: {
    color: pink[300],
    name: 'Paired',
  },
  BARRED: {
    color: pink[800],
    name: 'Barred'
  },
  SUSPENDED: {
    color: orange[400],
    name: 'Suspended'
  }
};
