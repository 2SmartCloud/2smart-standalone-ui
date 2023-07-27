import React, { PureComponent, Fragment } from 'react';
import PropTypes                          from 'prop-types';
import LIVR                               from 'livr';
import classnames                         from 'classnames/bind';
import { getDecimalPartLength }           from '../../../utils/decimalPart';
import getPropertyUnit                    from '../../../utils/getPropertyUnit';
import gracefulDecrement                  from '../../../utils/gracefulDecrement';
import gracefulIncrement                  from '../../../utils/gracefulIncrement';
import CriticalValue                      from '../../base/CriticalValue';
import ProcessingIndicator                from '../../base/ProcessingIndicator';
import styles                             from './ThermostatWidget.less';

const validator = new LIVR.Validator({
    value : [ 'decimal', 'required' ]
});

const cn = classnames.bind(styles);

class ThermostatWidget extends PureComponent {
    constructor(props) {
        super(props);

        this.updateCount = 0;
    }

    state = {
        interval       : null,
        value          : this.props.value,
        ripplingButton : null
    }

    componentDidUpdate(prevProps) {
        const { value } = this.props;

        if (value.toString() !== prevProps.value.toString()) {
            this.setState({ value, ripplingButton: null });
        }
    }

    handleMouseDown =  (direction) => {
        this.updateWithInterval(direction);
    }

    handleMouseLeave = () => {
        this.clearInterval();
        const { value: initialValue } = this.props;
        const { value } = this.state;

        if (`${value}` !== `${initialValue}`) {
            this.publishValue(value);
        }
    }

    handleMouseUp = () => {
        this.clearInterval();
        this.publishValue();
    }

    getSafeValue = () => {
        const { value } = this.state;
        const isValueValid = this.validateValue(value);

        return isValueValid ? value : 0;
    }

    updateWithInterval(direction, intervalSpeed = 350, prevInterval) {
        clearInterval(prevInterval);

        this.updateValue(direction);

        const interval = setInterval(() => {
            if      (this.updateCount === 4)  return this.updateWithInterval(direction, 200, interval);
            else if (this.updateCount === 15) return this.updateWithInterval(direction, 130, interval);

            this.updateValue(direction);
        }, intervalSpeed);

        this.setState({ interval, ripplingButton: direction });
    }

    updateValue = (direction) => {
        this.updateCount += 1;

        if (direction === 'decrease') {
            const value = this.decreaseValue();

            this.setState({
                value
            });

            return value;
        }

        if (direction === 'increase') {
            const value = this.increaseValue();

            this.setState({
                value
            });

            return value;
        }
    }

    decreaseValue = () => {
        const { advanced: { step }, dataType } = this.props;
        const value = this.getSafeValue();
        let stepFactor = 1;

        if (this.updateCount > 25) stepFactor = 2;
        if (this.updateCount > 40) stepFactor = 3;

        const stepToUpdate = Math.round(step * stepFactor * 100) / 100;

        if (dataType === 'float') {
            return gracefulDecrement(value, stepToUpdate);
        }

        return +value - stepToUpdate;
    }

    increaseValue = () => {
        const { advanced: { step }, dataType } = this.props;
        const value = this.getSafeValue();
        let stepFactor = 1;

        if (this.updateCount > 25) stepFactor = 2;
        if (this.updateCount > 40) stepFactor = 3;

        const stepToUpdate = Math.round(step * stepFactor * 100) / 100;

        if (dataType === 'float') {
            return gracefulIncrement(value, stepToUpdate);
        }

        return +value + stepToUpdate;
    }

    clearInterval = () => {
        const { interval } = this.state;

        clearInterval(interval);
    }

    publishValue = (value = this.state.value) => {
        const { onSetValue } = this.props;

        onSetValue(value, true);
        this.updateCount = 0;
    }

    validateValue = value => {
        return validator.validate({ value });
    }

