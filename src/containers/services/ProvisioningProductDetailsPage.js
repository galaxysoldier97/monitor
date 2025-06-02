import React, {useState, useEffect} from 'react';
import  InfoGrid  from "../../components/infoGrid/InfoGrid";
import {useParams} from "react-router-dom";
import TableFrame from "../../components/tableFrame/TableFrame";
import {ProvisioningProductEndpoint} from "../../services/services/ServicesEndpoint/ProvisioningProductService";
import {ProvisioningProductFields} from "../../config/service/ProvisioningProductFields";
import ProvisioningTagActionParametersTable from "./ProvisioningTagManager/ProvisioningTagActionParametersTable";
import {useFetchSrvActivities} from "../../hooks/useFetchSrvActivities";
import ProvisioningTagManagerPage from "./ProvisioningTagManager/ProvisioningTagManagerPage";
import {provisioningTagFields} from "../../config/service/provisioningTag/provisioningTagFields";
import {useTranslation} from "react-i18next";
export default function ProvisioningProductDetailsPage() {
  const { t } = useTranslation();
  const { provisioningProductId, tagActionId } = useParams();
  const [provisioningProduct, setProvisioningProduct] = useState({});
  const [countTableRerenders, setCountTableRerenders] = useState(0);

  useFetchSrvActivities();

  useEffect(() => {
    ProvisioningProductEndpoint.getById(tagActionId, provisioningProductId)
      .then((response) => {
        const { provAction, ...rest} = response;
        setProvisioningProduct({ ...rest, ...provAction});
      })
      .catch((error) => {
        throw error;
      });
  }, [tagActionId, provisioningProductId, countTableRerenders]);

  function handleRerender(){
    setCountTableRerenders(countTableRerenders + 1);
  }

  return(
    <>
      <InfoGrid
        title={t('provisioningProduct.info.title')}
        navigation={t('provisioningProduct.info.navigation')}
        headers={ProvisioningProductFields}
        values={provisioningProduct}
      />
      <TableFrame title={t('provisioningTag.title')} importable={false}>
        {provisioningProduct?.provisioningTag &&
          <ProvisioningTagManagerPage
            columnHeader={provisioningTagFields.filter(item => item.id !== "nature" && item.id !== "persistent")}
            handleRerender={handleRerender}
            overrideRows={[provisioningProduct?.provisioningTag]}
            showAddButton={false}
            isFilterable={false}
            deleteButtonEnabled={false}
          />}
      </TableFrame>
      <ProvisioningTagActionParametersTable
        predefinedValues={{tagActionId: provisioningProduct.tagActionId, provisioningProductId}}
        handleRerender={handleRerender}
        overrideRows={provisioningProduct?.provActionParameters}/>
    </>);
}
