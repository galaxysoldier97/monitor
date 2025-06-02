import React from 'react';
import { Grid, Paper, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import { t } from 'mt-react-library/functions';
import PropTypes from 'prop-types';

const useStyles = makeStyles(theme => ({
  paper: {
    padding: theme.spacing(1, 4),
    backgroundColor: '#fafafa',
  },
  key: {
    color: '#5d5d5d',
    fontSize: '0.9rem',
  },
  value: {
    color: theme.palette.primary.dark,
    fontSize: '0.9rem',
  },
  paperContent: {
    overflow: 'hidden',
    display: 'block',
  },
}));

export const InfoBloc = ({label, value}) => {
  const classes = useStyles();
  return (
    <Paper className={classes.paper} elevation={0}>
      <Grid container direction="column" className={classes.paperContent}>
        <Grid item>
          <Typography className={classes.key}>{t(label)}</Typography>
        </Grid>
        <Grid item>
          <Typography noWrap variant="h5" id={label} className={classes.value}>{value === 0 ? '0' : (value || '-')}</Typography>
        </Grid>
      </Grid>
    </Paper>
  );
};

InfoBloc.propTypes = {
  label: PropTypes.string,
  value: PropTypes.string,
};
