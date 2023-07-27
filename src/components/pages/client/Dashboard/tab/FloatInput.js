import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import Float from '../../../../base/inputs/Float';
import ErrorMessage from './ErrorMessage';
import styles from './FloatInput.less';

class FloatInput extends PureComponent {
    render() {
        const { errorMessage, onChange, value } = this.props;

        return (
            <div className={styles.FloatInput}>
                <Float
                    {...this.props}
                    value={value}
                    isInvalid={errorMessage}
                    onChange={onChange}
                    maximumHarcodingIOS
                />
                <ErrorMessage message={errorMessage} />
            </div>
        );
    }
}

FloatInput.propTypes = {
    errorMessage : PropTypes.string,
    onChange     : PropTypes.func.isRequired,
    value        : PropTypes.oneOfType([ PropTypes.number, PropTypes.string ])
};

FloatInput.defaultProps = {
    value        : undefined,
    errorMessage : ''
};

export default FloatInput;
