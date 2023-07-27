import * as actions from '../actions/homie';
import reducer from './homie';

const initialDevices = {
    'modbusdevice-20-13' : {
        id    : 'modbusdevice-20-13',
        nodes : [
            {
                id    : '1',
                title : 'WP8025DAM niz garages verh id 1'
            }
        ],
        options : [ {
            id : 'propertyId'
        }, {
            id : 'propertyId1'
        } ]
    },
    'modbusdevice-nizhnii-dom' : {
        id    : 'modbusdevice-nizhnii-dom',
        nodes : [
            {
                id   : '4',
                type : 'V1'
            }
        ],
        options : [ ]
    }
};

describe('homie reducer', () => {
    let initialState;

    beforeEach(() => {
        initialState = {
            devices            : {},
            thresholds         : {},
            events             : [],
            scenarios          : {},
            isTresholdFetching : true,
            iScenariosFetching : true,
            isFetching         : true
        };
    });

    it('should return initial state', () => {
        const result = reducer(undefined, {});

        expect(result).toEqual(initialState);
    });

    describe('UPDATE_HOMIE_STATE', () => {
        it('should patch entire homie state', () => {
            initialState.devices = {
                'modbusdevice-20-13' : {
                    id    : 'modbusdevice-20-13',
                    nodes : [
                        {
                            id    : '1',
                            title : 'WP8025DAM niz garages verh id 1'
                        }
                    ],
                    options : []
                },
                'modbusdevice-nizhnii-dom' : {
                    id    : 'modbusdevice-nizhnii-dom',
                    nodes : [
                        {
                            id   : '4',
                            type : 'V1'
                        }
                    ],
                    options : []
                },
                'xiaomi' : {
                    id    : 'xiaomi',
                    nodes : [
                        {
                            id      : '158d00041466eb',
                            sensors : []
                        }
                    ],
                    options : []
                },
                'yahoo-weather' : {
                    id    : 'yahoo-weather',
                    nodes : [
                        {
                            id      : 'thermometer',
                            sensors : [],
                            options : [
                                {
                                    id       : 'desc',
                                    settable : 'false'
                                }
                            ]
                        }
                    ],
                    options : []
                }
            };
            initialState.thresholds = {
                'scneario1' : []
            };

            const expected = {
                devices : {
                    'modbusdevice-20-13' : {
                        id    : 'modbusdevice-20-13',
                        nodes : [
                            {
                                id    : '1',
                                title : 'WP8025DAM niz garages verh id 1'
                            },
                            {
                                id    : '2',
                                title : 'WP8025DAM niz garages verh id 2'
                            }
                        ],
                        options : []
                    },
                    'modbusdevice-nizhnii-dom' : {
                        id    : 'modbusdevice-nizhnii-dom',
                        nodes : [
                            {
                                id    : '4',
                                type  : 'V1',
                                title : 'Relay grebenka dom'
                            }
                        ],
                        options : []
                    },
                    'xiaomi' : {
                        id    : 'xiaomi',
                        nodes : [
                            {
                                id      : '158d00041466eb',
                                sensors : [
                                    {
                                        id    : 'humidity',
                                        title : 'Humidity'
                                    }
                                ]
                            }
                        ],
                        options : []
                    },
                    'yahoo-weather' : {
                        id    : 'yahoo-weather',
                        nodes : [
                            {
                                id      : 'thermometer',
                                sensors : [
                                    {
                                        id    : 'temperature-sensor',
                                        title : 'Current temperature'
                                    }
                                ],
                                options : [
                                    {
                                        id       : 'desc',
                                        settable : 'false',
                                        title    : 'Description'
                                    }
                                ]
                            },
                            {
                                id     : 'vane',
                                hidden : 'false'
                            },
                            {
                                id     : 'sky-indicator',
                                hidden : 'false'
                            }
                        ],
                        options : [
                            {
                                id     : 'location',
                                title  : 'Location',
                                groups : [ 'm3tlqo6ackpfv49hwp3v' ]
                            }
                        ]
                    },
                    'yahoo-weather-2' : {
                        id    : 'yahoo-weather-2',
                        nodes : [
                            {
                                id      : 'thermometer',
                                sensors : [
                                    {
                                        id    : 'temperature-sensor',
                                        title : 'Current temperature'
                                    }
                                ],
                                options : [
                                    {
                                        id       : 'desc',
                                        settable : 'false',
                                        title    : 'Description'
                                    }
                                ]
                            },
                            {
                                id     : 'vane',
                                hidden : 'false'
                            },
                            {
                                id     : 'sky-indicator',
                                hidden : 'false'
                            }
                        ]
                    }
                },
                thresholds : {
                    'scneario1' : [
                        {
                            id   : 'setpoint',
                            name : 'Test name'
                        }
                    ]
                }
            };

            const action = { type: actions.UPDATE_HOMIE_STATE, payload: { updateSchema: getUpdateSchemaMock() } };
            const result = reducer(initialState, action);

            expect(result.devices).toEqual(expected.devices);
            expect(result.thresholds).toEqual(expected.thresholds);
        });

        it('should remove events', () => {
            initialState.events = [
                { type: 'PROCESSING', deviceId: 'device1', nodeId: null, propertyId: 'prop1' },
                { type: 'PROCESSING', deviceId: 'threshold', propertyId: 'setpoint' },
                { type: 'PROCESSING', deviceId: 'device1', nodeId: null, propertyId: 'prop1' },
                { type: 'PROCESSING', deviceId: 'threshold', propertyId: 'setpoint' },
                { type: 'PROCESSING', deviceId: 'device1', nodeId: null, propertyId: 'prop2' },
                { type: 'PROCESSING', deviceId: 'device2', nodeId: 'node1', propertyId: 'prop2' },
                { type: 'PROCESSING', deviceId: 'device2', nodeId: 'node1', propertyId: null }
            ];

            const schema = {
                devices        : {},
                thresholds     : {},
                eventsToRemove : new Set([
                    'setpoint',
                    'device1:null:prop1',
                    'device1:null:prop2',
                    'device2:node1:prop2'
                ])
            };
            const expected = [
                { type: 'PROCESSING', deviceId: 'device2', nodeId: 'node1', propertyId: null }
            ];

            const action = { type: actions.UPDATE_HOMIE_STATE, payload: { updateSchema: schema } };
            const result = reducer(initialState, action);

            expect(result.events).toEqual(expected);
        });
    });


    describe('CHANGE_ATRIBUTE_PROCESSING_STATUS', () => {
        it('should set processings for device option', () => {
            initialState.devices = initialDevices;
            initialState.thresholds = {
                'scneario1' : []
            };
            const action = {
                type            : actions.CHANGE_ATRIBUTE_PROCESSING_STATUS,
                propertyType    : 'options',
                hardwareType    : 'device',
                deviceId        : 'modbusdevice-20-13',
                propertyId      : 'propertyId',
                field           : 'value',
                prcessingStatus : true
            };
            const result = reducer(initialState, action);
            const expected =  {
                'modbusdevice-20-13' : {
                    id    : 'modbusdevice-20-13',
                    nodes : [
                        {
                            id    : '1',
                            title : 'WP8025DAM niz garages verh id 1'
                        }
                    ],
                    options : [ {
                        id                : 'propertyId',
                        isValueProcessing : true
                    }, {
                        id : 'propertyId1'
                    } ]
                },
                'modbusdevice-nizhnii-dom' : {
                    id    : 'modbusdevice-nizhnii-dom',
                    nodes : [
                        {
                            id   : '4',
                            type : 'V1'
                        }
                    ],
                    options : [ ]
                }
            };

            expect(result.devices).toEqual(expected);
        });


        it('should set processings for threshold', () => {
            initialState.thresholds = {
                'scneario1' : [
                    { id: 'propertyId' }
                ]
            };
            const action = {
                type            : actions.CHANGE_ATRIBUTE_PROCESSING_STATUS,
                hardwareType    : 'threshold',
                propertyId      : 'propertyId',
                nodeId          : 'scneario1',
                field           : 'value',
                prcessingStatus : true
            };
            const result = reducer(initialState, action);
            const expected =  {
                'scneario1' : [
                    {
                        id                : 'propertyId',
                        isValueProcessing : true
                    }
                ]
            };

            expect(result.thresholds).toEqual(expected);
        });

        it('should set processings for node title', () => {
            initialState.devices = initialDevices;
            initialState.thresholds = {
                'scneario1' : []
            };
            const action = {
                type            : actions.CHANGE_ATRIBUTE_PROCESSING_STATUS,
                propertyType    : 'settings',
                hardwareType    : 'node',
                nodeId          : '1',
                deviceId        : 'modbusdevice-20-13',
                propertyId      : 'propertyId',
                field           : 'title',
                prcessingStatus : true
            };
            const result = reducer(initialState, action);
            const expected =  {
                'modbusdevice-20-13' : {
                    id    : 'modbusdevice-20-13',
                    nodes : [
                        {
                            id                : '1',
                            title             : 'WP8025DAM niz garages verh id 1',
                            isTitleProcessing : true
                        }
                    ],
                    options : [ {
                        id : 'propertyId'
                    }, {
                        id : 'propertyId1'
                    } ]
                },
                'modbusdevice-nizhnii-dom' : {
                    id    : 'modbusdevice-nizhnii-dom',
                    nodes : [
                        {
                            id   : '4',
                            type : 'V1'
                        }
                    ],
                    options : [ ]
                }
            };

            expect(result.devices).toEqual(expected);
        });
    });


    describe('ADD_ATTRIBUTE_ERROR', () => {
        it('should set error for device option', () => {
            initialState.devices = initialDevices;
            initialState.thresholds = {
                'scneario1' : []
            };

            const error = { code: 'validation' };
            const action = {
                type  : actions.ADD_ATTRIBUTE_ERROR,
                error : {
                    propertyType : 'options',
                    hardwareType : 'device',
                    deviceId     : 'modbusdevice-20-13',
                    propertyId   : 'propertyId',
                    field        : 'value',
                    value        : error
                }

            };
            const result = reducer(initialState, action);
            const expected =  {
                'modbusdevice-20-13' : {
                    id    : 'modbusdevice-20-13',
                    nodes : [
                        {
                            id    : '1',
                            title : 'WP8025DAM niz garages verh id 1'
                        }
                    ],
                    options : [ {
                        id                : 'propertyId',
                        isValueProcessing : false,
                        valueError        : {
                            isExist : true,
                            value   : error
                        }
                    }, {
                        id : 'propertyId1'
                    } ]
                },
                'modbusdevice-nizhnii-dom' : {
                    id    : 'modbusdevice-nizhnii-dom',
                    nodes : [
                        {
                            id   : '4',
                            type : 'V1'
                        }
                    ],
                    options : [ ]
                }
            };

            expect(result.devices).toEqual(expected);
        });


        it('should set error for threshold', () => {
            initialState.thresholds = {
                'scneario1' : [
                    { id: 'propertyId' }
                ]
            };
            const error = { code: 'validation' };

            const action = {
                type  : actions.ADD_ATTRIBUTE_ERROR,
                error : {
                    hardwareType : 'threshold',
                    propertyId   : 'propertyId',
                    nodeId       : 'scneario1',
                    field        : 'value',
                    value        : error
                }

            };
            const result = reducer(initialState, action);
            const expected =  {
                'scneario1' : [
                    {
                        id                : 'propertyId',
                        isValueProcessing : false,
                        valueError        : {
                            isExist : true,
                            value   : error
                        }
                    }
                ]
            };

            expect(result.thresholds).toEqual(expected);
        });

        it('should set error for node title', () => {
            initialState.devices = initialDevices;
            initialState.thresholds = {
                'scneario1' : []
            };

            const error = { code: 'validation' };

            const action = {
                type  : actions.ADD_ATTRIBUTE_ERROR,
                error : {
                    propertyType : 'settings',
                    hardwareType : 'node',
                    nodeId       : '1',
                    deviceId     : 'modbusdevice-20-13',
                    propertyId   : 'propertyId',
                    field        : 'title',
                    value        : error

                }
            };
            const result = reducer(initialState, action);
            const expected =  {
                'modbusdevice-20-13' : {
                    id    : 'modbusdevice-20-13',
                    nodes : [
                        {
                            id                : '1',
                            title             : 'WP8025DAM niz garages verh id 1',
                            isTitleProcessing : false,
                            titleError        : {
                                isExist : true,
                                value   : error
                            }
                        }
                    ],
                    options : [ {
                        id : 'propertyId'
                    }, {
                        id : 'propertyId1'
                    } ]
                },
                'modbusdevice-nizhnii-dom' : {
                    id    : 'modbusdevice-nizhnii-dom',
                    nodes : [
                        {
                            id   : '4',
                            type : 'V1'
                        }
                    ],
                    options : [ ]
                }
            };

            expect(result.devices).toEqual(expected);
        });
    });


    describe('REMOVE_ATTRIBUTE_ERROR', () => {
        it('should delete error for device option', () => {
            const error = { code: 'validation' };

            initialState.devices = {
                'modbusdevice-20-13' : {
                    id    : 'modbusdevice-20-13',
                    nodes : [
                        {
                            id    : '1',
                            title : 'WP8025DAM niz garages verh id 1'
                        }
                    ],
                    options : [ {
                        id                : 'propertyId',
                        isValueProcessing : false,
                        valueError        : {
                            isExist : true,
                            value   : error
                        }
                    }, {
                        id : 'propertyId1'
                    } ]
                },
                'modbusdevice-nizhnii-dom' : {
                    id    : 'modbusdevice-nizhnii-dom',
                    nodes : [
                        {
                            id   : '4',
                            type : 'V1'
                        }
                    ],
                    options : [ ]
                }
            };

            const action = {
                type         : actions.REMOVE_ATTRIBUTE_ERROR,
                propertyType : 'options',
                hardwareType : 'device',
                deviceId     : 'modbusdevice-20-13',
                propertyId   : 'propertyId',
                field        : 'value'


            };
            const result = reducer(initialState, action);
            const expected =  {
                'modbusdevice-20-13' : {
                    id    : 'modbusdevice-20-13',
                    nodes : [
                        {
                            id    : '1',
                            title : 'WP8025DAM niz garages verh id 1'
                        }
                    ],
                    options : [ {
                        id                : 'propertyId',
                        isValueProcessing : false,
                        valueError        : {
                            isExist : false
                        }
                    }, {
                        id : 'propertyId1'
                    } ]
                },
                'modbusdevice-nizhnii-dom' : {
                    id    : 'modbusdevice-nizhnii-dom',
                    nodes : [
                        {
                            id   : '4',
                            type : 'V1'
                        }
                    ],
                    options : [ ]
                }
            };

            expect(result.devices).toEqual(expected);
        });


        it('should delete error for threshold', () => {
            const error = { code: 'validation' };

            initialState.thresholds =  {
                'scneario1' : [
                    {
                        id                : 'propertyId',
                        isValueProcessing : false,
                        valueError        : {
                            isExist : true,
                            value   : error
                        }
                    }
                ]
            };

            const action = {
                type         : actions.REMOVE_ATTRIBUTE_ERROR,
                hardwareType : 'threshold',
                propertyId   : 'propertyId',
                nodeId       : 'scneario1',
                field        : 'value'


            };
            const result = reducer(initialState, action);
            const expected =  {
                'scneario1' : [
                    {
                        id                : 'propertyId',
                        isValueProcessing : false,
                        valueError        : {
                            isExist : false
                        }
                    }
                ]
            };

            expect(result.thresholds).toEqual(expected);
        });

        it('should delete error for node title', () => {
            const error = { code: 'validation' };

            initialState.devices =  {
                'modbusdevice-20-13' : {
                    id    : 'modbusdevice-20-13',
                    nodes : [
                        {
                            id                : '1',
                            title             : 'WP8025DAM niz garages verh id 1',
                            isTitleProcessing : false,
                            titleError        : {
                                isExist : true,
                                value   : error
                            }
                        }
                    ],
                    options : [ {
                        id : 'propertyId'
                    }, {
                        id : 'propertyId1'
                    } ]
                },
                'modbusdevice-nizhnii-dom' : {
                    id    : 'modbusdevice-nizhnii-dom',
                    nodes : [
                        {
                            id   : '4',
                            type : 'V1'
                        }
                    ],
                    options : [ ]
                }
            };
            const action = {
                type         : actions.REMOVE_ATTRIBUTE_ERROR,
                propertyType : 'settings',
                hardwareType : 'node',
                nodeId       : '1',
                deviceId     : 'modbusdevice-20-13',
                propertyId   : 'propertyId',
                field        : 'title'


            };
            const result = reducer(initialState, action);
            const expected =  {
                'modbusdevice-20-13' : {
                    id    : 'modbusdevice-20-13',
                    nodes : [
                        {
                            id                : '1',
                            title             : 'WP8025DAM niz garages verh id 1',
                            isTitleProcessing : false,
                            titleError        : {
                                isExist : false
                            }
                        }
                    ],
                    options : [ {
                        id : 'propertyId'
                    }, {
                        id : 'propertyId1'
                    } ]
                },
                'modbusdevice-nizhnii-dom' : {
                    id    : 'modbusdevice-nizhnii-dom',
                    nodes : [
                        {
                            id   : '4',
                            type : 'V1'
                        }
                    ],
                    options : [ ]
                }
            };

            expect(result.devices).toEqual(expected);
        });
    });


    function getUpdateSchemaMock() {
        return {
            devices : {
                'modbusdevice-20-13' : {
                    nodes : [
                        {
                            id    : '2',
                            title : 'WP8025DAM niz garages verh id 2'
                        }
                    ]
                },
                'modbusdevice-nizhnii-dom' : {
                    nodes : [
                        {
                            id    : '4',
                            title : 'Relay grebenka dom'
                        }
                    ]
                },
                'xiaomi' : {
                    nodes : [
                        {
                            id      : '158d00041466eb',
                            sensors : [
                                {
                                    id    : 'humidity',
                                    title : 'Humidity'
                                }
                            ]
                        }
                    ]
                },
                'yahoo-weather' : {
                    nodes : [
                        {
                            id      : 'thermometer',
                            sensors : [
                                {
                                    id    : 'temperature-sensor',
                                    title : 'Current temperature'
                                }
                            ],
                            options : [
                                {
                                    id    : 'desc',
                                    title : 'Description'
                                }
                            ]
                        },
                        {
                            id     : 'vane',
                            hidden : 'false'
                        },
                        {
                            id     : 'sky-indicator',
                            hidden : 'false'
                        }
                    ],
                    options : [
                        {
                            id     : 'location',
                            title  : 'Location',
                            groups : [ 'm3tlqo6ackpfv49hwp3v' ]
                        }
                    ]
                },
                'yahoo-weather-2' : {
                    id    : 'yahoo-weather-2',
                    nodes : [
                        {
                            id      : 'thermometer',
                            sensors : [
                                {
                                    id    : 'temperature-sensor',
                                    title : 'Current temperature'
                                }
                            ],
                            options : [
                                {
                                    id       : 'desc',
                                    settable : 'false',
                                    title    : 'Description'
                                }
                            ]
                        },
                        {
                            id     : 'vane',
                            hidden : 'false'
                        },
                        {
                            id     : 'sky-indicator',
                            hidden : 'false'
                        }
                    ]
                },
                'test' : {
                    nodes : []
                }
            },
            thresholds : {
                'scneario1' : [
                    {
                        id   : 'setpoint',
                        name : 'Test name'
                    }
                ]
            }
        };
    }
});
