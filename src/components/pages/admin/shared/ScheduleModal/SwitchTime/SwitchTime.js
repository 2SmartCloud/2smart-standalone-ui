import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames/bind';

import IntegerInput from '../../../../../base/inputs/Integer';
import MultipleSwitcher from '../MultipleSwitcher';

import styles from './SwitchTime.less';

const cn = classnames.bind(styles);

class SwitchTime extends PureComponent {
    static propTypes = {
        mode     : PropTypes.string,
        timeData : PropTypes.shape({
            minutes : PropTypes.number,
            hours   : PropTypes.number
        }),
        isTimeExact   : PropTypes.bool,
        isSwitch      : PropTypes.bool,
        switcherAlign : PropTypes.string,
        onChangeTime  : PropTypes.func,
        onChangeTab   : PropTypes.func
    }

    static defaultProps = {
        mode     : '',
        timeData : {
            minutes : 0,
            hours   : 0
        },
        isTimeExact   : false,
        switcherAlign : 'horizontal',
        isSwitch      : false,
        onChangeTime  : undefined,
        onChangeTab   : undefined
    }

    state = {
        isExact : false
    }

    componentDidMount() {
        const { isTimeExact } = this.props;

        this.setState({ isExact: isTimeExact });
    }

    handleChangeTimeInSwitchMode = (value) => {
        const { mode } = this.props;

        if (mode === 'minute') {
            this.handleChangeMinutes(value);

            return;
        }

        this.handleChangeHours(value);
    }

    handleChangeMinutes = (value) => {
        const { isExact } = this.state;
        const { onChangeTime } = this.props;
        const valueToSet = +value;

        if (valueToSet >= 0 && valueToSet < 60) {
            onChangeTime(valueToSet, 'minutes', isExact);
        }
    }

    handleChangeHours = (value) => {
        const { isExact } = this.state;
        const { onChangeTime } = this.props;
        const valueToSet = +value;

        if (valueToSet >= 0 && valueToSet < 24) {
            onChangeTime(valueToSet, 'hours', isExact);
        }
    }

    handleSwitchMode = (bool) => {
        const { onChangeTab, mode } = this.props;

        this.setState({ isExact: bool });
        if (mode === 'minute') onChangeTab('minutes', bool);
        if (mode === 'hour') onChangeTab('hours', bool);
    }

    formatTimeToString = (m, hr) => {
        const minutes = m < 10 ? `0${m}` : m;
        const hours = hr < 10 ? `0${hr}` : hr;

        return { minutes, hours };
    }

    renderPeriodicallyTime = () => {
        const { isExact } = this.state;
        const { switcherAlign, mode, timeData } = this.props;
        const { minutes, hours } = this.formatTimeToString(timeData.minutes, timeData.hours);
        const valueToSet = mode === 'minute' ? minutes : hours;
        const buttonCN = cn(styles.fieldButton, {
            vertical : switcherAlign === 'vertical'
        });

        return (
            <div className={styles.fieldRow}>
                <div className={styles.fieldInputWrapper}>
                    <IntegerInput
                        autoFocus={false}
                        value={valueToSet}
                        maximumHarcodingIOS
                        onChange={this.handleChangeTimeInSwitchMode} />
                </div>
                <div className={styles.switchModeWrapper}>
                    <MultipleSwitcher
                        className={buttonCN}
                        single='At every'
                        multiple='At exact'
                        align={switcherAlign}
                        isMultiple={isExact}
                        onChange={this.handleSwitchMode}
                    />
                </div>
            </div>
        );
    }

    renderFixedTime = () => {
        const { timeData } = this.props;
        const { minutes, hours } = this.formatTimeToString(timeData.minutes, timeData.hours);

        return (
            <div className={styles.fieldRow}>
                <div className={styles.fieldInputWrapper}>
                    <IntegerInput
                        autoFocus={false}
                        value={hours}
                        darkThemeSupport
                        onChange={this.handleChangeHours}
                        maximumHarcodingIOS />
                </div>
                <div className={styles.fieldInputWrapper}>
                    <IntegerInput
                        autoFocus={false}
                        value={minutes}
                        darkThemeSupport
                        onChange={this.handleChangeMinutes}
                        maximumHarcodingIOS />
                </div>
                <button style={{ display: 'none' }} />
            </div>
        );
    }

    render() {
        const { isSwitch } = this.props;

        return (
            isSwitch
                ? this.renderPeriodicallyTime()
                : this.renderFixedTime()
        );
    }
}

export default SwitchTime;
