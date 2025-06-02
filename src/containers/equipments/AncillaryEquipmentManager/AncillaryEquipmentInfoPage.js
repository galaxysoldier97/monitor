import React, { PropTypes, useCallback, useEffect, useState } from 'react';
import PageBase from '../../../components/PageBase';
import { Box, Grid } from '@material-ui/core';
import { TplLoading } from 'mt-react-library/containers/templates';
import { t } from 'mt-react-library/functions';
import { InfoBloc } from '../../../components/InfoBloc';
import { AncillaryEquipmentActions } from './AncillaryEquipmentActions';
import { populateEntityInfoPageConfig } from '../../../helpers/entityHelper';
import { getAncillaryEquipmentDisplayMapper } from '../../../helpers/entityMapper';
import { ancillaryEquipmentFields } from '../../../config/equipment/ancillaryEquipment/ancillaryEquipmentFields';
import { useFetchEquipmentConfigs } from '../../../hooks/useFetchEquipmentConfigs';
import { useLocation } from 'react-router-dom';
import { getErrorMessage } from '../../../helpers/fetchHelper';
import TecrepAncillaryEquipmentsService from '../../../services/equipments/TecrepAncillaryEquipmentsService';
import { ErrorAlert } from '../../../components/ErrorAlert';

const AncillaryEquipmentInfoPage = () => {
  useFetchEquipmentConfigs();
  const [item, setItem] = useState({loading: true});
  const location = useLocation();
  const id = location.pathname.split('/')[2];

  const fetch = useCallback(() => {
    setItem({...item, loading: true, error: undefined});
    TecrepAncillaryEquipmentsService.getAncillaryEquipment(id)
    .then(res => setItem({loading: false, data: res}))
    .catch(err => setItem({loading: false, error: getErrorMessage(err)}));
  }, [id]);

  useEffect(() => fetch(), [fetch]);

  return (
    <PageBase title={t('ancillaryEquipment.info.title')}
              navigation={t('ancillaryEquipment.info.navigation')}
              backButton
              actionButton={!!item.data && <AncillaryEquipmentActions filteredDetail mapped={item.data} onActionPerformed={fetch} />}>
      {item.error && <ErrorAlert message={item.error} />}
      {item.loading && !item.error && <TplLoading />}
      {!item.loading && !item.error && <Box marginY={4}>
        <Grid container spacing={2}>
          {populateEntityInfoPageConfig(ancillaryEquipmentFields).map(field => <Grid item key={field.id} xs={12} sm={6} md={3}>
              <InfoBloc label={`ancillaryEquipment.${field.id}`} value={getAncillaryEquipmentDisplayMapper(item.data, field.id)} />
            </Grid>,
          )}
        </Grid>
      </Box>}
    </PageBase>
  );
};

export const ancillaryEqpmtPropType = () => (PropTypes.shape({
  accessType: PropTypes.string,
  batchNumber: PropTypes.string,
  category: PropTypes.string,
  equipmentId: PropTypes.number,
  equipmentName: PropTypes.string,
  events: PropTypes.arrayOf(PropTypes.string),
  externalNumber: PropTypes.string,
  independent: PropTypes.boolean,
  macAddress: PropTypes.string,
  model: PropTypes.shape({name: PropTypes.string}),
  nature: PropTypes.string,
  orderId: PropTypes.string,
  pairedEquipmentCategory: PropTypes.string,
  pairedEquipmentId: PropTypes.number,
  preactivated: PropTypes.boolean,
  provider: PropTypes.shape({id: PropTypes.number, name: PropTypes.string, providerAccessType: PropTypes.string}),
  recyclable: PropTypes.boolean,
  serialNumber: PropTypes.string,
  sfpVersion: PropTypes.string,
  status: PropTypes.string,
  warehouse: PropTypes.shape({warehouseId: PropTypes.number, name: PropTypes.string, resellerCode: PropTypes.string}),
}));

AncillaryEquipmentInfoPage.propTypes = {
  item: ancillaryEqpmtPropType,
};
export default AncillaryEquipmentInfoPage;
