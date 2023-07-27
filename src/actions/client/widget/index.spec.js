import configureMockStore      from 'redux-mock-store';
import { SELCTED_GROUPS_LIST } from '../../../__mocks__/groupsListMock';
import { ALIASES }             from '../../../__mocks__/aliasesMock';
import {
    THERMOSTAT_DEFAULT_STEP_INT,
    THERMOSTAT_DEFAULT_STEP_FLOAT
}                              from '../../../assets/constants/widget';
import thunk                   from 'redux-thunk';

import * as actions            from './index.js';

jest.mock('../../../assets/constants/widget', () => ({
    THERMOSTAT_DEFAULT_STEP_INT: require('../../../__mocks__/widgetMock').THERMOSTAT_DEFAULT_STEP_INT_MOCK,
    THERMOSTAT_DEFAULT_STEP_FLOAT: require('../../../__mocks__/widgetMock').THERMOSTAT_DEFAULT_STEP_FLOAT_MOCK,
    WIDGETS_MAP: require('../../../__mocks__/widgetMock').WIDGETS_MAP
}));

const mockStore = configureMockStore([ thunk ]);
const TOPICS = [
    {
        alias          : {},
        "isActive"     : true,
        "dataType"     : "float",
        "deviceId"     : "fat",
        "hardwareType" : "node",
        "label"        : "Hysteresis — sweet-home/fat/thermostat/$options/accuracy",
        "name"         : "Hysteresis",
        "nodeId"       : "thermostat",
        "isRetained"   : false,
        "isSettable"   : true,
        "propertyId"   : "accuracy",
        "propertyType" : "options",
        "title"        : "",
        "topic"        : "sweet-home/fat/thermostat/$options/accuracy",
        "type"         : "card",
        "value"        : "sweet-home/fat/thermostat/$options/accuracy",
        "withTitle": false,
    },{
        alias          : {},
        "isActive"     : true,
        "dataType"     : "integer",
        "deviceId"     : "threshold",
        "hardwareType" : "threshold",
        "label"        : "name — scenarios/name/setpoint",
        "isRetained"   : true,
        "isSettable"   : true,
        "name"         : "name",
        "nodeId"       : "name",
        "propertyId"   : "setpoint",
        "propertyType" : "threshold",
        "title"        : undefined,
        "topic"        : "scenarios/name/setpoint",
        "type"         : "card",
        "value"        : "scenarios/name/setpoint",
        "withTitle"    : false,
    }, {
        alias:{
            id             : "id1",
            rootTopic      : "topics-aliases/id1",
            connectedTopic : "sweet-home/fat/$telemetry/supply",
            name           : "name1"
        },
        "isActive"     : true,
        "dataType"     : "string",
        "deviceId"     : "fat",
        "hardwareType" : "device",
        "label"        : 'Supply — name1 — sweet-home/fat/$telemetry/supply',
        "isRetained"   : true,
        "isSettable"   : false,
        "name"         : "Supply",
        "nodeId"       : null,
        "propertyId"   : "supply",
        "propertyType" : "telemetry",
        "title"        : "",
        "topic"        : "sweet-home/fat/$telemetry/supply",
        "type"         : "card",
        "value"        : "sweet-home/fat/$telemetry/supply",
        "withTitle"    : false,
    }, {
        alias          : {},
        "isActive"     : true,
        "dataType"     : "boolean",
        "deviceId"     : "fat",
        "hardwareType" : "node",
        "label"        : "Switch — sweet-home/fat/thermostat/switch",
        "isRetained"   : false,
        "isSettable"   : true,
        "name"         : "Switch",
        "nodeId"       : "thermostat",
        "propertyId"   : "switch",
        "propertyType" : "sensors",
        "title"        : "",
        "topic"        : "sweet-home/fat/thermostat/switch",
        "type"         : "card",
        "value"        : "sweet-home/fat/thermostat/switch",
        "withTitle": false,
    },
];

