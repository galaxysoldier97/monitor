import React from "react";
import DefaultTable from "../../../components/defaultTable/DefaultTable";
import {EquipmentAdminCategories} from "../../../config/equipment/EquipmentImportableProperties";
import {EquipmentWarehouseFields} from "../../../config/equipment/EquipmentWarehouseFields";
export default function WarehousePage(){

    return <DefaultTable
        columnHeader={EquipmentWarehouseFields}
        entity={EquipmentAdminCategories.WAREHOUSE}
        isFilterable={false}
        showEditButton
        showDeleteButton
    />;
}
