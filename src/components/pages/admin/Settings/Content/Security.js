import React, { PureComponent } from 'react';
import PropTypes                from 'prop-types';
import { connect }              from 'react-redux';
import classnames               from 'classnames/bind';
import * as UserActions         from '../../../../../actions/user';
import * as InterfaceActions    from '../../../../../actions/interface';
import Switch                   from '../../../../base/Switch';
import Input                    from '../../../../base/inputs/Pincode';
import Button                   from '../../../../base/Button';
import meta                     from '../../../../base/toast/meta';
import BaseContentWrapper       from './BaseContentWrapper/';
import styles                   from './Security.less';

const cx = classnames.bind(styles);

class SecurityTabContent extends PureComponent {
    state = {
        pin        : '',
        pinConfirm : ''
    }

    componentWillUnmount() {
        const { clearPincodeValidationError } = this.props;

        clearPincodeValidationError();
    }

    handleInputChange = (field, value) => {
        this.setState({
            [field] : value
        });
    }

    handleSwitchChange = (key, value) => {
        const { updateSetting, isPincodeExists, callValErrNotification } = this.props;

        if (!isPincodeExists) {
            return callValErrNotification({
                meta    : meta.PIN_ERROR,
                title   : 'Error',
                message : 'Please, enter the PIN first'
            });
        }

        updateSetting(key, !value);
    }

    handleFormSubmit = async (e) => {
        e.preventDefault();
        const { pin, pinConfirm } = this.state;
        const { updatePin } = this.props;

        await updatePin(pin, pinConfirm);
        const { error } = this.props;

        if (!Object.entries(error).length) {
            this.setState({
                pin        : '',
                pinConfirm : ''
            });
        }
    }

    handleInputFocus = () => {
        const { clearPincodeValidationError } = this.props;

        clearPincodeValidationError();
    }

    getValidationError = (fieldName) => {
        const { error } = this.props;
        const errorCode = error[fieldName];
        const errorMessage = mapError[fieldName][errorCode];

        return errorMessage;
    }

    renderFirstTab=() => {
        const {
            isSecureModeEnabled,
            isAutoBlockingEnabled,
            isPincodeExists
        } = this.props;

        const isAutoBlockDisabled = isAutoBlockingEnabled.isUpdating || !isSecureModeEnabled.value;

        return (
            <div className={styles.switchesContainer}>
                <h2
                    className={cx(styles.formTitle, {
                        withoutSubtitle : isPincodeExists
                    })}
                >
                    Activate parent control
                </h2>
                { !isPincodeExists
                    ? (
                        <h3 className={styles.formSubtitle}>
                            Set the code before turn on the security mode
                        </h3>
                    ) : null
                }
                <div className={styles.securitySwitchContainer}>
                    <span className={styles.label}>Security mode</span>
                    <Switch
                        checked      = {isSecureModeEnabled.value}
                        isProcessing = {isSecureModeEnabled.isUpdating}
                        disabled     = {isSecureModeEnabled.isUpdating}
                        onChange     = {this.handleSwitchChange.bind(this, 'isSecureModeEnabled', isSecureModeEnabled.value)}
                    />
                </div>
                {
                    <div className={styles.autoBlockSwitchContainer}>
                        <span className={styles.label}>Screen Auto-block mode</span>
                        <Switch
                            checked      = {isAutoBlockingEnabled.value}
                            isProcessing = {isAutoBlockingEnabled.isUpdating}
                            disabled     = {isAutoBlockDisabled}
                            onChange     = {this.handleSwitchChange.bind(this, 'isAutoBlockingEnabled', isAutoBlockingEnabled.value)}
                        />
                    </div>
                }
            </div>
        );
    }

