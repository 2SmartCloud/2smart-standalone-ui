import React from 'react';
import { shallow } from 'enzyme';
import getMockStore from '../../../../__mocks__/storeMock';
import Properties from './index';


describe('Properties', () => {
    let wrapper;
    let instance;

    beforeEach(() => {
        const mockStore = getMockStore(getMockAppState);
        const mockProps = getMockProps();
        const mockBoundActions = getMockBoundActions();

        wrapper = shallow(<Properties {...mockProps} store={mockStore} />).dive().dive();
        wrapper.setProps(mockBoundActions);
        instance = wrapper.instance();
    });

    it('should be created', () => {
        expect(instance).toBeTruthy();
    });

    it('handleToggleGroupsVisibility() should invert isGroupsVisible', async () => {
        const VALUES = [ true, false ];

        const promises = VALUES.map((value) => async () => {
            const isGroupsVisible = value;

            wrapper.setProps({
                isGroupsVisible
            });

            await instance.handleToggleGroupsVisibility();

            expect(instance.props.setGroupsVisibility).toHaveBeenCalledWith(!isGroupsVisible);
        }).map(func => func());

        await Promise.all(promises);
    });

    it('handleRemoveError() should remove sensor error', () => {
        const propertyType = 'settings';
        const { hardwareType, nodeId, deviceId } = instance.props;

        instance.handleRemoveError();

        expect(instance.props.removeAttributeErrorAndHideToast).toHaveBeenCalledWith({ propertyType, hardwareType, deviceId, nodeId,  field: 'title' });
    });


    function getMockBoundActions() {
        return {
            setGroupsVisibility              : jest.fn(),
            removeAttributeErrorAndHideToast : jest.fn()
        };
    }

    function getMockAppState() {
        return {
            applicationInterface : {
                isGroupsVisible : false
            }
        };
    }

    function getMockProps() {
        return {
            'hardwareType' : 'device',
            'deviceId'     : 'fat',
            'title'        : 'Fat device',
            'isOpen'       : false,
            'isDisable'    : false,
            'onClose'      : () => {},
            'properties'   : {
                'options' : [
                    {
                        'id'        : 'transport',
                        'name'      : 'Transport protocol',
                        'value'     : 'mqtt',
                        'settable'  : 'true',
                        'retained'  : 'true',
                        'dataType'  : 'string',
                        'unit'      : '#',
                        'format'    : '',
                        'rootTopic' : 'sweet-home/fat/$options/transport',
                        'groups'    : [
                            '34s35n7iz00wqebmsz1c',
                            '9em7f2utnakt204224fx',
                            'zysp7vvzifl6gtzg55j1',
                            'wjoa80bstdvjpo6lv06d',
                            'fowcm2p63wb0kl791gnt',
                            'lwwbs2ab466rdv252bsq',
                            '6t9vj2egd3hkkdhklwoi',
                            'bke49j1qrsttgdyvprlh'
                        ],
                        'title' : ''
                    }
                ],
                'telemetry' : [
                    {
                        'id'        : 'supply',
                        'name'      : 'Supply',
                        'value'     : '1.4254лдыа',
                        'settable'  : 'false',
                        'retained'  : 'true',
                        'dataType'  : 'string',
                        'unit'      : '%',
                        'format'    : '',
                        'rootTopic' : 'sweet-home/fat/$telemetry/supply',
                        'groups'    : [],
                        'title'     : ''
                    }
                ]
            },
            'isGroupsVisible' : true,
            'nodeId'          : null
        };
    }
});
