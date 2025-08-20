import React from "react";
import DefaultTable from "../../../components/defaultTable/DefaultTable";
import {EquipmentAdminCategories} from "../../../config/equipment/EquipmentImportableProperties";
import {StandardLoadsFields} from "../../../config/equipment/StandardLoadsFields";

export default function StandardLoadsPage(){
  return <DefaultTable
    columnHeader={StandardLoadsFields}
    entity={EquipmentAdminCategories.STANDARD_LOADS}
    isFilterable={false}
    showEditButton
    showDeleteButton={false}
  />;
}
