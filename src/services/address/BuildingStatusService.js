import axios from 'axios';
import { Backend } from '../../data';
import Auth from '../Auth';


class BuildingStatusService {

  static searchRevisions(id) {
    return axios.get(Backend.address.buildingStatus.url + '/' + id + '/revisions', {
      params: {
        page: 0,
        size: 100,
        sort: '__revisionNumber__,desc',
      }, ...Auth.authorize(),
    })
    .then((res) => res.data)
    .catch((err) => Promise.reject(err));
  }

}

export default BuildingStatusService;
