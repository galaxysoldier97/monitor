import React, { PropTypes } from 'react';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Radio from '@material-ui/core/Radio';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';

const WizardFieldToEditSelector = ({name, label, values, onChange, fields, type = 'radio', rowDisplay = false}) => {
  if (type === 'radio') {
    return (
      <RadioGroup name={name} value={values[name]} onChange={onChange} row={rowDisplay}>
        {fields.filter(field => field.hidden !== true).map(field =>
          <FormControlLabel key={field.name} value={field.name} control={<Radio />} label={field.label} disabled={field.disabled} />
        )}
      </RadioGroup>
    );
  }
  return (
    <FormControl fullWidth>
      {label && <InputLabel>{label}</InputLabel>}
      <Select name={name} value={values[name]} onChange={onChange}>
        {fields
          .filter(field => field.hidden !== true)
          .map(f => <MenuItem key={f.name} value={f.name}>{f.label}</MenuItem>)}
      </Select>
    </FormControl>
  );
};

WizardFieldToEditSelector.propTypes = {
  name: PropTypes.string,
  label: PropTypes.string,
  values: PropTypes.object,
  onChange: PropTypes.func,
  fields: PropTypes.object,
  type: PropTypes.oneOf(['radio', 'select']),
  rowDisplay: PropTypes.bool
};

export default WizardFieldToEditSelector;
