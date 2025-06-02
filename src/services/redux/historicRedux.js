import Actions from '../../actions/Actions';
import TecrepSimCardService from '../equipments/TecrepSimCardService';
import { cyclicGraph } from 'mt-react-library/functions';
import { handleError } from './functions';
import TecrepServiceService from '../services/TecrepServiceService';
import TecrepNumberService from '../resources/TecrepNumberService';
import TecrepBuildingService from '../address/TecrepBuildingService';
import TecrepCPEService from '../equipments/TecrepCpeService';
import TecrepAncillaryEquipmentsService from '../equipments/TecrepAncillaryEquipmentsService';
import BuildingFlatService from '../address/BuildingFlatService';
import PtoService from '../address/PtoService';
import AccessPointService from '../address/AccessPointService';
import BuildingStatusService from '../address/BuildingStatusService';
import PostalAddressService from '../address/PostalAddressService';
import TecrepRangeNumbersService from '../../services/resources/TecrepRangeNumbersService';
import TecrepIpAddressesService from '../resources/TecrepIpAddressesService';

const historicRedux = (next, action, params) => {

  const sendNotification = (message, show = true) => {
    next(Actions.HISTORIC.propagate(action, {
      payload: [{message, show}, []],
      params: [params[0], params[1], 'notification'],
    }));
  };

  const performSearch = () => {
    next(Actions.HISTORIC.propagate(action, {
      payload: [params[3], null],
      params: [params[0], params[1]],
    }));
    switch (params[0]) {
      case 'buildingStatus':
        BuildingStatusService.searchRevisions(params[1])
        .then(data => {
          let payloadData = data._embedded ? cyclicGraph(data._embedded.revisions) : [];
          next(Actions.HISTORIC.propagate(action, {
            payload: [params[3], payloadData],
            params: [params[0], params[1]],
          }));
        })
        .catch(err => handleError(err, sendNotification));
        return true;
      case 'accessPoint':
        AccessPointService.searchRevisions(params[1])
        .then(data => {
          let payloadData = data._embedded ? cyclicGraph(data._embedded.revisions) : [];
          next(Actions.HISTORIC.propagate(action, {
            payload: [params[3], payloadData],
            params: [params[0], params[1]],
          }));
        })
        .catch(err => handleError(err, sendNotification));
        return true;
      case 'postalAddress':
        PostalAddressService.searchRevisions(params[1])
        .then(data => {
          let payloadData = data._embedded ? cyclicGraph(data._embedded.revisions) : [];
          next(Actions.HISTORIC.propagate(action, {
            payload: [params[3], payloadData],
            params: [params[0], params[1]],
          }));
        })
        .catch(err => handleError(err, sendNotification));
        return true;
      case 'pto':
        PtoService.searchRevisions(params[1])
        .then(data => {
          let payloadData = data._embedded ? cyclicGraph(data._embedded.revisions) : [];
          next(Actions.HISTORIC.propagate(action, {
            payload: [params[3], payloadData],
            params: [params[0], params[1]],
          }));
        })
        .catch(err => handleError(err, sendNotification));
        return true;
      case 'buildingFlat':
        BuildingFlatService.searchRevisions(params[1])
        .then(data => {
          let payloadData = data._embedded ? cyclicGraph(data._embedded.revisions) : [];
          next(Actions.HISTORIC.propagate(action, {
            payload: [params[3], payloadData],
            params: [params[0], params[1]],
          }));
        })
        .catch(err => handleError(err, sendNotification));
        return true;
      case 'number':
        TecrepNumberService.searchRevisions(params[1])
        .then(data => {
          let payloadData = data.content || [];
          next(Actions.HISTORIC.propagate(action, {
            payload: [params[3], payloadData],
            params: [params[0], params[1]],
          }));
        })
        .catch(err => handleError(err, sendNotification));
        return true;
      case 'ipAddress':
        TecrepIpAddressesService.searchRevisions(params[1])
        .then(data => {
          let payloadData = data.content || [];
          next(Actions.HISTORIC.propagate(action, {
            payload: [params[3], payloadData],
            params: [params[0], params[1]],
          }));
        })
        .catch(err => handleError(err, sendNotification));
        return true;
      case 'rangeNumber':
        TecrepRangeNumbersService.searchRevisions(params[1])
        .then(data => {
          let payloadData = data.content ? cyclicGraph(data.content) : [];
          next(Actions.HISTORIC.propagate(action, {
            payload: [params[3], payloadData],
            params: [params[0], params[1]],
          }));
        })
        .catch(err => handleError(err, sendNotification));
        return true;
      case 'service':
        TecrepServiceService.searchRevisions(params[1])
        .then(data => {
          let payloadData = data._embedded ? cyclicGraph(data._embedded.revisions) : [];
          next(Actions.HISTORIC.propagate(action, {
            payload: [params[3], payloadData],
            params: [params[0], params[1]],
          }));
        })
        .catch(err => handleError(err, sendNotification));
        return true;
      case 'simcard':
        TecrepSimCardService.searchRevisions(params[1])
        .then(data => {
          let payloadData = data.content ? cyclicGraph(data.content) : [];
          next(Actions.HISTORIC.propagate(action, {
            payload: [params[3], payloadData],
            params: [params[0], params[1]],
          }));
        })
        .catch(err => handleError(err, sendNotification));
        return true;
      case 'building':
        TecrepBuildingService.searchRevisions(params[1])
        .then(data => {
          let payloadData = data._embedded ? cyclicGraph(data._embedded.revisions) : [];
          next(Actions.HISTORIC.propagate(action, {
            payload: [params[3], payloadData],
            params: [params[0], params[1]],
          }));
        })
        .catch(err => handleError(err, sendNotification));
        return true;
      case 'cpe':
        TecrepCPEService.searchRevisions(params[1])
        .then(data => {
          let payloadData = data.content ? cyclicGraph(data.content) : [];
          next(Actions.HISTORIC.propagate(action, {
            payload: [params[3], payloadData],
            params: [params[0], params[1]],
          }));
        })
        .catch(err => handleError(err, sendNotification));
        return true;
      case 'ancillaryEquipment':
        TecrepAncillaryEquipmentsService.searchRevisions(params[1])
        .then(data => {
          let payloadData = data.content ? cyclicGraph(data.content) : [];
          next(Actions.HISTORIC.propagate(action, {
            payload: [params[3], payloadData],
            params: [params[0], params[1]],
          }));
        })
        .catch(err => handleError(err, sendNotification));
        return true;
      default:
        return false;
    }

  };

  if (action.type === Actions.HISTORIC.REQUEST) {
    performSearch();
  }
};

export default historicRedux;
