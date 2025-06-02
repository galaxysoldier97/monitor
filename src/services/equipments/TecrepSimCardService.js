import axios from 'axios';
import {Backend} from '../../data';
import Auth from '../Auth';
import {Config} from '../../config';
import {UpdateWizardType} from "../../config/UpdateWizardType";
import { removeUnsetValuesFromFilter } from '../../helpers/exportHelper';

function prepareEdit(simcard) {
  return {...simcard, warehouseName: simcard?.warehouse?.name};
}

function prepareAdd(simcard) {
  return {...simcard,
    providerName: simcard?.provider?.name,
    plmnCode: simcard?.plmn?.code,
    warehouseName: simcard?.warehouse?.name,
    inventoryPoolCode: simcard?.inventoryPool?.code,
  };
}

function mapFilterToParams(filter) {
  return {
    ...filter,
    sn: filter?.serialNumber,
    imsi: filter?.imsiNumber,
    imsisn: filter.imsiSponsorNumber,
    provider: filter.provider ? filter.provider.name || filter.provider : undefined,
    warehouse: filter.warehouse ? filter.warehouse.name || filter.warehouse : undefined,
    order: filter?.orderAssociated,
    service: filter?.serviceAssociated,
    inventoryPoolCode: filter?.inventoryPool?.code
  };
}

class TecrepSimCardService {
  static search(filter, page = 0, size = 10) {
    return axios.get(Backend.equipments.simcards.url, {
      params: {
        page,
        size,
        ...mapFilterToParams(filter)
      }, ...Auth.authorize(),
    })
      .then(res => res.data);
  }

  static scroll(id, page = 0, size = 10) {
    return axios.get(Backend.equipments.simcards.url, {
      params: {
        page: page,
        size: size
      }, ...Auth.authorize()
    })
      .then(res => {
        if (!res.data.content || res.data.content.find(e => e.id === id)) {
          return TecrepSimCardService.getSimCard(id);
        }
        if (page + 1 <= res.data.totalPages && res.data.totalPages <= 200) {
          return TecrepSimCardService.scroll(id, page + 1, size).then(resScroll => Promise.resolve(resScroll));
        }
        return TecrepSimCardService.getSimCard(id);
      });
  }

  static getSimCard(id) {
    return axios.get(Backend.equipments.simcards.url + '/' + id, Auth.authorize())
      .then(res => res.data);
  }

  static addSimCard(simcard) {
    return axios.post(Backend.equipments.simcards.url, prepareAdd(simcard), Auth.authorize());
  }

  static editSimCard(simcard) {
    return axios.put(Backend.equipments.simcards.url + '/' + simcard.id, prepareEdit(simcard), Auth.authorize());
  }

  static changeSimCard(current, previous) {
    let prepared = {};
    switch (current.type) {
      case UpdateWizardType.STATUS:
        prepared = {
          transition: current.status || '',
          params: {
            serviceId: current.service ? current.service.serviceId : undefined,
            orderId: current.orderId ? current.orderId : undefined
          },
        };
        return axios.patch(Backend.equipments.simcards.url + '/' + previous.id + '/' + prepared.transition, prepared.params, Auth.authorize());
      case UpdateWizardType.SERVICE:
        prepared = Object.assign(prepareEdit(previous), {
          serviceId: current.service ? current.service.serviceId : null,
          orderId: current.orderId ? current.orderId : undefined
        });
        return axios.patch(Backend.equipments.simcards.url + '/' + previous.id, prepared, Auth.authorize());
    }
  }

  static deleteSimCard(simCard) {
    return axios.delete(Backend.equipments.simcards.url + '/' + simCard.id, Auth.authorize());
  }

  static searchRevisions(id) {
    return axios.get(Backend.equipments.simcards.url + '/' + id + '/revisions', {
      params: {
        page: 0,
        size: 100,
        sort: '__revisionNumber__,desc'
      }, ...Auth.authorize()
    })
      .then(res => res.data);
  }

  static export(params) {
    return axios.post(Config.tecrepApiInventoryIntegrationStfUrl + '/private/auth/inventory/export/simcards', params, Auth.authorize())
      .then(res => res.data);
  }

  static getBatches(page, size) {
    return axios.get(Backend.equipments.batches.url, {
      params: {
        page,
        size,
        sort: 'batchNumber,desc'
      }, ...Auth.authorize()
    })
      .then(res => res.data);
  }

  static launchPrepaySimcardImport(batchNumber) {
    return axios.patch(`${Config.tecrepApiEquipmentsUrl}/private/auth/simcards/import/batch/${batchNumber}`, {}, Auth.authorize());
  }

  static returnedDate(batchNumber) {
    return axios.patch(`${Config.tecrepApiEquipmentsUrl}/private/auth/batch/${batchNumber}/return`, {}, Auth.authorize());
  }

  static downloadGeneratedFile(fileName) {
    return axios.get(`${Config.tecrepApiInventoryIntegrationStfUrl}/private/auth/inventory/export/simcards/${fileName}`, Auth.authorize());
  }

  static uploadReturnedFile(batchNumber, file) {
    if (file) {
      let formData = new FormData();
      formData.append('file', file);
      const headers = {'Content-Type': 'multipart/form-data'};
      return axios.post(`${Config.tecrepApiEquipmentsUrl}/private/auth/batch/${batchNumber}/upload-import`, formData, Auth.authorize(headers));
    } else {
      return Promise.reject(new Error('File not found'));
    }
  }

  static deleteReturnedFile(batchNumber) {
    return axios.delete(`${Config.tecrepApiEquipmentsUrl}/api/v2/private/auth/batch/${batchNumber}/delete-import`, Auth.authorize());
  }

  static downloadReturnedFile(batchNumber) {
    return axios.get(`${Config.tecrepApiEquipmentsUrl}/private/auth/batch/${batchNumber}/download-import`, Auth.authorize());
  }

  static exportSimCards(filters) {
    const headers = {'Content-Type': 'blob'};
    const config = {method: 'GET', responseType: 'arraybuffer', headers};
    const mappedFilters = mapFilterToParams(filters);
    removeUnsetValuesFromFilter(mappedFilters);
    const urlFilters = new URLSearchParams(mappedFilters).toString();
    return axios.get(`${Backend.equipments.simcards.url}/export?${urlFilters}`, {...config, ...Auth.authorize()});
  }
}

export default TecrepSimCardService;
