import getPropertyUnit from '../../getPropertyUnit';
import { tresholds, mappedMultiScenarioSetpoints } from '../../../__mocks__/tresholdsMock';

import * as setpoints from './index';

describe('setpoints mapper', () => {
    it('mapSetpoint', () => {

        const result = setpoints.mapSetpoint(tresholds.multi[0]);

        expect(result).toEqual(mappedMultiScenarioSetpoints[0]);
    });

});
