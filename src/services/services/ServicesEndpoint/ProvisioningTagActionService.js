import axios from "axios";
import {Backend} from "../../../data";
import Auth from "../../Auth";

export const ProvisioningTagActionEndpoint = {
    getAll,
    add,
    deleteById,
};
export async function getAll(filter) {
    const { tagId } = filter;
    try {
        const response = await axios.get(`${Backend.services.provisioningActions.url}/provisioningtag/${tagId}`, Auth.authorize());
        const rows = response.data.content.map(r => {return {...r, tagId};});
        return { rows:  rows };
    } catch (error) {
        console.error('Error fetching the specified provisioning product', error);
        throw error;
    }
}
export async function add(provisioningTag) {
    try{
        return await axios.post(Backend.services.provisioningActions.url, provisioningTag, Auth.authorize());
    }catch (error) {
        console.error(`Error adding provisioning tag action`, error);
        throw error;
    }
}

export async function deleteById(item){
    const { tagActionId } = item;
    try{
        return await axios.delete(`${Backend.services.provisioningActions.url}/${tagActionId}`, Auth.authorize());
    }catch(error){
        console.error(`Error deleting provisioning tag action`, error);
        throw error;
    }

}


