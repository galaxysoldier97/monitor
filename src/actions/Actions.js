import { AbstractActions, makeAction } from 'mt-react-library/actions/AbstractActions';

/**
 *  The application actions list. Add here new actions and don't forget to attach them to the router
 */
const definitions = {
  LOGIN: makeAction('@@App/LOGIN', 'session', '/login'),
  LOGOUT: makeAction('@@App/LOGOUT', 'session', '/logout'),
  SETTINGS: makeAction('@@App/SETTINGS', 'preferences', '/settings'),
  DASHBOARD: makeAction('@@App/DASHBOARD', 'dashboard', '/dashboard'),
  EQUIPMENT_INFO: makeAction('@@App/EQUIPMENT_INFO', 'equipment', '/equipment/:equipmentId'),
  IMPORTER: makeAction('@@App/IMPORTER', 'importer', 'importer/:entity/:operation/:action', {
    'entity': ['simCard', 'number', 'ipAddresses', 'equipmentsAdmin', 'servicesAdmin', 'addressAdmin', 'cpe', 'ancillaryEquipments', 'stockAdmin', 'resourcesAdmin'],
    'operation': [['import', 'changeStatus'], ['import'], ['import'], ['import'], ['import'], ['import'], ['import', 'changeStatus'], ['import', 'changeStatus'], ['import'], ['import']],
    'action': [
      [['init', 'upload', 'progress', 'notification', 'restart'], ['init', 'upload', 'progress', 'notification', 'restart']],
      [['init', 'upload', 'progress', 'notification', 'restart']],
      [['init', 'upload', 'progress', 'notification', 'restart']],
      [['init', 'upload', 'progress', 'notification', 'restart']],
      [['init', 'upload', 'progress', 'notification', 'restart']],
      [['init', 'upload', 'progress', 'notification', 'restart']],
      [['init', 'upload', 'progress', 'notification', 'restart'], ['init', 'upload', 'progress', 'notification', 'restart']],
      [['init', 'upload', 'progress', 'notification', 'restart'], ['init', 'upload', 'progress', 'notification', 'restart']],
      [['init', 'upload', 'progress', 'notification', 'restart']],
      [['init', 'upload', 'progress', 'notification', 'restart']],
    ],
  }),
  HISTORIC: makeAction('@@App/HISTORIC', 'historic', '/historic/:entity/:id/:action', {
    'action': ['search', 'notification'],
  }),
  SERVICE_ADMIN: makeAction('@@App/SERVICE_ADMIN', 'serviceAdmin', '/serviceAdmin/:action', {
    'action': ['init', 'notification'],
  }),
  IMPORT_HISTORY_LIST: makeAction('@@App/IMPORT_HISTORY_LIST', 'histories', '/histories/:action', {
    'action': ['init', 'search', 'history', 'last'],
  }),
};
const Actions = AbstractActions.instance(definitions);
export default Actions;
