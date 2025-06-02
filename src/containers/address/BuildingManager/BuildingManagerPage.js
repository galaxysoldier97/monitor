import React, { useState } from 'react';
import PageBase from '../../../components/PageBase';
import { DialogContentText, Snackbar } from '@material-ui/core';
import { TplActionButton, TplEnhancedDialog, TplEnhancedTable, TplLoading } from 'mt-react-library/containers/templates';
import { t } from 'mt-react-library/functions';
import { Assignment, Cancel, Delete, Edit, History } from '@material-ui/icons';
import { populateEntityConfiguration } from '../../../helpers/entityHelper';
import { buildingFields } from '../../../config/adresses/postalAddress/buildingFields';
import { ErrorAlert } from '../../../components/ErrorAlert';
import { resourcesScopes } from '../../../config/resources/resourcesScopes';
import Auth from '../../../services/Auth';
import { getBuildingDisplayMapper } from '../../../helpers/entityMapper';
import { ROUTES } from '../../../config/routes';
import { useUrlForm } from '../../../hooks/useUrlForm';
import { useSearchList } from '../../../hooks/useSearchList';
import { SearchEntities } from '../../../helpers/SearchEntities';
import { getErrorMessage } from '../../../helpers/fetchHelper';
import TecrepBuildingService from '../../../services/address/TecrepBuildingService';
import TecRepBuildingRequestDtoGenerator from '../../../services/address/TecRepBuildingRequestDtoGenerator';
import { ResetFilterButton } from '../../../components/buttons/ResetFilterButton';

export const buildHeaders = () => populateEntityConfiguration(buildingFields);

const BuildingManagerPage = () => {
  const {filters, setFilters, ready, reset} = useUrlForm();
  const {list, fetch, totalElements, handlePageChange} = useSearchList({filters, setFilters, entity: SearchEntities.buildings, isFilterReady: ready});
  const [notification, setNotification] = useState({visible: false, message: ''});
  const handleFilterChange = filterChange => setFilters({...filterChange, page: 0});

  const headers = buildHeaders();

  const edit = (itemConfirm, mapped) => {
    const building = {...itemConfirm, buildingCode: itemConfirm.buildingCode !== mapped.buildingCode ? itemConfirm.buildingCode : undefined};
    TecrepBuildingService.updateBuilding(TecRepBuildingRequestDtoGenerator.prepareForUpdateBuilding(building))
    .then(fetch)
    .catch(e => setNotification({visible: true, message: getErrorMessage(e)}));
  };

  const deleteBuilding = itemConfirm => {
    TecrepBuildingService.deleteBuilding(itemConfirm.building.buildingId)
    .then(fetch)
    .catch(e => setNotification({visible: true, message: getErrorMessage(e)}));
  };

  return (
    <PageBase title={t('building.title')} navigation={t('building.navigation')}>
      {list.error && <ErrorAlert message={list.error} />}
      {list.loading && !list.error && <TplLoading />}
      {!list.loading && !list.error &&
      <TplEnhancedTable rows={list.data} headers={headers} rowMapper={item => {
        let mapped = {};
        buildingFields.forEach(field => mapped[field.id] = getBuildingDisplayMapper(item, field.id));
        mapped.actions = (
          <div>
            <TplActionButton tooltipTitle={t('detail')}
                             icon={<Assignment />}
                             link={ROUTES.buildingInfo.path.replace(':buildingId', mapped.buildingId)} />
            <TplActionButton tooltipTitle={t('historic.title')}
                             icon={<History />}
                             link={ROUTES.historic.path.replace(':entity', 'building').replace(':id', mapped.buildingId)} />
            {Auth.connectedUserHasPermission(resourcesScopes.address.update) && <TplEnhancedDialog
              tooltipTitle={t('edit')}
              title={t('building.details.edit', mapped.buildingCode)}
              headers={headers.filter(h => h.editable)}
              initialValues={mapped}
              confirmProps={{label: t('edit'), icon: <Edit />}}
              cancelProps={{label: t('cancel'), icon: <Cancel />}}
              showProps={{icon: <Edit />}}
              autocloseOnConfirm={false}
              onConfirm={item => edit(item, mapped)}
            />}
            {Auth.connectedUserHasPermission(resourcesScopes.address.delete) && <TplEnhancedDialog
              tooltipTitle={t('delete')}
              title={t('delete.building')}
              initialValues={item}
              confirmProps={{label: t('simcard.delete'), icon: <Delete />}}
              cancelProps={{label: t('cancel'), icon: <Cancel />}}
              showProps={{icon: <Delete color="error" />}}
              onConfirm={deleteBuilding}
            >
              <DialogContentText>
                {t('delete.building.ask')}
              </DialogContentText>
            </TplEnhancedDialog>}
          </div>
        );
        return [mapped, {}];
      }}
                        filterable
                        pageable
                        paginationDefault={{number: Number(filters.page), size: Number(filters.size), totalElements}}
                        onPageChange={handlePageChange}
                        filterDefault={filters}
                        onFilterChange={handleFilterChange}
                        headerFreeContent={<ResetFilterButton onClick={reset} />}
      />}
      <Snackbar
        open={notification.visible}
        message={notification.message}
        autoHideDuration={4000}
        onClose={() => setNotification({...notification, visible: false})}
      />
    </PageBase>
  );
};


BuildingManagerPage.propTypes = {};

export default BuildingManagerPage;
