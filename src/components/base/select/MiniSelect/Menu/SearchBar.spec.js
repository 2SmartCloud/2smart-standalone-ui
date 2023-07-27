import React from 'react';
import { shallow } from 'enzyme';
import SearchBar from './SearchBar';

describe('SearchBar component', () => {
    let instance;
    let wrapper;

    beforeEach(() => {
        const mockProps = getMockProps();

        wrapper = shallow(<SearchBar {...mockProps} />);
        instance = wrapper.instance();
    });

    it('should be created', () => {
        expect(instance).toBeDefined();
    });

    it('handleInputChange() should call onSearchChange prop', () => {
        instance.handleInputChange('test');

        expect(instance.props.onSearchChange).toHaveBeenCalledWith('test');
    });

    function getMockProps() {
        return {
            onSearchChange : jest.fn()
        };
    }
});

