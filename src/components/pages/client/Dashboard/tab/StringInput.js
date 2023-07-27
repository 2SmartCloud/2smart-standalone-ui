import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import Input from '../../../../base/inputs/String';
import ErrorMessage from './ErrorMessage';
import styles from './IntegerInput.less';

class StringInput extends PureComponent {
    static propTypes = {
        errorMessage : PropTypes.string,
        onChange     : PropTypes.func.isRequired,
        value        : PropTypes.oneOfType([ PropTypes.number, PropTypes.string ])
    }

    static defaultProps = {
        value        : undefined,
        errorMessage : ''
    }

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

export default StringInput;
