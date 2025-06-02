import React, { useEffect, useState } from 'react';
import PageBase from '../../../components/PageBase';
import { t } from 'mt-react-library/functions';
import { Box, Grid } from '@material-ui/core';
import { InfoBloc } from '../../../components/InfoBloc';
import { ProvisioningTagActionsManagerPage } from './ProvisioningTagActionsManagerPage';
import { useLocation } from 'react-router-dom';
import TecrepProvisioningTagService from '../../../services/services/TecrepProvisioningTagService';
import { TplLoading } from 'mt-react-library/containers/templates';
import { getErrorMessage } from '../../../helpers/fetchHelper';
import { populateEntityInfoPageConfig } from '../../../helpers/entityHelper';
import { getServiceDisplayMapper } from '../../../helpers/entityMapper';
import { provisioningTagFields } from '../../../config/service/provisioningTag/provisioningTagFields';
import TagsAndCodesManagerTable from "../administration/TagsAndCodesManagerTable";

const ProvisioningTagInfoPage = () => {
  const [item, setItem] = useState({loading: true});
  const location = useLocation();
  const tagId = location.pathname.split('/')[2];
  const [tagCodes, setTagCodes] = useState([]);

  const fetch = () => {
    setItem({...item, loading: true, error: undefined});
    TecrepProvisioningTagService.getById(tagId)
    .then(res => {
      setTagCodes([res?.data?.tagCode]);
      setItem({loading: false, data: res.data});
    }).catch(err => setItem({loading: false, error: getErrorMessage(err)}));
  };

  useEffect(() => {
    fetch();
  }, []);

  if(!item.data) {
    return <TplLoading />;
  }

  return (
    <>
      <PageBase title={t('provisioningTag.info.title')} navigation={t('provisioningTag.info.navigation')} backButton>
        <Box marginY={4}>
          <Grid container spacing={2}>
            {populateEntityInfoPageConfig(provisioningTagFields).map(field => (
              <Grid item key={field.id} xs={12} sm={6} md={3}>
                <InfoBloc label={`service.${field.id}`} value={getServiceDisplayMapper(item.data, field.id)} />
              </Grid>
            ))}
          </Grid>
        </Box>
      </PageBase>
      <TagsAndCodesManagerTable controlled={false} predefinedValues={{tagCode: tagCodes?.[0], tagId: Number(tagId)}} />
      <ProvisioningTagActionsManagerPage controlled={false} tagId={Number(tagId)} />
    </>
  );
};

ProvisioningTagInfoPage.propTypes = {};

export default ProvisioningTagInfoPage;
