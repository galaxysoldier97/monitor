import React from 'react';
import Actions from '../actions/Actions';
import { resourcesScopes } from './resources/resourcesScopes';

const NumberManagerPage = React.lazy(() => import('../containers/resources/NumberManager/NumberManagerPage'));
const HandsetsManagerPage = React.lazy(() => import('../containers/stock/HandsetsManagerPage'));
const StockAdminManagerPage = React.lazy(() => import('../containers/stock/stockAdmin/StockAdminManagerPage'));
const BuildingMap = React.lazy(() => import('../containers/BuildingMap'));
const PostalAddressInfoPage = React.lazy(() => import('../containers/address/PostalAddressManager/PostalAddressInfoPage'));
const CPEInfoPage = React.lazy(() => import('../containers/equipments/CPEManager/CPEInfoPage'));
const CPEManagerPage = React.lazy(() => import('../containers/equipments/CPEManager/CPEManagerPage'));
const BuildingFlatPtoInfoPage = React.lazy(() => import('../containers/address/BuildingManager/BuildingFlatPtoInfoPage'));
const BuildingFlatInfoPage = React.lazy(() => import('../containers/address/BuildingManager/BuildingFlatInfoPage'));
const BuildingInfoPage = React.lazy(() => import('../containers/address/BuildingManager/BuildingInfoPage'));
const BuildingManagerPage = React.lazy(() => import('../containers/address/BuildingManager/BuildingManagerPage'));
const PostalAdressManagerPage = React.lazy(() => import('../containers/address/PostalAddressManager/PostalAdressManagerPage'));
const HistoricManagerPage = React.lazy(() => import('../containers/HistoricManagerPage'));
const ServiceAdministrationManagerPage = React.lazy(() => import('../containers/services/administration/ServiceAdminManagerPage'));
const EntityImportPage = React.lazy(() => import('../containers/EntityImportPage'));
const ActivationCodeManagerPage = React.lazy(() => import('../containers/services/administration/ActivationCodeManagerPage'));
const ServiceAccessManagerPage = React.lazy(() => import('../containers/services/ServiceAccessManager/ServiceAccessManagerPage'));
const ServiceComponentManagerPage = React.lazy(() => import('../containers/services/ServiceComponentManager/ServiceComponentManagerPage'));
const ServiceInfoPage = React.lazy(() => import('../containers/services/ServiceAccessManager/ServiceInfoPage'));
const ProvisioningTagManagerPage = React.lazy(() => import('../containers/services/ProvisioningTagManager/ProvisioningTagManagerPage'));
const ProvisioningTagInfoPage = React.lazy(() => import('../containers/services/ProvisioningTagManager/ProvisioningTagInfoPage'));
const BlockNumberInfoPage = React.lazy(() => import('../containers/resources/ResourcesAdminManager/BlockNumberInfoPage'));
const ResourcesAdminManagerPage = React.lazy(() => import('../containers/resources/ResourcesAdminManager/ResourcesAdminManagerPage'));
const NumberInfoPage = React.lazy(() => import('../containers/resources/NumberManager/NumberInfoPage'));
const RangeNumbersManagerPage = React.lazy(() => import('../containers/resources/RangeNumbersManager/RangeNumbersManagerPage'));
const RangeNumberInfoPage = React.lazy(() => import('../containers/resources/RangeNumbersManager/RangeNumberInfoPage'));
const AncillaryEquipmentInfoPage = React.lazy(() => import('../containers/equipments/AncillaryEquipmentManager/AncillaryEquipmentInfoPage'));
const AncillaryEquipmentManagerPage = React.lazy(() => import('../containers/equipments/AncillaryEquipmentManager/AncillaryEquipmentManagerPage'));
const SIMCardBatchesPage = React.lazy(() => import('../containers/equipments/SimcardManager/SIMCardBatchesPage'));
const SimCardInfoPage = React.lazy(() => import('../containers/equipments/SimcardManager/SimCardInfoPage'));
const SIMCardManagerPage = React.lazy(() => import('../containers/equipments/SimcardManager/SIMCardManagerPage'));
const SettingsPage = React.lazy(() => import('../containers/SettingsPage'));
const EquipmentsAdminManagerPage = React.lazy(() => import('../containers/equipments/EquipmentAdminManager/EquipmentsAdminManagerPage'));
const AddressesAdminManagerPage = React.lazy(() => import('../containers/address/AddressAdministration/AddressesAdminManagerPage'));
const StreetDetailsPage = React.lazy(() => import('../containers/address/AddressAdministration/StreetDetailsPage'));
const ProvisioningTagActionsInfoPage = React.lazy(() => import('../containers/services/ProvisioningTagManager/ProvisioningTagActionsInfoPage'));
const HandsetModelsManagerPage = React.lazy( () => import('../containers/stock/HandsetModelsManagerPage'));
const IpAddressesManagerPage = React.lazy( () => import('../containers/resources/IpAddressesManager/IpAddressesManagerPage'));
const IpAddressInfoPage = React.lazy( () => import('../containers/resources/IpAddressesManager/IpAddressInfoPage'));
const ProvisioningProductDetailsPage = React.lazy(() => import('../containers/services/ProvisioningProductDetailsPage'));
const EsimNotificationInfoPage = React.lazy(() => import('../containers/equipments/SimcardManager/EsimNotificationInfoPage'));
export const routePaths = {
  street: '/streets',
  provTagInfo: '/provTagInfo/:tagId/provTagActionInfo/:tagActionId',
  rangeNumberInfo: '/rangeNumbers/:rangeNumberId',
  numbers: '/numbers',
  numberInfo: '/numbers/:number',
  simcards: '/simCard',
  equipmentInfo: '/equipment/:equipmentId',
  ancillaryEquipments: '/ancillaryEquipments',
  ancillaryEquipmentsInfo: '/ancillaryEquipment/:equipmentId',
  cpes: '/cpes',
  cpeInfo: '/cpes/:equipmentId',
  resourceAdmin: '/resourcesAdmin',
  blockNumberInfo: '/blocknumbers/:blockId',
  jobConfigurationInfo: '/job/configuration/:id',
  serviceInfo: '/services/:serviceId',
  serviceAccess: '/servicesAccess',
  serviceComponent: '/servicesComponent',
  provisioningTag: '/provisioningTag',
  provisioningTagInfo: '/provTagInfo/:tagId',
  provisioningProductDetails: '/tagAction/:tagActionId/provisioningProduct/:provisioningProductId',
  activationCode: '/activationCode',
  buildingFlatInfo: '/building/buildingFlats/:buildingFlatId',
  buildingFlatPtoInfo: '/building/buildingFlat/ptos/:buildingFlatPtoId',
  buildingInfo: '/buildings/:buildingId',
  postalAddressInfo: '/postalAddresss/:postalAddressId',
  postalAddresses: '/postaladresses',
  buildings: '/buildings',
  eSimNotification: '/esim/notification/:equipmentId',
  buildingMaps: '/map'
};