    renderSecondTab = () => {
        const { pin, pinConfirm } = this.state;
        const { isPincodeUpdating } = this.props;
        const pinErrorMessage = this.getValidationError('data/pin');
        const pinConfirmErrorMessage = this.getValidationError('data/pinConfirm');
        const isButtonDidasble = !pin && !pinConfirm;

        return (
            <form
                onSubmit = {this.handleFormSubmit}
                style    = {{ width: '100%', height: '100%' }}
            >
                <div className={styles.inputWrapper}>
                    <Input
                        value       = {pin}
                        onChange    = {this.handleInputChange.bind(this, 'pin')}
                        darkThemeSupport
                        onFocus     = {this.handleInputFocus}
                        isInvalid   = {!!pinErrorMessage}
                        placeholder = 'Enter new PIN'
                        maximumHarcodingIOS
                    />
                </div>
                <div className={styles.errorMessage}>
                    {pinErrorMessage}
                </div>
                <div className={styles.inputWrapper} style={{ marginBottom: 0 }}>
                    <Input
                        value       = {pinConfirm}
                        onChange    = {this.handleInputChange.bind(this, 'pinConfirm')}
                        darkThemeSupport
                        onFocus     = {this.handleInputFocus}
                        isInvalid   = {!pinErrorMessage && pinConfirmErrorMessage}
                        placeholder = 'Confirm new PIN'
                        maximumHarcodingIOS
                    />
                </div>
                <div className={styles.errorMessage}>
                    {!pinErrorMessage && pinConfirmErrorMessage}
                </div>
                <div className={styles.submitButtonWrapper}>
                    <Button
                        text       = 'Save'
                        type       = 'submit'
                        isDisabled = {isButtonDidasble}
                        className  = {styles.submitButton}
                        isFetching = {isPincodeUpdating}
                    />
                </div>
            </form>
        );
    }

    render() {
        const { isPincodeExists } = this.props;

        return (
            <BaseContentWrapper
                blocks={
                    [ {
                        renderContent : this.renderFirstTab
                    },
                    {
                        title         : isPincodeExists ? 'Change the PIN' : 'Enter PIN',
                        subtitle      : 'Set code to protect your screen',
                        renderContent : this.renderSecondTab
                    }  ]
                }
            />
        );
    }
}

const mapError = {
    'data/pin' : {
        TOO_SHORT        : 'PIN must contain 6 symbols',
        REQUIRED         : 'PIN is required',
        FIELDS_NOT_EQUAL : 'PIN-codes are not equal'
    },
    'data/pinConfirm' : {
        TOO_SHORT        : 'Confirm PIN must contain 6 symbols',
        REQUIRED         : 'Confirm PIN is required',
        FIELDS_NOT_EQUAL : 'PIN-codes are not equal'
    }
};

SecurityTabContent.propTypes = {
    updateSetting       : PropTypes.func.isRequired,
    updatePin           : PropTypes.func.isRequired,
    isPincodeUpdating   : PropTypes.bool.isRequired,
    isPincodeExists     : PropTypes.bool.isRequired,
    isSecureModeEnabled : PropTypes.shape({
        isUpdating : PropTypes.bool.isRequired,
        value      : PropTypes.bool.isRequired,
        error      : PropTypes.object
    }).isRequired,
    isAutoBlockingEnabled : PropTypes.shape({
        isUpdating : PropTypes.bool.isRequired,
        value      : PropTypes.bool.isRequired
    }).isRequired,
    error                       : PropTypes.object.isRequired,
    clearPincodeValidationError : PropTypes.func.isRequired,
    callValErrNotification      : PropTypes.func.isRequired
};

function mapStateToProps(state) {
    return {
        isSecureModeEnabled   : state.user.settings.isSecureModeEnabled,
        isAutoBlockingEnabled : state.user.settings.isAutoBlockingEnabled,
        isPincodeUpdating     : state.user.settings.info.pincode.isUpdating,
        isPincodeExists       : state.user.settings.info.pincode.isExists,
        error                 : state.user.settings.info.pincode.error
    };
}

const mapDispatchToProps = { ...UserActions, ...InterfaceActions };

export default connect(mapStateToProps, mapDispatchToProps)(SecurityTabContent);
