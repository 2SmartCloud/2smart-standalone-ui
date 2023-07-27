import React, { PureComponent }  from 'react';
import PropTypes                 from 'prop-types';
import { connect }               from 'react-redux';
import classnames                from 'classnames/bind';
import Tooltip                   from '@material-ui/core/Tooltip';
import * as SystemUpdatesActions from '../../../../../actions/systemUpdates';
import Button                    from '../../../../base/Button';
import ChangelogIcon             from '../../../../base/icons/Changelog';
import LoadingNotification       from '../../../../base/LoadingNotification';
import ChangelogModal            from '../../../../base/modals/ChangelogModal';
import ConfirmationModal         from '../../shared/ConfirmationModal';
import AppRefreshLoader          from '../../shared/AppRefreshLoader';
import BaseContentWrapper        from './BaseContentWrapper/';
import styles                    from './SystemTab.less';

const cx = classnames.bind(styles);

class SystemTab extends PureComponent {
    static propTypes = {
        status : PropTypes.oneOf([
            'up-to-date',
            'download-available',
            'downloading',
            'update-available',
            'updating',
            'restarting'
        ]),
        lastUpdate         : PropTypes.string,
        availableUpdate    : PropTypes.string,
        isLoading          : PropTypes.bool.isRequired,
        checkSystemUpdates : PropTypes.func.isRequired,
        downloadUpdates    : PropTypes.func.isRequired,
        restartApplication : PropTypes.func.isRequired,
        applyUpdates       : PropTypes.func.isRequired,
        runningActions     : PropTypes.arrayOf(PropTypes.string).isRequired
    }

    static defaultProps = {
        status          : void 0,
        lastUpdate      : '',
        availableUpdate : ''
    }

    state = {
        modal : {
            name : ''
        },
        isAppRefresh : false,
        isModalOpen  : true
    }

    componentDidUpdate(prevProps) {
        const statusToRefresh = [ 'restarting', 'updating' ];
        const isPrevStatusToRefresh = statusToRefresh.includes(prevProps.status);
        const isStatusToRefresh = statusToRefresh.includes(this.props.status);

        if (isStatusToRefresh && !isPrevStatusToRefresh) {
            this.refreshApplication();
        }
    }

    handleRunAction =  (actionType) => async () => {
        if (this.isActionRunning) return;
        this.isActionRunning = true;
        const handler = this.getActionHandler(actionType);

        if (handler) await handler();

        this.setState({
            modal : {
                name : ''
            }
        });
        this.isActionRunning = false;
    }

    handleRestartApp = async () => {
        this.handleCloseModal();
        const { restartApplication } = this.props;

        await restartApplication();
    }

    handleDownloadUpdates = async () => {
        const { downloadUpdates } = this.props;

        await downloadUpdates();
    }

    handleApplyUpdates = async () => {
        this.handleCloseModal();
        const { applyUpdates } = this.props;

        await applyUpdates();
    }

    handleOpenChangelogModal = () => {
        this.setState({
            modal : { name: 'changelog' }
        });
    }

    handleCloseModal = () => {
        this.setState({
            modal : { name: '' }
        });
    }

    getActionHandler = type => {
        const { checkSystemUpdates } = this.props;

        switch (type) {
            case 'checkForUpdates':
                return checkSystemUpdates;
            case 'downloadUpdates':
                return this.handleDownloadUpdates;
            case 'applyUpdates':
                return this.handleApplyUpdates;
            case 'restart':
                return this.handleRestartApp;
            default:
                return void 0;
        }
    }

    refreshApplication = () => {
        this.setState({
            isAppRefresh : true
        });

        setTimeout(() => {
            window.location.reload();   // eslint-disable-line
        }, 3 * 60 * 1000);   // 3 minutes
    }

    runActionWithConfirm = (actionType) => () => {
        const modalName = actionType;
        let modalProps = void 0;

        switch (actionType) {
            case 'restart':
                modalProps = {
                    title    : 'Restart application',
                    text     : 'Your application will stop working for few minutes',
                    labels   : { submit: 'Yes, restart application', cancel: 'Cancel' },
                    onSubmit : this.handleRunAction(actionType),
                    onClose  : this.handleCloseModal
                };
                break;
            case 'applyUpdates':
                modalProps = {
                    title    : 'Update application',
                    text     : 'Your application will restart automatically',
                    labels   : { submit: 'Yes, update application', cancel: 'Cancel' },
                    onSubmit : this.handleRunAction(actionType),
                    onClose  : this.handleCloseModal
                };
                break;
            default:
                break;
        }

        this.setState({
            modal : {
                name  : modalName,
                props : modalProps
            }
        });
    }

    renderConfirmModal = () => {
        const { modal } = this.state;
        const { name, props = {} } = modal;

        if (name === 'changelog') return null;

        return (
            <ConfirmationModal
                onClose = {this.handleCloseModal}
                isOpen  = {!!name && name !== 'changelog'}
                {...props}
            />
        );
    }

    renderChangelogModal = () => {
        const { modal } = this.state;
        const { name, props = {} } = modal;

        if (name !== 'changelog') return null;

        return (
            <ChangelogModal
                onClose = {this.handleCloseModal}
                isOpen  = {name === 'changelog'}
                {...props}
            />
        );
    }

