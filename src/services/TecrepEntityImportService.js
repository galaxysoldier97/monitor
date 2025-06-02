import axios from 'axios';
import { Backend } from '../data';
import { encodeURIComponentObject } from 'mt-react-library/functions';
import Auth from './Auth';

class TecrepEntityImportService {

  static progress(tag, entityCategory) {
    return axios.get(Backend[entityCategory].import.url + '/' + tag, Auth.authorize())
    .then((res) => res)
    .catch((err) => Promise.reject(err));
  }

  static reset(tag, entityCategory) {
    return axios.post(Backend[entityCategory].import.url + '/' + tag, {}, Auth.authorize())
    .then((res) => res)
    .catch((err) => Promise.reject(err));
  }

  /**
   * Upload an entity import file
   * @param {String} entityCategory
   * @param {String} entity
   * @param {File} file
   * @param {Object} importParams
   * @returns {Promise}
   */
  static upload(entityCategory, entity, file, importParams) {
    const formData = new FormData();
    if (file) {
      formData.append('file', file);
    }
    delete importParams.file;
    const headers = {'Content-Type': 'multipart/form-data'};
    return axios.post(Backend[entityCategory].import.url + '/' + entity + '/start?' + encodeURIComponentObject(importParams), formData, Auth.authorize(headers));
  }
}

export default TecrepEntityImportService;
