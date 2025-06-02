import React from "react";
import DefaultTable from "../../../components/defaultTable/DefaultTable";
import {EquipmentAdminCategories} from "../../../config/equipment/EquipmentImportableProperties";
import {InventoryPoolFields} from "../../../config/equipment/InventoryPoolFields";
export default function InventoryPoolPage(){

    return <DefaultTable
        columnHeader={InventoryPoolFields}
        entity={EquipmentAdminCategories.INVENTORY_POOL}
        isFilterable={false}
        showEditButton
        showDeleteButton
    />;
}
