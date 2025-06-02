import { t } from 'mt-react-library/functions';
import React, {PropTypes, useState} from 'react';
import { TplEnhancedTable, TplLoading } from 'mt-react-library/containers/templates';
import PageBase from '../../../components/PageBase';
import { Add, Cancel } from '@material-ui/icons';
import { Auth } from '../../../services/Auth';
import { Grid, MenuItem, Snackbar } from '@material-ui/core';
import DropdownMenu from '../../../components/DropdownMenu';
import { Link } from 'react-router-dom';
import { cpeFields } from '../../../config/equipment/cpe/cpeFields';
import { populateEntityConfiguration } from '../../../helpers/entityHelper';
import { ErrorAlert } from '../../../components/ErrorAlert';
import { OpenTplDialButton } from '../../../components/buttons/OpenTplDialButton';
import { CPEActions } from './CPEActions';
import { resourcesScopes } from '../../../config/resources/resourcesScopes';
import { getCpeDisplayMapper } from '../../../helpers/entityMapper';
import { useFetchEquipmentConfigs } from '../../../hooks/useFetchEquipmentConfigs';
import { getErrorMessage } from '../../../helpers/fetchHelper';
import TecrepCpeService from '../../../services/equipments/TecrepCpeService';
import { useSearchList } from '../../../hooks/useSearchList';
import { SearchEntities } from '../../../helpers/SearchEntities';
import { useUrlForm } from '../../../hooks/useUrlForm';
import { ResetFilterButton } from '../../../components/buttons/ResetFilterButton';
import { exportableEntity, ExportButton } from '../../../components/buttons/ExportButton';

export const buildCPEHeaders = () => populateEntityConfiguration(cpeFields);

const CPEManagerPage = () => {
  const [notification, setNotification] = useState({visible: false, message: ''});
  const [createdSuccessfully, setCreatedSuccessfully] = useState(false);
  const {filters, setFilters, ready, reset} = useUrlForm();
  const {list, fetch, totalElements, handlePageChange} = useSearchList({filters, setFilters, entity: SearchEntities.cpe, isFilterReady: ready});

  const submenu = (
    <DropdownMenu>
      {() => {
        const submenuItems = [];
        if (Auth.connectedUserHasPermission(resourcesScopes.cpe.update)) {
          submenuItems.push(<MenuItem id="import" key="import" component={Link} to="/importer/cpe/import">{t('import.from.file')}</MenuItem>);
          submenuItems.push(<MenuItem id="changeStatus" key="changeStatus" component={Link} to="/importer/cpe/changeStatus">{t('bulk.warehouse.from.file')}</MenuItem>);
        }
        return submenuItems;
      }}
    </DropdownMenu>
  );
  const {warehouses, providers, models} = useFetchEquipmentConfigs({modelOptions: {category: 'CPE'}});

  const createCpe= data => {
    TecrepCpeService.addCPE(data)
    .then(() => {
      fetch();
      setCreatedSuccessfully(true);
      setNotification({visible: true, message: t('cpe.createSuccess', data.number)});
      setTimeout(() => setCreatedSuccessfully(false), 500);
    })
    .catch(error => setNotification({visible: true, message: getErrorMessage(error)}));
  };

  const headers = buildCPEHeaders();
  const addActionButton = Auth.connectedUserHasPermission(resourcesScopes.cpe.create) &&
    <OpenTplDialButton
      title={t('cpe.add')}
      headers={headers.filter(h => h.addable)}
      key={'add-cpe-' + createdSuccessfully}
      confirmProps={{label: t('add'), icon: <Add />, name: 'confirm_add'}}
      cancelProps={{label: t('cancel'), icon: <Cancel />, name: 'cancel'}}
      showProps={{icon: <Add />, label: t('add'), name: 'add'}}
      onConfirm={createCpe}
      autocloseOnConfirm={false}
      closed={createdSuccessfully}
    />;

  const rowMapper = item => {
    let mapped = {...item};
    cpeFields.forEach(field => mapped[field.id] = getCpeDisplayMapper(item, field.id, warehouses));
    mapped.actions = <CPEActions mapped={item} filteredCpe={false} onActionPerformed={fetch} />;
    return [mapped, {}];
  };

  const handleFilterChange = filterChange => {
    setFilters({
      ...filterChange,
      provider: filterChange.provider ? filterChange.provider.name : undefined,
      warehouse: filterChange.warehouse ? filterChange.warehouse.name : undefined,
      model: filterChange.model ? filterChange.model.name : undefined,
      page: 0
    });
  };

  const mapFilterUrlToFilterPage = filter => {
    const providerSelected = providers && providers.find(p => p.key.name === filters.provider);
    const warehouseSelected = warehouses && warehouses.find(p => p.key.name === filters.warehouse);
    const modelSelected = models && models.find(p => p.key.name === filters.model);
    return ({
      ...filter,
      provider: providerSelected && providerSelected.key,
      warehouse: warehouseSelected && warehouseSelected.key,
      model: modelSelected && modelSelected.key
    });
  };

  const getHeaderFreeContent = () => (
    <div style={{display: 'inline-flex', paddingLeft: 8}}>
      <Grid container direction="row" spacing={2} justifycontent="center">
        <Grid item>
          <ResetFilterButton onClick={reset} />
        </Grid>
        <Grid item>
          <ExportButton entity={exportableEntity.cpe} filters={filters} />
        </Grid>
      </Grid>
    </div>
  );

  return (
    <PageBase
      title={t('cpe.title')}
      navigation={t('cpe.navigation')}
      subMenu={submenu}
      actionButton={addActionButton}>
      {list.error && <ErrorAlert message={list.error} />}
      {list.loading && !list.error && <TplLoading />}
      {!list.loading && !list.error &&
        <TplEnhancedTable
          rows={list.data}
          headers={headers}
          rowMapper={rowMapper}
          filterable
          pageable
          paginationDefault={{number: Number(filters.page), size: Number(filters.size), totalElements}}
          filterDefault={mapFilterUrlToFilterPage(filters)}
          onPageChange={handlePageChange}
          onFilterChange={handleFilterChange}
          headerFreeContent={getHeaderFreeContent()}
        />
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

CPEManagerPage.propTypes = {
  filteredCpe: PropTypes.object,
};
export default CPEManagerPage;
