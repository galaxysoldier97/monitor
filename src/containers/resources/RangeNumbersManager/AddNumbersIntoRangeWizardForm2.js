import React, { PropTypes } from 'react';
import { t } from 'mt-react-library/functions';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';

const AddNumbersIntoRangeWizardForm2 = ({values, onChange, withOrderId}) => {
  return (
    <Grid container spacing={1}>
      <Grid item xs={12}>
        <TextField name="mainNumber" label={t('rangeNumbers.addNumberWizard.mainNumber')} value={values.mainNumber} onChange={onChange} fullWidth />
      </Grid>
      {withOrderId && (
        <Grid item xs={12}>
          <TextField name="orderId" label={t('number.orderId')} value={values.orderId} onChange={onChange} fullWidth />
        </Grid>
      )}
    </Grid>
  );
};

AddNumbersIntoRangeWizardForm2.propTypes = {
  values: PropTypes.object,
  onChange: PropTypes.func,
  withActivity: PropTypes.bool,
  withOrderId: PropTypes.bool,
};

export default AddNumbersIntoRangeWizardForm2;
