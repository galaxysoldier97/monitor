import {useFetchSrvActivities} from "./useFetchSrvActivities";
import {useFetchAccessTypes} from "./useFetchAccessTypes";
import {useEffect} from "react";
import {ProvisioningTagsEndPoint} from "../services/services/ServicesEndpoint/ProvisioningTagService";
import {AssociatedProvisioningTagFields} from "../config/service/provisioningTag/AssociatedProvisioningTagFields";

export function useProvisioningTagFields(activity, category){
  useFetchSrvActivities();
  useFetchAccessTypes({type: 'srv'});
  useEffect(() => {
    const fetch = async () => {
      try {
        const activationCodesValues = await ProvisioningTagsEndPoint.getTagCodes(activity, category);
        AssociatedProvisioningTagFields.find(t => t.id === 'tagCode').values = activationCodesValues;
      } catch (error){
        console.error(error);
      }
    };
    fetch();
  }, [activity, category]);
}
