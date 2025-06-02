import React from "react";
import DefaultTable from "../../../components/defaultTable/DefaultTable";
import {EquipmentAdminCategories} from "../../../config/equipment/EquipmentImportableProperties";
import {EquipmentModelFields} from "../../../config/equipment/EquipmentModelFields";
import {useFetchAccessTypes} from "../../../hooks/useFetchAccessTypes";
import {useFetchProviders} from "../../../hooks/useFetchProviders";
export default function EquipmentModelPage(){
  useFetchAccessTypes({type:'eqm'});
  useFetchProviders();

  return <DefaultTable
    columnHeader={EquipmentModelFields}
    entity={EquipmentAdminCategories.EQUIPMENT_MODEL}
    isFilterable={false}
    showEditButton
    showDeleteButton
  />;
}
