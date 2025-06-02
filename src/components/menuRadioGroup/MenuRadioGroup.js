import React from "react";
import PropTypes from 'prop-types';
import FormControl from "@material-ui/core/FormControl";
import RadioGroup from "@material-ui/core/RadioGroup";
import {DialogContent, FormControlLabel} from "@material-ui/core";
import Radio from "@material-ui/core/Radio";
import DialogActions from "@material-ui/core/DialogActions";
import CancelIcon from "@material-ui/icons/Cancel";
import NavigateNextIcon from "@material-ui/icons/NavigateNext";
import {useTranslation} from "react-i18next";
import {useStepper} from "../stepperForm/StepperContext";
import Button from "@material-ui/core/Button";

export default function MenuRadioGroup({options, selectedValue, onChange }){
    const { t } = useTranslation();
    const { handleClose, nextPage } = useStepper();

    return(
        <>
            <DialogContent className={"form-dialog-container-scroll-disabled"}>
            <FormControl component="fieldset">
                <RadioGroup
                    aria-label="radio-options"
                    name="radio-options"
                    value={selectedValue}
                    onChange={onChange}
                >
                    {options.map((label, index) => (
                        <FormControlLabel
                            key={`${label}-${index}`}
                            value={label}
                            control={<Radio />}
                            label={label}
                        />
                    ))}
                </RadioGroup>
            </FormControl>
            </DialogContent>
            <DialogActions fullWidth>
                <Button onClick={handleClose} startIcon={<CancelIcon/>}>
                    {t('button.cancel')}
                </Button>
                <Button onClick={nextPage} color="primary"  endIcon={<NavigateNextIcon />}>
                    {t('button.next')}
                </Button>
            </DialogActions>
        </>
    );
}

MenuRadioGroup.propTypes = {
    options: PropTypes.array,
    selectedValue: PropTypes.string,
    onChange: PropTypes.func
};
