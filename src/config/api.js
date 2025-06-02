import axios from 'axios';
import Auth from '../services/Auth';

axios.interceptors.request.use(request => {
  Auth.checkSession();
  return request;
});

axios.interceptors.response.use(
  response => response,
  Auth.checkErrorSession
);
