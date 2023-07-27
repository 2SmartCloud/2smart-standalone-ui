import * as widget from './widget';

const topics = [
    "sweet-home/fat/$telemetry/supply",
    "sweet-home/fat/thermostat/$options/accuracy"
];

const mappedTopics = [
    "sweet-home/fat/$telemetry/supply",
    "sweet-home/fat/thermostat/$options/accuracy"
];

const mappedSingleTopic = "sweet-home/fat/thermostat/$options/accuracy";

describe('widget mapper', () => {
    it('mapWidget multiple type', () => {

        const given = {
            name     : 'name',
            bgColor  : '#FFF',
            advanced : {},
            topics   : topics,
            type     : 'card'
        };
        const expected = {
            isMulti  : true,
            name     : 'name',
            bgColor  : '#FFF',
            advanced : {},
            topics   : mappedTopics,
            type     : 'card'
        };

        const result = widget.mapWidget(given);

        expect(result).toEqual(expected);
    });

    it('mapWidget single type', () => {
        const given = {
            name     : 'name',
            bgColor  : '#FFF',
            advanced : {},
            topics   : [topics[1]],
            type     : 'string'
        };

        const expected = {
            isMulti  : false,
            name     : 'name',
            bgColor  : '#FFF',
            advanced : {},
            type     : 'string',
            topic    : mappedSingleTopic
        };

        const result = widget.mapWidget(given);

        expect(result).toEqual(expected);
    });

    // it('mapSingleTopic ', () => {
    //     const result = widget.mapSingleTopic(topics[1]);

    //     expect(result).toEqual(mappedSingleTopic);
    // });

    // it('mapTopic ', () => {
    //     const result = widget.mapTopic(topics[0]);

    //     expect(result).toEqual(mappedTopics[1]);
    // });
});
