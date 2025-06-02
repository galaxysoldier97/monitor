import { useFetchEqmModels } from './useFetchEqmModels';
import { useFetchAccessTypes } from './useFetchAccessTypes';
import { useFetchProviders } from './useFetchProviders';
import { useFetchWarehouses } from './useFetchWarehouses';

export const useFetchEquipmentConfigs = (options = {}) => {
  const { modelOptions } = options;

  const {models} = useFetchEqmModels(modelOptions);
  const {accessTypes} = useFetchAccessTypes({type: 'eqm'});
  const {providers} = useFetchProviders();
  const {warehouses} = useFetchWarehouses();

  return {models, accessTypes, providers, warehouses};
};
