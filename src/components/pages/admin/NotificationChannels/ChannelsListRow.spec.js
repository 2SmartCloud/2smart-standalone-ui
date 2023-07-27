import React from 'react';
import { shallow } from 'enzyme';
import ChannelsListRow from './ChannelsListRow';

describe('ChannelsListRow component', () => {
    let wrapper;
    let instance;

    beforeEach(() => {
        const mockProps = getMockProps();

        wrapper = shallow(<ChannelsListRow {...mockProps} />);
        instance = wrapper.instance();
    });

    it('should be created', () => {
        expect(instance).toBeTruthy();
    });

    describe('handleSwitchChange()', () => {
        it('should call deactivateChannel while state is enabled', async () => {
            await instance.handleSwitchChange();

            expect(instance.props.deactivateChannel).toHaveBeenCalledWith('1');
        });

        it('should call activateChannel while satte is disabled', async () => {
            wrapper.setProps({ channel: {
                    id     : '1',
                    title  : 'Test Channel',
                    state  : 'disabled',
                    icon   : 'S',
                } });

            await instance.handleSwitchChange();

            expect(instance.props.activateChannel).toHaveBeenCalledWith('1');
        });
    });

    describe('handleDeleteChannel()', () => {
        it('should call deleteChannel with channel data', async () => {
            await instance.handleDeleteChannel();

            expect(instance.props.deleteChannel).toHaveBeenCalledWith(instance.props.channel);
        });
    });

    describe('handleTestMessage()', () => {
        it('should call deleteChannel with channel id', async () => {
            await instance.handleTestMessage();

            expect(instance.props.sendTestMessage).toHaveBeenCalledWith('1');
        });
    });

    function getMockProps() {
        return {
            channel : {
                id     : '1',
                alias  : 'Test Channel',
                state  : 'enabled',
                icon   : 'S',
            },
            deleteChannel     : jest.fn(),
            sendTestMessage   : jest.fn(),
            activateChannel   : jest.fn(),
            deactivateChannel : jest.fn()
        };
    }
});
