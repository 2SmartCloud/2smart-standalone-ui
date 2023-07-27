import React from 'react';
import { shallow } from 'enzyme';

import MultipleSwitcher from './MultipleSwitcher';
import SwitchTab from '../SwitchTab';

describe('MultipleSwitcher', () => {
    let wrapper;
    let instance;

    beforeEach(() => {
        wrapper = shallow(<MultipleSwitcher />);
        instance = wrapper.instance();
    });

    it('should be created', () => {
        expect(instance).toBeTruthy();
    });

    it('handleClickFirstTab() should call onChange prop', () => {
        wrapper.setProps({ onChange: jest.fn(), isMultiple: true });
        instance.handleClickFirstTab();

        expect(instance.props.onChange).toBeCalledWith(false);
    });

    it('handleClickSecondTab() should call onChange prop', () => {
        wrapper.setProps({ onChange: jest.fn() });
        instance.handleClickSecondTab();

        expect(instance.props.onChange).toBeCalledWith(true);
    });

    it('should SwitchTab be rendered', () => {
        const multipleSwitcherElement = wrapper.find(SwitchTab);

        expect(multipleSwitcherElement.length).toBe(2);
    })
})