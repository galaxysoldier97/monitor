import React, { useState } from 'react';
import PageBase from '../../../components/PageBase';
import { Box, Snackbar } from '@material-ui/core';
import { TplEnhancedTable, TplLoading } from 'mt-react-library/containers/templates';
import { t } from 'mt-react-library/functions';
import { ErrorAlert } from '../../../components/ErrorAlert';
import TecrepRangeNumbersService from '../../../services/resources/TecrepRangeNumbersService';
import { rangeNumbersFields } from '../../../config/resources/rangeNumbers/rangeNumbersFields';
import { OpenTplDialButton } from '../../../components/buttons/OpenTplDialButton';
import { Add, Cancel } from '@material-ui/icons';
import RangeNumberActions from './RangeNumberActions';
import { getRangeNumberDisplayMapper } from '../../../helpers/entityMapper';
import { Auth } from '../../../services/Auth';
import { resourcesScopes } from '../../../config/resources/resourcesScopes';
import { useUrlForm } from '../../../hooks/useUrlForm';
import { useSearchList } from '../../../hooks/useSearchList';
import { SearchEntities } from '../../../helpers/SearchEntities';
import { ResetFilterButton } from '../../../components/buttons/ResetFilterButton';

const RangeNumberManager = () => {
  const [notification, setNotification] = useState({show: false, message: ''});
  const {filters, setFilters, ready, reset} = useUrlForm();
  const {list, fetch, totalElements, handlePageChange} = useSearchList({filters, setFilters, entity: SearchEntities.rangeNumbers, isFilterReady: ready});

  const onRangeAction = message => {
    setNotification({message, show: true});
    fetch();
  };

  const rowMapper = row => {
    const mapped = {...row};
    rangeNumbersFields.forEach(field => mapped[field.id] = getRangeNumberDisplayMapper(row, field.id));
    mapped.actions = <RangeNumberActions range={row} onRangeAction={onRangeAction} />;
    return [mapped, {}];
  };

  const createRange = range => {
    TecrepRangeNumbersService.create({continuousRange: range.continuousRange, extendedRange: false, mainRangeId: null})
    .then(() => {
      setNotification({show: true, message: t('rangeNumbers.createSuccessful')});
      setFilters({});
      fetch();
    })
    .catch(() => setNotification({show: true, message: t('rangeNumbers.createFailed')}));
  };

  const addActionButton = Auth.connectedUserHasPermission(resourcesScopes.number.create) && (
    <OpenTplDialButton
      title={t('rangeNumbers.create')}
      headers={[{
        id: 'continuousRange',
        label: t('rangeNumbers.continuousRange'),
        type: 'enum',
        required: true,
        values: [{id: 'yes', key: true, value: t('yes')}, {id: 'no', key: false, value: t('no')}],
      }]}
      validate={values => values.continuousRange !== undefined ? {} : {continuousRange: t('requiredField')}}
      confirmProps={{icon: <Add />, label: t('add')}}
      cancelProps={{icon: <Cancel />, label: t('cancel')}}
      showProps={{icon: <Add />, label: t('rangeNumbers.create')}}
      dialogProps={{fullWidth: true, maxWidth: 'sm'}}
      onConfirm={createRange}
      autocloseOnConfirm
    />
  );

  return (
    <PageBase title={t('rangeNumbers.title')} navigation={t('rangeNumbers.navigation')} actionButton={addActionButton}>
      <Box marginY={4}>
        {list.loading && !list.error && <TplLoading />}
        {list.error && <ErrorAlert message={t('rangeNumbers.fetchError')} retry={fetch} />}
        {!list.loading && !list.error && (
          <TplEnhancedTable rows={list.data}
                            headers={rangeNumbersFields}
                            rowMapper={rowMapper}
                            pageable
                            filterable
                            filterDefault={filters}
                            onFilterChange={filterChange => setFilters({...filterChange, page: 0})}
                            paginationDefault={{number: Number(filters.page), size: Number(filters.size), totalElements}}
                            onPageChange={handlePageChange}
                            headerFreeContent={<ResetFilterButton onClick={reset} />}
          />
        )}
      </Box>
      <Snackbar
        id="popup"
        open={notification.show}
        message={notification.message}
        autoHideDuration={4000}
        onClose={() => setNotification({show: false, message: ''})}
      />
    </PageBase>
  );
};

export default RangeNumberManager;
