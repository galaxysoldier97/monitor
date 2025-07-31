import React from 'react';
import DefaultTable from '../../../components/defaultTable/DefaultTable';
import {EquipmentAdminCategories} from '../../../config/equipment/EquipmentImportableProperties';
import {HomologacionSapFields} from '../../../config/equipment/HomologacionSapFields';
import AddHomologacionSapForm from './AddHomologacionSapForm';
import EditHomologacionSapForm from './EditHomologacionSapForm';


export default function HomologacionSapPage(){
  return (
    <DefaultTable
      columnHeader={HomologacionSapFields}
      entity={EquipmentAdminCategories.HOMOLOGACION_SAP}
      isFilterable={false}
      showEditButton
      showDeleteButton={false}
      AddActionButton={AddHomologacionSapForm}
      EditActionComponent={EditHomologacionSapForm}
    />
  );
}
