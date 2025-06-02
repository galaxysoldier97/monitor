import React, { useState } from 'react';
import PropTypes from 'prop-types';
import PageBase from '../../../components/PageBase';
import { Grid, MenuItem, Snackbar } from '@material-ui/core';
import { Add, Cancel } from '@material-ui/icons';
import { TplEnhancedTable, TplLoading } from 'mt-react-library/containers/templates';
import { t } from 'mt-react-library/functions';
import { Auth } from '../../../services/Auth';
import { Link, useLocation } from 'react-router-dom';
import { populateEntityConfiguration } from '../../../helpers/entityHelper';
import { ancillaryEquipmentFields } from '../../../config/equipment/ancillaryEquipment/ancillaryEquipmentFields';
import { ErrorAlert } from '../../../components/ErrorAlert';
import { OpenTplDialButton } from '../../../components/buttons/OpenTplDialButton';
import { resourcesScopes } from '../../../config/resources/resourcesScopes';
import { AncillaryEquipmentActions } from './AncillaryEquipmentActions';
import DropdownMenu from '../../../components/DropdownMenu';
import { getAncillaryEquipmentDisplayMapper } from '../../../helpers/entityMapper';
import { useFetchEquipmentConfigs } from '../../../hooks/useFetchEquipmentConfigs';
import { useUrlForm } from '../../../hooks/useUrlForm';
import { INITIAL_PAGE_NUMBER, INITIAL_PAGE_SIZE, useSearchList } from '../../../hooks/useSearchList';
import { SearchEntities } from '../../../helpers/SearchEntities';
import { getErrorMessage } from '../../../helpers/fetchHelper';
import TecrepAncillaryEquipmentsService from '../../../services/equipments/TecrepAncillaryEquipmentsService';
import { ResetFilterButton } from '../../../components/buttons/ResetFilterButton';
import { exportableEntity, ExportButton } from '../../../components/buttons/ExportButton';

export const buildAncEqmHeaders = (filteredEq, eqm) => populateEntityConfiguration(ancillaryEquipmentFields, {}, {pairedEquipmentLink: filteredEq}, {warehouse: eqm ? eqm.independent : true});

