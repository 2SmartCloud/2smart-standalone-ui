import * as actions from '../../actions/client/widget';
import reducer      from './widget';
import {
    TOPICS_LIST,
    PROPERTIES_LIST
}                   from '../../__mocks__/topicsList';

describe('Discoveries reducer', () => {
    let initialState;
    const previousTopics = TOPICS_LIST;

    beforeEach(() => {
        initialState = {
            topics         : [],
            groups         : [],
            isFetching     : false,
            currTopic      : null,
            currGroup      : null,
            isGroupSelected: false,
            activeValue    : null,
            activeValueTab : 0,
            widgetId       : '',
            bgColor        : '',
            name           : '',
            params         : {},
            advanced       : {},
            dataType       : '',
            error          : {},
            selectedTopics : []
        };
    });

    it('should return initial state', () => {
        const result = reducer(undefined, {});

        expect(result).toEqual(initialState);
    });

    it('ADD_TOPICS_TO_MULTI_WIDGET', () => {

        const action = {
            type: actions.ADD_TOPICS_TO_MULTI_WIDGET,
            topics:  [TOPICS_LIST[0]]
        };
        const result = reducer(initialState, action);

        expect(result.selectedTopics).toEqual([TOPICS_LIST[0] ]);
    });

    xit('DELETE_TOPIC_FROM_MULTI_WIDGET', () => {
        initialState.selectedTopics = TOPICS_LIST;

        const action = {
            type: actions.DELETE_TOPIC_FROM_MULTI_WIDGET,
            topicObj: TOPICS_LIST[0]
        };
        const result = reducer(initialState, action);

        expect(result.selectedTopics).toEqual([TOPICS_LIST[1]]);
    });

    it('CHANGE_TOPICS_ORDER', () => {
        initialState.selectedTopics = TOPICS_LIST;

        const action = {
            type: actions.CHANGE_TOPICS_ORDER,
            source:0,
            destination:1,
        };
        const result = reducer(initialState, action);

        const expected=[TOPICS_LIST[1],TOPICS_LIST[0]]
        expect(result.selectedTopics).toEqual(expected);
    });

    it('SELECT_WIDGET', () => {
        const action = {
            type     : actions.SELECT_WIDGET,
            widgetId : 1,
            name     : 'name',
            bgColor  : '#FFF',
            dataType : 'string',
            topics   : TOPICS_LIST
        };
        const result = reducer(initialState, action);

        expect(result.widgetId).toEqual(1);
        expect(result.name).toEqual('name');
        expect(result.advanced).toEqual({});
        expect(result.bgColor).toEqual('#FFF');
        expect(result.dataType).toEqual('string');
        expect(result.selectedTopics).toEqual(TOPICS_LIST);
    });
});
