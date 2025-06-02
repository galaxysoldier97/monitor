import axios from 'axios';
import Auth from '../../services/Auth';
import { Config } from '../../config';
import { BlockOperatorEnum } from '../../config/adresses/blockNumbers/blockOperator';

const RANGE_NUMBER_BASE_API = `${Config.tecrepApiResourcesUrl}/api/v1/private/auth/rangenumbers`;
const NUMBERS_BASE_API = `${Config.tecrepApiResourcesUrl}/private/auth/numbers`;

export default class TecrepRangeNumbersService {

  static search(filter, page, size) {
    return axios.get(RANGE_NUMBER_BASE_API + '/search', {
      params: {...filter, page, size},
      ...Auth.authorize(),
    })
    .then(res => res.data);
  }

  static get(rangeId) {
    return axios.get(`${RANGE_NUMBER_BASE_API}/${rangeId}`, Auth.authorize())
    .then(res => res.data);
  }

  static getNumbers(rangeId, page, size) {
    return axios.get(`${NUMBERS_BASE_API}/search?rangeId=${rangeId}&page=${page}&size=${size}`, Auth.authorize())
    .then(res => res.data);
  }

  static create(range) {
    return axios.post(RANGE_NUMBER_BASE_API, range, Auth.authorize());
  }

  static delete(rangeId) {
    return axios.delete(`${RANGE_NUMBER_BASE_API}/${rangeId}`, Auth.authorize());
  }

  static book(rangeId, zone, data, patch = false) {
    let endpoint;
    if (zone === BlockOperatorEnum.SYSTEM) {
      endpoint = patch ? `/${rangeId}/numbers/book` : `/${rangeId}/book`;
    } else if (zone === BlockOperatorEnum.EXTERNAL) {
      endpoint = patch ? `/${rangeId}/numbers/portIn` : `/${rangeId}/portIn`;
    } else {
      return Promise.reject('UNKNOWN_OPERATOR');
    }
    return axios.patch(RANGE_NUMBER_BASE_API + endpoint, data, Auth.authorize());
  }

  static lockOperator(rangeId, data, patch = false) {
    const endpoint = patch ? `/${rangeId}/numbers/lockOperator` : `/${rangeId}/lockOperator`;
    return axios.patch(RANGE_NUMBER_BASE_API + endpoint, data, Auth.authorize());
  }

  static updateNumberStatus(rangeId, action, number) {
    return axios.patch(
      `${RANGE_NUMBER_BASE_API}/${rangeId}/numbers/${action}`,
      {numbers: [number]},
      Auth.authorize(),
    );
  }

  static updateStatus(rangeId, action, orderId, serviceId) {
    return axios.patch(
      `${RANGE_NUMBER_BASE_API}/${rangeId}/${action}`,
      {
        ...(orderId ? {orderId} : {}),
        ...(serviceId ? {serviceId} : {}),
      },
      Auth.authorize(),
    );
  }

  static updateService(range, serviceId) {
    return axios.put(
      `${RANGE_NUMBER_BASE_API}/${range.rangeId}`,
      {
        extendedRange: range.extendedRange,
        mainRangeId: range.mainRange && range.mainRange.rangeId,
        serviceId
      },
      Auth.authorize(),
    );
  }

  static searchRevisions(rangeId, page = 0, size = 100) {
    return axios.get(`${RANGE_NUMBER_BASE_API}/${rangeId}/revisions`, {params: {page, size, sort: '__revisionNumber__,desc'}, ...Auth.authorize()})
    .then(res => res.data);
  }

  static edit(range) {
    return axios.patch(`${RANGE_NUMBER_BASE_API}/${range.rangeId}`,
      {
        extendedRange: range.extendedRange,
        mainRangeId: range.mainRangeId ? Number(range.mainRangeId) : null,
        orderId: range.orderId,
      },
      Auth.authorize());
  }

  static updateMainNumber(rangeId, mainNumber) {
    return axios.patch(
      `${RANGE_NUMBER_BASE_API}/${rangeId}`,
      {mainNumber}, Auth.authorize(),
    );
  }

}
