import React from "react";
import DefaultTable from "../../../components/defaultTable/DefaultTable";
import {EquipmentAdminCategories} from "../../../config/equipment/EquipmentImportableProperties";
import {SimcardGenerationConfigFields} from "../../../config/equipment/SimcardGenerationConfigFields";
export default function SimcardGenerationPage(){

    return <DefaultTable
        columnHeader={SimcardGenerationConfigFields}
        entity={EquipmentAdminCategories.SIMCARD_GENERATION_CONFIGURATION}
        isFilterable={false}
        showDetailsButton
        showEditButton
        showDeleteButton
    />;
}
