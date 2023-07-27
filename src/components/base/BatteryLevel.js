import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import Tooltip from '@material-ui/core/Tooltip';
import { BatteryAlert, Battery20, Battery50, Battery80, BatteryFull, BatteryUnknown } from '@material-ui/icons';
import classnames from 'classnames/bind';
import { batteryLevelValidator } from '../../utils/validation/telemetry';
import getPropertyUnit from '../../utils/getPropertyUnit';
import { requiredValidator } from '../../utils/validation/main';

import styles from './BatteryLevel.less';

const cn = classnames.bind(styles);

class BatteryLevel extends PureComponent {
    isValueExist() {
        const { value } = this.props;
        const res = requiredValidator.validate({ value });

        return !!res;
    }

    validateValue() {
        const res = batteryLevelValidator.validate({ value: this.props.value });

        return !!res;
    }

    renderBatteryCharge() {
        const { value } = this.props;

        switch (true) {
            case (value <= 5):
                return <BatteryAlert />;
            case (value <= 30):
                return <Battery20 />;
            case (value <= 60):
                return <Battery50 />;
            case (value <= 95):
                return <Battery80 />;
            default:
                return <BatteryFull />;
        }
    }

    renderValue() {
        const { value, unit } = this.props;

        return (
            this.validateValue() ?
                <Tooltip title={`${value} ${getPropertyUnit(unit)}`}>
                    {this.renderBatteryCharge()}
                </Tooltip> :
                <Tooltip title='Unknown value'>
                    <BatteryUnknown className={styles.invalidSignalValue} />
                </Tooltip>
        );
    }

    render() {
        const { value, isDisable } = this.props;

        const BatteryLevelCN = cn('BatteryLevel', {
            isDisable,
            alert : value <= 5
        });

        return (
            <div className={BatteryLevelCN}>
                {
                    this.isValueExist() ?
                        this.renderValue() :
                        null
                }
            </div>
        );
    }
}

BatteryLevel.propTypes = {
    value     : PropTypes.string,
    unit      : PropTypes.string,
    isDisable : PropTypes.bool
};

BatteryLevel.defaultProps = {
    value     : '',
    unit      : '',
    isDisable : false
};

export default BatteryLevel;
