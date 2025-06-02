import axios from 'axios';
import Auth from './Auth';
import { Backend } from '../data';

class ImportHistoryService {
  static search(action, category) {
    let params = new URLSearchParams(action.filter).toString();
    const pagination = action.pagination ? `page=${action.pagination.number}&size=${action.pagination.size}&` : '';
    let sort = 'sort=id,desc';
    return axios.get(Backend[category].import.url + '/history/search?' + params + '&' + pagination + sort, Auth.authorize())
    .then(res => res.data);
  }

  static getLast(category) {
    return axios.get(Backend[category].import.url + '/history/last', Auth.authorize())
    .then((res) => res.data);
  }

  static getById(id, category) {
    return axios.get(Backend[category].import.url + '/history/' + id, Auth.authorize())
    .then(res => res.data);
  }

  static deleteLast(category) {
    return axios.delete(Backend[category].import.url + '/history/last', Auth.authorize())
    .then(res => res.data);
  }
}

export default ImportHistoryService;
