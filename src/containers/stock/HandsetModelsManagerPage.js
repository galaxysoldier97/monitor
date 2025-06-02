import React, { useEffect, useState } from 'react';
import { TplEnhancedTable, TplLoading } from 'mt-react-library/containers/templates';
import { t } from 'mt-react-library/functions';
import PageBase from '../../components/PageBase';
import { populateEntityConfiguration } from '../../helpers/entityHelper';
import { handsetModelsFields } from '../../config/stock/HandsetModelsFields';
import { addHandsetModel } from '../../services/Stock/StockManagementService';
import { ErrorAlert } from '../../components/ErrorAlert';
import { Auth } from '../../services/Auth';
import { resourcesScopes } from '../../config/resources/resourcesScopes';
import { OpenTplDialButton } from '../../components/buttons/OpenTplDialButton';
import { Add, Cancel } from '@material-ui/icons';
import { Snackbar } from '@material-ui/core';
import { HandsetModelActions } from './HandsetModelActions';
import { useUrlForm } from '../../hooks/useUrlForm';
import { useSearchList } from '../../hooks/useSearchList';
import { SearchEntities } from '../../helpers/SearchEntities';
import { getErrorMessage } from '../../helpers/fetchHelper';
import { ResetFilterButton } from '../../components/buttons/ResetFilterButton';
import {StockManufacturerEndpoint} from "../../services/Stock/StockManufacturerService";

const buildHeaders = manufacturers => {
  const manufacturerValues = [{id: 'all', key: '', value: t('all')}];
  manufacturers && manufacturers.forEach(item => manufacturerValues.push({id: item.name, key: item.name, value: item.name}));
  return populateEntityConfiguration(handsetModelsFields, {manufacturer: manufacturerValues});
};

const HandsetModelsManagerPage = () => {
  const {filters, setFilters, ready, reset} = useUrlForm();
  const {list, fetch, totalElements, handlePageChange} = useSearchList({filters, setFilters, entity: SearchEntities.handsetModels, isFilterReady: ready});
  const [manufacturers, setManufacturers] = useState({loading: true});
  const [notification, setNotification] = useState({show: false, message: ''});
  const [createdSuccessfully, setCreatedSuccessfully] = useState(false);

  useEffect(() => {
    setManufacturers({loading: true});
    StockManufacturerEndpoint.getAll()
    .then(res => {
      setManufacturers({loading: false, data: res ? res.rows : []});
    })
    .catch(err => {
      setManufacturers({loading: false});
      setNotification({show: true, message: getErrorMessage(err)});
    });
  }, []);

  const rowMapper = row => {
    const mapped = {
      ...row,
      manufacturer: row.manufacturer && row.manufacturer.name,
    };
    mapped.actions = <HandsetModelActions mapped={mapped} headers={buildHeaders(manufacturers.data || [])} onUpdate={fetch} />;
    return [mapped, {}];
  };

  const handleFilterChange = filterChange => setFilters({...filterChange, page: 0});

  const addItem = item => {
    setNotification({show: false, message: ''});
    addHandsetModel(item)
    .then(() => {
      fetch();
      setCreatedSuccessfully(true);
      setNotification({show: true, message: t('stock.handsets.handsetadded')});
      setTimeout(() => setCreatedSuccessfully(false), 500);
    })
    .catch(err => {
      setNotification({show: true, message: getErrorMessage(err)});
    });
  };

  const addActionButton = !manufacturers.loading && Auth.connectedUserHasPermission(resourcesScopes.handset.create) &&
    <OpenTplDialButton
      key={'add-handset-model-' + createdSuccessfully}
      title={t('add')}
      headers={buildHeaders(manufacturers.data).filter(h => h.addable)}
      confirmProps={{label: t('add'), icon: <Add />}}
      cancelProps={{label: t('cancel'), icon: <Cancel />}}
      showProps={{icon: <Add />, label: t('add')}}
      onConfirm={addItem}
      autocloseOnConfirm={false}
      closed={createdSuccessfully}
    />;

  return (
    <PageBase title={t('stock.handsetmodels.title')} navigation={t('stock.handsetmodels.navigation')} actionButton={addActionButton}>
      {list.error && <ErrorAlert message={list.error} />}
      {list.loading && !list.error && <TplLoading />}
      {!list.loading && !list.error && !manufacturers.loading && (
        <TplEnhancedTable pageable
                          rows={list.data}
                          headers={buildHeaders(manufacturers.data)}
                          rowMapper={rowMapper}
                          paginationDefault={{number: Number(filters.page), size: Number(filters.size), totalElements}}
                          onPageChange={handlePageChange}
                          controlled
                          filterable
                          filterDefault={filters}
                          onFilterChange={handleFilterChange}
                          headerFreeContent={<ResetFilterButton onClick={reset} />}
        />)}
      <Snackbar
        open={notification.show}
        message={notification.message}
        autoHideDuration={4000}
        onClose={() => setNotification({...notification, show: false})}
      />
    </PageBase>
  );
};

HandsetModelsManagerPage.propTypes = {};

export default HandsetModelsManagerPage;
