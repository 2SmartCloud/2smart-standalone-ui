import * as search from './search';
import {DEVICES_MOCK, DEVICES_MOCK_WITH_ALIASES} from '../__mocks__/deviceMock';
import {ALIASES} from '../__mocks__/aliasesMock';


describe('getDataFromSearch()', () => {
    it('should return full device', () => {
        const expected = DEVICES_MOCK

        const result = search.getDataFromSearch( DEVICES_MOCK, 'device');

        expect(result).toEqual(Object.values(DEVICES_MOCK));
    });

    it('should return full node', () => {
        const expected = [
            {
                firmwareName    : 'asdad',
                firmwareVersion : '1231231',
                id              : 'fat',
                implementation  : 'dafs',
                localIp         : '112',
                mac             : '2312',
                name            : 'Fat device',
                rootTopic       : 'sweet-home/fat',
                state           : 'ready',
                title           : '',
                nodes           : [
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
                                title     : '',
                                value     : '0,0,0',
                                settable  : 'true',
                                retained  : 'true',
                                dataType  : 'color',
                                unit      : '#',
                                format    : 'rgb',
                                rootTopic : 'sweet-home/fat/colors/rgb-valid',
                                groups    : ['1']
                            }
                        ],
                        options   : [],
                        telemetry : [],
                        hidden    : 'false'
                    },
                ],
                options         : [],
                telemetry       : [
                    {
                        dataType  : 'string',
                        format    : '',
                        id        : 'supply',
                        name      : 'Supply',
                        title     : '',
                        retained  : 'true',
                        rootTopic : 'sweet-home/fat/$telemetry/supply',
                        settable  : 'false',
                        units     : '%',
                        value     : '1.4254лдыа'
                    },
                    {
                        dataType  : 'float',
                        format    : '',
                        id        : 'uptime',
                        name      : 'Up time',
                        title     : '',
                        retained  : 'true',
                        rootTopic : 'sweet-home/fat/$telemetry/uptime',
                        settable  : 'true',
                        units     : 'sec',
                        value     : '329802842844'
                    }
                ]
            }
        ]

        const result = search.getDataFromSearch( DEVICES_MOCK, 'color');


        expect(result).toEqual(expected);
    });




    it('should return node with one displayed sensor', () => {
        const expected = [
            {
                firmwareName    : 'asdad',
                firmwareVersion : '1231231',
                id              : 'fat',
                implementation  : 'dafs',
                localIp         : '112',
                mac             : '2312',
                name            : 'Fat device',
                rootTopic       : 'sweet-home/fat',
                state           : 'ready',
                title           : '',
                nodes           : [
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
                                displayed : true, 
                                title     : '',
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
                ],
                options         : [],
                telemetry       : [
                    {
                        dataType  : 'string',
                        format    : '',
                        id        : 'supply',
                        name      : 'Supply',
                        title     : '',
                        retained  : 'true',
                        rootTopic : 'sweet-home/fat/$telemetry/supply',
                        settable  : 'false',
                        units     : '%',
                        value     : '1.4254лдыа'
                    },
                    {
                        dataType  : 'float',
                        format    : '',
                        id        : 'uptime',
                        name      : 'Up time',
                        title     : '',
                        retained  : 'true',
                        rootTopic : 'sweet-home/fat/$telemetry/uptime',
                        settable  : 'true',
                        units     : 'sec',
                        value     : '329802842844'
                    }
                ]
            }
        ]

        const result = search.getDataFromSearch( DEVICES_MOCK, 'en');

        expect(result).toEqual(expected);
    });


    it('should return device node with alias sensor', () => {
        const expected = [
            {
                firmwareName    : 'asdad',
                firmwareVersion : '1231231',
                id              : 'fat',
                implementation  : 'dafs',
                localIp         : '112',
                mac             : '2312',
                name            : 'Fat device',
                rootTopic       : 'sweet-home/fat',
                state           : 'ready',
                title           : '',
                nodes           : [
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
                                title     : '',
                                alias     : ALIASES[2],
                                value     : '0,0,0',
                                settable  : 'true',
                                retained  : 'true',
                                dataType  : 'color',
                                unit      : '#',
                                format    : 'rgb',
                                rootTopic : 'sweet-home/fat/colors/rgb-valid',
                                groups    : ['1']
                            }
                        ],
                        options   : [],
                        telemetry : [],
                        hidden    : 'false'
                    },
                ],
                options         : [],
                telemetry       : [
                    {
                        dataType  : 'string',
                        format    : '',
                        id        : 'supply',
                        name      : 'Supply',
                        alias     : ALIASES[0],
                        title     : '',
                        retained  : 'true',
                        rootTopic : 'sweet-home/fat/$telemetry/supply',
                        settable  : 'false',
                        units     : '%',
                        value     : '1.4254лдыа'
                    },
                    {
                        dataType  : 'float',
                        format    : '',
                        id        : 'uptime',
                        name      : 'Up time',
                        alias     : ALIASES[1],
                        title     : '',
                        retained  : 'true',
                        rootTopic : 'sweet-home/fat/$telemetry/uptime',
                        settable  : 'true',
                        units     : 'sec',
                        value     : '329802842844'
                    }
                ]
            }
        ]

        const result = search.getDataFromSearch( DEVICES_MOCK_WITH_ALIASES, 'rgb');


        expect(result).toEqual(expected);
    });


});