describe('client widget actions', () => {
    let store;

    beforeEach(() => {
        //setupSpies();

        store = mockStore(getMockAppState);
    });

    it('getGroups()',  () => {
        const expectedActions = [
            {
                type: actions.GET_WIDGET_GROUPS,
                groups: [{
                    topic        : 'groups-of-properties/6',
                    label        : 'Six group',
                    value        : 'groups-of-properties/6',
                    deviceId     : '6',
                    nodeId       : null,
                    propertyId   : null,
                    hardwareType : 'group',
                    propertyType : 'group',
                    type         : 'color',
                    dataType     : 'color'
                }, {
                    topic        : 'groups-of-properties/7',
                    label        : 'Seven group',
                    value        : 'groups-of-properties/7',
                    deviceId     : '7',
                    nodeId       : null,
                    propertyId   : null,
                    hardwareType : 'group',
                    propertyType : 'group',
                    type         : 'color',
                    dataType     : 'color'
                } ]
            }
        ];

        store.dispatch(actions.getGroups('color'));

        expect(store.getActions()).toEqual(expectedActions);
    });


    it('selecGroup()',  () => {
        const newGroup =  {
            topic        : 'groups-of-properties/6',
            label        : 'Six group',
            value        : 'groups-of-properties/6',
            deviceId     : '6',
            nodeId       : null,
            propertyId   : null,
            hardwareType : 'group',
            propertyType : 'group',
            type         : 'color',
            dataType     : 'float'
        };
        const expectedActions=[{
                type:actions.CHANGE_ACTIVE_VALUE,
                value:newGroup
            },{
                type:actions.SELECT_GROUP,
                group:newGroup
            }
        ];

        store.dispatch(actions.selectGroup(newGroup));

        expect(store.getActions()).toEqual(expectedActions);
    });

    it('selectTopic()',  () => {
        const newTopic =  {
            deviceId     : "fat",
            nodeId       : "enum-unit",
            hardwareType : "node",
            propertyType : "sensors",
            propertyId   : "enum-proc",
            topic        : "sweet-home/fat/enum-unit/enum-proc",
            value        : "sweet-home/fat/enum-unit/enum-proc",
            label        : "sweet-home/fat/enum-unit/enum-proc",
            dataType     : "enum",
            type         : "enum"
        };
        const expectedActions=[{
                type  : actions.SELECT_TOPIC,
                topic : newTopic
            },{
                type  : actions.CHANGE_ACTIVE_VALUE,
                value : newTopic
            }
        ];

        store.dispatch(actions.selectTopic(newTopic));

        expect(store.getActions()).toEqual(expectedActions);
    });

    it('selectTopic() for thermostat with datatype: float',  () => {
        const newTopic =  {
            dataType: "float",
            type: "thermostat"
        };
        const expectedActions=[{
                type       : actions.SET_WIDGET_OPTION,
                value      : THERMOSTAT_DEFAULT_STEP_FLOAT,
                key        : 'step',
                isAdvanced : true
            },{
                type       : actions.SELECT_TOPIC,
                topic      : newTopic
            },{
                type       : actions.CHANGE_ACTIVE_VALUE,
                value      : newTopic
            }
        ];

        store.dispatch(actions.selectTopic(newTopic));

        expect(store.getActions()).toEqual(expectedActions);
    });

    it('selectTopic() for thermostat with datatype: integer',  () => {
        const newTopic =  {
            dataType: "integer",
            type: "thermostat"
        };

        const expectedActions=[{
                type       : actions.SET_WIDGET_OPTION,
                value      : THERMOSTAT_DEFAULT_STEP_INT,
                key        : 'step',
                isAdvanced : true
            },{
                type       : actions.SELECT_TOPIC,
                topic      : newTopic
            },{
                type       : actions.CHANGE_ACTIVE_VALUE,
                value      : newTopic
            }
        ];

        store.dispatch(actions.selectTopic(newTopic));

        expect(store.getActions()).toEqual(expectedActions);
    });
    xit('changeValueTab() - switch tab to "Group" and change activeValue to groupValue',  () => {

        const expectedActions=[{
                type:actions.CHANGE_TAB,
                tab: 1
            },{
                type:actions.CHANGE_ACTIVE_VALUE,
                value:store.getState().client.widget.currGroup
            }
        ];

        store.dispatch(actions.changeValueTab(1));

        expect(store.getActions()).toEqual(expectedActions);
    });

    describe('getTopicsByDataType("pushButton")', () => {
        it('should return retained and boolean topics', () => {
            const expectedActions = [
                {
                    type: actions.GET_TOPICS_BY_DATA_TYPE,
                    topics: [ {
                        alias          :  {},
                        "isActive"     : true,
                        "deviceId"     : "fat",
                        "nodeId"       : "thermostat",
                        "hardwareType" : "node",
                        "propertyType" : "sensors",
                        "propertyId"   : "switch",
                        "isRetained": false,
                        "isSettable": true,
                        "topic"        : "sweet-home/fat/thermostat/switch",
                        "value"        : "sweet-home/fat/thermostat/switch",
                        "label"        : "Switch — sweet-home/fat/thermostat/switch",
                        "name"         : "Switch",
                        "withTitle"    : false,
                        "dataType"     : "boolean",
                        "title"        : "",
                        "type"         : "pushButton"
                    } ],
                    params : {
                        type  : "pushButton",
                        label : "Push Button",
                        isOnlyTopicConnect: true,
                        isMulti:false
                    }
                }
            ];
            store.dispatch(actions.getTopicsByDataType('pushButton'));

            expect(store.getActions()).toEqual(expectedActions);
        });
    })

    describe('filterByDataType', () => {
        it('should return entities with retained = true if widget.isRetained === true ', () => {
            const result = actions.filterByDataType('fat', null, 'testWithRetainedTrue', [
                {
                    "id"        : "freeheap",
                    "name"      : "Free heap",
                    "value"     : "",
                    "settable"  : "true",
                    "retained"  : "false",
                    "dataType"  : "boolean",
                    "unit"      : "%",
                    "format"    : "",
                    "rootTopic" : "sweet-home/fat/$telemetry/freeheap",
                    "groups"    : [],
                    "title"     : ""
                }, {
                    "id"        : "supply",
                    "name"      : "Supply",
                    "value"     : "1.4254лдыа",
                    "settable"  : "false",
                    "retained"  : "true",
                    "dataType"  : "boolean",
                    "unit"      : "%",
                    "format"    : "",
                    "rootTopic" : "sweet-home/fat/$telemetry/supply",
                    "groups"    : [],
                    "title"     : ""
                }
            ], 'device', 'telemetry');

            const expected = [ {
                "deviceId"     : "fat",
                "deviceId"     : "fat",
                "hardwareType" : "device",
                "label"        : "Supply — sweet-home/fat/$telemetry/supply",
                "name"         : "Supply",
                "value"        : "1.4254лдыа",
                "dataType"     : "boolean",
                "isRetained": true,
                "isSettable": false,
                "nodeId"       : null,
                "propertyId"   : "supply",
                "propertyType" : "telemetry",
                "title"        : "",
                "topic"        : "sweet-home/fat/$telemetry/supply",
                "type"         : "testWithRetainedTrue",
                "value"        : "sweet-home/fat/$telemetry/supply",
                "withTitle"    : false
            } ];

            expect(result).toEqual(expected);
        });

        it('should return entities with retained = false if widget.isRetained is false', () => {
            const result = actions.filterByDataType('fat', null, 'testWithRetainedFalse', [
                {
                    "id"        : "freeheap",
                    "name"      : "Free heap",
                    "value"     : "",
                    "settable"  : "true",
                    "retained"  : "true",
                    "dataType"  : "boolean",
                    "unit"      : "%",
                    "format"    : "",
                    "rootTopic" : "sweet-home/fat/$telemetry/freeheap",
                    "groups"    : [],
                    "title"     : ""
                }, {
                    "id"        : "supply",
                    "name"      : "Supply",
                    "value"     : "1.4254лдыа",
                    "settable"  : "false",
                    "retained"  : "false",

                    "isRetained": false,
                    "isSettable": false,
                    "dataType"  : "boolean",
                    "unit"      : "%",
                    "format"    : "",
                    "rootTopic" : "sweet-home/fat/$telemetry/supply",
                    "groups"    : [],
                    "title"     : ""
                }
            ], 'device', 'telemetry');

            const expected = [ {
                "deviceId"     : "fat",
                "deviceId"     : "fat",
                "hardwareType" : "device",
                "label"        : "Supply — sweet-home/fat/$telemetry/supply",
                "name"         : "Supply",
                "value"        : "1.4254лдыа",
                "dataType"     : "boolean",

                "isRetained": false,
                "isSettable": false,
                "nodeId"       : null,
                "propertyId"   : "supply",
                "propertyType" : "telemetry",
                "title"        : "",
                "topic"        : "sweet-home/fat/$telemetry/supply",
                "type"         : "testWithRetainedFalse",
                "value"        : "sweet-home/fat/$telemetry/supply",
                "withTitle"    : false
            } ];

            expect(result).toEqual(expected);
        });

        it('should return entities with retained = true or false if widget.isRetained is not defined', () => {
            const result = actions.filterByDataType('fat', null, 'testWithRetainedUndefined', [
                {
                    "id"        : "freeheap",
                    "name"      : "Free heap",
                    "value"     : "",
                    "settable"  : "true",
                    "retained"  : "true",
                    "dataType"  : "boolean",
                    "unit"      : "%",
                    "format"    : "",
                    "rootTopic" : "sweet-home/fat/$telemetry/freeheap",
                    "groups"    : [],
                    "title"     : ""
                },{
                    "id"        : "supply",
                    "name"      : "Supply",
                    "value"     : "1.4254лдыа",
                    "settable"  : "false",
                    "retained"  : "false",
                    "dataType"  : "boolean",
                    "unit"      : "%",
                    "format"    : "",
                    "rootTopic" : "sweet-home/fat/$telemetry/supply",
                    "groups"    : [],
                    "title"     : ""
                }
            ], 'device', 'telemetry');

            const expected = [{
                "deviceId"     : "fat",
                "deviceId"     : "fat",
                "hardwareType" : "device",
                "label"        : "Free heap — sweet-home/fat/$telemetry/freeheap",
                "name"         : "Free heap",
                "value"        : "",
                "isRetained": true,
                "isSettable": true,
                "dataType"     : "boolean",
                "nodeId"       : null,
                "propertyId"   : "freeheap",
                "propertyType" : "telemetry",
                "title"        : "",
                "topic"        : "sweet-home/fat/$telemetry/freeheap",
                "type"         : "testWithRetainedUndefined",
                "value"        : "sweet-home/fat/$telemetry/freeheap",
                "withTitle"    : false
            }, {
                "deviceId"     : "fat",
                "deviceId"     : "fat",
                "hardwareType" : "device",
                "label"        : "Supply — sweet-home/fat/$telemetry/supply",
                "name"         : "Supply",
                "isRetained": false,
                "isSettable": false,
                "value"        : "1.4254лдыа",
                "dataType"     : "boolean",
                "nodeId"       : null,
                "propertyId"   : "supply",
                "propertyType" : "telemetry",
                "title"        : "",
                "topic"        : "sweet-home/fat/$telemetry/supply",
                "type"         : "testWithRetainedUndefined",
                "value"        : "sweet-home/fat/$telemetry/supply",
                "withTitle"    : false
            } ];

            expect(result).toEqual(expected);
        });
    });


    describe('addTopicsToMultiWidget', () => {
        it('should add topics to multiselect', () => {
            const topicToAdd = {
                deviceId     : "fat",
                nodeId       : "enum-unit",
                hardwareType : "node",
                propertyType : "sensors",
                propertyId   : "enum-proc",
                topic        : "sweet-home/fat/enum-unit/enum-proc",
                value        : "sweet-home/fat/enum-unit/enum-proc",
                label        : "sweet-home/fat/enum-unit/enum-proc",
                dataType     : "enum",
                type         : "enum"
            }
            const expectedActions = [
                {
                    type: actions.ADD_TOPICS_TO_MULTI_WIDGET,
                    topics: topicToAdd
                }
            ];

            store.dispatch(actions.addTopicsToMultiWidget(topicToAdd));

            expect(store.getActions()).toEqual(expectedActions);
        });
    })

    describe('deleteTopicFromMultiWidget', () => {
        it('should delete topic from multiselect', () => {
            const topicToDelete = {
                deviceId     : "fat",
                nodeId       : "enum-unit",
                hardwareType : "node",
                propertyType : "sensors",
                propertyId   : "enum-proc",
                topic        : "sweet-home/fat/enum-unit/enum-proc",
                value        : "sweet-home/fat/enum-unit/enum-proc",
                label        : "sweet-home/fat/enum-unit/enum-proc",
                dataType     : "enum",
                type         : "enum"
            }
            const expectedActions = [
                {
                    type: actions.DELETE_TOPIC_FROM_MULTI_WIDGET,
                    topicObj: topicToDelete
                }
            ];

            store.dispatch(actions.deleteTopicFromMultiWidget(topicToDelete));

            expect(store.getActions()).toEqual(expectedActions);
        });
    })


    describe('changeTopicOrder', () => {
        it('should move topic in array from source index to destination', () => {

            const expectedActions = [
                {
                    type: actions.CHANGE_TOPICS_ORDER,
                    source: 0,
                    destination:2
                }
            ];

            store.dispatch(actions.changeTopicOrder(0,2));

            expect(store.getActions()).toEqual(expectedActions);
        });
    })

    describe('selectWidgetToEdit', () => {
        it('should set widget data for edit ', () => {
            const widget = {
                bgColor : "",
                id      : "134",
                isMulti : true,
                name    : "",
                topics  : [
                    "sweet-home/fat/new-dynamic-node/sensor"
                ],
                type: "card"
            }

            const expectedActions = [
                {
                    type   : actions.GET_TOPICS_BY_DATA_TYPE,
                    topics : TOPICS,
                    params : {
                        type               : "card",
                        label              : "Card",
                        isOnlyTopicConnect : true,
                        isMulti            : true
                    }
                },
                {
                    type     : actions.SELECT_WIDGET,
                    widgetId : '134',
                    name     : '',
                    bgColor  : '',
                    advanced : undefined,
                    topics   : [
                        {
                            id      : "sweet-home/fat/new-dynamic-node/sensor",
                            label   : "sweet-home/fat/new-dynamic-node/sensor",
                            order   : 0,
                            deleted : true,
                            topic   : "sweet-home/fat/new-dynamic-node/sensor"
                        }
                    ]
                }
            ];

            store.dispatch(actions.selectWidgetToEdit(widget));

            expect(store.getActions()).toEqual(expectedActions);
        });
    })

    describe('selectWidgetToDelete', () => {
        it('should set widget data for delete ', () => {
            const widget = {
                bgColor: "",
                id: "134",
                isMulti: true,
                name: "",
                topics: [
                    {
                        dataType: "string",
                        deviceId: "fat",
                        hardwareType: "node",
                        id: 152,
                        label: "2smart — sweet-home/fat/new-dynamic-node/sensor",
                        nodeId: "new-dynamic-node",
                        order: 0,
                        propertyId: "sensor",
                        propertyType: "sensors",
                        topic: "sweet-home/fat/new-dynamic-node/sensor",
                        widgetId: 134,
                        type:'card'
                    }
                ],
                type: "card"
            }

            const expectedActions = [
                {
                    type: actions.SELECT_WIDGET,
                    widgetId: '134',
                    name:'',
                }
            ];

            store.dispatch(actions.selectWidgetToDelete(widget));

            expect(store.getActions()).toEqual(expectedActions);
        });
    })

    describe('changeColor', () => {
        it('should set widget color ', () => {
            const expectedActions = [
                {
                    type: actions.CHANGE_WIDGET_COLOR,
                    bgColor: '#FFF'
                }
            ];

            store.dispatch(actions.changeColor('#FFF'));

            expect(store.getActions()).toEqual(expectedActions);
        });
    })
    function getMockAppState() {
        return {
            aliases:{
                list:ALIASES
            },
            groups : {
                list       : SELCTED_GROUPS_LIST,
                isFetching : false
            },
            client:{
                widget:{
                    currTopic:{
                        deviceId     : "fat",
                        nodeId       : "enum-unit",
                        hardwareType : "node",
                        propertyType : "sensors",
                        propertyId   : "enum-proc",
                        topic        : "sweet-home/fat/enum-unit/enum-proc",
                        value        : "sweet-home/fat/enum-unit/enum-proc",
                        label        : "sweet-home/fat/enum-unit/enum-proc",
                        dataType     : "enum",
                        type         : "enum"
                    },
                    currGroup:{
                        topic        : 'groups-of-properties/6',
                        label        : 'Six group',
                        value        : 'groups-of-properties/6',
                        deviceId     : 'groupId',
                        nodeId       : null,
                        propertyId   : null,
                        hardwareType : 'group',
                        propertyType : 'group',
                        type         : 'color',
                        dataType     : 'float'
                    },
                    topics:[]
                }
            },
            homie: {
                "devices": {
                    "fat": {
                        "id": "fat",
                        "name": "Fat device",
                        "nodes": [
                            {
                                "id": "thermostat",
                                "name": "Thermostat",
                                "sensors": [
                                    {
                                        "id"        : "switch",
                                        "name"      : "Switch",
                                        "value"     : "true",
                                        "settable"  : "true",
                                        "retained"  : "false",
                                        "dataType"  : "boolean",
                                        "unit"      : "#",
                                        "format"    : "",
                                        "rootTopic" : "sweet-home/fat/thermostat/switch",
                                        "groups"    : [],
                                        "title"     : ""
                                    }
                                ],
                                "options": [
                                    {
                                        "id"        : "accuracy",
                                        "name"      : "Hysteresis",
                                        "value"     : "1.5",
                                        "settable"  : "true",
                                        "retained"  : "false",
                                        "dataType"  : "float",
                                        "unit"      : "°C",
                                        "format"    : "",
                                        "rootTopic" : "sweet-home/fat/thermostat/$options/accuracy",
                                        "groups"    : [],
                                        "title"     : ""
                                    }
                                ],
                                "telemetry"    : [],
                                "type"         : "V1",
                                "state"        : "ready",
                                "rootTopic"    : "sweet-home/fat/thermostat",
                                "title"        : "",
                                "hidden"       : "false",
                                "lastActivity" : "1586437286398"
                            },
                            {
                                "id"        : "status",
                                "name"      : "Status",
                                "value"     : "connected",
                                "settable"  : "false",
                                "retained"  : "true",
                                "dataType"  : "string",
                                "sensors"   : [],
                                "options"   : [],
                                "telemetry" : [],
                                "unit"      : "#",
                                "format"    : "",
                                "rootTopic" : "sweet-home/fat/$options/status",
                                "groups"    : [],
                                "title"     : ""
                            }
                        ],
                        "telemetry"         : [
                            {
                                "id"        : "supply",
                                "name"      : "Supply",
                                "value"     : "1.4254лдыа",
                                "settable"  : "false",
                                "retained"  : "true",
                                "dataType"  : "string",
                                "unit"      : "%",
                                "format"    : "",
                                "rootTopic" : "sweet-home/fat/$telemetry/supply",
                                "groups"    : [],
                                "title"     : ""
                            }
                        ],
                        "firmwareName"      : "asdad",
                        "options"           : [],
                        "firmwareVersion"   : "1231231",
                        "localIp"           : "112",
                        "mac"               : "2312",
                        "implementation"    : "dafs",
                        "state"             : "ready",
                        "rootTopic"         : "sweet-home/fat",
                        "title"             : ""
                    }
                },
                "thresholds": {
                    "name": [
                        {
                            "id"         : "setpoint",
                            "name"       : "name",
                            "value"      : "",
                            "settable"   : "true",
                            "retained"   : "true",
                            "dataType"   : "integer",
                            "unit"       : "#",
                            "format"     : "",
                            "rootTopic"  : "scenarios/name/setpoint",
                            "scenarioId" : "name"
                        }
                    ]
                }
            }
        };
    }

});
