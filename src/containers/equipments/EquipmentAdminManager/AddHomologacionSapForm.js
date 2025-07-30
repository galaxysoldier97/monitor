import React, {useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import {Dialog, DialogTitle, DialogContent, DialogActions, Switch, FormControlLabel} from '@material-ui/core';
import CustomSelect from '../../../components/customSelect/CustomSelect';
import TypeField from '../../../components/typeField/TypeField';
import IconLabelButton from '../../../components/iconLabelButton/IconLabelButton';
import ContainedButton from '../../../components/containedButton/ContainedButton';
import axios from 'axios';
import {Backend} from '../../../data';
import Auth from '../../../services/Auth';
import {HomologacionSapFields} from '../../../config/equipment/HomologacionSapFields';
import {Add, Cancel} from '@material-ui/icons';
import {useTranslation} from 'react-i18next';

export default function AddHomologacionSapForm({predefinedValues = {}, onSubmit}) {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [formValues, setFormValues] = useState({});
  const [accessOptions, setAccessOptions] = useState([]);
  const [modelOptions, setModelOptions] = useState([]);
  const [statusChecked, setStatusChecked] = useState(true);

  useEffect(() => {
    axios.get(`${Backend.equipments.equipmentModelsAccessTypes.url}?category=ANCILLARY`, Auth.authorize())
      .then(res => {
        const opts = res.data.map(v => ({id: v, key: v, value: v}));
        setAccessOptions(opts);
      });
  }, []);

  useEffect(() => {
    if(formValues.accessType){
      axios.get(`${Backend.equipments.equipmentModelsNames.url}?category=ANCILLARY&accessType=${formValues.accessType}`, Auth.authorize())
        .then(res => {
          const opts = res.data.map(v => ({id: v.id, key: v.name, value: v.name}));
          setModelOptions(opts);
        });
    }
  }, [formValues.accessType]);

  const handleInputChange = (event) => {
    const { id, value } = event.target;
    if (id === 'equipmentModelName') {
      const option = modelOptions.find(o => o.value === value);
      setFormValues(prev => ({...prev, equipmentModelId: option ? option.id : value, equipmentModelName: value}));
    } else {
      setFormValues(prev => ({...prev, [id]: value}));
    }
  };

  const handleClickOpen = () => setOpen(true);
  const handleClose = () => { setOpen(false); setFormValues({}); };

  const handleSubmit = () => {
    const { accessType, ...dataToSubmit } = { ...predefinedValues, ...formValues };
    const status = statusChecked ? 'Habilitado' : 'Deshabilitado';
    onSubmit({...dataToSubmit, status});
    handleClose();
  };

  const accessField = {...HomologacionSapFields.find(f => f.id === 'accessType'), values: accessOptions};
  const modelField = {...HomologacionSapFields.find(f => f.id === 'equipmentModelName'), values: modelOptions};
  const inputFields = HomologacionSapFields.filter(f => ['idMaterialSap', 'nameSap'].includes(f.id));

  return (
    <div>
      <div onClick={handleClickOpen}>
        <ContainedButton />
      </div>
      <Dialog className="form-dialog-container" open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
        <DialogTitle className="form-dialog-title" id="form-dialog-title">{t('add')}</DialogTitle>
        <DialogContent>
          <CustomSelect field={accessField} onChange={handleInputChange} />
          <CustomSelect field={modelField} onChange={handleInputChange} />
          {inputFields.map(field => (
            <TypeField key={field.id} defaultValue="" field={field} onChange={handleInputChange} />
          ))}
          <FormControlLabel
            control={<Switch color="secondary" checked={statusChecked} onChange={() => setStatusChecked(!statusChecked)} />}
            label={t('status')}
          />
        </DialogContent>
        <DialogActions>
          <IconLabelButton icon={<Cancel />} label={t('tpl.enhancedTable.cancel')} onClick={handleClose} />
          <IconLabelButton icon={<Add />} label={t('add')} onClick={handleSubmit} />
        </DialogActions>
      </Dialog>
    </div>
  );
}

AddHomologacionSapForm.propTypes = {
  predefinedValues: PropTypes.object,
  onSubmit: PropTypes.func
};
