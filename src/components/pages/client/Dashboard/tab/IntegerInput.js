import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import Input from '../../../../base/inputs/Integer';
import ErrorMessage from './ErrorMessage';
import styles from './IntegerInput.less';

class IntegerInput extends PureComponent {
    render() {
        const { errorMessage, onChange, value } = this.props;

        return (
            <div className={styles.IntegerInput}>
                <Input
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

IntegerInput.propTypes = {
    errorMessage : PropTypes.string,
    onChange     : PropTypes.func.isRequired,
    value        : PropTypes.oneOfType([ PropTypes.number, PropTypes.string ])
};

IntegerInput.defaultProps = {
    value        : undefined,
    errorMessage : ''
};

export default IntegerInput;
