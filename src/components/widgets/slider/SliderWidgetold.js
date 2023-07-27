import React, { PureComponent, Fragment } from 'react';
import PropTypes from 'prop-types';
import LIVR from 'livr';
import { withStyles } from '@material-ui/core/styles';
import Slider from '@material-ui/core/Slider';
import getPropertyUnit from '../../../utils/getPropertyUnit';
import CriticalValue from '../../base/CriticalValue';
import ProcessingIndicator from '../../base/ProcessingIndicator';
import CustomThumb from './etc/CustomThumb';
import styles from './SliderWidget.less';

const validator = new LIVR.Validator({
    value : [ 'not_empty', 'decimal' ]
});

const PrettoSlider = withStyles({
    root : {
        color      : '#04c0b2',
        height     : 8,
        transition : 'all 0.3s',
        padding    : '21px 0 10px'
    },
    disabled : {},
    thumb    : {
        height                     : '20px !important',
        width                      : '20px !important',
        backgroundColor            : '#FFF',
        border                     : '2px solid currentColor',
        marginTop                  : '-5px !important',
        marginLeft                 : '-10px !important',
        '&:hover,&:active,&:focus' : {
            boxShadow : '0px 0px 0px 2px var(--color_picker_knob_shadow)'
        }
    },
    active     : {},
    valueLabel : {
        left       : '-50% !important',
        transform  : 'none !important',
        top        : -22,
        background : 'rgba(4,192,178, 0.1)',
        '& *'      : {
            color        : '#000',
            transform    : 'rotate(0)',
            height       : '20px',
            minWidth     : '30px',
            width        : 'auto',
            padding      : '0 5px',
            lineHeight   : '20px',
            borderRadius : '4px',
            textAlign    : 'center'
        },
        '& > span' : {
            background : 'rgba(4,192,178, 0.3)'

        },
        '& span' : {
            padding : '0 1px !important'
        }
    },
    track : {
        height       : 8,
        borderRadius : 4
    },
    rail : {
        height       : 8,
        borderRadius : 4
    }
})(Slider);

class SliderWidget extends PureComponent {
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

        this.setValue(value, true);
    }

    handleChangeCommitted = (e, value) => {
        if (e.key) return;

        this.publishValue(value);
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
        const { minValue, maxValue } = this.props.advanced;
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
        const { unit, advanced: { step, minValue, maxValue }, isEditMode, isLocked } = this.props;
        const { value } = this.state;

        return (
            <Fragment>
                <PrettoSlider
                    value={value}
                    step={step}
                    min={minValue}
                    max={maxValue}
                    disabled={isLocked || isEditMode}
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

    render() {
        const { isProcessing } = this.props;

        return (
            <div className={styles.SliderWidget}>
                {
                    isProcessing
                        ? <ProcessingIndicator size={35} />
                        : this.renderSlider()
                }
            </div>
        );
    }
}


SliderWidget.propTypes = {
    value        : PropTypes.oneOfType([ PropTypes.string, PropTypes.number ]),
    unit         : PropTypes.string.isRequired,
    isEditMode   : PropTypes.bool.isRequired,
    isLocked     : PropTypes.bool,
    isProcessing : PropTypes.bool,
    advanced     : PropTypes.shape({
        minValue : PropTypes.oneOfType([ PropTypes.string, PropTypes.number ]),
        maxValue : PropTypes.oneOfType([ PropTypes.string, PropTypes.number ]),
        step     : PropTypes.oneOfType([ PropTypes.string, PropTypes.number ])
    }).isRequired,
    onSetValue : PropTypes.func.isRequired
};

SliderWidget.defaultProps = {
    value        : 0,
    isLocked     : false,
    isProcessing : false
};

export default SliderWidget;
