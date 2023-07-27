import React, { PureComponent }   from 'react';
import PropTypes                  from 'prop-types';
import classnames                 from 'classnames/bind';

import Tooltip                    from '@material-ui/core/Tooltip';

import { BATTERY_PROGRESS_STEPS } from '../../../assets/constants/widget';
// import getPropertyUnit            from '../../../utils/getPropertyUnit';

import CriticalValue              from '../../base/CriticalValue';

import styles                     from './BatteryWidget.less';


class BatteryWidget extends PureComponent {
    static propTypes = {
        value    : PropTypes.string,
        advanced : PropTypes.shape({
            minValue : PropTypes.oneOfType([ PropTypes.string, PropTypes.number ]),
            maxValue : PropTypes.oneOfType([ PropTypes.string, PropTypes.number ])
        }).isRequired
    }

    static defaultProps = {
        value : '-'
    }

    getPercent = () => {
        const { value, advanced: { minValue, maxValue } } = this.props;
        const percent = Math.min(Math.max(Math.floor((value - minValue) * 100 / (maxValue - minValue)), 0), 100);

        return percent;
    }

    getProgressStep = () => {
        const percent = this.getPercent();
        const step = Object.values(BATTERY_PROGRESS_STEPS).find((level) => level.percent >= percent);

        return (percent || (parseInt(percent, 10) === 0)) ? step : { label: 'Value error', color: '#000', isInvalid: true };
    }

    getBatteryProperties = () => {
        const percent = this.getPercent();
        const progressStep = this.getProgressStep();
        const color = progressStep?.color;

        return {
            battery        : { borderColor: color },
            progress       : { backgroundColor: color, width: progressStep?.isInvalid ? '0' : `${percent}%` },
            batteryBgColor : { backgroundColor: progressStep?.isInvalid ? '#E5E5E5' : color },
            stub           : { backgroundColor: color },
            invalid        : progressStep?.isInvalid,
            label          : progressStep?.label
        };
    }

    render() {
        // const { unit } = this.props;
        // const formattedUnit = getPropertyUnit(unit);
        const { battery, progress, batteryBgColor, stub, invalid, label } = this.getBatteryProperties();
        const percent = this.getPercent();
        const cx = classnames.bind(styles);
        const BatteryWidgetCN = cx(styles.BatteryWidget, { invalid });

        return (
            <div className={BatteryWidgetCN}>
                <div className={styles.valueWrapper}>
                    <CriticalValue
                        className = {styles.value}
                        value = {percent}
                    />

                    <CriticalValue
                        className = {styles.unit}
                        value = {'%'}
                    />
                </div>

                <Tooltip
                    classes = {{ tooltip: styles.tooltip }}
                    title   = {label}
                >
                    <div
                        className = {styles.battery}
                        style     = {battery}
                    >
                        <div
                            className = {styles.progress}
                            style     = {progress}
                        />
                        <div
                            className = {styles.bg}
                            style     = {batteryBgColor}
                        />
                        <div
                            className = {styles.batteryStub}
                            style     = {stub}
                        />
                    </div>
                </Tooltip>
            </div>
        );
    }
}

export default BatteryWidget;
