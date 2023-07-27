import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames/bind';
import { Done } from '@material-ui/icons';
import CircularProgress from '@material-ui/core/CircularProgress';
import FloatInput from '../../base/inputs/Float';
import StringInput from '../../base/inputs/String';
import IntegerInput from '../../base/inputs/Integer';
import CriticalValue from '../../base/CriticalValue';
import styles from './Form.less';

const cn = classnames.bind(styles);

class Form extends PureComponent {
    componentWillReceiveProps(nextProps) {
        const { isProcessing } = this.props;

        if (isProcessing && !nextProps.isProcessing) {
            const input = document.getElementById('control-input');

            setTimeout(() => input.focus(), 0);
        }
    }

    handleFormSubmit = (e) => {
        e.preventDefault();
        e.stopPropagation();
        this.props.onSubmit();
    }

    handleSubmitButtonClick = (e) => {
        e.stopPropagation();
    }

    renderButton = () => {
        const { isProcessing, spinnerSize } = this.props;

        return (
            isProcessing ?
                <div className={styles.progressWrapper}><CircularProgress size={spinnerSize} thickness={6} color='inherit' /></div> :
                <button type='submit' className={styles.submit} onClick={this.handleSubmitButtonClick}>
                    <Done />
                </button>
        );
    }

    renderInput = () => {
        const { type,
            isError,
            inputValue,
            onInputChange,
            isTransparent,
            inputClassName,
            isProcessing,
            darkThemeSupport } = this.props;

        switch (type) {
            case 'string':
                return (
                    <StringInput
                        darkThemeSupport={darkThemeSupport}
                        value={inputValue}
                        onChange={onInputChange}
                        autoFocus
                        isInvalid={isError}
                        transparent={isTransparent}
                        isDisabled={isProcessing}
                        ref={node => this.input = node}
                        id='control-input'
                        className={inputClassName}
                    />
                );
            case 'integer':
                return (
                    <IntegerInput
                        darkThemeSupport={darkThemeSupport}
                        value={inputValue}
                        onChange={onInputChange}
                        autoFocus
                        isInvalid={isError}
                        isDisabled={isProcessing}
                        transparent={isTransparent}
                        ref={node => this.input = node}
                        id='control-input'
                        className={inputClassName}
                    />
                );
            case 'float':
                return (
                    <FloatInput
                        darkThemeSupport={darkThemeSupport}
                        value={inputValue}
                        onChange={onInputChange}
                        autoFocus
                        isDisabled={isProcessing}
                        isInvalid={isError}
                        transparent={isTransparent}
                        ref={node => this.input = node}
                        id='control-input'
                        className={inputClassName}
                    />
                );
            default:
                return null;
        }
    }

    render() {
        const { unit, transparent, hideSubmitButton, formClassName } = this.props;
        const FormCN = cn('Form', { transparent }, { [formClassName]: formClassName });

        return (
            <form className={FormCN} onSubmit={this.handleFormSubmit} noValidate>
                <div className={styles.inputWrapper}>
                    {this.renderInput()}
                </div>
                <div className={styles.unitWrapper}>
                    <CriticalValue value={unit} maxWidth='100%' />
                </div>
                {
                    hideSubmitButton ?
                        null :
                        this.renderButton()
                }
            </form>
        );
    }
}

Form.propTypes = {
    onSubmit         : PropTypes.func.isRequired,
    unit             : PropTypes.string,
    transparent      : PropTypes.bool,
    hideSubmitButton : PropTypes.bool,
    isProcessing     : PropTypes.bool,
    type             : PropTypes.oneOf([ 'float', 'integer', 'string' ]).isRequired,
    isError          : PropTypes.bool.isRequired,
    inputValue       : PropTypes.oneOfType([ PropTypes.string, PropTypes.number ]).isRequired,
    onInputChange    : PropTypes.func.isRequired,
    isTransparent    : PropTypes.bool.isRequired,
    inputClassName   : PropTypes.string,
    formClassName    : PropTypes.string,
    spinnerSize      : PropTypes.number,
    darkThemeSupport : PropTypes.bool
};

Form.defaultProps = {
    unit             : '',
    transparent      : false,
    hideSubmitButton : false,
    isProcessing     : false,
    inputClassName   : '',
    formClassName    : '',
    spinnerSize      : 20,
    darkThemeSupport : false
};

export default Form;
