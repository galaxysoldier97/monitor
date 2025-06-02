import React, { useRef } from "react";
import PropTypes from 'prop-types';
import {useTranslation} from "react-i18next";

export default function TypeField({defaultValue, field, onChange}){
  const {id, label} = field;
  const { t } = useTranslation();
  const inputRef = useRef();
  const handleOnChange = () => {
    const value = inputRef.current.value;
    const event = {target: {id: id, value: value}};
    onChange(event);
  };

  return(
    <div>
    <label htmlFor={id} className="label">
      {t(label)}
    </label>
    <input
      type="text"
      id={id}
      ref={inputRef}
      className="input"
      defaultValue={defaultValue}
      onChange={handleOnChange}
    />
  </div>);
}
TypeField.propTypes = {
  defaultValue: PropTypes.string,
  field: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
};
