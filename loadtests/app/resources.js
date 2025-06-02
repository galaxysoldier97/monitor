import { check, group } from 'k6';
import { app, api, shouldHaveStatus200, sleep } from '../helpers/utils.js';

const RESOURCES_API_URL = '/tecrep/rsc/private/auth';
const RESOURCES_API_URL_V1 = '/tecrep/rsc/api/v1/private/auth';
const RESOURCES_API_URL_V2 = '/tecrep/rsc/api/v2/private/auth';

export default function resources(token) {
  group('Numbers', () => {
    check(app('/numbers'), shouldHaveStatus200());
    sleep(1, 'Go to numbers menu');
    check(api(`${RESOURCES_API_URL}/numbers/search?page=0&size=10&number=&status=&nature=&service=&order=`, null, token), shouldHaveStatus200());
    sleep(1, 'Change page');
    check(api(`${RESOURCES_API_URL}/numbers/search?page=1&size=10&number=&status=&nature=&service=&order=`, null, token), shouldHaveStatus200());
    sleep(1, 'Filter by status AVAILABLE');
    check(api(`${RESOURCES_API_URL}/numbers/search?page=0&size=10&number=&status=AVAILABLE&nature=&service=&order=`, null, token), shouldHaveStatus200());
    sleep(1, 'See details page for number 37799920008');
    check(api(`${RESOURCES_API_URL_V2}/numbers/search?page=0&size=1&number=37799920008`, null, token), shouldHaveStatus200());
    sleep(1, 'See import history');
    check(api(`${RESOURCES_API_URL}/import/history/search`, null, token), shouldHaveStatus200());
  });
  group('Range numbers', () => {
    check(app('/rangeNumbers'), shouldHaveStatus200());
    sleep(1, 'Go to range numbers menu');
    check(api(`${RESOURCES_API_URL_V1}/rangenumbers/search?page=0&size=10`, null, token), shouldHaveStatus200());
    sleep(1, 'Change page');
    check(api(`${RESOURCES_API_URL_V1}/rangenumbers/search?page=1&size=10`, null, token), shouldHaveStatus200());
    sleep(1, 'Filter by status AVAILABLE');
    check(api(`${RESOURCES_API_URL_V1}/rangenumbers/search?page=0&size=10&status=AVAILABLE`, null, token), shouldHaveStatus200());
    sleep(1, 'See numbers in range 75');
    check(api(`${RESOURCES_API_URL}/numbers/search?rangeId=75&page=0&size=10`, null, token), shouldHaveStatus200());
  });
  group('Resources admin', () => {
    check(app('/resourcesAdmin'), shouldHaveStatus200());
    sleep(1, 'See block numbers');
    check(api(`${RESOURCES_API_URL_V2}/blocknumbers/search?page=0&size=10`, null, token), shouldHaveStatus200());
    sleep(1, 'Change page');
    check(api(`${RESOURCES_API_URL_V2}/blocknumbers/search?page=1&size=10`, null, token), shouldHaveStatus200());
    sleep(1, 'Filter by country code 33');
    check(api(`${RESOURCES_API_URL_V2}/blocknumbers/search?page=0&size=10&blockPrefix=&countryCode=33&activity=`, null, token), shouldHaveStatus200());
    sleep(1, 'See details of block 1');
    check(api(`${RESOURCES_API_URL_V2}/blocknumbers/1`, null, token), shouldHaveStatus200());
    sleep(1, 'See intervals in block 894');
    check(api(`${RESOURCES_API_URL_V2}/intervalnumbers/search?page=0&size=5&blockNumberId=894&firstNumber=`, null, token), shouldHaveStatus200());
  });
}
