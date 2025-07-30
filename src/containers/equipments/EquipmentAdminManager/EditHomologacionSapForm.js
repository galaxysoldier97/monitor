import React, {useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import {Dialog, DialogTitle, DialogContent, DialogActions, Switch, FormControlLabel} from '@material-ui/core';
import CustomSelect from '../../../components/customSelect/CustomSelect';
import TypeField from '../../../components/typeField/TypeField';
import IconLabelButton from '../../../components/iconLabelButton/IconLabelButton';
import axios from 'axios';
import {Backend} from '../../../data';
import Auth from '../../../services/Auth';
import {HomologacionSapFields} from '../../../config/equipment/HomologacionSapFields';
import {Edit, Cancel} from '@material-ui/icons';
import {useTranslation} from 'react-i18next';

export default function EditHomologacionSapForm({selectedItem, onSubmit}) {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [formValues, setFormValues] = useState({});
  const [accessOptions, setAccessOptions] = useState([]);
  const [modelOptions, setModelOptions] = useState([]);
  const [statusChecked, setStatusChecked] = useState(true);

  useEffect(() => {
    if(open){
      axios.get(`${Backend.equipments.equipmentModelsAccessTypes.url}?category=ANCILLARY`, Auth.authorize())
        .then(res => {
          const opts = res.data.map(v => ({id: v, key: v, value: v}));
          setAccessOptions(opts);
        });
    }
  }, [open]);

  useEffect(() => {
    if(open){
      const access = formValues.accessType || selectedItem.accessType;
      if(access){
        axios.get(`${Backend.equipments.equipmentModelsNames.url}?category=ANCILLARY&accessType=${access}`, Auth.authorize())
          .then(res => {
            const opts = res.data.map(v => ({id: v.id, key: v.name, value: v.name}));
            setModelOptions(opts);
          });
      } else {
        setModelOptions([]);
      }
    }
  }, [formValues.accessType, selectedItem.accessType, open]);

  useEffect(() => {
    setStatusChecked(selectedItem.status !== 'Deshabilitado');
  }, [selectedItem]);

  const handleInputChange = event => {
    const {id, value} = event.target;
    if (id === 'equipmentModelName') {
      const option = modelOptions.find(o => o.value === value);
      setFormValues(prev => ({...prev, equipmentModelId: option ? option.id : value, equipmentModelName: value}));
    } else {
      setFormValues(prev => ({...prev, [id]: value}));
    }
  };

  const handleClickOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setFormValues({});
    setAccessOptions([]);
    setModelOptions([]);
  };

  const handleSubmit = () => {
    const status = statusChecked ? 'Habilitado' : 'Deshabilitado';
    const { accessType, equipmentModelName, ...rest } = { ...selectedItem, ...formValues, status };
    onSubmit(selectedItem, rest);
    handleClose();
  };

  const accessField = {...HomologacionSapFields.find(f => f.id === 'accessType'), values: accessOptions};
  const modelField = {...HomologacionSapFields.find(f => f.id === 'equipmentModelName'), values: modelOptions};
  const inputFields = HomologacionSapFields.filter(f => ['idMaterialSap', 'nameSap'].includes(f.id));

  return (
    <div>
      <div onClick={handleClickOpen} className="edit-button-container">
        <Edit />
      </div>
      <Dialog className="form-dialog-container" open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
        <DialogTitle className="form-dialog-title" id="form-dialog-title">{t('edit')}</DialogTitle>
        <DialogContent>
          <CustomSelect field={accessField} onChange={handleInputChange} defaultValue={selectedItem.accessType} />
          <CustomSelect field={modelField} onChange={handleInputChange} defaultValue={selectedItem.equipmentModelName} />
          {inputFields.map(field => (
            <TypeField key={field.id} defaultValue={selectedItem[field.id]} field={field} onChange={handleInputChange} />
          ))}
          <FormControlLabel
            control={<Switch color="secondary" checked={statusChecked} onChange={() => setStatusChecked(!statusChecked)} />}
            label={t('status')}
          />
        </DialogContent>
        <DialogActions>
          <IconLabelButton icon={<Cancel />} label={t('tpl.enhancedTable.cancel')} onClick={handleClose} />
          <IconLabelButton icon={<Edit />} label={t('edit')} onClick={handleSubmit} />
        </DialogActions>
      </Dialog>
    </div>
  );
}

EditHomologacionSapForm.propTypes = {
  selectedItem: PropTypes.object.isRequired,
  onSubmit: PropTypes.func
};
