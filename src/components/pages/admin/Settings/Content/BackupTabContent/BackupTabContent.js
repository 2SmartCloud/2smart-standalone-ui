import React, { PureComponent } from 'react';
import PropTypes                from 'prop-types';
import Input                    from '../../../../../base/inputs/Base';

import Button                   from '../../../../../base/Button';
import BackupSelect             from '../../../../../base/select/BackupSelect';
import ConfirmationModal        from '../../../shared/ConfirmationModal';
import AppRefreshLoader         from '../../../shared/AppRefreshLoader';
import { flattenErrors }        from '../../../Scenarios/etc/errors';
import BaseContentWrapper       from '../BaseContentWrapper/';
import styles                   from './BackupTabContent.less';

const DECODE_ERROR = {
    WRONG_FORMAT : 'The name of the backup must be characters (A-z), digits (0-9)',
    TOO_LONG     : 'The name of the backup must be maximum 25 characters'
};

class BackupTabContent extends PureComponent {
    static propTypes = {
        backup : PropTypes.shape({
            list        : PropTypes.array,
            isFetching  : PropTypes.bool,
            isUpdating  : PropTypes.bool,
            isRestored  : PropTypes.bool,
            restoring   : PropTypes.string,
            isCreating  : PropTypes.bool,
            isRestoring : PropTypes.bool
        }).isRequired,
        restoreBackup : PropTypes.func.isRequired,
        createBackup  : PropTypes.func.isRequired
    }

    state = {
        selectedBackup     : null,
        newBackupName      : '',
        newBackupNameError : '',
        modal              : {
            isOpen : false
        }
    }
    componentDidUpdate(prevProps) {
        const { isRestored } = this.props.backup;

        if (isRestored && isRestored !== prevProps.backup.isRestored) {
            this.setState({ selectedBackup: null });
        }
    }

    handleModalOpen = ({ title, text, labels }) => {
        this.setState({ modal: { title, text, labels, isOpen: true } });
    }

    handleModalClose = () => {
        this.setState({ modal: { isOpen: false } });
    }

    handleRestoreBackup = (e) => {
        const { name } = this.state.selectedBackup;

        e.preventDefault();
        this.modalSubmitHandler = this.restoreBackup(name);

        const title = `Restore ${name}`;
        const text = 'If you have new data it will be lost!';
        const labels = { submit: 'Yes, restore data', cancel: 'Cancel' };

        this.handleModalOpen({ title, text, labels });
    }

    handleSelectBackup = (backup) => {
        this.setState({ selectedBackup: backup });
    }

    handleChangeName = (name)  => {
        this.setState({
            newBackupName      : name,
            newBackupNameError : ''
        });
    }

    handleCreateBackup = async (e) => {
        e.preventDefault();
        const { newBackupName  } = this.state;
        const { createBackup } = this.props;

        try {
            await createBackup(newBackupName);
            this.setState({
                newBackupName : ''
            });
        } catch (nameErr) {
            const backupError = flattenErrors(nameErr).backupBaseName;

            this.setState({
                newBackupNameError : DECODE_ERROR[backupError]
            });
        }
    }

    restoreBackup = name => () => {
        const { restoreBackup } = this.props;

        this.handleModalClose();
        restoreBackup(name);
    }

    renderModal() {
        const { modal: { title, text, labels, isOpen } } = this.state;

        return (
            <ConfirmationModal
                title={title}
                text={text}
                labels={labels}
                isOpen={isOpen}
                onSubmit={this.modalSubmitHandler} // eslint-disable-line react/jsx-handler-names
                onClose={this.handleModalClose}
            />
        );
    }

    renderFirstTab = () => {
        const {  list, restoring } = this.props.backup;
        const { selectedBackup } = this.state;
        const isRestoreDisabled = restoring || !selectedBackup;

        return (
            <form>
                <div className= {styles.selectWrapper}>
                    <BackupSelect
                        settings={{
                            defaultValue : selectedBackup,
                            value        : selectedBackup
                        }}
                        placeholder='Select backup'
                        options={list}
                        value={selectedBackup}
                        onChange={this.handleSelectBackup}
                    />
                </div>
                <Button
                    text='Restore'
                    type='submit'
                    isDisabled ={isRestoreDisabled}
                    className={styles.submitButton}
                    onClick={this.handleRestoreBackup}
                    isFetching={restoring}
                />
            </form>
        );
    }

    renderSecondTab = () => {
        const { isCreating } = this.props.backup;
        const { newBackupName, newBackupNameError } = this.state;
        const isCreateDisabled = !newBackupName;

        return (
            <form>
                <div className={styles.inputConatiner}>
                    <div className={styles.inputWrapper}>
                        <Input
                            type='text'
                            value={newBackupName}
                            className='form'
                            placeholder='Backup name'
                            onChange={this.handleChangeName}
                            darkThemeSupport
                            onFocus={this.handleFocus}
                            isInvalid={!!newBackupNameError}
                            maxLength={25}
                            maximumHarcodingIOS
                        />
                    </div>
                    <div className={styles.errorMessage}>
                        {newBackupNameError}
                    </div>
                </div>
                <Button
                    text='Create backup'
                    type='submit'
                    isDisabled ={isCreateDisabled}
                    className={styles.createButton}
                    onClick={this.handleCreateBackup}
                    isFetching={isCreating}
                />
            </form>
        );
    }

    render() {
        const { isRestoring } = this.props.backup;

        return (
            <div>
                <BaseContentWrapper
                    blocks={
                        [ {
                            title         : 'Restore backup',
                            subtitle      : 'Choose backup to restore',
                            renderContent : this.renderFirstTab
                        },
                        {
                            title         : 'Create the backup',
                            subtitle      : 'Set name to create a new backup',
                            renderContent : this.renderSecondTab
                        }  ]
                    }
                />
                { this.renderModal() }
                { isRestoring && <AppRefreshLoader /> }
            </div>
        );
    }
}

export default BackupTabContent;
