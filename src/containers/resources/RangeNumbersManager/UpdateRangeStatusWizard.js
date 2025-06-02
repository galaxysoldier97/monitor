import React, {useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import { numberStatusChange } from '../../../config/resources/number/numberStatus';
import { StatusChangeEnum } from "../../../config/StatusChangeEnum";
import { DialogContent, Snackbar } from "@material-ui/core";
import DialogActions from "@material-ui/core/DialogActions";
import CancelIcon from "@material-ui/icons/Cancel";
import NavigateBeforeIcon from "@material-ui/icons/NavigateBefore";
import DoubleArrowIcon from "@material-ui/icons/DoubleArrow";
import { useTranslation } from "react-i18next";
import { useStepper } from "../../../components/stepperForm/StepperContext";
import TecrepRangeNumbersService from "../../../services/resources/TecrepRangeNumbersService";
import Button from "@material-ui/core/Button";
import NavigateNextIcon from "@material-ui/icons/NavigateNext";
import ServiceSelectionDialog from "../../../components/selectionDialogs/ServiceSelectionDialog";

const UpdateRangeStatusWizard = ({ range, onUpdate }) => {
    const { t } = useTranslation();
    const [status, setStatus] = useState('');
    const { page, nextPage, previousPage, handleClose, error, setError, setWidth } = useStepper();
    const [showNextButton, setShowNextButton] = useState(false);
    const [showSubmitButton, setShowSubmitButton] = useState(true);

    const showServicesPage = [
        StatusChangeEnum.assign,
        StatusChangeEnum.activate,
        StatusChangeEnum.lockUser].includes(status) && !range.serviceId;

    useEffect(() => {
        if(page === 1){
            setWidth('sm');
        }
        setShowNextButton(page < 1 || showServicesPage && page < 2);
        setShowSubmitButton((page === 1 && !showServicesPage) || page === 2);
    }, [status, page]);

    const handleOnChange = (event) => {
        switch (event.target.name){
            case "status":
                setStatus(event.target.value);
                break;
            case "orderId":
                range.orderId = event.target.value;
                break;
            default:
                setError(`${event.target.name} event not supported`);
        }
    };

    const submit = (service) => {
        const newRange = {...range, serviceId: service ? service.serviceId : range.serviceId};
        const { rangeId, orderId, serviceId } = newRange;
        TecrepRangeNumbersService.updateStatus(rangeId, status, orderId, serviceId)
            .then(() => {
                onUpdate();
                handleClose();
            })
            .catch(err => {
                setError(err.response.data.message || err.response.data.errorMessage || t('rangeNumbers.updateRangeWizard.updateError'));
                throw err;
            });
    };

    return (
        <>
            {page === 1 && (<>
                <DialogContent className={'form-dialog-container-scroll-disabled'}>
                    <Grid container spacing={1}>
                        <Grid item xs={12}>
                            <FormControl fullWidth required>
                                <InputLabel>{t('number.status')}</InputLabel>
                                <Select name="status" value={status} onChange={handleOnChange} required>
                                    {numberStatusChange
                                        .filter(a => a.key && range.events.includes(a.key))
                                        .map(activity => <MenuItem key={activity.id} value={activity.key}>{activity.value}</MenuItem>)}
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12}>
                            {status === StatusChangeEnum.book && (
                                <TextField
                                    name="orderId"
                                    label={t('rangeNumbers.orderId')}
                                    value={range.orderId}
                                    onChange={handleOnChange}
                                    fullWidth
                                    autoComplete="off"
                                />
                            )}
                        </Grid>
                    </Grid>
                    {error && <Snackbar
                        open={error !== ''}
                        message={error}
                        autoHideDuration={4000}
                        onClose={() => setError('')}
                    />}
                </DialogContent>
                <DialogActions fullWidth>
                    <Button onClick={handleClose} startIcon={<CancelIcon/>}>
                        {t('button.cancel')}
                    </Button>
                    <Button onClick={previousPage} color="primary" startIcon={<NavigateBeforeIcon />}>
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
            </>)}
            {page === 2 && (
                <ServiceSelectionDialog
                    resource="Range"
                    name="service"
                    onSubmit={submit}
                    values={{...range, status}}
                    serviceType={'ACCESS'}
                    onUpdate={onUpdate}
                />
            )}
        </>
    );
};

UpdateRangeStatusWizard.propTypes = {
    values: PropTypes.object,
    onChange: PropTypes.func,
    range: PropTypes.object,
    onUpdate: PropTypes.func
};

export default UpdateRangeStatusWizard;
