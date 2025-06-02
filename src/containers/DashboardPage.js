import React from 'react';
import { Dialpad, SignalCellular0Bar, SimCard } from '@material-ui/icons';
import { BottomNavigation, BottomNavigationAction, Paper } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import { Auth } from '../services/Auth';
import ResourcesDashboard from '../components/dashboard/resources/ResourcesDashboard';
import EquipmentsDashboard from '../components/dashboard/equipments/EquipmentsDashboard';
import ServicesDashboard from '../components/dashboard/services/ServicesDashboard';
import { t } from 'mt-react-library/functions';

const useStyles = makeStyles(theme => ({
  navActionSelected: {
    color: theme.palette.primary.main,
  },
}));

const DashboardPage = () => {
  const permissionResources = Auth.connectedUserHasPermission('NUMBERS_READ');
  const permissionEquipments = Auth.connectedUserHasPermission('SIMCARD_READ');
  const permissionServices = Auth.connectedUserHasPermission('SERVICESACCESS_READ', 'SERVICESCOMPONENT_READ');
  const [resourcesTabIndex, equipmentsTabIndex, servicesTabIndex] = [...Array(3)].map((_, i) => i);

  const resolveSelectedIndex = () => {
    if (permissionResources) {
      return resourcesTabIndex;
    }
    return undefined;
  };

  const classes = useStyles();
  const [selectedIndex, setSelectedIndex] = React.useState(resolveSelectedIndex());

  const changeDashboard = (event, index) => {
    setSelectedIndex(index);
  };

  return (
    <>
      <Paper>
        <BottomNavigation value={selectedIndex} onChange={changeDashboard} showLabels>
          {permissionResources && <BottomNavigationAction classes={{selected: classes.navActionSelected}}
                                                          label={t('menu.resources')} value={resourcesTabIndex}
                                                          icon={<Dialpad color={selectedIndex === resourcesTabIndex ? 'primary' : 'secondary'} />}
          />}
          {permissionEquipments && <BottomNavigationAction classes={{selected: classes.navActionSelected}}
                                                           label={t('menu.equipments')} value={equipmentsTabIndex}
                                                           icon={<SimCard color={selectedIndex === equipmentsTabIndex ? 'primary' : 'secondary'} />}
          />}
          {permissionServices && <BottomNavigationAction classes={{selected: classes.navActionSelected}}
                                                         label={t('menu.services')} value={servicesTabIndex}
                                                         icon={<SignalCellular0Bar color={selectedIndex === servicesTabIndex ? 'primary' : 'secondary'} />}
          />}
        </BottomNavigation>
      </Paper>
      {permissionResources && selectedIndex === resourcesTabIndex && <ResourcesDashboard />}
      {permissionEquipments && selectedIndex === equipmentsTabIndex && <EquipmentsDashboard />}
      {permissionServices && selectedIndex === servicesTabIndex && <ServicesDashboard />}
    </>
  );
};

DashboardPage.propTypes = {};

export default DashboardPage;
