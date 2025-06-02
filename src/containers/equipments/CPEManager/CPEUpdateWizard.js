import React, { PropTypes, useState } from 'react';
import { TplActionButton } from 'mt-react-library/containers/templates';
import { t } from 'mt-react-library/functions';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import LowPriorityIcon from '@material-ui/icons/LowPriority';
import WizardDialog from '../../../components/WizardDialog';
import WizardUpdateTypeSelector from '../../../components/WizardUpdateTypeSelector';
import EquipmentUpdateWizardStatusSelector from '../../../components/EquipmentUpdateWizardStatusSelector';
import ServiceSelectionTable from '../../../components/selectionTables/ServiceSelectionTable';
import TecrepCpeService from '../../../services/equipments/TecrepCpeService';
import {
  beforeLoadingPreviousPage,
  shouldEqmNextButtonBeDisabled,
  shouldShowServicesPage, showNextButton, showSubmitButton
} from "../SimcardManager/SimCardUpdateWizard";
import {UpdateWizardType} from "../../../config/UpdateWizardType";

const initialValues = {
  type: UpdateWizardType.STATUS,
  status: '',
  orderId: '',
  service: undefined,
};

const CPEUpdateWizard = ({cpe, onUpdate}) => {
  const [open, setOpen] = useState(false);
  const [error, setError] = useState('');
  const [values, setValues] = useState(initialValues);
  const onChange = event => setValues({...values, [event.target.name]: event.target.value});

  const submit = () => {
    return TecrepCpeService.changeCPE(values, cpe).then(onUpdate).catch(err => {
      setError(err.response.data.message || err.response.data.errorMessage || err.response.data.error || t('error.wizardUpdate'));
      throw err;
    });
  };

  return (
    <>
      <TplActionButton tooltipTitle={t('change')} icon={<LowPriorityIcon/>} onClick={() => setOpen(true)}/>
      <WizardDialog
        key={`change-cpe-${cpe.equipmentId}`}
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
              <Typography variant="h6">{t('cpe.change.wizard')}</Typography>
              <Typography variant="subtitle1">{cpe.serialNumber}</Typography>
            </Grid>
            <Grid item><Typography>{page} / {shouldShowServicesPage(values) ? 3 : 2}</Typography></Grid>
          </Grid>
        )}
      >
        {page => (
          <>
            {page === 1 && <WizardUpdateTypeSelector onChange={onChange} values={values} />}
            {page === 2 && values.type === UpdateWizardType.STATUS && <EquipmentUpdateWizardStatusSelector values={values} onChange={onChange} equipment={cpe} />}
            {(page === 3 || (page === 2 && values.type === UpdateWizardType.SERVICE)) && <ServiceSelectionTable name="service" values={values} onChange={onChange} serviceId={cpe.serviceId} />}
          </>
        )}
      </WizardDialog>
    </>
  );
};

CPEUpdateWizard.propTypes = {
  cpe: PropTypes.object,
  onUpdate: PropTypes.func,
};

export default CPEUpdateWizard;
