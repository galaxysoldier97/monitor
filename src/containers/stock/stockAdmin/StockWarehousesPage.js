import React from "react";
import DefaultTable from "../../../components/defaultTable/DefaultTable";
import {StockAdminCategories} from "../../../config/stock/StockImportableProperties";
import {WarehouseFields} from "../../../config/stock/WarehouseFields";
import {resourcesScopes} from "../../../config/resources/resourcesScopes";
import Auth from "../../../services/Auth";

export default function StockWarehousesPage(){
  const canUpdate = Auth.connectedUserHasPermission(resourcesScopes.stockAdmin.update);
  const canDelete = Auth.connectedUserHasPermission(resourcesScopes.stockAdmin.delete);

  return <DefaultTable
    columnHeader={WarehouseFields}
    entity={StockAdminCategories.WAREHOUSE}
    isFilterable={false}
    showDetailsButton={false}
    showEditButton={canUpdate}
    showDeleteButton={canDelete}
  />;
}
