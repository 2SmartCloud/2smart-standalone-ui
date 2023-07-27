import React from 'react';
import { shallow } from 'enzyme';
import { DEVICES_MOCK } from '../../../../../__mocks__/deviceMock';
import getMockStore from '../../../../../__mocks__/storeMock';
import NodesList from '../NodesList';
import Device from './index.js';

describe('Device component', () => {
    let wrapper;
    let instance;

    beforeEach(() => {
        const mockStore = getMockStore(getMockAppState);
        const mockProps = getMockProps();
        const mockBoundActions = getMockBoundActions();


        wrapper = shallow(<Device {...mockProps} store={mockStore} />).dive().dive();
        wrapper.setProps(mockBoundActions);
        instance = wrapper.instance();
    });

    it('should be created', () => {
        expect(instance).toBeDefined();
    });

    it('should render only not hidden nodes on init', () => {
        expect(wrapper.state('showHiddenNodes')).toEqual(false);

        const nodesList = wrapper.find(NodesList);

        expect(nodesList.length).toBe(1);
    });

    it('checkIsHiddenNodesExist() should return false if hidden nodes not exist', () => {
        wrapper.setProps({ nodes: getNodesListWithoutHidden() });

        expect(instance.checkIsHiddenNodesExist()).toEqual(false);
    });

    it('checkIsHiddenNodesExist() should return true if hidden nodes exist', () => {
        wrapper.setProps({ nodes: getNodesListWithHidden() });

        expect(instance.checkIsHiddenNodesExist()).toEqual(true);
    });

    xit('handleToggleHiddenNodes() should invert showHiddenNodes state', () => {
        wrapper.setState({ showHiddenNodes: true });

        instance.handleToggleHiddenNodes();

        expect(wrapper.state().showHiddenNodes).toBeFalsy();

        instance.handleToggleHiddenNodes();

        expect(wrapper.state().showHiddenNodes).toBeTruthy();
    });

    it('should render toggle hidden nodes button if hidden nodes exist', () => {
        wrapper.setProps({ nodes: getNodesListWithHidden() });
        const toggleHiddenNodesButtons = wrapper.find('.toggleHiddenNodesButton');

        expect(toggleHiddenNodesButtons.length).toBe(1);
    });

    it('shouldn\'t render toggle hidden nodes button if hidden nodes not exist', () => {
        wrapper.setProps({ nodes: getNodesListWithoutHidden() });

        const toggleHiddenNodesButtons = wrapper.find('.toggleHiddenNodesButton');

        expect(toggleHiddenNodesButtons.length).toBe(0);
    });


    it('handleRemoveError() should remove sensor error', () => {
        const propertyType = 'settings';
        const { id } = instance.props;

        instance.handleRemoveError();

        expect(instance.props.removeAttributeErrorAndHideToast).toHaveBeenCalledWith({ propertyType, hardwareType: 'device', deviceId: id,  field: 'title' });
    });

    describe('isNodesEmpty() should return true if device has no nodes with sensors', () => {
        it('has sensors', () => {
            const result = instance.isNodesEmpty();

            expect(result).toBeFalsy();
        });

        it('has no sensors', () => {
            wrapper.setProps({
                nodes : [
                    {
                        id : 'node-1'
                    },
                    {
                        id      : 'node-2',
                        sensors : []
                    }
                ]
            });

            const result = instance.isNodesEmpty();

            expect(result).toBeTruthy();
        });
    });

    function getNodesListWithoutHidden() {
        return [
            {
                id        : 'colors',
                name      : 'Color picker',
                type      : 'V1',
                state     : 'ready',
                rootTopic : 'sweet-home/fat/colors',
                title     : '',
                sensors   : [
                    {
                        id        : 'rgb-valid',
                        name      : 'RGB Valid',
                        value     : '0,0,0',
                        settable  : 'true',
                        retained  : 'true',
                        dataType  : 'color',
                        unit      : '#',
                        format    : 'rgb',
                        rootTopic : 'sweet-home/fat/colors/rgb-valid',
                        groups    : [ '1' ]
                    }
                ],
                options   : [],
                telemetry : [],
                hidden    : 'false'
            },
            {
                id        : 'enum-no-unit',
                name      : 'Enum Sensor',
                type      : 'V1',
                state     : 'init',
                rootTopic : 'sweet-home/fat/enum-no-unit',
                title     : '',
                sensors   : [
                    {
                        id        : 'enum-no-unit',
                        name      : 'ENUM',
                        value     : 'OFF',
                        settable  : 'true',
                        retained  : 'true',
                        dataType  : 'enum',
                        unit      : '#',
                        format    : 'ON,OFF',
                        rootTopic : 'sweet-home/fat/enum-no-unit/enum-no-unit'
                    }
                ],
                options   : [],
                telemetry : [],
                hidden    : 'false'
            }
        ];
    }

    function getNodesListWithHidden() {
        return [
            {
                id        : 'colors-some',
                name      : 'Color picker',
                type      : 'V1',
                state     : 'ready',
                rootTopic : 'sweet-home/fat/colors',
                title     : '',
                sensors   : [
                    {
                        id        : 'rgb-valid',
                        name      : 'RGB Valid',
                        value     : '0,0,0',
                        settable  : 'true',
                        retained  : 'true',
                        dataType  : 'color',
                        unit      : '#',
                        format    : 'rgb',
                        rootTopic : 'sweet-home/fat/colors/rgb-valid',
                        groups    : [ '1' ]
                    }
                ],
                options   : [],
                telemetry : [],
                hidden    : 'false'
            },
            {
                id        : 'enum-some-no-unit',
                name      : 'Enum Sensor',
                type      : 'V1',
                state     : 'init',
                rootTopic : 'sweet-home/fat/enum-no-unit',
                title     : '',
                sensors   : [
                    {
                        id        : 'enum-no-unit',
                        name      : 'ENUM',
                        value     : 'OFF',
                        settable  : 'true',
                        retained  : 'true',
                        dataType  : 'enum',
                        unit      : '#',
                        format    : 'ON,OFF',
                        rootTopic : 'sweet-home/fat/enum-no-unit/enum-no-unit'
                    }
                ],
                options   : [],
                telemetry : [],
                hidden    : 'true'
            }
        ];
    }

    function getMockAppState() {
        return {
            applicationInterface : {
                modal : {
                    isOpen : false
                }
            }
        };
    }

    function getMockBoundActions() {
        return {
            removeAttributeErrorAndHideToast : jest.fn()
        };
    }

    function getMockProps() {
        return {
            ...DEVICES_MOCK.fat,
            state : 'ready'
        };
    }
});
