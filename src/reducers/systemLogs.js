import produce from 'immer';
import {
    DEFAULT_LOGS_LIMIT,
    GET_SYSTEM_LOGS_REQUEST,
    GET_SYSTEM_LOGS_SUCCESS,
    GET_SYSTEM_LOGS_FAILURE,
    SET_SYSTEM_LOGS_SEARCH_QUERY,
    SET_SYSTEM_LOGS_SORT_ORDER,
    SET_SYSTEM_LOGS_LEVEL,
    SET_SYSTEM_LOGS_LIMIT
} from '../actions/systemLogs';

const INITIAL_STATE = {
    list        : [],
    total       : 0,
    initFetched : false,
    hasEntries  : false,
    isFetching  : true,
    searchQuery : undefined,
    logLevel    : undefined,
    sortOrder   : 'desc',
    limit       : DEFAULT_LOGS_LIMIT,

    requestsCount : 0
};

export default produce((draft, { type, payload }) => {
    switch (type) {
        case GET_SYSTEM_LOGS_REQUEST:
            draft.isFetching  = true;
            draft.requestsCount++;
            break;

        case GET_SYSTEM_LOGS_SUCCESS:
            draft.list = payload.list;
            draft.total = payload.total;
            draft.requestsCount--;

            if (draft.list.length) {
                draft.initFetched = true;
                draft.hasEntries = true;
            }

            if (draft.requestsCount === 0) {
                draft.isFetching = false;
            }

            break;

        case GET_SYSTEM_LOGS_FAILURE:
            draft.requestsCount--;

            if (draft.requestsCount === 0) {
                draft.isFetching = false;
            }

            break;

        case SET_SYSTEM_LOGS_SEARCH_QUERY:
            draft.searchQuery = payload.searchQuery;
            break;

        case SET_SYSTEM_LOGS_SORT_ORDER:
            draft.sortOrder = payload.sortOrder;
            break;

        case SET_SYSTEM_LOGS_LEVEL:
            draft.logLevel = payload.logLevel;
            break;

        case SET_SYSTEM_LOGS_LIMIT:
            draft.limit = payload.limit;
            break;

        default:
            break;
    }
}, INITIAL_STATE);
