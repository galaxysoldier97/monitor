import {isEmpty} from 'mt-react-library/functions';

export const getDisplayedDate = date => date ? new Date(date).toLocaleDateString('fr-FR') : '';

export const printObject = (obj) => {
  let printed = '';
  for (const key in obj) {
    if (obj[key] && obj[key].length > 0) {
      printed = `${printed} - ${key} : ${obj[key]}`;
    }
  }
  return printed;
};

export const getAddressDescription = address => !isEmpty(address) ? address.streetNumber + ' ' + (address.streetQualifier || '') + ', ' + address.street.streetName : '';

export const getDate = val => {
  let dateTime = val.split('T');
  if (dateTime.length !== 2) {
    return val;
  }
  let date = dateTime[0];
  let time = dateTime[1].split(':');
  return date + ' ' + time[0] + 'H' + time[1];
};

export const isDate = val => {
  let date = Date.parse(val);
  return !isNaN(date);
};

export const isObject = item => item ? typeof item === 'object' : false;

export const isConfigSet = config => Array.isArray(config?.values) && config?.values.length > 1;

export const removeFromObj = (obj, key) => {
  Reflect.deleteProperty(obj, key);
  return obj;
};

export const addToObj = (obj, key, value) => {
  Reflect.set(obj, key, value);
  return obj;
};
export const replaceUrlKeywords = (url, item) => {
  const matches = url.match(/:[a-zA-Z0-9_-]+/g);

  if (!matches) {
    return url;
  }

  let replacedUrl = url;
  matches.forEach((match) => {
    const keyword = match.substring(1);
    const replacement = item[keyword] || '';
    replacedUrl = replacedUrl.replace(match, replacement);
  });

  return replacedUrl;
};
