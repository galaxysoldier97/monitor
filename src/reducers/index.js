import { connectRouter } from 'connected-react-router';
import Actions from '../actions/Actions';
import { combineReducers } from 'redux';
import { reducer as forms } from 'redux-form';
import { accumulate, DefaultReducer, ErrorToConsoleReducer, ListReducer, split } from 'mt-react-library/reducers';

export const createRootReducer = history => combineReducers({
  router: connectRouter(history),
  form: forms,
  error: ErrorToConsoleReducer.instance(),

  [Actions.LOGIN.getReducerKey()]: DefaultReducer.instance(Actions.LOGIN, Actions.LOGOUT),
  [Actions.DASHBOARD.getReducerKey()]: DefaultReducer.instance(Actions.DASHBOARD),
  [Actions.SERVICE_ADMIN.getReducerKey()]: DefaultReducer.instance(Actions.SERVICE_ADMIN),
  [Actions.IMPORTER.getReducerKey()]: accumulate(DefaultReducer.instance(Actions.IMPORTER)),
  [Actions.SETTINGS.getReducerKey()]: DefaultReducer.instance(Actions.SETTINGS),
  [Actions.HISTORIC.getReducerKey()]: accumulate(split([Actions.HISTORIC], DefaultReducer.instance(Actions.HISTORIC), ListReducer.instance(Actions.HISTORIC))),
  [Actions.IMPORT_HISTORY_LIST.getReducerKey()]: accumulate(split([Actions.IMPORT_HISTORY_LIST], DefaultReducer.instance(Actions.IMPORT_HISTORY_LIST), ListReducer.instance(Actions.IMPORT_HISTORY_LIST))),
});
