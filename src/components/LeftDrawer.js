import React, { useState } from 'react';
import { Collapse, Drawer, List, ListItem, ListItemIcon, ListItemText } from '@material-ui/core';
import { ExpandLess, ExpandMore } from '@material-ui/icons';
import { makeStyles } from '@material-ui/styles';
import { Link } from 'react-router-dom';
import { TecrepUserMenuPreferencesService } from '../services/TecrepUserMenuPreferencesService';
import { Auth } from '../services/Auth';
import { drawerWidth } from '../config';
import { t } from 'mt-react-library/functions';
import { getCompanyLogo, getCompanyName } from '../config/company';
import GreyColor from '@material-ui/core/colors/grey';
import PropTypes from 'prop-types';

const useStyles = makeStyles(theme => ({
  list: {
    width: '100%',
    height: '100%',
    maxWidth: 360,
    display: 'block',
  },
  menuItemIcon: {
    fontSize: 14,
    color: GreyColor[500],
  },
  menuItemText: {
    color: theme.palette.secondary.light + ' !important',
    fontSize: 14,
  },
  avatarDiv: {
    padding: '15px 0 20px 15px',
    height: 60,
  },
  avatarIcon: {
    float: 'left',
    display: 'block',
    marginRight: 15,
    boxShadow: '0px 0px 0px 8px rgba(0,0,0,0.2)',
    padding: 2,
  },
  avatarSpan: {
    paddingTop: 12,
    display: 'block',
    color: theme.palette.secondary.contrastText,
    fontWeight: 300,
    textShadow: '1px 1px #444',
  },
  hide: {
    display: 'none',
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
  },
  drawerPaper: {
    width: drawerWidth,
    backgroundColor: theme.palette.secondary.dark + ' !important',
  },
  drawerHeader: {
    display: 'flex',
    alignItems: 'center',
    padding: '0 8px',
    ...theme.mixins.toolbar,
    justifyContent: 'center',
    cursor: 'pointer',
    fontSize: 18,
    backgroundColor: theme.drawer.bgColor || theme.palette.primary.main,
  },
}));

const LeftDrawer = ({drawerOpen, menus, userMenu, refreshUserMenu}) => {
  const classes = useStyles();
  const [userMenuPreferences, setUserMenuPreferences] = useState(userMenu.preferences);

  const login = Auth.getConnectedUser();
  const categories = [
    {id: 'resources', key: 'resources', value: t('menu.resources')},
    {id: 'equipments', key: 'equipments', value: t('menu.equipments')},
    {id: 'services', key: 'services', value: t('menu.services')},
    {id: 'address', key: 'address', value: t('menu.address')},
    {id: 'settings', key: 'settings', value: t('menu.settings')},
    {id: 'stock', key: 'stock', value: t('menu.stock')},
  ];

  const toggleCategory = category => {
    const preferences = {...userMenuPreferences, [category.key]: !userMenuPreferences[category.key]};
    setUserMenuPreferences(preferences);
    if (userMenu.id) {
      return TecrepUserMenuPreferencesService.update({...userMenu, preferences})
      .then(result => result && refreshUserMenu())
      .catch();
    }
    return TecrepUserMenuPreferencesService.create({...userMenu, preferences}, login)
    .then(result => result && refreshUserMenu())
    .catch();
  };

  return (
    <Drawer className={classes.drawer} variant="persistent" open={drawerOpen} classes={{paperAnchorLeft: classes.drawerPaper}}>
      <div className={classes.drawerHeader}>
        <img src={getCompanyLogo()} alt={getCompanyName()} height="49px" />
      </div>
      <List component="nav" className={classes.list}>
        {menus.filter(m => !m.category).map(m => (
          <ListItem button component={Link} to={m.link} key={m.category + m.link}>
            <ListItemIcon id={m.id} className={classes.menuItemIcon}>{m.icon}</ListItemIcon>
            <ListItemText disableTypography className={classes.menuItemText}>{m.text}</ListItemText>
          </ListItem>
        ))}
        {categories.map(category => {
          if (menus.filter(menu => menu.category === category.key).length === 0) {
            return null;
          }
          return (
            <div key={category.key}>
              <ListItem button onClick={() => toggleCategory(category)}>
                <ListItemText id={category.id} disableTypography className={classes.menuItemText}>{category.value}</ListItemText>
                {userMenuPreferences[category.key]
                  ? <ExpandLess className={classes.menuItemText} />
                  : <ExpandMore className={classes.menuItemText} />}
              </ListItem>
              <Collapse in={userMenuPreferences[category.key]} timeout="auto" unmountOnExit>
                <List disablePadding>
                  {menus.filter(m => m.category === category.key).map((menu, index) => (
                    <ListItem key={index} button component={Link} to={menu.link}>
                      <ListItemIcon className={classes.menuItemIcon}>{menu.icon}</ListItemIcon>
                      <ListItemText id={menu.id} disableTypography className={classes.menuItemText}>{menu.text}</ListItemText>
                    </ListItem>
                  ))}
                </List>
              </Collapse>
            </div>);
        })}
      </List>
    </Drawer>
  );
};

LeftDrawer.propTypes = {
  drawerOpen: PropTypes.bool.isRequired,
  menus: PropTypes.array.isRequired,
  userMenu: PropTypes.object.isRequired,
  refreshUserMenu: PropTypes.func.isRequired,
};

export default LeftDrawer;
