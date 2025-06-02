import React, { PropTypes, useEffect, useState } from 'react';
import { t } from 'mt-react-library/functions';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import Switch from '@material-ui/core/Switch';
import DialogContent from '@material-ui/core/DialogContent';
import LinearProgress from '@material-ui/core/LinearProgress';
import DialogActions from '@material-ui/core/DialogActions';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import CircularProgress from '@material-ui/core/CircularProgress';
import FormHelperText from '@material-ui/core/FormHelperText';
import TecrepInventoryPoolService from '../../../services/equipments/TecrepInventoryPoolService';
import TecrepSimCardGenerationConfigurationService from '../../../services/equipments/TecrepSimCardGenerationConfigurationService';
import TecrepIntervalNumberService from '../../../services/resources/TecrepIntervalNumberService';
import TecrepSimCardService from '../../../services/equipments/TecrepSimCardService';
import { ErrorAlert } from '../../../components/ErrorAlert';
import Box from '@material-ui/core/Box';
import { isEpicCompany } from '../../../config/company';

const epicSpecificFields = [
  {name: 'brand', values: ['PREPAID', 'POSTPAID']},
  {name: 'simCardType', values: ['NANO', 'MICRO', 'NORMAL']},
  {name: 'provider', values: ['GEMPLUS', 'ORGA', 'GEMALTO', 'MORPHO', 'CALLSAT', 'FORBESFONE']},
  {name: 'profile', values: ['32K', '64K', '128K']}];

