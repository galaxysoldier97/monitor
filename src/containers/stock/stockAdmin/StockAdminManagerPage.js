import React from 'react';
import DynamicTable from "../../../components/dynamicTable/DynamicTable";
import StockWarehousesPage from "./StockWarehousesPage";
import StockManufacturersPage from "./StockManufacturersPage";
import {StockAdminTabs} from "../../../config/stock/StockAdminTabs";

export default function StockAdminManagerPage(){
  const entityComponents = {
    [StockAdminTabs.Warehouse]: StockWarehousesPage,
    [StockAdminTabs.Manufacturer]: StockManufacturersPage
  };

  return (
    <DynamicTable
      title={'stock.admin.title'}
      navigation={'stock.admin.navigation'}
      importPath={'/importer/stockAdmin/import'}
      options={entityComponents}
    />
  );
}
