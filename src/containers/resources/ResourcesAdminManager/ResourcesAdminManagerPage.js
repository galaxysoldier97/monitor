import React from 'react';
import { RessourcesAdministrationTabs } from "../../../types";
import BlockNumberPage from "./BlockNumberPage";
import JobResourcesPage from "./JobResourcesPage";
import DynamicTable from "../../../components/dynamicTable/DynamicTable";

export default function ResourcesAdminManagerPage() {
  const entityComponents = {
    [RessourcesAdministrationTabs.Block]: BlockNumberPage,
    [RessourcesAdministrationTabs.Job]: JobResourcesPage,
  };

  return (
    <DynamicTable
      navigation={'resourceAdmin.navigation'}
      title={'resourceAdmin.title'}
      options={entityComponents}
      importPath={'/importer/resourcesAdmin/import'}
    />
  );
}
