import React  from 'react';
import PropTypes from 'prop-types';
import { ServiceAccessWizardFieldType } from '../../../config/UpdateWizardType';
import ServiceSelectionTable from '../../../components/selectionTables/ServiceSelectionTable';
import AccessPointSelectionTable from '../../../components/selectionTables/AccessPointSelectionTable';
import NumberSelectionTable from '../../../components/selectionTables/NumberSelectionTable';
import RangeNumberSelectionTable from '../../../components/selectionTables/RangeNumberSelectionTable';
import { t } from 'mt-react-library/functions';
import WizardFieldToEditSelector from '../../../components/WizardFieldToEditSelector';
import Grid from '@material-ui/core/Grid';
import { serviceRequestActionSelectOptions, ServiceRequestOptions, serviceRequestSelectOptions } from '../../../config/service/serviceAccess/serviceAccessFields';
import EquipmentSelectionTable, { EquipmentCategory } from "../../../components/selectionTables/EquipmentSelectionTable";

const ServiceAccessUpdateWizardStep2 = ({serviceAccess, values, onChange}) => {
  const {PARENT_SERVICE, SIM_CARD, CPE, ANCILLARY_EQUIPMENT,
    ACCESS_POINT, NUMBER, RANGE, STATUS_CHANGE, REQUEST_CHANGE} = ServiceAccessWizardFieldType;

  switch(values.type){
    case PARENT_SERVICE:{
      const serviceId = serviceAccess.parentServiceAccess && serviceAccess.parentServiceAccess.serviceId;
      return <ServiceSelectionTable name="parentService" serviceId={serviceId} values={values} onChange={onChange}/>;
    }
    case SIM_CARD:
      return <EquipmentSelectionTable name="simCard" type={EquipmentCategory.simCard} equipmentId={serviceAccess.equipmentId} onChange={onChange} values={values}/>;
    case CPE:
      return <EquipmentSelectionTable name="cpe" type={EquipmentCategory.cpe} equipmentId={serviceAccess.equipmentId} onChange={onChange} values={values}/>;
    case ANCILLARY_EQUIPMENT:
      return <EquipmentSelectionTable name="ancillaryEquipment" type={EquipmentCategory.ancillaryEquipment} equipmentId={serviceAccess.equipmentId} onChange={onChange} values={values} initialFilter={{independentFilter:"true"}}/>;
    case ACCESS_POINT:
      return <AccessPointSelectionTable accessPointId={serviceAccess.accessPointId} values={values} onChange={onChange}/>;
    case NUMBER:
      return <NumberSelectionTable number={serviceAccess.number} values={values} onChange={onChange}/>;
    case RANGE:
      return <RangeNumberSelectionTable mainRangeId={serviceAccess.mainRangeId} values={values} onChange={onChange}/>;
    case STATUS_CHANGE:{
      const options = serviceAccess.serviceTransitions.map(serviceTransition => ({
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
    case REQUEST_CHANGE:
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
    default:
      return null;
  }
};

ServiceAccessUpdateWizardStep2.propTypes = {
  serviceAccess: PropTypes.object,
  values: PropTypes.object,
  onChange: PropTypes.func,
};

export default ServiceAccessUpdateWizardStep2;
