import axios from 'axios';
import { Backend } from '../../data';
import Auth from '../Auth';

class PostalAddressService {

  static getPostalAddress(postalAddressId) {
    return axios.get(Backend.address.postalAddress.url + '/' + postalAddressId, Auth.authorize())
    .then((res) => res.data);
  }

  static searchRevisions(id) {
    return axios.get(Backend.address.postalAddress.url + '/' + id + '/revisions', {
      params: {
        page: 0,
        size: 100,
        sort: '__revisionNumber__,desc',
      }, ...Auth.authorize(),
    })
    .then((res) => res.data);
  }

}

export default PostalAddressService;
