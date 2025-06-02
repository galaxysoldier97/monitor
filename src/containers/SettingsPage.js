import React, { PropTypes, useState } from 'react';
import { NavigationBuilder } from 'mt-react-library/components/NavigationBuilder';
import { t } from 'mt-react-library/functions';
import PageBase from '../components/PageBase';
import FormControl from '@material-ui/core/FormControl/FormControl';
import InputLabel from '@material-ui/core/InputLabel/InputLabel';
import Select from '@material-ui/core/Select/Select';
import FilledInput from '@material-ui/core/FilledInput/FilledInput';
import MenuItem from '@material-ui/core/MenuItem/MenuItem';
import { makeStyles } from '@material-ui/styles';
import store from '../store';
import Actions from '../actions/Actions';
import {useTranslation} from "react-i18next";

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex !important',
    flexWrap: 'wrap !important',
  },
  formControl: {
    margin: theme.spacing(1) + ' !important',
    minWidth: '120 !important',
  },
  button: {
    margin: theme.spacing(1) + ' !important',
  },
}));

const SettingsPage = ({language: lang}) => {
  const classes = useStyles();
  const [language, setLanguage] = useState(lang);
  const { i18n } = useTranslation();

  let navigation = new NavigationBuilder(null, store)
  .withHRef(Actions.SETTINGS, {
    ajax: true, mapper: (action, input) => {
      setLanguage(input.target.language);
      action.params = [input.target.language];
    },
  })
  .build();
  const handleChange = (event) => {
    navigation.hrefOnClick(Actions.SETTINGS)({language: event.target.value});
    i18n.changeLanguage(event.target.value);
  };

  return <PageBase title={t('settings.title')} navigation={t('settings.navigation')}>

    <form className={classes.root} autoComplete="off">
      <FormControl variant="filled" className={classes.formControl}>
        <InputLabel htmlFor="filled-language-simple">{t('settings.language')}</InputLabel>
        <Select
          value={language}
          onChange={handleChange}
          input={<FilledInput name="language" id="filled-language-simple" />}
        >
          <MenuItem value="FR">{t('settings.french')}</MenuItem>
          <MenuItem value="EN">{t('settings.english')}</MenuItem>
        </Select>
      </FormControl>
    </form>

  </PageBase>;

};

SettingsPage.propTypes = {
  language: PropTypes.string,
};

export default SettingsPage;
