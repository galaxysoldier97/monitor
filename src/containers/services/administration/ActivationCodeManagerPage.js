import React from 'react';
import {ActivationCodeFields} from "../../../config/service/ActivationCodeFields";
import DefaultTable from "../../../components/defaultTable/DefaultTable";
import {ServiceEntityTypes} from "../../../config/service/serviceTypes";
import Auth from "../../../services/Auth";
import {resourcesScopes} from "../../../config/resources/resourcesScopes";

export default function ActivationCodeManagerPage(){
  const showDetailsButton = false;
  const showEditButton = Auth.connectedUserHasPermission(resourcesScopes.servicesAdmin.update);
  const showDeleteButton = Auth.connectedUserHasPermission(resourcesScopes.servicesAdmin.delete);

  return <DefaultTable
            columnHeader={ActivationCodeFields}
            entity={ServiceEntityTypes.ACTIVATION_CODE}
            showDetailsButton={showDetailsButton}
            showEditButton={showEditButton}
            showDeleteButton={showDeleteButton}
  />;
}
