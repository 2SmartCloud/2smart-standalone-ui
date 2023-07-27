import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { animateScroll } from 'react-scroll';
import classnames from 'classnames/bind';
import { MAX_SCREEN_WIDTH_TABLET } from '../../../assets/constants';
import { HOME, NOT_FOUND } from '../../../assets/constants/routes';
import * as HomieActions from '../../../actions/homie';
import * as TimeseriesActions from '../../../actions/client/timeseries';
import * as ScreenActions from '../../../actions/client/screens';
import * as DashboardActions from '../../../actions/client/dashboard';
import * as InterfaceActions from '../../../actions/interface';
import * as UserActions from '../../../actions/user';
import  * as AliasActions  from '../../../actions/alias';
import * as GroupsActions from '../../../actions/groups';
import NoWidgetsNotification from '../../base/nothingToShowNotification/Widgets';
import ProcessingIndicator from '../../base/ProcessingIndicator';
import Modal from '../../base/Modal';
import LoadingNotification from '../../base/LoadingNotification';
import WidgetsGrid from '../../base/WidgetsGrid';
import DeleteWarning from '../../base/DeleteWarning';
import Sidebar from '../../layouts/client/Sidebar.js';
import Header from '../../layouts/client/Header';
import PincodeForm from '../../base/modals/Pincode';
import SelectWidget from './Dashboard/SelectWidget';
import styles from './Dashboard.less';

const COLOR_BORDER = '#ECECEC';
const customStyles = {
    control : css => ({
        ...css,
        cursor      : 'pointer',
        minWidth    : '120px',
        borderColor : COLOR_BORDER,
        '&:hover'   : { borderColor: COLOR_BORDER },
        boxShadow   : '#000'
    }),
    placeholder : css => ({
        ...css,
        // color     : COLOR_TEXT,
        fontSize  : '14px',
        textAlign : 'center',
        width     : '90%'
    })
};
const cx = classnames.bind(styles);

class Dashboard extends PureComponent {
    constructor(props) {
        super(props);

        this.state = {
            // isModalOpen   : false,
            isSidebarOpen : window.innerWidth > MAX_SCREEN_WIDTH_TABLET
        };

        this.grid = React.createRef();
    }

    componentDidMount() {
        this.initData();
        document.addEventListener('orientationchange', this.handleOrientationChange);
    }

    componentDidUpdate(prevProps) {
        const { screen, isClientPanelAccessGranted, getScreen, isDeleting } = this.props;

        if (prevProps.isClientPanelAccessGranted && !isClientPanelAccessGranted && !isDeleting) {
            getScreen(screen.id);
        }

        this.handleScreensFetching(prevProps);
        this.handleScreenFetching(prevProps);
        this.handleSecurityModeStatus(prevProps);
    }

    componentWillUnmount() {
        document.removeEventListener('orientationchange', this.handleOrientationChange);
    }

    handleScreensFetching = prevProps => { //eslint-disable-line
        const { isFetching, screens, match, getDevices } = this.props;

        if (prevProps.isFetching && !isFetching) {
            getDevices();
            this.handleInvalidScreenId(screens, match);
        }
    }

    handleScreenFetching = prevProps => {
        const { screen, runTimeSeries } = this.props;

        if (prevProps.screen.isFetching && !screen.isFetching) {
            runTimeSeries();
        }
    }

    handleSecurityModeStatus = prevProps => {
        const { hidePinForm, screen, isSecureModeEnabled } = this.props;

        if (
            prevProps.screen.isParentControlEnabled && !screen.isParentControlEnabled
            || prevProps.isSecureModeEnabled && !isSecureModeEnabled
        ) {
            hidePinForm();
        }
    }

    handleInvalidScreenId = (screens, match) => {
        const existing = screens.find(({ id }) => id === match.params.id);

        if (existing && existing.isActive && existing.widgets && existing.widgets.length) return;

        const firstScreenId = screens[0] ? screens[0].id : 0;
        const screenId = match.params.id || firstScreenId;
        const screen = screens.find(({ id }) => id === screenId);
        const { path } = match;
        const isScreenIdValid = screen || path === HOME;
        const { getScreen } = this.props;

        if (isScreenIdValid) {
            const { selectScreen } = this.props;

            selectScreen({ id: screenId });

            if (screen && !screen.isFetching) {
                getScreen(screenId);
            }
        } else {
            const { history } = this.props;

            history.replace('');
            history.push(NOT_FOUND);
        }
    }

