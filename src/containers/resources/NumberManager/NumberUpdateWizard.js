import React, { useState } from 'react';
import PropTypes from "prop-types";
import LowPriorityIcon from '@material-ui/icons/LowPriority';
import { ResourcesActionsMenuOptions } from '../../../config/UpdateWizardType';
import { useTranslation } from "react-i18next";
import { useStepper } from "../../../components/stepperForm/StepperContext";
import IconButton from "../../../components/iconButton/IconButton";
import DialogTitle from "@material-ui/core/DialogTitle";
import ServiceSelectionDialog from "../../../components/selectionDialogs/ServiceSelectionDialog";
import MenuRadioGroup from "../../../components/menuRadioGroup/MenuRadioGroup";
import Dialog from "@material-ui/core/Dialog";
import NumberChangeWizardStatusSelector from "./NumberChangeWizardStatusSelector";

const NumberUpdateWizard = ({number, onUpdate}) => {
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
            {`${t('number.change.wizard')} ${number.number}`}
          </DialogTitle>
          {page === 0 && <MenuRadioGroup
              options={radioOptions}
              selectedValue={selectedValue}
              onChange={handleOnChange}
          />}
          {page > 0 && selectedValue === t(STATUS) && (
              <NumberChangeWizardStatusSelector
                  number={number}
                  onUpdate={onUpdate}
              />
          )}
          {page > 0 && selectedValue === t(ACCESS_SERVICE) && (
              <ServiceSelectionDialog
                  resource="Number"
                  name="service"
                  values={number}
                  serviceType={'ACCESS'}
                  onUpdate={onUpdate}
              />
          )}
          {page > 0 && selectedValue === t(COMPONENT_SERVICE) && (
              <ServiceSelectionDialog
                  resource="Number"
                  name="service"
                  values={number}
                  serviceType={'COMPONENT'}
                  onUpdate={onUpdate}
              />
          )}
        </Dialog>
      </>
  );
};

NumberUpdateWizard.propTypes = {
  number: PropTypes.object,
  onUpdate: PropTypes.func,
};

export default NumberUpdateWizard;
