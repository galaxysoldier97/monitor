import { useEffect, useState } from 'react';
import { t } from 'mt-react-library/functions';
import { numberFields } from '../config/resources/number/numberFields';
import TecrepNumberService from '../services/resources/TecrepNumberService';
import { isConfigSet } from '../helpers/commonHelper';
import { intervalNumbersFields } from '../config/adresses/blockNumbers/intervalNumbersFields';
import { jobHeader } from '../config/resources/ResourceImportableProperties';
import {JobResourcesFields} from "../config/resources/JobResourcesFields";

export const useFetchRscActivities = () => {
  const existingConfig = numberFields.find(el => el.id === 'activityService');
  const [activities, setActivities] = useState(isConfigSet(existingConfig) ? existingConfig.values : []);

  useEffect(() => {
    if (isConfigSet(existingConfig)) {
      return;
    }
    TecrepNumberService.getActivities().then(data => {
      const values = [{id: 'all', key: '', value: t('all')}];
      data && data.forEach(item => values.push({id: item, key: item, value: item}));
      setActivities(values);
      existingConfig.values = values;
      intervalNumbersFields.find(el => el.id === 'activity').values = values;
      jobHeader.find(el => el.id === 'activity').values = values;
      const i18nValues = [{id: 'all', key: '', value: 'all'}, ...values.slice(1)];
      JobResourcesFields.find(el => el.id === 'activity').values = i18nValues;
    });
  }, []);

  return {activities};
};
