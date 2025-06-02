import axios from "axios";
import {Backend} from "../../../data";
import Auth from "../../Auth";
import {APIformat} from "../../../helpers/entityMapper";

export const WarehouseEndpoint = {
    getAll,
    add,
    update,
    deleteById
};
export async function getAll(filter = {page: 0, size: 10}) {
    const params = new URLSearchParams({...filter}).toString();

    try {
        const response = await axios.get(`${Backend.equipments.warehouses.url}?${params}`, Auth.authorize());
        const {content, pageable, totalElements, totalPages} = response.data;
        return {rows:  content, page: {number: pageable.pageNumber, size: pageable.pageSize, totalElements, totalPages } };
    } catch (error) {
        console.error('Error fetching warehouse:', error);
        throw error;
    }
}

export async function add(warehouse) {
    const mappedWarehouse = APIformat(warehouse);
    try{
        return await axios.post(Backend.equipments.warehouses.url, mappedWarehouse, Auth.authorize());
    }catch (error) {
        console.error(`Error adding warehouse: `, error);
        throw error;
    }
}

export async function update(warehouse){
    const mappedWarehouse = APIformat(warehouse);
    const { id } = mappedWarehouse;

    try{
        const response = await axios.put(`${Backend.equipments.warehouses.url}/${id}`, mappedWarehouse, Auth.authorize());
        return response?.data?.content;
    }catch(error){
        console.error(`Error updating warehouse: ${id}`, error);
        throw error;
    }
}
export async function deleteById(warehouseId){
    try{
        return await axios.delete(`${Backend.equipments.warehouses.url}/${warehouseId}`, Auth.authorize());
    }catch(error){
        console.error(`Error deleting warehouse: ${warehouseId}`, error);
        throw error;
    }
}
