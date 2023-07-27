import React, { PureComponent }   from 'react';
import PropTypes                  from 'prop-types';
import classnames                 from 'classnames/bind';

import Tooltip                    from '@material-ui/core/Tooltip';
import ClearIcon                  from '@material-ui/icons/Clear';

import { SIGNAL_PROGRESS_STEPS }  from '../../../assets/constants/widget';

import CriticalValue              from '../../base/CriticalValue';

import styles                     from './SignalLevelWidget.less';

const cx = classnames.bind(styles);

class SignalLevelWidget extends PureComponent {
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
        // eslint-disable-next-line no-magic-numbers
        const percent = Math.floor((value - minValue) * 100 / (maxValue - minValue));
        // eslint-disable-next-line no-magic-numbers
        const percentLimited = Math.min(Math.max(percent, 0), 100);

        return percentLimited;
    }

    getCurrentLevel = () => {
        const { value } = this.props;
        // const formattedUnit = getPropertyUnit(unit);
        // eslint-disable-next-line no-magic-numbers
        const percent = this.getPercent();

        const actualLevel = Object.values(SIGNAL_PROGRESS_STEPS).find((level) => percent <= level.percent);

        const currentLevel = {
            ...actualLevel
        };

        return (value && value >= 0) ? currentLevel : { label: 'Value error', isInvalid: true };
    }

    renderSignalLevels(percent, level) {
        if (level?.percent < 100) {
            return (<div
                className = {cx(styles.level, {
                    [styles.filled] : level?.percent < percent }
                )}
                key       = {level?.label}
            />);
        }
    }


    render() {
        const { label, isInvalid } = this.getCurrentLevel();
        const percent = this.getPercent();

        const SignalLevelCN = cx(
            styles.SignalLevel,
            {
                invalid : isInvalid
            }
        );

        return (
            <div className={SignalLevelCN}>
                {
                    !isInvalid ?
                        (<div className={styles.valueWrapper}>
                            <CriticalValue
                                className = {styles.value}
                                value = {percent}
                            />
                            <CriticalValue
                                className = {styles.unit}
                                value = {'%'}
                            />
                        </div>) : null
                }


                <Tooltip title={label}>
                    <div className={styles.signalsWrapper}>
                        <div className={styles.iconWrapper}>
                            <ClearIcon
                                className={styles.icon}
                            />
                        </div>
                        <div className = {styles.signalLevels}>
                            {
                                Object.values(SIGNAL_PROGRESS_STEPS).map((level) =>
                                    this.renderSignalLevels(percent, level)
                                )
                            }
                        </div>
                    </div>
                </Tooltip>
            </div>
        );
    }
}

export default SignalLevelWidget;
