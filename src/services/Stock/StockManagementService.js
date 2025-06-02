import axios from 'axios';
import { Backend } from '../../data';
import Auth from '../Auth';

export const getHandsetModels = (filters = {}, page = 0, size = 9999999) => {
  return axios.get(Backend.stock.handsetModels.url, {
    params: {
      page: page,
      size: size,
      ...filters
    }, ...Auth.authorize(),
  }).then(res => res.data);
};

export const addHandsetModel = item => {
  return axios.post(Backend.stock.handsetModels.url, {
    code: item.code,
    name: item.name,
    type: item.type,
    manufacturerName: item.manufacturer,
  }, Auth.authorize()).then(res => res.data);
};

export const updateHandsetModel = (code, item) => {
  const body = {
    code: item.code,
    name: item.name,
    type: item.type,
    manufacturerName: item.manufacturer,
  };
  return axios.patch(`${Backend.stock.handsetModels.url}/${code}`, body, Auth.authorize());
};

export const deleteHandsetModel = item => {
  return axios.delete(`${Backend.stock.handsetModels.url}/${item.code}`, Auth.authorize());
};

export const getHandsets = (filters = {}, page = 0, size = 9999999) => {
  return axios.get(Backend.stock.handsets.url, {
    params: {
      page,
      size,
      ...filters
    }, ...Auth.authorize(),
  })
  .then(res => res.data);
};

export const addHandset = (item) => {
  return axios.post(Backend.stock.handsets.url, {
    imei: item.imei,
    modelCode: item.model,
    orderId: item.orderId,
    packId: item.packId,
    status: item.status,
    warehouseCode: item.warehouse
  }, Auth.authorize())
  .then(res => res.data);
};

export const editHandset = updatedItem => {
  return axios.patch(`${Backend.stock.handsets.url}/${updatedItem.imei}`, {
    imei: updatedItem.imei,
    modelCode: updatedItem.model,
    orderId: updatedItem.orderId,
    packId: updatedItem.packId,
    status: updatedItem.status,
    warehouseCode: updatedItem.warehouse
  }, Auth.authorize())
  .then(res => res.data);
};

export const deleteHandset = item => {
  return axios.delete(`${Backend.stock.handsets.url}/${item.imei}`, Auth.authorize());
};
