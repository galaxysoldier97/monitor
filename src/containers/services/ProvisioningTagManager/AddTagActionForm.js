import React, {useEffect, useState} from "react";
import PropTypes from 'prop-types';
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import CustomSelect from "../../../components/customSelect/CustomSelect";
import TypeField from "../../../components/typeField/TypeField";
import DialogActions from "@material-ui/core/DialogActions";
import IconLabelButton from "../../../components/iconLabelButton/IconLabelButton";
import ContainedButton from "../../../components/containedButton/ContainedButton";
import axios from "axios";
import {Backend} from "../../../data";
import Auth from "../../../services/Auth";
import { actionParametersFields } from "../../../config/service/provisioningTag/actionParametersFields";
import {Add, Cancel} from "@material-ui/icons";
import {useTranslation} from "react-i18next";

export default function AddTagActionForm({predefinedValues, onSubmit}){
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [formValues, setFormValues] = useState({});
  const [parameterList, setParameterList] = useState([]);
  const [parameterCode, setParameterCode] = useState(actionParametersFields.find(a => a.id === 'parameterCode'));
  async function fetchParametersCodes() {
    return await axios.get(Backend.services.technicalParameters.url, Auth.authorize())
      .then(response => {
        const {_embedded} = response.data;
        setParameterList(_embedded?.technicalParameterDToes || []);
      });
  }

  useEffect(() => {
    fetchParametersCodes();
  }, []);

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

  useEffect(() => {
    const newList = parameterList
      ?.filter(p => p.parameterType === formValues.parameterType)
      .map(p => ({ id: p.parameterCode, key: p.parameterCode, value: p.parameterCode }));
    setParameterCode({...parameterCode, values: newList});
  }, [formValues.parameterType]);

  useEffect(() => {
    setFormValues({...formValues, parameterCode: parameterCode?.values[0]?.value});
  }, [parameterCode]);
  const handleSubmit = () => {
    onSubmit({...predefinedValues, ...formValues});
    handleClose();
  };
  return (
    <div>
      <div onClick={handleClickOpen}>
        <ContainedButton/>
      </div>
      <Dialog
        className="form-dialog-container"
        open={open}
        onClose={handleClose}
        aria-labelledby="form-dialog-title">
        <DialogTitle className="form-dialog-title" id="form-dialog-title">{t('add')}</DialogTitle>
        <DialogContent>
          {actionParametersFields.map((field) => {
            if (field.addable) {
              const clonedField = {...field};
                clonedField.label = t(clonedField.label);
                if(field.id === 'parameterCode'){
                  parameterCode.label = t(parameterCode.label);
                }
                if(typeof clonedField.values?.[0]?.value === 'object'){
                    clonedField.values[0].value = t(clonedField.values?.[0]?.value?.props?.id);
                }
              return (
                <div key={`${field.id}-field`}>
                  {field.type === 'enum' ? (
                    field.id !== 'parameterCode' ? (
                      <CustomSelect
                        field={clonedField}
                        onChange={handleInputChange}
                      />
                    ) : (
                      <CustomSelect
                        field={parameterCode}
                        onChange={handleInputChange}
                      />
                    )
                  ) : (
                    <TypeField defaultValue={''} field={field} onChange={handleInputChange} />
                  )}
                </div>
              );
            }
          })}
        </DialogContent>
        <DialogActions>
          <IconLabelButton
            icon={<Cancel/>}
            label={t("tpl.enhancedTable.cancel")}
            onClick={handleClose}
          />
          <IconLabelButton
              icon={<Add/>}
              label={t('add')}
              onClick={handleSubmit}
          />
        </DialogActions>
      </Dialog>
    </div>
  );
}

AddTagActionForm.propTypes = {
  predefinedValues: PropTypes.object,
  onSubmit: PropTypes.func
};
