import React from "react";
import DefaultTable from "../../../components/defaultTable/DefaultTable";
import {EquipmentAdminCategories} from "../../../config/equipment/EquipmentImportableProperties";
import {EquipmentJobFields} from "../../../config/equipment/EquipmentJobFields";
export default function EquipmentJobPage(){

    return <DefaultTable
        columnHeader={EquipmentJobFields}
        entity={EquipmentAdminCategories.JOB_EQUIPMENT}
        showDetailsButton
        showEditButton
        showDeleteButton
    />;
}
