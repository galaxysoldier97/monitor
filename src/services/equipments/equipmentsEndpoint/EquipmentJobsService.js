import axios from "axios";
import {Backend} from "../../../data";
import Auth from "../../Auth";
import {APIformat} from "../../../helpers/entityMapper";
export const EquipmentJobsEndpoint = {
    getAll,
    add,
    update,
    deleteById
};
export async function getAll(filter = {page: 0, size: 10}) {
    const mappedFilter = APIformat(filter);
    const params = new URLSearchParams({...mappedFilter}).toString();

    try {
        const response = await axios.get(`${Backend.equipments.jobConfiguration.url}?${params}`, Auth.authorize());
        const {content, pageable, totalElements, totalPages} = response.data;
        return {rows:  content, page: {number: pageable.pageNumber, size: pageable.pageSize, totalElements, totalPages } };
    } catch (error) {
        console.error('Error fetching jobs:', error);
        throw error;
    }
}

export async function add(job) {
    const mappedJob = APIformat(job);

    try{
        return await axios.post(`${Backend.equipments.jobConfiguration.url}`, mappedJob, Auth.authorize());
    }catch (error) {
        console.error(`Error adding job`, error);
        throw error;
    }
}

export async function update(job){
    const mappedJob = APIformat(job);
    try{
        const response = await axios.patch(`${Backend.equipments.jobConfiguration.url}/${mappedJob.id}`, mappedJob, Auth.authorize());
        return response?.data?.content;
    }catch(error){
        console.error(`Error updating job: ${mappedJob?.id}`, error);
        throw error;
    }
}
export async function deleteById(jobId){
    try{
        return await axios.delete(`${Backend.equipments.jobConfiguration.url}/${jobId}`, Auth.authorize());
    }catch(error){
        console.error(`Error deleting job: ${jobId}`, error);
        throw error;
    }
}
