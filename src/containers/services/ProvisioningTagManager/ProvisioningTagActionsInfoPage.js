import React, { useEffect, useState } from 'react';
import { t } from 'mt-react-library/functions';
import TecrepProvisioningTagService from '../../../services/services/TecrepProvisioningTagService';
import InfoGrid from "../../../components/infoGrid/InfoGrid";
import {actionsHeader} from "../../../config/service/provisioningTag/actionsHeader";
import {useHistory} from "react-router-dom";
import ProvisioningProductManagerPage from "../administration/ProvisioningProductManagerPage";
import TableFrame from "../../../components/tableFrame/TableFrame";
import ProvisioningTagActionParametersTable from "./ProvisioningTagActionParametersTable";
import {ProvisioningProductFields} from "../../../config/service/ProvisioningProductFields";

export default function ProvisioningTagActionsInfo(){
  const history = useHistory();
  const currentLocation = history.location.pathname;
  const tagActionId = currentLocation.split('/')[4] || null;
  const [tagAction, setTagAction] = useState({});
  const [countTableRerenders, setCountTableRerenders] = useState(0);

  useEffect(() => {
    const fetchTagAction = () => {
      TecrepProvisioningTagService
        .getProvTagDetails(tagActionId)
        .then(response => {
          const { provActionParameters, ...rest } = response;
          const actionParameters = provActionParameters.map(p => {return {parameterValue: p.parameterValue, ...p.technicalParameter};});
          setTagAction({...rest, actionParameters});
        }).catch(err => console.error("Imposible to fetch the specified provisioning tag details", err));
    };
    fetchTagAction();
  }, [countTableRerenders]);

  function handleRerender(){
    setCountTableRerenders(countTableRerenders + 1);
  }

  return (
    <>
      <InfoGrid
        title={t('provisioningTag.action.info.title', tagAction?.tagAction)}
        navigation={t('provisioningTag.action.info.navigation')}
        headers={actionsHeader.filter(a => a.infoPage)}
        values={tagAction}
      />
      <TableFrame title={t('provisioningProduct.title')} importable={false}>
        <ProvisioningProductManagerPage
          columnHeader={ProvisioningProductFields.filter(p => p.id !== 'tagCode' && p.id !== 'tagAction' && p.id !== 'serviceAction')}
          showAddButton={true}
          isFilterable={false}
          predefinedValues={{tagActionId}}/>
      </TableFrame>
      <ProvisioningTagActionParametersTable
        predefinedValues={{tagActionId}}
        overrideRows={tagAction?.actionParameters}
        handleRerender={handleRerender}/>
    </>
  );
}
