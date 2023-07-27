import React from 'react';
import { shallow } from 'enzyme';
import Menu from './index';
import SearchBar from './SearchBar';

describe('Menu component', () => {
    let instance;
    let wrapper;

    beforeEach(() => {
        const mockProps = getMockProps();

        wrapper = shallow(<Menu {...mockProps} />);
        instance = wrapper.instance();
    });

    it('should be created', () => {
        expect(instance).toBeDefined();
    });

    it('should render SearchBar if isSearchable is truthy', () => {
        wrapper.setProps({ isSearchable: true });

        const searchBar = wrapper.find(SearchBar);

        expect(searchBar).toHaveLength(1);
    });

    it('handleCloseButtonClick() should call onClose prop', () => {
        instance.handleCloseButtonClick();

        expect(instance.props.onClose).toHaveBeenCalled();
    });

    function getMockProps() {
        return {
            isOpen         : true,
            onClose        : jest.fn(),
            onSearchChange : jest.fn(),
            searchQuery    : '',
            options        : []
        };
    }
});

