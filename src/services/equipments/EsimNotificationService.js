import axios from 'axios';
import {Backend} from '../../data';
import Auth from '../Auth';

const mapIdToParams = equipmentId => {
  return {
    equipmentId: equipmentId
  };
};

class EsimNotificationService {

  static searchEsimNotification(equipmentId, page = 0, size = 10) {
    return axios.get(Backend.equipments.eSimNotification.url, {
      params: {
        page,
        size,
        ...mapIdToParams(equipmentId)
      }, ...Auth.authorize(),
    })
      .then(res => res.data);
  }
}

export default EsimNotificationService;
