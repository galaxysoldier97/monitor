import axios from 'axios';
import { Config } from '../config';
import Auth from './Auth';

export class ProductCatalogService {
  static fetch(params = {}) {
    return axios.get(
      `${Config.apiProductCatalog}/api/v1/offers`,
      {
        params,
        ...Auth.authorize(),
      },
    ).then(response => response.data);
  }
}
