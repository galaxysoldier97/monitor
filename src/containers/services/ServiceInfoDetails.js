import { Box, Grid } from '@material-ui/core';
import React from 'react';
import { serviceInfoPropType } from './ServiceAccessManager/ServiceInfoPage';
import { InfoBloc } from '../../components/InfoBloc';
import ServiceComponentPreview from './ServiceComponentManager/ServiceComponentPreview';
import { populateEntityInfoPageConfig } from '../../helpers/entityHelper';
import { getServiceDisplayMapper } from '../../helpers/entityMapper';
import { serviceAccessFields } from '../../config/service/serviceAccess/serviceAccessFields';
import { serviceComponentFields } from '../../config/service/serviceComponent/serviceComponentFields';

const ServiceInfoDetails = ({item}) => {
  const servFields = item.serviceCategory === 'COMPONENT' ? serviceComponentFields : serviceAccessFields;

  return (
    <Box marginY={4}>
      <Grid container spacing={2}>
        {populateEntityInfoPageConfig(servFields).map(field => <Grid item key={field.id} xs={12} sm={6} md={3} xl={2}>
            <InfoBloc label={`service.${field.id}`} value={getServiceDisplayMapper(item, field.id)} />
          </Grid>,
        )}
        <Grid item xs={12}>
          <Grid container spacing={2}>
            {item.serviceComponents && item.serviceComponents.map(sc => (
              <Grid item key={sc.serviceId} xs={12} sm={6} md={3} xl={2}>
                <ServiceComponentPreview serviceComponent={sc} />
              </Grid>))}
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
};

ServiceInfoDetails.propTypes = {
  item: serviceInfoPropType,
};

export default ServiceInfoDetails;
