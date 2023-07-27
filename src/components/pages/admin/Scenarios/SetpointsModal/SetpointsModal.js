import React, { PureComponent, Fragment } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames/bind';

import { Close } from '@material-ui/icons';
import IconButton from '@material-ui/core/IconButton';
import PropertyRow from '../../Dashboard/PropertyRow';
import Modal from '../../../../base/Modal';
import CriticalValue from '../../../../base/CriticalValue';
import styles from './SetpointsModal.less';

const cn = classnames.bind(styles);

class SetpointsModal extends PureComponent {
    static propTypes = {
        title     : PropTypes.string,
        isOpen    : PropTypes.bool.isRequired,
        onClose   : PropTypes.func.isRequired,
        setpoints : PropTypes.array
    }

    static defaultProps={
        title     : '',
        setpoints : []
    }

    constructor() {
        super();
        this.state = {
            isGroupsVisible : true
        };
    }


    handleSwitchGroupsVisible = () => {
        this.setState({ isGroupsVisible: !this.state.isGroupsVisible });
    }


    renderSetpointsValues=() => {
        const { setpoints } = this.props;
        const { isGroupsVisible } = this.state;
        const propertiesListCN = cn(styles.propertiesList);

        return (
            <div className={propertiesListCN} >
                {
                    setpoints.map(setpoint => {
                        return (
                            <PropertyRow
                                {...setpoint}
                                key={setpoint.id}
                                aliasHide
                                showGroups = {isGroupsVisible}
                                className={{
                                    root : styles.property
                                }}
                            />
                        );
                    })
                }

            </div>
        );
    }

    render() {
        const { title, isOpen, onClose } = this.props;
        const { isGroupsVisible } = this.state;

        return (
            <Modal isOpen={isOpen} onClose={onClose}>
                <Fragment>
                    <div className={styles.Modal}>
                        <IconButton
                            className={styles.closeButton}
                            disableFocusRipple
                            disableRipple
                            onClick={onClose}
                        >
                            <Close />
                        </IconButton>
                        <div className={styles.header}>
                            <span className={styles.title}>
                                <CriticalValue value={title} maxWidth='100%' />
                            </span>
                            <div className={styles.controls} onClick={this.handleSwitchGroupsVisible}>
                                <div
                                    className={styles.groupsVisibilityButton}
                                    onClick={this.handleToggleGroupsVisibility}
                                >
                                    { isGroupsVisible ? 'Hide details' : 'Show details' }
                                </div>
                            </div>
                        </div>
                        <div className={styles.content}>
                            {this.renderSetpointsValues()}
                        </div>
                        <div className={styles.footer} />
                    </div>

                </Fragment>
            </Modal>
        );
    }
}


export default SetpointsModal;
