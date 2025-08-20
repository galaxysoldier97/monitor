import axios from 'axios';
import {Backend} from '../../../data';
import Auth from '../../Auth';
import {APIformat} from '../../../helpers/entityMapper';

export const StandardLoadsEndpoint = {
  getAll,
  add,
  update,
};

export async function getAll(filter = {page: 0, size: 10}) {
  const params = new URLSearchParams({...filter}).toString();
  try {
    const response = await axios.get(`${Backend.equipments.standardLoads.url}?${params}`, Auth.authorize());
    const {content, pageable, totalElements, totalPages} = response.data;
    return {rows: content, page: {number: pageable.pageNumber, size: pageable.pageSize, totalElements, totalPages}};
  } catch (error) {
    console.error('Error fetching standard loads:', error);
    throw error;
  }
}

export async function add(item) {
  const mappedItem = APIformat(item);
  try {
    return await axios.post(Backend.equipments.standardLoads.url, mappedItem, Auth.authorize());
  } catch (error) {
    console.error('Error adding standard load:', error);
    throw error;
  }
}

export async function update(item) {
  const mappedItem = APIformat(item);
  const {id} = mappedItem;
  try {
    const response = await axios.put(`${Backend.equipments.standardLoads.url}/${id}`, mappedItem, Auth.authorize());
    return response?.data?.content;
  } catch (error) {
    console.error(`Error updating standard load: ${id}`, error);
    throw error;
  }
}
