import React, { PropTypes } from 'react';
import { t } from 'mt-react-library/functions';
import WizardFieldToEditSelector from '../../../components/WizardFieldToEditSelector';
import { ServiceComponentWizardFieldType } from '../../../config/UpdateWizardType';

const ServiceComponentUpdateWizardStep1 = ({values, onChange}) => {
  return (
    <WizardFieldToEditSelector name="type" values={values} onChange={onChange} fields={[
      {name: ServiceComponentWizardFieldType.ACCESS_SERVICE, label: t('service.component.change.accessService')},
      {name: ServiceComponentWizardFieldType.NUMBER, label: t('service.access.change.number')},
      {name: ServiceComponentWizardFieldType.RANGE, label: t('service.access.change.range')},
      {name: ServiceComponentWizardFieldType.STATUS_CHANGE, label: t('service.access.change.status')},
      {name: ServiceComponentWizardFieldType.REQUEST_CHANGE, label: t('service.access.change.request')},
    ]} />
  );
};

ServiceComponentUpdateWizardStep1.propTypes = {
  values: PropTypes.object,
  onChange: PropTypes.func,
};

export default ServiceComponentUpdateWizardStep1;
