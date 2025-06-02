import React, { PropTypes } from 'react';
import {t} from "mt-react-library/functions";
import WizardFieldToEditSelector from "./WizardFieldToEditSelector";
import {isEirCompany} from "../config/company";
import {UpdateWizardType} from "../config/UpdateWizardType";

const WizardUpdateTypeSelector = ({values, onChange}) => {
  return (
    <WizardFieldToEditSelector name="type" values={values} onChange={onChange} fields={[
      {name: UpdateWizardType.STATUS, label: t('status')},
      {name: UpdateWizardType.SERVICE, label: t('service'), disabled: isEirCompany()}
    ]} />
  );
};

WizardUpdateTypeSelector.propTypes = {
  values: PropTypes.object,
  onChange: PropTypes.func,
};

export default WizardUpdateTypeSelector;
