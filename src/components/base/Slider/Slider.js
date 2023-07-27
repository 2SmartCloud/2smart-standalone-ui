import React, { PureComponent, Fragment } from 'react';
import PropTypes from 'prop-types';
import LIVR from 'livr';
import { withStyles } from '@material-ui/core/styles';
import BaseSlider from '@material-ui/core/Slider';
import classnames from 'classnames/bind';
import CriticalValue from '../CriticalValue';
import ProcessingIndicator from '../ProcessingIndicator';
import getPropertyUnit  from '../../../utils/getPropertyUnit';
import CustomThumb from './etc/CustomThumb';
import { sliderStyles } from './SliderStyles';
import styles from './Slider.less';

const cn = classnames.bind(styles);

const validator = new LIVR.Validator({
    value : [ 'not_empty', 'decimal' ]
});

const PrettoSlider = withStyles(sliderStyles)(BaseSlider);

class Slider extends PureComponent {
    state = {
        value : this.props.value
    }

    componentDidUpdate(prevProps) {
        const { value } = this.props;

        if (value !== prevProps.value) {
            this.setValue(value);
        }
    }

    handleSliderChange = (e, value) => {
        if (e.key) return;
        this.setValue(value);
    }

    handleChangeCommitted = (e, value) => {
        if (e.key) return;
        this.publishValue(value);
        this.setValue(this.props.value);
    }

    setValue = value => {
        this.setState({
            value
        });
    }

    publishValue = (value) => {
        const { onSetValue } = this.props;

        onSetValue(value);
    }

    valueLabelFormatter = sliderValue => {
        const { advanced: { minValue, maxValue } } = this.props;
        const { value } = this.state;
        const isValid = this.validateValue();

        if (!isValid) return '-';
        if (value > maxValue) return value;
        if (value < minValue) return value;

        return sliderValue;
    }

    validateValue = () => {
        const { value } = this.props;
        let isValid = false;

        isValid = validator.validate({ value });

        return isValid;
    }

    renderSlider = () => {
        const { unit, advanced: { step, minValue, maxValue }, isEditMode, isLocked, isDisabled } = this.props;
        const { value } = this.state;

        return (
            <Fragment>
                <PrettoSlider
                    value={value}
                    step={step}
                    min={minValue}
                    max={maxValue}
                    disabled={isLocked || isEditMode || isDisabled}
                    onChange={this.handleSliderChange}
                    onChangeCommitted={this.handleChangeCommitted}
                    valueLabelFormat={this.valueLabelFormatter}
                    valueLabelDisplay='on'
                    ThumbComponent={CustomThumb}
                    classes={{
                        disabled   : styles.disabled,
                        valueLabel : styles.valueLabel
                    }}
                />
                <div className={styles.options}>
                    <div className={styles.minValueWrapper}>
                        <CriticalValue value={minValue} maxWidth='calc(80% - 5px)' />
                        <div style={{ width: '5px' }} />
                        <CriticalValue value={getPropertyUnit(unit)} maxWidth='20%' />
                    </div>
                    <div className={styles.maxValueWrapper}>
                        <CriticalValue value={maxValue}  maxWidth='calc(80% - 5px)' />
                        <div style={{ width: '5px' }} />
                        <CriticalValue value={getPropertyUnit(unit)} maxWidth='20%' />
                    </div>
                </div>
            </Fragment>
        );
    }

    renderLoader = () => {
        return (
            <ProcessingIndicator size={35} />
        );
    }

    render() {
        const { isProcessing, className } = this.props;
        const SliderCN = cn('Slider', className);

        return (
            <div className={SliderCN}>
                {
                    isProcessing
                        ? this.renderLoader()
                        : this.renderSlider()
                }
            </div>
        );
    }
}


Slider.propTypes = {
    className    : PropTypes.string,
    value        : PropTypes.oneOfType([ PropTypes.string, PropTypes.number ]),
    unit         : PropTypes.string.isRequired,
    isEditMode   : PropTypes.bool.isRequired,
    isLocked     : PropTypes.bool,
    isDisabled   : PropTypes.bool,
    isProcessing : PropTypes.bool,
    advanced     : PropTypes.shape({
        minValue : PropTypes.oneOfType([ PropTypes.string, PropTypes.number ]),
        maxValue : PropTypes.oneOfType([ PropTypes.string, PropTypes.number ]),
        step     : PropTypes.oneOfType([ PropTypes.string, PropTypes.number ])
    }).isRequired,
    onSetValue : PropTypes.func.isRequired
};

Slider.defaultProps = {
    className    : null,
    value        : 0,
    isLocked     : false,
    isDisabled   : false,
    isProcessing : false
};

export default Slider;
