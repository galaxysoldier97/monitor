import React, { PropTypes, useState } from 'react';
import { TplActionButton } from 'mt-react-library/containers/templates';
import { t } from 'mt-react-library/functions';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import LowPriorityIcon from '@material-ui/icons/LowPriority';
import WizardDialog from '../../../components/WizardDialog';
import { ServiceComponentWizardFieldType } from '../../../config/UpdateWizardType';
import ServiceComponentUpdateWizardStep1 from './ServiceComponentUpdateWizardStep1';
import ServiceComponentUpdateWizardStep2 from './ServiceComponentUpdateWizardStep2';
import TecrepServiceComponentService from "../../../services/services/TecrepServiceComponentService";
import { ServiceRequestOptions } from '../../../config/service/serviceAccess/serviceAccessFields';

const initialValues = {
  type: ServiceComponentWizardFieldType.ACCESS_SERVICE,
  accessService: null,
  number: null,
  range: null,
  status: '',
  requestAction: '',
  selectedRequest: '',
};

const ServiceComponentUpdateWizard = ({serviceComponent, onUpdate}) => {
  const [open, setOpen] = useState(false);
  const [error, setError] = useState('');
  const [values, setValues] = useState(initialValues);
  const onChange = event => setValues({...values, [event.target.name]: event.target.value});

  const shouldNextButtonBeDisabled = page => {
    if (page === 2) {
      if (values.type === ServiceComponentWizardFieldType.ACCESS_SERVICE && values.accessService) {
        return serviceComponent.serviceAccessId === values.accessService.serviceId;
      }
      if (values.type === ServiceComponentWizardFieldType.NUMBER && values.number && serviceComponent.number) {
        return values.number.number === serviceComponent.number;
      }
      if (values.type === ServiceComponentWizardFieldType.RANGE && values.range && serviceComponent.mainRangeId) {
        return values.range.rangeId === serviceComponent.mainRangeId;
      }
      if (values.type === ServiceComponentWizardFieldType.STATUS_CHANGE) {
        return !values.status;
      }
      if (values.type === ServiceComponentWizardFieldType.REQUEST_CHANGE) {
        return !values.requestAction || values.requestAction === ServiceRequestOptions.ADD_REQUEST && !values.selectedRequest;
      }
    }
    return false;
  };

  const submit = () => {
    return TecrepServiceComponentService.changeComponentService(values, serviceComponent).then(onUpdate).catch(err => {
      setError(err.response.data.message || err.response.data.errorMessage || err.response.data.error || t('error.wizardUpdate'));
      throw err;
    });
  };

  const statusOrRequestChange = [ServiceComponentWizardFieldType.STATUS_CHANGE, ServiceComponentWizardFieldType.REQUEST_CHANGE].includes(values.type);

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
            <Grid item><Typography variant="h6">{t('service.component.edit')}</Typography></Grid>
            <Grid item><Typography>{page} / 2</Typography></Grid>
          </Grid>
        )}
      >
        {page => (
          <>
            {page === 1 && <ServiceComponentUpdateWizardStep1 values={values} onChange={onChange} />}
            {page === 2 && <ServiceComponentUpdateWizardStep2 values={values} onChange={onChange} serviceComponent={serviceComponent} />}
          </>
        )}
      </WizardDialog>
    </>
  );
};

ServiceComponentUpdateWizard.propTypes = {
  serviceComponent: PropTypes.object,
  onUpdate: PropTypes.func,
};

export default ServiceComponentUpdateWizard;
