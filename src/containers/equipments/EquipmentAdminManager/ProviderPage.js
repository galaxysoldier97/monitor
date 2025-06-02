import React from "react";
import DefaultTable from "../../../components/defaultTable/DefaultTable";
import {EquipmentAdminCategories} from "../../../config/equipment/EquipmentImportableProperties";
import {ProviderFields} from "../../../config/equipment/ProviderFields";
import {useFetchAccessTypes} from "../../../hooks/useFetchAccessTypes";
export default function ProviderPage(){
    useFetchAccessTypes({type:'eqm'});

    return <DefaultTable
        columnHeader={ProviderFields}
        entity={EquipmentAdminCategories.PROVIDER}
        isFilterable={false}
        showEditButton
        showDeleteButton
    />;
}
