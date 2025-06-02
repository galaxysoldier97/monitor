import { useFetchRscActivities } from './useFetchRscActivities';
import { useFetchInventoryPools } from './useFetchInventoryPools';

export const useFetchNumberConfigs = () => {
  const {activities} = useFetchRscActivities();
  const {inventoryPools} = useFetchInventoryPools();
  return {activities, inventoryPools};
};
