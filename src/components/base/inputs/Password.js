import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import EyeIcon from '../icons/Eye';
import BaseInput from './Base.js';
import styles from './Password.less';

class PasswordInput extends PureComponent {
    state = {
        type : 'password'
    }

    handleIconClick = () => {
        const { type } = this.state;

        if (type === 'password') this.setState({ type: 'text' });
        if (type === 'text') this.setState({ type: 'password' });
    }

    render() {
        const { type } = this.state;

        return (
            <div className={styles.PasswordInput}>
                <BaseInput
                    {...this.props}
                    type={type}
                    className='form'
                />
                <div className={styles.iconWrapper} onClick={this.handleIconClick}>
                    <EyeIcon isHidden={type === 'text'}  />
                </div>
            </div>
        );
    }
}

PasswordInput.propTypes = {
    value     : PropTypes.string.isRequired,
    onChange  : PropTypes.func,
    autoFocus : PropTypes.bool
};

PasswordInput.defaultProps = {
    onChange  : () => {},
    autoFocus : false
};

export default PasswordInput;
