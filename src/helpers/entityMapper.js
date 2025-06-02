import { Link } from 'react-router-dom';
import { routePaths, ROUTES } from '../config/routes';
import React from 'react';
import { BooleanInfoIcon } from '../components/BooleanInfoIcon';
import { getDate } from './commonHelper';
import { shouldUseLocalNumbers } from '../config/company';
import EquipmentLinked from '../components/EquipmentLinked';
import AccessPointLink from '../components/AccessPointLink';

export const getNumberDisplayMapper = (item, key) => {
  switch (key) {
    case 'intervalNumber':
      return item.intervalNumber && <Link to={ROUTES.blockNumberInfo.path.replace(':blockId', String(item.intervalNumber.blockNumber.blockId))}>{item.intervalNumber.firstNumber + '…' + item.intervalNumber.lastNumber}</Link>;
    case 'rangeId':
      return item.rangeNumber && <Link to={ROUTES.rangeNumberInfo.path.replace(':rangeNumberId', item.rangeNumber.rangeId)}>{item.rangeNumber.rangeId}</Link>;
    default:
      break;
  }
  return getCommonDisplayMapper(item, key);
};

export const getRangeNumberDisplayMapper = (item, key) => {
  switch (key) {
    case 'firstNumber':
    case 'lastNumber':
      return item[key] && item[key].number;
    case 'mainRangeId':
      return item.mainRange && <Link to={{pathname: ROUTES.rangeNumberInfo.path.replace(':rangeNumberId', item.mainRange.rangeId)}}>{item.mainRange.rangeId}</Link>;
    default:
      break;
  }
  return getCommonDisplayMapper(item, key);
};

export const getIpAddressDisplayMapper = (item, key) => {
  switch (key) {
    case 'offerType':
      return item.offerType || null;
    default:
      break;
  }
  return getCommonDisplayMapper(item, key);
};

export const getSimCardDisplayMapper = (item, key, plmns = null, inventoryPools = null, warehouses = null, providers = null) => {
  switch (key) {
    case 'warehouseName':
      return item.warehouse ? item.warehouse.resellerCode : null;
    case 'plmnName':
      return item.plmn ? item.plmn.code : null;
    case 'plmn':
      return plmns && item.plmn && plmns.find(p => p.id === item.plmn.id) || null;
    case 'inventoryPoolName':
      return item.inventoryPool ? item.inventoryPool.code : null;
    case 'inventoryPool':
      return inventoryPools && item.inventoryPool && inventoryPools.find(ivp => ivp.inventoryPoolId === item.inventoryPool.inventoryPoolId) || null;
    case 'preactivatedFlag':
      return <BooleanInfoIcon value={item.preactivated} />;
    case 'esim':
      return <BooleanInfoIcon value={item.esim} />;
    case 'number':
      if (shouldUseLocalNumbers() && item.localPhoneNumber) {
        return item.number ? <Link to={routePaths.numberInfo.replace(':number', item.number)}>{item.localPhoneNumber}</Link> : item.localPhoneNumber;
      }
      return item.number ? <Link to={routePaths.numberInfo.replace(':number', item.number)}>{item.number}</Link> : '';
    default:
      break;
  }
  return getCommonDisplayMapper(item, key, warehouses, providers);
};

export const getCpeDisplayMapper = (item, key, warehouses = null) => {
  switch (key) {
    case 'model':
      return item.model ? item.model.name : null;
    case 'providerName':
      return item.model && item.model.provider ? item.model.provider.name : null;
    default:
      break;
  }
  return getCommonDisplayMapper(item, key, warehouses);
};

export const getAncillaryEquipmentDisplayMapper = (item, key, warehouses = null) => {
  switch (key) {
    case 'pairedEquipmentId':
    case 'pairedEquipmentLink':
      return <EquipmentLinked eqmId={item.pairedEquipmentId} eqmCategory={item.pairedEquipmentCategory} />;
    case 'model':
      return item.model ? item.model.name : null;
    case 'providerName':
      return item.model && item.model.provider ? item.model.provider.name : null;
    default:
      break;
  }
  return getCommonDisplayMapper(item, key, warehouses);
};

