import React, {useEffect, useState} from 'react';
import PropTypes from "prop-types";
import "./CustomSelect.scss";
import {MenuItem, Select} from "@material-ui/core";
import FormControl from "@material-ui/core/FormControl";
import {useTranslation} from "react-i18next";
export default function CustomSelect({ field, defaultValue, onChange }) {
  const { t } = useTranslation();
  const initialSelectedValue = defaultValue != null ? defaultValue : field?.values?.[0]?.value || '';
  const [selectedValue, setSelectedValue] = useState(
    typeof initialSelectedValue === 'boolean' || initialSelectedValue === 'true' || initialSelectedValue === 'false' ? t(initialSelectedValue) : initialSelectedValue
  );

  if (!Array.isArray(field.values) || (field.values.length > 0 && !field.values.every(item => 'id' in item && 'key' in item && 'value' in item))) {
    console.warn(`Invalid format in ${field.key || field.id} field values.
    Expected format: {id: string, key: string, value: enum}`);
  }

  const handleChange = (event) => {
    let value = event.target.value;
    setSelectedValue(value);
    if((typeof value !== "string" && typeof value !== "boolean") || value === t('all')){
      value = null;
    }
    onChange({ target: { id: field.id, value: value } });
  };

  useEffect(() => {
    if(defaultValue == null && field?.values?.length > 0){
      handleChange({target: { value: t(field?.values?.[0]?.value) }});
    }
  }, [defaultValue]);

  return (
    <>
      <FormControl variant="outlined" fullWidth>
      <label className="label" htmlFor="button">{field.label}</label>
      <Select
        fullWidth
        disableUnderline
        variant="filled"
        classes={{root: 'custom-select-root', select: 'select-input', filled: 'select-filled'}}
        MenuProps={{ classes: {paper: 'select-option-menu'}}}
        value={selectedValue}
        onChange={handleChange}
      >
        {Array.isArray(field?.values) && field.values?.map((option, index) => {
          return(
            <MenuItem
              key={`${field.id}-${index}`}
              value={t(option.value)}
            >
              {t(option.value)}
            </MenuItem>
          );
        })}
      </Select>
      </FormControl>
    </>
  );
}
CustomSelect.propTypes = {
  field: PropTypes.object.isRequired,
  defaultValue: PropTypes.string,
  onChange: PropTypes.func.isRequired,
};
