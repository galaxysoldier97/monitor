import { TplActionButton, TplEnhancedDialog, TplEnhancedTable, TplLoading } from 'mt-react-library/containers/templates';
import React, { useCallback, useEffect, useState } from 'react';
import { t } from 'mt-react-library/functions';
import PageBase from '../../../components/PageBase';
import { Box, DialogContentText, Grid, Snackbar } from '@material-ui/core';
import { Add, Assignment, Cancel, CheckCircle, Delete, Edit, History, RadioButtonUnchecked } from '@material-ui/icons';
import { OpenTplDialButton } from '../../../components/buttons/OpenTplDialButton';
import { InfoBloc } from '../../../components/InfoBloc';
import { useLocation } from 'react-router-dom';
import { getErrorMessage } from '../../../helpers/fetchHelper';
import TecrepBuildingService from '../../../services/address/TecrepBuildingService';
import { routePaths, ROUTES } from '../../../config/routes';
import TecRepBuildingRequestDtoGenerator from '../../../services/address/TecRepBuildingRequestDtoGenerator';

const buildingFlatPtoHeaders = [
  {id: 'ptoCode', label: t('pto.ptoCode'), type: 'string', editable: false, filterable: true, addable: false},
  {id: 'ptoNumber', label: t('pto.ptoNumber'), type: 'number', editable: false, filterable: true, addable: true},
  {
    id: 'ptoCategory', label: t('pto.ptoCategory'), type: 'enum', values: [
      {key: 'PTO-1', value: 'PTO-1'},
      {key: 'PTO-2', value: 'PTO-2'},
      {key: 'PTO-4', value: 'PTO-4'},
    ], editable: true, filterable: true, addable: true,
  },
  {id: 'ptoLogo', label: t('pto.ptoDeployed'), type: 'boolean'},
  {id: 'ptoDeployed', label: t('pto.ptoDeployed'), hidden: true, type: 'boolean', editable: true, filterable: true, addable: true},
  {id: 'remark', label: t('pto.remark'), type: 'string', editable: true, filterable: true, addable: true},
  {id: 'actions'},
];

const BuildingFlatInfoPage = () => {
  const [item, setItem] = useState({loading: true});
  const location = useLocation();
  const buildingFlatId = location.pathname.split('/')[3];
  const [notification, setNotification] = useState({visible: false, message: ''});

  const fetch = useCallback(() => {
    setItem({...item, loading: true, error: undefined});
    TecrepBuildingService.getBuildingFlat(buildingFlatId)
    .then(res => setItem({loading: false, data: res}))
    .catch(err => setItem({loading: false, error: getErrorMessage(err)}));
  }, [buildingFlatId]);

  useEffect(fetch, [location.key]);

  if (!item.data) {
    return <TplLoading />;
  }

  const showDetailsDialog = item => {
    let details = {};
    for (let key in item) {
      if (!['events', 'externalRefFlatDTOs', 'ptos'].includes(key)) {
        details[key] = item[key];
      }
    }
    return details;
  };

  const addBuildingFlatPto = data => {
    TecrepBuildingService.addBuildingFlatPto(data, buildingFlatId)
    .then(fetch)
    .catch(e => setNotification({visible: true, message: getErrorMessage(e)}));
  };

  const updateBuildingFlatPto = data => {
    TecrepBuildingService.updateBuildingFlatPto(TecRepBuildingRequestDtoGenerator.prepareForUpdateBuildingFlatPto(data), buildingFlatId)
    .then(fetch)
    .catch(e => setNotification({visible: true, message: getErrorMessage(e)}));
  };

  const deleteBuildingFlatPto = data => {
    TecrepBuildingService.deleteBuildingFlatPto(data, buildingFlatId)
    .then(fetch)
    .catch(e => setNotification({visible: true, message: getErrorMessage(e)}));
  };

  const rowMapperPto = item => {
    let mapped = Object.assign({}, item);
    mapped.ptoCode = item ? item.ptoCode : null;
    mapped.ptoNumber = item ? item.ptoNumber : null;
    mapped.relatedBlock = item ? item.relatedBlock : null;
    mapped.relatedFloor = item ? item.relatedFloor : null;
    mapped.ptoCategory = item ? item.ptoCategory : null;
    mapped.ptoLogo = item.ptoDeployed ? <CheckCircle /> : <RadioButtonUnchecked />;
    mapped.remark = item ? item.remark : null;

    mapped.actions = (
      <Grid container alignItems="center" wrap="nowrap">
        <Grid item>
          <TplActionButton tooltipTitle={t('detail')}
                           icon={<Assignment />}
                           link={routePaths.buildingFlatPtoInfo.replace(':buildingFlatPtoId', item.ptoTechnicalId)} />
        </Grid>
        <Grid item>
          <TplEnhancedDialog
            tooltipTitle={t('edit')}
            title={t('edit.pto')}
            headers={buildingFlatPtoHeaders.filter(h => h.editable)}
            initialValues={mapped}
            confirmProps={{label: t('edit'), icon: <Edit />}}
            cancelProps={{label: t('cancel'), icon: <Cancel />}}
            showProps={{icon: <Edit />}}
            onConfirm={updateBuildingFlatPto}
            autocloseOnConfirm={false}
          />
        </Grid>
        <Grid item>
          <TplActionButton tooltipTitle={t('historic.title')}
                           icon={<History />}
                           link={ROUTES.historic.path.replace(':entity', 'pto').replace(':id', item.ptoTechnicalId)} />
        </Grid>
        <Grid item>
          <TplEnhancedDialog
            tooltipTitle={t('delete')}
            title={t('delete.pto')}
            initialValues={item}
            confirmProps={{label: t('block.delete'), icon: <Delete />}}
            cancelProps={{label: t('cancel'), icon: <Cancel />}}
            showProps={{icon: <Delete color="error" />}}
            onConfirm={deleteBuildingFlatPto}

          >
            <DialogContentText>
              {t('delete.buildingFlat.pto.ask')}
            </DialogContentText>
          </TplEnhancedDialog>
        </Grid>
      </Grid>
    );
    return [mapped, {}];
  };

  return (
    <>
      <PageBase title={t('buildingFlat.detail.title', <strong>{item.data.flatCode}</strong>)}
                navigation={t('buildingFlat.navigation')}
                backButton>
        <Box marginY={4}>
          <Grid container spacing={2}>
            {Object.entries(showDetailsDialog(item.data)).map(([key, value]) => {
              return (
                <Grid item key={key} xs={12} sm={6} md={3}>
                  <InfoBloc label={`buildingFlat.info.details.${key}`} value={value} />
                </Grid>
              );
            })}
          </Grid>
        </Box>
      </PageBase>
      <PageBase title="PTO : Optical Termination Point" actionButton={<OpenTplDialButton title={t('add.pto')}
                                                                                         headers={buildingFlatPtoHeaders.filter(h => h.editable || h.addable)}
                                                                                         confirmProps={{label: t('add'), icon: <Add />}}
                                                                                         cancelProps={{label: t('cancel'), icon: <Cancel />}}
                                                                                         showProps={{icon: <Add />, label: t('add'), name: 'add'}}
                                                                                         onConfirm={addBuildingFlatPto}
                                                                                         autocloseOnConfirm={false}
      />}>
        <TplEnhancedTable rows={item.data.ptos} headers={buildingFlatPtoHeaders}
                          rowMapper={rowMapperPto}
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

BuildingFlatInfoPage.propTypes = {};
export default BuildingFlatInfoPage;
