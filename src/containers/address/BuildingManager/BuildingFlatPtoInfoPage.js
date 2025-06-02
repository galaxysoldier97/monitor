import {TplActionButton, TplEnhancedDialog, TplEnhancedTable, TplLoading} from 'mt-react-library/containers/templates';
import React, {useCallback, useEffect, useState} from 'react';
import {t} from 'mt-react-library/functions';
import PageBase from '../../../components/PageBase';
import {Box, DialogContentText, Grid, Snackbar} from '@material-ui/core';
import {Add, Cancel, Delete, Edit, History} from '@material-ui/icons';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import {unmUi} from '../../../data';
import {Link, useLocation} from 'react-router-dom';
import {OpenTplDialButton} from '../../../components/buttons/OpenTplDialButton';
import {InfoBloc} from '../../../components/InfoBloc';
import {BooleanInfoIcon} from '../../../components/BooleanInfoIcon';
import {routePaths, ROUTES} from '../../../config/routes';
import TecrepBuildingService from '../../../services/address/TecrepBuildingService';
import {getErrorMessage} from '../../../helpers/fetchHelper';
import TecRepBuildingRequestDtoGenerator from '../../../services/address/TecRepBuildingRequestDtoGenerator';

const buildingFlatPtoAccessPointHeaders = [
  {
    id: 'accessPointId',
    label: t('accessPoint.accessPointId'),
    type: 'string',
    editable: false,
    filterable: true,
    addable: false,
  },
  {
    id: 'accessPointNumber',
    label: t('accessPoint.accessPointNumber'),
    type: 'number',
    editable: false,
    filterable: true,
    addable: true,
  },
  {
    id: 'accessType', label: t('accessPoint.access.type'), type: 'enum', values: [
      {key: 'FTTH', value: 'FTTH'},
      {key: 'DOCSIS', value: 'DOCSIS'},
    ], editable: true, filterable: true,
  },
  {
    id: 'serviceId', label: t('accessPoint.access.serviceId'),
    type: 'string',
    editable: true,
    filterable: true,
  },
  {id: 'actions'},
];

