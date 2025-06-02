import React, {useCallback, useEffect, useState} from 'react';
import PageBase from '../../../components/PageBase';
import {Box, Grid} from '@material-ui/core';
import {TplLoading} from 'mt-react-library/containers/templates';
import {t} from 'mt-react-library/functions';
import AncillaryEquipmentManagerPage from '../AncillaryEquipmentManager/AncillaryEquipmentManagerPage';
import {InfoBloc} from '../../../components/InfoBloc';
import {SIMCardActions} from './SIMCardActions';
import {populateEntityInfoPageConfig} from '../../../helpers/entityHelper';
import {getSimCardDisplayMapper} from '../../../helpers/entityMapper';
import {simCardFields} from '../../../config/equipment/simCard/simCardFields';
import {useFetchSimCardConfigs} from '../../../hooks/useFetchSimCardConfigs';
import {useLocation} from 'react-router-dom';
import {getErrorMessage, performRetrieveLinkedNumber} from '../../../helpers/fetchHelper';
import TecrepSimCardService from '../../../services/equipments/TecrepSimCardService';
import {ErrorAlert} from '../../../components/ErrorAlert';
import {shouldUseLocalNumbers} from '../../../config/company';

const SimCardInfoPage = () => {
  useFetchSimCardConfigs();
  const [item, setItem] = useState({loading: true});
  const location = useLocation();
  const id = location.pathname.split('/')[2];

  const fetch = useCallback(() => {
    setItem({...item, loading: true, error: undefined});
    TecrepSimCardService.getSimCard(id)
      .then(res => {
        if (shouldUseLocalNumbers()) {
          performRetrieveLinkedNumber(res).then(() => {
            setItem({loading: false, data: res});
          });
        } else {
          setItem({loading: false, data: res});
        }
      })
      .catch(err => setItem({loading: false, error: getErrorMessage(err)}));
  }, [id]);

  useEffect(fetch, [fetch]);

  return (
    <>
      <PageBase title={t('simcard.info.title')}
                navigation={t('simcard.info.navigation')}
                actionButton={!!item.data &&
                  <SIMCardActions filteredSim={item.data} mapped={item.data} onActionPerformed={fetch}/>}
                backButton>
        {item.error && <ErrorAlert message={item.error}/>}
        {item.loading && !item.error && <TplLoading/>}
        {!item.loading && !item.error && <Box marginY={4}>
          <Grid container spacing={2}>
            {populateEntityInfoPageConfig(simCardFields).map(field => <Grid item key={field.id} xs={12} sm={6} md={3}>
                <InfoBloc label={`simcard.${field.id}`} value={getSimCardDisplayMapper(item.data, field.id)}/>
              </Grid>,
            )}
          </Grid>
        </Box>}
      </PageBase>
      {item.data && <AncillaryEquipmentManagerPage filteredEq/>}
    </>
  );
};

SimCardInfoPage.propTypes = {};

export default SimCardInfoPage;
