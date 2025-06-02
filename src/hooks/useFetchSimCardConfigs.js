import { useFetchAccessTypes } from './useFetchAccessTypes';
import { useFetchProviders } from './useFetchProviders';
import { useFetchWarehouses } from './useFetchWarehouses';
import { useFetchInventoryPools } from './useFetchInventoryPools';
import { useFetchPlmns } from './useFetchPlmns';

export const useFetchSimCardConfigs = () => {

  const {inventoryPools} = useFetchInventoryPools();
  const {accessTypes} = useFetchAccessTypes({type: 'eqm'});
  const {providers} = useFetchProviders();
  const {warehouses} = useFetchWarehouses();
  const {plmns} = useFetchPlmns();

  return {inventoryPools, accessTypes, providers, warehouses, plmns};
};
