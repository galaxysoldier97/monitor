import { useEffect, useState } from 'react';
import { t } from 'mt-react-library/functions';
import { simCardFields } from '../config/equipment/simCard/simCardFields';
import TecrepWarehouseService from '../services/equipments/TecrepWarehouseService';
import { cpeFields } from '../config/equipment/cpe/cpeFields';
import { ancillaryEquipmentFields } from '../config/equipment/ancillaryEquipment/ancillaryEquipmentFields';
import { isConfigSet } from '../helpers/commonHelper';

export const useFetchWarehouses = () => {
  const existingConfig = simCardFields.find(el => el.id === 'warehouse');
  const [warehouses, setWarehouses] = useState(isConfigSet(existingConfig) ? existingConfig.values : null);

  useEffect(() => {
    if (isConfigSet(existingConfig)) {
      return;
    }
    TecrepWarehouseService.searchWarehouses(0, 999).then(data => {
      const warehouses = [{key: '', value: t('all')}];
      data.content && data.content.forEach(item => warehouses.push({key: item, value: item.resellerCode + ' ' + item.name}));
      setWarehouses(warehouses);
      existingConfig.values = warehouses;
      cpeFields.find(el => el.id === 'warehouse').values = warehouses;
      ancillaryEquipmentFields.find(el => el.id === 'warehouse').values = warehouses;
    });
  }, []);

  return {warehouses};
};
