import axios from "axios";
import {Backend} from "../../../data";
import Auth from "../../Auth";

export const BlockEndPoint = {
    getAll,
    add,
    deleteById
};
export async function getAll(filter = {page: 0, size: 10}) {
    try {
        const response = await axios.get(`${Backend.resources.blockNumbers.url}/search`, { params:
            filter, ...Auth.authorize()});
        const {content, pageable, totalElements, totalPages} = response.data;
        return {rows:  content, page: {number: pageable.pageNumber, size: pageable.pageSize, totalElements, totalPages } };
    } catch (error) {
        console.error('Error fetching blocks:', error);
        throw error;
    }
}

export async function add(blockNumber) {
    try{
        return await axios.post(`${Backend.resources.blockNumbers.url}`, blockNumber, Auth.authorize());
    }catch (error) {
        console.error(`Error adding block number`, error);
        throw error;
    }
}

export async function deleteById(blockId){
    try{
        return await axios.delete(`${Backend.resources.blockNumbers.url}/${blockId}`, Auth.authorize());
    }catch(error){
        console.error(`Error deleting block: ${blockId}`, error);
        throw error;
    }
}
