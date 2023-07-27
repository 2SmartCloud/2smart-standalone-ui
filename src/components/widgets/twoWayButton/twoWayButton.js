import React, { PureComponent } from 'react';
import PropTypes                from 'prop-types';

import Button from '../../base/Button';

import styles from './twoWayButton.less';

class TwoWayButtonWidget extends PureComponent {
    static propTypes = {
        value        : PropTypes.string,
        isSettable   : PropTypes.bool.isRequired,
        isEditMode   : PropTypes.bool.isRequired,
        isLocked     : PropTypes.bool,
        isProcessing : PropTypes.bool,
        onSetValue   : PropTypes.func.isRequired
    }

    static defaultProps = {
        value        : '',
        isProcessing : false,
        isLocked     : false
    }

    handleSetValue = () => {
        const { onSetValue, isProcessing, isSettable, isEditMode, value } = this.props;

        if (isProcessing || !isSettable || isEditMode) return;

        onSetValue(!this.getValueChecked(value));
    }

    getValueChecked = value =>  value
        ? !(value === 'false' || value === '0' || value === '—' || value === '-')
        : value;


    render() {
        const {
            value,
            isSettable,
            isEditMode,
            isLocked,
            isProcessing
        } = this.props;
        const checkedValue = this.getValueChecked(value);
        const btnColor = checkedValue ? 'action' : '';

        return (
            <Button
                className  = {styles.btn}
                isFetching = {isProcessing}
                color      = {btnColor}
                onClick    = {this.handleSetValue}
                isNegative = {!checkedValue}
                isDisabled = {isEditMode || !isSettable || isLocked}
            >{checkedValue ? 'ON' : 'OFF'}</Button>
        );
    }
}

export default TwoWayButtonWidget;