export const getServiceDisplayMapper = (item, key) => {
  switch (key) {
    case 'activation':
      return item.activationDate ? new Date(item.activationDate).toLocaleDateString('fr-FR') : '';
    case 'serviceAccessLink':
    case 'serviceAccessId':
      return item.serviceAccessId ? <Link to={ROUTES.serviceInfo.path.replace(':serviceId', item.serviceAccessId)}>{item.serviceAccessId}</Link> : '-';
    case 'mainRangeId':
      return item.mainRangeId ? <Link to={ROUTES.rangeNumberInfo.path.replace(':rangeNumberId', item.mainRangeId)}>{item.mainRangeId}</Link> : '-';
    case 'accessPointId':
      return item.accessPointId ? <AccessPointLink accessPointId={item.accessPointId} />  : '-';
    case 'parentServiceAccess':
      return item.parentServiceAccess ? <Link to={ROUTES.serviceInfo.path.replace(':serviceId', item.parentServiceAccess.serviceId)}>{item.parentServiceAccess.serviceId}</Link> : '-';
    case 'equipmentId':
    case 'equipmentLink':
      return <EquipmentLinked eqmId={item.equipmentId} eqmCategory={item.equipmentCategory} />;
    default:
      break;
  }
  return getCommonDisplayMapper(item, key);
};

export const getCommonDisplayMapper = (item, key, warehouses = null, providers = null) => {
  switch (key) {
    case 'creationDate':
    case 'activationDate':
    case 'deactivationDate':
    case 'suspensionDate':
    case 'resumedDate':
    case 'cancellationDate':
    case 'barringDate':
    case 'dateRequest':
    case 'actionStart':
    case 'actionEnd':
    case 'plannedDate':
      return item[key] ? getDate(item[key]) : '-';
    case 'serviceId':
    case 'serviceAccessLink':
      return item.serviceId && <Link to={ROUTES.serviceInfo.path.replace(':serviceId', item.serviceId)}>{item.serviceId}</Link>;
    case 'continuousRange':
    case 'extendedRange':
    case 'preactivated':
    case 'recyclable':
    case 'independent':
    case 'fcReady':
    case 'onGoingAction':
    case 'persistent':
      return <BooleanInfoIcon value={item[key]} />;
    case 'number':
      return item.number ? <Link to={routePaths.numberInfo.replace(':number', item.number)}>{item.number}</Link> : '';
    case 'providerName':
      return item.provider ? item.provider.name : null;
    case 'warehouseName':
      return item.warehouse ? item.warehouse.name : null;
    case 'warehouse':
      return warehouses && item.warehouse && warehouses.find(w => w.id === item.warehouse.id) || null;
    case 'provider':
      return providers && item.provider && providers.find(p => p.id === item.provider.id) || null;
    case 'zone':
      return item?.intervalNumber?.blockNumber?.zone;
    default:
      break;
  }
  return item[key];
};

export const getBuildingDisplayMapper = (item, key) => {
  switch (key) {
    case 'buildingId':
      return item.building ? item.building.buildingId : null;
    case 'buildingCode':
      return item.building ? item.building.buildingCode : null;
    case 'buildingName':
      return item.building ? item.building.buildingName : null;
    case 'latitude':
      return item.building ? item.building.latitude : null;
    case 'longitude':
      return item.building ? item.building.longitude : null;
    case 'remark':
      return item.building ? item.building.remark : null;
    case 'streetQualifier':
      return  item.address ? item.address.streetQualifier : null;
    case 'streetNumber':
      return item.address ? item.address.streetNumber : null;
    case 'streetName':
      return item.address.street ? item.address.street.streetName : null;
    case 'sector':
      return item.address ? item.address.sector : null;
    case 'buildingBlock':
      return item ? item.buildingBlock : null;
    case 'buildingType':
      return item ? item.buildingType : null;
    default:
      break;
  }
  return getCommonDisplayMapper(item, key);
};

export function APIformat(item) {
  const mappedItem = { ...item };
  for (let key in item) {
    if (item[key] === "Yes" || item[key] === "Oui") {
      mappedItem[key] = true;
    } else if (item[key] === "Non" || item[key] === "No") {
      mappedItem[key] = false;
    } else if (item[key] === '') {
      mappedItem[key] = null;
    }

    if (mappedItem[key] === null) {
      delete mappedItem[key];
    }
  }
  return mappedItem;
}
