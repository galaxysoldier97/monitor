import React, { PropTypes } from 'react';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Box from '@material-ui/core/Box';
import Divider from '@material-ui/core/Divider';
import Radio from '@material-ui/core/Radio';
import { t } from 'mt-react-library/functions';

export const RangeNumbersWizardActions = Object.freeze({
  ADD_SYSTEM: 'ADD_SYSTEM',
  ADD_EXTERNAL: 'ADD_EXTERNAL',
  LOCK_SYSTEM: 'LOCK_SYSTEM',
});

const AddNumbersIntoRangeWizardForm1 = ({values, onChange, extend}) => {
  return (
    <RadioGroup name="action" value={values.action} onChange={onChange}>
      <FormControlLabel
        value={RangeNumbersWizardActions.ADD_SYSTEM}
        control={<Radio />}
        label={extend ? t('rangeNumbers.addNumberWizard.extendSystem') : t('rangeNumbers.addNumberWizard.addSystem')}
      />
      <FormControlLabel
        value={RangeNumbersWizardActions.ADD_EXTERNAL}
        control={<Radio />}
        label={extend ? t('rangeNumbers.addNumberWizard.extendExternal') : t('rangeNumbers.addNumberWizard.addExternal')}
      />
      <Box marginY={2}>
        <Divider />
      </Box>
      <FormControlLabel
        value={RangeNumbersWizardActions.LOCK_SYSTEM}
        control={<Radio />}
        label={extend ? t('rangeNumbers.addNumberWizard.lockNewSystem') : t('rangeNumbers.addNumberWizard.lockSystem')}
      />
    </RadioGroup>
  );
};

AddNumbersIntoRangeWizardForm1.propTypes = {
  values: PropTypes.object,
  onChange: PropTypes.func,
  extend: PropTypes.bool,
};

export default AddNumbersIntoRangeWizardForm1;
