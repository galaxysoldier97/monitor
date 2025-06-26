import React from 'react';
import { RessourcesAdministrationTabs } from "../../../types";
import BlockNumberPage from "./BlockNumberPage";
import JobResourcesPage from "./JobResourcesPage";
import DynamicTable from "../../../components/dynamicTable/DynamicTable";
import Auth from "../../../services/Auth";

export default function ResourcesAdminManagerPage() {
  const hasRoleBlock = Auth.connectedUserHasRole('ROLE_BLOCK');
  const hasRoleJob = Auth.connectedUserHasRole('ROLE_JOB');

  console.log('¿Tiene ROLE_BLOCK?', hasRoleBlock);
  console.log('¿Tiene ROLE_JOB?', hasRoleJob);

  const entityComponents = {};

  if (hasRoleBlock) {
    entityComponents[RessourcesAdministrationTabs.Block] = BlockNumberPage;
  }

  if (hasRoleJob) {
    entityComponents[RessourcesAdministrationTabs.Job] = JobResourcesPage;
  }

  console.log('Tabs configurados:', entityComponents);

  return (
    <DynamicTable
      navigation={'resourceAdmin.navigation'}
      title={'resourceAdmin.title'}
      options={entityComponents}
      importPath={'/importer/resourcesAdmin/import'}
    />
  );
}
