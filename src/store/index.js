import { applyMiddleware, compose, createStore } from 'redux';
import { createLogger } from 'redux-logger';
import { routerMiddleware } from 'connected-react-router';
import { isEmpty } from 'mt-react-library/functions';
import { createRootReducer } from '../reducers';
import { createBrowserHistory } from 'history';
import Actions from '../actions/Actions';
import loginRedux from '../services/redux/loginRedux';
import dashboardRedux from '../services/redux/dashboardRedux';
import importerRedux from '../services/redux/importerRedux';
import settingRedux from '../services/redux/settingRedux';
import historicRedux from '../services/redux/historicRedux';
import importHistoryRedux from '../services/redux/importHistoryRedux';


const logger = createLogger();

const reduxService = store => next => action => {
  next(action);

  let matched = Actions.match(action);
  let params = Actions.getParams(matched);

  // Allow to exploit connected-react-router state on history.back()
  if (action.type === '@@router/LOCATION_CHANGE' && action.payload.action === 'POP') {
    const definition = Actions.getDefinition(matched);
    const previous = definition && store.getState()[definition.getReducerKey()];
    if (!isEmpty(previous)) {
      const explicitParams = definition.getPathgroupParams(action.payload.location.pathname, true, false, false);

      const previousDefinition = Actions.getDefinition(previous);
      const previousExplicitParams = definition.getPathgroupParams(previousDefinition.getPathname(previous.params), true, false, false);
      if (explicitParams.toString() === previousExplicitParams.toString()) {
        return action;
      }
    }
  }

  // Add all services here using or operator so that only one returning true will apply
  // On each line, interdependent services are listed
  loginRedux(next, matched, params, store.getState()) ||
  dashboardRedux(next, matched, params) ||
  importerRedux(next, matched, params) ||
  settingRedux(next, matched, params, store.getState()) ||
  historicRedux(next, matched, params, store.getState()) ||
  importHistoryRedux(next, matched, params);
  return action;
};

export const history = createBrowserHistory();


const rootReducer = createRootReducer(history);
const store = createStore(rootReducer, compose(applyMiddleware(routerMiddleware(history), reduxService, logger)));

export default store;
