import React from 'react';
import { shallow } from 'enzyme';

import BackupSelect from './BackupSelect';

describe('BackupSelect component', () => {
    let instance;
    let wrapper;

    beforeEach(() => {
        const mockProps = getMockProps();
        wrapper = shallow(<BackupSelect {...mockProps} />);
        instance = wrapper.instance();

    });

    it('should be created', () => {
        expect(instance).toBeDefined();
    });

    it('handleSelect should select value ', () => {
        const item = {value:'value'};
        instance.handleSelect(item);
        expect(instance.props.onChange).toHaveBeenCalledWith(item)
    });

    function getMockProps() {
        return {
            options : [],
            onChange: jest.fn()
        };
    }
});

