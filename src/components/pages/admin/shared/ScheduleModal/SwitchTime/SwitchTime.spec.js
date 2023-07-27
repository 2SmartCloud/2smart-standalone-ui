import React from 'react';
import { shallow } from 'enzyme';

import SwitchTime from './SwitchTime';
import IntegerInput from '../../../../../base/inputs/Integer';
import MultipleSwitcher from '../MultipleSwitcher';

describe('SwitchTime', () => {
    let wrapper;
    let instance;

    beforeEach(() => {
        const mockProps = getMockProps();

        wrapper = shallow(<SwitchTime {...mockProps} />);
        instance = wrapper.instance();
    });

    it('should be created', () => {
        expect(instance).toBeTruthy();

        const switchTimeElement = wrapper.find(MultipleSwitcher);

        expect(switchTimeElement.length).toBe(0);
    });

    it('componentDidMount() should set state isExact', () => {
        wrapper.setProps({ isTimeExact: true });

        instance.componentDidMount();

        expect(wrapper.state().isExact).toBeTruthy();
    });

    it('handleChangeTimeInSwitchMode() should call handleChangeMinutes()', () => {
        wrapper.setProps({ mode: 'minute' });

        spyOn(instance, 'handleChangeMinutes').and.stub();
        spyOn(instance, 'handleChangeHours').and.stub();

        const value = 1;

        instance.handleChangeTimeInSwitchMode(value);

        expect(instance.handleChangeMinutes).toHaveBeenCalledWith(value);
        expect(instance.handleChangeHours).not.toHaveBeenCalledWith(value);
    });

    it('handleChangeTimeInSwitchMode() should call handleChangeHours()', () => {
        wrapper.setProps({ mode: 'hour' });

        spyOn(instance, 'handleChangeMinutes').and.stub();
        spyOn(instance, 'handleChangeHours').and.stub();

        const value = 1;

        instance.handleChangeTimeInSwitchMode(value);

        expect(instance.handleChangeMinutes).not.toHaveBeenCalledWith(value);
        expect(instance.handleChangeHours).toHaveBeenCalledWith(value);
    });

    it('handleChangeMinutes() should be called', () => {
        wrapper.setProps({ onChangeTime: jest.fn() });

        const value = Math.floor(Math.random() * Math.floor(59));

        instance.handleChangeMinutes(value);

        expect(instance.props.onChangeTime).toBeCalled();
    });

    it('handleChangeMinutes() should not be called', () => {
        wrapper.setProps({ onChangeTime: jest.fn() });

        const value = 60;

        instance.handleChangeMinutes(value);

        expect(instance.props.onChangeTime).not.toBeCalled();
    });

    it('handleChangeHours() should be called', () => {
        wrapper.setProps({ onChangeTime: jest.fn() });

        const value = Math.floor(Math.random() * Math.floor(23));

        instance.handleChangeHours(value);

        expect(instance.props.onChangeTime).toBeCalled();
    });

    it('handleChangeHours() should not be called', () => {
        wrapper.setProps({ onChangeTime: jest.fn() });

        const value = 24;

        instance.handleChangeHours(value);

        expect(instance.props.onChangeTime).not.toBeCalled();
    });

    it('handleSwitchMode() should change state isExact', () => {
        const prevIsExactState = wrapper.state().isExact;

        instance.handleSwitchMode(true);

        expect(wrapper.state().isExact !== prevIsExactState).toBeTruthy();
    });

    it('handleSwitchMode() should call onChangeTab prop by mode === minute', () => {
        wrapper.setProps({ onChangeTab: jest.fn(), mode: 'minute' });

        instance.handleSwitchMode(true);

        expect(instance.props.onChangeTab).toBeCalledWith('minutes', true);
        expect(instance.props.onChangeTab).not.toBeCalledWith('hours', true);
        
    });

    it('handleSwitchMode() should call onChangeTab prop by mode === hour', () => {
        wrapper.setProps({ onChangeTab: jest.fn(), mode: 'hour' });

        instance.handleSwitchMode(true);

        expect(instance.props.onChangeTab).not.toBeCalledWith('minutes', true);
        expect(instance.props.onChangeTab).toBeCalledWith('hours', true);
        
    });

    it('renderPeriodicallyTime() should render components', () => {
        instance.renderPeriodicallyTime();

        const inputElement = wrapper.find(IntegerInput);
        const switcherElement = wrapper.find(MultipleSwitcher);

        expect(inputElement).toBeTruthy();
        expect(switcherElement).toBeTruthy();
    });

    it('renderFixedTime() should render components', () => {
        instance.renderFixedTime();

        const inputElement = wrapper.find(IntegerInput);

        expect(inputElement.length === 2).toBeTruthy();
    });

    it('render() should call renderPeriodicallyTime()', () => {
        wrapper.setProps({ isSwitch: true });

        spyOn(instance, 'renderFixedTime').and.stub();
        spyOn(instance, 'renderPeriodicallyTime').and.stub();

        instance.render();

        expect(instance.renderPeriodicallyTime).toHaveBeenCalled();
        expect(instance.renderFixedTime).not.toHaveBeenCalled();

    });

    it('render() should call renderFixedTime()', () => {
        spyOn(instance, 'renderFixedTime').and.stub();
        spyOn(instance, 'renderPeriodicallyTime').and.stub();

        instance.render();

        expect(instance.renderPeriodicallyTime).not.toHaveBeenCalled();
        expect(instance.renderFixedTime).toHaveBeenCalled();

    });

    function getMockProps() {
        return {
            onChangeTime  : jest.fn(),
            onChangeTab   : jest.fn()
        }
    }
})