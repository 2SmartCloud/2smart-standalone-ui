import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import Menu from '../../Menu';
import GearIcon from '../../icons/Gear';
import DeleteWarningModal from './DeleteWarningModal.js';
import styles from './Footer.less';

class Footer extends PureComponent {
    state = {
        isDeleteModalOpen : false,
        shouldRenderMenu  : false
    }

    componentDidMount() {
        if (this.anchor) this.setState({ shouldRenderMenu: true });
    }

    handleMenuItemClick = value => {
        switch (value) {
            case 'delete':
                this.openDeleteWarningModal();

                break;
            default:
                break;
        }
    }

    openDeleteWarningModal = () => this.setState({ isDeleteModalOpen: true })

    closeDeleteWarningModal = () => this.setState({ isDeleteModalOpen: false })

    render() {
        const { hardwareType, name, deleteHardware, deviceId, nodeId, onClose } = this.props; //eslint-disable-line
        const { isDeleteModalOpen, shouldRenderMenu } = this.state;

        return (
            <div className={styles.Footer}>
                <div className={styles.anchor} ref={node => this.anchor = node} />
                {
                    shouldRenderMenu ?
                        <Menu
                            openingElement={GearIconWrapper}
                            options={[
                                {
                                    value : 'delete',
                                    label : `Remove ${hardwareType}`
                                }
                            ]}
                            anchor={this.anchor}
                            onClick={this.handleMenuItemClick}
                            classes ={{
                                paper : styles.paper,
                                list  : styles.list
                            }}
                        /> : null
                }
                <DeleteWarningModal
                    hardwareType={hardwareType}
                    name={name}
                    isOpen={isDeleteModalOpen}
                    handleModalClose={this.closeDeleteWarningModal}
                    deviceId={deviceId}
                    nodeId={nodeId}
                    onClose={onClose}
                />
            </div>
        );
    }
}

Footer.propTypes = {
    hardwareType : PropTypes.string.isRequired,
    name         : PropTypes.string.isRequired
};

function GearIconWrapper(props) { //eslint-disable-line
    return (
        <div
            {...props}
            className={styles.gearIconWrapper}
        >
            <GearIcon />
        </div>
    );
}

export default Footer;
