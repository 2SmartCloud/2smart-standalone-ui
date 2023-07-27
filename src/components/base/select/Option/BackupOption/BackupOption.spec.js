import React from 'react';
import { shallow } from 'enzyme';

import BackupOption from './BackupOption';

describe('BackupOption component', () => {
    let instance;
    let wrapper;

    beforeEach(() => {
        const mockProps = getMockProps();
        wrapper = shallow(<BackupOption {...mockProps} />);
        instance = wrapper.instance();

    });

    it('should be created', () => {
        expect(instance).toBeDefined();
    });


    function getMockProps() {
        return {
            data:{
                name:'name',
                time:'time'
            }
        };
    }
});

