import React, { PropTypes, useCallback, useEffect, useState } from 'react';
import PageBase from '../../../components/PageBase';
import { TplLoading } from 'mt-react-library/containers/templates';
import { t } from 'mt-react-library/functions';
import { Box, Grid } from '@material-ui/core';
import { NumberActions } from './NumberActions';
import { InfoBloc } from '../../../components/InfoBloc';
import { numberFields } from '../../../config/resources/number/numberFields';
import { populateEntityInfoPageConfig } from '../../../helpers/entityHelper';
import { getNumberDisplayMapper } from '../../../helpers/entityMapper';
import { useFetchNumberConfigs } from '../../../hooks/useFetchNumberConfigs';
import { useLocation } from 'react-router-dom';
import TecrepNumberService from '../../../services/resources/TecrepNumberService';
import { ErrorAlert } from '../../../components/ErrorAlert';
import { getErrorMessage } from '../../../helpers/fetchHelper';

const NumberInfoPage = () => {
  const [item, setItem] = useState({loading: true});
  const location = useLocation();
  const numberId = location.pathname.split('/')[2];

  const fetchNumber = useCallback(() => {
    setItem({...item, loading: true, error: undefined});
    TecrepNumberService.getNumber(numberId)
    .then(res => setItem({loading: false, data: res || []}))
    .catch(err => setItem({loading: false, error: getErrorMessage(err)}));
  }, [numberId]);

  useEffect(fetchNumber, [location.key]);

  useFetchNumberConfigs();
  const infoConfig = [...populateEntityInfoPageConfig(numberFields), {id: 'intervalNumber'}];

  return (
    <PageBase title={t('number.info.title')} navigation={t('number.info.navigation')} backButton actionButton={item.data && <NumberActions filteredNumber={item.data} mapped={item.data} onActionPerform={fetchNumber} />}>
      {item.error && <ErrorAlert message={item.error} />}
      {item.loading && !item.error && <TplLoading />}
      {!item.loading && !item.error && <Box marginY={4}>
        <Grid container spacing={2}>
          {infoConfig.map(field => <Grid item key={field.id} xs={12} sm={6} md={3}>
              <InfoBloc label={`number.${field.id}`} value={getNumberDisplayMapper(item.data, field.id)} />
            </Grid>,
          )}
        </Grid>
      </Box>}
    </PageBase>
  );
};

NumberInfoPage.propTypes = {
  item: PropTypes.shape({
    events: PropTypes.arrayOf(PropTypes.string),
    intervalNumber: PropTypes.shape({
      blockNumber: PropTypes.object,
      firstNumber: PropTypes.number,
      intervalId: PropTypes.number,
      lastNumber: PropTypes.number,
      numberOfRange: PropTypes.number,
    }),
    inventoryPoolCode: PropTypes.string,
    nature: PropTypes.string,
    number: PropTypes.string,
    numberId: PropTypes.number,
    orderId: PropTypes.string,
    packId: PropTypes.string,
    rangeNumber: PropTypes.object,
    serviceId: PropTypes.number,
    status: PropTypes.string,
    swapReason: PropTypes.string,
    vanityCategory: PropTypes.string,
  }),
};

export default NumberInfoPage;
