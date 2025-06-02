import React, { useCallback, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import PageBase from '../../../components/PageBase';
import { Box, DialogContentText, Grid, Snackbar } from '@material-ui/core';
import { TplEnhancedDialog, TplEnhancedTable, TplLoading } from 'mt-react-library/containers/templates';
import { Add, Cancel, Delete } from '@material-ui/icons';
import { t } from 'mt-react-library/functions';
import { Auth } from '../../../services/Auth';
import { resourcesScopes } from '../../../config/resources/resourcesScopes';
import { InfoBloc } from '../../../components/InfoBloc';
import { OpenTplDialButton } from '../../../components/buttons/OpenTplDialButton';
import { populateEntityConfiguration, populateEntityInfoPageConfig } from '../../../helpers/entityHelper';
import { BooleanInfoIcon } from '../../../components/BooleanInfoIcon';
import { intervalNumbersFields } from '../../../config/adresses/blockNumbers/intervalNumbersFields';
import { useFetchInventoryPools } from '../../../hooks/useFetchInventoryPools';
import TecrepBlockNumberService from '../../../services/resources/TecrepBlockNumberService';
import TecrepIntervalNumberService from '../../../services/resources/TecrepIntervalNumberService';
import { blockNumbersFields } from '../../../config/adresses/blockNumbers/blockNumbersFields';
import { ErrorAlert } from '../../../components/ErrorAlert';
import { getErrorMessage } from '../../../helpers/fetchHelper';
import { useFetchRscActivities } from '../../../hooks/useFetchRscActivities';


const getDisplayValue = (item, key) => key === 'portability' ? <BooleanInfoIcon value={item[key]} /> : item[key];

const INITIAL_PAGE_SIZE = 5;

const BlockNumberInfoPage = () => {
  const {inventoryPools} = useFetchInventoryPools();
  const [blockNumberInfo, setBlockNumberInfo] = useState({loading: true});
  const location = useLocation();
  const id = location.pathname.split('/')[2];
  const [notification, setNotification] = useState({message: '', show: false});
  const intervalNumbersHeaders = populateEntityConfiguration(intervalNumbersFields, {inventoryPoolCode: inventoryPools});
  const [addedSuccessfully, setAddedSuccessfully] = useState(false);
  const [pagination, setPagination] = useState({number: 0, size: INITIAL_PAGE_SIZE, totalElements: 0});
  const [filters, setFilters] = useState({firstNumber: null, activity: null, blockNumberId: id});
  const [intervalNumbers, setIntervalNumbers] = useState({loading: true, error: undefined});
  useFetchRscActivities();

  const getBlockNumberInfo = useCallback(() => {
    setBlockNumberInfo({...blockNumberInfo, loading: true, error: undefined});
    TecrepBlockNumberService.getBlockNumber(id)
    .then(res => setBlockNumberInfo({loading: false, data: res}))
    .catch(err => setBlockNumberInfo({loading: false, error: getErrorMessage(err)}));
  }, [id]);

  useEffect(getBlockNumberInfo, [getBlockNumberInfo]);

  const fetchIntervalNumbers = () => {
    setIntervalNumbers({loading: true, error: undefined});
    TecrepIntervalNumberService.search({...filters, blockNumberId: id}, pagination.number, pagination.size)
    .then(response => {
      setIntervalNumbers(response.content ? response.content : []);
      setPagination({...pagination, totalElements: response.totalElements});
    })
    .catch(err => setIntervalNumbers({loading: false, error: getErrorMessage(err)}));
  };

  useEffect(fetchIntervalNumbers, [filters, pagination.size, pagination.number]);

  const addIntervalNb = (intervalNumber) => {
    TecrepIntervalNumberService.addIntervalNumber({blockId: id}, intervalNumber)
    .then(() => {
      fetchIntervalNumbers();
      setAddedSuccessfully(true);
      setNotification({message: t('block.info.intervalNumber.addSuccess'), show: true});
      setTimeout(() => setAddedSuccessfully(false), 1000);
    })
    .catch(err => setNotification({show: true, message: getErrorMessage(err)}));
  };

  const deleteIntervalNb = (intervalNumber) => {
    TecrepIntervalNumberService.deleteIntervalNumber(intervalNumber)
    .then(() => {
      if (intervalNumbers.length === 1 && pagination.number > 0) {
        setPagination({...pagination, number: pagination.number - 1});
      } else {
        fetchIntervalNumbers();
      }
      setNotification({show: true, message: t('block.info.intervalNumber.deleteSuccess')});
    })
    .catch(err => setNotification({show: true, message: getErrorMessage(err)}));
  };

  const addActionButton = Auth.connectedUserHasPermission(resourcesScopes.number.create) &&
    <OpenTplDialButton title={t('block.info.intervalNumber.add')}
                       key={'add-interval-number-' + addedSuccessfully}
                       headers={intervalNumbersHeaders.filter(h => h.editable || h.addable)}
                       confirmProps={{label: t('add'), icon: <Add />, name: 'confirm_add'}}
                       cancelProps={{label: t('cancel'), icon: <Cancel />, name: 'cancel'}}
                       showProps={{icon: <Add />, label: t('add'), name: 'add'}}
                       onConfirm={addIntervalNb}
                       autocloseOnConfirm={false}
                       closed={addedSuccessfully} />;

  const rowMapper = item => {
    let mapped = Object.assign({}, item);
    mapped.portability = <BooleanInfoIcon value={mapped.portability} />;
    mapped.system = <BooleanInfoIcon value={mapped.system} />;
    mapped.actions = <div>
      {Auth.connectedUserHasPermission(resourcesScopes.number.delete) &&
        <TplEnhancedDialog
          tooltipTitle={t('delete')}
          title={t('block.info.intervalNumber.delete')}
          initialValues={item}
          confirmProps={{label: t('block.delete'), icon: <Delete />, name: 'confirm_delete'}}
          cancelProps={{label: t('cancel'), icon: <Cancel />, name: 'cancel'}}
          showProps={{icon: <Delete color="error" />, name: 'delete'}}
          onConfirm={deleteIntervalNb}
        >
          <DialogContentText>
            {t('block.delete.ask', <strong>{mapped.firstNumber}</strong>, <strong>{mapped.lastNumber}</strong>)}
          </DialogContentText>
        </TplEnhancedDialog>}
    </div>;
    return [mapped, {}];
  };

  return (
    <>
      <PageBase title={t('block.info.title')} navigation={t('block.info.navigation')} backButton>
        {blockNumberInfo.error && <ErrorAlert message={blockNumberInfo.error} />}
        {blockNumberInfo.loading && !blockNumberInfo.error && <TplLoading />}
        {!blockNumberInfo.loading && !blockNumberInfo.error &&
          <Box marginY={4}>
            <Grid container spacing={2}>
              {populateEntityInfoPageConfig(blockNumbersFields).map(field => <Grid item key={field.id} xs={12} sm={6} md={3}>
                <InfoBloc label={`block.${field.id}`} value={getDisplayValue(blockNumberInfo.data, field.id)} />
              </Grid>)}
            </Grid>
          </Box>}
      </PageBase>
      <PageBase title={t('intervalNumbers.title')} actionButton={addActionButton}>
        {intervalNumbers.error && <ErrorAlert message={intervalNumbers.error} />}
        {intervalNumbers.loading && !intervalNumbers.error && <TplLoading />}
        {!intervalNumbers.loading && !intervalNumbers.error &&
          <TplEnhancedTable rows={intervalNumbers}
                            headers={intervalNumbersFields.filter(h => !h.hidden)}
                            rowMapper={rowMapper}
                            pageable
                            filterable
                            paginationDefault={pagination}
                            filterDefault={filters}
                            onPageChange={setPagination}
                            onFilterChange={filterChange => {
                              setFilters({...filterChange});
                              setPagination({...pagination, number: 0});
                            }}
          />}
      </PageBase>
      <Snackbar
        open={notification.show}
        message={notification.message}
        autoHideDuration={4000}
        onClose={() => setNotification({...notification, show: false})}
      />
    </>
  );
};

export default BlockNumberInfoPage;
