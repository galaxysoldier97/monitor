import React, {useEffect, useState} from "react";
import PropTypes from 'prop-types';
import Auth from "../../../services/Auth";
import {resourcesScopes} from "../../../config/resources/resourcesScopes";
import DefaultTable from "../../../components/defaultTable/DefaultTable";
import {ServiceEntityTypes} from "../../../config/service/serviceTypes";
import {ROUTES} from "../../../config/routes";
import {useParams} from "react-router-dom";
import {AssociatedProvisioningTagFields} from "../../../config/service/provisioningTag/AssociatedProvisioningTagFields";
import TableFrame from "../../../components/tableFrame/TableFrame";
import {TagsAndCodesFields} from "../../../config/service/TagsAndCodesFields";
import {useProvisioningTagFields} from "../../../hooks/useProvisioningTagFields";
import {useTranslation} from "react-i18next";

export default function AssociatedProvisioningTagsTable({serviceData}){
  const { t } = useTranslation();
  const { serviceId } = useParams();
  const [serviceKey, setServiceKey] = useState(serviceId);
  const [predefinedValues, setPredefinedValues] = useState({serviceId: serviceId});
  const { activity , category } = serviceData;
  const [rerenderTable, setRerenderTable] = useState(1);
  useProvisioningTagFields(activity, category);

  useEffect(() => {
    setPredefinedValues({...predefinedValues, serviceId: serviceId});
    setServiceKey(serviceId);
    handleRerender();
  }, [serviceId]);

  function handleRerender(){
    setRerenderTable(rerenderTable + 1);
  }

  return(
  <>
    <TableFrame title={t('associatedProvisioningTag.title')} importable={false}>
      <DefaultTable
        key={serviceKey}
        columnHeader={AssociatedProvisioningTagFields}
        entity={ServiceEntityTypes.ASSOCIATED_PROVISIONING_TAGS}
        detailLink={ROUTES.provisioningTag.path}
        isFilterable={false}
        isPageable={false}
        predefinedValues={predefinedValues}
        showDetailsButton={Auth.connectedUserHasPermission(resourcesScopes.servicesAdmin.read)}
        showEditButton={false}
        showDeleteButton={Auth.connectedUserHasPermission(resourcesScopes.servicesAdmin.delete)}
        hasRerendered={handleRerender}
      />
    </TableFrame>
    <TableFrame title={t('activationCode.title')} importable={false}>
        <DefaultTable
          key={rerenderTable}
          columnHeader={TagsAndCodesFields}
          entity={ServiceEntityTypes.ASSOCIATED_ACTIVATION_CODES}
          showAddButton={false}
          predefinedValues={{serviceId}}
          isFilterable={false}
          isPageable={false}
          showDetailsButton={false}
          showEditButton={false}
          showDeleteButton={false}/>
    </TableFrame>
  </>
  );
}

AssociatedProvisioningTagsTable.propTypes = {
  serviceData: PropTypes.object
};
