import EventCache from './EventCache';
import { PUBLISH_EVENTS_MOCK } from '../../__mocks__/publishEventsMock';

jest.mock('../../actions/interface');
jest.mock('../../store', () => ({
    dispatch : jest.fn
}));

describe('EventCache class', () => {
    let instance;

    beforeEach(() => {
        instance = new EventCache({
            handler      : jest.fn(),
            debounceTime : 100,
            cacheSize    : 100
        });
    });

    it('should be constructed', () => {
        expect(instance).toHaveProperty('handler');
        expect(instance.events).toEqual([]);
    });

    describe('push()', () => {
        it('should add event to array and call processing', () => {
            spyOn(instance, 'processDebounced').and.stub();

            const expected = [
                PUBLISH_EVENTS_MOCK[0],
                PUBLISH_EVENTS_MOCK[1]
            ];

            instance.push(PUBLISH_EVENTS_MOCK[0]);
            instance.push(PUBLISH_EVENTS_MOCK[1]);

            expect(instance.events).toEqual(expected);
            expect(instance.processDebounced).toHaveBeenCalled();
        });

        it('should not call processing while withoutProcessing flag is set', () => {
            spyOn(instance, 'processDebounced').and.stub();

            const expected = [
                PUBLISH_EVENTS_MOCK[0],
                PUBLISH_EVENTS_MOCK[1]
            ];

            instance.push(PUBLISH_EVENTS_MOCK[0], true);
            instance.push(PUBLISH_EVENTS_MOCK[1], true);

            expect(instance.events).toEqual(expected);
            expect(instance.processDebounced).not.toHaveBeenCalled();
        });

        it('should throw overflow error', () => {
            spyOn(instance, 'processDebounced').and.stub();

            for (let i = 0; i < 100; i++) {
                instance.push(PUBLISH_EVENTS_MOCK[i]);

                expect(instance.length).toBe(i + 1);
            }

            instance.push(PUBLISH_EVENTS_MOCK[100]);
            expect(instance.length).toBe(100);
        });
    });

    it('process() should call handler with reduced value', () => {
        const mockReduced = { test: 'test' };

        spyOn(instance, 'reduce').and.returnValue(mockReduced);

        instance.process();

        expect(instance.reduce).toHaveBeenCalled();
        expect(instance.handler).toHaveBeenCalledWith(mockReduced);
    });

    it('reduce() should reduce events into updateSchema object', () => {
        for (let i = 0; i < 10; i++) {
            instance.push({ type: 'UPDATE_EVENT', data: PUBLISH_EVENTS_MOCK[i] });
        }

        const result = instance.reduce();
        const expected = {
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
                }
            },
            thresholds : {
                'scneario1' : [
                    {
                        id   : 'setpoint',
                        name : 'Test name'
                    }
                ]
            },
            notifications  : {},
            scenarios      : {},
            eventsToRemove : new Set([
                'modbusdevice-20-13:2:null',
                'modbusdevice-nizhnii-dom:4:null',
                'setpoint',
                'xiaomi:158d00041466eb:humidity',
                'yahoo-weather:thermometer:temperature-sensor',
                'yahoo-weather:thermometer:desc',
                'yahoo-weather:null:location',
                'yahoo-weather:vane:null',
                'yahoo-weather:sky-indicator:null'
            ])
        }

        // console.log(JSON.stringify(result));

        expect(result).toEqual(expected);
        expect(instance.length).toBe(0);
    });

    it('_getDevice()', () => {
        const schema = {
            devices : {
                'test1' : { id: 'test1' },
                'test2' : { id: 'test2' },
                'test3' : { id: 'test3' }
            }
        };
        const expected = { id: 'test2' };

        const result = instance._getDevice(schema, 'test2');

        expect(result).toEqual(expected);
    });

    it('_getDeviceNode()', () => {
        const device = {
            id: 'test1',
            nodes: [
                { id: 'node1' },
                { id: 'node2' },
                { id: 'node3' }
            ]
        };
        const expected = { id: 'node3' };

        const result = instance._getDeviceNode(device, 'node3');

        expect(result).toEqual(expected);
    });

    it('_getScenarioThresholds()', () => {
        const schema = {
            thresholds : {
                'test1' : [ 'trh1', 'setpoint' ],
                'test2' : [ 'setpoint' ],
                'test3' : [ 'trh2', 'setpoint' ]
            }
        };
        const expected = [ 'trh2', 'setpoint' ];

        const result = instance._getScenarioThresholds(schema, 'test3');

        expect(result).toEqual(expected);
    });

    it('_addDevice()', () => {
        const schema = {
            devices : {
                'test1' : { id: 'test1' },
                'test2' : { id: 'test2' }
            }
        };
        const event = { item: { id: 'test3' } };
        const expected = {
            devices : {
                'test1' : { id: 'test1' },
                'test2' : { id: 'test2' },
                'test3' : { id: 'test3' }
            }
        };

        instance._addDevice(schema, event);

        expect(schema).toEqual(expected);
    });

    it('_addDeviceAttribute()', () => {
        const schema = {
            devices : {
                'test1' : {
                    id: 'test1',
                    nodes: [
                        { id: 'node1' }
                    ]
                },
                'test2' : { id: 'test2' }
            }
        };
        const event = { deviceId: 'test1', item: { id: 'node2' } };
        const expected = {
            devices : {
                'test1' : {
                    id: 'test1',
                    nodes: [
                        { id: 'node1' },
                        { id: 'node2' }
                    ]
                },
                'test2' : { id: 'test2' }
            }
        };

        instance._addDeviceAttribute(schema, event, 'nodes');

        expect(schema).toEqual(expected);
    });

    it('_addNodeAttribute()', () => {
        const schema = {
            devices : {
                'test1' : {
                    id: 'test1',
                    nodes: [
                        { id: 'node1' },
                        {
                            id: 'node2',
                            sensors: [ { id: 'sensor1' } ]
                        }
                    ]
                },
                'test2' : { id: 'test2' }
            }
        };
        const event = { deviceId: 'test1', nodeId: 'node2', item: { id: 'sensor2' } };
        const expected = {
            devices : {
                'test1' : {
                    id: 'test1',
                    nodes: [
                        { id: 'node1' },
                        {
                            id: 'node2',
                            sensors: [
                                { id: 'sensor1' },
                                { id: 'sensor2' }
                            ]
                        }
                    ]
                },
                'test2' : { id: 'test2' }
            }
        };

        instance._addNodeAttribute(schema, event, 'sensors');

        expect(schema).toEqual(expected);
    });

    it('_addThreshold()', () => {
        const schema = {
            thresholds : {
                'test1' : [ 'trh1' ],
                'test2' : [ 'trh2' ]
            }
        };
        const event = { scenarioId: 'test2', item: 'setpoint' };
        const expected = {
            thresholds : {
                'test1' : [ 'trh1' ],
                'test2' : [ 'trh2', 'setpoint' ]
            }
        };

        instance._addThreshold(schema, event);

        expect(schema).toEqual(expected);
    });

    describe('_addEventToRemove()', () => {
        it('attribute', () => {
            const schema = {
                eventsToRemove : new Set([ 'test' ]),
            };
            const event = { deviceId: 'device1', nodeId: null, propertyId: 'prop1' };
            const expected = {
                eventsToRemove : new Set([ 'test', 'device1:null:prop1' ])
            };

            instance._addEventToRemove(schema, event);

            expect(schema).toEqual(expected);
        });

        it('threshold', () => {
            const schema = {
                eventsToRemove : new Set([ 'test' ]),
            };
            const event = { deviceId: 'threshold', nodeId: 'scenario1', propertyId: 'setpoint' };
            const expected = {
                eventsToRemove : new Set([ 'test', 'setpoint' ])
            };

            instance._addEventToRemove(schema, event);

            expect(schema).toEqual(expected);
        });
    });

    it('_addSubjectProperty()', () => {
        const schema = {
            nodes: [],
            options: [ { id: 'test1' }, { id: 'test2' } ]
        };
        const event = { field: 'name', value: 'Test' };
        const expected = {
            nodes: [],
            options: [
                { id: 'test1' },
                { id: 'test2', name: 'Test' }
            ]
        };

        instance._addSubjectProperty(schema, event, 'options', 'test2');

        expect(schema).toEqual(expected);
    });

    it('_updateDeviceAttribute()', () => {
        const schema = {
            devices: {
                'test1': { id: 'test1' },
                'test2': { id: 'test2' }
            }
        };
        const event = { field: 'name', value: 'Test', deviceId: 'test1' };
        const expected = {
            devices: {
                'test1': { id: 'test1', name: 'Test' },
                'test2': { id: 'test2' }
            }
        };

        instance._updateDeviceAttribute(schema, event);

        expect(schema).toEqual(expected);
    });

    it('_updateNodeAttribute()', () => {
        const schema = {
            devices: {
                'test1': { id: 'test1' },
                'test2': {
                    id: 'test2',
                    nodes: [
                        { id: 'node1' },
                        { id: 'node2' }
                    ]
                }
            }
        };
        const event = { field: 'name', value: 'Test', deviceId: 'test2', nodeId: 'node1' };
        const expected = {
            devices: {
                'test1': { id: 'test1' },
                'test2': {
                    id: 'test2',
                    nodes: [
                        { id: 'node1', name: 'Test' },
                        { id: 'node2' }
                    ]
                }
            }
        };

        instance._updateNodeAttribute(schema, event);

        expect(schema).toEqual(expected);
    });

    it('_updateDeviceProperty()', () => {
        const schema = {
            devices: {
                'test1': {
                    id: 'test1',
                    options: [
                        { id: 'opt1' },
                        { id: 'opt2' }
                    ]
                },
                'test2': { id: 'test2' }
            }
        };
        const event = { field: 'name', value: 'Test', deviceId: 'test1', propertyId: 'opt1' };
        const expected = {
            devices: {
                'test1': {
                    id: 'test1',
                    options: [
                        { id: 'opt1', name: 'Test' },
                        { id: 'opt2' }
                    ]
                },
                'test2': { id: 'test2' }
            }
        };

        instance._updateDeviceProperty(schema, event, 'options');

        expect(schema).toEqual(expected);
    });

    it('_updateNodeProperty()', () => {
        const schema = {
            devices: {
                'test1': { id: 'test1' },
                'test2': {
                    id: 'test2',
                    nodes: [
                        {
                            id: 'node1',
                            sensors: [
                                { id: 'sen1' },
                                { id: 'sen2' }
                            ]
                        },
                        { id: 'node2' }
                    ]
                }
            }
        };
        const event = { field: 'name', value: 'Test', deviceId: 'test2', nodeId: 'node1', propertyId: 'sen1' };
        const expected = {
            devices: {
                'test1': { id: 'test1' },
                'test2': {
                    id: 'test2',
                    nodes: [
                        {
                            id: 'node1',
                            sensors: [
                                { id: 'sen1', name: 'Test' },
                                { id: 'sen2' }
                            ]
                        },
                        { id: 'node2' }
                    ]
                }
            }
        };

        instance._updateNodeProperty(schema, event, 'sensors');

        expect(schema).toEqual(expected);
    });

    it('_updateThresholdProperty()', () => {
        const schema = {
            thresholds: {
                'scenario1' : [ { id: 'test1' } ],
                'scenario2' : [ { id: 'test2' } ]
            }
        };
        const event = { field: 'name', value: 'Test', nodeId: 'scenario2', propertyId: 'test2' };
        const expected = {
            thresholds: {
                'scenario1' : [ { id: 'test1' } ],
                'scenario2' : [ { id: 'test2', name: 'Test' } ]
            }
        };

        instance._updateThresholdProperty(schema, event);

        expect(schema).toEqual(expected);
    });
});
