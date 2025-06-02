import Actions from '../../actions/Actions';
import TecrepEntityImportService from '../TecrepEntityImportService';
import { initializeSimCard } from '../../components/import/simCardImport';
import { initializeNumbers } from '../../components/import/numbersImport';
import { initializeIpAddress } from '../../components/import/ipAddressesImport';
import { initializeEquipmentsAdmin } from '../../components/import/equipmentsAdminImport';
import { initializeServicesAdmin } from '../../components/import/servicesAdminImport';
import { handleError } from './functions';
import { initializeAddressAdmin } from '../../components/import/addressAdminImport';
import { initializeCPE } from '../../components/import/cpeImport';
import { initializeAncillaryEquipments } from '../../components/import/ancillaryEquipmentsImport';
import { initializeStockAdmin } from '../../components/import/stockAdminImport';
import {initializeResourcesAdmin} from "../../components/import/ResourcesAdminImport";

const importerRedux = (next, action, params) => {
  const sendNotification = (message, show = true) => {
    next(Actions.IMPORTER.propagate(action, {
      payload: {message: message, show: show},
      params: [params[0], params[1], 'notification'],
    }));
  };

  const performUpload = () => {
    let upload = action.params[3];
    let importParams = action.params[4];
    TecrepEntityImportService.upload(upload.entityCategory, upload.entityName, upload.value, importParams)
    .then(res => {
      next(Actions.IMPORTER.propagate(action, {
        payload: {message: `Import id ${res.data.id} is successful`, show: true},
        params: [params[0], params[1], 'notification'],
      }));
    })
    .catch(err => {
      handleError(err, sendNotification);
    });
  };

  const performInit = () => {
    // Naive check of the first path group parameter from location pathname to be sure not to match on non-import actions
    let actionPathname = action.payload && action.payload.location ? action.payload.location.pathname : '/' + params[0] + '/';
    let isDispatchedSimcardImportAction = action.params === params && action.params[0] === 'simCard';
    let isDispatchedNumberImportAction = action.params === params && action.params[0] === 'number';
    let isDispatchedIpAddressImportAction = action.params === params && action.params[0] === 'ipAddresses';
    let isDispatchedEquipmentsAdminAction = action.params === params && action.params[0] === 'equipmentsAdmin';
    let isDispatchedServicesAdminAction = action.params === params && action.params[0] === 'servicesAdmin';
    let isDispatchedAddressAdminAction = action.params === params && action.params[0] === 'addressAdmin';
    let isDispatchedCPEImportAction = action.params === params && action.params[0] === 'cpe';
    const isDispatchedResourcesAdminAction = action.params === params && action.params[0] === 'resourcesAdmin';
    const isDispatchedAncillaryEquipmentsImportAction = action.params === params && action.params[0] === 'ancillaryEquipments';
    const isDispatchedStockImportAction = action.params === params && action.params[0] === 'stockAdmin';
    if (actionPathname.startsWith('/importer/simCard/') || isDispatchedSimcardImportAction) {
      initializeSimCard(next, action, params, handleError, sendNotification);
    } else if (actionPathname.startsWith('/importer/number/') || isDispatchedNumberImportAction) {
      initializeNumbers(next, action, params);
    } else if (actionPathname.startsWith('/importer/ipAddresses/') || isDispatchedIpAddressImportAction) {
      initializeIpAddress(next, action, params);
    } else if (actionPathname.startsWith('/importer/equipmentsAdmin') || isDispatchedEquipmentsAdminAction) {
      initializeEquipmentsAdmin(next, action, params);
    } else if (actionPathname.startsWith('/importer/servicesAdmin') || isDispatchedServicesAdminAction) {
      initializeServicesAdmin(next, action, params, handleError, sendNotification);
    } else if (actionPathname.startsWith('/importer/addressAdmin') || isDispatchedAddressAdminAction) {
      initializeAddressAdmin(next, action, params);
    } else if (actionPathname.startsWith('/importer/resourcesAdmin') || isDispatchedResourcesAdminAction) {
      initializeResourcesAdmin(next, action, params, handleError, sendNotification);
    }else if (actionPathname.startsWith('/importer/cpe') || isDispatchedCPEImportAction) {
      initializeCPE(next, action, params, handleError, sendNotification);
    } else if (actionPathname.startsWith('/importer/ancillaryEquipments') || isDispatchedAncillaryEquipmentsImportAction) {
      initializeAncillaryEquipments(next, action, params, handleError, sendNotification);
    } else if (actionPathname.startsWith('/importer/stockAdmin') || isDispatchedStockImportAction) {
      initializeStockAdmin(next, action, params, handleError, sendNotification);
    } else {
      return false;
    }
    return true;
  };

  if (action.type === Actions.IMPORTER.REQUEST) {
    switch (params[2]) {
      case 'upload' :
        performUpload();
        break;
      case 'notification' :
        sendNotification('', false);
        break;
      case 'init' :
      default:
        performInit();
    }
    return true;
  } else {
    return false;
  }
};

export default importerRedux;
