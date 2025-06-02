import React from "react";
import {JobServiceFields} from "../../../config/service/JobServiceFields";
import {ServiceEntityTypes} from "../../../config/service/serviceTypes";
import DefaultTable from "../../../components/defaultTable/DefaultTable";
import Auth from "../../../services/Auth";
import {resourcesScopes} from "../../../config/resources/resourcesScopes";
import {useFetchSrvActivities} from "../../../hooks/useFetchSrvActivities";
export default function ServiceJobAdminManagerPage(){
  useFetchSrvActivities();

  const showDetailsButton = Auth.connectedUserHasPermission(resourcesScopes.servicesAdmin.read);
  const showEditButton = Auth.connectedUserHasPermission(resourcesScopes.servicesAdmin.update);
  const showDeleteButton = Auth.connectedUserHasPermission(resourcesScopes.servicesAdmin.delete);

  return <DefaultTable
            columnHeader={JobServiceFields}
            entity={ServiceEntityTypes.JOBS}
            showDetailsButton={showDetailsButton}
            showEditButton={showEditButton}
            showDeleteButton={showDeleteButton}
  />;
}
