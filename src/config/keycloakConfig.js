import { Config } from '../config';
import { UserManagement } from 'mt-user-management';

export const kcResources = [
  'equipments',
  'resources',
  'services',
  'settings',
  'dashboard',
  'ancillaryequipments',
  'addresses',
  'stock',
];

export const authenticationOptions = {
  url: Config.kcPath,
  realm: Config.kcRealm,
  clientId: Config.kcClient,
  permissionRequest: [{clientId: Config.kcClientPermissions, resources: kcResources}],
};

export const userManagement = UserManagement(authenticationOptions);




