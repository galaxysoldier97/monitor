import React, { PropTypes } from 'react';
import { t } from 'mt-react-library/functions';
import WizardFieldToEditSelector from '../../../components/WizardFieldToEditSelector';
import { ServiceAccessWizardFieldType } from '../../../config/UpdateWizardType';

const ServiceAccessUpdateWizardStep1 = ({values, onChange, serviceAccess}) => {
  const {PARENT_SERVICE, SIM_CARD, CPE, ANCILLARY_EQUIPMENT,
    ACCESS_POINT, NUMBER, RANGE, STATUS_CHANGE, REQUEST_CHANGE} = ServiceAccessWizardFieldType;
  return (
    <WizardFieldToEditSelector
      name="type"
      values={values}
      onChange={onChange}
      fields={[
        {name: PARENT_SERVICE, label: t('service.access.change.parentService')},
        {name: SIM_CARD, label: t('service.access.change.simcard'), hidden: serviceAccess.serviceActivity !== 'MOBILE'},
        {name: CPE, label: t('service.access.change.cpe'), hidden: serviceAccess.serviceActivity !== 'INTERNET'},
        {name: ANCILLARY_EQUIPMENT, label: t('service.access.change.ancillaryEquipment')},
        {name: ACCESS_POINT, label: t('service.access.change.accessPoint'), hidden: serviceAccess.serviceActivity !== 'INTERNET'},
        {name: NUMBER, label: t('service.access.change.number')},
        {name: RANGE, label: t('service.access.change.range')},
        {name: STATUS_CHANGE, label: t('service.access.change.status')},
        {name: REQUEST_CHANGE, label: t('service.access.change.request')},
      ]}/>
  );
};

ServiceAccessUpdateWizardStep1.propTypes = {
  values: PropTypes.object,
  onChange: PropTypes.func,
  serviceAccess: PropTypes.object,
};

export default ServiceAccessUpdateWizardStep1;
