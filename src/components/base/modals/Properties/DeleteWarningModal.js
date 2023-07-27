import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import * as InterfaceActions from '../../../../actions/interface';
import * as HomieActions from '../../../../actions/homie';
import { HARDWARE_TYPES } from '../../../../assets/constants/homie';
import { BROKER_RESPONSE_TIMEOUT } from '../../../../assets/constants';
import Modal from '../../Modal';
import DeleteWarning from '../../DeleteWarning';


class DeleteWarningModal extends PureComponent {
    state = {
        isDeleting    : false,
        responseTimer : null
    }

    componentWillUnmount() {
        const { responseTimer } = this.state;

        clearTimeout(responseTimer);
    }

    handleModalAccept = () => {
        this.hideResponseTimeoutNotification();
        const responseTimer = setTimeout(() => {
            this.handleBrokerResponseTimeout();
        }, BROKER_RESPONSE_TIMEOUT);

        this.setState({
            isDeleting : true,
            responseTimer
        });
        this.deleteHardware();
    }

    handleBrokerResponseTimeout = () => {
        this.setState({
            isDeleting : false
        });
        this.callResponseTimeoutNotification();
    }


    handleModalClose = () => {
        const { isDeleting } = this.state;

        if (isDeleting) return;

        const { handleModalClose } = this.props;

        this.hideResponseTimeoutNotification();
        handleModalClose();
    }

    getActionType = () => {
        const { hardwareType } = this.props;
        const actionType = `${hardwareType.toUpperCase()}_DELETION`;

        return actionType;
    }


    deleteHardware = async () => {
        const { deleteHardware, hardwareType, deviceId, nodeId } = this.props;

        deleteHardware(hardwareType, deviceId, nodeId);
    }

    callResponseTimeoutNotification = () => {
        const { callValErrNotification, hardwareType } = this.props;

        callValErrNotification({ meta: 'BROKER_RESPONSE_TIMEOUT', title: 'Service is disabled', message: `Can't delete ${hardwareType}. Please try again` });
    }

    hideResponseTimeoutNotification = () => {
        const { hideValErrToastNotification } = this.props;

        hideValErrToastNotification({ meta: 'BROKER_RESPONSE_TIMEOUT' });
    }

    render() {
        const { isDeleting } = this.state;
        const { isOpen, hardwareType, name } = this.props;

        return (
            <Modal
                isOpen={isOpen}
                onClose={this.handleModalClose}
            >
                <DeleteWarning
                    name={name}
                    itemType={hardwareType}
                    onClose={this.handleModalClose}
                    onAccept={this.handleModalAccept}
                    isFetching={isDeleting}
                    isDisabled={isDeleting}
                />
            </Modal>
        );
    }
}

DeleteWarningModal.propTypes = {
    name                        : PropTypes.string.isRequired,
    isOpen                      : PropTypes.bool.isRequired,
    handleModalClose            : PropTypes.func.isRequired,
    deleteHardware              : PropTypes.func.isRequired,
    hardwareType                : PropTypes.oneOf(HARDWARE_TYPES).isRequired,
    deviceId                    : PropTypes.string.isRequired,
    nodeId                      : PropTypes.string,
    callValErrNotification      : PropTypes.func.isRequired,
    hideValErrToastNotification : PropTypes.func.isRequired
};

DeleteWarningModal.defaultProps = {
    nodeId : undefined
};


export default connect(null, { ...InterfaceActions, ...HomieActions })(DeleteWarningModal);
