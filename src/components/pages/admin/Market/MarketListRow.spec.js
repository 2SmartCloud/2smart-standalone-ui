import React from 'react';
import { shallow } from 'enzyme';
import MarketListRow from './MarketListRow';
import {MARKET_SERVICES_MOCK_LIST} from '../../../../__mocks__/marketServicesMock';

describe('MarketListRow component', () => {
    let wrapper;
    let instance;

    beforeEach(() => {
        const mockProps = getMockProps();

        wrapper = shallow(<MarketListRow {...mockProps} />);
        instance = wrapper.instance();
    });

    it('should be created', () => {
        expect(instance).toBeDefined();
    });

    it('handleInstallService() should call installService', () => {
        instance.handleInstallService();

        expect(instance.props.installService).toHaveBeenCalledWith(instance.props.service);
    });

    it('handleCheckUpdates() should call checkUpdates', () => {
        instance.handleCheckUpdates();

        expect(instance.props.checkUpdates).toHaveBeenCalledWith(instance.props.service);
    });

    it('handleUpdateService() should call updateService', () => {
        instance.handleUpdateService();

        expect(instance.props.updateService).toHaveBeenCalledWith(instance.props.service);
    });

    it('handleDeleteService() should call deleteService', () => {
        instance.handleDeleteService();

        expect(instance.props.deleteService).toHaveBeenCalledWith(instance.props.service);
    });

    describe('checkIsProcessing() should return processing flag', () => {
        it('pulling', () => {
            wrapper.setProps({ service: { state: 'pulling' } });

            expect(instance.checkIsProcessing()).toBeTruthy();
        });

        it('removing', () => {
            wrapper.setProps({ service: { state: 'removing' } });

            expect(instance.checkIsProcessing()).toBeTruthy();
        });
        
        it('checking', () => {
            wrapper.setProps({ service: { state: 'pulled', isProcessing: true } });

            expect(instance.checkIsProcessing()).toBeTruthy();
        });


        it('pulled', () => {
            wrapper.setProps({ service: { state: 'pulled' } });

            expect(instance.checkIsProcessing()).toBeFalsy();
        });

        it('removed', () => {
            wrapper.setProps({ service: { state: 'removed' } });

            expect(instance.checkIsProcessing()).toBeFalsy();
        });
    });

    function getMockProps() {
        return {
            service        : MARKET_SERVICES_MOCK_LIST[0],
            viewMode       : 'list',
            installService : jest.fn(),
            checkUpdates   : jest.fn(),
            updateService  : jest.fn(),
            deleteService  : jest.fn()
        };
    }
});
