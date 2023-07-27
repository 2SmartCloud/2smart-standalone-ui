import React from 'react';
import { shallow } from 'enzyme';
import MiniSelect from './index';

describe('MiniSelect component', () => {
    let instance;
    let wrapper;

    beforeEach(() => {
        const mockProps = getMockProps();

        wrapper = shallow(<MiniSelect {...mockProps} />);
        instance = wrapper.instance();
    });

    it('should be created', () => {
        expect(instance).toBeDefined();
    });

    it('handleContainerClick() should set open menu state', () => {
        expect(instance.state.isMenuOpen).toBeFalsy();

        instance.handleContainerClick();

        expect(instance.state.isMenuOpen).toBeTruthy();
    });

    it('handleMenuClose() should call closeMenu', () => {
        spyOn(instance, 'closeMenu').and.stub();

        instance.handleMenuClose();

        expect(instance.closeMenu).toHaveBeenCalled();
    });

    it('handleOptionChange() should call close menu and onChange prop', () => {
        spyOn(instance, 'closeMenu').and.stub();

        instance.handleOptionChange('test-option');

        expect(instance.closeMenu).toHaveBeenCalled();
        expect(instance.props.onChange).toHaveBeenCalledWith('test-option');
    });

    it('handleSearchChange() should set search state', () => {
        expect(instance.state.searchQuery).toBe('');

        instance.handleSearchChange('test-value');

        expect(instance.state.searchQuery).toBe('test-value');
    });

    it('closeMenu() should set closed menu state', () => {
        wrapper.setState({ isMenuOpen: true });

        instance.closeMenu();

        expect(instance.state.isMenuOpen).toBeFalsy();
    });

    function getMockProps() {
        return {
            placeholder : 'Test',
            settings : {
                isSearchable : false,
                value        : null
            },
            onChange : jest.fn()
        };
    }
});
