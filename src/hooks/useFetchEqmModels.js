import { useEffect, useState } from 'react';
import TecrepEquipmentModelService from '../services/equipments/TecrepEquipmentModelService';
import { t } from 'mt-react-library/functions';
import { cpeFields } from '../config/equipment/cpe/cpeFields';
import { ancillaryEquipmentFields } from '../config/equipment/ancillaryEquipment/ancillaryEquipmentFields';


export const useFetchEqmModels = (modelOptions = {}) => {
  const [models, setModels] = useState([]);

  useEffect(() => {
    const { category } = modelOptions;
    const filters = {category: category ?? ''};

    TecrepEquipmentModelService.getModels(filters).then(data => {
      const modelsList = [{key: '', value: t('all')}];
      data?.content?.forEach(model => modelsList.push({key: model, value: model.name}));
      setModels(modelsList);

      if(category === 'CPE'){
        cpeFields.find(el => el.id === 'model').values = modelsList;
      }else{
        ancillaryEquipmentFields.find(el => el.id === 'model').values = modelsList;
      }
    });
  },[]);

  return {
    models
  };
};
