import React, { useState } from 'react';
import PageBase from '../../../components/PageBase';
import { t } from 'mt-react-library/functions';
import { TplActionButton, TplEnhancedDialog, TplEnhancedTable } from 'mt-react-library/containers/templates';
import { OpenTplDialButton } from '../../../components/buttons/OpenTplDialButton';
import PropTypes from 'prop-types';
import { ROUTES } from '../../../config/routes';
import * as moment from 'moment';
import { Add, Cancel, Delete, Edit, History } from '@material-ui/icons';
import { DialogContentText, Grid, Snackbar } from '@material-ui/core';
import { getErrorMessage } from '../../../helpers/fetchHelper';
import TecRepBuildingRequestDtoGenerator from '../../../services/address/TecRepBuildingRequestDtoGenerator';
import TecrepBuildingService from '../../../services/address/TecrepBuildingService';

const deploymentStatusHeaders = [
  {
    id: 'accessType', label: t('building.status.access.type'), type: 'enum', values: [
      {key: 'FTTH', value: 'FTTH'},
      {key: 'DOCSIS', value: 'DOCSIS'},
    ], editable: true, filterable: true,
  },
  {
    id: 'horDeployStatus', label: t('building.status.horizontal.status'), type: 'enum', values: [
      {key: 'PROJECT_STARTED', value: t('deploy.status.horDeployStatus.project.started')},
      {key: 'DEPLOYMENT_DONE', value: t('deploy.status.horDeployStatus.deployment.done')},
      {key: 'DEPLOYMENT_STARTED', value: t('deploy.status.horDeployStatus.deployment.started')},
      {key: 'DEPLOYMENT_CONNECTED', value: t('deploy.status.horDeployStatus.deployment.connected')},
    ], editable: true,
  },
  {
    id: 'verDeployStatus', label: t('building.status.vertical.status'), type: 'enum', values: [
      {key: 'PROJECT_STARTED', value: t('deploy.status.verDeployStatus.project.started')},
      {key: 'PROJECT_DONE', value: t('deploy.status.verDeployStatus.project.done')},
      {key: 'DEPLOYMENT_DONE', value: t('deploy.status.verDeployStatus.deployment.done')},
      {key: 'PROJECT_VALIDATED', value: t('deploy.status.verDeployStatus.project.validated')},
    ], editable: true,
  },
  {
    id: 'deploymentStatus', label: t('building.status.deploy.status'), type: 'enum', values: [
      {key: 'PROJECT_STARTED', value: t('deploy.status.deploy.project.started')},
      {key: 'DEPLOYMENT_DONE', value: t('deploy.status.deploy.deployment.done')},
      {key: 'DEPLOYMENT_STARTED', value: t('deploy.status.deploy.deployment.started')},
    ], editable: false,
  },
  {id: 'expectedDeployD', label: t('building.status.expectedDeploy'), hidden: true, type: 'date', editable: true, addable: true},
  {id: 'expectedDeployS', label: t('building.status.expectedDeploy'), type: 'string'},
  {id: 'specificity', label: t('building.status.specificity'), type: 'string', editable: true},
  {id: 'actions'},
];

export const BuildingDeployStatusManagerPage = ({building, fetchBuilding}) => {
  const [notification, setNotification] = useState({visible: false, message: ''});

   const addDeploymentStatus = data => {
     const sentDto = TecRepBuildingRequestDtoGenerator.prepareForAddDeployStatus(building, data);
     TecrepBuildingService.addBuildingStatus(sentDto)
     .then(fetchBuilding)
     .catch(e => setNotification({visible: true, message: getErrorMessage(e)}));
   };

  const updateDeploymentStatus = deploymentStatus => {
    if (deploymentStatus.expectedDeployD != null) {
      deploymentStatus.expectedDeploy = deploymentStatus.expectedDeployD;
    } else {
      deploymentStatus.expectedDeploy = null;
    }
    TecrepBuildingService.updateDeploymentStatus(TecRepBuildingRequestDtoGenerator.prepareForUpdateDeployStatus(deploymentStatus))
    .then(fetchBuilding)
    .catch(e => setNotification({visible: true, message: getErrorMessage(e)}));
  };

  const deleteDeploymentStatus = data => {
    TecrepBuildingService.deleteDeploymentStatus(data.buildingStatusId)
    .then(fetchBuilding)
    .catch(e => setNotification({visible: true, message: getErrorMessage(e)}));
  };

  return (
    <PageBase title={t('building.status.deploy.status')} actionButton={<OpenTplDialButton title={t('add.building.status')}
                                                                                            headers={deploymentStatusHeaders.filter(h => h.editable || h.addable)}
                                                                                            confirmProps={{label: t('add'), icon: <Add />}}
                                                                                            cancelProps={{label: t('cancel'), icon: <Cancel />}}
                                                                                            showProps={{icon: <Add />, label: t('add'), name: 'add'}}
                                                                                            onConfirm={addDeploymentStatus}
                                                                                            autocloseOnConfirm
      />}>
              <TplEnhancedTable rows={building.buildingStatusDTOs} headers={deploymentStatusHeaders}
                          rowMapper={item => {
                            let mapped = Object.assign({}, item);
                            mapped.accessType = item ? item.accessType : null;
                            mapped.horDeployStatus = item ? item.horDeployStatus : null;
                            mapped.verDeployStatus = item ? item.verDeployStatus : null;
                            mapped.deploymentStatus = item ? item.deploymentStatus : null;
                            mapped.expectedDeployD = item && item.expectedDeploy != null ? moment(moment(item.expectedDeploy).format('DD/MM/YYYY'), 'DD/MM/YYYY').add(1, 'day') : null;
                            mapped.expectedDeployS = item && item.expectedDeploy != null ? moment(item.expectedDeploy).format('DD/MM/YYYY') : null;
                            mapped.specificity = item ? item.specificity : null;
                            mapped.actions = (
                              <Grid container alignItems="center" wrap="nowrap">
                                <Grid item>
                                  <TplEnhancedDialog
                                    tooltipTitle={t('edit')}
                                    title={t('edit.building.status')}
                                    headers={deploymentStatusHeaders.filter(h => h.editable)}
                                    initialValues={mapped}
                                    confirmProps={{label: t('edit'), icon: <Edit />}}
                                    cancelProps={{label: t('cancel'), icon: <Cancel />}}
                                    showProps={{icon: <Edit />}}
                                    onConfirm={updateDeploymentStatus}
                                    autocloseOnConfirm={false}
                                  />
                                </Grid>
                                <Grid item>
                                  <TplActionButton tooltipTitle={t('historic.title')}
                                                   icon={<History />}
                                                   link={ROUTES.historic.path.replace(':entity', 'buildingStatus').replace(':id', item.buildingStatusId)} />
                                </Grid>
                                <Grid item>
                                  <TplEnhancedDialog tooltipTitle={t('delete')}
                                                     title={t('delete.building.status')}
                                                     initialValues={item}
                                                     confirmProps={{label: t('block.delete'), icon: <Delete />}}
                                                     cancelProps={{label: t('cancel'), icon: <Cancel />}}
                                                     showProps={{icon: <Delete color="error" />}}
                                                     onConfirm={deleteDeploymentStatus}
                                  >
                                    <DialogContentText>
                                      {t('delete.building.status.ask')}
                                    </DialogContentText>
                                  </TplEnhancedDialog>
                                </Grid>
                              </Grid>
                            );
                            return [mapped, {}];
                          }}
                          sortable
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

BuildingDeployStatusManagerPage.propTypes = {
  building: PropTypes.object.isRequired,
  fetchBuilding: PropTypes.func.isRequired
};
