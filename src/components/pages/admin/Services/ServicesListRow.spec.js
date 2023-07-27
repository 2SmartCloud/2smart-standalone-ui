import React from 'react';
import { shallow } from 'enzyme';
import ServicesListRow from './ServicesListRow';

describe('ServicesListRow component', () => {
    let wrapper;
    let instance;

    beforeEach(() => {
        const mockProps = getMockProps();

        wrapper = shallow(<ServicesListRow {...mockProps} />);
        instance = wrapper.instance();
    });

    it('should be created', () => {
        expect(instance).toBeTruthy();
    });

    describe('handleSwitchChange()', () => {
        it('should call deactivateService while status is ACTIVE', async () => {
            await instance.handleSwitchChange();

            expect(instance.props.deactivateService).toHaveBeenCalledWith('1');
        });

        it('should call activateService while status is INACTIVE', async () => {
            wrapper.setProps({ service: {
                    id     : '1',
                    title  : 'Test Service',
                    state  : 'started',
                    status : 'INACTIVE',
                    icon   : 'S',
                } });

            await instance.handleSwitchChange();

            expect(instance.props.activateService).toHaveBeenCalledWith('1');
        });
    });

    describe('checkIsProcessing() should return service status', () => {
        it('starting state', () => {
            wrapper.setProps({ service: { state: 'starting' } });

            expect(instance.checkIsProcessing()).toBeTruthy();
        });

        it('stopping state', () => {
            wrapper.setProps({ service: { state: 'stopping' } });

            expect(instance.checkIsProcessing()).toBeTruthy();
        });

        it('started state', () => {
            wrapper.setProps({ service: { state: 'started' } });

            expect(instance.checkIsProcessing()).toBeFalsy();
        });

        it('stopped state', () => {
            wrapper.setProps({ service: { state: 'stopped' } });

            expect(instance.checkIsProcessing()).toBeFalsy();
        });
    });

    function getMockProps() {
        return {
            service : {
                id     : '1',
                title  : 'Test Service',
                state  : 'started',
                status : 'ACTIVE',
                icon   : 'S',
            },
            deleteService     : jest.fn(),
            activateService   : jest.fn(),
            deactivateService : jest.fn()
        };
    }
});
