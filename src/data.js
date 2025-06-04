import React from 'react';
import {
  AllInbox,
  AspectRatio,
  Assessment,
  Dialpad,
  LinearScale,
  LocationCity,
  LocationOn,
  Lock,
  Map,
  Settings,
  SignalCellular0Bar,
  SignalCellularAlt,
  SimCard,
  Storefront,
  SupervisorAccount,
  ViewCompact
} from '@material-ui/icons';
import Actions from './actions/Actions';
import {Config} from './config';
import {t} from 'mt-react-library/functions';
import packageConfig from '../package.json';
import {resourcesScopes} from './config/resources/resourcesScopes';
import {Companies} from './config/company';
import {ROUTES} from './config/routes';

export const System = {
  version: packageConfig.version,
  menus: [
    {
      text: t('menu.dashboard'),
      icon: <Assessment />,
      link: '/dashboard',
      requiredPermissions: ['DASHBOARD_READ'],
    },
    {
      text: 'User Management',
      icon: <SupervisorAccount />,
      link: '/access',
      requiredPermissions: ['TEAM_READ', 'USER_READ'],
      category: 'settings',
    },
    {
      text: 'Permission Management',
      icon: <Lock />,
      link: '/permissions',
      requiredPermissions: ['ACL_READ'],
      category: 'settings',
    },
    {
      text: 'Configuration',
      icon: <Settings />,
      link: '/configuration',
      requiredPermissions: ['CFG_READ'],
      category: 'settings',
    },
    {
      id: 'simcards',
      text: t('menu.simcards'),
      icon: <SimCard />,
      link: '/simCard',
      requiredPermissions: [resourcesScopes.simCard.read],
      category: 'equipments',
    },
    {
      id: 'cpes',
      text: t('menu.cpes'),
      icon: <ViewCompact />,
      link: '/cpes',
      requiredPermissions: [resourcesScopes.cpe.read],
      category: 'equipments',
    },
    {
      id: 'ancillaryEquipments',
      text: t('menu.ancillaryEquipments'),
      icon: <AllInbox />,
      link: ROUTES.ancillaryEquipments.path,
      requiredPermissions: [resourcesScopes.ancillaryEquipments.read],
      category: 'equipments',
    },
    {
      id: 'equipmentsAdmin',
      text: t('menu.admin'),
      icon: <Settings />,
      link: '/equipmentsAdmin',
      requiredPermissions: [resourcesScopes.equipmentsAdmin.read],
      category: 'equipments',
    },
    {
      id: 'numbers',
      text: t('menu.numbers'),
      icon: <Dialpad />,
      link: '/numbers',
      requiredPermissions: [resourcesScopes.number.read],
      category: 'resources',
    },
    {
      id: 'rangeNumbers',
      text: t('menu.rangeNumbers'),
      icon: <LinearScale />,
      link: '/rangeNumbers',
      requiredPermissions: [resourcesScopes.number.read],
      excludedPermissions: ['NUMBERS_EQUIPMENTS_DASHBOARD_READ'],
      category: 'resources',
    },
    {
      id: 'ipAddresses',
      text: t('menu.ipAddresses'),
      icon: <LocationOn />,
      link: '/ipAddresses',
      requiredPermissions: [resourcesScopes.number.read],
      excludedPermissions: ['NUMBERS_EQUIPMENTS_DASHBOARD_READ'],
      category: 'resources',
    },
    {
      id: 'resourcesAdmin',
      text: t('menu.admin'),
      icon: <Settings />,
      link: '/resourcesAdmin',
      requiredPermissions: [resourcesScopes.resourceConf.read],
      excludedPermissions: ['NUMBERS_EQUIPMENTS_DASHBOARD_READ'],
      category: 'resources',
    },
    {
      id: 'servicesAccess',
      text: t('menu.services.access'),
      icon: <SignalCellular0Bar />,
      link: '/servicesAccess',
      requiredPermissions: [resourcesScopes.serviceAccess.read],
      category: 'services',
    },
    {
      id: 'servicesComponent',
      text: t('menu.services.component'),
      icon: <SignalCellularAlt />,
      link: '/servicesComponent',
      requiredPermissions: [resourcesScopes.serviceComponent.read],
      category: 'services',
    },
    {
      id: 'servicesAdmin',
      text: t('menu.admin'),
      icon: <Settings />,
      link: Actions.SERVICE_ADMIN.getRoutePath(),
      requiredPermissions: [resourcesScopes.servicesAdmin.read],
      category: 'services',
    },
    {
      id: 'settings',
      text: t('menu.settings'),
      icon: <Settings />,
      link: '/settings',
      requiredPermissions: [resourcesScopes.settings.read],
    },
    {
      id: 'postalAdresses',
      text: t('menu.postalAdresses'),
      icon: <LocationCity />,
      link: '/postaladresses',
      requiredPermissions: [resourcesScopes.address.read],
      category: 'address',
    },
    {
      id: 'building',
      text: t('menu.building'),
      icon: <LocationCity />,
      link: '/buildings',
      requiredPermissions: [resourcesScopes.address.read],
      category: 'address',
    },
    {
      id: 'map',
      text: t('menu.map'),
      icon: <Map />,
      link: '/map',
      requiredPermissions: [resourcesScopes.address.read],
      category: 'address',
      hidden: Config.company !== Companies.mt
    },
    {
      id: 'addressAdmin',
      text: t('menu.admin'),
      icon: <Settings />,
      link: '/addressAdmin',
      requiredPermissions: [resourcesScopes.addressAdmin.read],
      category: 'address',
    },
    {
      id: 'handsets',
      text: t('menu.handsets'),
      icon: <Storefront />,
      link: '/handsets',
      requiredPermissions: [resourcesScopes.handset.read],
      category: 'stock',
    },
    {
      id: 'handsetModels',
      text: t('menu.handsetmodels'),
      icon: <AspectRatio />,
      link: '/handsetmodels',
      requiredPermissions: [resourcesScopes.handset.read],
      category: 'stock',
    },
    {
      id: 'stockAdmin',
      text: t('menu.admin'),
      icon: <Settings />,
      link: '/stockAdmin',
      requiredPermissions: [resourcesScopes.stockAdmin.read],
      category: 'stock',
    },
  ],
};

