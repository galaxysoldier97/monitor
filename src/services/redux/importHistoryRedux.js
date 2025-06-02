import Actions from '../../actions/Actions';
import { cyclicGraph, isEmpty } from 'mt-react-library/functions';
import { handleError } from './functions';
import ImportHistoryService from '../ImportHistoryService';

const importHistoryRedux = (next, action, params) => {

  const sendNotification = (message, show = true, closer) => {
    next(Actions.IMPORT_HISTORY_LIST.propagate(action, {
      payload: [{notification: Object.assign({message: message, show: show}, closer)}, null],
      params: ['init'],
    }));
  };

  const performSearch = () => {
    ImportHistoryService.search(action)
    .then(data => {
      let payloadData = data._embedded ? cyclicGraph(data._embedded.histories) : [];
      next(Actions.IMPORT_HISTORY_LIST.propagate(action, {
        payload: [null, payloadData],
        params: ['search'],
        pagination: data.page,
        filter: action.filter,
      }));
    })
    .catch(err => handleError(err, sendNotification));
  };

  const performRetrieve = () => {
    ImportHistoryService.getById(params[1])
    .then(data => {
      next(Actions.IMPORT_HISTORY_LIST.propagate(action, {
        payload: [cyclicGraph(data), null],
        params: ['history'],
        pagination: data.page,
        filter: action.filter,
      }));
    })
    .catch(err => handleError(err, sendNotification));
  };

  const performLast = () => {
    let category = params[1];
    ImportHistoryService.getLast(category)
    .then(data => {
      let last = isEmpty(data) ? {} : cyclicGraph(data);
      next(Actions.IMPORT_HISTORY_LIST.propagate(action, {
        payload: [last, null],
        params: ['last'],
      }));
    })
    .catch(err => handleError(err, sendNotification));
  };

  if (action.type === Actions.IMPORT_HISTORY_LIST.REQUEST) {
    switch (params[0]) {
      case 'last':
        performLast();
        break;
      case 'history':
        performRetrieve();
        break;
      case 'search' :
      default:
        performSearch();
    }
    return true;
  }
  return false;
};

export default importHistoryRedux;
