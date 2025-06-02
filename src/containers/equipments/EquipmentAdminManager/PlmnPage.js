import React from "react";
import DefaultTable from "../../../components/defaultTable/DefaultTable";
import {EquipmentAdminCategories} from "../../../config/equipment/EquipmentImportableProperties";
import {PlmnFields} from "../../../config/equipment/PlmnFields";
export default function PlmnPage(){

  return <DefaultTable
    columnHeader={PlmnFields}
    entity={EquipmentAdminCategories.PLMN}
    showEditButton
    showDeleteButton
  />;
}
