import React, {
    PureComponent,
    Fragment
}                         from 'react';
import PropTypes          from 'prop-types';
import classnames         from 'classnames/bind';
import Tooltip            from '@material-ui/core/Tooltip';

import globalEnterHandler from '../../../../../utils/globalEnterHandler';
import Cron               from '../../../../../utils/cronBuilder';
import {
    validateCron,
    parseCronExpression
}                         from '../../../../../utils/cronExpression';
import {
    DAYS_OF_WEEK,
    DEFAULT_CRON_EXP,
    MONTH_DAYS,
    MONTH_LIST
}                         from '../../../../../assets/constants/schedule';

import Icon               from '../../../../base/Icon';
import MultipleSwitcher   from './MultipleSwitcher';
import SwitchTime         from './SwitchTime';
import MultipleSelectList from './MultipleSelectList';
import CustomDatePicker   from './CustomDatePicker';
import Footer             from './Footer';
import styles                             from './ScheduleEditor.less';

const INITIAL_STATE = {
    isToggle      : false,
    isMultiple    : false,
    isMinuteExact : false,
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
    weekDays     : [],
    datesOfMonth : [],
    monthData    : []
};

const cn = classnames.bind(styles);

class ScheduleEditor extends PureComponent {
    static propTypes = {
        cronExpression  : PropTypes.string,
        activeField     : PropTypes.number,
        cronExpInterval : PropTypes.array,
        onlyInterval    : PropTypes.bool,
        onClose         : PropTypes.func.isRequired,
        onSubmit        : PropTypes.func.isRequired
    }

    static defaultProps = {
        cronExpression  : '0 0 * * *',
        activeField     : null,
        cronExpInterval : null,
        onlyInterval    : false
    }

    state = INITIAL_STATE

    componentDidMount() {
        const { onlyInterval } = this.props;

        globalEnterHandler.register(this.handleEnterPressed);

        if (onlyInterval) return this.initTimeIntervalConfiguration();

        return this.initBasicConfiguration();
    }

    componentDidUpdate() {
        const { isToggle } = this.state;

        if (this.content) {
            const offsetTop = this.toggle.offsetTop;

            if (isToggle && this.scroll) {
                this.content.scrollTo({ top: offsetTop, behavior: 'smooth' });
                this.scroll = false;
            }
        }
    }

    componentWillUnmount() {
        globalEnterHandler.unregister(this.handleEnterPressed);
    }

    handleEnterPressed = () => {
        this.handleSubmit();
    }

    handleSwitchMultiple = (bool) => {
        if (this.submitButton) this.submitButton.focus();

        this.setState({
            isMultiple : bool
        });
    }

    handleChangeFixedTime = (value, name) => {
        const { fixedTimeData } = this.state;

        this.setState({ fixedTimeData: { ...fixedTimeData, [name]: value } });
    }

    handleChangeStartIntervalTime = (value, name) => {
        this.setState((prev) => ({
            ...prev,
            startIntervalTimeData : {
                ...prev.startIntervalTimeData,
                [name] : value
            }
        }));
    }

    handleChangeEndIntervalTime = (value, name) => {
        this.setState((prev) => ({
            ...prev,
            endIntervalTimeData : {
                ...prev.endIntervalTimeData,
                [name] : value
            }
        }));
    }

    handleChangePeriodicallyTime = (value, name) => {
        const { periodicallyTimeData } = this.state;

        this.setState({ periodicallyTimeData : {
            ...periodicallyTimeData,
            [name] : value
        } });
    }

    handleChangeSwitchTimeTab = (name, bool) => {
        if (this.submitButton) this.submitButton.focus();
        if (name === 'minutes') this.setState({ isMinuteExact: bool });
        if (name === 'hours') this.setState({ isHourExact: bool });

        return;
    }

    handleCloseModal = () => {
        const { onClose } = this.props;

        onClose();
    }

    handleChangeWeekDays = (value) => {
        const { weekDays } = this.state;

        if (this.submitButton) this.submitButton.focus();

        if (weekDays.includes(value)) {
            const dataToSet = weekDays.filter(item => item !== value);

            this.setState({ weekDays: dataToSet });

            return;
        }
        const dataToSet = weekDays.concat(value).sort((a, b) => +a - +b);

        this.setState({ weekDays: dataToSet });
    }

