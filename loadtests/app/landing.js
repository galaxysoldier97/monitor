import { check, group } from 'k6';
import { app, shouldHaveStatus200 } from '../helpers/utils.js';

export default function landing() {
    group('Landing', () => {
        check(app('/'), shouldHaveStatus200());
    });
}
