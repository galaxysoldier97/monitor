import React, {PropTypes, useState} from 'react';
import {TplActionButton} from 'mt-react-library/containers/templates';
import {t, isEmpty} from 'mt-react-library/functions';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import LowPriorityIcon from '@material-ui/icons/LowPriority';
import WizardDialog from '../../../components/WizardDialog';
import { shouldShowServicesPage } from "../SimcardManager/SimCardUpdateWizard";
import TecrepAncillaryEquipmentsService from "../../../services/equipments/TecrepAncillaryEquipmentsService";
import WizardFieldToEditSelector from "../../../components/WizardFieldToEditSelector";
import EquipmentUpdateWizardStatusSelector from "../../../components/EquipmentUpdateWizardStatusSelector";
import EquipmentSelectionTable from "../../../components/selectionTables/EquipmentSelectionTable";
import {UpdateWizardType} from "../../../config/UpdateWizardType";
import ServiceSelectionTable from "../../../components/selectionTables/ServiceSelectionTable";

const initialValues = {
  type: UpdateWizardType.STATUS,
  status: '',
  orderId: '',
  pairedCategory: '',
  pairedEquipment: undefined,
};

export const shouldShowPairingRadios = (values, equipment) => shouldShowServicesPage(values) && equipment.category === 'ANCILLARY' && isEmpty(equipment.pairedEquipmentId);
export const shouldShowEquipmentPage = (values, equipment) => shouldShowPairingRadios(values, equipment) && values.pairedCategory !== '';

const showAncillaryNextButton = (page, values, equipment) => {
  return values.type === UpdateWizardType.STATUS || values.type === UpdateWizardType.SERVICE
    ? page < 2 || (shouldShowEquipmentPage(values, equipment) && page < 3)
    : page < 3;
};

const showAncillarySubmitButton = (page, values, equipment) => {
  return values.type === UpdateWizardType.STATUS || values.type === UpdateWizardType.SERVICE
    ? ((page === 2 && !shouldShowEquipmentPage(values, equipment)) || page === 3)
    : page === 3;
};

const beforeLoadingAncillaryPreviousPage = (page, values, setValues) => {
  if (page === 0) {
    setValues({...initialValues, type: values.type});
  } else if (page === 1) {
    setValues({...initialValues, type: values.type, pairedCategory: values.pairedCategory, status: values.status});
  }
};

const AncillaryEquipmentUpdateWizard = ({equipment, onUpdate}) => {
  const [open, setOpen] = useState(false);
  const [error, setError] = useState('');
  const [values, setValues] = useState(initialValues);
  const onChange = event => setValues({...values, [event.target.name]: event.target.value});
  const WizardEditSelectorFields = [
    {name: UpdateWizardType.STATUS, label: t('status')},
    {name: UpdateWizardType.EQUIPMENT, label: t('ancillaryEquipment.change.pairedEquipment')},
    {name: UpdateWizardType.SERVICE, label: t('ancillaryEquipment.change.service')}
  ];
  const shouldAncillaryNextButtonBeDisabled = page => {
    switch (page) {
      case 1:
        if (!equipment.independent) {
          setError(t('ancillaryEquipment.change.paired.equipment.error'));
          return true;
        }
        break;
      case 2:
        if (values.type === UpdateWizardType.STATUS) {
          return !values.status;
        } else if (values.type === UpdateWizardType.EQUIPMENT) {
          return !values.pairedCategory;
        }
        break;
      default:
        return false;
    }
  };

  const submit = () => {
    if(values.type === UpdateWizardType.STATUS){
      return TecrepAncillaryEquipmentsService.updateState(equipment.id, values.status, values.pairedEquipment && values.pairedEquipment.id, values.orderId)
        .then(onUpdate)
        .catch(err => {
          setError(err.response.data.message || err.response.data.errorMessage || err.response.data.error || t('error.wizardUpdate'));
          throw err;
        });
    }
    const params = values.type === UpdateWizardType.EQUIPMENT ? { pairedEquipmentId: values?.pairedEquipment?.id } : { serviceId: values?.service?.serviceId };
    return TecrepAncillaryEquipmentsService.update({...equipment, ...params})
      .then(onUpdate).catch(err => {
        setError(err.response.data.message || err.response.data.errorMessage || err.response.data.error || t('error.wizardUpdate'));
        throw err;
      });
  };

  return (
    <>
      <TplActionButton tooltipTitle={t('change')} icon={<LowPriorityIcon/>} onClick={() => setOpen(true)}/>
      <WizardDialog
        key={`ancillary-change-${equipment.id}`}
        open={open}
        onClose={() => setOpen(false)}
        setWidth={page => page === 3  || page === 2 && values.type === UpdateWizardType.SERVICE ? 'lg' : 'sm'}
        values={values}
        setValues={setValues}
        initialValues={initialValues}
        shouldDisableNext={shouldAncillaryNextButtonBeDisabled}
        onSubmit={submit}
        error={error}
        resetError={() => setError('')}
        beforeLoadingPreviousPage={page => beforeLoadingAncillaryPreviousPage(page, values, setValues)}
        showNextButton={page => showAncillaryNextButton(page, values, equipment)}
        showSubmitButton={page => showAncillarySubmitButton(page, values, equipment)}
        title={page => (
          <Grid container justify="space-between">
            <Grid item>
              <Typography variant="h6">{t('ancillaryEquipment.change.wizard')}</Typography>
              <Typography variant="subtitle1">{equipment.macAddress}</Typography>
            </Grid>
            <Grid item><Typography>{page} /  3</Typography></Grid>
          </Grid>
        )}
      >
        {page => (
          <>
            {page === 1 && <WizardFieldToEditSelector name="type" values={values} onChange={onChange} fields={equipment.independent ? WizardEditSelectorFields : WizardEditSelectorFields.slice(0, -1)}/>}
            {page === 2 && values.type !== UpdateWizardType.SERVICE && <EquipmentUpdateWizardStatusSelector values={values} onChange={onChange} equipment={equipment}/> }
            {page === 2 && values.type === UpdateWizardType.SERVICE && <ServiceSelectionTable name="service" values={values} onChange={onChange} serviceId={equipment.serviceId} /> }
            {page === 3 && <EquipmentSelectionTable name="pairedEquipment" type={values.pairedCategory} equipmentId={equipment.pairedEquipmentId} onChange={onChange} values={values}/>}
          </>
        )}
      </WizardDialog>
    </>
  );
};

AncillaryEquipmentUpdateWizard.propTypes = {
  equipment: PropTypes.object,
  onUpdate: PropTypes.func,
};

export default AncillaryEquipmentUpdateWizard;
