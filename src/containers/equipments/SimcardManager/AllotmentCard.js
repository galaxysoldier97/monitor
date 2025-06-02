import React, { PropTypes, useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/styles';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import EmptyComponent from '../../../components/EmptyComponent';
import Button from '@material-ui/core/Button';
import SimCardIcon from '@material-ui/icons/SimCard';
import Avatar from '@material-ui/core/Avatar';
import IndigoColor from '@material-ui/core/colors/indigo';
import GreyColor from '@material-ui/core/colors/grey';
import Divider from '@material-ui/core/Divider';
import Grid from '@material-ui/core/Grid';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import TextField from '@material-ui/core/TextField';
import DialogActions from '@material-ui/core/DialogActions';
import { Checkbox, CircularProgress, FormControlLabel } from '@material-ui/core';
import { RequestState } from '../../../helpers/requestState';
import Box from '@material-ui/core/Box';
import { ErrorAlert } from '../../../components/ErrorAlert';
import TableContainer from '@material-ui/core/TableContainer';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import TableBody from '@material-ui/core/TableBody';
import { t } from 'mt-react-library/functions';
import { AllotmentService } from '../../../services/equipments/AllotmentService';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import { ProductCatalogService } from '../../../services/ProductCatalogService';
import FormHelperText from '@material-ui/core/FormHelperText';
import { Auth } from '../../../services/Auth';
import { resourcesScopes } from '../../../config/resources/resourcesScopes';
import IconButton from '@material-ui/core/IconButton';
import { GetApp } from '@material-ui/icons';
import { AllotmentExportForm } from './AllotmentExportForm';
import { BooleanInfoIcon } from '../../../components/BooleanInfoIcon';

const useStyles = makeStyles(theme => ({
  card: {
    padding: theme.spacing(2),
    background: GreyColor[50],
  },
  avatar: {
    backgroundColor: IndigoColor[500],
  },
}));

const AllotmentCard = (props) => {
  const {batch} = props;
  const classes = useStyles();
  const [allotments, setAllotments] = useState([]);
  const [remainingCount, setRemainingCount] = useState(0);
  const [dialogIsOpen, setDialogIsOpen] = useState(false);
  const [form, setForm] = useState({quantity: '', type: '', offerCode: '', firstICCID: '', packWithHandset: false, pricePlan: '', initialCredit : ''});
  const [fetchRequestState, setFetchRequestState] = useState(RequestState.progress);
  const [addingRequestState, setAddingRequestState] = useState();
  const [fileConfigurationRequestState, setFileConfigurationRequestState] = useState({state: undefined});
  const [addingError, setAddingError] = useState();
  const [offers, setOffers] = useState({fetching: false});
  const isPackWithHandsetMandatory = batch.inventoryPoolCode !== 'REPLACEMENT';

  const fetchAllotments = () => {
    AllotmentService.list(batch.batchNumber)
    .then(response => {
      setAllotments(response);
      setRemainingCount(batch.simCardsCount - response.reduce((acc, allotment) => acc + allotment.quantity, 0));
      setFetchRequestState(RequestState.success);
    })
    .catch(() => setFetchRequestState(RequestState.error));
  };

  useEffect(fetchAllotments, []);
  useEffect(() => {
    if (dialogIsOpen && !offers.fetching && !offers.content && !offers.error) {
      setOffers({fetching: true});
      ProductCatalogService.fetch({size: 30, offerType: 'PREPAY'}).then(response => setOffers({fetching: false, content: response.content || response})).catch(e => setOffers({fetching: false, error: e}));
    }
  }, [dialogIsOpen, offers]);

  const addAllotment = (formEvent) => {
    formEvent.preventDefault();
    setAddingRequestState(RequestState.progress);
    AllotmentService.generate(batch.batchNumber, form.type, form.quantity, form.offerCode, form.firstICCID,
      isPackWithHandsetMandatory ? form.packWithHandset : undefined, form.pricePlan, form.initialCredit)
    .then(() => {
      setDialogIsOpen(false);
      setForm({quantity: '', type: '', offerCode: '', firstICCID: '', packWithHandset: false, pricePlan: '', initialCredit: ''});
      setAddingRequestState(RequestState.success);
      fetchAllotments();
    })
    .catch(error => {
      setAddingRequestState(RequestState.error);
      setAddingError(error.response && error.response.data.errorMessage || 'Unknown error');
    });
  };

  const showFileConfiguration = (id) => {
    if (fileConfigurationRequestState.state === RequestState.success) {
      setFileConfigurationRequestState({...fileConfigurationRequestState, id});
      return;
    }
    setFileConfigurationRequestState({id, state: RequestState.progress});
    AllotmentService.getFileConfigurations()
    .then((data) => {
      setFileConfigurationRequestState({id, state: RequestState.success, data});
    })
    .catch(() => {
      setFileConfigurationRequestState({id, state: RequestState.error});
    });
  };

  const isAddingAllotments = addingRequestState === RequestState.progress;

  return (
    <React.Fragment>
      <Card elevation={0} className={classes.card}>
        <CardHeader
          title={t('allotment')}
          titleTypographyProps={{variant: 'h5'}}
          subheader={t('allotment.remaining', remainingCount)}
          avatar={(<Avatar className={classes.avatar}><SimCardIcon /></Avatar>)} />
        <Divider />
        <CardContent>
          {fetchRequestState === RequestState.error && <ErrorAlert message={t('allotment.fetchError')} retry={fetchAllotments} />}
          {fetchRequestState === RequestState.progress && <Box width="100%" textAlign="center" marginY={3}><CircularProgress size={25} /></Box>}
          {fetchRequestState === RequestState.success && allotments.length <= 0 && <EmptyComponent message={t('allotment.empty')} />}
          {fetchRequestState === RequestState.success && allotments.length > 0 && (
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>{t('simcard.allotmentId')}</TableCell>
                    <TableCell>{t('allotment.type')}</TableCell>
                    <TableCell>{t('allotment.quantity')}</TableCell>
                    <TableCell>{t('allotment.creationDate')}</TableCell>
                    <TableCell>{t('allotment.packWithHandset')}</TableCell>
                    <TableCell />
                  </TableRow>
                </TableHead>
                <TableBody>
                  {allotments.map(allotment => (
                    <TableRow key={allotment.allotmentId}>
                      <TableCell>{allotment.allotmentId}</TableCell>
                      <TableCell>{allotment.allotmentType}</TableCell>
                      <TableCell>{allotment.quantity}</TableCell>
                      <TableCell>{allotment.creationDate}</TableCell>
                      <TableCell>{<BooleanInfoIcon value={allotment.packWithHandset} />}</TableCell>
                      <TableCell align="right">
                        {fileConfigurationRequestState.id === allotment.allotmentId ?
                          (fileConfigurationRequestState.state === RequestState.progress ?
                            <CircularProgress size={25} /> : <AllotmentExportForm allotment={allotment} fileConfigurationRequestState={fileConfigurationRequestState} />) :
                          <IconButton onClick={() => showFileConfiguration(allotment.allotmentId)}><GetApp /></IconButton>}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </CardContent>
        {remainingCount > 0 && Auth.connectedUserHasPermission(resourcesScopes.simCard.update) && (
          <CardActions>
            <Grid container justify="flex-end" alignItems="center" spacing={2}>
              <Grid item>
                <Button color="primary" variant="contained" onClick={() => setDialogIsOpen(true)}>{t('allotment.add')}</Button>
              </Grid>
            </Grid>
          </CardActions>
        )}
      </Card>
      <Dialog open={dialogIsOpen} onClose={() => setDialogIsOpen(false)} disableBackdropClick={isAddingAllotments}>
        <DialogTitle>{t('allotment.add')}</DialogTitle>
        <DialogContent>
          <form id="allotment-form" onSubmit={addAllotment}>
            <TextField
              type="number"
              id="quantity"
              label={t('allotment.quantity')}
              value={form.quantity}
              onChange={e => setForm({...form, quantity: e.target.value})}
              disabled={isAddingAllotments}
              autoComplete="off"
              margin="dense"
              required
              fullWidth
              autoFocus />
            <TextField
              id="firstICCID"
              label={t('allotment.firstICCID')}
              value={form.firstICCID}
              onChange={e => setForm({...form, firstICCID: e.target.value})}
              disabled={isAddingAllotments}
              autoComplete="off"
              margin="dense"
              fullWidth />
            <FormControl margin="dense" fullWidth>
              <InputLabel>{t('allotment.type')}</InputLabel>
              <Select value={form.type} onChange={e => setForm({...form, type: e.target.value})} required>
                <MenuItem value="PREPAID">{t('allotmentType.PREPAID')}</MenuItem>
                <MenuItem value="POSTPAID">{t('allotmentType.POSTPAID')}</MenuItem>
                <MenuItem value="REPLACEMENT_SIM_CARD">{t('allotmentType.REPLACEMENT_SIM_CARD')}</MenuItem>
              </Select>
            </FormControl>
            {form.type === 'PREPAID' && <>
              <TextField
              id="pricePlan"
              label={t('allotment.pricePlan')}
              value={form.pricePlan}
              onChange={e => setForm({...form, pricePlan: e.target.value})}
              disabled={isAddingAllotments}
              autoComplete="off"
              margin="dense"
              fullWidth />
            <TextField
              id="initialCredits"
              type="number"
              label={t('allotment.initialCredits')}
              value={form.initialCredit}
              onChange={e => setForm({...form, initialCredit: Number(e.target.value)})}
              disabled={isAddingAllotments}
              autoComplete="off"
              margin="dense"
              fullWidth />
            </>}
            <FormControl margin="dense" fullWidth error={!!offers.error}>
              <InputLabel>{t('offer')}</InputLabel>
              <Select value={form.offerCode} onChange={e => setForm({...form, offerCode: e.target.value})} required>
                {!!offers.content && offers.content.map(offer => <MenuItem value={offer.code} key={offer.code}>{offer.description}</MenuItem>)}
              </Select>
              {offers.fetching && <CircularProgress size={25} />}
              {offers.error && <FormHelperText>{t('errorFetchingData')}</FormHelperText>}
            </FormControl>
            {isPackWithHandsetMandatory && <Box marginTop={2}>
              <FormControlLabel control={
                <Checkbox name="packWithHandset"
                          value={form.packWithHandset}
                          disabled={isAddingAllotments}
                          onChange={e => setForm({...form, packWithHandset: e.target.checked})}
                />}
                                label={t('allotment.packWithHandset')} />
            </Box>}
          </form>
          {addingRequestState === RequestState.error && <ErrorAlert message={addingError} />}
        </DialogContent>
        <DialogActions>
          {isAddingAllotments
            ? <Box marginRight={2} marginBottom={1}><CircularProgress size={25} /></Box>
            : (
              <React.Fragment>
                <Button onClick={() => setDialogIsOpen(false)} color="primary">{t('cancel')}</Button>
                <Button color="primary" form="allotment-form" type="submit">{t('submit')}</Button>
              </React.Fragment>
            )}
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
};

AllotmentCard.propTypes = {
  batch: PropTypes.object,
};

export default AllotmentCard;
