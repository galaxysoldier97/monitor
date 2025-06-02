import React, { useEffect, useState } from 'react';
import { t } from 'mt-react-library/functions';
import PageBase from '../../../components/PageBase';
import TecrepStreetService from '../../../services/address/TecrepStreetService';
import { Box, Grid } from '@material-ui/core';
import { TplLoading } from 'mt-react-library/containers/templates';
import { ErrorAlert } from '../../../components/ErrorAlert';
import { StreetAddressDetailsPage } from './StreetAddressDetailsPage';
import { InfoBloc } from '../../../components/InfoBloc';
import { populateEntityInfoPageConfig } from '../../../helpers/entityHelper';
import { streetsHeader } from '../../../config/adresses/postalAddress/adressesAdministration';
import { useLocation } from 'react-router-dom';

const StreetDetailsPage = () => {
  const location = useLocation();
  const streetId = location.pathname.split('/')[2] || null;
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState();
  const [street, setStreet] = useState();

  const fetchStreet = () => {
    TecrepStreetService
    .getStreetDetails(streetId)
    .then(setStreet)
    .catch(setError)
    .finally(() => setLoading(false));
  };

  useEffect(fetchStreet, [streetId]);

  return (
    <>
      <PageBase navigation={t('addressAdmin.streetDetail.navigation')} title={t('addressAdmin.streetDetail.title', street && street.streetName)} backButton>
        <Grid container direction="column" spacing={4}>
          {loading ? <Grid item><TplLoading /></Grid>
            : <Grid item>
              {error || !street ? <ErrorAlert message={error.message} />
                : <Box marginY={4}>
                  <Grid container spacing={2}>
                    {populateEntityInfoPageConfig(streetsHeader).map(field => <Grid item key={field.id} xs={12} sm={6} md={3}>
                      <InfoBloc label={`street.info.details.${field.id}`} value={street[field.id]} />
                    </Grid>)}
                  </Grid>
                </Box>}
            </Grid>}
        </Grid>
      </PageBase>
      {streetId && <StreetAddressDetailsPage streetId={streetId} />}
    </>
  );
};

StreetDetailsPage.propTypes = {};
export default StreetDetailsPage;
