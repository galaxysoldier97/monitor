import React, { useEffect, useState } from 'react';
import { TplEnhancedTable, TplLoading } from 'mt-react-library/containers/templates';
import { t } from 'mt-react-library/functions';
import PageBase from '../../components/PageBase';
import { populateEntityConfiguration } from '../../helpers/entityHelper';
import { handsetsFields } from '../../config/stock/handsetsFields';
import { ErrorAlert } from '../../components/ErrorAlert';
import { Auth } from '../../services/Auth';
import { resourcesScopes } from '../../config/resources/resourcesScopes';
import { OpenTplDialButton } from '../../components/buttons/OpenTplDialButton';
import { Add, Cancel } from '@material-ui/icons';
import { Snackbar } from '@material-ui/core';
import { HandsetActions } from './HandsetActions';
import { useUrlForm } from '../../hooks/useUrlForm';
import { useSearchList } from '../../hooks/useSearchList';
import { SearchEntities } from '../../helpers/SearchEntities';
import { addHandset, getHandsetModels } from '../../services/Stock/StockManagementService';
import { getErrorMessage } from '../../helpers/fetchHelper';
import { ResetFilterButton } from '../../components/buttons/ResetFilterButton';
import {StockWarehouseEndpoint} from "../../services/Stock/StockWarehouseService";

export const buildHeaders = ({warehouses, models}) => {
  const warehouseValues = [{id: 'all', key: '', value: t('all')}];
  const modelValues = [{id: 'all', key: '', value: t('all')}];
  warehouses && warehouses.forEach(type => warehouseValues.push({id: type.id, key: type.code, value: type.name}));
  models && models.forEach(type => modelValues.push({id: type.id, key: type.code, value: type.name}));
  const dynamicValues = {
    warehouse: warehouseValues,
    model: modelValues,
  };
  return populateEntityConfiguration([...handsetsFields], dynamicValues);
};

const HandsetManagerPage = () => {
  const {filters, setFilters, ready, reset} = useUrlForm();
  const {list, fetch, totalElements, handlePageChange} = useSearchList({filters, setFilters, entity: SearchEntities.handsets, isFilterReady: ready});
  const [warehouses, setWarehouses] = useState({loading: true});
  const [models, setModels] = useState({loading: true});
  const [notification, setNotification] = useState({show: false, message: ''});
  const [createdSuccessfully, setCreatedSuccessfully] = useState(false);

  useEffect(() => {
    setWarehouses({loading: true});
    StockWarehouseEndpoint.getAll()
    .then(res => {
      setWarehouses({loading: false, data: res ? res.rows : []});
    })
    .catch(err => {
      setWarehouses({loading: false});
      setNotification({show: true, message: getErrorMessage(err)});
    });
  }, []);

  useEffect(() => {
    setModels({loading: true});
    getHandsetModels()
    .then(res => {
      setModels({loading: false, data: res ? res.content : []});
    })
    .catch(err => {
      setModels({loading: false});
      setNotification({show: true, message: getErrorMessage(err)});
    });
  }, []);

  const rowMapper = row => {
    const mapped = {
      ...row,
      warehouse: row.warehouse && row.warehouse.name,
      model: row.model && row.model.name,
    };
    mapped.actions = <HandsetActions row={row} headers={buildHeaders({warehouses: warehouses.data || [], models: models.data || []})} onUpdate={fetch} />;
    return [mapped, {}];
  };

  const handleFilterChange = filterChange => setFilters({...filterChange, page: 0});

  const addItem = item => {
    setNotification({show: false, message: ''});
    addHandset(item)
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

  const addActionButton = !warehouses.loading && !models.loading && Auth.connectedUserHasPermission(resourcesScopes.handset.create) &&
    <OpenTplDialButton
      key={createdSuccessfully}
      title={t('add')}
      headers={buildHeaders({warehouses: warehouses.data || [], models: models.data || []}).filter(h => h.addable)}
      confirmProps={{label: t('add'), icon: <Add />}}
      cancelProps={{label: t('cancel'), icon: <Cancel />}}
      showProps={{icon: <Add />, label: t('add')}}
      onConfirm={addItem}
      autocloseOnConfirm={false}
      closed={createdSuccessfully}
    />;

  return (
    <PageBase title={t('stock.handsets.title')} navigation={t('stock.handsets.navigation')} actionButton={addActionButton}>
      {list.error && <ErrorAlert message={list.error} />}
      {list.loading && !list.error && <TplLoading />}
      {!list.loading && !list.error && !warehouses.loading && !models.loading && (
        <TplEnhancedTable pageable
                          rows={list.data}
                          headers={buildHeaders({warehouses: warehouses.data || [], models: models.data || []})}
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

HandsetManagerPage.propTypes = {};

export default HandsetManagerPage;
