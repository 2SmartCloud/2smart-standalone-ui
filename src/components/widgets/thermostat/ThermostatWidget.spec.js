import React from 'react';
import { shallow } from 'enzyme'
import ThermostatWidget from './ThermostatWidget.js';
import { ConsoleWriter } from 'istanbul-lib-report';

jest.useFakeTimers();

describe('ThermostatWidget', () => {
    let wrapper;
    let instance;

    beforeEach(() => {
        const mockProps = getMockProps();
        wrapper = shallow(<ThermostatWidget {...mockProps}/>);

        instance = wrapper.instance();
    });

    it('should be created', () => {
        expect(instance).toBeTruthy();
    });

    describe('should increase step', () => {
        it('X1 before 25 iteration', () => {
            const step  = 1;
            const value = 10;

            wrapper.setProps({
                value,
                advanced :  {
                    step
                }
            });
            instance.updateCount = 22;
            instance.updateValue('increase');
            jest.runAllTimers();
            expect(wrapper.state().value).toBe(value + step * 1)
        });

        it('X2 after 25 iteration', () => {
            const step  = 1;
            const value = 10;

            wrapper.setProps({
                value,
                advanced :  {
                    step
                }
            });
            instance.updateCount = 26;
            instance.updateValue('increase');
            jest.runAllTimers();
            expect(wrapper.state().value).toBe(value + step * 2)
        });

        it('X3 after 40 iteration', () => {
            const step  = 1;
            const value = 10;

            wrapper.setProps({
                value,
                advanced :  {
                    step
                }
            });
            instance.updateCount = 41;
            instance.updateValue('increase');
            jest.runAllTimers();
            expect(wrapper.state().value).toBe(value + step * 3)
        });
    });

    describe('updateWithInterval()', () => {
        it('should update value every 350 ms on start', () => {
            instance.updateValue = jest.fn();
            instance.updateCount = 1;
            instance.updateWithInterval('increase');
            jest.advanceTimersByTime(350);

            expect(instance.updateValue).toHaveBeenCalledWith('increase');
        });

        it('should update value every 200 ms after 4 iteration', () => {
            instance.updateValue = jest.fn();
            instance.updateCount = 5;
            instance.updateWithInterval('increase');
            jest.advanceTimersByTime(200);

            expect(instance.updateValue).toHaveBeenCalledWith('increase');
        });

        it('should update value every 130 ms after 15 iteration', () => {
            instance.updateValue = jest.fn();
            instance.updateCount = 16;
            instance.updateWithInterval('increase');
            jest.advanceTimersByTime(130);

            expect(instance.updateValue).toHaveBeenCalledWith('increase');
        });
    });

    function getMockProps() {
        return {
            value        : 10,
            advanced     : {
                step     : 1
            },
            dataType     : 'integer',
            isEditMode   : true,
            isLocked     : false,
            isProcessing : false,
            isProcessing : false,
            onSetValue   : jest.fn()
        }
    }
});
