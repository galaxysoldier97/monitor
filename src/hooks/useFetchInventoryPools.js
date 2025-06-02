import { useEffect, useState } from 'react';
import { t } from 'mt-react-library/functions';
import { numberFields } from '../config/resources/number/numberFields';
import TecrepInventoryPoolService from '../services/equipments/TecrepInventoryPoolService';
import { simCardFields } from '../config/equipment/simCard/simCardFields';
import { isConfigSet } from '../helpers/commonHelper';

export const useFetchInventoryPools = () => {
  const existingConfig = numberFields.find(el => el.id === 'inventoryPoolCode');
  const [inventoryPools, setInventoryPools] = useState(isConfigSet(existingConfig) ? existingConfig.values : null);

  useEffect(() => {
    if (isConfigSet(existingConfig)) {
      return;
    }
    TecrepInventoryPoolService.searchInventoryPools(0, 999).then(data => {
      const pools = [{id: 'inventoryPoolAll', key: '', value: t('all')}];
      data.content && data.content.forEach(item => pools.push({id: item.code, key: item.code, value: item.description || item.code}));
      setInventoryPools(pools);
      existingConfig.values = pools;
      simCardFields.find(el => el.id === 'inventoryPool').values = pools;
    });
  }, []);

  return {inventoryPools};
};


useFetchInventoryPools.propTypes = {};
