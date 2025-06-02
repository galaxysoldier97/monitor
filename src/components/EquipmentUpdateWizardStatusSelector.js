import React, {PropTypes} from 'react';
import {t} from 'mt-react-library/functions';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import {simCardStatusEvent} from '../config/equipment/simCard/simCardStatus';
import {cpeStatusEventEnum} from '../config/equipment/cpe/cpeStatus';
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import { shouldShowPairingRadios } from '../containers/equipments/AncillaryEquipmentManager/AncillaryEquipmentUpdateWizard';
import {UpdateWizardType} from "../config/UpdateWizardType";

const EquipmentWizardStatusSelector = ({values, onChange, equipment}) => {
  return (
    <Grid container spacing={1}>
      {values.type !== UpdateWizardType.EQUIPMENT && <Grid item xs={12}>
        <FormControl fullWidth required>
          <InputLabel>{t(`status`)}</InputLabel>
          <Select name="status" value={values.status} onChange={onChange} required>
            {simCardStatusEvent
              .filter(s => equipment.events.includes(s.key))
              .map(status => <MenuItem key={status.key} value={status.key}>{status.value}</MenuItem>)}
          </Select>
        </FormControl>
      </Grid>}
      {values.type !== UpdateWizardType.EQUIPMENT && values.status === cpeStatusEventEnum.BOOK && (
        <Grid item xs={12}>
          <TextField
            name="orderId"
            label={t('orderId')}
            value={values.orderId}
            onChange={onChange}
            fullWidth
            autoComplete="off"
          />
        </Grid>
      )}
      {(shouldShowPairingRadios(values, equipment) || values.type === UpdateWizardType.EQUIPMENT) &&
        <RadioGroup name="pairedCategory" value={values.pairedCategory} onChange={onChange}>
          {equipment.pairedEquipmentCategory == null && <FormControlLabel value="" control={<Radio/>} label={t('ancillaryEquipment.change.none')}/>}
          {(equipment.pairedEquipmentCategory == null || equipment.pairedEquipmentCategory === 'SIMCARD') && <FormControlLabel value="simCard" control={<Radio/>} label={t('ancillaryEquipment.change.simcard')}/>}
          {(equipment.pairedEquipmentCategory == null || equipment.pairedEquipmentCategory === 'CPE') && <FormControlLabel value="cpe" control={<Radio/>} label={t('ancillaryEquipment.change.cpe')}/>}
        </RadioGroup>
      }
    </Grid>
  );
};

EquipmentWizardStatusSelector.propTypes = {
  values: PropTypes.object,
  onChange: PropTypes.func,
  equipment: PropTypes.object,
};

export default EquipmentWizardStatusSelector;
