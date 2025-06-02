import http from 'k6/http';
import { sleep as oSleep } from 'k6';
import { ENV } from './config.js';

export const app = path => {
  console.log('Loading app()', ENV.APP_URL + path);
  return http.get(ENV.APP_URL + path);
};

export const api = (path, body, token) => {
  console.log('Loading api()', ENV.API_URL + path);
  return body ?
    http.post(ENV.API_URL + path, body, {headers: {Authorization: `Bearer ${token}`}})
    : http.get(ENV.API_URL + path, {headers: {Authorization: `Bearer ${token}`, 'content-type': 'application/json'}});
};

export const apiAuth = () => {
  console.log('Loading auth api()', ENV.IAM_URL);
  return http.post(ENV.IAM_URL, {grant_type: 'client_credentials', client_secret: ENV.CLIENT_SECRET, client_id: ENV.CLIENT_ID});
};

export const shouldHaveStatus200 = () => ({'status is 200': response => response.status === 200});

export const shouldHavePaginatedContent = response => {
  const json = response.json();
  return Array.isArray(json.data)
    && json.pagination
    && json.pagination.hasOwnProperty('total');
};

export const sleep = (seconds, description) => {
  oSleep(seconds);
  console.log('Simulating user input : ' + description);
};
