import React                from 'react';
import { shallow }          from 'enzyme';   

import getMockStore         from '../../../__mocks__/storeMock';
import { DISCOVERIES }      from '../../../__mocks__/discoveries';
import DiscoverDevicesPopup from './DiscoverDevicesPopup';
import ProcessingInstruction from '../ProcessingIndicator.js';


describe('Discover Devices Popup', () => {
    let wrapper;
    let instance;

    beforeEach(() => {
        const mockStore = getMockStore(getMockAppState);
        const mockBoundActions = getMockBoundActions();
        wrapper = shallow(<DiscoverDevicesPopup store={mockStore}{...mockBoundActions} />).dive().dive();
        
        instance = wrapper.instance();
    });

    it('should be created', () => {
        expect(instance).toBeTruthy();
    });

    it('should render devices', () => {
        const spy = jest.spyOn(instance, 'renderDevices');
        wrapper.setProps({
            discovery:{
                isFetching:false,
                isLoading:false,
                discoveries:DISCOVERIES
            }
        })
        expect(spy).toHaveBeenCalled();
        expect(wrapper.find('.devicesContainer')).toBeTruthy();
    });

    it('should render nothing to show notification', () => {
        wrapper.setProps({
            discovery:{
                isFetching:false,
                isLoading:false,
                discoveries:{}
            }
        })
        expect(wrapper.find('.nothingToShowIcon')).toBeTruthy();
    });

    it('should render Spinner', () => {
        wrapper.setProps({
            discovery:{
                isFetching:true,
                isLoading:false,
                discoveries:{}
            }
        })
        expect(wrapper.find(ProcessingInstruction)).toBeTruthy();
    });


    it('should set delete data to state and open delete modal', () => {
        wrapper.setProps({
            showDeleteModal : jest.fn()
        });

        instance.handleOpenDeleteModal({device:{name:'device'}, deviceId:'deviceId'})();

        expect(instance.props.showDeleteModal).toHaveBeenCalled();

    });

    it('should confirm deleting of discovery', () => {
        const payload = { device: { name : 'device', entityTopic : 'entityId' }, deviceId : 'deviceId' };

        wrapper.setProps({
            deleteDiscovery : jest.fn()
        });

        instance.handleOpenDeleteModal(payload)();
        instance.handleDeleteDiscoveryConfirm();
        expect(instance.props.deleteDiscovery).toHaveBeenCalledWith('entityId');
    });

    it('should close deleteModal', () => {
        wrapper.setProps({
            hideDeleteModal : jest.fn()
        });

        instance.handleDeleteDiscoveryCancel();
        expect(instance.props.hideDeleteModal).toHaveBeenCalled();
    });

    it('should close Discover Devices Popup', () => {

        wrapper.setProps({
            closeLastPopup : jest.fn()
        });

        instance.handleClosePopup();
        expect(instance.props.closeLastPopup).toHaveBeenCalled();
    });
    
    function getMockAppState() {
        return {
            discovery : {
                isFetching  : false,
                isLoading   : false,
                discoveries : DISCOVERIES
            },
            applicationInterface : {
                deleteModal : {
                    isOpen : false
                }
            }
        };
    }

    function getMockBoundActions() {
        return {
            hideDeleteModal : jest.fn(),
            showDeleteModal : jest.fn(),
            acceptDiscovery : jest.fn(),
            deleteDiscovery : jest.fn(),
            closeLastPopup : jest.fn()
        };
    }
});