    roundValue = () => {
        const { advanced: { step }, value: initialValue } = this.props;
        const { value } = this.state;
        const decimalPartLengthValue = getDecimalPartLength(initialValue);
        const decimalPartLengthStep = getDecimalPartLength(step);
        const decimalQuantity = decimalPartLengthStep > decimalPartLengthValue ?
            decimalPartLengthStep :
            decimalPartLengthValue;
        const safeDecimalQuantity = Math.min(decimalQuantity, 20);
        const roundedValue = parseFloat(value, 10).toFixed(safeDecimalQuantity);

        return roundedValue;
    }

    renderThermostat = () => {
        const { unit, isEditMode, isLocked } = this.props;
        const { ripplingButton } = this.state;
        const isValueValid = this.validateValue(this.state.value);

        const value = isValueValid ? this.roundValue() : '-';
        const valueUnit = getPropertyUnit(unit);

        return (
            <Fragment>
                <div
                    className={cn('decreaseButton', {
                        ripple     : ripplingButton === 'decrease',
                        processing : isLocked || isEditMode
                    })}
                    onTouchStart={this.handleMouseDown.bind(this, 'decrease')}
                    onTouchEnd={this.handleMouseUp}
                    onMouseDown={this.handleMouseDown.bind(this, 'decrease')}
                    onMouseUp={this.handleMouseUp}
                    onMouseLeave={this.handleMouseLeave}
                >
                    <svg
                        style={{
                            enableBackground : 'new 0 0 512 512'
                        }}
                        viewBox='0 0 512 512'
                        className={styles.minusIcon}
                    >
                        <path
                            d='M417.4,224H94.6C77.7,224,64,238.3,64,256c0,17.7,13.7,32,30.6,32h322.8c16.9,0,30.6-14.3,30.6-32  C448,238.3,434.3,224,417.4,224z'
                        />
                    </svg>
                </div>
                <div className={styles.valueWrapper}>
                    <CriticalValue value={value} maxWidth='100%' />
                </div>
                {
                    valueUnit ?
                        <div className={styles.unitWrapper}>
                            <CriticalValue value={valueUnit} maxWidth='100%' />
                        </div>
                        : null
                }
                <div
                    className={cn('increaseButton', {
                        ripple     : ripplingButton === 'increase',
                        processing : isLocked || isEditMode
                    })}
                    onTouchStart={this.handleMouseDown.bind(this, 'increase')}
                    onTouchEnd={this.handleMouseUp}
                    onMouseDown={this.handleMouseDown.bind(this, 'increase')}
                    onMouseUp={this.handleMouseUp}
                    onMouseLeave={this.handleMouseLeave}
                >
                    <svg
                        style={{ enableBbackground: 'new 0 0 32 32' }}
                        viewBox='0 0 32 32'
                        className={styles.plusIcon}
                    >
                        <path
                            d='M28,14H18V4c0-1.104-0.896-2-2-2s-2,0.896-2,2v10H4c-1.104,0-2,0.896-2,2s0.896,2,2,2h10v10c0,1.104,0.896,2,2,2  s2-0.896,2-2V18h10c1.104,0,2-0.896,2-2S29.104,14,28,14z'
                        />
                    </svg>
                </div>
            </Fragment>
        );
    }

    render() {
        const { isEditMode, isLocked, isProcessing } = this.props;

        return (
            <div className={styles.Thermostat}>
                <div className={styles.disabler} style={{ display: isLocked || isEditMode ? 'block' : 'none' }} />
                {
                    isProcessing
                        ? <ProcessingIndicator size={35} />
                        : this.renderThermostat()
                }
            </div>
        );
    }
}

ThermostatWidget.propTypes = {
    value    : PropTypes.oneOfType([ PropTypes.string, PropTypes.number ]),
    unit     : PropTypes.string,
    dataType : PropTypes.string,
    advanced : PropTypes.shape({
        step : PropTypes.oneOfType([ PropTypes.string, PropTypes.number ])
    }).isRequired,
    isEditMode   : PropTypes.bool.isRequired,
    isLocked     : PropTypes.bool,
    isProcessing : PropTypes.bool,
    onSetValue   : PropTypes.func.isRequired
};

ThermostatWidget.defaultProps = {
    value        : '-',
    unit         : '',
    dataType     : '',
    /*     advanced : {
        step : ''
    }, */
    isLocked     : false,
    isProcessing : false
};

export default ThermostatWidget;
