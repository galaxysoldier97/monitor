import { t } from 'mt-react-library/functions';
import { getCompanyName } from '../config/company';

export const populateEntityConfiguration = (entityConfiguration, dynamicValues = {}, hiddenConditions = {}, editableConditions = {}) => {
  entityConfiguration.forEach(item => {
    if (item.values && item.values === 'dynamic') {
      if (item.id && dynamicValues[item.id]) {
        item.values = dynamicValues[item.id];
      } else {
        item.values = [{key: '', value: t('all')}];
      }
    }
    if (Array.isArray(item.hidden)) {
      item.hidden = item.hidden.includes(getCompanyName());
    }
    if (Array.isArray(item.filterable)) {
      item.filterable = item.filterable.includes(getCompanyName());
    }
    if (Array.isArray(item.editable)) {
      item.editable = item.editable.includes(getCompanyName());
    }
    if (Array.isArray(item.addable)) {
      item.addable = item.addable.includes(getCompanyName());
    }
    if (item.id in hiddenConditions) {
      item.hidden = hiddenConditions[item.id];
    }
    if (item.id in editableConditions) {
      item.editable = editableConditions[item.id];
    }
    if (item.label && typeof item.label === 'string') {
      item.label = t(item.label);
    }
  });
  return entityConfiguration;
};

export const populateEntityInfoPageConfig = (fields) => fields.filter(field => Array.isArray(field.infoPage) ? field.infoPage.includes(getCompanyName()) : field.infoPage);

export const editableEntity = Object.freeze({
  warehouse: 'warehouse',
  provider: 'provider',
});

export const mapItemToEditForm = (item, list, entity) => {
  const selected = list && item[entity] && list.find(p => p.key.name === item[entity].name);
  return ({
    ...item,
    [entity]: selected && selected.key,
  });
};

export const renameKey = (array, currentKey, newKey) => {
  return array.map(item => {
    if (currentKey in item) {
      const {[currentKey]: value, ...rest} = item;
      return {[newKey]: value, ...rest};
    }
    return item;
  });
};

export function excludeFieldByDependency(header, item, field, dependency){
  const dependencyKey = Object.keys(dependency)?.[0]; // accessType
  if (dependencyKey && Array.isArray(dependency[dependencyKey]) && dependency[dependencyKey].includes(item[dependencyKey])) {
    return header.filter(h => h.id !== field);
  }
  return header;
}
