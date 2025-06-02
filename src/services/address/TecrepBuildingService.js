import axios from 'axios';
import { Backend } from '../../data';
import Auth from '../Auth';

class TecrepBuildingService {

  /**
   * Get building
   * @returns {Promise}
   */
  static getBuildings() {
    return axios.get(Backend.address.postalAddress.url + '/search' + '?page=0&size=9999999', Auth.authorize())
    .then(res => res.data);
  }

  static searchPostalAddress(buildingCode, buildingName, streetNumber, district ,streetQualifier, streetName, sector, buildingBlock, buildingType, isEndpointPostalAddress, page = 0, size = 10) {
    return axios.get(Backend.address.postalAddress.url + '/search', {
      params: {
        page,
        size,
        buildingCode,
        buildingName,
        streetNumber,
        district,
        streetQualifier,
        streetName,
        sector,
        buildingBlock,
        buildingType,
        isEndpointPostalAddress,
      }, ...Auth.authorize(),
    })
    .then(res => res.data);
  }

  static searchAddress(streetNumber, streetQualifier, streetName, sector, page = 0, size = 10) {
    return axios.get(Backend.address.address.url + '/search', {
      params: {
        page: page,
        size: size,
        streetNumber: streetNumber,
        streetQualifier: streetQualifier,
        streetName: streetName,
        sector: sector,
      }, ...Auth.authorize(),
    })
    .then(res => res.data);
  }

  static searchBuildingFlats(buildingId, buildingCode, flatCode, page = 0, size = 10) {
    return axios.get(Backend.address.buildingFlat.url + '/search', {
      params: {
        page: page,
        size: size,
        buildingId: buildingId,
        buildingCode: buildingCode,
        flatCode: flatCode,
      }, ...Auth.authorize(),
    })
    .then(res => res.data);
  }

  static searchRevisions(id) {
    return axios.get(Backend.address.buildings.url + '/' + id + '/revisions', {
      params: {
        page: 0,
        size: 100,
        sort: '__revisionNumber__,desc',
      }, ...Auth.authorize(),
    })
    .then(res => res.data);
  }

  static getPostalAddress(postalAddressId) {
    return axios.get(Backend.address.postalAddress.url + '/' + postalAddressId, Auth.authorize())
    .then(res => res.data);
  }

  static updateBuilding(building) {
    return axios.patch(
      Backend.address.buildings.url + '/' + building.buildingId, building, Auth.authorize());
  }

  static addBuilding(building, addressId) {
    return axios.post(Backend.address.buildings.url, {
      ...building,
      addressId,
      mainFlag: true,
    }, Auth.authorize());
  }

  static addBuildingStatus(buildingStatus) {
    return axios.post(Backend.address.buildingStatus.url, buildingStatus, Auth.authorize());
  }

  static addBuildingFlat(buildingFlat) {
    return axios.post(Backend.address.buildingFlat.url, buildingFlat, Auth.authorize());
  }

  static addPostalAddress(postalAddress, addressId) {
    return axios.post(Backend.address.postalAddress.url + '/addressId/' + addressId, postalAddress, Auth.authorize());
  }

  static deletePostalAddress(postalAddressId) {
    return axios.delete(Backend.address.postalAddress.url + '/' + postalAddressId, Auth.authorize());
  }

  static updateDeploymentStatus(buildingStatus) {
    return axios.put(Backend.address.buildingStatus.url + '/' + buildingStatus.deploymentStatusId, buildingStatus, Auth.authorize());
  }

  static updateBuildingFlat(buildingFlat) {
    return axios.put(Backend.address.buildingFlat.url + '/' + buildingFlat.buildingFlatId, buildingFlat, Auth.authorize());
  }

  static deleteBuildingFlat(buildingFlatId) {
    return axios.delete(Backend.address.buildingFlat.url + '/' + buildingFlatId, Auth.authorize());
  }

  static deleteDeploymentStatus(buildingStatusId) {
    return axios.delete(Backend.address.buildingStatus.url + '/' + buildingStatusId, Auth.authorize());
  }

  static deleteBuilding(buildingId) {
    return axios.delete(Backend.address.buildings.url + '/' + buildingId, Auth.authorize());
  }

  static getBuilding(buildingId) {
    return axios.get(Backend.address.buildings.url + '/' + buildingId, Auth.authorize())
    .then(res => res.data);
  }

  static getBuildingFlat(buildingFlatId) {
    return axios.get(Backend.address.buildingFlat.url + '/' + buildingFlatId, Auth.authorize())
    .then(res => res.data);
  }

  static getBuildingFlatPto(ptoId) {
    return axios.get(Backend.address.buildingFlat.url + '/pto/' + ptoId, Auth.authorize())
    .then(res => res.data);
  }

  static addBuildingFlatPto(sentDto, buildingFlatId) {
    return axios.post(Backend.address.buildingFlat.url + '/' + buildingFlatId + '/pto', sentDto, Auth.authorize());
  }

  static updateBuildingFlatPto(sentDto, buildingFlatId) {
    return axios.put(Backend.address.buildingFlat.url + '/' + buildingFlatId + '/pto/' + sentDto.ptoTechnicalId, sentDto, Auth.authorize());
  }

  static deleteBuildingFlatPto(sentDto, buildingFlatId) {
    return axios.delete(Backend.address.buildingFlat.url + '/' + buildingFlatId + '/pto/' + sentDto.ptoTechnicalId, Auth.authorize());
  }

  static addBuildingFlatPtoAccessPoint(sentDto, ptoId, buildingFlatId) {
    return axios.post(Backend.address.buildingFlat.url + '/' + buildingFlatId + '/pto/' + ptoId + '/accessPoint', sentDto, Auth.authorize());
  }

  static updateBuildingFlatPtoAccessPoint(sentDto, buildingFlatId, ptoId, accessPointId) {
    return axios.put(Backend.address.buildingFlat.url + '/' + buildingFlatId + '/pto/' + ptoId + '/accessPoint/' + accessPointId, sentDto, Auth.authorize());
  }

  static deleteBuildingFlatPtoAccessPoint(buildingFlatId, ptoId, sendDto) {
    return axios.delete(Backend.address.buildingFlat.url + '/' + buildingFlatId + '/pto/' + ptoId + '/accessPoint/' + sendDto.accessPointTechnicalId, Auth.authorize());
  }

  static getBuildingFlatPtoAccessPoint(accessPointId) {
    return axios.get(Backend.address.buildingFlat.url + '/pto/accesspoint/' + accessPointId, Auth.authorize())
    .then(res => res.data);
  }
}

export default TecrepBuildingService;
