import { useEffect, useState } from 'react';
import TecrepProviderService from '../services/equipments/TecrepProviderService';
import { simCardFields } from '../config/equipment/simCard/simCardFields';
import { t } from 'mt-react-library/functions';
import { cpeFields } from '../config/equipment/cpe/cpeFields';
import { ancillaryEquipmentFields } from '../config/equipment/ancillaryEquipment/ancillaryEquipmentFields';
import { isConfigSet } from '../helpers/commonHelper';
import {EquipmentModelFields} from "../config/equipment/EquipmentModelFields";

export const useFetchProviders = () => {
  const existingConfig = EquipmentModelFields.find(el => el.id === 'provider');
  const equipmentModelProviderNames = EquipmentModelFields.find(el => el.id === 'providerName');
  const [providers, setProviders] = useState(isConfigSet(existingConfig) ? existingConfig.values : null);

  useEffect(() => {
    if (isConfigSet(existingConfig)) {
      return;
    }
    TecrepProviderService.searchProviders(0, 999).then(data => {
      const prs = [];
      if (data.content) {
        data.content.forEach(provider => prs.push({key: provider, value: provider.name}));
      }
      setProviders(prs);
      existingConfig.values = prs;
      equipmentModelProviderNames.values = prs.map(e => {return {key: e.value.toUpperCase(), value: e.value};});
      simCardFields.find(el => el.id === 'provider').values = [{key: '', value: t('all')}, ...prs];
      cpeFields.find(el => el.id === 'provider').values = [{key: '', value: t('all')}, ...prs];
      ancillaryEquipmentFields.find(el => el.id === 'provider').values = [{key: '', value: t('all')}, ...prs];
    });
  }, []);

  return {providers};
};