const AncillaryEquipmentManagerPage = ({filteredEq}) => {
  const location = useLocation();
  const pairedEquipmentId = location.pathname.split('/')[2];
  const {filters, setFilters, ready} = useUrlForm();
  const [filterDetails, setFilterDetails] = useState({pairedEquipmentId, page: INITIAL_PAGE_NUMBER, size: INITIAL_PAGE_SIZE});
  const {list, fetch, totalElements, handlePageChange} = useSearchList({
    filters: pairedEquipmentId ? filterDetails : filters,
    setFilters: pairedEquipmentId ? setFilterDetails : setFilters,
    entity: SearchEntities.ancillaryEquipments,
    isFilterReady: pairedEquipmentId ? true : ready,
  });
  const [notification, setNotification] = useState({visible: false, message: ''});
  const [createdSuccessfully, setCreatedSuccessfully] = useState(false);

  const createAncillaryEquipment = data => {
    TecrepAncillaryEquipmentsService.addAncillaryEquipment(data)
    .then(() => {
      fetch();
      setCreatedSuccessfully(true);
      setNotification({visible: true, message: t('ancillaryEquipment.createSuccess', data.number)});
      setTimeout(() => setCreatedSuccessfully(false), 500);
    })
    .catch(error => setNotification({visible: true, message: getErrorMessage(error)}));
  };

  const submenu = (
    <DropdownMenu>
      {() => {
        const submenuItems = [];
        if (Auth.connectedUserHasPermission(resourcesScopes.ancillaryEquipments.update)) {
          submenuItems.push(<MenuItem key="import" component={Link} to="/importer/ancillaryEquipments/import">{t('import.from.file')}</MenuItem>);
          submenuItems.push(<MenuItem key="changeStatus" component={Link} to="/importer/ancillaryEquipments/changeStatus">{t('bulk.warehouse.from.file')}</MenuItem>);
        }
        return submenuItems;
      }}
    </DropdownMenu>
  );

  const {warehouses, models, providers} = useFetchEquipmentConfigs({modelOptions: {category: 'ANCILLARY'}});

  const headers = buildAncEqmHeaders(filteredEq, list && list.data && list.data.length >= 0 ? list.data[0] : undefined);

  const addActionButton = Auth.connectedUserHasPermission(resourcesScopes.ancillaryEquipments.create) && !filteredEq &&
    <OpenTplDialButton title={t('ancillary.equipment.add')}
                       key={'add-ancillary-equipment-' + createdSuccessfully}
                       headers={headers.filter(h => h.addable)}
                       confirmProps={{label: t('add'), icon: <Add />, name: 'confirm_add'}}
                       cancelProps={{label: t('cancel'), icon: <Cancel />, name: 'cancel'}}
                       showProps={{icon: <Add />, label: t('add'), name: 'add'}}
                       onConfirm={createAncillaryEquipment}
                       autocloseOnConfirm={false}
                       closed={createdSuccessfully}
    />;

  const handleFilterChange = filterChange => {
    pairedEquipmentId
      ? setFilterDetails({...filterChange, pairedEquipmentId, page: 0})
      : setFilters({
        ...filterChange,
        warehouse: filterChange.warehouse ? filterChange.warehouse.name : undefined,
        provider: filterChange.provider ? filterChange.provider.name : undefined,
        model: filterChange.model ? filterChange.model.name : undefined,
        page: 0,
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
      model: modelSelected && modelSelected.key,
    });
  };

  const rowMapper = item => {
    let mapped = {...item};
    ancillaryEquipmentFields.forEach(field => mapped[field.id] = getAncillaryEquipmentDisplayMapper(item, field.id, warehouses));
    mapped.actions = <AncillaryEquipmentActions mapped={item} filteredEq={filteredEq} filteredDetail={false} onActionPerformed={fetch} />;
    return [mapped, {}];
  };

  const getHeaderFreeContent = () => (
    <div style={{display: 'inline-flex', paddingLeft: 8}}>
      <Grid container direction="row" spacing={2} justifycontent="center">
        <Grid item>
          <ResetFilterButton onClick={() => handleFilterChange({})} />
        </Grid>
        <Grid item>
          <ExportButton entity={exportableEntity.ancillaryEquipments} filters={filters} />
        </Grid>
      </Grid>
    </div>
  );

  return (
    <PageBase
      title={t('ancillaryEquipment.title')}
      navigation={!filteredEq && t('ancillaryEquipment.navigation')}
      actionButton={addActionButton}
      subMenu={!filteredEq && submenu}>
      {list.error && <ErrorAlert message={list.error} />}
      {list.loading && !list.error && <TplLoading />}
      {!list.loading && !list.error && (
        <TplEnhancedTable
          rows={list.data}
          headers={headers}
          rowMapper={rowMapper}
          filterable
          pageable
          paginationDefault={{number: Number(pairedEquipmentId ? filterDetails.page : filters.page), size: Number(pairedEquipmentId ? filterDetails.size : filters.size), totalElements}}
          onPageChange={handlePageChange}
          filterDefault={pairedEquipmentId ? filterDetails : mapFilterUrlToFilterPage(filters)}
          onFilterChange={handleFilterChange}
          headerFreeContent={getHeaderFreeContent()}
        />)}
      <Snackbar
        open={notification.visible}
        message={notification.message}
        autoHideDuration={4000}
        onClose={() => setNotification({...notification, visible: false})}
      />
    </PageBase>
  )
    ;
};

AncillaryEquipmentManagerPage.propTypes = {
  filteredEq: PropTypes.bool,
  equipment: PropTypes.object,
};
export default AncillaryEquipmentManagerPage;
