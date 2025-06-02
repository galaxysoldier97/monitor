import { useEffect, useState } from 'react';
import { t } from 'mt-react-library/functions';
import { simCardFields } from '../config/equipment/simCard/simCardFields';
import { isConfigSet } from '../helpers/commonHelper';
import TecrepPlmnService from '../services/equipments/TecrepPlmnService';

export const useFetchPlmns = () => {
  const existingConfig = simCardFields.find(el => el.id === 'plmn');
  const [plmns, setPlmns] = useState(isConfigSet(existingConfig) ? existingConfig.values : null);

  useEffect(() => {
    if (isConfigSet(existingConfig)) {
      return;
    }
    TecrepPlmnService.getPlmn().then(data => {
      const plmnsValues = [{key: '', value: t('all')}];
      data.content && data.content.forEach(item => plmnsValues.push({key: item, value: item.code + ' ' + item.networkName}));
      setPlmns(plmnsValues);
      existingConfig.values = plmnsValues;
    });
  }, []);

  return {plmns};
};
