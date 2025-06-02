import React from 'react';
import { Button, Grid, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import RedColor from '@material-ui/core/colors/red';
import PropTypes from 'prop-types';
import { t } from 'mt-react-library/functions';
import Box from '@material-ui/core/Box';

const useStyles = makeStyles(theme => ({
  root: {
    margin: 'auto',
    width: '100%',
    backgroundColor: RedColor[50],
    padding: theme.spacing(2, 3),
    borderRadius: 5,
  },
  title: {
    color: RedColor[600],
    fontWeight: 'bold',
    textShadow: '0 0 5px white',
  },
}));

export const ErrorAlert = ({message, marginY = 5, fullWidth = false, retry}) => {
  const classes = useStyles();

  return (
    <Box marginY={marginY} margin="auto" style={fullWidth ? {width: '100%'} : {}}>
      <div className={classes.root} style={fullWidth ? {width: '100%'} : {maxWidth: 500}}>
        <Grid container justify="space-between" alignItems="center">
          <Grid item>
            <Typography className={classes.title}>{t('error.title')}</Typography>
            <Typography>{message}</Typography>
          </Grid>
          {retry && (
            <Grid item>
              <Button onClick={retry} variant="outlined">{t('error.retry')}</Button>
            </Grid>
          )}
        </Grid>
      </div>
    </Box>
  );
};

ErrorAlert.propTypes = {
  message: PropTypes.string.isRequired,
  marginY: PropTypes.number,
  fullWidth: PropTypes.bool,
  retry: PropTypes.func,
};
