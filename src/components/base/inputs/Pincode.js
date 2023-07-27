import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import EyeIcon from '../icons/Eye';
import BaseInput from './Base.js';
import styles from './Pincode.less';

class PincodeInput extends PureComponent {
    state = {
        type : 'password'
    }

    handleIconClick = () => {
        const { type } = this.state;

        if (type === 'password') this.setState({ type: 'text' });
        if (type === 'text') this.setState({ type: 'password' });
    }

    handleInputChange = (value) => {
        return /^\d*$/.test(value) ? this.props.onChange(value) : null;
    }

    render() {
        const { value, autoFocus } = this.props;
        const { type } = this.state;

        return (
            <div className={styles.PincodeInput}>
                <BaseInput
                    {...this.props}
                    type={type}
                    value={value}
                    onChange={this.handleInputChange}
                    autoFocus={autoFocus}
                    className='form'
                    maxLength='6'
                />
                <div className={styles.iconWrapper} onClick={this.handleIconClick}>
                    <EyeIcon isHidden={type === 'text'}  />
                </div>
            </div>
        );
    }
}

PincodeInput.propTypes = {
    value     : PropTypes.string.isRequired,
    onChange  : PropTypes.func,
    autoFocus : PropTypes.bool
};

PincodeInput.defaultProps = {
    onChange  : () => {},
    autoFocus : false
};

export default PincodeInput;
