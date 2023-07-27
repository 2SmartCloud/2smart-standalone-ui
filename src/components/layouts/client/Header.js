import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import classnames from 'classnames/bind';
import { SvgIcon } from '@material-ui/core';
import BurgerIcon from '../../base/icons/Burger';
import LockIcon from '../../base/icons/Lock';
import Switch from '../../base/Switch';
import * as ClientDashboardActions from '../../../actions/client/dashboard';
import * as ScreenActions from '../../../actions/client/screens';
import * as InterfaceActions from '../../../actions/interface';
import * as UserActions from '../../../actions/user';
import GearIcon from '../../base/icons/Gear';
import Button from './../../base/Button';
import Input from './HeaderInput';
import styles from './Header.less';

const cn = classnames.bind(styles);

class Header extends PureComponent {
    constructor(props) {
        super(props);

        this.inputRef = React.createRef();
    }

    handleScreenSave = () => {
        const { onScreenSave } = this.props;

        if (onScreenSave) onScreenSave();
    }


    handleEditScreen = () => {
        this.enterScreenEditMode();
    }


    handleScreenNameChange = () => {
        const { screen: { name, id, isFetching } } = this.props;

        if (isFetching) return;

        const value = this.inputRef.current.value.trim();

        if (name === value || !value) return this.props.finishRenaming({ id });

        this.props.renameScreen({
            id   : this.props.screen.id,
            name : value
        });
    }

    handleBlur = () => {
        const { screen: { id } } = this.props;

        this.props.finishRenaming({ id });
    }

    handleFocus = () => {
        const { screen: { id, isEditMode } } = this.props;

        if (isEditMode) this.props.startRenaming({ id });
    }

    handleSwitchChange = () => {
        const { updateScreenParentModeStatus, screen : { id, isParentControlEnabled } } = this.props;

        updateScreenParentModeStatus(id, !isParentControlEnabled);
    }

    enterScreenEditMode = () => {
        const { enterScreenEditMode, screen : { id } } = this.props;

        enterScreenEditMode(id);
    }

    isEditModeEnteringDisabled = () => {
        const { isClientPanelAccessGranted, screen, isSecureModeEnabled, isProcessingEditMode } = this.props;
        const { isParentControlEnabled = true } = screen;

        return isParentControlEnabled && !isClientPanelAccessGranted && isSecureModeEnabled || isProcessingEditMode;
    }


