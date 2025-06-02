import React, { useCallback, useEffect, useState } from 'react';
import { TplLoading } from 'mt-react-library/containers/templates';
import { t } from 'mt-react-library/functions';
import PageBase from '../../../components/PageBase';
import { populateEntityInfoPageConfig } from '../../../helpers/entityHelper';
import { ErrorAlert } from '../../../components/ErrorAlert';
import TecrepIpAddressesService from '../../../services/resources/TecrepIpAddressesService';
import { ipAddressesFields } from '../../../config/resources/ipAddresses/ipAddressesFields';
import { useLocation } from 'react-router-dom';
import { Box, Grid } from '@material-ui/core';
import { InfoBloc } from '../../../components/InfoBloc';
import { getCommonDisplayMapper } from '../../../helpers/entityMapper';
import { IpAddressesActions } from './IpAddressesActions';

const IpAddressInfoPage = () => {
  const [ipAddress, setIpAddress] = useState({loading: true});
  const location = useLocation();
  const ipAddressId = location.pathname.split('/')[2];

  const fetchIpAddress = useCallback(() => {
    setIpAddress({...ipAddress, loading: true, error: undefined});
    TecrepIpAddressesService.find(ipAddressId)
      .then(res => setIpAddress({loading: false, data: res}))
      .catch(err => setIpAddress({loading: false, error: err.response.data.message || err.response.data.errorMessage || err.response.data.error || t('error.title')}));
  }, [ipAddressId]);

  useEffect(() => fetchIpAddress(), [fetchIpAddress]);

  const actionButton = ipAddress.data && <IpAddressesActions ipAddress={ipAddress.data} afterEdit={fetchIpAddress} infoPage />;

  return (
    <PageBase title={t('ipAddresses.details.title')} navigation={t('ipAddresses.details.navigation')} actionButton={actionButton} backButton>
      {ipAddress.error && <ErrorAlert message={ipAddress.error} />}
      {ipAddress.loading && !ipAddress.error && <TplLoading />}
      {!ipAddress.loading && !ipAddress.error && <Box marginY={4}>
          <Grid container spacing={2}>
            {populateEntityInfoPageConfig(ipAddressesFields).map(field => <Grid item key={field.id} xs={12} sm={6} md={3}>
                <InfoBloc label={`ipAddresses.${field.id}`} value={getCommonDisplayMapper(ipAddress.data, field.id)} />
              </Grid>,
            )}
          </Grid>
        </Box>}
    </PageBase>
  );
};

IpAddressInfoPage.propTypes = {};

export default IpAddressInfoPage;
