import React, { PropTypes, useCallback, useEffect, useState } from 'react';
import PageBase from '../../../components/PageBase';
import { Box, Grid } from '@material-ui/core';
import { TplLoading } from 'mt-react-library/containers/templates';
import { t } from 'mt-react-library/functions';
import AncillaryEquipmentManagerPage from '../AncillaryEquipmentManager/AncillaryEquipmentManagerPage';
import { InfoBloc } from '../../../components/InfoBloc';
import { CPEActions } from './CPEActions';
import { populateEntityInfoPageConfig } from '../../../helpers/entityHelper';
import { getCpeDisplayMapper } from '../../../helpers/entityMapper';
import { cpeFields } from '../../../config/equipment/cpe/cpeFields';
import { useFetchEquipmentConfigs } from '../../../hooks/useFetchEquipmentConfigs';
import { useLocation } from 'react-router-dom';
import { getErrorMessage } from '../../../helpers/fetchHelper';
import TecrepCpeService from '../../../services/equipments/TecrepCpeService';
import { ErrorAlert } from '../../../components/ErrorAlert';

const CPEInfoPage = () => {
  useFetchEquipmentConfigs();
  const [item, setItem] = useState({loading: true});
  const location = useLocation();
  const id = location.pathname.split('/')[2];

  const fetch = useCallback(() => {
    setItem({...item, loading: true, error: undefined});
    TecrepCpeService.getCPE(id)
    .then(res => setItem({loading: false, data: res}))
    .catch(err => setItem({loading: false, error: getErrorMessage(err)}));
  }, [id]);

  useEffect(() => fetch(), [fetch]);

  return (
    <>
      <PageBase title={t('cpe.info.title')}
                navigation={t('cpe.info.navigation')}
                backButton
                actionButton={!!item.data && <CPEActions filteredCpe={item.data} mapped={item.data} onActionPerformed={fetch} />}>
        {item.error && <ErrorAlert message={item.error} />}
        {item.loading && !item.error && <TplLoading />}
        {!item.loading && !item.error && <Box marginY={4}>
          <Grid container spacing={2}>
            {populateEntityInfoPageConfig(cpeFields).map(field => <Grid item key={field.id} xs={12} sm={6} md={3}>
                <InfoBloc label={`cpe.${field.id}`} value={getCpeDisplayMapper(item.data, field.id)} />
              </Grid>,
            )}
          </Grid>
        </Box>}
      </PageBase>
      {item.data && <AncillaryEquipmentManagerPage filteredEq />}
    </>
  );
};

CPEInfoPage.propTypes = {
  item: PropTypes.shape({
    accessType: PropTypes.string,
    ancillaryequipments: PropTypes.arrayOf(PropTypes.object),
    batchNumber: PropTypes.string,
    category: PropTypes.string,
    chipsetId: PropTypes.string,
    equipmentId: PropTypes.number,
    events: PropTypes.arrayOf(PropTypes.string),
    externalNumber: PropTypes.string,
    hwVersion: PropTypes.string,
    macAddress4G: PropTypes.string,
    macAddress5G: PropTypes.string,
    macAddressCpe: PropTypes.string,
    macAddressLan: PropTypes.string,
    macAddressRouter: PropTypes.string,
    macAddressVoip: PropTypes.string,
    model: PropTypes.shape({name: PropTypes.string}),
    nature: PropTypes.string,
    orderId: PropTypes.string,
    preactivated: PropTypes.boolean,
    providers: PropTypes.shape({
      name: PropTypes.string,
      providerAccessType: PropTypes.string,
      id: PropTypes.number,
    }),
    recyclable: PropTypes.boolean,
    serialNumber: PropTypes.string,
    serviceId: PropTypes.number,
    status: PropTypes.string,
    warehouses: PropTypes.shape({
      name: PropTypes.string,
      resellerCode: PropTypes.string,
      id: PropTypes.number,
    }),
  }),
};
export default CPEInfoPage;
