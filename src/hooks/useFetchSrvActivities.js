import { useEffect, useState } from 'react';
import { t } from 'mt-react-library/functions';
import { serviceFields } from '../config/service/serviceFields';
import TecrepServiceService from '../services/services/TecrepServiceService';
import { provisioningTagFields } from '../config/service/provisioningTag/provisioningTagFields';
import { isConfigSet } from '../helpers/commonHelper';
import {AssociatedProvisioningTagFields} from "../config/service/provisioningTag/AssociatedProvisioningTagFields";
import {JobServiceFields} from "../config/service/JobServiceFields";

export const useFetchSrvActivities = () => {
  const existingConfig = serviceFields.find(el => el.id === 'serviceActivity');
  const [activities, setActivities] = useState(isConfigSet(existingConfig) ? existingConfig.values : []);

  useEffect(() => {
    if (isConfigSet(existingConfig)) {
      return;
    }
    TecrepServiceService.getActivities().then(data => {
      const values = [{id: 'activityAll', key: '', value: t('all')}];
      data && data.forEach(item => values.push({id: item, key: item, value: item}));
      setActivities(values);
      existingConfig.values = values;
      const i18nValues = [...values];
      i18nValues[0] = {id: 'activityAll', key: '', value: 'all'};
      provisioningTagFields.find(el => el.id === 'activity').values = i18nValues;
      AssociatedProvisioningTagFields.find(el => el.id === 'activity').values = i18nValues;
      JobServiceFields.find(field => field.id === 'activity').values = i18nValues;
    });
  }, []);

  return {activities};
};
