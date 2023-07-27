import React from 'react';
import { shallow } from 'enzyme';

import ScheduleConfig from './ScheduleConfig';
import InputsRow from './InputsRow';

describe('ScheduleConfig component', () => {
    let wrapper;
    let instance;

    beforeEach(() => {
        const mockProps = getMockProps();
        wrapper = shallow(<ScheduleConfig { ...mockProps} />);
        instance = wrapper.instance();
    });

    it('should be created', () => {
        expect(instance).toBeTruthy();
    });

    describe('componentDidMount()', () => {
        const expectedState = [{ start: '', end: '' }];

        it('should change state if !initialState', () => {
            wrapper.setProps({
                initialState : null,
                field : { default: expectedState }
            });

            instance.componentDidMount();

            expect(instance.state.timePeriods).toEqual(expectedState);
        });

        it('should change state if initialState exsists', () => {
            instance.componentDidMount();

            expect(instance.state.timePeriods).toEqual(expectedState);
        });
    });

    it('should handleOpenModal() change state', () => {
        const expectedState = {
            isOpen      : true,
            activeField : 1,
            timePeriods : [ { start: '', end: '' } ]
        }

        instance.handleOpenModal(1);

        expect(instance.state).toEqual(expectedState);
    });

    it('should handleCloseModal() change state', () => {
        wrapper.setState({ isOpen: true, activeField: 1});

        const expectedState = {
            isOpen      : false,
            activeField : null,
            timePeriods : [ { start: '', end: '' } ]
        }

        instance.handleCloseModal();

        expect(instance.state).toEqual(expectedState);
    });

    describe('handleAddField()', () => {
        it('should handleAddField() add field', () => {
            wrapper.setState({ timePeriods : [ { start: '', end: '' } ] });

            const expectedState = [{
                start: '',
                end: ''
            }, {
                start: '',
                end: ''
            }];

            instance.handleAddField();

            expect(instance.state.timePeriods).toEqual(expectedState);
        });

        it('should call onChange prop', () => {
            instance.handleAddField();

            expect(instance.props.onChange).toHaveBeenCalled();
        });

        it('should call onInteract()', () => {
            spyOn(instance, 'onInteract');

            instance.handleAddField();

            expect(instance.onInteract).toHaveBeenCalled();
        });
    });

    describe('handleRemoveField()', () => {
        it('should change state', () => {
            const expectedState = [ {
                start: '',
                end: ''
            }, {
                start: '',
                end: ''
            }];

            wrapper.setState({ timePeriods: expectedState });

            instance.handleRemoveField();

            expect(instance.state.timePeriods).toEqual(expectedState);
        });

        it('should call onChange prop', () => {
            instance.handleRemoveField();

            expect(instance.props.onChange).toHaveBeenCalled();
        });

        it('should call onInteract()', () => {
            spyOn(instance, 'onInteract');

            instance.handleRemoveField();

            expect(instance.onInteract).toHaveBeenCalled();
        });
    });

    describe('handleSumbitModal()', () => {
        const cronExpInterval = ['10 10 * * *', '20 20 * * *'];
        const expectedState = [{ start: '10 10 * * *', end: '20 20 * * *' }];

        it('should change state', () => {
            wrapper.setState({ activeField: 0 });
            instance.handleSumbitModal(cronExpInterval, 0);

            expect(instance.state.activeField).toEqual(null);
            expect(instance.state.timePeriods).toEqual(expectedState);
        });
    
        it('should call onChange prop', () => {
            instance.handleSumbitModal(cronExpInterval, 0);

            expect(instance.props.onChange).toHaveBeenCalled();
        });

        it('should call onInteract()', () => {
            spyOn(instance, 'onInteract');

            instance.handleSumbitModal(cronExpInterval, 0);

            expect(instance.onInteract).toHaveBeenCalled();
        });
    });

    it('should onInteract call onInteract prop', () => {
        wrapper.setProps({ errors: {start: 'invalid', end: 'invalid'}});

        instance.onInteract();

        expect(instance.props.onInteract).toHaveBeenCalledWith('start');
    });

    it('should transformCronToString() parse cron to string', () => {
        const expectedString = 'Start time: At 00:00';
        const value = '0 0 * * *';
        const label = 'Start time';
        const result = instance.transformCronToString(value, label);

        expect(result).toEqual(expectedString);
    });

    describe('renderField', () => {
        it('should render one InputsRow component on init', () => {
            const fieldElement = wrapper.find(InputsRow);

            instance.renderField();

            expect(fieldElement.length).toBe(1);
        });
        it('should render InputsRow components', () => {
            const expectedState = [ {
                start: '',
                end: ''
            }, {
                start: '',
                end: ''
            }];

            wrapper.setState({ timePeriods: expectedState });
            const fieldElement = wrapper.find(InputsRow);

            instance.renderField();

            expect(fieldElement.length).toBe(2);
        });
    });

    function getMockProps() {
        return {
            field : {
                label : 'Schedule'
            },
            initialState : [ { start: '', end: '' } ],
            onInteract   : jest.fn(),
            onChange     : jest.fn()
        };
    }
});