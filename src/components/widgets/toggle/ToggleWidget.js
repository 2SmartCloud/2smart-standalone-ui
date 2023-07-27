import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import GenericToggle from '../../base/GenericToggle';

import styles from './ToggleWidget.less';

class ToggleWidget extends PureComponent {
    static propTypes = {
        value        : PropTypes.string,
        unit         : PropTypes.string,
        isSettable   : PropTypes.bool.isRequired,
        isEditMode   : PropTypes.bool.isRequired,
        isLocked     : PropTypes.bool,
        isProcessing : PropTypes.bool,
        onSetValue   : PropTypes.func.isRequired
    }

    static defaultProps = {
        value        : '',
        unit         : '',
        isLocked     : false,
        isProcessing : false
    }

    handleSetValue = ({ value }) => {
        const { onSetValue } = this.props;

        onSetValue(value, false, 'state');
    }

    getValueChecked = value =>  value
        ? !(value === 'false' || value === '0' || value === '—' || value === '-')
        : value;


    render() {
        const {
            value,
            unit,
            isSettable,
            isEditMode,
            isLocked,
            isProcessing
        } = this.props;
        const isValueChecked = this.getValueChecked(value);

        return (
            <div className={styles.ToggleWidget}>
                <GenericToggle
                    value        = {isValueChecked}
                    unit         = {unit}
                    isSettable   = {isSettable && !isEditMode && !isLocked}
                    isProcessing = {isProcessing}
                    onToggle     = {this.handleSetValue}
                    className    = {styles.toggleWithUnit}
                />
            </div>
        );
    }
}

export default ToggleWidget;
