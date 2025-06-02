import React, { useCallback, useEffect, useState } from 'react';
import PageBase from '../../../components/PageBase';
import { Box, Grid, Snackbar } from '@material-ui/core';
import { TplEnhancedTable, TplLoading } from 'mt-react-library/containers/templates';
import { t } from 'mt-react-library/functions';
import { InfoBloc } from '../../../components/InfoBloc';
import { populateEntityInfoPageConfig } from '../../../helpers/entityHelper';
import { buildingFields } from '../../../config/adresses/postalAddress/buildingFields';
import { useLocation } from 'react-router-dom';
import { getErrorMessage } from '../../../helpers/fetchHelper';
import TecrepBuildingService from '../../../services/address/TecrepBuildingService';
import { BuildingFlatManagerPage } from './BuildingFlatManagerPage';
import { BuildingDeployStatusManagerPage } from './BuildingDeployStatusManagerPage';
import { postalAddressRowMapper } from '../PostalAddressManager/PostalAdressManagerPage';
import BuildingAddAddressWizard from './BuildingAddAddressWizard';

const buildingPostalAddressHeaders = [
  {id: 'streetNumber', label: t('postal.address.street.number'), type: 'number', editable: false, filterable: true},
  {
    id: 'streetQualifier', label: t('postal.address.street.qualifier'), type: 'enum', values: [
      {key: '', value: '__'},
      {key: 'BIS', value: 'BIS'},
      {key: 'TER', value: 'TER'},
      {key: 'A', value: 'A'},
    ], editable: false,
  },
  {id: 'streetName', label: t('postal.address.street.name'), type: 'string', editable: true},
  {id: 'district', label: t('postal.address.district'), type: 'string', editable: true},
  {id: 'sector', label: t('postal.address.sector'), type: 'number', editable: false},
  {id: 'buildingBlock', label: t('postal.address.building.block'), type: 'number', editable: true},
  {
    id: 'buildingType', label: t('postal.address.building.type'), type: 'enum', values: [
      {key: '', value: 'Tous'},
      {key: 'HOUSE', value: 'HOUSE'},
      {key: 'BLOCK_OF_FLATS', value: 'BLOCK_OF_FLATS'},
    ], editable: true,
  },
  {id: 'mainFlag', label: t('postal.address.main.flag'), type: 'boolean', editable: false},
  {id: 'actions'},
];

const infoConfig = [{id: 'buildingId'}, ...populateEntityInfoPageConfig(buildingFields)];

const BuildingInfoPage = () => {
  const [item, setItem] = useState({loading: true});
  const location = useLocation();
  const buildingId = location.pathname.split('/')[2];
  const [notification, setNotification] = useState({visible: false, message: ''});

  const fetch = useCallback(() => {
    setItem({...item, loading: true, error: undefined});
    TecrepBuildingService.getBuilding(buildingId)
    .then(res => setItem({loading: false, data: res}))
    .catch(err => setItem({loading: false, error: getErrorMessage(err)}));
  }, [buildingId]);

  useEffect(fetch, [location.key]);

  if (!item.data) {
    return <TplLoading />;
  }

  const deletePostalAddress = data => {
    TecrepBuildingService.deletePostalAddress(data.postalAddressId)
    .then(fetch)
    .catch(e => setNotification({visible: true, message: getErrorMessage(e)}));
  };

  return (
    <>
      <PageBase title={t('building.detail.title', <strong>{item.data.buildingCode}</strong>)}
                navigation={t('building.navigation')}
                backButton>
        <Box marginY={4}>
          <Grid container spacing={2}>
            {infoConfig.map(field => <Grid item key={field.id} xs={12} sm={6} md={3}>
              <InfoBloc label={`building.info.details.${field.id}`} value={item.data[field.id]} />
            </Grid>)}
          </Grid>
        </Box>
      </PageBase>
      <PageBase title={t('postal.address.title')} actionButton={<BuildingAddAddressWizard building={item.data} onAdd={fetch} />}>
        <TplEnhancedTable rows={item.data.postalAddressDTOs}
                          headers={buildingPostalAddressHeaders}
                          rowMapper={item => postalAddressRowMapper(item, deletePostalAddress)}
                          sortable
        />
      </PageBase>
      <BuildingDeployStatusManagerPage building={item.data} fetchBuilding={fetch} />
      <BuildingFlatManagerPage building={item.data} fetchBuilding={fetch} />
      <Snackbar
        open={notification.visible}
        message={notification.message}
        autoHideDuration={4000}
        onClose={() => setNotification({...notification, visible: false})}
      />
    </>
  );
};

BuildingInfoPage.propTypes = {};
export default BuildingInfoPage;
