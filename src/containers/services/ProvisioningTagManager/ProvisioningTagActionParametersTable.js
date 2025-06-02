import React from "react";
import PropTypes from "prop-types";
import {ServiceEntityTypes} from "../../../config/service/serviceTypes";
import TableFrame from "../../../components/tableFrame/TableFrame";
import {actionParametersFields} from "../../../config/service/provisioningTag/actionParametersFields";
import DefaultTable from "../../../components/defaultTable/DefaultTable";
import AddTagActionForm from "./AddTagActionForm";
import {useTranslation} from "react-i18next";
export default function ProvisioningTagActionParametersTable({predefinedValues, overrideRows, handleRerender}){
  const { t } = useTranslation();

  return(
    <>
      <TableFrame title={t('provisioningTag.action.parameter.title')} importable={false}>
        {overrideRows && <DefaultTable
            columnHeader={actionParametersFields}
            entity={ServiceEntityTypes.PROVISIONING_TAG_ACTION_PARAMETERS}
            AddActionButton={AddTagActionForm}
            predefinedValues={predefinedValues}
            overrideRows={overrideRows}
            hasRerendered={handleRerender}
            isFilterable={false}
            isPageable={false}
            showDetailsButton={false}
            showEditButton={false}
            showDeleteButton={true}/>}
      </TableFrame>
    </>
  );
}
ProvisioningTagActionParametersTable.propTypes = {
  overrideRows: PropTypes.array,
  predefinedValues: PropTypes.object,
  handleRerender: PropTypes.func
};
