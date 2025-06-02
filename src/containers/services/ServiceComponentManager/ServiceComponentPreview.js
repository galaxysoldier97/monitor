import { Chip, Grid, Paper, Typography } from '@material-ui/core';
import React from 'react';
import { Link } from 'react-router-dom';
import { makeStyles } from '@material-ui/styles';
import { serviceInfoPropType } from '../ServiceAccessManager/ServiceInfoPage';
import { getDate } from '../../../helpers/commonHelper';
import { ROUTES } from '../../../config/routes';

const useStyles = makeStyles(theme => ({
  paper: {
    padding: theme.spacing(1, 4),
    backgroundColor: '#fafafa',
  },
  link: {
    textDecoration: 'none',
  },
}));

const ServiceComponentPreview = ({serviceComponent}) => {
  const classes = useStyles();

  return (
    <Paper elevation={0} className={classes.paper}>
      <Link to={ROUTES.serviceInfo.path.replace(':serviceId', serviceComponent.serviceId)} className={classes.link}>
        <Grid container direction="column" spacing={1}>
          <Grid item xs>
            <Grid container spacing={1}>
              <Grid item>
                <Typography variant="h5">{serviceComponent.componentType || serviceComponent.serviceActivity}</Typography>
              </Grid>
              {serviceComponent.componentType && serviceComponent.serviceActivity && <Grid item>{' - '}</Grid>}
              {serviceComponent.componentType && <Grid item>
                <Typography variant="caption" color="secondary">{serviceComponent.serviceActivity}</Typography>
              </Grid>}
            </Grid>
          </Grid>
          <Grid item xs>
            <Grid container spacing={1}>
              <Grid item>
                <Chip size="small" label={serviceComponent.status} />
              </Grid>
              {serviceComponent.activationDate && <Grid item>
                <Typography variant="caption" display="block" color="secondary">{getDate(serviceComponent.activationDate)}</Typography>
              </Grid>}
            </Grid>
          </Grid>
        </Grid>
      </Link>
    </Paper>
  );
};

ServiceComponentPreview.propTypes = {
  serviceComponent: serviceInfoPropType,
};

export default ServiceComponentPreview;
