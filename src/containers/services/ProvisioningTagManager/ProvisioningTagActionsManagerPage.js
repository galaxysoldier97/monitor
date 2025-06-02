import React from 'react';
import PropTypes from 'prop-types';
import { actionsHeader } from '../../../config/service/provisioningTag/actionsHeader';
import TableFrame from "../../../components/tableFrame/TableFrame";
import DefaultTable from "../../../components/defaultTable/DefaultTable";
import {ServiceEntityTypes} from "../../../config/service/serviceTypes";
import {useTranslation} from "react-i18next";
import {ROUTES} from "../../../config/routes";


export const ProvisioningTagActionsManagerPage = ({ tagId }) => {
  const { t } = useTranslation();

  return (
      <TableFrame title={t('provisioningTag.actions.title')} importable={false}>
        <DefaultTable
            columnHeader={actionsHeader}
            entity={ServiceEntityTypes.PROVISIONING_TAG_ACTION}
            predefinedValues={{ tagId }}
            detailLink={ROUTES.provTagActionParameter.path}
            isControlled
            isFilterable={false}
            showDetailsButton={true}
            showEditButton={false}
            showDeleteButton={true}
        />
      </TableFrame>
  );
};

ProvisioningTagActionsManagerPage.propTypes = {
  tagId: PropTypes.number,
};