    handleChangeMonth = (value) => {
        const { monthData } = this.state;

        if (this.submitButton) this.submitButton.focus();

        if (monthData.includes(value)) {
            const dataToSet = monthData.filter(item => item !== value);

            this.setState({ monthData: dataToSet });

            return;
        }
        const dataToSet = monthData.concat(value).sort((a, b) => +a - +b);

        this.setState({ monthData: dataToSet });
    }

    handleChangeDateOfMonth = (arr) => {
        if (this.submitButton) this.submitButton.focus();

        this.setState({ datesOfMonth: arr });
    }

    handleSubmit = (e) => {
        if (e) e.preventDefault();
        if (e) e.stopPropagation();

        const { onSubmit, activeField } = this.props;
        const { cronExp } = this.generateCronString();

        onSubmit(cronExp, activeField);
        this.handleCloseModal();
    }

    handleToggle = () => {
        this.scroll = true;
        this.setState(prev => ({
            ...prev,
            isToggle : !prev.isToggle
        }));
    }

    handleResetData = () => {
        const { fixedTimeData, periodicallyTimeData,
            startIntervalTimeData, endIntervalTimeData } = INITIAL_STATE;

        this.setState({
            fixedTimeData,
            periodicallyTimeData,
            startIntervalTimeData,
            endIntervalTimeData,
            datesOfMonth : this.createRange(1, 31),
            weekDays     : this.createRange(0, 6),
            monthData    : this.createRange(0, 11)
        });
    }

    setSubmitButtonRef = (node) => {
        this.submitButton = node;
    }

    createRange(from, to) {
        const arr = [];

        // eslint-disable-next-line more/no-c-like-loops
        for (let i = from; i <= to; i++) {
            arr.push(i.toString());
        }

        return arr;
    }

    generateCronString = () => {
        const { onlyInterval } = this.props;
        const {
            isMultiple,
            isMinuteExact,
            isHourExact,
            fixedTimeData,
            startIntervalTimeData,
            endIntervalTimeData,
            periodicallyTimeData,
            weekDays,
            datesOfMonth,
            monthData } = this.state;
        const cronExp = new Cron();

        const datesToCron = {
            dayOfTheMonth : validateCron.dayOfTheMonth(datesOfMonth) || null,
            dayOfTheWeek  : validateCron.dayOfTheWeek(weekDays),
            month         : validateCron.month(monthData) || null
        };

        if (onlyInterval) {
            const cronExpToSet = [];

            const startTimeData = {
                minute : validateCron.minute(startIntervalTimeData.minutes),
                hour   : validateCron.hour(startIntervalTimeData.hours),
                ...datesToCron
            };
            const endTimeData = {
                minute : validateCron.minute(endIntervalTimeData.minutes),
                hour   : validateCron.hour(endIntervalTimeData.hours),
                ...datesToCron
            };

            [ startTimeData, endTimeData ].forEach(data => {
                cronExp.setAll(data);
                const resultCronExp = cronExp.build();

                cronExpToSet.push(resultCronExp);
            });

            return { cronExp: cronExpToSet };
        }

        const dataToSet = {
            minute : isMultiple
                ? validateCron.minute(periodicallyTimeData.minutes, !isMinuteExact)
                : validateCron.minute(fixedTimeData.minutes),

            hour : isMultiple
                ? validateCron.hour(periodicallyTimeData.hours, !isHourExact)
                : validateCron.hour(fixedTimeData.hours),
            ...datesToCron
        };

        cronExp.setAll(dataToSet);
        const resultCronExp = cronExp.build();

        return { cronExp: resultCronExp };
    }

    parseCronExp = (string) => {
        if (!string) return;
        const {
            minutes,
            hours,
            dayOfMonth,
            dayOfWeek,
            month
        } = parseCronExpression(string);

        return {
            minutes,
            hours,
            dayOfMonth,
            dayOfWeek,
            month
        };
    }