    handleOrientationChange = () => {
        setTimeout(() => window.dispatchEvent(new Event('resize')), 300);
    }

    handleModalOpen = () => {
        const { showDeleteModal } = this.props;

        showDeleteModal();
    }

    handleModalClose = () => {
        const { isDeleting, hideDeleteModal } = this.props;

        if (!isDeleting) hideDeleteModal();
    }

    handleDeleteScreen = async () => {
        const { screen, isError, deleteScreen } = this.props;

        await deleteScreen({ id: screen.id });

        this.scrollToTop();

        if (!isError) this.handleModalClose();
    }

    handleScreenSave = () => {
        const { updateScreen, screen } = this.props;
        const { id, layout } = screen;

        const payload = {
            layout : this.grid.current ? this.grid.current.props.layouts : layout
        };

        updateScreen(id, payload);
    }

    handleToggleSidebar = () => {
        this.setState({
            isSidebarOpen : !this.state.isSidebarOpen
        });
        setTimeout(() => window.dispatchEvent(new Event('resize')), 200);
    }

    initData = () => {
        const {  getScreens, getThresholds, getAliases, getScenariosHomie,
            getGroupsEntities } = this.props;

        getGroupsEntities();
        getScreens();
        getThresholds();
        getScenariosHomie();
        getAliases();
    }

    closeSidebar = () => {
        this.setState({
            isSidebarOpen : false
        });
    }

    scrollToTop() {
        animateScroll.scrollToTop({
            containerId : 'screens-list-container'
        });
    }

    renderScreenHeader = () => {
        const { screen } = this.props;
        const { isEditMode } = screen;

        return isEditMode ?
            <div className={styles.header}>
                <h2>Screen settings</h2>
                <SelectWidget
                    placeholder='Add widget'
                    customStyles={customStyles}
                />
            </div> : null;
    }

    renderPinForm = () => {
        const { isPinFormOpen,
            pinFormProps,
            pinFormProps : { cb }
        } = this.props;

        return (
            isPinFormOpen ?
                <div className={styles.pinFormWrapper}>
                    <PincodeForm
                        {...pinFormProps}
                        onSubmit={cb}
                    />
                </div> :
                null
        );
    }

    render() {
        const { isSidebarOpen } = this.state;
        const {
            screen,
            isCreating,
            isLastScreen,
            isDeleting,
            isDevicesFetching,
            isDeleteModalOpen
        } = this.props;
        const DashboardCN = cx({
            Dashboard : true,
            minimize  : screen.isEditMode
        });
        const isWidgetsExist = screen.fetched && screen.widgets && screen.widgets.length;
        const isFetching = screen.isFetching && !isCreating;
        const isUpdating = screen.isUpdating || isCreating;

        return (
            <div className={styles.container}>
                <Sidebar
                    isOpen={isSidebarOpen}
                    closeSidebar={this.closeSidebar}
                />
                <div className={styles.column}>
                    <Header
                        onBurgerClick={this.handleToggleSidebar}
                        onScreenSave = {this.handleScreenSave}
                        screen={screen}
                        isLastScreen={isLastScreen}
                        onModalOpen={this.handleModalOpen}
                        onModalClose={this.handleModalClose}
                    />
                    <div className={DashboardCN}>
                        {this.renderScreenHeader()}
                        {
                            !isFetching && !isDevicesFetching && !isWidgetsExist
                                ? <NoWidgetsNotification isUpdating={isUpdating} />
                                : null
                        }
                        {
                            isWidgetsExist && !isDevicesFetching ?
                                <WidgetsGrid
                                    key={screen.id}
                                    innerRef={this.grid}
                                    screen={screen}
                                    isEditMode={screen.isEditMode}
                                    isUpdating={isUpdating}
                                /> : null
                        }
                        {this.renderPinForm()}
                        {
                            (isFetching || isDevicesFetching)
                                ? <LoadingNotification text={'Loading widgets'} />
                                : null
                        }
                        {
                            isUpdating ?
                                <div className={styles.loader}>
                                    <ProcessingIndicator size='50px' />
                                </div> : null
                        }
                    </div>
                    <Modal
                        isOpen={isDeleteModalOpen}
                        onClose={this.handleModalClose}
                    >
                        <DeleteWarning
                            name={screen.name}
                            onClose={this.handleModalClose}
                            onAccept={this.handleDeleteScreen}
                            isFetching={isDeleting}
                            confirmText={'Yes, delete screen'}
                            itemType='screen'
                        />
                    </Modal>
                </div>
            </div>
        );
    }
}


