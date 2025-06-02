import React from 'react';
import { Divider, Paper } from '@material-ui/core';
import { KeyboardBackspace } from '@material-ui/icons';
import globalStyles from '../css/styles';
import { withRouter } from 'react-router-dom';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import PropTypes from 'prop-types';

const GoBack = ({history}) => <KeyboardBackspace onClick={() => history.goBack()} alt="Go back" />;

GoBack.propTypes = {
  history: PropTypes.object,
};

const BackButton = withRouter(GoBack);

const PageBase = props => {
  const {title, navigation, backButton, subMenu, actionButton, children} = props;

  return (
    <>
      <Grid container justify="space-between">
        <Grid item>
          <Grid container spacing={1}>
            <Grid item style={{cursor: 'pointer'}}>
              {backButton && <BackButton />}
            </Grid>
            <Grid item style={globalStyles.navigation}>
              <Typography>{navigation}</Typography>
            </Grid>
          </Grid>
        </Grid>
        <Grid item>{subMenu}</Grid>
      </Grid>
      <Paper style={globalStyles.paper}>
        <Grid container justify="space-between" alignContent="center">
          <Grid item>
            <Typography variant="h3" style={globalStyles.title}>{title}</Typography>
          </Grid>
          <Grid item>
            {actionButton}
          </Grid>
        </Grid>
        <Divider />
        {children}
        <div style={globalStyles.clear} />
      </Paper>
    </>
  );
};

PageBase.propTypes = {
  title: PropTypes.string,
  navigation: PropTypes.string,
  children: PropTypes.element,
  backButton: PropTypes.bool,
  subMenu: PropTypes.element,
  actionButton: PropTypes.element,
};

export default PageBase;
