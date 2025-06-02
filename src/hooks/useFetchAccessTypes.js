import { useEffect, useState } from 'react';
import TecrepEqmAccessTypeService from '../services/equipments/TecrepEqmAccessTypeService';
import PropTypes from 'prop-types';
import { t } from 'mt-react-library/functions';
import { cpeFields } from '../config/equipment/cpe/cpeFields';
import { simCardFields } from '../config/equipment/simCard/simCardFields';
import TecrepSrvAccessTypeService from '../services/services/TecrepSrvAccessTypeService';
import { serviceAccessFields } from '../config/service/serviceAccess/serviceAccessFields';
import { provisioningTagFields } from '../config/service/provisioningTag/provisioningTagFields';
import { ancillaryEquipmentFields } from '../config/equipment/ancillaryEquipment/ancillaryEquipmentFields';
import { isConfigSet } from '../helpers/commonHelper';
import {AssociatedProvisioningTagFields} from "../config/service/provisioningTag/AssociatedProvisioningTagFields";
import {ProviderFields} from "../config/equipment/ProviderFields";
import {EquipmentModelFields} from "../config/equipment/EquipmentModelFields";
const allValue = {key: '', value: t('all')};

export const useFetchAccessTypes = ({type}) => {
  const cpeAccessTypeConfig = cpeFields.find(el => el.id === 'accessType');
  const serviceAccessConfig = serviceAccessFields.find(el => el.id === 'accessType');
  const getCpeValues = () => isConfigSet(cpeAccessTypeConfig) ? cpeAccessTypeConfig.values : null;
  const getServiceValues = () => isConfigSet(serviceAccessConfig) ? serviceAccessConfig.values : null;
  const getAccessTypesService = () => type === 'eqm' ? TecrepEqmAccessTypeService : TecrepSrvAccessTypeService;
  const [accessTypes, setAccessTypes] = useState(type === 'eqm' ? getCpeValues() : getServiceValues());

  useEffect(() => {
    if (type === 'eqm' && isConfigSet(cpeAccessTypeConfig)) {
      return;
    }
    if (type === 'srv' && isConfigSet(serviceAccessConfig)) {
      return;
    }
    getAccessTypesService().getAccessTypes().then(data => {
      const types = [];
      data.forEach(type => types.push({id: type, key: type, value: type}));
      setAccessTypes(types);
      if (type === 'eqm') {
        cpeAccessTypeConfig.values = [allValue, ...types];
        ancillaryEquipmentFields.find(el => el.id === 'accessType').values = types ;
        ProviderFields.find(el => el.id === 'accessType').values = types;
        EquipmentModelFields.find(el => el.id === 'accessType').values = types;
        simCardFields.find(el => el.id === 'accessType').values = [allValue, ...types];
      } else if (type === 'srv') {
        serviceAccessConfig.values = [allValue, ...types];
        provisioningTagFields.find(el => el.id === 'accessType').values = [{id: 'accessTypesAll', key: 'accessTypesAll', value: 'all'}, ...types];
        AssociatedProvisioningTagFields.find(el => el.id === 'accessType').values = [{id: 'accessTypesAll', key: 'accessTypesAll', value: 'all'}, ...types];
      }
    });
  }, []);

  return {accessTypes};
};


useFetchAccessTypes.propTypes = {
  showAll: PropTypes.bool,
  type: PropTypes.oneOf(['srv', 'eqm'])
};