Dashboard.propTypes = {
    deleteScreen               : PropTypes.func.isRequired,
    screen                     : PropTypes.object.isRequired,
    isLastScreen               : PropTypes.bool,
    isDeleting                 : PropTypes.bool,
    isError                    : PropTypes.bool,
    isFetching                 : PropTypes.bool.isRequired,
    isCreating                 : PropTypes.bool.isRequired,
    isDevicesFetching          : PropTypes.bool.isRequired,
    isPinFormOpen              : PropTypes.bool.isRequired,
    isClientPanelAccessGranted : PropTypes.bool.isRequired,
    isSecureModeEnabled        : PropTypes.bool.isRequired,
    getThresholds              : PropTypes.func.isRequired,
    getScreens                 : PropTypes.func.isRequired,
    getScreen                  : PropTypes.func.isRequired,
    getSettings                : PropTypes.func.isRequired,
    getDevices                 : PropTypes.func.isRequired,
    getGroupsEntities          : PropTypes.func.isRequired,
    selectScreen               : PropTypes.func.isRequired,
    updateScreen               : PropTypes.func.isRequired,
    hidePinForm                : PropTypes.func.isRequired,
    validateClientPanelToken   : PropTypes.func.isRequired,
    showDeleteModal            : PropTypes.func.isRequired,
    hideDeleteModal            : PropTypes.func.isRequired,
    getScenariosHomie          : PropTypes.func.isRequired,
    match                      : PropTypes.object.isRequired,
    history                    : PropTypes.object.isRequired,
    pinFormProps               : PropTypes.object.isRequired,
    screens                    : PropTypes.array.isRequired,
    isDeleteModalOpen          : PropTypes.bool.isRequired,
    runTimeSeries              : PropTypes.func.isRequired,
    getAliases                 : PropTypes.func.isRequired
};

Dashboard.defaultProps = {
    isLastScreen : true,
    isDeleting   : false,
    isError      : false
};

function mapStateToProps(state) {
    return {
        screens                    : state.client.dashboard.screens,
        screen                     : state.client.dashboard.screens.find(({ isActive }) => isActive === true) || {},
        isLastScreen               : state.client.dashboard.screens.length === 1 || false,
        isDeleting                 : state.client.dashboard.isDeleting,
        isError                    : state.client.dashboard.isError,
        isFetching                 : state.client.dashboard.isFetching,
        isCreating                 : state.client.dashboard.isCreating,
        isDevicesFetching          : state.homie.isFetching,
        isTsRunning                : state.client.timeseries.isRunning,
        isPinFormOpen              : state.applicationInterface.pinForm.isOpen,
        pinFormProps               : state.applicationInterface.pinForm.props,
        isDeleteModalOpen          : state.applicationInterface.deleteModal.isOpen,
        isClientPanelAccessGranted : state.user.isClientPanelAccessGranted,
        isSecureModeEnabled        : state.user.settings.isSecureModeEnabled.value
    };
}

export default connect(
    mapStateToProps,
    {
        ...GroupsActions,
        ...ScreenActions,
        ...DashboardActions,
        ...InterfaceActions,
        ...HomieActions,
        ...TimeseriesActions,
        ...UserActions,
        ...AliasActions
    }
)(Dashboard);
