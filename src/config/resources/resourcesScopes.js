export const resourcesScopes = {
  settings: {
    read: 'SETTINGS_READ',
  },
  number: {
    create: 'NUMBERS_CREATE',
    read: 'NUMBERS_READ',
    edit: 'NUMBERS_EDIT',
    delete: 'NUMBERS_DELETE',
  },
  rangeNumbers: {
    read: 'NUMBER_RANGE_READ',
    create: 'NUMBER_RANGE_CREATE',
    update: 'NUMBER_RANGE_EDIT',
    delete: 'NUMBER_RANGE_DELETE',
  },
  ipAddresses: {
    create: 'IP_ADDRESS_CREATE',
    read: 'IP_ADDRESS_READ',
    edit: 'IP_ADDRESS_EDIT',
    delete: 'IP_ADDRESS_DELETE',
  },
  resourceConf: {
    read: 'NUMBERS_CONF_READ',
    create: "NUMBERS_CONF_CREATE",
    update: "NUMBERS_CONF_EDIT",
    delete: "NUMBERS_CONF_DELETE"
  },
  simCard: {
    read: 'SIMCARD_READ',
    batch: 'SIMCARD_BATCH',
    create: 'SIMCARD_CREATE',
    update: 'SIMCARD_EDIT',
    delete: 'SIMCARD_DELETE',
  },
  cpe: {
    read: 'CPE_READ',
    create: 'CPE_CREATE',
    update: 'CPE_EDIT',
    delete: 'CPE_DELETE',
  },
  ancillaryEquipments: {
    read: 'ANCILLARYEQUIPMENTS_READ',
    create: 'ANCILLARYEQUIPMENTS_CREATE',
    update: 'ANCILLARYEQUIPMENTS_EDIT',
    delete: 'ANCILLARYEQUIPMENTS_DELETE',
  },
  equipmentsAdmin: {
    read: 'EQUIPMENTS_CONF_READ',
    create: 'EQUIPMENTS_CONF_CREATE',
    update: 'EQUIPMENTS_CONF_EDIT',
    delete: 'EQUIPMENTS_CONF_DELETE',
  },
  serviceAccess: {
    read: 'SERVICESACCESS_READ',
    create: 'SERVICESACCESS_CREATE',
    update: 'SERVICESACCESS_EDIT',
    delete: 'SERVICESACCESS_DELETE',
  },
  serviceComponent: {
    read: 'SERVICESCOMPONENT_READ',
    create: 'SERVICESCOMPONENT_CREATE',
    update: 'SERVICESCOMPONENT_EDIT',
    delete: 'SERVICESCOMPONENT_DELETE',
  },
  servicesAdmin: {
    read: 'SERVICES_CONF_READ',
    create: 'SERVICES_CONF_CREATE',
    update: 'SERVICES_CONF_EDIT',
    delete: 'SERVICES_CONF_DELETE',
  },
  address: {
    read: 'ADDRESSES_READ',
    create: 'ADDRESSES_CREATE',
    update: 'ADDRESSES_EDIT',
    delete: 'ADDRESSES_DELETE',
  },
  addressAdmin: {
    read: 'ADDRESS_CONF_READ',
    update: 'ADDRESS_CONF_EDIT',
  },
  handset: {
    read: 'HANDSETS_READ',
    create: 'HANDSETS_READ', // 'STOCK_CONF_CREATE',
    update: 'HANDSETS_READ', // 'STOCK_CONF_UPDATE',
    delete: 'HANDSETS_READ', // 'STOCK_CONF_DELETE',
  },
  stockAdmin: {
    read: 'HANDSETS_READ', // 'STOCK_CONF_READ',
    create: 'HANDSETS_READ', // 'STOCK_CONF_CREATE',
    update: 'HANDSETS_READ', // 'STOCK_CONF_UPDATE',
    delete: 'HANDSETS_READ', // 'STOCK_CONF_DELETE',
  },
  resourcesAdmin: {
    read: 'NUMBERS_CONF_READ',
    create: 'NUMBERS_CONF_CREATE',
    update: 'NUMBERS_CONF_EDIT',
    delete: 'NUMBERS_CONF_DELETE',
  }
};
