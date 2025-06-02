import React, {useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import { numberStatusChange } from '../../../config/resources/number/numberStatus';
import { StatusChangeEnum } from '../../../config/StatusChangeEnum';
import {isEirCompany, isEpicCompany} from '../../../config/company';
import { useTranslation } from 'react-i18next';
import { useStepper } from '../../../components/stepperForm/StepperContext';
import DialogActions from '@material-ui/core/DialogActions';
import CancelIcon from '@material-ui/icons/Cancel';
import NavigateBeforeIcon from '@material-ui/icons/NavigateBefore';
import DoubleArrowIcon from '@material-ui/icons/DoubleArrow';
import {DialogContent, Snackbar} from '@material-ui/core';
import TecrepNumberService from "../../../services/resources/TecrepNumberService";
import Button from "@material-ui/core/Button";
import NavigateNextIcon from "@material-ui/icons/NavigateNext";
import ServiceSelectionDialog from "../../../components/selectionDialogs/ServiceSelectionDialog";

const NumberChangeWizardStatusSelector = ({ number, onUpdate }) => {
  const {t} = useTranslation();
  const [status, setStatus] = useState('');
  const {page, previousPage, nextPage, handleClose, error, setError, setWidth} = useStepper();
  const [showNextButton, setShowNextButton] = useState(false);
  const [showSubmitButton, setShowSubmitButton] = useState(true);

  const showServicesPage = [
    StatusChangeEnum.assign,
    StatusChangeEnum.activate,
    StatusChangeEnum.lockUser,
  ].includes(status) && !isEirCompany();

  useEffect(() => {
    if(page === 1){
      setWidth('sm');
    }
    setShowNextButton(showServicesPage && page < 2);
    setShowSubmitButton((page === 1 && !showServicesPage) || page === 2);
  }, [status, page]);

  const handleOnChange = (event) => {
    switch (event.target.name) {
      case "status":
        setStatus(event.target.value);
        break;
      case "orderId":
        number.orderId = event.target.value;
        break;
      case "offerType":
        number.offerType = event.target.value;
        break;
      default:
        console.error(`${event.target.name} event not supported`);
    }
  };

  const submit = (service) => {
    const newNumber = {...number, status, serviceId: service ? service.serviceId : number.serviceId};
    return TecrepNumberService.updateStatus(newNumber, number).then(onUpdate).catch(err => {
      setError(err.response.data.message || err.response.data.errorMessage || t('error.wizardUpdate'));

    });
  };

  return (
      <>
        {page === 1 && (
            <>
              <DialogContent className={'form-dialog-container-scroll-disabled'}>
                <Grid container spacing={1}>
                  <Grid item xs={12}>
                    <FormControl fullWidth required>
                      <InputLabel>{t('number.status')}</InputLabel>
                      <Select name="status" value={status} onChange={handleOnChange} required>
                        {numberStatusChange
                            .filter((s) => s.key && number.events.includes(s.key))
                            .map((status) => (
                                <MenuItem key={status.id} value={status.key}>
                                  {status.value}
                                </MenuItem>
                            ))}
                      </Select>
                    </FormControl>
                  </Grid>
                  {status === StatusChangeEnum.book && (
                      <Grid item xs={12}>
                        <TextField
                            name="orderId"
                            label={t('number.orderId')}
                            value={number.orderId}
                            onChange={handleOnChange}
                            fullWidth
                            autoComplete="off"
                        />
                      </Grid>
                  )}
                  {[
                    StatusChangeEnum.assign,
                    StatusChangeEnum.activate,
                    StatusChangeEnum.lockUser,
                  ].includes(status) && isEpicCompany() && (
                      <Grid item xs={12}>
                        <TextField
                            name="offerType"
                            label={t('number.offerType')}
                            value={number.offerType}
                            onChange={handleOnChange}
                            fullWidth
                            autoComplete="off"
                        />
                      </Grid>
                  )}
                </Grid>
                {error && (
                    <Snackbar
                        open={error !== ''}
                        message={error}
                        autoHideDuration={4000}
                        onClose={() => setError('')}
                    />
                )}
              </DialogContent>
              <DialogActions fullWidth>
                <Button onClick={handleClose} startIcon={<CancelIcon/>}>
                  {t('button.cancel')}
                </Button>
                <Button onClick={previousPage} color="primary" startIcon={<NavigateBeforeIcon/>}>
                  {t('button.previous')}
                </Button>
                {showNextButton && (
                    <Button onClick={nextPage} color="primary" disabled={!status}
                            endIcon={<NavigateNextIcon/>}>
                      {t('button.next')}
                    </Button>
                )}
                {showSubmitButton && (
                    <Button onClick={submit} color="primary" disabled={!status}
                            endIcon={<DoubleArrowIcon/>}>
                      {t('button.submit')}
                    </Button>
                )}
              </DialogActions>
            </>
        )}
        {page === 2 && (
            <ServiceSelectionDialog
                resource="Number"
                name="service"
                values={{...number, status}}
                serviceType={'ACCESS'}
                onUpdate={onUpdate}
                onSubmit={submit}
            />
        )}
      </>
  );
};

NumberChangeWizardStatusSelector.propTypes = {
  values: PropTypes.object,
  onChange: PropTypes.func,
  number: PropTypes.object,
  onUpdate: PropTypes.func
};

export default NumberChangeWizardStatusSelector;
