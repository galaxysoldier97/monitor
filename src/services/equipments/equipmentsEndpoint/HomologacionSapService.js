import axios from 'axios';
import {Backend} from '../../../data';
import Auth from '../../Auth';
import {APIformat} from '../../../helpers/entityMapper';

export const HomologacionSapEndpoint = {
  getAll,
  add,
  update,
  deleteById
};

export async function getAll(filter = {page: 0, size: 10}) {
  const params = new URLSearchParams({...filter}).toString();
  try {
    const response = await axios.get(`${Backend.equipments.homologacionMaterialSap.url}?${params}`, Auth.authorize());
    const {content, pageable, totalElements, totalPages} = response.data;
    return {rows: content, page: {number: pageable.pageNumber, size: pageable.pageSize, totalElements, totalPages}};
  } catch (error) {
    console.error('Error fetching homologacion material sap:', error);
    throw error;
  }
}

export async function add(item) {
  const mappedItem = APIformat(item);
  try {
    return await axios.post(Backend.equipments.homologacionMaterialSap.url, mappedItem, Auth.authorize());
  } catch (error) {
    console.error('Error adding homologacion material sap:', error);
    throw error;
  }
}

export async function update(item) {
  const mappedItem = APIformat(item);
  const {id} = mappedItem;
  try {
    const response = await axios.patch(`${Backend.equipments.homologacionMaterialSap.url}/${id}`, mappedItem, Auth.authorize());
    return response?.data?.content;
  } catch (error) {
    console.error(`Error updating homologacion material sap: ${id}`, error);
    throw error;
  }
}

export async function deleteById(id) {
  try {
    return await axios.delete(`${Backend.equipments.homologacionMaterialSap.url}/${id}`, Auth.authorize());
  } catch (error) {
    console.error(`Error deleting homologacion material sap: ${id}`, error);
    throw error;
  }
}
