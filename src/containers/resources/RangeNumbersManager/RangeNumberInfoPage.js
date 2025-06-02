import React, { useEffect, useState } from 'react';
import { Box, Grid } from '@material-ui/core';
import { useLocation } from 'react-router-dom';
import { TplEnhancedTable, TplLoading } from 'mt-react-library/containers/templates';
import { t } from 'mt-react-library/functions';
import Snackbar from '@material-ui/core/Snackbar';
import PageBase from '../../../components/PageBase';
import { InfoBloc } from '../../../components/InfoBloc';
import { RequestState } from '../../../helpers/requestState';
import TecrepRangeNumbersService from '../../../services/resources/TecrepRangeNumbersService';
import { rangeNumberListHeader, rangeNumbersFields } from '../../../config/resources/rangeNumbers/rangeNumbersFields';
import { numberFields } from '../../../config/resources/number/numberFields';
import { populateEntityInfoPageConfig } from '../../../helpers/entityHelper';
import { getNumberDisplayMapper, getRangeNumberDisplayMapper } from '../../../helpers/entityMapper';
import AddNumbersIntoRangeWizard from './AddNumbersIntoRangeWizard';
import EmptyComponent from '../../../components/EmptyComponent';
import { ErrorAlert } from '../../../components/ErrorAlert';
import RangeNumberActions from './RangeNumberActions';
import NumberActions from './NumberActions';

const RangeNumberInfoPage = () => {
  const location = useLocation();
  const [range, setRange] = useState();
  const [numbers, setNumbers] = useState([]);
  const [numbersPagination, setNumbersPagination] = useState({number: 0, size: 10});
  const [fetchRequestState, setFetchRequestState] = useState(RequestState.progress);
  const [numbersRequestState, setNumbersRequestState] = useState(RequestState.progress);
  const [notification, setNotification] = useState({message: '', show: false});
  const rangeId = location.pathname.split('/')[2];

  const fetchNumbers = () => {
    TecrepRangeNumbersService.getNumbers(rangeId, numbersPagination.number, numbersPagination.size)
    .then(response => {
      setNumbers(response._embedded.numbers);
      setNumbersPagination({...numbersPagination, totalElements: response.page.totalElements});
      setNumbersRequestState(RequestState.success);
    })
    .catch(() => setNumbersRequestState(RequestState.error));
  };

  const fetchRange = () => {
    TecrepRangeNumbersService.get(rangeId)
    .then(response => {
      setRange(response);
      setFetchRequestState(RequestState.success);
      if (response.numbers.length > 0) {
        fetchNumbers();
      } else {
        setNumbers([]);
        setNumbersPagination({...numbersPagination, totalElements: 0, number: 0});
        setNumbersRequestState(RequestState.success);
      }
    })
    .catch(() => setFetchRequestState(RequestState.error));
  };

  useEffect(fetchRange, [rangeId, numbersPagination.number, numbersPagination.size]);

  const onNumberAdded = () => {
    setNotification({message: t('rangeNumbers.addNumberWizard.addNumberSuccess'), show: true});
    fetchRange();
  };

  const onOperatorLocked = () => {
    setNotification({message: t('rangeNumbers.addNumberWizard.lockOperatorSuccess'), show: true});
    fetchRange();
  };

  const onRangeAction = message => {
    setNotification({message, show: true});
    fetchRange();
  };

  const rowMapper = item => {
    const mapped = {...item};
    numberFields.forEach(field => mapped[field.id] = getNumberDisplayMapper(item, field.id));
    mapped.actions = <NumberActions rangeId={range.rangeId} number={item} onRangeAction={onRangeAction} />;
    return [mapped, {}];
  };

  return (
    <>
      <PageBase
        title={t('rangeNumbers.details.title')}
        navigation={t('rangeNumbers.details.navigation')}
        actionButton={!!range && <RangeNumberActions range={range} onRangeAction={onRangeAction} detailsPage />}
        backButton>
        <Box marginY={4}>
          {fetchRequestState === RequestState.progress && <TplLoading />}
          {fetchRequestState === RequestState.error && <ErrorAlert retry={fetchRange} />}
          {fetchRequestState === RequestState.success && (
            <Grid container spacing={2}>
              {populateEntityInfoPageConfig(rangeNumbersFields).map(field => (
                <Grid item key={field.id} xs={12} sm={6} md={3}>
                  <InfoBloc label={`rangeNumbers.${field.id}`} value={getRangeNumberDisplayMapper(range, field.id)} />
                </Grid>
              ))}
            </Grid>
          )}
        </Box>
      </PageBase>
      {fetchRequestState === RequestState.success && range && (
        <PageBase
          title={t('rangeNumbers.details.numbersInRange')}
          actionButton={numbers.length > 0 && <AddNumbersIntoRangeWizard range={range} onNumberAdded={onNumberAdded} onOperatorLocked={onOperatorLocked} extend />}>
          {range.numbers.length === 0 && (
            <Box textAlign="center" marginY={4}>
              <EmptyComponent message={t('rangeNumbers.details.emptyNumbers')} marginY={1} />
              <AddNumbersIntoRangeWizard range={range} onNumberAdded={onNumberAdded} onOperatorLocked={onOperatorLocked} />
            </Box>
          )}
          {numbersRequestState === RequestState.progress && <TplLoading />}
          {numbersRequestState === RequestState.error && <ErrorAlert retry={fetchNumbers} />}
          {numbersRequestState === RequestState.success && range.numbers.length > 0 && (
            <TplEnhancedTable
              rows={numbers}
              rowMapper={rowMapper}
              headers={rangeNumberListHeader}
              paginationDefault={numbersPagination}
              onPageChange={setNumbersPagination}
              controlled
              pageable
            />
          )}
        </PageBase>
      )}
      <Snackbar open={notification.show} message={notification.message} autoHideDuration={4000} onClose={() => setNotification({...notification, show: false})} />
    </>
  );
};

export default RangeNumberInfoPage;
