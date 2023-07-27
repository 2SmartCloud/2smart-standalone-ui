import React                     from 'react';
import { shallow }               from 'enzyme';

import NotificationConfiguration from './NotificationConfiguration';
import MultiSelect               from '../../../../base/MultiSelect';

describe('NotificationConfiguration component', () => {
    let wrapper;
    let instance;

    beforeEach(() => {
        const mockProps = getMockProps();
        wrapper = shallow(<NotificationConfiguration {...mockProps} />);
        instance = wrapper.instance();
    });

    it('should be created', () => {
        expect(instance).toBeTruthy();
    });

    describe('componentDidMount()', () => {
        const expectedState = [ 'channel-id' ];

        it('should change state if !initialState', () => {
            wrapper.setProps({
                initialState : null,
                field : { default: expectedState }
            });

            instance.componentDidMount();

            expect(instance.state.fields).toEqual(expectedState);
        });

        it('should change state if initialState exsists', () => {
            instance.componentDidMount();

            expect(instance.state.fields).toEqual(expectedState);
        });
    });

    it('getChannelsOptions() should return options', () => {
        wrapper.setProps({
            userChannelsList : [{
                id    : 'test',
                alias : 'test',
                type  : 'test'
            }]
        });

        const expectedList = [ {
            "id"    : "@system",
            "label" : "System notifications",
            "type"  : "",
            "value" : "@system",
        }, {
            id    : 'test',
            label : 'test',
            value : 'test',
            type  : 'test'
        } ];

        const result = instance.getChannelsOptions();

        expect(result).toEqual(expectedList);
    });

    describe('renderField', () => {
        it('should render MultiSelect on init', () => {
            const selectElement = wrapper.find(MultiSelect);
            instance.renderFields();

            expect(selectElement.length).toBe(1);
        });
    });

    function getMockProps() {
        return {
            field: {
                name : 'test',
            },
            userChannelsList : [ ],
            initialState     : [ 'channel-id' ],
            onInteract       : jest.fn(),
            onChange         : jest.fn(),
            errors           : { },
            values           : [ ]
        };
    }
});