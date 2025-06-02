import axios from 'axios';
import { Backend } from '../../data';
import Auth from '../Auth';


class PtoService {

  static searchRevisions(id) {
    return axios.get(Backend.address.ptos.url + '/' + id + '/revisions', {
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

export default PtoService;
