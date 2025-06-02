import {t} from "mt-react-library/functions";
import {yesNoFilter} from "../yesNoFilter";
import {ServiceJobOperationEnum} from "./ServiceJobOperationEnum";

export const ServiceAdminCategories = {
  PROVISIONING_TAG: {category: 'Provisioning Tag', isFilterable: true},
  ACTIVATION_CODE: {category: 'Code', isFilterable: true},
  JOB_SERVICE: {category: 'Job service', isFilterable: true},
};

export const ServiceJobHeader = [
  {id: 'id', label: t('id'), hidden: true, infoPage: true},
  {id: 'operation', label: t('jobConfiguration.operation'), filterable: true, type: 'enum', values: ServiceJobOperationEnum, addable: true, editable: true, infoPage: true},
  {id: 'category', label: t('category'), editable: true, addable: true},
  {id: 'activity', label: t('code'), editable: true, addable: true},
  {id: 'status', label: t('jobConfiguration.status'), addable: true, editable: true, infoPage: true},
  {id: 'enabled', label: t('jobConfiguration.enabled'), filterable: true,type: 'enum', values: yesNoFilter, addable: true, editable: true, infoPage: true},
];
