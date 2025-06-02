import React from 'react';
import PropTypes from 'prop-types';
import { provisioningTagFields } from '../../../config/service/provisioningTag/provisioningTagFields';
import { useFetchAccessTypes } from '../../../hooks/useFetchAccessTypes';
import { useFetchSrvActivities } from '../../../hooks/useFetchSrvActivities';
import DefaultTable from "../../../components/defaultTable/DefaultTable";
import {ServiceEntityTypes} from "../../../config/service/serviceTypes";
import {ROUTES} from "../../../config/routes";
import {resourcesScopes} from "../../../config/resources/resourcesScopes";
import Auth from "../../../services/Auth";

export default function ProvisioningTagManagerPage({columnHeader, overrideRows , predefinedValues, isFilterable = true, showAddButton = true, deleteButtonEnabled = true}){
  useFetchSrvActivities();
  useFetchAccessTypes({type: 'srv'});
  const header = columnHeader || provisioningTagFields;
  const showDetailsButton = Auth.connectedUserHasPermission(resourcesScopes.servicesAdmin.read);
  const showEditButton = Auth.connectedUserHasPermission(resourcesScopes.servicesAdmin.update);
  const showDeleteButton = Auth.connectedUserHasPermission(resourcesScopes.servicesAdmin.delete) && deleteButtonEnabled;

  return <DefaultTable
    columnHeader={header}
    entity={ServiceEntityTypes.PROVISIONING_TAGS}
    detailLink={ROUTES.provisioningTag.path}
    overrideRows={overrideRows}
    predefinedValues={predefinedValues}
    isFilterable={isFilterable}
    showAddButton = {showAddButton}
    showDetailsButton={showDetailsButton}
    showEditButton={showEditButton}
    showDeleteButton={showDeleteButton}
  />;
}

ProvisioningTagManagerPage.propTypes = {
  columnHeader: PropTypes.array,
  overrideRows: PropTypes.array,
  predefinedValues: PropTypes.func,
  isFilterable: PropTypes.bool,
  showAddButton: PropTypes.bool,
  deleteButtonEnabled: PropTypes.bool,
  valuesToDelete: PropTypes.array
};