const BuildingFlatPtoInfoPage = () => {
  const [item, setItem] = useState({loading: true});
  const location = useLocation();
  const ptoId = location.pathname.split('/')[4];
  const [notification, setNotification] = useState({visible: false, message: ''});

  const fetch = useCallback(() => {
    setItem({...item, loading: true, error: undefined});
    TecrepBuildingService.getBuildingFlatPto(ptoId)
      .then(res => setItem({loading: false, data: res}))
      .catch(err => setItem({loading: false, error: getErrorMessage(err)}));
  }, [ptoId]);

  useEffect(fetch, [location.key]);

  if (!item.data) {
    return <TplLoading/>;
  }

  const addAccessPoint = sentDto => {
    TecrepBuildingService.addBuildingFlatPtoAccessPoint(sentDto, ptoId, item.data.buildingFlatId)
      .then(fetch)
      .catch(e => setNotification({visible: true, message: getErrorMessage(e)}));
  };

  const editAccessPoint = sentDto => {
    TecrepBuildingService.updateBuildingFlatPtoAccessPoint(TecRepBuildingRequestDtoGenerator.prepareForUpdateBuildingFlatPtoAccessPoint(sentDto), item.data.buildingFlatId, ptoId, sentDto.accessPointTechnicalId)
      .then(fetch)
      .catch(e => setNotification({visible: true, message: getErrorMessage(e)}));
  };

  const deleteAccessPoint = sentDto => {
    TecrepBuildingService.deleteBuildingFlatPtoAccessPoint(item.data.buildingFlatId, ptoId, sentDto)
      .then(fetch)
      .catch(e => setNotification({visible: true, message: getErrorMessage(e)}));
  };
  const showDetailsDialog = item => {
    let details = {};
    for (let key in item) {
      if (!['events', 'accessPoints'].includes(key)) {
        if (key === 'ptoDeployed') {
          details[key] = <BooleanInfoIcon value={item[key]}/>;
        } else if (key === 'buildingFlatId') {
          details[key] =
            <Link to={routePaths.buildingFlatInfo.replace(':buildingFlatId', item[key])}>{item[key]}</Link>;
        } else {
          details[key] = item[key];
        }
      }
    }
    return details;
  };

  function newTab(accessIdentifier) {
    window.open(unmUi.access.url + '/identifier/' + accessIdentifier, '_blank');
  }

  return (
    <>
      <PageBase title={t('pto.detail.title', <strong>{item.data.ptoCode}</strong>)}
                navigation={t('pto.navigation')}
                backButton>
        <Box marginY={4}>
          <Grid container spacing={2}>
            {Object.entries(showDetailsDialog(item.data)).map(([key, value]) => {
              return (
                <Grid item key={key} xs={12} sm={6} md={3}>
                  <InfoBloc label={`pto.info.details.${key}`} value={value}/>
                </Grid>
              );
            })}
          </Grid>
        </Box>
      </PageBase>

      <PageBase title="Point d’accès" actionButton={<OpenTplDialButton
        title={t('add.accessPoint')}
        headers={buildingFlatPtoAccessPointHeaders.filter(h => h.editable || h.addable)}
        confirmProps={{label: t('add'), icon: <Add/>}}
        cancelProps={{label: t('cancel'), icon: <Cancel/>}}
        showProps={{icon: <Add/>, label: t('add'), name: 'add'}}
        onConfirm={addAccessPoint}
        autocloseOnConfirm={false}
      />}>
        <TplEnhancedTable rows={item.data.accessPoints} headers={buildingFlatPtoAccessPointHeaders}
                          rowMapper={item => {
                            let mapped = Object.assign({}, item);
                            mapped.accessPointId = item ? item.accessPointId : null;
                            mapped.accessPointNumber = item ? item.accessPointNumber : null;
                            mapped.accessType = item ? item.accessType : null;
                            mapped.serviceId = item ? <Link to={ROUTES.serviceInfo.path.replace(':serviceId', item.serviceId)}>{item.serviceId}</Link> : null;
                            mapped.actions = (
                              <div>
                                <TplEnhancedDialog
                                  tooltipTitle={t('edit')}
                                  title={t('edit.accessPoint')}
                                  headers={buildingFlatPtoAccessPointHeaders.filter(h => h.editable)}
                                  initialValues={mapped}
                                  confirmProps={{label: t('edit'), icon: <Edit/>}}
                                  cancelProps={{label: t('cancel'), icon: <Cancel/>}}
                                  showProps={{icon: <Edit/>}}
                                  onConfirm={editAccessPoint}
                                  autocloseOnConfirm={false}
                                />
                                <TplActionButton tooltipTitle={t('historic.title')}
                                                 icon={<History/>}
                                                 link={ROUTES.historic.path.replace(':entity', 'accessPoint').replace(':id', item.accessPointTechnicalId)}/>
                                <TplActionButton tooltipTitle={t('tooltip.details.access')} name="redirect"
                                                 icon={<ExitToAppIcon/>}
                                                 onClick={() => newTab(item.accessPointId)}/>
                                <TplEnhancedDialog
                                  tooltipTitle={t('delete')}
                                  title={t('delete.accessPoint')}
                                  initialValues={item}
                                  confirmProps={{label: t('block.delete'), icon: <Delete/>}}
                                  cancelProps={{label: t('cancel'), icon: <Cancel/>}}
                                  showProps={{icon: <Delete color="error"/>}}
                                  onConfirm={deleteAccessPoint}
                                >
                                  <DialogContentText>
                                    {t('delete.accessPoint.ask')}
                                  </DialogContentText>
                                </TplEnhancedDialog>
                              </div>
                            );
                            return [mapped, {}];
                          }}
                          sortable
        />
      </PageBase>
      <Snackbar
        open={notification.visible}
        message={notification.message}
        autoHideDuration={4000}
        onClose={() => setNotification({...notification, visible: false})}
      />
    </>
  );
};

BuildingFlatPtoInfoPage.propTypes = {};
export default BuildingFlatPtoInfoPage;
