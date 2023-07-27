import {
    TOPICS_MOCK_WITH_ALIASES,
    DEVICES_MOCK,
    DEVICES_MOCK_WITH_ALIASES,
} from '../../__mocks__/deviceMock';
import {SELCTED_GROUPS_LIST} from '../../__mocks__/groupsListMock';
import {
    ALIASES
} from '../../__mocks__/aliasesMock';
import {
    filterTopicsByDataType,
    getTopics,
    getDevicesWithAlias
} from './getTopics';
import {SELECTED_GROUPS_LIST_TOPICS} from "../../__mocks__/groupsListMock";
import { HOMIE_SCENARIOS } from "../../__mocks__/homieScenarios";


describe('getTopics utils', () => {
    it('filterTopicsByDataType() should filter topics', () => {
        const filtered= filterTopicsByDataType(TOPICS_MOCK_WITH_ALIASES,['color']);

        expect (filtered).toEqual([{
            alias        : ALIASES[2],
            value        : 'sweet-home/fat/colors/rgb-valid',
            name         : 'RGB Valid',
            topic        : "sweet-home/fat/colors/rgb-valid",
            type         : "color",
            title        : '',
            label        : 'RGB Valid — rgb — sweet-home/fat/colors/rgb-valid',
            id           : 'sweet-home/fat/colors/rgb-valid',
            withTitle    : false,
            deviceId     : "fat",
            hardwareType : "node",
            isActive     : true,
            deviceId     : "fat",
            hardwareType : "node",
            nodeId       : "colors",
            nodeId       : "colors",
            propertyId   : "rgb-valid",
            propertyType : "sensors",
            propertyId   : "rgb-valid",
            propertyType : "sensors",
        }]);
    });

    it('getTopics() should select topics from devices', () => {
        const topics= getTopics(DEVICES_MOCK, ALIASES);

        expect (topics).toEqual(TOPICS_MOCK_WITH_ALIASES);
    });

    it('getDevicesWithAlias() should сompare alias to device', () => {
        const topics = getDevicesWithAlias({
            aliasList: ALIASES,
            devices: DEVICES_MOCK
        })

        expect (topics).toEqual(DEVICES_MOCK_WITH_ALIASES);
    });

    it('getTopics() should convert groups to topics', () => {
        const topics = getTopics({}, [], [], SELCTED_GROUPS_LIST)

        expect(topics).toEqual(SELECTED_GROUPS_LIST_TOPICS)
    });

    it('getTopics() should return empty array', () => {
        const topics = getTopics({}, [], [], [])

        expect(topics).toEqual([])
    });

    it('getTopics() should return homie scenarios', () => {
        const topics = getTopics({}, [], [], [], HOMIE_SCENARIOS);

        expect(topics).toEqual([
            {
              topic: 'scenarios/device/$state',
              isActive: true,
              type: 'boolean',
              name: 'device',
              title: undefined,
              hardwareType: 'scenario',
              deviceId: 'scenario',
              nodeId: 'device',
              propertyId: 'device',
              propertyType: 'scenario',
              label: 'device — scenarios/device/$state',
              alias: {}
            },
            {
              topic: 'scenarios/ertyui/$state',
              isActive: true,
              type: 'boolean',
              name: 'ertyui',
              title: undefined,
              hardwareType: 'scenario',
              deviceId: 'scenario',
              nodeId: 'ertyui',
              propertyId: 'ertyui',
              propertyType: 'scenario',
              label: 'ertyui — scenarios/ertyui/$state',
              alias: {}
            }
        ]);
    });
})
