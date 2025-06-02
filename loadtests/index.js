import landing from './app/landing.js';
import { K6_OPTIONS } from './helpers/config.js';
import resources from './app/resources.js';
import { apiAuth } from './helpers/utils.js';
import { check } from 'k6';
import equipments from './app/equipments.js';
import services from './app/services.js';
import addresses from './app/addresses.js';

export const options = K6_OPTIONS;

export function setup() {
  let token;
  check(apiAuth(), {
      'login is successful': response => {
        if (response.status === 200) {
          const body = JSON.parse(response.body);
          token = body.access_token;
          return !!token;
        }
        return false;
      },
    },
  );
  return token;
}

export default function (data) {
  landing();
  resources(data);
  equipments(data);
  services(data);
  addresses(data);
}
