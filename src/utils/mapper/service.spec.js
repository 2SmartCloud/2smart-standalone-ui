import { MARKET_SERVICES_MOCK_LIST } from '../../__mocks__/marketServicesMock';
import {
    mapServiceTypeEntityToServiceType,
    mapServiceTypeUpdateEntityToServiceTypeUpdate,
    mapBridgeEntityTOToService,
    mapBridgeEntityUpdateTOToServiceUpdate,
    transformFieldsToFormInitialState,
    mapScenarioTypeTOToScenarioType
} from './service';

jest.mock('../../../config', () => ({
    apiUrl : 'https://localhost:8000'
}));

describe('service mappers', () => {
    it('mapServiceTypeEntityToServiceType()', () => {
        const given = {
            id            : 'test-bridge',
            title         : 'Test Bridge',
            icon          : 'static/icon.svg',
            state         : 'pulled',
            version       : { updated: true },
            configuration : {
                fields : []
            }
        };
        const expected = {
            name    : 'test-bridge',
            label   : 'Test Bridge',
            icon    : 'https://localhost:8000/static/icon.svg',
            fields  : [],
            status  : 'installed',
            state   : 'pulled',
            version : { updated: true }
        };

        const result = mapServiceTypeEntityToServiceType(given);

        expect(result).toEqual(expected);
    });

    it('mapServiceTypeUpdateEntityToServiceTypeUpdate()', () => {
        const given = {
            state         : 'pulled',
            version       : JSON.stringify({ updated: true })
        };
        const expected = {
            status  : 'installed',
            state   : 'pulled',
            version : { updated: true }
        };

        const result = mapServiceTypeUpdateEntityToServiceTypeUpdate(given);

        expect(result).toEqual(expected);
    });

    it('mapBridgeEntityTOToService()', () => {
        const given = {
            id            : 'test-1',
            type          : 'test-bridge',
            configuration : {
                testField : 'test'
            },
            state : 'started'
        };
        const expected = {
            id     : 'test-1',
            type   : 'test-bridge',
            state  : 'started',
            status : 'ACTIVE',
            params : {
                testField : 'test'
            }
        };

        const result = mapBridgeEntityTOToService(given);

        expect(result).toEqual(expected);
    });

    it('mapBridgeEntityUpdateTOToServiceUpdate()', () => {
        const given = {
            configuration : JSON.stringify({
                testField : 'test'
            }),
            state : 'started'
        };
        const expected = {
            state  : 'started',
            status : 'ACTIVE',
            params : {
                testField : 'test'
            }
        };

        const result = mapBridgeEntityUpdateTOToServiceUpdate(given);

        expect(result).toStrictEqual(expected);
    });

    it('transformFieldsToFormInitialState()', () => {
        const expected = {
            'KNX_CONNECTION_IP_ADDR' : '192.168.1.1',
            'KNX_CONNECTION_IP_PORT' : 502
        };

        const result = transformFieldsToFormInitialState(MARKET_SERVICES_MOCK_LIST[0].fields);

        expect(result).toEqual(expected);
    });

    it('mapScenarioTypeTOToScenarioType()', () => {
        const given = {
            id            : 'test-type',
            title         : 'Test Scenario Type',
            description   : 'Test description',
            language      : 'JS',
            icon          : 'static/icon.svg',
            configuration : {
                fields : []
            }
        };
        const expected = {
            id            : 'test-type',
            title         : 'Test Scenario Type',
            description   : 'Test description',
            language      : 'JS',
            icon          : 'https://localhost:8000/static/icon.svg',
            fields        : []
        };

        const result = mapScenarioTypeTOToScenarioType(given);

        expect(result).toEqual(expected);
    });
});
