import axios from 'axios';
import { Config } from '../../config';
import Auth from '../Auth';

export class AllotmentService {
  static list(batchNumber) {
    return axios.get(
      `${Config.tecrepApiEquipmentsUrl}/private/auth/allotments/batch/${batchNumber}`,
      {
        params: {size: 10000, sort: 'allotmentId,desc'},
        ...Auth.authorize(),
      },
    ).then(response => response.data.content);
  }

  static generate(batchNumber, allotmentType, quantity, offerCode, firstSerialNumber, packWithHandset, pricePlan, initialCredit) {
    const data = {
      batchNumber, allotmentType, quantity,
      firstSerialNumber: firstSerialNumber || undefined,
      offerName: offerCode,
      packWithHandset,
      pricePlan: pricePlan || undefined,
      initialCredit: initialCredit === '' ? undefined : initialCredit
    };
    return axios.post(
      `${Config.tecrepApiInventoryIntegrationUrl}/private/auth/inventory/allotment`,
      data,
      Auth.authorize(),
    ).then(response => response.data);
  }

  static export(allotmentId, fileConfigurationName) {
    return axios.post(
      `${Config.tecrepApiEquipmentsUrl}/private/auth/allotments/export`,
      {allotmentId, fileConfigurationName},
      Auth.authorize(),
    );
  }

  static getFileConfigurations() {
    return axios.get(
      `${Config.tecrepApiEquipmentsUrl}/private/auth/fileConfiguration`,
      {
        ...Auth.authorize(),
      },
    ).then(response => response.data.content);
  }
}
