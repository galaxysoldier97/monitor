import React from 'react';
import PropTypes from 'prop-types';
import { isEmpty, t } from 'mt-react-library/functions';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/styles';
import { getAddressDescription, getDate, isDate } from '../helpers/commonHelper';
import { BooleanInfoIcon } from '../components/BooleanInfoIcon';

const useStyles = makeStyles(theme => ({
  container: {
    padding: theme.spacing(1, 0),
  },
  key: {
    fontSize: '0.9rem',
    textTransform: 'capitalize'
  },
  value: {
    color: theme.palette.primary.dark,
    fontSize: '0.9rem',
    fontWeight: 500,
  },
}));

const rowMapper = (k, v) => {
  switch (k) {
    case 'plmn':
      return v ? v.code : '';
    case 'address':
      return getAddressDescription(v);
    case 'building':
      return v ? v.buildingCode : '';
    case 'numbers':
      return `[${v[0].number}...${v[v.length - 1].number}]`;
    case 'rangeNumber':
      return v ? v.rangeId : '';
    case 'warehouse':
      return v?.name;
    default:
      break;
  }
  if (v === null || typeof v === 'object' || Array.isArray(v)) {
    return '';
  }
  if (typeof v === 'boolean') {
    return <BooleanInfoIcon value={v} />;
  }
  if (v && typeof v === 'string' && isDate(v)) {
    return getDate(v);
  }
  return v;
};

const HistoryInfoDetails = ({showNull = false, item}) => {
  const classes = useStyles();

  return (
    <Grid container direction="column" className={classes.container}>
      {Object.entries(item).map(([key, value], index) => {
        if (showNull || !isEmpty(value)) {
          return (
            <Grid item key={index}>
              <Grid container spacing={1}>
                <Grid item><Typography className={classes.key}>{t(key)}</Typography></Grid>
                <Grid item><Typography className={classes.value}>{rowMapper(key, value)}</Typography></Grid>
              </Grid>
            </Grid>
          );
        }
      })}
    </Grid>
  );
};

HistoryInfoDetails.propTypes = {
  item: PropTypes.object,
  showNull: PropTypes.bool,
};

export default HistoryInfoDetails;
