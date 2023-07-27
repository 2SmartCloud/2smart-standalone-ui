import React, { PureComponent } from 'react';
import PropTypes                from 'prop-types';
import { connect }              from 'react-redux';

import { Close }                from '@material-ui/icons';
import IconButton               from '@material-ui/core/IconButton';
import AutoDiscoveryItem        from '../list/AutoDiscoveryItem';
import ProcessingInstruction    from '../ProcessingIndicator';

import * as DiscoveriesActions  from '../../../actions/discovery';
import {
    closeLastPopup,
    showDeleteModal,
    hideDeleteModal
}                               from '../../../actions/interface';

import Modal                    from '../../base/Modal';
import DeleteWarning            from '../../base/DeleteWarning';
import globalEscHandler         from '../../../utils/globalEscHandler';
import styles                   from './DiscoverDevicesPopup.less';

class DiscoverDevicesPopup extends PureComponent {
    static propTypes = {
        availableDevices      : PropTypes.object.isRequired,
        idDiscoveriesFetching : PropTypes.bool.isRequired,
        isDeleteProcessing    : PropTypes.bool.isRequired,
        isDeleteModalOpen     : PropTypes.bool.isRequired,
        hideDeleteModal       : PropTypes.func.isRequired,
        showDeleteModal       : PropTypes.func.isRequired,
        acceptDiscovery       : PropTypes.func.isRequired,
        deleteDiscovery       : PropTypes.func.isRequired,
        closeLastPopup        : PropTypes.func.isRequired,
        onClose               : PropTypes.func.isRequired
    }

    state = {
        deleteModalData : {}
    }

    componentDidMount() {
        globalEscHandler.register(this.handleClosePopup);
    }

    componentWillUnmount() {
        globalEscHandler.unregister(this.handleClosePopup);
    }

    handleClosePopup=() => {
        this.props.closeLastPopup();
    }

    handleOpenDeleteModal = ({ device, deviceId }) => () => {
        this.props.showDeleteModal();
        this.setState({
            deleteModalData : { ...device, deviceId }
        });
    }

    handleDeleteDiscoveryConfirm = async () => {
        const { entityTopic } = this.state.deleteModalData;

        await this.props.deleteDiscovery(entityTopic);
    }

    handleDeleteDiscoveryCancel = () => {
        if (this.props.isDeleteProcessing) return;

        this.props.hideDeleteModal();
    }

    renderDevices = () => {
        const { availableDevices, acceptDiscovery, onClose } = this.props;
        const availableDevicesArray = Object.entries(availableDevices);

        return (
            <div className={styles.DiscoverDevicesPopup} >
                <IconButton
                    className = {styles.closeIcon}
                    onClick   = {onClose}
                    disableFocusRipple
                    disableRipple
                >
                    <Close />
                </IconButton>
                <p className = {styles.popupTitle}> Add new device</p>
                <div className = {styles.devicesContainer}>
                    { availableDevicesArray.map(([ deviceId, device ], index) => (
                        <AutoDiscoveryItem
                            onAcceptClick     = {acceptDiscovery}
                            onDeleteIconClick = {this.handleOpenDeleteModal({ device, deviceId })}
                            key               = {`${device?.name}${device?.createdAt}${index}`} // eslint-disable-line react/no-array-index-key
                            device            = {{
                                deviceId,
                                ...device
                            }}
                        />
                    ))}
                </div>

            </div>
        );
    }

    renderNothingToShow = (idDiscoveriesFetching) => {
        const { onClose } = this.props;

        return (
            <div className={styles.DiscoverDevicesPopup_NothingToShow} >
                <IconButton
                    className = {styles.closeIcon}
                    onClick   = {onClose}
                    disableFocusRipple
                    disableRipple
                >
                    <Close />
                </IconButton>
                { idDiscoveriesFetching
                    ? <ProcessingInstruction />
                    : <>
                        <div className={styles.nothingToShowIcon} />
                        <p className={styles.nothingToShowText}> No new devices</p>
                    </>}

            </div>);
    }


    render() {
        const {  availableDevices, idDiscoveriesFetching, isDeleteModalOpen, isDeleteProcessing } = this.props;
        const { deleteModalData } = this.state;

        return (<>

            {
                Object.values(availableDevices)?.length
                    ? this.renderDevices()
                    : this.renderNothingToShow(idDiscoveriesFetching)
            }
            <Modal
                isOpen  = {isDeleteModalOpen}
                onClose = {this.handleDeleteDiscoveryCancel}
            >
                <DeleteWarning
                    name        = {deleteModalData.name}
                    onClose     = {this.handleDeleteDiscoveryCancel}
                    onAccept    = {this.handleDeleteDiscoveryConfirm}
                    isFetching  = {isDeleteProcessing}
                    confirmText = 'Yes, delete discovery'
                    itemType    = 'discovery'
                />
            </Modal>
        </>
        );
    }
}

function mapStateToProps(state)  {
    return {
        idDiscoveriesFetching : state.discovery.isFetching,
        isDeleteProcessing    : state.discovery.isLoading,
        availableDevices      : state.discovery.discoveries,
        isDeleteModalOpen     : state.applicationInterface.deleteModal.isOpen
    };
}

export default connect(mapStateToProps, {
    ...DiscoveriesActions,
    closeLastPopup,
    showDeleteModal,
    hideDeleteModal
})(DiscoverDevicesPopup);
