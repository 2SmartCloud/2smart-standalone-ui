import React from 'react';
import { shallow } from 'enzyme';

import ScheduleEditor from './ScheduleEditor';
import SwitchTime from './SwitchTime';

describe('ScheduleEditor', () => {
    let wrapper;
    let instance;

    beforeEach(() => {
        const mockProps = getMockProps();

        wrapper = shallow(<ScheduleEditor {...mockProps} />);
        instance = wrapper.instance();
    });

    it('should be created', () => {
        expect(instance).toBeTruthy();
    });

    describe('componentDidMount()', () => {
        it('should call initTimeIntervalConfiguration() if onlyInterval', () => {
            wrapper.setProps({ onlyInterval: true });

            spyOn(instance, 'initTimeIntervalConfiguration').and.stub();

            instance.componentDidMount();

            expect(instance.initTimeIntervalConfiguration).toHaveBeenCalled();
        });

        it('should call initBasicConfiguration() if !onlyInterval', () => {
            spyOn(instance, 'initBasicConfiguration').and.stub();

            instance.componentDidMount();

            expect(instance.initBasicConfiguration).toHaveBeenCalled();
        });
    });

    it('should handleSwitchMultiple() change isMultiple state', () => {
        expect(instance.state.isMultiple).toBeFalsy();

        instance.handleSwitchMultiple(true);

        expect(instance.state.isMultiple).toBeTruthy();
    });

    it('should handleToggle() change state isToggle', () => {
        const prevState = instance.state.isToggle;

        instance.handleToggle();

        expect(instance.state.isToggle !== prevState).toBeTruthy();
    });

    it('schould componentDidMount() change state', () => {
        instance.componentDidMount()

        expect(instance.state.weekDays.length).toBeTruthy();
        expect(instance.state.datesOfMonth.length).toBeTruthy();
        expect(instance.state.monthData.length).toBeTruthy();
    });

    it('should handleCloseModal() call onClose prop', () => {
        wrapper.setProps({ onClose: jest.fn() });

        instance.handleCloseModal();

        expect(instance.props.onClose).toBeCalled();
    });

    it('should handleChangeWeekDays() change weekDays state', () => {
        const arr = [ '1', '2', '3'];
        wrapper.setState({ weekDays: [ ...arr ] })

        instance.handleChangeWeekDays('1');

        expect(instance.state.weekDays.length).toBe(2);

        instance.handleChangeWeekDays('1');

        expect(instance.state.weekDays.length).toBe(3);
    });

    it('should handleChangeMonth() change monthData state', () => {
        const arr = [ '1', '2', '3'];
        wrapper.setState({ monthData: [ ...arr ] })

        instance.handleChangeMonth('1');

        expect(instance.state.monthData.length).toBe(2);

        instance.handleChangeMonth('1');

        expect(instance.state.monthData.length).toBe(3);
    });

    it('should handleChangeDateOfMonth() change datesOfMonth state', () => {
        wrapper.setState({ datesOfMonth: [] })

        expect(instance.state.datesOfMonth.length).toBeFalsy();

        instance.handleChangeDateOfMonth(['1', '2', '3']);

        expect(instance.state.monthData.length).toBeTruthy;
    });

    it('should handleChangeSwitchTimeTab() change isMinuteExact, isHourExact state', () => {
        wrapper.setState({ isMinuteExact: false, isHourExact: false });
        const prevIsMinuteExact = instance.state.isMinuteExact;
        const prevIsHourExact = instance.state.isHourExact;

        instance.handleChangeSwitchTimeTab('minutes', true);

        expect(instance.state.isMinuteExact !== prevIsMinuteExact).toBeTruthy();
        expect(instance.state.isHourExact === prevIsHourExact).toBeTruthy();

        instance.handleChangeSwitchTimeTab('hours', true);

        expect(instance.state.isMinuteExact).toBeTruthy();
        expect(instance.state.isHourExact).toBeTruthy();

    });

    it('should handleResetData() change state', () => {
        const createRange = (from, to) => {
            const arr = [];
            for (let i = from; i <= to; i++) {
                arr.push(i.toString());
            }
            return arr;
        }

        wrapper.setState({
            isToggle      : true,
            isMultiple    : false,
            isMinuteExact : true,
            isHourExact   : false,
            fixedTimeData : {
                minutes : 12,
                hours   : 5
            },
            periodicallyTimeData : {
                minutes : 12,
                hours   : 11
            },
            startIntervalTimeData : {
                minutes : 12,
                hours   : 12
            },
            endIntervalTimeData : {
                minutes : 1,
                hours   : 3
            },
            weekDays     : ['0', '1', '2'],
            datesOfMonth : ['1', '2', '3'],
            monthData    : ['0', '2', '3'],
        })

        const expectedState = {
            isToggle      : true,
            isMultiple    : false,
            isMinuteExact : true,
            isHourExact   : false,
            fixedTimeData : {
                minutes : 0,
                hours   : 0
            },
            periodicallyTimeData : {
                minutes : 0,
                hours   : 0
            },
            startIntervalTimeData : {
                minutes : 0,
                hours   : 0
            },
            endIntervalTimeData : {
                minutes : 0,
                hours   : 0
            },
            weekDays     : createRange(0, 6),
            datesOfMonth : createRange(1, 31),
            monthData    : createRange(0, 11)
        };

        instance.handleResetData();

        expect(instance.state).toEqual(expectedState);
    });

    it('should set default cron expression', () => {
        const { cronExp } = instance.generateCronString();

        expect(cronExp === '0 0 * * *').toBeTruthy;
    });

    it('should default cron expression be parsed', () => {
        const cronExp = '0 0 * * *'
        const {
            minutes,
            hours,
            dayOfMonth,
            dayOfWeek,
            month
        } = instance.parseCronExp(cronExp);

        expect(typeof minutes === 'object').toBeTruthy();
        expect(typeof hours === 'object').toBeTruthy();
        expect(typeof dayOfMonth === 'string').toBeTruthy();
        expect(typeof dayOfWeek === 'string').toBeTruthy();
        expect(typeof month === 'string').toBeTruthy();
    });

    it('should cron expression be parsed', () => {
        const cronExp = '0 0 1,2,3 1,2,3 1,2,3'
        const {
            minutes,
            hours,
            dayOfMonth,
            dayOfWeek,
            month
        } = instance.parseCronExp(cronExp);

        expect(typeof minutes === 'object').toBeTruthy();
        expect(typeof hours === 'object').toBeTruthy();
        expect(dayOfMonth.length).toBeTruthy();
        expect(dayOfWeek.length).toBeTruthy();
        expect(month.length).toBeTruthy();
    });

    it('should renderOnlyIntervalConfig() be called if onlyInterval', () => {
        wrapper.setProps({ onlyInterval: true });

        spyOn(instance, 'renderOnlyIntervalConfig');

        instance.render();

        expect(instance.renderOnlyIntervalConfig).toHaveBeenCalled();
    });

    it('should renderMainDateConfig() render inputs on exact', () => {
        const switchTimeElement = wrapper.find(SwitchTime);

        expect(switchTimeElement.length).toBe(1);
    });

    it('should renderMainDateConfig() render inputs on periodically', () => {
        wrapper.setState({ isMultiple: true });

        const switchTimeElement = wrapper.find(SwitchTime);

        expect(switchTimeElement.length).toBe(2);
    });

    it('should advance config shown', () => {
        wrapper.find('.toggle').simulate('click');

        expect(wrapper.state().isToggle).toBeTruthy();
        expect(wrapper.find('.toggle').text()).toBe('Less');
    });

    function getMockProps() {
        return {
            onSubmit : jest.fn(),
            onClose : jest.fn()
        }
    }
});