    render() {
        const {
            screen,
            isLastScreen,
            onModalOpen,
            onBurgerClick,
            isSecureModeEnabled,
            isClientPanelAccessGranted,
            isParentControlUpdating,
            isRenamingScreen
        } = this.props;
        const { name, isEditMode, isRenaming, isFetching, isUpdating, isParentControlEnabled = true } = screen;
        const HeaderCN = cn('Header', {
            isEditing : isEditMode
        });
        const isEditModeEnteringDisabled = this.isEditModeEnteringDisabled();
        const editButtonContainerCN = cn('editButtonContainer', {
            disabled : isEditModeEnteringDisabled
        });

        return (
            <div className={HeaderCN}>
                <div className={styles.wrapper}>
                    <BurgerIcon onClick={onBurgerClick} />
                    <div className={styles.title}>
                        <Input
                            defaultValue={name}
                            isFetching={isRenamingScreen}
                            isDisabled={!isEditMode}
                            inputRef={this.inputRef}
                            onSave={this.handleScreenNameChange}
                            onBlur={this.handleBlur}
                            onFocus={this.handleFocus}
                            isActive={isRenaming}
                        />
                        {
                            isEditMode && !isLastScreen && !isRenaming &&
                                <div className={styles.deleteWrapper}>
                                    <SvgIcon
                                        onClick={onModalOpen}
                                        className={styles.deleteBtn}
                                    >
                                        <path d='M2.39806 17.9771C1.92844 17.9771 1.54227 17.5947 1.52262 17.1102L0.938477 4.37744H12.0375L11.4533 17.1102C11.4337 17.5947 11.0475 17.9771 10.5779 17.9771H2.39806ZM8.69423 7.17259C8.49766 7.17259 8.33833 7.33714 8.33833 7.54003V14.8145C8.33833 15.0176 8.49774 15.182 8.69423 15.182H9.26346C9.46004 15.182 9.61936 15.0175 9.61936 14.8145V7.54003C9.61936 7.3371 9.45991 7.17259 9.26346 7.17259H8.69423ZM5.84749 7.54003C5.84749 7.33714 6.00681 7.17259 6.20335 7.17259H6.77258C6.96903 7.17259 7.12844 7.3371 7.12844 7.54003V14.8145C7.12844 15.0175 6.96916 15.182 6.77258 15.182H6.20335C6.00686 15.182 5.84749 15.0176 5.84749 14.8145V7.54003ZM3.71242 7.17259C3.51589 7.17259 3.35656 7.33714 3.35656 7.54003V14.8145C3.35656 15.0176 3.51593 15.182 3.71242 15.182H4.28169C4.47823 15.182 4.63755 15.0175 4.63755 14.8145V7.54003C4.63755 7.3371 4.47818 7.17259 4.28169 7.17259H3.71242Z' />
                                        <path d='M12.4268 0.926098H8.65314V0.189462C8.65314 0.0848508 8.57101 0 8.46965 0H4.50695C4.40564 0 4.3235 0.0848508 4.3235 0.189462V0.926054H0.549836C0.246148 0.926054 0 1.18025 0 1.49382V3.27741H12.9766V1.49387C12.9766 1.1803 12.7305 0.926098 12.4268 0.926098Z' />
                                    </SvgIcon>
                                </div>
                        }
                    </div>
                </div>
                { isEditMode ?
                    <div className = {styles.buttonsContainer}>
                        <div className={styles.btnContainer}>
                            <Button
                                text={'Finish'}
                                onClick={this.handleScreenSave}
                                isFetching={isFetching || isUpdating}
                                isDisabled={isFetching || isUpdating}
                                className={styles.submitButton}
                            />
                        </div>
                        { isSecureModeEnabled &&
                            <div className={styles.parentControlSwitchWrapper}>
                                <span>Parent control</span>
                                <Switch
                                    onChange={this.handleSwitchChange}
                                    checked={isParentControlEnabled}
                                    disabled={isParentControlUpdating}
                                    isProcessing={isParentControlUpdating}
                                />
                            </div>
                        }
                    </div>
                    :
                    <div
                        className={editButtonContainerCN}
                        onClick={isEditModeEnteringDisabled ? undefined : this.handleEditScreen}
                    >
                        <div className={styles.editIconWrapper}>
                            <GearIcon />
                        </div>
                        {
                            isSecureModeEnabled ?
                                <div className={styles.lockIconWrapper}>
                                    <LockIcon
                                        className={styles.lockIcon}
                                        isClosed={!isClientPanelAccessGranted}
                                    />
                                </div> : null
                        }
                    </div>
                }
            </div>
        );
    }
}

Header.propTypes = {
    renameScreen                 : PropTypes.func.isRequired,
    enterScreenEditMode          : PropTypes.func.isRequired,
    screen                       : PropTypes.object.isRequired,
    onModalOpen                  : PropTypes.func.isRequired,
    isLastScreen                 : PropTypes.bool.isRequired,
    finishRenaming               : PropTypes.func.isRequired,
    startRenaming                : PropTypes.func.isRequired,
    updateScreenParentModeStatus : PropTypes.func.isRequired,
    onScreenSave                 : PropTypes.func,
    onBurgerClick                : PropTypes.func,
    isSecureModeEnabled          : PropTypes.bool.isRequired,
    isClientPanelAccessGranted   : PropTypes.bool.isRequired,
    isParentControlUpdating      : PropTypes.bool,
    isProcessingEditMode         : PropTypes.bool,
    isRenamingScreen             : PropTypes.bool
};

Header.defaultProps = {
    onBurgerClick           : () => {},
    onScreenSave            : () => {},
    isParentControlUpdating : false,
    isProcessingEditMode    : false,
    isRenamingScreen        : false

};

function mapStateToProps(state) {
    return {
        isSaving                   : state.client.dashboard.isSaving,
        isSecureModeEnabled        : state.user.settings.isSecureModeEnabled.value,
        isClientPanelAccessGranted : state.user.isClientPanelAccessGranted,
        isParentControlUpdating    : state.client.dashboard.isParentControlUpdating,
        isProcessingEditMode       : state.client.dashboard.isProcessingEditMode,
        isRenamingScreen           : state.client.dashboard.isRenamingScreen
    };
}

export default connect(
    mapStateToProps,
    { ...ClientDashboardActions, ...ScreenActions, ...InterfaceActions, ...UserActions }
)(Header);
