import { check, group } from 'k6';
import { app, api, shouldHaveStatus200, sleep } from '../helpers/utils.js';

const SVC_API_URL = '/tecrep/svc/private/auth';

export default function services(token) {
  group('Access services', () => {
    check(app('/simCard'), shouldHaveStatus200());
    sleep(1, 'Go to service access menu');
    check(api(`${SVC_API_URL}/services/search?page=0&size=10&crmServiceId=&parentServiceId=&serviceActivity=&accessType=&status=&number=&activationDate=&serviceCategory=ACCESS&serviceId=&equipmentId=&rangeId=&techId=`, null, token), shouldHaveStatus200());
    sleep(1, 'Change page');
    check(api(`${SVC_API_URL}/services/search?page=1&size=10&crmServiceId=&parentServiceId=&serviceActivity=&accessType=&status=&number=&activationDate=&serviceCategory=ACCESS&serviceId=&equipmentId=&rangeId=&techId=`, null, token), shouldHaveStatus200());
    sleep(1, 'Filter by activity MOBILE');
    check(api(`${SVC_API_URL}/services/search?page=0&size=10&crmServiceId=&parentServiceId=&serviceActivity=MOBILE&accessType=&status=&number=&activationDate=&serviceCategory=ACCESS&serviceId=&equipmentId=&rangeId=&techId=`, null, token), shouldHaveStatus200());
    sleep(1, 'See details for service access 713');
    check(api(`${SVC_API_URL}/services/713`, null, token), shouldHaveStatus200());
  });
  group('Component services', () => {
    check(app('/cpes'), shouldHaveStatus200());
    sleep(1, 'Go to service component menu');
    check(api(`${SVC_API_URL}/services/search?page=0&size=10&crmServiceId=&serviceActivity=&accessType=&status=&number=&activationDate=&serviceCategory=COMPONENT&serviceId=`, null, token), shouldHaveStatus200());
    sleep(1, 'Change page');
    check(api(`${SVC_API_URL}/services/search?page=1&size=10&crmServiceId=&serviceActivity=&accessType=&status=&number=&activationDate=&serviceCategory=COMPONENT&serviceId=`, null, token), shouldHaveStatus200());
  });
  group('Services admin', () => {
    check(app('/equipmentsAdmin'), shouldHaveStatus200());
    sleep(1, 'See provisionning tags');
    check(api(`${SVC_API_URL}/provisioningtags/search?page=0&size=10&tagCode=&accessType=&activity=&nature=`, null, token), shouldHaveStatus200());
    sleep(1, 'See activation codes');
    check(api(`${SVC_API_URL}/activationcodes/search?page=0&size=10&activCode=&networkComponent=&nature=`, null, token), shouldHaveStatus200());
  });
}
