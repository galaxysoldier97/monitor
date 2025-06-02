import {SearchEntities} from './SearchEntities';
import TecrepNumberService from '../services/resources/TecrepNumberService';
import TecrepIpAddressesService from '../services/resources/TecrepIpAddressesService';
import TecrepRangeNumbersService from '../services/resources/TecrepRangeNumbersService';
import {t} from 'mt-react-library/functions';
import TecrepSimCardService from '../services/equipments/TecrepSimCardService';
import TecrepAncillaryEquipmentsService from '../services/equipments/TecrepAncillaryEquipmentsService';
import TecrepCpeService from '../services/equipments/TecrepCpeService';
import * as StockManagementService from '../services/Stock/StockManagementService';
import TecrepServiceAccessService from '../services/services/TecrepServiceAccessService';
import TecrepActivationCodeService from '../services/services/TecrepActivationCodeService';
import TecrepServiceComponentService from '../services/services/TecrepServiceComponentService';
import TecrepProvisioningTagService from '../services/services/TecrepProvisioningTagService';
import TecrepStreetService from '../services/address/TecrepStreetService';
import TecrepBuildingService from '../services/address/TecrepBuildingService';

export const getSearchFunction = (entity, filters, page, size) => {
  switch (entity) {
    case SearchEntities.numbers:
      return TecrepNumberService.search(filters, page, size);
    case SearchEntities.ipAddresses:
      return TecrepIpAddressesService.search(page, size, filters);
    case SearchEntities.rangeNumbers:
      return filters.rangeId ? TecrepRangeNumbersService.get(filters.rangeId) : TecrepRangeNumbersService.search(filters, page, size);
    case SearchEntities.simcards:
      return TecrepSimCardService.search(filters, page, size);
    case SearchEntities.ancillaryEquipments:
      return TecrepAncillaryEquipmentsService.search(filters, page, size);
    case SearchEntities.cpe:
      return TecrepCpeService.search(filters, page, size);
    case SearchEntities.handsets:
      return StockManagementService.getHandsets(filters, page, size);
    case SearchEntities.handsetModels:
      return StockManagementService.getHandsetModels({...filters, manufacturerName: filters.manufacturer}, page, size);
    case SearchEntities.serviceAccess:
      return TecrepServiceAccessService.search(filters, page, size);
    case SearchEntities.activationCodes:
      return TecrepActivationCodeService.search(filters.code, filters.nature, filters.networkComponent, page, size);
    case SearchEntities.serviceComponent:
      return TecrepServiceComponentService.search(filters, page, size);
    case SearchEntities.provisioningTags:
      return TecrepProvisioningTagService.search(filters.tagCode, filters.accessType, filters.activity, filters.nature, filters.componentType, page, size);
    case SearchEntities.streets:
      return TecrepStreetService.getStreets(filters, page, size);
    case SearchEntities.postalAddresses:
      return TecrepBuildingService.searchPostalAddress(filters.buildingCode, filters.buildingName, filters.streetNumber, filters.district, filters.streetQualifier, filters.streetName, filters.sector, filters.buildingBlock, filters.buildingType, 'true', page, size);
    case SearchEntities.buildings:
      return TecrepBuildingService.searchPostalAddress(filters.buildingCode, filters.buildingName, filters.streetNumber, filters.district, filters.streetQualifier, filters.streetName, filters.sector, filters.buildingBlock, filters.buildingType, 'false', page, size);
    default:
      return;
  }
};

export const getErrorMessage = (err, fallBackMessage = t('error.title')) => {
  if (!err || !err.response || !err.response.data) {
    return fallBackMessage;
  }
  let resp = err.response.data;
  if (resp instanceof ArrayBuffer) {
    resp = JSON.parse(Buffer.from(err.response.data).toString('utf8'));
  }
  return resp.errorMessage || resp.message || resp.error || err.message || fallBackMessage;
};

export const mapListFromResponse = (res, entity) => {
  switch (entity) {
    case SearchEntities.serviceAccess:
      return res._embedded ? res._embedded.serviceaccesses : [];
    case SearchEntities.activationCodes:
      return res._embedded ? res._embedded.activationcodes : [];
    case SearchEntities.serviceComponent:
      return res._embedded ? res._embedded.servicecomponents : [];
    case SearchEntities.provisioningTags:
      return res._embedded ? res._embedded.provisioningtags : [];
    case SearchEntities.streets:
      return res._embedded ? res._embedded.streets : [];
    case SearchEntities.postalAddresses:
    case SearchEntities.buildings:
      return res._embedded ? res._embedded.postalAddressDToes : [];
    default:
      return res.content || [res];
  }
};

export const mapPaginationFromResponse = (res, entity) => {
  switch (entity) {
    case SearchEntities.serviceAccess:
    case SearchEntities.activationCodes:
    case SearchEntities.serviceComponent:
    case SearchEntities.provisioningTags:
    case SearchEntities.streets:
    case SearchEntities.postalAddresses:
    case SearchEntities.buildings:
      return {page: res.page.number, totalElements: res.page.totalElements};
    default:
      return {page: res.number, totalElements: res.totalElements};
  }
};
export const performRetrieveLinkedNumber = res => {
  res.localPhoneNumber = res.number;
  return TecrepNumberService.search({localPhoneNumber: res.number}).then(numberDetails => {
    if (numberDetails && numberDetails.content && numberDetails.content[0]) {
      res.number = numberDetails.content[0].number;
    } else {
      res.number = '';
    }
  });
};
