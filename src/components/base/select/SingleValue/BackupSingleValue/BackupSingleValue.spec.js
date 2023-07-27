import React from 'react';
import { shallow } from 'enzyme';

import BackupSingleValue from './BackupSingleValue';

describe('BackupSingleValue component', () => {
    let instance;
    let wrapper;

    beforeEach(() => {
        const mockProps = getMockProps();
        wrapper = shallow(<BackupSingleValue {...mockProps} />);
        instance = wrapper.instance();

    });

    it('should be created', () => {
        expect(instance).toBeDefined();
    });


    function getMockProps() {
        return {
            data:{
                name:'name',
                time:'time',
                timePrecise:'timePrecise'
            }
        };
    }
});

