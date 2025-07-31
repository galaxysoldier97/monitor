import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  Dialog, DialogTitle, DialogContent, DialogActions, Button
} from '@material-ui/core';
import CustomSelect from '../../../components/customSelect/CustomSelect';
import TypeField from '../../../components/typeField/TypeField';
import IconLabelButton from '../../../components/iconLabelButton/IconLabelButton';
import axios from 'axios';
import { Backend } from '../../../data';
import Auth from '../../../services/Auth';
import { HomologacionSapFields } from '../../../config/equipment/HomologacionSapFields';
import { Edit, Cancel } from '@material-ui/icons';
import { useTranslation } from 'react-i18next';

export default function EditHomologacionSapForm({ selectedItem, onSubmit }) {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [formValues, setFormValues] = useState({});
  const [accessOptions, setAccessOptions] = useState([]);
  const [modelOptions, setModelOptions] = useState([]);
  const [statusChecked, setStatusChecked] = useState(true);
  const handleClickOpen = () => setOpen(true);

  useEffect(() => {
    if (open) {
      setStatusChecked(selectedItem.status !== 'Deshabilitado');

      const access = selectedItem.accessType;
      if (access) {
        axios.get(`${Backend.equipments.equipmentModelsNames.url}?category=ANCILLARY&accessType=${access}`, Auth.authorize())
          .then(res => {
            const opts = res.data.map(v => ({ id: v.id, key: v.name, value: v.name }));
            setModelOptions(opts);
          })
          .catch(err => {
            console.error('❌ Error al cargar modelos:', err);
          });
      }
    }
  }, [open]);

  const handleClose = () => {
    setOpen(false);
    setFormValues({});
    setAccessOptions([]);
    setModelOptions([]);
  };

  const handleLoadAccessTypes = () => {
    axios.get(`${Backend.equipments.equipmentModelsAccessTypes.url}?category=ANCILLARY`, Auth.authorize())
      .then(res => {
        const opts = res.data.map(v => ({ id: v, key: v, value: v }));
        setAccessOptions(opts);
      })
      .catch(err => {
        console.error('❌ Error al cargar accessTypes:', err);
      });
  };

  const handleInputChange = event => {
    const { id, value } = event.target;

    if (id === 'equipmentModelName') {
      const option = modelOptions.find(o => o.value === value);
      setFormValues(prev => ({
        ...prev,
        equipmentModelId: option ? option.id : value,
        equipmentModelName: value
      }));
    } else {
      setFormValues(prev => ({ ...prev, [id]: value }));
    }

    if (id === 'accessType') {
      axios.get(`${Backend.equipments.equipmentModelsNames.url}?category=ANCILLARY&accessType=${value}`, Auth.authorize())
        .then(res => {
          const opts = res.data.map(v => ({ id: v.id, key: v.name, value: v.name }));
          setModelOptions(opts);
        })
        .catch(err => {
          console.error('❌ Error al cargar modelos por cambio de accessType:', err);
        });
    }
  };

  const handleSubmit = () => {
    const status = formValues.status || selectedItem.status;
    const { accessType, equipmentModelName, ...rest } = { ...selectedItem, ...formValues, status };
    onSubmit(selectedItem, rest);
    handleClose();
  };

  const accessField = { ...HomologacionSapFields.find(f => f.id === 'accessType'), values: accessOptions };
  const modelField = { ...HomologacionSapFields.find(f => f.id === 'equipmentModelName'), values: modelOptions };
  const inputFields = HomologacionSapFields.filter(f => ['idMaterialSap', 'nameSap'].includes(f.id));

  return (
    <div>
      <div onClick={handleClickOpen} className="edit-button-container">
        <Edit />
      </div>
      <Dialog
      className="form-dialog-container"
      open={open}
      onClose={handleClose}
      aria-labelledby="form-dialog-title"
      fullWidth
      maxWidth="sm"
    >
      <DialogTitle className="form-dialog-title" id="form-dialog-title">
        {`${t('edit')} ${selectedItem || ''}`}
      </DialogTitle>

      <DialogContent>
        <div style={{ marginBottom: 8 }}>
          <Button size="small" variant="outlined" color="primary" onClick={handleLoadAccessTypes}>
            Cargar tipos
          </Button>
        </div>

        <CustomSelect
          field={accessField}
          onChange={handleInputChange}
          defaultValue={selectedItem.accessType}
        />
        <CustomSelect
          field={modelField}
          onChange={handleInputChange}
          defaultValue={selectedItem.equipmentModelName}
        />
        {inputFields.map(field => (
          <TypeField
            key={field.id}
            defaultValue={selectedItem[field.id]}
            field={field}
            onChange={handleInputChange}
          />
        ))}
       <CustomSelect
          field={{
            id: 'status',
            label: 'Estado',
            values: [
              { id: 'Habilitado', key: 'Habilitado', value: 'Habilitado' },
              { id: 'Deshabilitado', key: 'Deshabilitado', value: 'Deshabilitado' }
            ]
          }}
          onChange={handleInputChange}
          defaultValue={selectedItem.status}
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
