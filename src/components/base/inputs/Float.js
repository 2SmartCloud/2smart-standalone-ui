import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import BaseInput from './Base.js';

class FloatInput extends PureComponent {
    handleChange = (value) => {
        const isValueValid = this.validate(value);

        if (isValueValid) {
            this.props.onChange(value);
        }

        return;
    }

    validate(value) {
        return /^-?\d*[.]?\d*$/.test(value);
    }

    render() {
        const { value, autoFocus, maxLenght } = this.props;

        return (
            <BaseInput
                {...this.props}
                type='tel'
                value={value}
                onChange={this.handleChange}
                autoFocus={autoFocus}
                withArrows
                maxLenght={maxLenght}
                darkThemeSupport
            />
        );
    }
}

FloatInput.propTypes = {
    value     : PropTypes.oneOfType([ PropTypes.string, PropTypes.number ]).isRequired,
    onChange  : PropTypes.func,
    autoFocus : PropTypes.bool,
    maxLenght : PropTypes.string
};

FloatInput.defaultProps = {
    onChange  : () => {},
    autoFocus : false,
    maxLenght : '15'
};

export default FloatInput;
