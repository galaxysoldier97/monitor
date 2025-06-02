import React, { useState } from 'react';
import PageBase from '../../../components/PageBase';
import { Link } from 'react-router-dom';
import { MenuItem, Snackbar, Select, Typography, Grid } from '@material-ui/core';
import { Add, Cancel } from '@material-ui/icons';
import { TplEnhancedTable, TplLoading } from 'mt-react-library/containers/templates';
import DropdownMenu from '../../../components/DropdownMenu';
import { Auth } from '../../../services/Auth';
import { t } from 'mt-react-library/functions';
import { simCardFields } from '../../../config/equipment/simCard/simCardFields';
import { populateEntityConfiguration } from '../../../helpers/entityHelper';
import { getSimCardDisplayMapper } from '../../../helpers/entityMapper';
import { ErrorAlert } from '../../../components/ErrorAlert';
import { OpenTplDialButton } from '../../../components/buttons/OpenTplDialButton';
import FormControl from '@material-ui/core/FormControl';
import { simCardStatus } from '../../../config/equipment/simCard/simCardStatus';
import { resourcesScopes } from '../../../config/resources/resourcesScopes';
import { SIMCardActions } from './SIMCardActions';
import { useFetchSimCardConfigs } from '../../../hooks/useFetchSimCardConfigs';
import { useUrlForm } from '../../../hooks/useUrlForm';
import { useSearchList } from '../../../hooks/useSearchList';
import { SearchEntities } from '../../../helpers/SearchEntities';
import TecrepSimCardService from '../../../services/equipments/TecrepSimCardService';
import { getErrorMessage } from '../../../helpers/fetchHelper';
import { exportableEntity, ExportButton } from '../../../components/buttons/ExportButton';
import { ResetFilterButton } from '../../../components/buttons/ResetFilterButton';

export const buildSimCardHeaders = () => populateEntityConfiguration(simCardFields);

const submenu = (
  <DropdownMenu>
    {() => {
      const submenuItems = [];
      if (Auth.connectedUserHasPermission(resourcesScopes.simCard.update)) {
        submenuItems.push(<MenuItem id="import" key="import" component={Link} to="/importer/simCard/import">{t('import.from.file')}</MenuItem>);
      }
      if (Auth.connectedUserHasPermission(resourcesScopes.simCard.update)) {
        submenuItems.push(<MenuItem id="changeStatus" key="changeStatus" component={Link} to="/importer/simCard/changeStatus">{t('bulk.warehouse.from.file')}</MenuItem>);
      }
      if (Auth.connectedUserHasPermission(resourcesScopes.simCard.batch)) {
        submenuItems.push(<MenuItem id="simCardBatches" key="simCardBatches" component={Link} to="/simCard/batches">{t('simcard.batches')}</MenuItem>);
      }
      return submenuItems;
    }}
  </DropdownMenu>
);

const SIMCardManagerPage = () => {
  const {warehouses, inventoryPools, providers, plmns} = useFetchSimCardConfigs();
  const headers = buildSimCardHeaders();
  const {filters, setFilters, ready, reset} = useUrlForm();
  const {list, fetch, totalElements, handlePageChange} = useSearchList({filters, setFilters, entity: SearchEntities.simcards, isFilterReady: ready});
  const [notification, setNotification] = useState({visible: false, message: ''});
  const [createdSuccessfully, setCreatedSuccessfully] = useState(false);

  const createSimCard = data => {
    TecrepSimCardService.addSimCard(data)
    .then(() => {
      fetch();
      setCreatedSuccessfully(true);
      setNotification({visible: true, message: t('simcard.createSuccess', data.number)});
      setTimeout(() => setCreatedSuccessfully(false), 500);
    })
    .catch(error => setNotification({visible: true, message: getErrorMessage(error)}));
  };

  const selectStatusComponent = () => (
    <FormControl size="small">
      <Select
        startAdornment={<Typography variant="overline">{t('status')}:</Typography>}
        variant="outlined"
        style={{textAlign: 'center', width: 200, marginTop: -10, paddingLeft: 16}}
        onChange={event => setFilters({...filters, page: 0, status: event.target.value === '*' ? '' : event.target.value})}
        value={filters.status || '*'}>
        {simCardStatus.map(status => <MenuItem key={status.key} value={status.key || '*'}><Typography variant="caption">{status.value}</Typography></MenuItem>)}
      </Select>
    </FormControl>
  );

  const addActionButton = headers && Auth.connectedUserHasPermission(resourcesScopes.simCard.create) &&
    <OpenTplDialButton title={t('simcard.add')}
                       key={'add-simcard-' + createdSuccessfully}
                       headers={headers.filter(h => h.addable)}
                       confirmProps={{label: t('add'), icon: <Add />, name: 'confirm_add'}}
                       cancelProps={{label: t('cancel'), icon: <Cancel />, name: 'cancel'}}
                       showProps={{icon: <Add />, label: t('add'), name: 'add'}}
                       onConfirm={createSimCard}
                       autocloseOnConfirm={false}
                       closed={createdSuccessfully}
    />;

  const rowMapper = item => {
    let mapped = {...item};
    simCardFields.forEach(field => mapped[field.id] = getSimCardDisplayMapper(item, field.id, plmns, inventoryPools, warehouses, providers));
    mapped.actions = <SIMCardActions filteredNumber={false} mapped={item} onActionPerformed={fetch} />;
    return [mapped, {}];
  };

  const handleFilterChange = filterChange => {
    setFilters({
      ...filterChange,
      provider: filterChange.provider ? filterChange.provider.name : undefined,
      warehouse: filterChange.warehouse ? filterChange.warehouse.name : undefined,
      page: 0
    });
  };
  const mapFilterUrlToFilterPage = filter => {
    const providerSelected = providers && providers.find(p => p.key.name === filters.provider);
    const warehouseSelected = warehouses && warehouses.find(p => p.key.name === filters.warehouse);
    return ({
      ...filter,
      provider: providerSelected && providerSelected.key,
      warehouse: warehouseSelected && warehouseSelected.key,
    });
  };

  const getHeaderFreeContent = () => (
    <div style={{display: 'inline-flex', paddingLeft: 8}}>
      <Grid container direction="row" spacing={2} justifycontent="center">
        <Grid item>
          {selectStatusComponent()}
        </Grid>
        <Grid item>
          <ResetFilterButton onClick={reset} />
        </Grid>
        <Grid item>
           <ExportButton entity={exportableEntity.simcards} filters={filters}/>
        </Grid>
      </Grid>
    </div>
  );

  return (
    <PageBase title={t('simcard.title')}
              navigation={t('simcard.navigation')}
              subMenu={submenu}
              actionButton={addActionButton}
    >
      {list.error && <ErrorAlert message={list.error} />}
      {list.loading && !list.error && <TplLoading />}
      {!list.loading && !list.error && (
        <TplEnhancedTable rows={list.data}
                          headers={headers}
                          rowMapper={rowMapper}
                          filterable
                          pageable
                          paginationDefault={{number: Number(filters.page), size: Number(filters.size), totalElements}}
                          onPageChange={handlePageChange}
                          filterDefault={mapFilterUrlToFilterPage(filters)}
                          onFilterChange={handleFilterChange}
                          headerFreeContent={getHeaderFreeContent()}
        />)
      }
      <Snackbar
        open={notification.visible}
        message={notification.message}
        autoHideDuration={4000}
        onClose={() => setNotification({...notification, visible: false})}
      />
    </PageBase>
  );
};

SIMCardManagerPage.propTypes = {};
export default SIMCardManagerPage;
