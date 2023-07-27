import React, { PureComponent } from 'react';
import PropTypes                from 'prop-types';
import classnames               from 'classnames/bind';
import { Tooltip }              from '@material-ui/core';
import Popover                  from '@material-ui/core/Popover';
import IconButton               from '@material-ui/core/IconButton';

import { Link }                 from 'react-router-dom';
// import InfoOutlinedIcon         from '@material-ui/icons/InfoOutlined';
import InfoIcon                 from '../../../../../base/icons/Info';
import CriticalValue            from '../../../../../base/CriticalValue';
import ProcessingIndicator      from '../../../../../base/ProcessingIndicator';
import {
    INSTALL_ICON,
    CHECK_ICON,
    UPDATE_ICON,
    DELETE_ICON
}                               from '../../etc/icons';
import styles                   from './ExtensionCard.less';

const cx = classnames.bind(styles);
const PROCESSING_NAMES = {
    installing   : 'Installing…',
    uninstalling : 'Deleting…',
    checking     : 'Checking…',
    updating     : 'Pulling…'
};

class ExtensionCard extends PureComponent {
    static propTypes = {
        extension : PropTypes.shape({
            description     : PropTypes.string,
            name            : PropTypes.string,
            state           : PropTypes.string,
            id              : PropTypes.string,
            link            : PropTypes.string,
            isProcessing    : PropTypes.bool,
            processingLabel : PropTypes.string,
            icon            : PropTypes.node,
            version         : PropTypes.string,
            title           : PropTypes.string
        }).isRequired,
        installExtension : PropTypes.func.isRequired,
        checkUpdates     : PropTypes.func.isRequired,
        updateService    : PropTypes.func.isRequired,
        deleteService    : PropTypes.func.isRequired,
        viewMode         : PropTypes.oneOf([ 'list', 'card' ]).isRequired
    }

    state={
        popoverEl : null
    }

    handleCheckUpdates = () => {
        const { extension:{ id }, checkUpdates } = this.props;

        checkUpdates(id);
    }

    handleUpdateService = async () => {
        const { extension:{ id, title }, updateService } = this.props;

        updateService({ entityId: id, name: title });
    }

    handleDeleteService = () => {
        const { extension:{ id, title, name }, deleteService } = this.props;

        deleteService({ entityId: id, title, name });
    }

    handleInstallExtension = () => {
        const { extension, installExtension } = this.props;

        installExtension(extension);
    }

    handleOpenInfo = (event) => {
        this.setState({
            popoverEl : event.currentTarget
        });
    }

    handleCloseInfo = () => {
        this.setState({
            popoverEl : null
        });
    }

    renderControls() {
        const { extension: { state, processingLabel } } = this.props;

        const controls = [];
        const updateIcon =  (<Tooltip key='update' title='Update'>
            <div className={styles.iconWrapper} onClick={this.handleUpdateService}>
                {UPDATE_ICON}
            </div>
        </Tooltip>);
        const checkIcon = (<Tooltip key='check-update' title='Check for updates'>
            <div className={styles.iconWrapper} onClick={this.handleCheckUpdates}>
                {CHECK_ICON}
            </div>
        </Tooltip>);
        const deleteIcon =  (<Tooltip key='delete'  title='Delete'>
            <div className={styles.iconWrapper} onClick={this.handleDeleteService}>
                {DELETE_ICON}
            </div>
        </Tooltip>);
        const installIcon = (<Tooltip key='install' title='Install'>
            <div className={cx('iconWrapper', 'installIcon')} onClick={this.handleInstallExtension}>
                {INSTALL_ICON}
            </div>
        </Tooltip>);
        const status = processingLabel || state;

        switch (status) {  // eslint-disable-line default-case
            case 'installed':
            case 'up-to-date': {
                controls.push(checkIcon, deleteIcon);
                break;
            }
            case 'update-available': {
                controls.push(updateIcon, deleteIcon);
                break;
            }
            case 'uninstalled': {
                controls.push(installIcon);
                break;
            }
            case 'installing':
            case 'updating':
            case 'checking':
            case 'uninstalling': {
                return this.renderLoader(status);
            }
        }

        return controls;
    }

    renderLoader(status) {
        const label = PROCESSING_NAMES[status];

        return (
            <div className={styles.processing}>
                <span>{label}</span>
                <ProcessingIndicator size='20px' />
            </div>
        );
    }

    renderInfoButton() {
        return (
            <IconButton
                className = {styles.infoButton}
                onClick   = {this.handleOpenInfo}
            >
                <InfoIcon  />
            </IconButton>
        );
    }

    renderPopover = () => {
        const { popoverEl } = this.state;
        const { description, link } = this.props.extension;

        const open = !!popoverEl;
        const id = open ? 'simple-popover' : undefined;

        return (
            <Popover
                id        = {id}
                open      = {open}
                anchorEl  = {popoverEl}
                classes   = {{
                    paper : styles.popover
                }}
                onClose      = {this.handleCloseInfo}
                anchorOrigin = {{
                    vertical   : 'bottom',
                    horizontal : 'center'
                }}
                transformOrigin={{
                    vertical   : 'top',
                    horizontal : 'center'
                }}
            >
                <div className={styles.popoverContent}>
                    <div className={styles.description}>
                        {description}
                    </div>
                    <div className={styles.link}>
                        <Link
                            to     = {link}
                            target = '_blank'
                            noreferrer
                            noopener
                        >
                            npm link
                        </Link>
                    </div>
                </div>
            </Popover>
        );
    }

    render() {
        const { extension: { version, icon, title }, viewMode } = this.props;
        const extensionCardCN = cx(styles.ExtensionCard, {
            [`viewMode-${viewMode}`] : viewMode
        });
        const isListViewMode = viewMode === 'list';

        return (
            <div className={extensionCardCN}>
                <div className={styles.extensionIcon}>
                    {icon}
                </div>
                <div className={styles.textWrapper}>
                    <div className={styles.title}>
                        <CriticalValue value={title} maxWidth='100%' />
                    </div>
                    <div className={styles.subTitle}>
                        {version && <CriticalValue value={`v ${version}`} maxWidth='100%' />}
                        { isListViewMode ? this.renderInfoButton() : null }
                    </div>
                </div>
                { !isListViewMode ? this.renderInfoButton() : null }
                <div className={styles.controls}>
                    { this.renderControls()}
                </div>
                {this.renderPopover()}
            </div>
        );
    }
}

export default ExtensionCard;
