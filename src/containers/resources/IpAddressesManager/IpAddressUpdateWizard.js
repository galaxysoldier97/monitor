import React, { useState } from 'react';
import PropTypes from 'prop-types';
import LowPriorityIcon from '@material-ui/icons/LowPriority';
import UpdateIpAddressStatusWizard from './UpdateIpAddressStatusWizard';
import { ResourcesActionsMenuOptions } from '../../../config/UpdateWizardType';
import {useTranslation} from "react-i18next";
import IconButton from "../../../components/iconButton/IconButton";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import MenuRadioGroup from "../../../components/menuRadioGroup/MenuRadioGroup";
import { useStepper } from "../../../components/stepperForm/StepperContext";
import ServiceSelectionDialog from "../../../components/selectionDialogs/ServiceSelectionDialog";

const IpAddressUpdateWizard = ({ipAddress, onUpdate}) => {
  const { t } = useTranslation();
  const { open, page, width, handleOpen, handleClose } = useStepper();
  const {STATUS, ACCESS_SERVICE, COMPONENT_SERVICE}  = ResourcesActionsMenuOptions;
  const radioOptions = Object.values(ResourcesActionsMenuOptions).map(value => t(value));
  const [selectedValue, setSelectedValue] = useState(t(STATUS));

  const handleOnChange = event => {
      setSelectedValue(event.target.value);
  };

    return (
        <>
            <IconButton icon={<LowPriorityIcon />} text={`${t('change')}`} onClick={handleOpen} />
            <Dialog
              open={open}
              onClose={handleClose}
              disableEnforceFocus
              disableBackdropClick
              fullWidth
              maxWidth={width}
            >
                <DialogTitle className="form-dialog-title" id="form-dialog-title">
                    {`${t('ipAddresses.change.wizard')} ${ipAddress.ipAddress}`}
                </DialogTitle>
                    {page === 0 && <MenuRadioGroup
                            options={radioOptions}
                            selectedValue={selectedValue}
                            onChange={handleOnChange}
                        />}
                  {page > 0 && selectedValue === t(STATUS) && (
                        <UpdateIpAddressStatusWizard
                            ipAddress={ipAddress}
                            onUpdate={onUpdate}
                        />
                    )}
                    {page > 0 && selectedValue === t(ACCESS_SERVICE) && (
                        <ServiceSelectionDialog
                            resource="IpAddress"
                            name="service"
                            values={ipAddress}
                            serviceType={'ACCESS'}
                            onUpdate={onUpdate}
                        />
                    )}
                    {page > 0 && selectedValue === t(COMPONENT_SERVICE) && (
                        <ServiceSelectionDialog
                            resource="IpAddress"
                            name="service"
                            values={ipAddress}
                            serviceType={'COMPONENT'}
                            onUpdate={onUpdate}
                        />
                    )}
            </Dialog>
        </>
    );
};

IpAddressUpdateWizard.propTypes = {
  ipAddress: PropTypes.object,
  onUpdate: PropTypes.func,
};

export default IpAddressUpdateWizard;
