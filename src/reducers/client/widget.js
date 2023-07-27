import produce from 'immer';
import {
    GET_TOPICS_BY_DATA_TYPE,
    CREATING_NEW_WIDGET,
    ERROR_FETCHING_CREATE_WIDGET,
    UPDATING_WIDGET,
    DELETING_WIDGET,
    FINISH_FETCHING,
    ERROR_FETCHING_DELETE_WIDGET,
    CLEAR_WIDGET_VALUE_STATE,
    SELECT_TOPIC,
    SELECT_WIDGET,
    CHANGE_WIDGET_NAME,
    CHANGE_WIDGET_COLOR,
    ERROR_FETCHING_UPDATE_WIDGET,
    SET_ERRORS,
    SET_WIDGET_OPTION,
    SET_WIDGET_ADVANCED_OPTIONS,
    SELECT_GROUP,
    CHANGE_TAB,
    CHANGE_ACTIVE_VALUE,
    GET_WIDGET_GROUPS,
    ADD_TOPICS_TO_MULTI_WIDGET,
    DELETE_TOPIC_FROM_MULTI_WIDGET,
    CHANGE_TOPICS_ORDER,
    SET_TOPIC_BY_KEY_TO_MULTI_WIDGET
} from './../../actions/client/widget';

const initialState = {
    topics          : [],
    groups          : [],
    isFetching      : false,
    currTopic       : null,
    currGroup       : null,
    isGroupSelected : false,
    activeValue     : null,
    activeValueTab  : 0,
    widgetId        : '',
    bgColor         : '',
    name            : '',
    params          : {},
    advanced        : {},
    dataType        : '',
    error           : {},
    selectedTopics  : []
};

export default produce((draft, action) => {
    switch (action.type) {
        case SELECT_WIDGET: {
            draft.widgetId = action.widgetId;
            draft.name = action.name;
            draft.bgColor = action.bgColor || '';
            draft.advanced = action.advanced || {};
            draft.dataType = action.dataType || '';
            draft.selectedTopics = action.topics || [];
            break;
        }
        case SELECT_TOPIC: {
            draft.activeValueTab  = 0;
            draft.currTopic       = action.topic;
            draft.currGroup       = null;
            draft.isGroupSelected = false;
            break;
        }
        case CHANGE_TAB: {
            draft.activeValueTab = action.tab;
            break;
        }
        case CHANGE_ACTIVE_VALUE:  {
            draft.activeValue = action.value;
            break;
        }
        case SELECT_GROUP:  {
            draft.activeValueTab  = 1;
            draft.currGroup       = action.group;
            draft.currTopic       = null;
            draft.isGroupSelected = true;
            break;
        }
        case GET_WIDGET_GROUPS:  {
            draft.groups = action.groups;
            break;
        }
        case UPDATING_WIDGET:
        case DELETING_WIDGET:
        case CREATING_NEW_WIDGET: {
            draft.isFetching = true;
            break;
        }
        case FINISH_FETCHING: {
            draft.isFetching = false;
            draft.error = {};

            break;
        }
        case ERROR_FETCHING_DELETE_WIDGET:
        case ERROR_FETCHING_CREATE_WIDGET: {
            draft.isFetching = false;
            break;
        }
        case ERROR_FETCHING_UPDATE_WIDGET: {
            draft.isFetching = false;
            draft.error = action.error;

            break;
        }
        case GET_TOPICS_BY_DATA_TYPE: {
            draft.topics = action.topics;
            draft.isFetching = false;
            draft.params = action.params;
            break;
        }
        case CHANGE_WIDGET_NAME: {
            draft.name = action.name;
            break;
        }
        case CHANGE_WIDGET_COLOR: {
            draft.bgColor = action.bgColor;
            break;
        }
        case CLEAR_WIDGET_VALUE_STATE: {
            return initialState;
        }
        case SET_ERRORS: {
            draft.error = action.error;
            break;
        }
        case SET_WIDGET_OPTION: {
            const { key, value, isAdvanced } = action;

            if (isAdvanced) {
                draft.advanced[key] = value;
            } else {
                draft.key = value;
            }
            break;
        }
        case SET_WIDGET_ADVANCED_OPTIONS:
            draft.advanced = {
                ...draft.advanced,
                ...action.advanced
            };
            break;

        case  ADD_TOPICS_TO_MULTI_WIDGET:
            (action.topics || []).forEach(topic => draft.selectedTopics.push(topic));
            break;
        case SET_TOPIC_BY_KEY_TO_MULTI_WIDGET: {
            const { topicObj } = action;
            const index = draft.selectedTopics.findIndex(item => item.order === topicObj.order);

            if (index >= 0) {
                draft.selectedTopics[index] = topicObj;
            } else  draft.selectedTopics.push(topicObj);
            break;
        }
        case  DELETE_TOPIC_FROM_MULTI_WIDGET:
            draft.selectedTopics = draft.selectedTopics.filter(({ topic }) => topic !== action.topicObj.topic);

            break;
        case CHANGE_TOPICS_ORDER: {
            const [ removed ] =  draft.selectedTopics.splice(action.source, 1);

            draft.selectedTopics.splice(action.destination, 0, removed);

            break;
        }

        default:
            break;
    }
}, initialState);
