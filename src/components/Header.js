import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import classNames from 'classnames';
import { AppBar, Button, Divider, Grid, IconButton, Menu, MenuItem, Toolbar, Typography } from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import { makeStyles } from '@material-ui/styles';
import { Auth } from '../services/Auth';
import { drawerWidth } from '../config';
import { t } from 'mt-react-library/functions';
import { System } from '../data';
import Chip from '@material-ui/core/Chip';
import { getCompanyEnv, getCompanyEnvColor } from '../config/company';
import PropTypes from 'prop-types';

const useStyles = makeStyles(theme => ({
  appBar: {
    color: theme.palette.primary.contrastText,
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    width: `100%`,
    paddingLeft: drawerWidth,
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  appToolbar: {
    backgroundColor: theme.toolbar.bgColor,
    width: '100%',
  },
  menuButtonContainer: {
    flewGrow: 0,
    flewShrink: 0,
  },
  titleContainer: {
    flexGrow: 1,
  },
  userContainer: {
    flewGrow: 0,
    flewShrink: 0,
  },
  username: {
    textTransform: 'initial',
  },
}));

const Header = ({drawerOpen, handleDrawerOpen, handleDrawerClose}) => {
  const classes = useStyles();
  const [menuElement, setMenuElement] = useState(null);
  const username = Auth.getConnectedUser();
  return (
    <AppBar position="fixed" className={classNames(classes.appBar, {[classes.appBarShift]: drawerOpen})}>
      <Toolbar disableGutters={false} className={classes.appToolbar}>
        <Grid container alignItems="center">
          <Grid item className={classes.menuButtonContainer}>
            <IconButton color="inherit" onClick={drawerOpen ? handleDrawerClose : handleDrawerOpen}>
              <MenuIcon />
            </IconButton>
          </Grid>
          <Grid item className={classes.titleContainer}>
            <Grid container spacing={3} alignItems="center">
              <Grid item>
                <Typography variant="h5" noWrap color="inherit">Technical Repository Monitoring</Typography>
              </Grid>
              {!!getCompanyEnv() && <Grid item>
                <Chip label={getCompanyEnv()} style={{color: getCompanyEnvColor(), fontWeight: 600}} />
              </Grid>}
            </Grid>
          </Grid>
          <Grid item className={classes.userContainer}>
            <Button endIcon={<MoreVertIcon />} color="inherit" aria-haspopup="true" onClick={event => setMenuElement(event.currentTarget)}>
              <Typography className={classes.username}>{username}</Typography>
            </Button>
            <Menu anchorEl={menuElement} open={Boolean(menuElement)} onClose={() => setMenuElement(null)}>
              <MenuItem component={Link} to="/login" onClick={Auth.deauthenticateUser}>{t('header.signOut')}</MenuItem>
              {<Divider />}
              <MenuItem disabled display="block">
                <Typography align="center" display="block" color="secondary">
                  {System.version}
                </Typography>
              </MenuItem>
            </Menu>
          </Grid>
        </Grid>
      </Toolbar>
    </AppBar>
  );
};

Header.propTypes = {
  handleDrawerClose: PropTypes.func,
  handleDrawerOpen: PropTypes.func,
  drawerOpen: PropTypes.bool,
};

export default Header;
