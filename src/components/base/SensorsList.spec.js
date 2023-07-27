import React from 'react';
import { shallow } from 'enzyme';
import SensorsList from './SensorsList';
import * as sort from '../../utils/sort';

jest.mock('../../utils/sort', () => ({
    sortNodes : jest.fn().mockImplementation(x => x)
}));

describe('SensorsList component', () => {
    let wrapper;
    let instance;

    beforeEach(() => {
        const mockProps = getMockProps();

        wrapper = shallow(<SensorsList {...mockProps} />);
        instance = wrapper.instance();
    });

    it('should be created', () => {
        expect(instance).toBeDefined();
    });

    it('should sort sensors', () => {
        expect(sort.sortNodes).toHaveBeenCalled();
    });

    function getMockProps() {
        return {
            sensors   : [],
            deviceId  : 'device1',
            nodeId    : 'node1',
            sortOrder : 'ASC'
        };
    }
});
