import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { t } from 'mt-react-library/functions';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import WizardDialog from '../../../components/WizardDialog';
import AddIcon from '@material-ui/icons/Add';
import { beforeLoadingPreviousPage, showNextButton, showSubmitButton } from '../../equipments/SimcardManager/SimCardUpdateWizard';
import { Button, makeStyles, TextField } from '@material-ui/core';
import AddressSelectionTable from '../../../components/selectionTables/AddressSelectionTable';
import TecRepBuildingRequestDtoGenerator from '../../../services/address/TecRepBuildingRequestDtoGenerator';
import TecrepBuildingService from '../../../services/address/TecrepBuildingService';
import { getErrorMessage } from '../../../helpers/fetchHelper';
import FormControl from '@material-ui/core/FormControl';
import WizardFieldToEditSelector from '../../../components/WizardFieldToEditSelector';
import { buildingTypeSelectOptions } from '../../../config/adresses/postalAddress/buildingType';
import { yesNoSelectField } from '../../../config/yesNoFilter';

const initialValues = {
  address: '',
  buildingType: 'HOUSE',
  mainFlag: 'no'
};

const useStyles = makeStyles(theme => ({
  button: {
    backgroundColor: theme.palette.primary.main,
    '&:hover': {
      backgroundColor: theme.palette.primary.main,
    }
  },
}));

const BuildingAddAddressWizard = ({building, onAdd}) => {
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const [error, setError] = useState('');
  const [values, setValues] = useState(initialValues);

  const onChange = (event) => {
      setValues({...values, [event.target.name]: event.target.value});
  };

  const submit = () => {
    let addressId = values.address.addressId;
    let sentDto = TecRepBuildingRequestDtoGenerator.prepareForAddPostalAddress(values, building);
    return TecrepBuildingService.addPostalAddress(sentDto, addressId)
    .then(onAdd)
    .catch(e => setError(getErrorMessage(e)));
  };

  return (
    <>
      <Button onClick={() => setOpen(true)} variant="contained" color="primary" startIcon={<AddIcon/>} className={classes.button}>
        {t('add')}
      </Button>
      <WizardDialog
        key={`add-address-${building.buildingId}`}
        open={open}
        setWidth={page => page === 1 ? 'lg' : 'sm'}
        onClose={() => setOpen(false)}
        values={values}
        setValues={setValues}
        initialValues={initialValues}
        shouldDisableNext={page => page === 1 && !values.address?.addressId}
        onSubmit={submit}
        error={error}
        resetError={() => setError('')}
        beforeLoadingPreviousPage={page => beforeLoadingPreviousPage(page, values, setValues)}
        showNextButton={page => showNextButton(page, values)}
        showSubmitButton={page => showSubmitButton(page, values)}
        title={page => (
          <Grid container justify="space-between">
            <Grid item>
              <Typography variant="h6">{t('add.postal.address')}</Typography>
            </Grid>
            <Grid item><Typography>{page} / {2}</Typography></Grid>
          </Grid>
        )}
      >
        {page => (
          <>
            {page === 1 && <AddressSelectionTable addressId={values.addressId} onChange={onChange} values={values} name="address" />}
            {page === 2 && (
              <Grid container direction="column" spacing={3}>
                <Grid item>
                  <Typography variant="caption">{t('currently.selected.address')} {values.address.addressId}  </Typography>
                </Grid>
                <Grid item>
                  <Grid container direction="column">
                    <Grid item><Typography variant="caption">{t('building.choseBlock')}</Typography></Grid>
                    <Grid item>
                      <FormControl fullWidth>
                        <TextField
                          id="buildingBlock"
                          name="buildingBlock"
                          type="text"
                          label={t('postalAddress.info.details.buildingBlock')}
                          onChange={onChange}
                        />
                      </FormControl>
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item>
                  <Grid container direction="column">
                    <Grid item><Typography variant="caption">{t('building.choseFlat')}</Typography></Grid>
                    <Grid item>
                      <FormControl fullWidth>
                        <TextField
                          id="flatNumber"
                          name="flatNumber"
                          type="text"
                          label={t('postal.address.flat.number')}
                          onChange={onChange}
                        />
                      </FormControl>
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item>
                  <Grid container direction="column">
                    <Grid item><Typography variant="caption">{t('building.choseType')}</Typography></Grid>
                    <Grid item>
                      <WizardFieldToEditSelector
                          name="buildingType"
                          label={t('building.type')}
                          values={values}
                          onChange={onChange}
                          fields={buildingTypeSelectOptions}
                          type="select"
                      />
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item>
                  <Grid container direction="column">
                    <Grid item><Typography variant="caption">{t('building.activateMainFlag')}</Typography></Grid>
                    <Grid item>
                      <WizardFieldToEditSelector
                        name="mainFlag"
                        label={t('building.type')}
                        values={values}
                        onChange={onChange}
                        fields={yesNoSelectField}
                        rowDisplay
                      />
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            )}
          </>
        )}
      </WizardDialog>
    </>
  );
};

BuildingAddAddressWizard.propTypes = {
  building: PropTypes.object,
  onAdd: PropTypes.func,
};

export default BuildingAddAddressWizard;
