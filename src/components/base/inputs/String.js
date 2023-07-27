import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import BaseInput from './Base.js';

class StringInput extends PureComponent {
    render() {
        const { value, onChange, onBlur, autoFocus } = this.props;

        return (
            <BaseInput
                {...this.props}
                type='text'
                value={value}
                onChange={onChange}
                onBlur={onBlur}
                autoFocus={autoFocus}
            />
        );
    }
}

StringInput.propTypes = {
    value     : PropTypes.string,
    onChange  : PropTypes.func,
    onBlur    : PropTypes.func,
    autoFocus : PropTypes.bool
};

StringInput.defaultProps = {
    value     : '',
    onChange  : () => {},
    onBlur    : undefined,
    autoFocus : false
};

export default StringInput;
