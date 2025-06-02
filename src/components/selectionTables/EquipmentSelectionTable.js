import React from 'react';
import PropTypes from 'prop-types';
import { populateEntityConfiguration } from '../../helpers/entityHelper';
import TecrepSimCardService from '../../services/equipments/TecrepSimCardService';
import { simCardFields } from '../../config/equipment/simCard/simCardFields';
import {
  getAncillaryEquipmentDisplayMapper,
  getCpeDisplayMapper,
  getSimCardDisplayMapper
} from '../../helpers/entityMapper';
import { useFetchSimCardConfigs } from '../../hooks/useFetchSimCardConfigs';
import TecrepCpeService from '../../services/equipments/TecrepCpeService';
import { cpeFields } from '../../config/equipment/cpe/cpeFields';
import GenericSelectionTable from './GenericSelectionTable';
import TecrepAncillaryEquipmentsService from "../../services/equipments/TecrepAncillaryEquipmentsService";
import {ancillaryEquipmentFields} from "../../config/equipment/ancillaryEquipment/ancillaryEquipmentFields";

export const EquipmentCategory = Object.freeze({
  simCard : 'simCard',
  cpe : 'cpe',
  ancillaryEquipment: 'ancillaryEquipment'
});

export const equipmentSwitch = {
  simCard: { service: TecrepSimCardService, getter: TecrepSimCardService.getSimCard, fields: simCardFields},
  cpe: { service: TecrepCpeService, getter: TecrepCpeService.getCPE, fields: cpeFields},
  ancillaryEquipment: { service: TecrepAncillaryEquipmentsService, getter: TecrepAncillaryEquipmentsService.getAncillaryEquipment, fields: ancillaryEquipmentFields}
};
const EquipmentSelectionTable = ({name, equipmentId, values, onChange, type, initialFilter}) => {
  const equipmentService = equipmentSwitch[type]?.service;
  const equipmentGetter = equipmentSwitch[type]?.getter;

  const {warehouses, inventoryPools, providers, plmns} = useFetchSimCardConfigs();

  const itemsFetcher = (filter, pagination) => {
    return equipmentService.search(filter, pagination.number, pagination.size).then(data => ({
      data: data.content ? data.content : [],
      totalElements: data.totalElements
    }));
  };

  const rowMapper = item => {
    let mapped = {...item};
    switch(type){
      case EquipmentCategory.simCard:
        simCardFields.forEach(field => mapped[field.id] = getSimCardDisplayMapper(item, field.id, plmns, inventoryPools, warehouses, providers));
        break;
      case EquipmentCategory.cpe:
        cpeFields.forEach(field => mapped[field.id] = getCpeDisplayMapper(item, field.id, warehouses));
        break;
      default:
        ancillaryEquipmentFields.forEach(field => mapped[field.id] = getAncillaryEquipmentDisplayMapper(item, field.id, warehouses));
    }

    return [mapped, {}];
  };

  return (
    <GenericSelectionTable
      name={name}
      itemsFetcher={itemsFetcher}
      itemFetcher={() => equipmentId && equipmentGetter(equipmentId)}
      itemIdentifier={equipment => equipment.id === equipmentId}
      tableHeader={populateEntityConfiguration(equipmentSwitch[type].fields)}
      rowMapper={rowMapper}
      values={values}
      onChange={onChange}
      initialFilter={initialFilter}
    />
  );
};

EquipmentSelectionTable.propTypes = {
  name: PropTypes.string,
  equipmentId: PropTypes.string,
  initialFilter: PropTypes.object,
  values: PropTypes.object,
  onChange: PropTypes.func,
  type: PropTypes.oneOf([EquipmentCategory.simCard, EquipmentCategory.cpe]),
};

export default EquipmentSelectionTable;
