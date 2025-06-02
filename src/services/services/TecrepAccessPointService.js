import axios from 'axios';
import { Backend } from '../../data';
import Auth from '../Auth';
import { cyclicGraph } from 'mt-react-library/functions';

class TecrepAccessPointService {

  static scroll(accessPointId, page = 0, size = 10) {
    return axios.get(Backend.address.buildingFlat.url + '/search/accespoint', {params: {page: page, size: size}, ...Auth.authorize()})
    .then(res => {
      if (!res.data._embedded || res.data._embedded.accessPointInstallationDToes.find(e => e.accessPointId === accessPointId)) {
        return TecrepAccessPointService.getService(accessPointId);
      }
      if (page + 1 <= res.data.page.totalPages && res.data.page.totalPages <= 200) {
        return TecrepAccessPointService.scroll(accessPointId, page + 1, size).then(res => Promise.resolve(res));
      }
      return TecrepAccessPointService.getService(accessPointId);
    });
  }

  static getService(accessPointId) {
    return axios.get(Backend.address.buildingFlat.url + '/pto/accesspoint/' + accessPointId, Auth.authorize())
    .then((res) => cyclicGraph(res.data));
  }

  static search(filter, page = 0, size = 10) {
    const params = {
      page: page,
      size: size,
      accessPointId: filter.accessPointId,
      ptoCode: filter.ptoCode,
      flatCode: filter.flatCode,
      buildingCode: filter.buildingCode,
      buildingName: filter.buildingName,
      blockNumber: filter.blockNumber,
      flatNumber: filter.flatNumber,
      floorNumber: filter.floorNumber,
    };
    return axios
      .get(Backend.address.buildingFlat.url + '/search/accespoint', {params, ...Auth.authorize()})
      .then(res => res.data);
  }
}

export default TecrepAccessPointService;
