import {makeStyles} from "@material-ui/styles";
import {Add} from "@material-ui/icons";
import React from "react";
import {useTranslation} from "react-i18next";

const useStyles = makeStyles(theme => ({
  button: {
    backgroundColor: theme.palette.primary.main,
    border: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    fontSize: '14px',
    fontWeight: 500,
    padding: '7px 15px',
    width: '100%',
    borderRadius: '5px',
    boxShadow: '0 3px 1px -2px rgba(0,0,0,0.2), 0px 2px 2px 0px rgba(0,0,0,0.14), 0px 1px 5px 0px rgba(0,0,0,0.12)',
    color: 'white',
    fontFamily: 'Roboto, sans-serif',
    cursor: 'pointer',
    textTransform: 'uppercase',
    '&:hover': {
      backgroundColor: theme.palette.primary.main,
    },
  },
}));

export default function ContainedButton(){
  const { t } = useTranslation();
  const classes = useStyles();
  return (
    <button className={classes.button}>
      <Add/>{t('add')}
    </button>
  );
}