    initBasicConfiguration = () => {
        const { cronExpression } = this.props;

        if (!cronExpression) {
            this.setState({
                weekDays     : this.createRange(0, 6),
                monthData    : this.createRange(0, 11),
                datesOfMonth : this.createRange(1, 31)
            });

            return;
        }

        const {
            minutes,
            hours,
            dayOfMonth,
            dayOfWeek,
            month
        } = this.parseCronExp(cronExpression);

        this.setState({
            periodicallyTimeData : {
                minutes : minutes.on ? minutes.on : (+minutes.every || 0),
                hours   : hours.on ? hours.on : (+hours.every || 0)
            },
            weekDays     : dayOfWeek === '*' ? this.createRange(0, 6) : dayOfWeek,
            datesOfMonth : dayOfMonth === '*' ? this.createRange(1, 31) : dayOfMonth,
            monthData    : month === '*' ? this.createRange(0, 11) : month
        });

        if (minutes.every || hours.every) {
            this.setState({ isMultiple: true });

            if (minutes.on) this.setState({ isMinuteExact: true });
            if (hours.on) this.setState({ isHourExact: true });
        }
        if ((minutes.on || hours.every) && (hours.on || minutes.every)) {
            this.setState({
                periodicallyTimeData : {
                    minutes : minutes.on ? minutes.on : (+minutes.every || 0),
                    hours   : hours.on ? hours.on : (+hours.every || 0)
                }
            });
        }
        if (minutes.on && hours.on) {
            this.setState({
                fixedTimeData : {
                    minutes : +minutes.on || 0,
                    hours   : +hours.on || 0
                },
                periodicallyTimeData : {
                    minutes : 0,
                    hours   : 0
                }
            });
        }
    }

    initTimeIntervalConfiguration = () => {
        const { activeField, cronExpInterval } = this.props;
        const cronExpData = cronExpInterval.filter((data, index) => index === activeField);
        const startTimeCron = cronExpData[0].start || DEFAULT_CRON_EXP;
        const endTimeCron = cronExpData[0].end || DEFAULT_CRON_EXP;

        if (!startTimeCron && !endTimeCron) {
            this.setState({
                weekDays     : this.createRange(0, 6),
                monthData    : this.createRange(0, 11),
                datesOfMonth : this.createRange(1, 31)
            });

            return;
        }

        const startTime = this.parseCronExp(startTimeCron);
        const endTime = this.parseCronExp(endTimeCron);

        this.setState({
            startIntervalTimeData : {
                minutes : +startTime?.minutes.on || 0,
                hours   : +startTime?.hours.on || 0
            },
            endIntervalTimeData : {
                minutes : +endTime?.minutes.on || 0,
                hours   : +endTime?.hours.on || 0
            },
            weekDays     : startTime.dayOfWeek === '*' ? this.createRange(0, 6) : startTime.dayOfWeek,
            datesOfMonth : startTime.dayOfMonth === '*' ? this.createRange(1, 31) : startTime.dayOfMonth,
            monthData    : startTime.month === '*' ? this.createRange(0, 11) : startTime.month
        });
    }

    renderResetButton = () => (
        <Tooltip title='Reset'>
            <div className={styles.iconWrapper}>
                <Icon type='refresh' onClick={this.handleResetData} />
            </div>
        </Tooltip>

    );

    renderOnlyIntervalConfig = () => {
        const { startIntervalTimeData, endIntervalTimeData, weekDays } = this.state;

        return (
            <Fragment>
                <div className={styles.resetWrapperIntervals}>
                    {this.renderResetButton()}
                </div>
                <div className={styles.title}>Start time</div>
                <form className={styles.intervalTimeWrapper} onSubmit={this.handleSubmit}>
                    <SwitchTime
                        timeData={startIntervalTimeData}
                        onChangeTime={this.handleChangeStartIntervalTime}
                    />
                </form>
                <div className={styles.title}>End time</div>
                <form className={styles.intervalTimeWrapper} onSubmit={this.handleSubmit}>
                    <SwitchTime
                        timeData={endIntervalTimeData}
                        onChangeTime={this.handleChangeEndIntervalTime}
                    />
                </form>
                <div className={styles.daysListWrapper}>
                    <div className={styles.title}>Select days</div>
                    <MultipleSelectList
                        className={styles.daysList}
                        options={DAYS_OF_WEEK}
                        active={weekDays}
                        onChange={this.handleChangeWeekDays}
                    />
                </div>
            </Fragment>
        );
    }

