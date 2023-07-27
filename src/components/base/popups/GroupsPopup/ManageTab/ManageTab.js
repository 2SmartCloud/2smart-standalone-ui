import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { decodeErrors  } from '../../../../../utils/validation/main';
import Modal from '../../../../base/Modal';
import DeleteWarning from '../../../../base/DeleteWarning';
import BorderedList from '../../../list/BorderedList';
import Button from '../../../Button';
import Search from '../../../../base/inputs/Search';

import styles from './ManageTab.less';


class ManageTab extends PureComponent {
    static propTypes = {
        groups   : PropTypes.array.isRequired,
        onCreate : PropTypes.func.isRequired,
        onDelete : PropTypes.func.isRequired
    }

    state={
        groupName          : '',
        groupErr           : '',
        isCreateProcessing : false,
        isDeleteModalOpen  : false,
        isDeleteProcessing : false,
        groupToDelete      : {
            id : ''
        }
    }
    handleSearchInputChange = (value) => {
        this.setState({ groupName: value });
    }


    handleCreateNewGroup = async (e) => {
        e.preventDefault();
        const {  groupName } = this.state;
        const { onCreate } = this.props;
        const group = groupName.trim();

        if (!groupName) {
            this.setState({
                groupErr           : 'Field should not be empty',
                isCreateProcessing : false
            });

            return;
        }

        try {
            this.handleProcessingGroupCreate();
            await onCreate({
                name : group
            });
            this.handleSuccessGroupCreate();
        } catch (error) {
            this.handleErrorGroupCreate(error);
        }
    }

    handleDeleteGroupClick = (group) => () => {
        this.setState({
            groupToDelete     : group,
            isDeleteModalOpen : true
        });
    }

    handleDeleteGroupConfirm = async () => {
        const { groupToDelete } = this.state;
        const { onDelete } = this.props;

        try {
            this.handleProccessingGroupDelete();
            await onDelete(groupToDelete.id);
            this.handleSuccessGroupDelete();
        } catch (err) {
            this.handleErrorGroupDelete(err);
        }
    }


    handleDeleteGroupCancel=() => {
        if (this.state.isDeleteProcessing) return;

        this.setState({
            groupToDelete     : {},
            isDeleteModalOpen : false
        });
    }

    handleProccessingGroupDelete = () => this.setState({
        isDeleteProcessing : true
    })

    handleSuccessGroupDelete = () => {
        this.setState({
            groupToDelete      : {},
            isDeleteProcessing : false,
            isDeleteModalOpen  : false
        });
    }

    handleErrorGroupDelete = () => this.setState({
        isDeleteProcessing : false
    })

    handleProcessingGroupCreate = () => this.setState({ isCreateProcessing: true })

    handleSuccessGroupCreate = () => {
        this.setState({
            isCreateProcessing : false,
            groupName          : ''
        });
    }


    handleErrorGroupCreate = (error) => {
        if (error.code === 'EXISTS') {
            const errors = error.fields ? decodeErrors(error.fields) : {};

            this.setState({
                groupErr : errors.name
            });
        }

        this.setState({ isCreateProcessing: false });
    }


    render() {
        const { groupName, groupErr, isDeleteModalOpen, groupToDelete,
            isCreateProcessing, isDeleteProcessing } = this.state;
        const { groups } = this.props;
        const filteredGroups = groupName
            ? groups.filter(group => group.label.toLowerCase().includes(groupName.toLowerCase()))
            : groups;
        const isInputValue = !this.state.groupName.length;
        const isGroupExist = isInputValue
        || !!groups.find(group => group.label.toLowerCase() === groupName.toLowerCase());


        return (
            <div   className={styles.ManageTab}>
                <form  className={styles.createGroupContainer} >
                    <div className={styles.inputWrapper}>
                        <Search
                            maximumHarcodingIOS
                            placeholder ='Search or create new group...'
                            value={groupName}
                            onChange={this.handleSearchInputChange}
                            tabIndex={1}
                        />
                        <div className={styles.errorMessage}>{groupErr}</div>
                    </div>
                    <Button
                        text='Create'
                        type='submit'
                        isFetching={isCreateProcessing}
                        isDisabled ={isGroupExist}
                        onClick = {this.handleCreateNewGroup}
                        className={styles.createButton}
                    />
                </form>
                <BorderedList
                    onDelete = {this.handleDeleteGroupClick}
                    totalLength = {groups.length}
                    list = {filteredGroups}
                />

                <Modal
                    isOpen={isDeleteModalOpen}
                    onClose={this.handleDeleteGroupCancel}
                >
                    <DeleteWarning
                        name={groupToDelete.label}
                        onClose={this.handleDeleteGroupCancel}
                        onAccept={this.handleDeleteGroupConfirm}
                        isFetching={isDeleteProcessing}
                        confirmText='Yes, delete group'
                        itemType='group'
                    />
                </Modal>
            </div>
        );
    }
}


export default ManageTab;

