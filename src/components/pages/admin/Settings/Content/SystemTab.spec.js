import React               from 'react';
import { shallow }         from 'enzyme';
import getMockStore        from '../../../../../__mocks__/storeMock';
import ConfirmationModal   from '../../shared/ConfirmationModal';
import LoadingNotification from '../../../../base/LoadingNotification';
import ChangelogModal      from '../../../../base/modals/ChangelogModal';
import ChangelogIcon       from '../../../../base/icons/Changelog';
import Tooltip             from '@material-ui/core/Tooltip';
import SystemTab           from './SystemTab'
import AppRefreshLoader    from '../../shared/AppRefreshLoader';

describe('SystemTab component', () => {
    let wrapper;
    let instance;

    beforeEach(() => {
        const mockStore = getMockStore(getMockAppState);
        const mockBoundActions = getMockBoundActions();

        wrapper = shallow(<SystemTab  store={mockStore} />).dive().dive();
        wrapper.setProps(mockBoundActions);

        instance = wrapper.instance();
    });

    it('should be created', () => {
        expect(instance).toBeTruthy();
    });

    it('should render loader if isLoading === true', () => {
        wrapper.setProps({ isLoading: true });
        const loaderWrapperList = wrapper.find(LoadingNotification);

        expect(loaderWrapperList.length).toBe(1);
    });

    it('should render check for updates button if status = "up-to-date"', () => {
        wrapper.setProps({ status: 'up-to-date' });
        const block = shallow(instance.renderFirstTab())

        const checkForUpdatesButtonList = block.find('.checkForUpdatesButton');

        expect(checkForUpdatesButtonList.length).toBe(1);
    });

    it('should render download updates button if status = "download-available"', () => {
        wrapper.setProps({ status: 'download-available' });
        const block = shallow(instance.renderFirstTab())

        const downloadUpdatesButtonList = block.find('.downloadUpdatesButton');

        expect(downloadUpdatesButtonList.length).toBe(1);
    });

    it('should render check for updates button if status = "update-available"', () => {
        wrapper.setProps({ status: 'update-available' });
        const block = shallow(instance.renderFirstTab())

        const applyUpdatesButtonList = block.find('.applyUpdatesButton');

        expect(applyUpdatesButtonList.length).toBe(1);
    });

    it('should render restart application button', () => {
        const block = shallow(instance.renderSecondTab())

        const restartAppButtonList = block.find('.restartAppButton');
        expect(restartAppButtonList.length).toBe(1);
    });

    it('should renderConfirmModal before restart', () => {
        instance.handleRestartApp = jest.fn();
        instance.runActionWithConfirm('restart')();
        const modalData = instance.state.modal;

        expect(modalData.props.title).toBe('Restart application');
        expect(modalData.props.text).toBe('Your application will stop working for few minutes');
        expect(modalData.props.labels).toEqual({ submit: 'Yes, restart application', cancel: 'Cancel' });

        expect(wrapper.find(ConfirmationModal).length).toBe(1);

        modalData.props.onSubmit();
        expect(instance.handleRestartApp).toHaveBeenCalled();
    });

    it('should renderConfirmModal before application update', () => {
        instance.handleApplyUpdates = jest.fn();
        instance.runActionWithConfirm('applyUpdates')();
        const modalData = instance.state.modal;

        expect(modalData.props.title).toBe('Update application',);
        expect(modalData.props.text).toBe('Your application will restart automatically');
        expect(modalData.props.labels).toEqual({ submit: 'Yes, update application', cancel: 'Cancel' });

        expect(wrapper.find(ConfirmationModal).length).toBe(1);

        modalData.props.onSubmit();
        expect(instance.handleApplyUpdates).toHaveBeenCalled();
    });

    it('should render app refresh loader if isAppRefresh === true', () => {
        wrapper.setState({ isAppRefresh: true });

        expect(wrapper.find(AppRefreshLoader).length).toBe(1);
    });

    describe('handleRunAction(actionType)()', () => {
        it('handleRunAction("checkForUpdates)() should run props.checkSystemUpdates', () => {
            instance.handleRunAction('checkForUpdates')();

            expect(instance.props.checkSystemUpdates).toHaveBeenCalled();
        });

        it('handleRunAction("downloadUpdates")() should run handleDownloadUpdates', () => {
            instance.handleDownloadUpdates = jest.fn();
            instance.handleRunAction('downloadUpdates')();

            expect(instance.handleDownloadUpdates).toHaveBeenCalled();
        });

        it('handleRunAction("applyUpdates")() should run handleApplyUpdates', () => {
            instance.handleApplyUpdates = jest.fn();
            instance.handleRunAction('applyUpdates')();

            expect(instance.handleApplyUpdates).toHaveBeenCalled();
        });

        it('handleRunAction("restart")() should run handleRestartApp', () => {
            instance.handleRestartApp = jest.fn();
            instance.handleRunAction('restart')();

            expect(instance.handleRestartApp).toHaveBeenCalled();
        });
    });

    it('handleOpenChangelogModal() should set isAppRefresh into true', () => {
        instance.handleOpenChangelogModal();

        expect(wrapper.state().modal.name).toBe('changelog');
    });

    it('refreshApplication() should set isAppRefresh into true', async () => {
        await instance.refreshApplication();

        expect(wrapper.state().isAppRefresh).toBe(true);
    });

    it('renderChangelogModal() should render ChangelogModal if sttae.modal.name === "changelog"', () => {
        wrapper.setState({ modal: { name: 'changelog' } });

        const modalsList = wrapper.find(ChangelogModal);

        expect(modalsList.length).toBe(1);
    });

    it('renderFirstTab() should render ChangelogIcon', () => {
        const block = shallow(instance.renderFirstTab());

        expect(block.find('.changelogIcon').length).toBe(1);
    });

    it('changelogIconWrapper click should open changelog modal', () => {
        instance.handleOpenChangelogModal = jest.fn();

        const block = shallow(instance.renderFirstTab());
        const controls = block.find('.changelogIconWrapper');

        controls.at(0).simulate('click');
        expect(instance.handleOpenChangelogModal).toHaveBeenCalled();
    });

    function getMockAppState() {
        return {
            systemUpdates: {
                runningActions  : [],
                lastUpdate      : +new Date(),
                availableUpdate : null,
                isLoading       : false
            }
        };
    }

    function getMockBoundActions() {
        return {
            checkSystemUpdates: jest.fn(),
        };
    }
});
