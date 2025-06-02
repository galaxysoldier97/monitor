import axios from 'axios';
import Auth from '../Auth';
import {Backend} from "../../data";
class TecrepEquipmentModelService {
  static getModels(filters = {}, page = 0, size = 9999999) {
    const params = new URLSearchParams({...filters, page, size}).toString();
    return axios.get(`${Backend.equipments.equipmentModel.url}?${params}`, Auth.authorize())
    .then(res => res.data).catch(() => []);
  }
}

export default TecrepEquipmentModelService;
