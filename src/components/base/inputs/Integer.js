import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import BaseInput from './Base.js';

class IntegerInput extends PureComponent {
    handleInputChange = (value) => {
        const isValueValid = this.validate(value);

        if (isValueValid) {
            this.props.onChange(value);
        }
    }

    validate(value) {
        const { positive } = this.props;

        return positive ? /^\d*$/.test(value) : /^-?\d*$/.test(value);
    }

    render() {
        const { value, autoFocus, isInvalid, maxLength } = this.props;

        return (
            <BaseInput
                {...this.props}
                type='tel'
                value={value}
                onChange={this.handleInputChange}
                autoFocus={autoFocus}
                formnovalidate
                withArrows
                maxLength={maxLength}
                isInvalid={isInvalid}
                darkThemeSupport
            />
        );
    }
}

IntegerInput.propTypes = {
    value       : PropTypes.oneOfType([ PropTypes.number, PropTypes.string ]).isRequired,
    onChange    : PropTypes.func,
    autoFocus   : PropTypes.bool,
    transparent : PropTypes.bool,
    positive    : PropTypes.bool,
    isInvalid   : PropTypes.bool,
    maxLength   : PropTypes.string
};

IntegerInput.defaultProps = {
    onChange    : () => {},
    autoFocus   : false,
    transparent : false,
    positive    : false,
    isInvalid   : false,
    maxLength   : '15'
};

export default IntegerInput;
