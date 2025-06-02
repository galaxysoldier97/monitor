import React, { PropTypes } from 'react';
import { ServiceAccessWizardFieldType, ServiceComponentWizardFieldType } from '../../../config/UpdateWizardType';
import ServiceSelectionTable from '../../../components/selectionTables/ServiceSelectionTable';
import NumberSelectionTable from '../../../components/selectionTables/NumberSelectionTable';
import RangeNumberSelectionTable from '../../../components/selectionTables/RangeNumberSelectionTable';
import { t } from 'mt-react-library/functions';
import WizardFieldToEditSelector from '../../../components/WizardFieldToEditSelector';
import Grid from '@material-ui/core/Grid';
import {
  serviceRequestActionSelectOptions,
  ServiceRequestOptions,
  serviceRequestSelectOptions
} from '../../../config/service/serviceAccess/serviceAccessFields';

const ServiceComponentUpdateWizardStep2 = ({serviceComponent, values, onChange}) => {
  if (values.type === ServiceComponentWizardFieldType.ACCESS_SERVICE) {
    return <ServiceSelectionTable name="accessService" serviceId={serviceComponent.serviceAccessId} values={values} onChange={onChange}/>;
  }
  if (values.type === ServiceComponentWizardFieldType.NUMBER) {
    return <NumberSelectionTable number={serviceComponent.number} values={values} onChange={onChange}/>;
  }
  if (values.type === ServiceAccessWizardFieldType.RANGE) {
    return <RangeNumberSelectionTable mainRangeId={serviceComponent.mainRangeId} values={values} onChange={onChange}/>;
  }
  if (values.type === ServiceComponentWizardFieldType.STATUS_CHANGE) {
    const options = serviceComponent.serviceTransitions.map(serviceTransition => ({
      name: serviceTransition,
      label: t(`service.access.${serviceTransition}`)
    }));
    return (
      <WizardFieldToEditSelector
        name="status"
        label={t('service.access.action.select')}
        values={values}
        onChange={onChange}
        fields={options}
        type="select"
      />
    );
  }
  if (values.type === ServiceComponentWizardFieldType.REQUEST_CHANGE) {
    return (
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <WizardFieldToEditSelector
            name="requestAction"
            label={t('service.access.change.select.request')}
            values={values}
            onChange={onChange}
            fields={serviceRequestSelectOptions}
            type="select"
          />
        </Grid>
        {values.requestAction === ServiceRequestOptions.ADD_REQUEST && (
          <Grid item xs={12}>
            <WizardFieldToEditSelector
              name="selectedRequest"
              label={t('service.access.action.select')}
              values={values}
              onChange={onChange}
              fields={serviceRequestActionSelectOptions}
              type="select"
            />
          </Grid>
        )}
      </Grid>
    );
  }

  return null;
};

ServiceComponentUpdateWizardStep2.propTypes = {
  serviceComponent: PropTypes.object,
  values: PropTypes.object,
  onChange: PropTypes.func,
};

export default ServiceComponentUpdateWizardStep2;
