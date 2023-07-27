import * as widget from './widget';

const multiData = {
    screen:1,
    isFetching: false,
    currTopic: null,
    currGroup: null,
    activeValue: null,
    activeValueTab: 0,
    widgetId: '106',
    bgColor: '',
    name: '',
    type: 'card',
    label: 'Card',
    isMulti: true,
    dataType: '',
    error: {},
    selectedTopics: [
      {
        label: 'cccccc — sweet-home/perfect/$telemetry/color-rgb)',
        topic: 'sweet-home/perfect/$telemetry/color-rgb',
        dataType: 'color',
        deviceId: 'perfect',
        nodeId: null,
        propertyId: 'color-rgb',
        hardwareType: 'device',
        propertyType: 'telemetry',
        order: 0,
        widgetId: 106
      }
    ]
};

const dumpedMultiWidget = {
    screen:1,
    bgColor: '',
    name: '',
    type: 'card',
    advanced:{},
    topics: [
      {
        topicName: 'cccccc — sweet-home/perfect/$telemetry/color-rgb)',
        topic: 'sweet-home/perfect/$telemetry/color-rgb',
        dataType: 'color',
        deviceId: 'perfect',
        nodeId: null,
        propertyId: 'color-rgb',
        hardwareType: 'device',
        propertyType: 'telemetry',
        order: 0
      }
    ]
};


const singleTopicWidget = {
    isFetching: false,
    currTopic: {
        isMulti: false,
        type: 'enum',
        id: '104',
        name: '',
        bgColor: '',
        label: '1 — sweet-home/perfect/enum/$options/enum2)',
        topic: 'sweet-home/perfect/enum/$options/enum2',
        dataType: 'enum',
        deviceId: 'perfect',
        nodeId: 'enum',
        propertyId: 'enum2',
        hardwareType: 'node',
        propertyType: 'options',
        order: 0,
        widgetId: 104,
        createdAt: '2020-04-12T19:32:02.179Z',
        updatedAt: '2020-04-12T19:32:02.179Z',
        advanced: {}
    },
    currGroup: null,
    activeValue: {
        isMulti: false,
        type: 'enum',
        id: '104',
        name: '',
        bgColor: '',
        label: '1 — sweet-home/perfect/enum/$options/enum2)',
        topic: 'sweet-home/perfect/enum/$options/enum2',
        dataType: 'enum',
        deviceId: 'perfect',
        nodeId: 'enum',
        propertyId: 'enum2',
        hardwareType: 'node',
        propertyType: 'options',
        order: 0,
        widgetId: 104,
    },
    activeValueTab: 0,
    widgetId: '104',
    screen:1,
    bgColor: '',
    name: '',
    type: 'enum',
    label: 'List',
    isMulti: false,
    advanced: {},
    dataType: '',
    error: {},
    selectedTopics: []
}

const dumpedSingleTopicWidget={
    bgColor: '',
    name: '',
    type: 'enum',
    screen:1,
    advanced: {},
    topics: [
        {
            topicName: '1 — sweet-home/perfect/enum/$options/enum2)',
            topic: 'sweet-home/perfect/enum/$options/enum2',
            dataType: 'enum',
            deviceId: 'perfect',
            nodeId: 'enum',
            propertyId: 'enum2',
            hardwareType: 'node',
            propertyType: 'options',
            order: 0,
        }
    ]
}



describe('dumpWidget ', () => {
    it('dumpWidget multiple type', () => {
        const result = widget.dumpWidget(multiData);

        expect(result).toEqual(dumpedMultiWidget);
    });

    it('dumpWidget single type', () => {
        const result = widget.dumpWidget(singleTopicWidget);

        expect(result).toEqual(dumpedSingleTopicWidget);
    });

});
