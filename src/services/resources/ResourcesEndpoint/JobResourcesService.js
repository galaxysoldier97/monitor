import axios from "axios";
import {Backend} from "../../../data";
import Auth from "../../Auth";
import {APIformat} from "../../../helpers/entityMapper";

export const JobResourcesEndPoint = {
    getAll,
    add,
    update,
    deleteById
};
export async function getAll(filter = {page: 0, size: 10}) {
    const mappedFilter = APIformat(filter);
    try {
        const response = await axios.get(`${Backend.resources.jobConfiguration.url}`, { params:
          mappedFilter, ...Auth.authorize()});
        const {content, pageable, totalElements, totalPages} = response.data;
        return {rows:  content, page: {number: pageable.pageNumber, size: pageable.pageSize, totalElements, totalPages } };
    } catch (error) {
        console.error('Error fetching job resource:', error);
        throw error;
    }
}

export async function add(job) {
    try{
        return await axios.post(`${Backend.resources.jobConfiguration.url}`, job, Auth.authorize());
    }catch (error) {
        console.error(`Error adding job resource`, error);
        throw error;
    }
}

export async function update(job){
  const mappedJob = APIformat(job);

  try{
    const response = await axios.patch(`${Backend.resources.jobConfiguration.url}/${mappedJob.id}`, mappedJob, Auth.authorize());
    return response?.data;
  }catch (error){
    console.error(`Error updating job resource`, error);
    throw error;
  }
}

export async function deleteById(jobId){
    try{
        return await axios.delete(`${Backend.resources.jobConfiguration.url}/${jobId}`, Auth.authorize());
    }catch(error){
        console.error(`Error deleting job resource: ${jobId}`, error);
        throw error;
    }
}
