import { check, group } from 'k6';
import { app, api, shouldHaveStatus200, sleep } from '../helpers/utils.js';

const EQM_API_URL = '/tecrep/eqm/private/auth';

export default function equipments(token) {
  group('Sim cards', () => {
    check(app('/simCard'), shouldHaveStatus200());
    sleep(1, 'Go to sim cards menu');
    check(api(`${EQM_API_URL}/simcards/search?page=0&size=10&sn=&status=&accessType=&imsi=&imsisn=&nature=&preactivated=&batchNumber=&externalNumber=&order=&service=&serviceId=`, null, token), shouldHaveStatus200());
    sleep(1, 'Change page');
    check(api(`${EQM_API_URL}/simcards/search?page=1&size=10&sn=&status=&accessType=&imsi=&imsisn=&nature=&preactivated=&batchNumber=&externalNumber=&order=&service=&serviceId=`, null, token), shouldHaveStatus200());
    sleep(1, 'Filter by status AVAILABLE');
    check(api(`${EQM_API_URL}/simcards/search?page=1&size=10&sn=&status=AVAILABLE&accessType=&imsi=&imsisn=&nature=&preactivated=&batchNumber=&externalNumber=&order=&service=&serviceId=`, null, token), shouldHaveStatus200());
    sleep(1, 'See ancillary equipements for sim card 13035');
    check(api(`${EQM_API_URL}/ancillaryequipments/search?page=0&size=10&provider=&warehouse=&pairedEquipmentId=13035`, null, token), shouldHaveStatus200());
  });
  group('CPE', () => {
    check(app('/cpes'), shouldHaveStatus200());
    sleep(1, 'Go to cpes menu');
    check(api(`${EQM_API_URL}/cpes/search?macAddressCpe=&macAddressRouter=&macAddressVoip=&macAddressLan=&macAddress5G=&macAddress4G=&modelName=&hwVersion=&status=&nature=&accessType=&externalNumber=&batchNumber=&orderId=&serviceId=&order=&service=&page=0&size=10`, null, token), shouldHaveStatus200());
    sleep(1, 'Change page');
    check(api(`${EQM_API_URL}/cpes/search?macAddressCpe=&macAddressRouter=&macAddressVoip=&macAddressLan=&macAddress5G=&macAddress4G=&modelName=&hwVersion=&status=&nature=&accessType=&externalNumber=&batchNumber=&orderId=&serviceId=&order=&service=&page=1&size=10`, null, token), shouldHaveStatus200());
    sleep(1, 'Filter by status AVAILABLE');
    check(api(`${EQM_API_URL}/cpes/search?macAddressCpe=&macAddressRouter=&macAddressVoip=&macAddressLan=&macAddress5G=&macAddress4G=&modelName=&hwVersion=&status=AVAILABLE&nature=&accessType=&externalNumber=&batchNumber=&orderId=&serviceId=&order=&service=&page=0&size=10`, null, token), shouldHaveStatus200());
  });
  group('Ancillary equipments', () => {
    check(app('/ancillaryEquipments'), shouldHaveStatus200());
    sleep(1, 'Go to ancillary equipments menu');
    check(api(`${EQM_API_URL}/ancillaryequipments/search?page=0&size=10&serialNumber=&macAddress=&modelName=&equipmentName=&status=&nature=&accessType=&pairedEquipmentId=&orderId=&equipment=&order=`, null, token), shouldHaveStatus200());
    sleep(1, 'Change page');
    check(api(`${EQM_API_URL}/ancillaryequipments/search?page=1&size=10&serialNumber=&macAddress=&modelName=&equipmentName=&status=&nature=&accessType=&pairedEquipmentId=&orderId=&equipment=&order=`, null, token), shouldHaveStatus200());
    sleep(1, 'Filter by status INSTORE');
    check(api(`${EQM_API_URL}/ancillaryequipments/search?page=1&size=10&serialNumber=&macAddress=&modelName=&equipmentName=&status=INSTORE&nature=&accessType=&pairedEquipmentId=&orderId=&equipment=&order=`, null, token), shouldHaveStatus200());
  });
  group('Equipments admin', () => {
    check(app('/equipmentsAdmin'), shouldHaveStatus200());
    sleep(1, 'See all warehouses');
    check(api(`${EQM_API_URL}/warehouses?page=0&size=9999999`, null, token), shouldHaveStatus200());
    sleep(1, 'See all providers');
    check(api(`${EQM_API_URL}/providers?page=0&size=9999999`, null, token), shouldHaveStatus200());
    sleep(1, 'See all plmns');
    check(api(`${EQM_API_URL}/plmns/search?page=0&size=9999999`, null, token), shouldHaveStatus200());
    sleep(1, 'See all inventory pools');
    check(api(`${EQM_API_URL}/inventorypools?page=0&size=9999999`, null, token), shouldHaveStatus200());
    sleep(1, 'See sim cards configurations');
    check(api(`${EQM_API_URL}/simGenerationConfigurations?page=0&size=10`, null, token), shouldHaveStatus200());
    sleep(1, 'See file configurations');
    check(api(`${EQM_API_URL}/fileConfiguration?page=0&size=10`, null, token), shouldHaveStatus200());
  });
}
