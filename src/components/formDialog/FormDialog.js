import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import CustomSelect from "../customSelect/CustomSelect";
import "./FormDialog.scss";
import TypeField from "../typeField/TypeField";
import IconLabelButton from "../iconLabelButton/IconLabelButton";
import {useTranslation} from "react-i18next";

export default function FormDialog({ title, headers, confirmProps, cancelProps, onSubmit, children, initialValues, predefinedValues = {}}) {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [formValues, setFormValues] = useState({});

  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
    setFormValues({});
  };
  const handleInputChange = (event) => {
    const { id, value } = event.target;
    setFormValues((prevValues) => ({
      ...prevValues,
      [id]: value,
    }));
  };
  const handleSubmit = () => {
    const finalValues = {...initialValues?.[0], ...formValues, ...predefinedValues};
    onSubmit(finalValues);
    handleClose();
  };
  return (
    <div>
      <div onClick={handleClickOpen}>
        {children}
      </div>
      <Dialog
        className="form-dialog-container"
        open={open}
        onClose={handleClose}
        aria-labelledby="form-dialog-title">
        <DialogTitle className="form-dialog-title" id="form-dialog-title">{title}</DialogTitle>
        <DialogContent className={"form-dialog-container-scroll-disabled"}>
          {headers.map((field) => {
            const clonedField = {...field};
            clonedField.label = t(clonedField.label);
            if(typeof clonedField.values?.[0]?.value === 'object'){
              clonedField.values[0].value = t(clonedField.values?.[0]?.value?.props?.id);
            }
            return (
              <div key={`${field.id}-field`}>
                {field.type === 'enum' ? (
                  <>
                  <CustomSelect
                    field={clonedField}
                    defaultValue={initialValues?.[0]?.[field.id]}
                    onChange={handleInputChange}
                  />
                  </>
                ) : (
                  <TypeField variant="outlined" defaultValue={initialValues?.[0]?.[field.id]|| ''} field={field} onChange={handleInputChange}/>
                )}
              </div>
            );
          })}
        </DialogContent>
        <DialogActions>
          <IconLabelButton
            icon={cancelProps.icon}
            label={cancelProps.label}
            onClick={handleClose}
          />
          {confirmProps &&
            <IconLabelButton
              icon={confirmProps.icon}
              label={confirmProps.label}
              onClick={handleSubmit}
            />
          }
        </DialogActions>
      </Dialog>
    </div>
  );
}

FormDialog.propTypes = {
  title: PropTypes.string.isRequired,
  headers: PropTypes.array.isRequired,
  confirmProps: PropTypes.object.isRequired,
  cancelProps: PropTypes.object.isRequired,
  onSubmit: PropTypes.func,
  children: PropTypes.node,
  initialValues: PropTypes.array,
  predefinedValues: PropTypes.object,
  showAllOption: PropTypes.bool,
};
