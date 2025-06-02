import React from "react";
import DefaultTable from "../../../components/defaultTable/DefaultTable";
import {EquipmentAdminCategories} from "../../../config/equipment/EquipmentImportableProperties";
import {ConfigurationFileFields} from "../../../config/equipment/ConfigurationFileFields";
export default function ConfigurationFilePage(){

    return <DefaultTable
        columnHeader={ConfigurationFileFields}
        entity={EquipmentAdminCategories.FILE_CONFIGURATION}
        isFilterable={false}
        showEditButton
        showDeleteButton
    />;
}
