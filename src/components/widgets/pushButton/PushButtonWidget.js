import React, { PureComponent } from 'react';
import PropTypes                from 'prop-types';
import PushButton               from '../../base/PushButton';
import styles                   from './PushButtonWidget.less';

class PushButtonleWidget extends PureComponent {
    static propTypes = {
        isSettable   : PropTypes.bool.isRequired,
        isEditMode   : PropTypes.bool.isRequired,
        isLocked     : PropTypes.bool,
        isProcessing : PropTypes.bool,
        onSetValue   : PropTypes.func.isRequired
    }

    static defaultProps = {
        isLocked     : false,
        isProcessing : false
    }

    handleClick = () => {
        const { onSetValue } = this.props;

        onSetValue(true);
    }

    render() {
        const {
            isSettable,
            isEditMode,
            isLocked,
            isProcessing
        } = this.props;

        return (
            <>
                <PushButton
                    className    = {styles.PushButtonWidget}
                    onClick      = {this.handleClick}
                    isProcessing = {isProcessing}
                    isDisable    = {!(isSettable && !isEditMode && !isLocked)}
                />
            </>
        );
    }
}

export default PushButtonleWidget;