export const SIMCardGeneratorDialog = (props) => {
  const {open, onSuccess, onCancel} = props;
  const [form, setForm] = useState({
    inventoryPool: '',
    configurationName: '',
    pairWithMsisdns: false,
    quantity: undefined,
    brand: '',
    simCardType: '',
    provider: '',
    profile: '',
    firstNumber: '',
    lastNumber: '',
    esim: false,
  });
  const requestState = {loading: 0, success: 1, error: -1};
  const simProfile = {replacement: 'REPLACEMENT'};
  const [inventoryPoolValues, setInventoryPoolValues] = useState({state: requestState.loading, values: []});
  const [generationConfig, setGenerationConfig] = useState({state: requestState.loading, values: []});
  const [intervalNumbers, setIntervalNumbers] = useState({state: requestState.loading, values: []});
  const [generationState, setGenerationState] = useState();
  const [validationErrors, setValidationErrors] = useState({});
  const [generationErrorMessage, setGenerationErrorMessage] = useState();

  const isMsisdnDisable = (inventoryPoolKey) => {
    return inventoryPoolKey !== '' && inventoryPoolValues.values[inventoryPoolKey].simProfile === simProfile.replacement;
  };

  const handleChange = (event) => {
    setValidationErrors({[event.target.name]: undefined});
    let pairWithMsisdns = form.pairWithMsisdns;
    let firstNumber = form.firstNumber;
    let lastNumber = form.lastNumber;
    let value = event.target.value;
    if (event.target.name === 'inventoryPool' && isMsisdnDisable(event.target.value)) {
      pairWithMsisdns = false;
      firstNumber = '';
      lastNumber = '';
    } else if (event.target.name === 'pairWithMsisdns') {
      value = event.target.checked;
      firstNumber = '';
      lastNumber = '';
    }
    else if (event.target.name === 'esim') {
      value = event.target.checked;
    }
    setForm({
      ...form,
      pairWithMsisdns,
      firstNumber,
      lastNumber,
      [event.target.name]: value,
    });
  };

  const handleChangeIntervalNumber = (event) => {
    setForm({
      ...form,
      firstNumber: intervalNumbers.values[event.target.value].firstNumber,
      lastNumber: intervalNumbers.values[event.target.value].lastNumber,
    });
  };

  const validate = () => {
    let valid = true;
    let mandatoryFields = ['inventoryPool', 'configurationName'];
    if (isEpicCompany()) {
      mandatoryFields = [...mandatoryFields, 'brand', 'profile', 'provider', 'simCardType'];
    }
    mandatoryFields.forEach(value => {
      if (form[value] === '') {
        setValidationErrors({[value]: t('requiredField')});
        valid = false;
      }
    });
    return valid;
  };

  const generate = (event) => {
    event.preventDefault();
    if (!validate()) {
      return;
    }
    setGenerationState(requestState.loading);
    const params = {
      inventoryPoolCode: inventoryPoolValues.values[form.inventoryPool].code,
      pairing: form.pairWithMsisdns,
      quantity: parseInt(form.quantity),
      configurationName: form.configurationName,
      brand: form.brand,
      simCardType: form.simCardType,
      provider: form.provider,
      profile: form.profile,
      esim: form.esim,
    };
    if (form.pairWithMsisdns && form.firstNumber >= 0) {
      params.numbers = {firstNumber: form.firstNumber, lastNumber: form.lastNumber};
    }
    TecrepSimCardService.export(params)
    .then(() => {
      setGenerationState(requestState.success);
      onSuccess();
    })
    .catch(err => {
      setGenerationState(requestState.error);
      setGenerationErrorMessage(err && err.response && err.response.data && err.response.data.errorMessage);
    });
  };

  useEffect(() => {
    TecrepInventoryPoolService.searchInventoryPools(0, 999).then(data => setInventoryPoolValues({
      state: requestState.success,
      values: data.content,
    })).catch(() => setInventoryPoolValues({
      state: requestState.error,
      values: [],
    }));
  }, []);

  useEffect(() => {
    TecrepSimCardGenerationConfigurationService.getSimCardGenerationConfiguration().then(data => setGenerationConfig({
      state: requestState.success,
      values: data.content,
    })).catch(() => setGenerationConfig({
      state: requestState.error,
      values: [],
    }));
  }, []);

  useEffect(() => {
    TecrepIntervalNumberService.fetch(0, 1000).then(data => setIntervalNumbers({
      state: requestState.success,
      values: data.content && data.content.filter(intervalNumber => !intervalNumber.blockNumber || !intervalNumber.blockNumber.portability),
    })).catch(() => setIntervalNumbers({
      state: requestState.error,
      values: [],
    }));
  }, []);

  const isGenerating = generationState === requestState.loading;

  return (
    <Dialog open={open} onClose={onCancel} fullWidth maxWidth="sm" disableBackdropClick={isGenerating}>
      <DialogTitle>{t('simcard.generate')}</DialogTitle>
      <DialogContent>
        <Box marginBottom={2}>
          {generationState === requestState.error && (
            <ErrorAlert message={t('errorOccurred', generationErrorMessage || 'unknown')}/>
          )}
          <form id="generate-simcard-form" onSubmit={generate}>
            <Grid container alignItems="center" spacing={2}>
              <Grid item xs={6}>
                <TextField required id="quantity" name="quantity" label={t('simcard.quantity')} fullWidth onChange={handleChange} autoComplete="off" />
              </Grid>
              {isEpicCompany() && epicSpecificFields.map(field => <Grid item xs={6} key={field.name}>
                <FormControl fullWidth required error={!!validationErrors[field.name]}>
                  <InputLabel id={field.name}>{t(`simcard.${field.name}`)}</InputLabel>
                  <Select required name={field.name}
                          labelId={field.name}
                          id={field.name}
                          value={form[field.name]}
                          onChange={handleChange}>
                    {field.values.map((value) => <MenuItem key={value} value={value}>{value}</MenuItem>)}
                  </Select>
                </FormControl>
              </Grid>)}
              <Grid item xs={6}>
                <FormControl fullWidth required error={inventoryPoolValues.state === requestState.error || !!validationErrors.inventoryPool}>
                  <InputLabel id="inventory-pool-label">{t('simcard.inventoryPool')}</InputLabel>
                  <Select name="inventoryPool"
                          required
                          labelId="inventory-pool-label"
                          id="inventory-pool-select"
                          value={form.inventoryPool}
                          onChange={handleChange}
                          MenuProps={{style: {maxHeight: 400}}}>
                    {inventoryPoolValues.values.map((value, index) => <MenuItem key={value.code}
                                                                                value={index}>{value.description || value.code}</MenuItem>)}
                  </Select>
                  {inventoryPoolValues.state === requestState.loading && <LinearProgress />}
                  {!!validationErrors.inventoryPool && <FormHelperText>{validationErrors.inventoryPool}</FormHelperText>}
                  {inventoryPoolValues.state === requestState.error && <FormHelperText>{t('errorFetchingData')}</FormHelperText>}
                </FormControl>
              </Grid>
              <Grid item xs={6}>
                <FormControl fullWidth required error={generationConfig.state === requestState.error || !!validationErrors.configurationName}>
                  <InputLabel id="configuration-name-label">{t('simcard.configurationName')}</InputLabel>
                  <Select name="configurationName"
                          labelId="configuration-name-label"
                          id="configuration-name-select"
                          value={form.configurationName}
                          onChange={handleChange}
                          MenuProps={{style: {maxHeight: 400}}}>
                    {generationConfig.values.map((value) => <MenuItem key={value.name}
                                                                      value={value.name}>{value.name}</MenuItem>)}
                  </Select>
                  {generationConfig.state === requestState.loading && <LinearProgress />}
                  {!!validationErrors.configurationName && <FormHelperText>{validationErrors.configurationName}</FormHelperText>}
                  {generationConfig.state === requestState.error && <FormHelperText>{t('errorFetchingData')}</FormHelperText>}
                </FormControl>
              </Grid>
              <Grid item xs={6}>
                <FormControl fullWidth>
                  <InputLabel shrink>{t('simcard.esim')}</InputLabel>
                  <Box marginTop="10px">
                    <Switch
                      color="secondary"
                      checked={form.esim}
                      onChange={handleChange}
                      name="esim" />
                  </Box>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <FormControl fullWidth>
                      <InputLabel shrink>{t('simcard.pairWithMsisdns')}</InputLabel>
                      <Box marginTop="10px">
                        <Switch
                          color="secondary"
                          checked={form.pairWithMsisdns}
                          onChange={handleChange}
                          name="pairWithMsisdns"
                          disabled={isMsisdnDisable(form.inventoryPool)} />
                      </Box>
                    </FormControl>
                  </Grid>
                  {form.pairWithMsisdns && <><Grid item xs={12}>
                    <FormControl fullWidth error={intervalNumbers.state === requestState.error}>
                      <InputLabel id="interval-number-label">{t('simcard.intervalNumber')}</InputLabel>
                      <Select name="intervalNumber"
                              labelId="interval-number-label"
                              id="interval-number-select"
                              value={form.intervalNumber}
                              onChange={handleChangeIntervalNumber}
                              MenuProps={{style: {maxHeight: 400}}}>
                        {intervalNumbers.values.map((value, index) => <MenuItem key={value.intervalId}
                                                                                value={index}>{value.firstNumber} - {value.lastNumber}</MenuItem>)}
                      </Select>
                      {intervalNumbers.state === requestState.loading && <LinearProgress />}
                      {intervalNumbers.state === requestState.error &&
                        <FormHelperText>{t('errorFetchingData')}</FormHelperText>}
                    </FormControl></Grid>
                    <Grid item xs={6}>
                      <FormControl fullWidth>
                        <TextField name="firstNumber"
                                   label={t('firstNumber')}
                                   id="first-number-input"
                                   value={form.firstNumber}
                                   onChange={handleChange} />
                      </FormControl></Grid>
                    <Grid item xs={6}>
                      <FormControl fullWidth>
                        <TextField name="lastNumber"
                                   label={t('lastNumber')}
                                   id="last-number-input"
                                   value={form.lastNumber}
                                   onChange={handleChange} />
                      </FormControl>
                    </Grid>
                  </>}
                </Grid>
              </Grid>
            </Grid>
          </form>
        </Box>
      </DialogContent>
      <DialogActions>
        <Box marginRight={2}>
          {isGenerating
            ? <CircularProgress size={24} />
            : (
              <Grid container spacing={2} justify="flex-end" alignItems="center">
                <Grid item>
                  <Button onClick={onCancel} size="small" color="primary">{t('cancel')}</Button>
                </Grid>
                <Grid>
                  <Button type="submit" form="generate-simcard-form" variant="contained" size="small" color="primary">{t('simcard.generate')}</Button>
                </Grid>
              </Grid>
            )}
        </Box>
      </DialogActions>
    </Dialog>
  );
};

SIMCardGeneratorDialog.propTypes = {
  open: PropTypes.boolean,
  onSuccess: PropTypes.func,
  onCancel: PropTypes.func,
};
