export const UpdateWizardType = Object.freeze({
  STATUS: 'status',
  SERVICE: 'service',
  EQUIPMENT: 'equipment'
});

export const ServiceAccessWizardFieldType = Object.freeze({
  PARENT_SERVICE: 'parentService',
  SIM_CARD: 'simCard',
  CPE: 'cpe',
  ANCILLARY_EQUIPMENT: 'ancillaryEquipment',
  ACCESS_POINT: 'accessPoint',
  NUMBER: 'number',
  RANGE: 'range',
  STATUS_CHANGE: 'statusChange',
  REQUEST_CHANGE: 'requestChange'
});

export const ServiceComponentWizardFieldType = Object.freeze({
  ACCESS_SERVICE: 'accessService',
  NUMBER: 'number',
  RANGE: 'range',
  STATUS_CHANGE: 'statusChange',
  REQUEST_CHANGE: 'requestChange',
});

export const ResourcesActionsMenuOptions = Object.freeze({
    STATUS: 'service.status',
    ACCESS_SERVICE: 'menu.services.access',
    COMPONENT_SERVICE: 'menu.services.component'
});
