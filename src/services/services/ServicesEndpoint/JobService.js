import axios from "axios";
import {Config} from "../../../config";
import Auth from "../../Auth";
import {APIformat} from "../../../helpers/entityMapper";
export const JobServiceEndPoint = {
  getAll,
  update,
  deleteById,
  add,
};
export async function getAll(filter) {
  const mappedFilter = APIformat(filter);
  const queryParams = new URLSearchParams(mappedFilter).toString();
  try {
    const response = await axios.get(`${Config.tecrepApiServicesUrl}/api/v1/private/auth/job/configuration?${queryParams}`, Auth.authorize());
    const {content, pageable} = response.data;
    return {rows: content, page: {size: pageable.size, totalElements: pageable.totalElements, number: pageable.number} };
  } catch (error) {
    console.error('Error fetching service jobs:', error);
    throw error;
  }
}
export async function add(job) {
  const mappedJob = APIformat(job);
  try{
    return await axios.post(`${Config.tecrepApiServicesUrl}/api/v1/private/auth/job/configuration`, mappedJob, Auth.authorize());
  }catch (error) {
    console.error(`Error adding service job`, error);
    throw error;
  }
}
export async function update(job){
  const mappedJob = APIformat(job);
  try{
    const response = await axios.patch(`${Config.tecrepApiServicesUrl}/api/v1/private/auth/job/configuration/${mappedJob?.id}`, mappedJob, Auth.authorize());
    return response?.data?.content;
  }catch(error){
    console.error(`Error updating service job: ${mappedJob?.id}`, error);
    throw error;
  }
}
export async function deleteById(jobId){
  try{
    return await axios.delete(`${Config.tecrepApiServicesUrl}/api/v1/private/auth/job/configuration/${jobId}`, Auth.authorize());
  }catch(error){
    console.error(`Error deleting service job: ${jobId}`, error);
    throw error;
  }
}

