import React from "react";
import PropTypes from 'prop-types';
import {ServiceEntityTypes} from "../../../config/service/serviceTypes";
import DefaultTable from "../../../components/defaultTable/DefaultTable";
import Auth from "../../../services/Auth";
import {resourcesScopes} from "../../../config/resources/resourcesScopes";
import {ProvisioningProductFields} from "../../../config/service/ProvisioningProductFields";
import {ROUTES} from "../../../config/routes";
export default function ProvisioningProductManagerPage({columnHeader, predefinedValues, isFilterable = true, showAddButton = false}){

  const showDetailsButton = Auth.connectedUserHasPermission(resourcesScopes.servicesAdmin.read);
  const showEditButton = false;
  const showDeleteButton = Auth.connectedUserHasPermission(resourcesScopes.servicesAdmin.delete);

  return <DefaultTable
            columnHeader={columnHeader || ProvisioningProductFields}
            entity={ServiceEntityTypes.PROVISIONING_PRODUCT}
            detailLink={ROUTES.provisioningProductDetails.path}
            isFilterable={isFilterable}
            predefinedValues={predefinedValues}
            showAddButton={showAddButton}
            showDetailsButton={showDetailsButton}
            showEditButton={showEditButton}
            showDeleteButton={showDeleteButton}
  />;
}

ProvisioningProductManagerPage.propTypes = {
  columnHeader: PropTypes.array,
  predefinedValues: PropTypes.object,
  isFilterable: PropTypes.bool,
  showAddButton: PropTypes.bool
};
