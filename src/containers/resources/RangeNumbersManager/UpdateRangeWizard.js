import React, { useState } from 'react';
import PropTypes from 'prop-types';
import LowPriorityIcon from '@material-ui/icons/LowPriority';
import UpdateRangeStatusWizard from './UpdateRangeStatusWizard';
import { ResourcesActionsMenuOptions } from "../../../config/UpdateWizardType";
import {useTranslation} from "react-i18next";
import {useStepper} from "../../../components/stepperForm/StepperContext";
import IconButton from "../../../components/iconButton/IconButton";
import DialogTitle from "@material-ui/core/DialogTitle";
import MenuRadioGroup from "../../../components/menuRadioGroup/MenuRadioGroup";
import ServiceSelectionDialog from "../../../components/selectionDialogs/ServiceSelectionDialog";
import Dialog from "@material-ui/core/Dialog";
const UpdateRangeWizard = ({range, onUpdate}) => {
  const { t } = useTranslation();
  const { open, page, width, handleOpen, handleClose } = useStepper();
  const {STATUS, ACCESS_SERVICE, COMPONENT_SERVICE}  = ResourcesActionsMenuOptions;
  const radioOptions = Object.values(ResourcesActionsMenuOptions).map(value => t(value));
  const [selectedValue, setSelectedValue] = useState(t(STATUS));
  const handleOnChange = event => {
    setSelectedValue(event.target.value);
  };
  //const showServicesPage = !range.serviceId && [StatusChangeEnum.assign, StatusChangeEnum.activate, StatusChangeEnum.lockUser].includes(values.status);

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
          {`${t('rangeNumbers.updateRangeWizard.update')}`}
        </DialogTitle>
        {page === 0 && <MenuRadioGroup
            options={radioOptions}
            selectedValue={selectedValue}
            onChange={handleOnChange}
        />}
        {page > 0 && selectedValue === t(STATUS) && (
            <UpdateRangeStatusWizard
                range={range}
                onUpdate={onUpdate}/>
        )}
        {page > 0 && selectedValue === t(ACCESS_SERVICE) && (
            <ServiceSelectionDialog
                resource="Range"
                name="service"
                values={range}
                serviceType={'ACCESS'}
                onUpdate={onUpdate}
            />
        )}
        {page > 0 && selectedValue === t(COMPONENT_SERVICE) && (
            <ServiceSelectionDialog
                resource="Range"
                name="service"
                values={range}
                serviceType={'COMPONENT'}
                onUpdate={onUpdate}
            />
        )}
      </Dialog>
    </>
  );
};

UpdateRangeWizard.propTypes = {
  range: PropTypes.object,
  onUpdate: PropTypes.func,
};

export default UpdateRangeWizard;
