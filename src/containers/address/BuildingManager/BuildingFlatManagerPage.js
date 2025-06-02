import React, { useState } from 'react';
import PageBase from '../../../components/PageBase';
import { t } from 'mt-react-library/functions';
import { OpenTplDialButton } from '../../../components/buttons/OpenTplDialButton';
import { Add, Assignment, Cancel, Delete, Edit, History } from '@material-ui/icons';
import { TplActionButton, TplEnhancedDialog, TplEnhancedTable } from 'mt-react-library/containers/templates';
import { routePaths, ROUTES } from '../../../config/routes';
import { DialogContentText, Grid, Snackbar } from '@material-ui/core';
import PropTypes from 'prop-types';
import TecRepBuildingRequestDtoGenerator from '../../../services/address/TecRepBuildingRequestDtoGenerator';
import TecrepBuildingService from '../../../services/address/TecrepBuildingService';
import { getErrorMessage } from '../../../helpers/fetchHelper';
import { ResetFilterButton } from '../../../components/buttons/ResetFilterButton';

export const BuildingFlatManagerPage = ({building, fetchBuilding}) => {
  const [notification, setNotification] = useState({visible: false, message: ''});
  const [filteredItems, setFilteredItems] = useState(building.buildingFlatDTOs);

  const blockNumbers = [];
  const floorNumbers = [];
  if (building.buildingFlatDTOs.length !== 0) {
    building.buildingFlatDTOs.forEach(itemBlockNumber => blockNumbers.push({key: itemBlockNumber.blockNumber, value: itemBlockNumber.blockNumber}));
    building.buildingFlatDTOs.forEach(itemFloorNumber => floorNumbers.push({key: itemFloorNumber.floorNumber, value: itemFloorNumber.floorNumber}));
  }
  const buildingFlatHeaders = [
    {id: 'flatCode', label: t('flatBuilding.flatCode'), type: 'string', editable: false, addable: false, filterable: true},
    {id: 'blockNumber', label: t('flatBuilding.blockNumber'), type: 'string', values: blockNumbers, editable: true, computedProps: () => ({ inputProps: { maxLength: 40 } })},
    {id: 'floorNumber', label: t('flatBuilding.floorNumber'), type: 'string', values: floorNumbers, editable: true, computedProps: () => ({ inputProps: { maxLength: 40 } })},
    {id: 'flatNumber', label: t('flatBuilding.flatNumber'), type: 'string', editable: true, computedProps: () => ({ inputProps: { maxLength: 40 } })},
    {id: 'actions'},
  ];

  const handleFilterChange = filter => {
    filter.flatCode ? setFilteredItems(filteredItems.filter(b => b.flatCode === filter.flatCode)) : setFilteredItems(building.buildingFlatDTOs);
  };
  const addBuildingFlat = buildingFlat => {
    const sentDto = TecRepBuildingRequestDtoGenerator.prepareForAddFlatBuildingDto(building, buildingFlat);
    TecrepBuildingService.addBuildingFlat(sentDto)
    .then(fetchBuilding)
    .catch(e => setNotification({visible: true, message: getErrorMessage(e)}));
  };

  const updateBuildingFlat = buildingFlat => {
    TecrepBuildingService.updateBuildingFlat(TecRepBuildingRequestDtoGenerator.prepareForUpdateBuildingFlat(buildingFlat))
    .then(fetchBuilding)
    .catch(e => setNotification({visible: true, message: getErrorMessage(e)}));
  };

  const deleteBuildingFlat = data => {
    TecrepBuildingService.deleteBuildingFlat(data.buildingFlatId)
    .then(fetchBuilding)
    .catch(e => setNotification({visible: true, message: getErrorMessage(e)}));
  };

  return (
    <PageBase
      title={t('building.flat.title')}
      actionButton={
      <OpenTplDialButton
        title={t('add.building.flat')}
        headers={buildingFlatHeaders.filter(h => h.editable || h.addable)}
        confirmProps={{label: t('add'), icon: <Add />}}
        cancelProps={{label: t('cancel'), icon: <Cancel />}}
        showProps={{icon: <Add />, label: t('add'), name: 'add'}}
        onConfirm={addBuildingFlat}
        autocloseOnConfirm
      />
    }>
      <TplEnhancedTable
        rows={filteredItems}
        headers={buildingFlatHeaders}
        rowMapper={item => {
          let mapped = Object.assign({}, item);
          mapped.flatCode = item ? item.flatCode : null;
          mapped.blockNumber = item ? item.blockNumber : null;
          mapped.floorNumber = item ? item.floorNumber : null;
          mapped.flatNumber = item ? item.flatNumber : null;
          mapped.actions = (
            <Grid container alignItems="center" wrap="nowrap">
              <Grid item>
                <TplActionButton
                  tooltipTitle={t('detail')}
                  icon={<Assignment />}
                  link={routePaths.buildingFlatInfo.replace(':buildingFlatId', item.buildingFlatId)} />
              </Grid>
              <Grid item>
                <TplEnhancedDialog
                  tooltipTitle={t('edit')}
                  title={t('edit.building.flat')}
                  headers={buildingFlatHeaders.filter(h => h.editable)}
                  initialValues={mapped}
                  confirmProps={{label: t('edit'), icon: <Edit />}}
                  cancelProps={{label: t('cancel'), icon: <Cancel />}}
                  showProps={{icon: <Edit />}}
                  onConfirm={updateBuildingFlat}
                  autocloseOnConfirm={false}
                />
              </Grid>
              <Grid item>
                <TplActionButton
                  tooltipTitle={t('historic.title')}
                  icon={<History />}
                  link={ROUTES.historic.path.replace(':entity', 'buildingFlat').replace(':id', item.buildingFlatId)} />
              </Grid>
              <Grid item>
                <TplEnhancedDialog
                  tooltipTitle={t('delete')}
                  title={t('delete.building.flat')}
                  initialValues={item}
                  confirmProps={{label: t('block.delete'), icon: <Delete />}}
                  cancelProps={{label: t('cancel'), icon: <Cancel />}}
                  showProps={{icon: <Delete color="error" />}}
                  onConfirm={deleteBuildingFlat}>
                  <DialogContentText>
                    {t('delete.building.flat.ask')}
                  </DialogContentText>
                </TplEnhancedDialog>
              </Grid>
            </Grid>
          );
          return [mapped, {}];
        }}
        filterable
        sortable
        onFilterChange={handleFilterChange}
        headerFreeContent={<ResetFilterButton onClick={() => handleFilterChange({})} />}
      />
      <Snackbar
        open={notification.visible}
        message={notification.message}
        autoHideDuration={4000}
        onClose={() => setNotification({...notification, visible: false})}
      />
    </PageBase>
  );
};

BuildingFlatManagerPage.propTypes = {
  building: PropTypes.object.isRequired,
  fetchBuilding: PropTypes.func.isRequired,
};
