import React, {useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import { StatusChangeEnum } from '../../../config/StatusChangeEnum';
import { useTranslation } from 'react-i18next';
import { isEirCompany } from '../../../config/company';
import DialogActions from '@material-ui/core/DialogActions';
import CancelIcon from '@material-ui/icons/Cancel';
import NavigateBeforeIcon from '@material-ui/icons/NavigateBefore';
import DoubleArrowIcon from '@material-ui/icons/DoubleArrow';
import {DialogContent, Snackbar} from '@material-ui/core';
import { useStepper } from '../../../components/stepperForm/StepperContext';
import TecrepIpAddressesService from '../../../services/resources/TecrepIpAddressesService';
import Button from "@material-ui/core/Button";
import NavigateNextIcon from "@material-ui/icons/NavigateNext";
import ServiceSelectionDialog from "../../../components/selectionDialogs/ServiceSelectionDialog";

const UpdateIpAddressStatusWizard = ({ ipAddress, onUpdate }) => {
    const { t } = useTranslation();
    const [status, setStatus] = useState('');
    const { page, previousPage, nextPage, handleClose, error, setError, setWidth } = useStepper();
    const [showNextButton, setShowNextButton] = useState(false);
    const [showSubmitButton, setShowSubmitButton] = useState(true);

    const showServicesPage = [
        StatusChangeEnum.assign,
        StatusChangeEnum.activate,
        StatusChangeEnum.lockUser
    ].includes(status) && !isEirCompany();

    useEffect(() => {
        if(page === 1){
            setWidth('sm');
        }
        setShowNextButton(page < 1 || (showServicesPage && page < 2));
        setShowSubmitButton((page === 1 && !showServicesPage) || page === 2);
    }, [status, page]);

    const submit = (service) => {
        const orderId = status === StatusChangeEnum.book ? ipAddress.orderId : '';
        const serviceId = service ? service.serviceId : ipAddress.serviceId;
        TecrepIpAddressesService.updateStatus(ipAddress, status, orderId, serviceId)
            .then(onUpdate)
            .catch(error => {
                setError(error.response.data.errorMessage);});
    };

    const handleOnChange = (event) => {
        switch (event.target.name){
            case "status":
                setStatus(event.target.value);
            break;
            case "orderId":
                ipAddress.orderId = event.target.value;
                break;
            default:
                console.error(`${event.target.name} event not supported`);
        }
    };

    return (
        <>
        {page === 1 && (<>
            <DialogContent className={'form-dialog-container-scroll-disabled'}>
                <Grid container spacing={1}>
                    <Grid item xs={12}>
                        <FormControl fullWidth required>
                            <InputLabel>{t('statusAction')}</InputLabel>
                            <Select name="status" value={status} onChange={handleOnChange} required>
                                {Object.keys(StatusChangeEnum)
                                    .filter((action) => ipAddress.events.includes(action))
                                    .map((action) => (
                                        <MenuItem key={action} value={action}>
                                            {t(`status.${action}`)}
                                        </MenuItem>
                                    ))}
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12}>
                        {status === StatusChangeEnum.book && !isEirCompany() && (
                            <TextField
                                name="orderId"
                                label={t('orderId')}
                                value={ipAddress.orderId}
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
                /> }
            </DialogContent>
            <DialogActions fullwidth>
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
                    resource="IpAddress"
                    name="service"
                    values={{...ipAddress, status}}
                    serviceType={'ACCESS'}
                    onUpdate={onUpdate}
                    onSubmit={submit}
                />
            )}
        </>
    );
};

UpdateIpAddressStatusWizard.propTypes = {
    ipAddress: PropTypes.object,
    onUpdate: PropTypes.func
};

export default UpdateIpAddressStatusWizard;
