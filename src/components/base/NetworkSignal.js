import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames/bind';
import Tooltip from '@material-ui/core/Tooltip';
import { SignalWifi0Bar, SignalWifi1Bar, SignalWifi2Bar, SignalWifi3Bar, SignalWifi4Bar, SignalWifiOff } from '@material-ui/icons';
import { networkSignalValidator } from '../../utils/validation/telemetry';
import { requiredValidator } from '../../utils/validation/main';
import getPropertyUnit from '../../utils/getPropertyUnit';

import styles from './NetworkSignal.less';

const cx = classnames.bind(styles);

class NetworkSignal extends PureComponent {
    isValueExist() {
        const { value } = this.props;
        const res = requiredValidator.validate({ value });

        return !!res;
    }

    validateValue() {
        const res = networkSignalValidator.validate({ value: this.props.value });

        return !!res;
    }

    renderSignal() {
        const { value } = this.props;

        switch (true) {
            case (value <= 5):
                return <SignalWifi0Bar />;
            case (value <= 30):
                return <SignalWifi1Bar />;
            case (value <= 60):
                return <SignalWifi2Bar />;
            case (value <= 95):
                return <SignalWifi3Bar />;
            default:
                return <SignalWifi4Bar />;
        }
    }

    renderValue() {
        const { value, unit } = this.props;

        return (
            this.validateValue() ?
                <Tooltip title={`${value} ${getPropertyUnit(unit)}`}>
                    {this.renderSignal()}
                </Tooltip> :
                <Tooltip title='Unknown value'>
                    <SignalWifiOff className={styles.invalidSignalValue} />
                </Tooltip>

        );
    }

    render() {
        const { isDisable } = this.props;
        const networkSignalCN = cx('NetworkSignal', {
            isDisable
        });


        return (
            <div className={networkSignalCN}>
                {
                    this.isValueExist() ?
                        this.renderValue() :
                        null
                }
            </div>
        );
    }
}

NetworkSignal.propTypes = {
    value     : PropTypes.string,
    unit      : PropTypes.string,
    isDisable : PropTypes.bool
};

NetworkSignal.defaultProps = {
    value     : '',
    unit      : '',
    isDisable : false
};

export default NetworkSignal;