const settingsComponent = language => <SettingsPage language={language} />;
export const ROUTES = {
  settings: {
    path: Actions.SETTINGS.getRoutePath(),
    exact: true,
    scopes: [resourcesScopes.settings.read],
    languageAware: true,
    content: settingsComponent,
  },
  numberManager: {
    scopes: [resourcesScopes.number.read],
    exact: true,
    path: routePaths.numbers,
    content: <NumberManagerPage />,
  },
  numberInfo: {
    scopes: [resourcesScopes.number.read],
    exact: true,
    path: routePaths.numberInfo,
    content: <NumberInfoPage />,
  },
  rangeNumberManager: {
    path: '/rangeNumbers',
    exact: true,
    content: <RangeNumbersManagerPage />,
    scopes: [resourcesScopes.number.read],
  },
  ipAddressesManager: {
    path: '/ipAddresses',
    exact: true,
    content: <IpAddressesManagerPage />,
    scopes: [resourcesScopes.ipAddresses.read],
  },
  ipAddressesInfo: {
    path: '/ipAddresses/:ipAddressId',
    exact: true,
    content: <IpAddressInfoPage />,
    scopes: [resourcesScopes.ipAddresses.read],
  },
  rangeNumberInfo: {
    path: routePaths.rangeNumberInfo,
    exact: true,
    content: <RangeNumberInfoPage />,
    scopes: [resourcesScopes.number.read],
  },
  resourceAdmin: {
    scopes: [resourcesScopes.resourceConf.read],
    exact: true,
    path: routePaths.resourceAdmin,
    content: <ResourcesAdminManagerPage />,
  },
  blockNumberInfo: {
    scopes: [resourcesScopes.resourceConf.read],
    exact: true,
    path: routePaths.blockNumberInfo,
    content: <BlockNumberInfoPage />,
  },
  simCardManager: {
    scopes: [resourcesScopes.simCard.read],
    exact: true,
    path: routePaths.simcards,
    content: <SIMCardManagerPage />,
  },
  simCardBatch: {
    scopes: [resourcesScopes.simCard.batch],
    exact: true,
    path: '/simCard/batches',
    content: <SIMCardBatchesPage />,
  },
  simCardInfo: {
    scopes: [resourcesScopes.simCard.read],
    exact: true,
    path: routePaths.equipmentInfo,
    content: <SimCardInfoPage />,
  },
  eSimNotification: {
    scopes: [resourcesScopes.simCard.read],
    exact: true,
    path: routePaths.eSimNotification,
    content: <EsimNotificationInfoPage />,
  },
  cpeManager: {
    exact: true,
    path: routePaths.cpes,
    content: <CPEManagerPage />,
    scopes: [resourcesScopes.cpe.read],
  },
  cpeInfo: {
    exact: true,
    path: routePaths.cpeInfo,
    content: <CPEInfoPage />,
    scopes: [resourcesScopes.cpe.read],
  },
  ancillaryEquipments: {
    scopes: [resourcesScopes.ancillaryEquipments.read],
    exact: true,
    path: routePaths.ancillaryEquipments,
    content: <AncillaryEquipmentManagerPage />,
  },
  ancillaryEquipmentsInfo: {
    scopes: [resourcesScopes.ancillaryEquipments.read],
    exact: true,
    path: routePaths.ancillaryEquipmentsInfo,
    content: <AncillaryEquipmentInfoPage />,
  },
  equipmentsAdmin: {
    scopes: [resourcesScopes.equipmentsAdmin.read],
    exact: true,
    path: '/equipmentsAdmin',
    content: <EquipmentsAdminManagerPage />,
  },
  serviceAccessManager: {
    scopes: [resourcesScopes.serviceAccess.read],
    exact: true,
    path: routePaths.serviceAccess,
    content: <ServiceAccessManagerPage />,
  },
  serviceInfo: {
    scopes: [resourcesScopes.serviceAccess.read, resourcesScopes.serviceComponent.read],
    exact: true,
    path: routePaths.serviceInfo,
    content: <ServiceInfoPage />,
  },
  serviceComponentManager: {
    scopes: [resourcesScopes.serviceComponent.read],
    exact: true,
    path: routePaths.serviceComponent,
    content: <ServiceComponentManagerPage />,
  },
  serviceAdmin: {
    path: '/serviceAdmin',
    content: <ServiceAdministrationManagerPage />,
    scopes: [resourcesScopes.servicesAdmin.read],
  },
  activationCode: {
    scopes: [resourcesScopes.serviceAccess.read, resourcesScopes.serviceComponent.read],
    exact: true,
    path: routePaths.activationCode,
    content: <ActivationCodeManagerPage />,
  },
  provisioningTag: {
    scopes: [resourcesScopes.serviceAccess.read, resourcesScopes.serviceComponent.read],
    exact: true,
    path: routePaths.provisioningTagInfo,
    content: <ProvisioningTagInfoPage />,
  },
  provisioningProductDetails: {
    scopes: [resourcesScopes.serviceAccess.read, resourcesScopes.serviceComponent.read],
    exact: true,
    path: routePaths.provisioningProductDetails,
    content: <ProvisioningProductDetailsPage />,
  },
  provisioningTagManager: {
    scopes: [resourcesScopes.serviceAccess.read, resourcesScopes.serviceComponent.read],
    exact: true,
    path: routePaths.provisioningTag,
    content: <ProvisioningTagManagerPage />,
  },
  buildingManager: {
    exact: true,
    path: routePaths.buildings,
    content: <BuildingManagerPage />,
    scopes: [resourcesScopes.address.read],
  },
  buildingMap: {
    path: routePaths.buildingMaps,
    content: <BuildingMap />,
  },
  buildingFlatPtoInfo: {
    exact: true,
    path: routePaths.buildingFlatPtoInfo,
    content: <BuildingFlatPtoInfoPage />,
    scopes: [resourcesScopes.address.read],
  },
  buildingFlatInfo: {
    exact: true,
    path: routePaths.buildingFlatInfo,
    content: <BuildingFlatInfoPage />,
    scopes: [resourcesScopes.address.read],
  },
  buildingInfo: {
    exact: true,
    path: routePaths.buildingInfo,
    content: <BuildingInfoPage />,
    scopes: [resourcesScopes.address.read],
  },
  postalAddressManager: {
    exact: true,
    path: routePaths.postalAddresses,
    content: <PostalAdressManagerPage />,
    scopes: [resourcesScopes.address.read],
  },
  postalAddress: {
    path: routePaths.postalAddressInfo,
    exact: true,
    content: <PostalAddressInfoPage />,
    scopes: [resourcesScopes.address.read],
  },
  postalAddressAdmin: {
    path: '/addressAdmin',
    exact: true,
    content: <AddressesAdminManagerPage />,
    scopes: [resourcesScopes.addressAdmin.read],
  },
  streetDetail: {
    path: `${routePaths.street}/:streetId`,
    content: <StreetDetailsPage />,
    scopes: [resourcesScopes.addressAdmin.read],
  },
  historic: {
    path: Actions.HISTORIC.getRoutePath(),
    content: <HistoricManagerPage />,
  },
  importer: {
    path: Actions.IMPORTER.getRoutePath(),
    content: <EntityImportPage />,
  },
  handset: {
    path: '/handsets',
    exact: true,
    content: <HandsetsManagerPage />,
    scopes: [resourcesScopes.handset.read],
  },
  stockAdmin: {
    path: '/stockAdmin',
    exact: true,
    content: <StockAdminManagerPage />,
    scopes: [resourcesScopes.handset.read],
  },
  provTagActionParameter: {
    path: routePaths.provTagInfo,
    content: <ProvisioningTagActionsInfoPage />,
    scopes: [resourcesScopes.servicesAdmin.read],
  },
  handsetModel: {
    path: '/handsetmodels',
    exact: true,
    content: <HandsetModelsManagerPage />,
    scopes: [resourcesScopes.handset.read],
  },
};
