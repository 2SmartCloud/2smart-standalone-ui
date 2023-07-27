import React, { PureComponent } from 'react';
import PropTypes                from 'prop-types';
import classnames               from 'classnames/bind';
import { Tooltip }              from '@material-ui/core';
import CriticalValue            from '../../../base/CriticalValue';
import ProcessingIndicator      from '../../../base/ProcessingIndicator';
import {
    INSTALL_ICON,
    CHECK_ICON,
    UPDATE_ICON,
    DELETE_ICON
}                               from './etc/icons';
import styles                   from './MarketListRow.less';

const cx = classnames.bind(styles);
const PROCESSING_NAMES = {
    pulling  : 'Installing…',
    removing : 'Deleting…',
    checking : 'Checking…',
    updating : 'Pulling…'
};

class MarketListRow extends PureComponent {
    static propTypes = {
        service : PropTypes.shape({
            name            : PropTypes.string,
            label           : PropTypes.string,
            status          : PropTypes.string,
            state           : PropTypes.string,
            isProcessing    : PropTypes.bool,
            processingLabel : PropTypes.string,
            icon            : PropTypes.node,
            version         : PropTypes.shape({
                updated         : PropTypes.bool,
                updateAvailable : PropTypes.bool
            })
        }).isRequired,
        installService : PropTypes.func.isRequired,
        checkUpdates   : PropTypes.func.isRequired,
        updateService  : PropTypes.func.isRequired,
        deleteService  : PropTypes.func.isRequired,
        viewMode       : PropTypes.oneOf([ 'list', 'card' ]).isRequired
    }

    state = {
        isProcessing : false
    }

    handleInstallService = () => {
        const { service, installService } = this.props;

        installService(service);
    }

    handleCheckUpdates = () => {
        const { service, checkUpdates } = this.props;

        checkUpdates(service);
    }

    handleUpdateService = async () => {
        const { service, updateService } = this.props;

        updateService(service);
    }

    handleDeleteService = () => {
        const { service, deleteService } = this.props;

        deleteService(service);
    }

    checkIsProcessing() {
        const { service: { state, isProcessing } } = this.props;

        return isProcessing || [ 'pulling', 'removing' ].includes(state);
    }

    renderLoader() {
        const { service: { state, processingLabel } } = this.props;
        const label = PROCESSING_NAMES[processingLabel || state];

        return (
            <div className={styles.processing}>
                <span>{label}</span>
                <ProcessingIndicator size='20px' />
            </div>
        );
    }

    renderControls() {
        const { service: { status, version } } = this.props;

        const controls = [];

        switch (status) {  // eslint-disable-line default-case
            case 'installed': {
                controls.push(
                    version?.updateAvailable
                        ? <Tooltip key='update' title='Update'>
                            <div className={styles.iconWrapper} onClick={this.handleUpdateService}>
                                {UPDATE_ICON}
                            </div>
                        </Tooltip>
                        : <Tooltip key='check-update' title='Check for updates'>
                            <div className={styles.iconWrapper} onClick={this.handleCheckUpdates}>
                                {CHECK_ICON}
                            </div>
                        </Tooltip>,
                    <Tooltip key='delete'  title='Delete'>
                        <div className={styles.iconWrapper} onClick={this.handleDeleteService}>
                            {DELETE_ICON}
                        </div>
                    </Tooltip>
                );
                break;
            }
            case 'not-installed': {
                controls.push(
                    <Tooltip key='install' title='Install'>
                        <div className={cx('iconWrapper', 'installIcon')} onClick={this.handleInstallService}>
                            {INSTALL_ICON}
                        </div>
                    </Tooltip>
                );
                break;
            }
        }

        return controls;
    }

    render() {
        const { service: { label, icon }, viewMode } = this.props;
        const isProcessing = this.checkIsProcessing();
        const marketListRowCN = cx(styles.MarketListRow, {
            [`viewMode-${viewMode}`] : viewMode
        });

        return (
            <div className={marketListRowCN}>
                <div className={styles.type}>
                    {icon}
                </div>
                <div className={styles.title}>
                    <CriticalValue value={label} maxWidth='100%' />
                </div>
                <div className={styles.controls}>
                    { isProcessing
                        ? this.renderLoader()
                        : this.renderControls()
                    }
                </div>
            </div>
        );
    }
}

export default MarketListRow;