    renderMainDateConfig = () => {
        const { isMultiple, isMinuteExact, isHourExact, fixedTimeData, periodicallyTimeData, weekDays } = this.state;

        return (
            <Fragment>
                <div className={styles.multipleSwitcherWrapper}>
                    <div className={styles.multipleSwitcher}>
                        <MultipleSwitcher
                            single='At fixed'
                            multiple='Periodically'
                            isMultiple={isMultiple}
                            onChange={this.handleSwitchMultiple}
                            className={styles.modeSwitcher}
                        />
                        <div className={styles.refreshWrapper}>
                            {this.renderResetButton()}
                        </div>
                    </div>
                </div>
                <div className={styles.title}>Select time</div>
                { !isMultiple
                    ? <form className={styles.timeWrapper} onSubmit={this.handleSubmit}>
                        <SwitchTime
                            timeData={fixedTimeData}
                            onChangeTime={this.handleChangeFixedTime}
                        />
                    </form>
                    : <div className={styles.switchTimeWrapper}>
                        <form className={styles.timeBlock} onSubmit={this.handleSubmit}>
                            <div className={styles.timeBlockTitle}>Hour</div>
                            <SwitchTime
                                timeData={periodicallyTimeData}
                                mode='hour'
                                isSwitch
                                isTimeExact={isHourExact}
                                switcherAlign='vertical'
                                onChangeTime={this.handleChangePeriodicallyTime}
                                onChangeTab={this.handleChangeSwitchTimeTab}
                            />
                        </form>
                        <form className={styles.timeBlock} onSubmit={this.handleSubmit}>
                            <div className={styles.timeBlockTitle}>Minute</div>
                            <SwitchTime
                                timeData={periodicallyTimeData}
                                mode='minute'
                                isSwitch
                                isTimeExact={isMinuteExact}
                                switcherAlign='vertical'
                                onChangeTime={this.handleChangePeriodicallyTime}
                                onChangeTab={this.handleChangeSwitchTimeTab}
                            />
                        </form>
                    </div>
                }
                <div className={styles.daysListWrapper}>
                    <div className={styles.title}>Select days</div>
                    <MultipleSelectList
                        className={styles.daysList}
                        options={DAYS_OF_WEEK}
                        active={weekDays}
                        onChange={this.handleChangeWeekDays}
                    />
                </div>
            </Fragment>
        );
    }

    renderAdvancedDateConfig = () => {
        const { monthData, datesOfMonth } = this.state;

        return (
            <Fragment>
                <div className={styles.datePicker}>
                    <div className={styles.title}>Select dates</div>
                    <CustomDatePicker
                        options={MONTH_DAYS}
                        active={datesOfMonth}
                        onChange={this.handleChangeDateOfMonth}
                    />
                </div>
                <div className={styles.monthListWrapper}>
                    <div className={styles.title}>Select months</div>
                    <MultipleSelectList
                        className={styles.month}
                        options={MONTH_LIST}
                        active={monthData}
                        onChange={this.handleChangeMonth}
                    />
                </div>
            </Fragment>
        );
    }

    render() {
        const { onlyInterval } = this.props;
        const { isToggle } = this.state;
        const IconCN = cn(styles.arrow, {
            arrowDown : !isToggle,
            arrowUp   : isToggle
        });

        return (
            <Fragment>
                <div ref={node => this.content = node} className={styles.content}>
                    <div className={styles.contentBlock}>
                        { onlyInterval ? this.renderOnlyIntervalConfig() : this.renderMainDateConfig()}
                        <div
                            ref={node => this.toggle = node}
                            className={styles.toggle}
                            onClick={this.handleToggle}
                        >
                            { isToggle ? 'Less' : 'More'}
                            <i className={IconCN} />
                        </div>
                        { isToggle ? this.renderAdvancedDateConfig() : null}
                    </div>
                </div>
                <Footer
                    setRef    = {this.setSubmitButtonRef}
                    className = {styles.footer}
                    onDeny    = {this.props.onClose}
                    onSubmit  = {this.handleSubmit}
                />
            </Fragment>

        );
    }
}

export default ScheduleEditor;
