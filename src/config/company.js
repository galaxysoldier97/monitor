import { Config } from '../config';
import EPIC_LOGO from '../images/EPIC.png';
import MT_LOGO from '../images/MT.png';
import EIR_LOGO from '../images/EIR.png';
import red from '@material-ui/core/colors/red';
import { blue, green } from '@material-ui/core/colors';

export const Companies = Object.freeze({mt: 'MT', epic: 'EPIC', eir: 'EIR', malta: 'MALTA'});


export const isEirCompany = () => Config.company === Companies.eir;

export const isEpicCompany = () => Config.company === Companies.epic;

export const getCompanyName = () => Config.company;

export const getCompanyLogo = () => {
  switch (getCompanyName()) {
    case Companies.eir:
      return EIR_LOGO;
    case Companies.epic:
    case Companies.malta:
      return EPIC_LOGO;
    default:
      return MT_LOGO;
  }
};

export const getCompanyNavBarColor = () => {
  switch (getCompanyName()) {
    case Companies.epic:
    case Companies.malta:
      return '#ffe10f';
    default:
      return '#FFFFFF';
  }
};

export const getCompanyColors = () => {
  switch (getCompanyName()) {
    case Companies.eir:
      return {primary: '#e40046', secondary: '#1D1C06'};
    case Companies.epic:
    case Companies.malta:
      return {primary: '#1D1C06', secondary: '#ffe10f'};
    default:
      return {primary: '#00377b', secondary: '#000000'};
  }
};

export const getCompanyEnv = () => Config.companyProfile && Config.companyProfile.split('-')[1];

export const getCompanyEnvColor = () => {
  const envColors = {
    CI: red[500],
    SIT: blue[600],
    PROD: green[500],
  };
  return getCompanyEnv() && envColors[getCompanyEnv()];
};

export const shouldUseLocalNumbers = () => Config.useLocalNumbers === "true";
