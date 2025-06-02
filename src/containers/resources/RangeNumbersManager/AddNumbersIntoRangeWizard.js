import React, { PropTypes, useState } from 'react';
import { t } from 'mt-react-library/functions';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import { BlockOperatorEnum } from '../../../config/adresses/blockNumbers/blockOperator';
import TecrepRangeNumbersService from '../../../services/resources/TecrepRangeNumbersService';
import AddNumbersIntoRangeWizardForm1, { RangeNumbersWizardActions } from './AddNumbersIntoRangeWizardForm1';
import AddNumbersIntoRangeWizardForm2 from './AddNumbersIntoRangeWizardForm2';
import AddNumbersIntoRangeWizardForm3 from './AddNumbersIntoRangeWizardForm3';
import WizardDialog from '../../../components/WizardDialog';

const initialValues = {
  action: RangeNumbersWizardActions.ADD_SYSTEM,
  mainNumber: '',
  firstNumber: '',
  lastNumber: '',
  orderId: '',
  numbers: [],
};

const AddNumbersIntoRangeWizard = ({range, onNumberAdded, onOperatorLocked, extend}) => {
  const [open, setOpen] = useState(false);
  const [error, setError] = useState('');
  const [values, setValues] = useState(initialValues);
  const onChange = event => setValues({...values, [event.target.name]: event.target.value});
  const systemOperator = [RangeNumbersWizardActions.ADD_SYSTEM, RangeNumbersWizardActions.LOCK_SYSTEM].includes(values.action);
  const operator = systemOperator ? BlockOperatorEnum.SYSTEM : BlockOperatorEnum.EXTERNAL;

  const shouldNextButtonBeDisabled = page => {
    switch (page) {
      case 3:
        return range.continuousRange
          ? !values.firstNumber || !values.lastNumber
          : !values.numbers || values.numbers.length === 0;
      default:
        return false;
    }
  };

  const submit = () => {
    return values.action === RangeNumbersWizardActions.LOCK_SYSTEM
      ? lockOperator()
      : book();
  };

  const lockOperator = () => {
    const data = {
      numbers: values.numbers.map(number => number.number),
      ...(values.firstNumber ? {firstNumber: values.firstNumber} : {}),
      ...(values.lastNumber ? {lastNumber: values.lastNumber} : {}),
      ...(values.mainNumber ? {mainNumber: values.mainNumber} : {}),
    };
    return TecrepRangeNumbersService.lockOperator(range.rangeId, data, extend)
      .then(onOperatorLocked)
      .catch(err => {
        setError(err.response.data.errorMessage || t('rangeNumbers.addNumberWizard.lockOperatorError'));
        throw err;
      });
  };

  const book = () => {
    const data = {
      numbers: values.numbers.map(number => number.number),
      ...(values.firstNumber ? {firstNumber: values.firstNumber} : {}),
      ...(values.lastNumber ? {lastNumber: values.lastNumber} : {}),
      ...(values.mainNumber ? {mainNumber: values.mainNumber} : {}),
      ...(values.orderId ? {orderId: values.orderId} : {}),
    };
    return TecrepRangeNumbersService.book(range.rangeId, operator, data, extend)
      .then(onNumberAdded)
      .catch(err => {
        setError(err.response.data.errorMessage || t('rangeNumbers.addNumberWizard.addNumberError'));
        throw err;
      });
  };

  return (
    <>
      <Button variant="contained" color="primary" onClick={() => setOpen(true)}>{t('rangeNumbers.addNumberWizard.addNumbersToRange')}</Button>
      <WizardDialog
        open={open}
        onClose={() => setOpen(false)}
        setWidth={page => page === 3 && !range.continuousRange ? 'lg' : 'sm'}
        values={values}
        setValues={setValues}
        initialValues={initialValues}
        shouldDisableNext={shouldNextButtonBeDisabled}
        onSubmit={submit}
        error={error}
        resetError={() => setError('')}
        showNextButton={page => page < 3}
        showSubmitButton={page => page === 3}
        title={page => (
          <Grid container justify="space-between" alignItems="center">
            <Grid item><Typography variant="h6">{t('rangeNumbers.addNumberWizard.addNumbersToRange')}</Typography></Grid>
            <Grid item><Typography>{page} / 3</Typography></Grid>
          </Grid>
        )}
      >
        {page => (
          <div>
            {page === 1 && <AddNumbersIntoRangeWizardForm1 values={values} onChange={onChange} extend={extend} />}
            {page === 2 && <AddNumbersIntoRangeWizardForm2 values={values} onChange={onChange} withOrderId={values.action === RangeNumbersWizardActions.ADD_SYSTEM} />}
            {page === 3 && <AddNumbersIntoRangeWizardForm3 values={values} onChange={onChange} operator={operator} continuousDisplay={range.continuousRange} />}
          </div>
        )}
      </WizardDialog>
    </>
  );
};

AddNumbersIntoRangeWizard.propTypes = {
  range: PropTypes.string,
  onNumberAdded: PropTypes.func,
  onOperatorLocked: PropTypes.func,
  extend: PropTypes.bool,
};

export default AddNumbersIntoRangeWizard;
