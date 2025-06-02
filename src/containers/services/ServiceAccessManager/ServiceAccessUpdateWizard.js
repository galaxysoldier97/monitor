import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { TplActionButton } from 'mt-react-library/containers/templates';
import { t } from 'mt-react-library/functions';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import LowPriorityIcon from '@material-ui/icons/LowPriority';
import WizardDialog from '../../../components/WizardDialog';
import { ServiceAccessWizardFieldType } from '../../../config/UpdateWizardType';
import ServiceAccessUpdateWizardStep1 from './ServiceAccessUpdateWizardStep1';
import ServiceAccessUpdateWizardStep2 from './ServiceAccessUpdateWizardStep2';
import TecrepServiceAccessService from '../../../services/services/TecrepServiceAccessService';
import { ServiceRequestOptions } from '../../../config/service/serviceAccess/serviceAccessFields';


const initialValues = {
  type: ServiceAccessWizardFieldType.PARENT_SERVICE,
  parentService: null,
  simCard: null,
  number: null,
  range: null,
  cpe: null,
  ancillaryEquipment: null,
  accessPoint: null,
  status: '',
  requestAction: '',
  selectedRequest: '',
};

const ServiceAccessUpdateWizard = ({serviceAccess, onUpdate}) => {
  const [open, setOpen] = useState(false);
  const [error, setError] = useState('');
  const [values, setValues] = useState(initialValues);
  const onChange = event => setValues({...values, [event.target.name]: event.target.value});

  const shouldNextButtonBeDisabled = page => {
    const {PARENT_SERVICE, SIM_CARD, CPE, ANCILLARY_EQUIPMENT,
      ACCESS_POINT, NUMBER, RANGE, STATUS_CHANGE, REQUEST_CHANGE} = ServiceAccessWizardFieldType;

    if (page === 2) {
      if (values.type === PARENT_SERVICE && values.parentService && serviceAccess.parentServiceAccess) {
        return serviceAccess.parentServiceAccess.serviceId === values.parentService.serviceId;
      }
      if (values.type === SIM_CARD && values.simCard && serviceAccess.equipmentId) {
        return values.simCard.equipmentId === serviceAccess.equipmentId;
      }
      if (values.type === CPE && values.cpe && serviceAccess.equipmentId) {
        return values.cpe.equipmentId === serviceAccess.equipmentId;
      }
      if (values.type === ANCILLARY_EQUIPMENT && values.ancillaryEquipment && serviceAccess.equipmentId) {
        return values.ancillaryEquipment.equipmentId === serviceAccess.equipmentId;
      }
      if (values.type === ACCESS_POINT && values.accessPoint && serviceAccess.accessPointId) {
        return values.accessPoint.accessPointId === serviceAccess.accessPointId;
      }
      if (values.type === NUMBER && values.number && serviceAccess.number) {
        return values.number.number === serviceAccess.number;
      }
      if (values.type === RANGE && values.range && serviceAccess.mainRangeId) {
        return values.range.rangeId === serviceAccess.mainRangeId;
      }
      if (values.type === STATUS_CHANGE) {
        return !values.status;
      }
      if (values.type === REQUEST_CHANGE) {
        return !values.requestAction || values.requestAction === ServiceRequestOptions.ADD_REQUEST && !values.selectedRequest;
      }
    }
    return false;
  };

  const submit = () => {
    return TecrepServiceAccessService.changeAccessService(values, serviceAccess).then(onUpdate).catch(err => {
      setError(err.response.data.message || err.response.data.errorMessage || err.response.data.error || t('error.wizardUpdate'));
      throw err;
    });
  };

  const statusOrRequestChange = [ServiceAccessWizardFieldType.STATUS_CHANGE, ServiceAccessWizardFieldType.REQUEST_CHANGE].includes(values.type);

  return (
    <>
      <TplActionButton tooltipTitle={t('change')} icon={<LowPriorityIcon/>} onClick={() => setOpen(true)}/>
      <WizardDialog
        open={open}
        onClose={() => setOpen(false)}
        setWidth={page => page !== 2 || statusOrRequestChange ? 'sm' : 'lg'}
        values={values}
        setValues={setValues}
        initialValues={initialValues}
        shouldDisableNext={shouldNextButtonBeDisabled}
        onSubmit={submit}
        error={error}
        resetError={() => setError('')}
        beforeLoadingPreviousPage={() => setValues({...initialValues, type: values.type})}
        showNextButton={page => page < 2}
        showSubmitButton={page => page === 2}
        title={page => (
          <Grid container justify="space-between" alignItems="center">
            <Grid item><Typography variant="h6">{t('service.access.change')}</Typography></Grid>
            <Grid item><Typography>{page} / 2</Typography></Grid>
          </Grid>
        )}
      >
        {page => (
          <>
            {page === 1 && <ServiceAccessUpdateWizardStep1 values={values} onChange={onChange} serviceAccess={serviceAccess} />}
            {page === 2 && <ServiceAccessUpdateWizardStep2 values={values} onChange={onChange} serviceAccess={serviceAccess} />}
          </>
        )}
      </WizardDialog>
    </>
  );
};

ServiceAccessUpdateWizard.propTypes = {
  serviceAccess: PropTypes.object,
  onUpdate: PropTypes.func,
};

export default ServiceAccessUpdateWizard;
