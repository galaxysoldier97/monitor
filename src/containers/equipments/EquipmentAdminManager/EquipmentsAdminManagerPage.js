import React from 'react';
import {EquipmentsAdminTabs} from "../../../config/equipment/EquipmentsAdminTabs";
import DynamicTable from "../../../components/dynamicTable/DynamicTable";
import PlmnPage from "./PlmnPage";
import ProviderPage from "./ProviderPage";
import EquipmentModelPage from "./EquipmentModelPage";
import WarehousePage from "./WarehousePage";
import InventoryPoolPage from "./InventoryPoolPage";
import SimcardGenerationPage from "./SimcardGenerationPage";
import ConfigurationFilePage from "./ConfigurationFilePage";
import EquipmentJobPage from "./EquipmentJobPage";

export default function EquipmentsAdminManagerPage() {

    const entityComponents = {
        [EquipmentsAdminTabs.PLMN]: PlmnPage,
        [EquipmentsAdminTabs.PROVIDER]: ProviderPage,
        [EquipmentsAdminTabs.EQUIPMENT_MODEL]: EquipmentModelPage,
        [EquipmentsAdminTabs.WAREHOUSE]: WarehousePage,
        [EquipmentsAdminTabs.INVENTORY_POOL]: InventoryPoolPage,
        [EquipmentsAdminTabs.SIMCARD_GENERATION_CONFIGURATION]: SimcardGenerationPage,
        [EquipmentsAdminTabs.FILE_CONFIGURATION]: ConfigurationFilePage,
        [EquipmentsAdminTabs.JOB_EQUIPMENT]: EquipmentJobPage
    };

    return (
        <DynamicTable
            navigation={'equipmentsAdmin.navigation'}
            title={'equipmentAdmin.title'}
            options={entityComponents}
            importPath={'/importer/equipmentsAdmin/import'}
        />
    );
}
