import React, { PropTypes, useState } from 'react';
import { TplActionButton } from 'mt-react-library/containers/templates';
import { t } from 'mt-react-library/functions';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import LowPriorityIcon from '@material-ui/icons/LowPriority';
import WizardDialog from '../../../components/WizardDialog';
import TecrepSimCardService from '../../../services/equipments/TecrepSimCardService';
import ServiceSelectionTable from '../../../components/selectionTables/ServiceSelectionTable';
import WizardUpdateTypeSelector from "../../../components/WizardUpdateTypeSelector";
import {StatusChangeEnum} from "../../../config/StatusChangeEnum";
import {isEirCompany} from "../../../config/company";
import EquipmentUpdateWizardStatusSelector from "../../../components/EquipmentUpdateWizardStatusSelector";
import {UpdateWizardType} from "../../../config/UpdateWizardType";

const initialValues = {
  type: UpdateWizardType.STATUS,
  status: '',
  orderId: '',
  service: undefined,
};

export const shouldEqmNextButtonBeDisabled = (page, values) => {
  switch (page) {
    case 2:
      if (values.type === UpdateWizardType.STATUS) {
        return !values.status;
      } else if (values.type === UpdateWizardType.SERVICE) {
        return !values.service;
      }
      return false;
    case 3:
      if (values.type === UpdateWizardType.SERVICE) {
        return !values.service;
      }
      return false;
    default:
      return false;
  }
};

export const shouldShowServicesPage = values => [StatusChangeEnum.assign, StatusChangeEnum.activate].includes(values.status) && !isEirCompany();

export const showNextButton = (page, values) => {
  return values.type === UpdateWizardType.STATUS
    ? page < 2 || (shouldShowServicesPage(values) && page < 3)
    : page < 2;
};

export const showSubmitButton = (page, values) => {
  return values.type === UpdateWizardType.STATUS
    ? ((page === 2 && !shouldShowServicesPage(values)) || page === 3)
    : page === 2;
};

export const beforeLoadingPreviousPage = (page, values, setValues) => {
  if (page - 1 === 1) {
    setValues({...initialValues, type: values.type});
  } else if (page - 1 === 2) {
    setValues({...initialValues, status: values.status});
  }
};

const SimCardUpdateWizard = ({simCard, onUpdate}) => {
  const [open, setOpen] = useState(false);
  const [error, setError] = useState('');
  const [values, setValues] = useState(initialValues);
  const onChange = event => setValues({...values, [event.target.name]: event.target.value});

  const submit = () => {
    return TecrepSimCardService.changeSimCard(values, simCard).then(onUpdate).catch(err => {
      setError(err.response.data.message || err.response.data.errorMessage || err.response.data.error || t('error.wizardUpdate'));
      throw err;
    });
  };

  return (
    <>
      <TplActionButton tooltipTitle={t('change')} icon={<LowPriorityIcon/>} onClick={() => setOpen(true)}/>
      <WizardDialog
        key={simCard.imsiNumber + simCard.serviceId + simCard.status}
        open={open}
        onClose={() => setOpen(false)}
        setWidth={page => page === 3 || (page === 2 && values.type === UpdateWizardType.SERVICE) ? 'lg' : 'sm'}
        values={values}
        setValues={setValues}
        initialValues={initialValues}
        shouldDisableNext={page => shouldEqmNextButtonBeDisabled(page, values)}
        onSubmit={submit}
        error={error}
        resetError={() => setError('')}
        beforeLoadingPreviousPage={page => beforeLoadingPreviousPage(page, values, setValues)}
        showNextButton={page => showNextButton(page, values)}
        showSubmitButton={page => showSubmitButton(page, values)}
        title={page => (
          <Grid container justify="space-between">
            <Grid item>
              <Typography variant="h6">{t('simcard.change.wizard')}</Typography>
              <Typography variant="subtitle1">{`${simCard.serialNumber} / ${simCard.imsiNumber}`}</Typography>
            </Grid>
            <Grid item><Typography>{page} / {shouldShowServicesPage(values) ? 3 : 2}</Typography></Grid>
          </Grid>
        )}
      >
        {page => (
          <>
            {page === 1 && <WizardUpdateTypeSelector values={values} onChange={onChange} />}
            {page === 2 && values.type === UpdateWizardType.STATUS && <EquipmentUpdateWizardStatusSelector values={values} onChange={onChange} equipment={simCard} />}
            {(page === 3 || (page === 2 && values.type === UpdateWizardType.SERVICE)) && <ServiceSelectionTable name="service" values={values} onChange={onChange} serviceId={simCard.serviceId} />}
          </>
        )}
      </WizardDialog>
    </>
  );
};

SimCardUpdateWizard.propTypes = {
  simCard: PropTypes.object,
  onUpdate: PropTypes.func,
};

export default SimCardUpdateWizard;
