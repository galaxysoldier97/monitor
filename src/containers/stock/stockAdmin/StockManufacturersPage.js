import React from "react";
import DefaultTable from "../../../components/defaultTable/DefaultTable";
import {StockAdminCategories} from "../../../config/stock/StockImportableProperties";
import {ManufacturerFields} from "../../../config/stock/ManufacturerFields";
import Auth from "../../../services/Auth";
import {resourcesScopes} from "../../../config/resources/resourcesScopes";

export default function StockManufacturersPage(){
  const canUpdate = Auth.connectedUserHasPermission(resourcesScopes.stockAdmin.update);
  const canDelete = Auth.connectedUserHasPermission(resourcesScopes.stockAdmin.delete);

  return <DefaultTable
    columnHeader={ManufacturerFields}
    entity={StockAdminCategories.MANUFACTURER}
    isFilterable={false}
    showDetailsButton={false}
    showEditButton={canUpdate}
    showDeleteButton={canDelete}
  />;
}
