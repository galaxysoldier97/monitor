import React from 'react';
import ProvisioningTagManagerPage from '../ProvisioningTagManager/ProvisioningTagManagerPage';
import ActivationCodeManagerPage from './ActivationCodeManagerPage';
import { ServiceAdministrationTabs } from "../../../types";
import ServiceJobAdminManagerPage from "./ServiceJobAdminManagerPage";
import ProvisioningProductManagerPage from "./ProvisioningProductManagerPage";
import DynamicTable from "../../../components/dynamicTable/DynamicTable";
export default function ServiceAdminManagerPage(){
  const entityComponents = {
    [ServiceAdministrationTabs.ProvisioningProduct]: ProvisioningProductManagerPage,
    [ServiceAdministrationTabs.ProvisioningTag]: ProvisioningTagManagerPage,
    [ServiceAdministrationTabs.CodeActivation]: ActivationCodeManagerPage,
    [ServiceAdministrationTabs.Job]: ServiceJobAdminManagerPage,
  };

  return (
    <DynamicTable
      title={'serviceAdmin'}
      navigation={'serviceAdmin.navigation'}
      importPath={'/importer/servicesAdmin/import'}
      options={entityComponents}
    />
  );
}