    renderFirstTab = () => {
        const { lastUpdate = 'lastUpdate', availableUpdate, runningActions, status } = this.props;

        const isCheckForUpdates   = runningActions.includes('checkUpdates');
        const isDownloading       = runningActions.includes('downloadUpdates') || status === 'downloading';
        const isApplyUpdates      = runningActions.includes('applyUpdates') || status === 'updating';

        const isDownloadAvailable = status && [ 'downloading', 'download-available' ].includes(status);
        const isApplyAvailable    = status && [ 'updating', 'update-available' ].includes(status);
        const isUpToDate          = status === 'up-to-date' || (!isDownloadAvailable && !isApplyAvailable);
        const isActionRunning     = [ 'updating', 'downloading', 'restarting' ].includes(status) || runningActions.length;

        return (
            <div>
                <div className={styles.typo}>
                    <div className={styles.title}>
                        Your last system update was -
                        <div className={cx(styles.bold, styles.lastUpdate)}>
                            {lastUpdate}
                            <Tooltip title='Release notes'>
                                <div
                                    className = {styles.changelogIconWrapper}
                                    onClick   = {this.handleOpenChangelogModal}
                                >
                                    <ChangelogIcon
                                        className = {styles.changelogIcon}
                                    />
                                </div>
                            </Tooltip>
                        </div>
                    </div>
                    { isUpToDate
                        ? <div className={styles.subTitle}>There are no available updates</div>
                        : null
                    }
                    { isDownloadAvailable
                        ? (
                            <div className={styles.subTitle}>
                            Available update from <span className={styles.bold}>{availableUpdate}</span>
                            </div>
                        ) : null
                    }
                    { isApplyAvailable
                        ? (
                            <div className={styles.subTitle}>
                            Updates from <span className={styles.bold}>{availableUpdate}</span> are already downloaded
                            </div>
                        ) : null
                    }
                </div>
                <div className={styles.controlWrapper}>
                    { isUpToDate
                        ? (
                            <Button
                                text       = 'Check for updates'
                                color      = 'action'
                                isFetching = {isCheckForUpdates}
                                isDisabled = {isActionRunning}
                                className  = {cx(styles.button, styles.checkForUpdatesButton)}
                                onClick    = {this.handleRunAction('checkForUpdates')}
                            />
                        ) : null
                    }
                    { isDownloadAvailable
                        ? (
                            <Button
                                text       = 'Download updates'
                                color      = 'action'
                                isFetching = {isDownloading}
                                isDisabled = {isActionRunning}
                                className  = {cx(styles.button, styles.downloadUpdatesButton)}
                                onClick    = {this.handleRunAction('downloadUpdates')}
                            />
                        ) : null
                    }
                    { isApplyAvailable
                        ? (
                            <Button
                                text       = 'Apply updates'
                                color      = 'action'
                                isFetching = {isApplyUpdates}
                                isDisabled = {isActionRunning}
                                className  = {cx(styles.button, styles.applyUpdatesButton)}
                                onClick    = {this.runActionWithConfirm('applyUpdates')}
                            />
                        ) : null
                    }
                </div>
            </div>
        );
    }

    renderSecondTab = () => {
        const { runningActions, status } = this.props;
        const isRestarting    = runningActions.includes('restart') || status === 'restarting';
        const isActionRunning = [ 'updating', 'downloading', 'restarting' ].includes(status) || runningActions.length;

        return (
            <div className={styles.restartBlock}>
                <div className={styles.controlWrapper}>
                    <Button
                        text       = 'Restart application'
                        color      = 'action'
                        isFetching = {isRestarting}
                        isDisabled = {isActionRunning}
                        className  = {cx(styles.button, styles.restartAppButton)}
                        onClick    = {this.runActionWithConfirm('restart')}
                    />
                </div>
            </div>
        );
    }

    render() {
        const { isLoading } = this.props;
        const { isAppRefresh } = this.state;

        if (isLoading) {
            return (
                <div className={styles.SystemTab}>
                    <div className={styles.contentWrapper}>
                        <LoadingNotification text='Loading data' />
                    </div>
                </div>
            );
        }

        return (
            <div className={styles.SystemTab}>
                <BaseContentWrapper
                    blocks={
                        [ {
                            renderContent : this.renderFirstTab
                        },
                        {
                            title         : 'Is something wrong? You can restart your application.',
                            renderContent : this.renderSecondTab
                        }  ]
                    }
                />
                { this.renderConfirmModal() }
                { this.renderChangelogModal() }
                { isAppRefresh && <AppRefreshLoader /> }
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {
        runningActions  : state.systemUpdates.runningActions,
        lastUpdate      : state.systemUpdates.lastUpdate,
        availableUpdate : state.systemUpdates.availableUpdate,
        status          : state.systemUpdates.status,
        isLoading       : state.systemUpdates.isLoading
    };
}

const mapDispatchToProps = {
    ...SystemUpdatesActions
};

export default connect(mapStateToProps, mapDispatchToProps)(SystemTab);