export const unmUi = {
  access: {
    url: Config.unmBaseUrl + '/accesses',
  },
};

export const Backend = {
  settings: {
    authentication: {
      url: Config.tecrepApiBaseUrl + '/login',
    },
    logout: {
      url: Config.tecrepApiBaseUrl + '/logout',
    },
    users: {
      url: Config.tecrepApiBaseUrl + '/rest/api/user/v1',
    },
    userMenuPreferences: {
      url: Config.tecrepApiBaseUrl + '/rest/api/userMenuPreferences/v1',
      enabled: !!Config.tecrepApiBaseUrl,
    },
    teams: {
      url: Config.tecrepApiBaseUrl + '/rest/api/team/v1',
    },
    permissions: {
      url: Config.tecrepApiBaseUrl + '/rest/api/permissions/v1',
    },
    roles: {
      url: Config.tecrepApiBaseUrl + '/rest/services/userrole',
    },
    configuration: {
      url: Config.tecrepApiBaseUrl + '/rest/api/configuration/v1',
    },
  },
  unm: {
    access: {
      url: Config.unmBaseUrl + '/accesses',
    },
  },
  services: {
    dashboard: {
      url: Config.tecrepApiServicesUrl + '/private/auth/servicesDashboard',
    },
    service: {
      url: Config.tecrepApiServicesUrl + '/private/auth/services',
    },
    access: {
      url: Config.tecrepApiServicesUrl + '/private/auth/accessservices',
    },
    component: {
      url: Config.tecrepApiServicesUrl + '/private/auth/componentservices',
    },
    import: {
      url: Config.tecrepApiServicesUrl + '/private/auth/import',
    },
    activationCode: {
      url: Config.tecrepApiServicesUrl + '/private/auth/activationcodes',
    },
    provisioningTag: {
      url: Config.tecrepApiServicesUrl + '/private/auth/provisioningtags',
    },
    provisioningActions: {
      url: Config.tecrepApiServicesUrl + '/private/auth/provisioningactions',
    },
    tagActivationCodes: {
      url: Config.tecrepApiServicesUrl + '/private/auth/tagactivationcodes',
    },
    product: {
      url: Config.tecrepApiServicesUrl + '/private/auth/products',
    },
    technicalParameters: {
      url: Config.tecrepApiServicesUrl + '/private/auth/technicalparameters',
    },
    activities: {
      url: Config.tecrepApiServicesUrl + '/public/enums/activity',
    },
    componentTypes: {
      url: Config.tecrepApiServicesUrl + '/public/enums/componentType',
    }
  },
  equipments: {
    dashboard: {
      url: Config.tecrepApiEquipmentsUrl + '/api/v1/private/auth/equipmentsDashboard',
    },
    simcards: {
      url: Config.tecrepApiEquipmentsUrl + '/api/v2/private/auth/simcards',
    },
    cpes: {
      url: Config.tecrepApiEquipmentsUrl + '/api/v2/private/auth/cpes',
    },
    ancillaryEquipments: {
      url: Config.tecrepApiEquipmentsUrl + '/api/v2/private/auth/ancillaryequipments',
    },
    warehouses: {
      url: Config.tecrepApiEquipmentsUrl + '/api/v2/private/auth/warehouses',
    },
    plmns: {
      url: Config.tecrepApiEquipmentsUrl + '/api/v2/private/auth/plmns',
    },
    providers: {
      url: Config.tecrepApiEquipmentsUrl + '/api/v2/private/auth/providers',
    },
    inventorypools: {
      url: Config.tecrepApiEquipmentsUrl + '/api/v1/private/auth/inventorypools',
    },
    fileConfigurations: {
      url: Config.tecrepApiEquipmentsUrl + '/api/v1/private/auth/fileConfiguration',
    },
    simcardConfiguration: {
      url: Config.tecrepApiEquipmentsUrl + '/api/v2/private/auth/simGenerationConfigurations',
    },
    batches: {
      url: Config.tecrepApiEquipmentsUrl + '/api/v1/private/auth/batch',
    },
    equipmentModel: {
      url: Config.tecrepApiEquipmentsUrl + '/api/v2/private/auth/equipmentModels',
    },
    jobConfiguration: {
      url: `${Config.tecrepApiEquipmentsUrl}/api/v1/private/auth/job/configuration`
    },
    import: {
      url: Config.tecrepApiEquipmentsUrl + '/private/auth/import',
    },
    eSimNotification: {
      url: Config.tecrepApiEquipmentsUrl + '/esim/notification',
    }
  },
  resources: {
    dashboard: {
      url: Config.tecrepApiResourcesUrl + '/private/auth/resourcesDashboard',
    },
    numbers: {
      url: Config.tecrepApiResourcesUrl + '/api/v2/private/auth/numbers',
    },
    ipAddresses: {
      url: Config.tecrepApiResourcesUrl + '/api/v1/private/auth/ipaddresses',
    },
    blockNumbers: {
      url: Config.tecrepApiResourcesUrl + '/api/v2/private/auth/blocknumbers',
    },
    intervalNumbers: {
      url: Config.tecrepApiResourcesUrl + '/api/v2/private/auth/intervalnumbers',
    },
    jobConfiguration: {
      url: Config.tecrepApiResourcesUrl + '/api/v1/private/auth/job/configuration',
    },
    activities: {
      url: Config.tecrepApiResourcesUrl + '/public/enums/activity',
    },
    import: {
      url: Config.tecrepApiResourcesUrl + '/private/auth/import',
    }
  },
  address: {
    buildings: {
      url: Config.tecrepApiAddressUrl + '/private/auth/buildings',
    },
    postalAddress: {
      url: Config.tecrepApiAddressUrl + '/private/auth/postaladdresses',
    },
    buildingStatus: {
      url: Config.tecrepApiAddressUrl + '/private/auth/buildingStatus',
    },
    address: {
      url: Config.tecrepApiAddressUrl + '/private/auth/addresses',
    },
    buildingFlat: {
      url: Config.tecrepApiAddressUrl + '/private/auth/buildingflats',
    },
    externalRefAddresses: {
      url: Config.tecrepApiAddressUrl + '/private/auth/externalrefaddresses',
    },
    accessPoints: {
      url: Config.tecrepApiAddressUrl + '/private/auth/accessPoints',
    },
    ptos: {
      url: Config.tecrepApiAddressUrl + '/private/auth/ptos',
    },
    import: {
      url: Config.tecrepApiAddressUrl + '/private/auth/import',
    },
    streets: {
      url: Config.tecrepApiAddressUrl + '/private/auth/streets',
    },
  },
  stock: {
    handsets: {
      url: Config.tecrepApiStockMgmtUrl + '/private/auth/handsets',
    },
    handsetModels: {
      url: Config.tecrepApiStockMgmtUrl + '/private/auth/handsetmodels',
    },
    warehouses: {
      url: Config.tecrepApiStockMgmtUrl + '/private/auth/warehouses',
    },
    manufacturers: {
      url: Config.tecrepApiStockMgmtUrl + '/private/auth/manufacturers',
    },
  },
  DeliveryFile: {
    import: {
      url: Config.tecrepApiStockMgmtUrl + '/private/auth/import',
    },
  },
};
