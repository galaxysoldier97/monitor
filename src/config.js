const getRuntimeEnv = key => (window._env && window._env[key]) ? `${window._env[key]}` : undefined;

export const Config = {
  tecrepApiEquipmentsUrl: getRuntimeEnv('_API_EQUIPMENTS'),
  tecrepApiServicesUrl: getRuntimeEnv('_API_SERVICES'),
  tecrepApiResourcesUrl: getRuntimeEnv('_API_RESOURCES'),
  tecrepApiAddressUrl: getRuntimeEnv('_API_ADDRESSES'),
  tecrepApiStockMgmtUrl: getRuntimeEnv('_API_STOCK_MGMT'),
  tecrepApiInventoryIntegrationUrl: getRuntimeEnv('_API_INVENTORY_INTEGRATION'),
  tecrepApiInventoryIntegrationStfUrl: getRuntimeEnv('_API_INVENTORY_INTEGRATION_STATEFUL'),
  apiProductCatalog: getRuntimeEnv('_API_PRODUCT_CATALOG'),
  kcPath: getRuntimeEnv('KEYCLOAK_AUTH_PATH'),
  kcRealm: getRuntimeEnv('KEYCLOAK_AUTH_REALM'),
  kcSecret: getRuntimeEnv('KEYCLOAK_AUTH_SECRET'),
  kcClient: getRuntimeEnv('KEYCLOAK_AUTH_CLIENT') || 'tecrep-monitor-public',
  kcClientPermissions: getRuntimeEnv('KEYCLOAK_AUTH_CLIENT_PERMISSIONS') || 'tecrep-monitor',
  unmBaseUrl: getRuntimeEnv('_UNM'),
  company: getRuntimeEnv('COMPANY'),
  useLocalNumbers: getRuntimeEnv('USE_LOCAL_NUMBERS'),
  tecrepApiBaseUrl: process.env._API,
  companyProfile: process.env._PROFILE,
};

export const drawerWidth = 235;
