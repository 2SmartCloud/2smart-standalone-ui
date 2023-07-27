import React, { PureComponent } from 'react';
import PropTypes                from 'prop-types';
import { connect } from 'react-redux';
import * as UserActions from '../../../../../actions/user';
import Input from '../../../../base/inputs/Base';
import PasswordInput from '../../../../base/inputs/Password';
import Button from '../../../../base/Button';
import { decodeErrors } from '../../../../../utils/validation/main';
import BaseContentWrapper from './BaseContentWrapper/';

import styles from './Preferences.less';

class PreferencesTabContent extends PureComponent {
    state = {
        username           : this.props.username,
        currentPassword    : '',
        newPassword        : '',
        newPasswordConfirm : '',
        isPasswordLoading  : false,
        isUsernameLoading  : false,
        errors             : {
            username           : '',
            currentPassword    : '',
            newPassword        : '',
            newPasswordConfirm : ''
        }
    }


    handleChangeInput = (name) => (value) => {
        const isValueValid = /^\S*$/.test(value);

        if (isValueValid) {
            this.setState({
                [name] : value,
                errors : {
                    username           : '',
                    currentPassword    : '',
                    newPassword        : '',
                    newPasswordConfirm : ''
                } });
        }
    }

    handleFocus = () => {
        this.setState({
            errors : {
                username           : '',
                currentPassword    : '',
                newPassword        : '',
                newPasswordConfirm : ''
            }
        });
    }


    handleSaveButtonClick = async (field, e) => {
        e.preventDefault();
        const { currentPassword, newPassword, newPasswordConfirm, username  } = this.state;
        const { updateCredentials } = this.props;
        const isFieldLoading = `is${field}Loading`;
        const payload = {};

        switch (field) {
            case 'Username':
                payload.username = username.trim();
                break;
            case 'Password':
                payload.oldPassword        = currentPassword.trim();
                payload.newPassword        = newPassword.trim();
                payload.newPasswordConfirm = newPasswordConfirm.trim();
                break;
            default:
                break;
        }

        try {
            this.setState({ [isFieldLoading]: true });

            await updateCredentials(payload);
            switch (field) {
                case 'Username':
                    this.setState({
                        [isFieldLoading] : false
                    });
                    break;
                case 'Password':
                    this.setState({
                        [isFieldLoading]   : false,
                        currentPassword    : '',
                        newPassword        : '',
                        newPasswordConfirm : ''
                    });
                    break;
                default:
                    break;
            }
        } catch (error) {
            this.setState({ [isFieldLoading]: false });

            const errors = error.fields ? decodeErrors(error.fields) : {};

            this.setState({
                errors : {
                    ...errors,
                    currentPassword : errors.oldPassword
                }
            });
        }
    }

    renderFirstTab = () => {
        const {  currentPassword, newPassword, newPasswordConfirm,
            errors, isPasswordLoading  } = this.state;
        const isPasswordButtonDisabled = !currentPassword && !newPassword && !newPasswordConfirm;

        return (
            <form>
                <div className={styles.inputConatiner}>
                    <div className={styles.inputWrapper} style={{ marginBottom: 0 }}>
                        <PasswordInput
                            value={currentPassword}
                            className='form'
                            placeholder='Current password'
                            type='password'
                            onChange={this.handleChangeInput('currentPassword')}
                            darkThemeSupport
                            onFocus={this.handleFocus}
                            isInvalid={!!errors.currentPassword}
                            maxLength={30}
                            maximumHarcodingIOS
                        />
                    </div>
                    <div className={styles.errorMessage}>
                        {errors.currentPassword}
                    </div>
                </div>
                <div className={styles.inputConatiner}>
                    <div className={styles.inputWrapper} style={{ marginBottom: 0 }}>
                        <PasswordInput
                            value={newPassword}
                            className='form'
                            placeholder='New password'
                            type='password'
                            onChange={this.handleChangeInput('newPassword')}
                            darkThemeSupport
                            onFocus={this.handleFocus}
                            isInvalid={!!errors.newPassword}
                            maxLength={30}
                            maximumHarcodingIOS
                        />
                    </div>
                    <div className={styles.errorMessage}>
                        {errors.newPassword}
                    </div>
                </div>
                <div className={styles.inputConatiner}>
                    <div className={styles.inputWrapper} style={{ marginBottom: 0 }}>
                        <PasswordInput
                            value={newPasswordConfirm}
                            className='form'
                            placeholder='Confirm password'
                            type='password'
                            onChange={this.handleChangeInput('newPasswordConfirm')}
                            darkThemeSupport
                            onFocus={this.handleFocus}
                            isInvalid={!!errors.newPasswordConfirm}
                            maxLength={30}
                            maximumHarcodingIOS
                        />
                    </div>
                    <div className={styles.errorMessage}>
                        {errors.newPasswordConfirm}
                    </div>
                </div>
                <div className={styles.submitButtonWrapper}>
                    <Button
                        text='Save'
                        type='submit'
                        isDisabled ={isPasswordButtonDisabled}
                        className={styles.submitButton}
                        onClick={this.handleSaveButtonClick.bind(this, 'Password')}
                        isFetching={isPasswordLoading}
                    />
                </div>
            </form>
        );
    }

    renderSecondTab = () => {
        const { username, errors,  isUsernameLoading } = this.state;
        const isUsernameButtonDisabled = !username;

        return (
            <form>
                <div className={styles.inputConatiner}>
                    <div className={styles.inputWrapper}>
                        <Input
                            type='text'
                            value={username}
                            className='form'
                            placeholder='Login'
                            onChange={this.handleChangeInput('username')}
                            darkThemeSupport
                            onFocus={this.handleFocus}
                            isInvalid={!!errors.username}
                            maxLength={50}
                            maximumHarcodingIOS
                        />
                    </div>
                    <div className={styles.errorMessage}>
                        {errors.username}
                    </div>
                </div>
                <div className={styles.submitButtonWrapper}>
                    <Button
                        text='Update'
                        type='submit'
                        isDisabled ={isUsernameButtonDisabled}
                        className={styles.submitButton}
                        onClick={this.handleSaveButtonClick.bind(this, 'Username')}
                        isFetching={isUsernameLoading}
                    />
                </div>
            </form>
        );
    }

    render() {
        return (
            <BaseContentWrapper
                blocks={
                    [ {
                        title         : 'Change the password',
                        subtitle      : 'Set password to protect your admin panel',
                        renderContent : this.renderFirstTab
                    },
                    {
                        title         : 'Change the login',
                        subtitle      : 'Change login to protect your admin panel',
                        renderContent : this.renderSecondTab
                    }  ]
                }
            />

        );
    }
}

PreferencesTabContent.propTypes = {
    updateCredentials : PropTypes.func.isRequired,
    username          : PropTypes.string.isRequired
};

function mapStateToProps(state) {
    return {
        isSecureModeEnabled   : state.user.settings.isSecureModeEnabled,
        isAutoBlockingEnabled : state.user.settings.isAutoBlockingEnabled,
        isPincodeUpdating     : state.user.settings.info.pincode.isUpdating,
        isPincodeExists       : state.user.settings.info.pincode.isExists,
        error                 : state.user.settings.info.pincode.error,
        username              : state.user.settings.info.username
    };
}

export default connect(mapStateToProps, { ...UserActions })(PreferencesTabContent);

