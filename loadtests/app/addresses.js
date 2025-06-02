import { check, group } from 'k6';
import { app, api, shouldHaveStatus200, sleep } from '../helpers/utils.js';

const ARP_API_URL = '/tecrep/arp/private/auth';

export default function addresses(token) {
  group('Postal addresses', () => {
    check(app('/postaladresses'), shouldHaveStatus200());
    sleep(1, 'Go to postal adresses menu');
    check(api(`${ARP_API_URL}/postaladdresses/search?page=0&size=10&buildingCode=&buildingName=&streetNumber=&streetQualifier=&streetName=&sector=&buildingBlock=&buildingType=&isEndpointPostalAdress=true`, null, token), shouldHaveStatus200());
    sleep(1, 'Change page');
    check(api(`${ARP_API_URL}/postaladdresses/search?page=1&size=10&buildingCode=&buildingName=&streetNumber=&streetQualifier=&streetName=&sector=&buildingBlock=&buildingType=&isEndpointPostalAdress=true`, null, token), shouldHaveStatus200());
    sleep(1, 'Filter by street qualifier BIS');
    check(api(`${ARP_API_URL}/postaladdresses/search?page=0&size=10&buildingCode=&buildingName=&streetNumber=&streetQualifier=BIS&streetName=&sector=&buildingBlock=&buildingType=&isEndpointPostalAdress=true`, null, token), shouldHaveStatus200());
    sleep(1, 'See details address 4416');
    check(api(`${ARP_API_URL}/postaladdresses/4416`, null, token), shouldHaveStatus200());
  });
  group('Building', () => {
    check(app('/buildings'), shouldHaveStatus200());
    sleep(1, 'Go to building monitory');
    check(app('/map'), shouldHaveStatus200());
    sleep(1, 'Go to building menu');
    check(api(`${ARP_API_URL}/postaladdresses/search?page=0&size=10&buildingCode=&buildingName=&streetNumber=&streetQualifier=&streetName=&sector=&buildingBlock=&buildingType=&isEndpointPostalAdress=false`, null, token), shouldHaveStatus200());
    sleep(1, 'Change page');
    check(api(`${ARP_API_URL}/postaladdresses/search?page=1&size=10&buildingCode=&buildingName=&streetNumber=&streetQualifier=&streetName=&sector=&buildingBlock=&buildingType=&isEndpointPostalAdress=false`, null, token), shouldHaveStatus200());
    sleep(1, 'Filter by building type FLAT');
    check(api(`${ARP_API_URL}/postaladdresses/search?page=1&size=10&buildingCode=&buildingName=&streetNumber=&streetQualifier=&streetName=&sector=&buildingBlock=&buildingType=FLAT&isEndpointPostalAdress=false`, null, token), shouldHaveStatus200());
    sleep(1, 'See details building 5890');
    check(api(`${ARP_API_URL}/buildings/5890`, null, token), shouldHaveStatus200());
    sleep(1, 'See postal addresses for building');
    check(api(`${ARP_API_URL}/addresses/search?page=0&size=10&streetNumber=&streetQualifier=&streetName=&sector=`, null, token), shouldHaveStatus200());
  });
  group('Addresses admin', () => {
    check(app('/equipmentsAdmin'), shouldHaveStatus200());
    sleep(1, 'See streets');
    check(api(`${ARP_API_URL}/streets/search?area=&city=&country=&postalCode=&streetCode=&streetId=&streetName=&page=0&size=10`, null, token), shouldHaveStatus200());
  });
}
