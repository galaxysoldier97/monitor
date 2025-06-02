import React, { PropTypes, useEffect, useState } from 'react';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import { t } from 'mt-react-library/functions';
import { TplEnhancedTable, TplLoading } from 'mt-react-library/containers/templates';
import TecrepNumberService from '../../../services/resources/TecrepNumberService';
import { RequestState } from '../../../helpers/requestState';
import { numberVanityCategory } from '../../../config/resources/number/numberVanityCategory';
import { BlockOperatorEnum } from '../../../config/adresses/blockNumbers/blockOperator';
import { NumberStatusValuesEnum } from '../../../config/resources/number/numberStatus';
import { ErrorAlert } from '../../../components/ErrorAlert';
import { getNumberDisplayMapper } from '../../../helpers/entityMapper';

const AddNumbersIntoRangeWizardForm3 = ({values, onChange, operator, continuousDisplay}) => {
  const [numbers, setNumbers] = useState();
  const [pagination, setPagination] = useState({number: 0, size: 10, totalElements: 0});
  const [filter, setFilter] = useState({});
  const [fetchRequestState, setFetchRequestState] = useState(RequestState.progress);

  const fetchNumbers = (switchPage) => {
    if (!switchPage) {
      setFetchRequestState(RequestState.progress);
    }
    const params = {
      system: operator === BlockOperatorEnum.SYSTEM ? "true" : "false",
      status: operator === BlockOperatorEnum.SYSTEM
        ? NumberStatusValuesEnum.AVAILABLE
        : NumberStatusValuesEnum.PORTEDIN,
      ...filter,
    };
    TecrepNumberService.search(params, pagination.number, pagination.size)
    .then(data => {
      setNumbers(data.content || []);
      setFetchRequestState(RequestState.success);
      setPagination({...pagination, totalElements: data.totalElements});
    })
    .catch(() => setFetchRequestState(RequestState.error));
  };

  useEffect(() => {
    if (continuousDisplay) {
      return;
    }
    const firstCall = !!numbers;
    setTimeout(() => fetchNumbers(firstCall), firstCall ? 0 : 500);
  }, [pagination.size, pagination.number, filter]);

  const rowMapper = item => {
    const rangeId = getNumberDisplayMapper(item, 'rangeId');
    return [{...item, rangeId}, {}];
  };

  return continuousDisplay
    ? (
      <Grid container spacing={1} alignItems="center">
        <Grid item xs={12}>
          <Typography variant="body1">{t('rangeNumbers.addNumberWizard.continuousRangeDescription')}</Typography>
        </Grid>
        <Grid item xs={12}>
          <TextField name="firstNumber" label={t('rangeNumbers.firstNumber')} value={values.firstNumber} onChange={onChange} autoComplete="off" fullWidth />
        </Grid>
        <Grid item xs={12}>
          <TextField name="lastNumber" label={t('rangeNumbers.lastNumber')} value={values.lastNumber} onChange={onChange} autoComplete="off" fullWidth />
        </Grid>
      </Grid>
    )
    : (
      <>
        {fetchRequestState === RequestState.progress && <TplLoading />}
        {fetchRequestState === RequestState.error && <ErrorAlert message={t('number.fetchError')} marginY={2} retry={fetchNumbers} />}
        {fetchRequestState === RequestState.success && (
          <TplEnhancedTable
            rows={numbers}
            headers={[
              {id: 'select', label: ''},
              {id: 'number', label: t('number.number'), filterable: true},
              {id: 'vanityCategory', label: t('number.vanityCategory'), type: 'enum', values: numberVanityCategory, filterable: true},
              {id: 'nature', label: t('number.nature')},
            {id: 'rangeId', label: t('number.rangeId')},
              // {id: 'blockPrefix', label: 'Block prefix', hidden: true, filterable: true}, TODO API does not support "blockPrefix" filter yet
            ]}
          rowMapper={rowMapper}
            controlled
            pageable
            paginationDefault={pagination}
            onPageChange={setPagination}
            filterable
            filterDefault={filter}
            onFilterChange={setFilter}
            selectable
            selectionDefault={values.numbers}
            onSelectionChange={numbers => onChange({target: {name: 'numbers', value: numbers}})}
          />
        )}
      </>
    );
};

AddNumbersIntoRangeWizardForm3.propTypes = {
  values: PropTypes.object,
  onChange: PropTypes.func,
  operator: PropTypes.string,
  continuousDisplay: PropTypes.bool,
};

export default AddNumbersIntoRangeWizardForm3;
