import React from 'react';
import { shallow } from 'enzyme';

import ScheduleModal from './ScheduleModal';

describe('ScheduleModal', () => {
    let wrapper;
    let instance;

    beforeEach(() => {
        const mockProps = getMockProps();

        wrapper = shallow(<ScheduleModal {...mockProps} />);
        instance = wrapper.instance();
    });

    it('should be created', () => {
        expect(instance).toBeTruthy();
    });

    function getMockProps() {
        return {
            onSubmit : jest.fn(),
            onClose : jest.fn()
        }
    }
});