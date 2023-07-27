import React from 'react';
import { shallow } from 'enzyme';
import LoadingNotification from '../../../../base/LoadingNotification';
import Image from '../../../../base/Image';
import { MARKET_SERVICES_MOCK_LIST } from '../../../../../__mocks__/marketServicesMock';
import { USER_SERVICES_LIST_MOCK } from '../../../../../__mocks__/userServicesMock';
import AddonTab from './AddonsTab.js';

describe('AddonTab component', () => {
    let wrapper;
    let instance;

    beforeEach(() => {
        const mockProps = getMockProps();

        wrapper = shallow(<AddonTab {...mockProps} />);
        instance = wrapper.instance();
    });

    it('should be created', () => {
        expect(instance).toBeTruthy();
    });

    it('should render loader', () => {
        wrapper.setProps({ marketServices: { isFetching: true } });

        const loader = wrapper.find(LoadingNotification);

        expect(loader).toBeTruthy();
    });

    it('handleModalOpen() should set open state for modal', () => {
        instance.handleModalOpen({ title: 'Modal title', text: 'modal text', labels: { submit: 'Submit' } });

        const expected = {
            isOpen : true,
            title  : 'Modal title',
            text   : 'modal text',
            labels : { submit: 'Submit' }
        };

        expect(wrapper.state().modal).toEqual(expected);
    });

    it('handleModalClose() should set closed state', () => {
        wrapper.setState({ modal: { isOpen: true } });
        expect(wrapper.state().modal.isOpen).toBeTruthy();

        instance.handleModalClose();

        expect(wrapper.state().modal.isOpen).toBeFalsy();
    });

    it('handleInstallService() should install service', () => {
        const service = { name: 'knx', label: 'Knx Bridge' };

        instance.handleInstallService(service);

        expect(instance.props.installMarketService).toHaveBeenCalledWith('knx');
    });

    it('handleCheckUpdates() should call check updates action', () => {
        instance.handleCheckUpdates({ name: 'knx' });

        expect(instance.props.checkMarketServiceUpdate).toHaveBeenCalledWith('knx');
    });

    it('handleUpdateService() should set context and call open modal handler', () => {
        spyOn(instance, 'handleModalOpen');
        spyOn(instance, 'runModalAction').and.callFake(action => action());

        const service = { name: 'knx', label: 'Knx Bridge' };
        const expected = {
            title  : 'Update Knx Bridge',
            text   : 'All instances of this service will be restarted!',
            labels : { submit: 'Yes, update service', cancel: 'Cancel' }
        };

        instance.handleUpdateService(service);

        expect(instance.handleModalOpen).toHaveBeenCalledWith(expected);

        instance.modalSubmitHandler();

        expect(instance.props.updateMarketService).toHaveBeenCalledWith('knx');
    });

    describe('handleDeleteService() should set context and call open modal handler', () => {
        it('without running instances', () => {
            spyOn(instance, 'handleModalOpen');
            spyOn(instance, 'runModalAction').and.callFake(action => action());

            const service = { name: 'knx', label: 'Knx Bridge', hasRunningInstances: false };
            const expected = {
                title  : 'Delete Knx Bridge',
                text   : 'Are you sure you want to delete this addon?',
                labels : { submit: 'Yes, delete addon', cancel: 'Cancel' }
            };

            instance.handleDeleteService(service);

            expect(instance.handleModalOpen).toHaveBeenCalledWith(expected);

            instance.modalSubmitHandler();

            expect(instance.props.deleteMarketService).toHaveBeenCalledWith('knx');
        });

        it('with running instances', () => {
            spyOn(instance, 'handleModalOpen');
            spyOn(instance, 'runModalAction').and.callFake(action => action());

            const service = { name: 'knx', label: 'Knx Bridge', hasRunningInstances: true };
            const expected = {
                title  : 'Delete Knx Bridge',
                text   : 'You have to stop all running instances of this addon\nbefore you are able to delete it!',
                labels : { cancel: 'Cancel' }
            };

            instance.handleDeleteService(service);

            expect(instance.handleModalOpen).toHaveBeenCalledWith(expected);
            expect(instance.modalSubmitHandler).toBeNull();
        });
    });

    it('getRunningInstances() should return length of running instances by given type', () => {
        const result = instance.getRunningInstances('knx');

        expect(result).toBeTruthy();
    });

    it('fulfillServicesInfo() should add additional fields to services list', () => {
        spyOn(instance, 'getRunningInstances').and.callFake(name => name === 'knx');

        const services = [
            { name: 'knx', icon: 'static/icon.svg', label: 'Knx' },
            { name: 'modbus', label: 'Modbus' }
        ];
        const expected = [
            {
                name                : 'knx',
                icon                : (<Image src='static/icon.svg' renderFallback={() => 'K'} />),
                label               : 'Knx',
                hasRunningInstances : true
            },
            {
                name                : 'modbus',
                icon                : 'M',
                label               : 'Modbus',
                hasRunningInstances : false
            }
        ];

        const result = instance.fulfillServicesInfo(services);

        expect(result[0].name).toEqual(expected[0].name);
        expect(result[0].label).toEqual(expected[0].label);
        expect(result[0].icon).toBeDefined();
        // expect(result[0].icon instanceof Image).toBe(true);
        expect(result[0].hasRunningInstances).toEqual(expected[0].hasRunningInstances);

        expect(result[1]).toEqual(expected[1]);
    });

    it('runModalAction() should call given action and close modal', () => {
        spyOn(instance, 'handleModalClose').and.stub();
        const action = jest.fn();

        instance.runModalAction(action);

        expect(action).toHaveBeenCalled();
        expect(instance.handleModalClose).toHaveBeenCalled();
    });

    function getMockProps() {
        return {
            marketServices : {
                list        : MARKET_SERVICES_MOCK_LIST,
                isFetching  : false,
                searchQuery : '',
                sortOrder   : 'ASC',
                currentPage : 1

            },
            userServices : {
                list       : USER_SERVICES_LIST_MOCK,
                isFetching : false
            },
            setSearchQuery           : jest.fn(),
            setSortOrder             : jest.fn(),
            setCurrentPage           : jest.fn(),
            installMarketService     : jest.fn(),
            checkMarketServiceUpdate : jest.fn(),
            updateMarketService      : jest.fn(),
            deleteMarketService      : jest.fn()

        };
    }
});
