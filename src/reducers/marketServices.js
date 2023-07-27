import produce               from 'immer';
import { MARKET_SORT_ORDER } from '../assets/constants/localStorage';
import { getData }           from '../utils/localStorage';
import {
    GET_MARKET_SERVICES,
    ADD_MARKET_SERVICE,
    UPDATE_MARKET_SERVICE_ATTRIBUTE,
    SET_MARKET_SERVICES_CURRENT_PAGE,
    SET_MARKET_SERVICES_SEARCH_QUERY,
    SET_MARKET_SERVICES_SORT_ORDER,
    CHANGE_CHECK_PROCCESSING
} from '../actions/marketServices';

const INITIAL_STATE = {
    list        : [],
    isFetching  : true,
    searchQuery : '',
    sortOrder   : getData(MARKET_SORT_ORDER) || 'ASC',
    currentPage : 1
};

export default produce((draft, action) => {
    switch (action.type) {
        case GET_MARKET_SERVICES:
            draft.list = action.payload.services;
            draft.isFetching = false;
            break;

        case ADD_MARKET_SERVICE: {
            const { service } = action.payload;
            const index = draft.list.findIndex(item => item.name === service.name);

            if (index >= 0) {
                draft.list[index] = service;
            } else {
                draft.list.push(service);
            }
            break;
        }

        case UPDATE_MARKET_SERVICE_ATTRIBUTE: {
            const { name, updated } = action.payload;
            const index = draft.list.findIndex(item => item.name === name);

            if (index >= 0) {
                draft.list[index] = {
                    ...draft.list[index],
                    ...updated
                };
            }
            break;
        }

        case CHANGE_CHECK_PROCCESSING: {
            const { entityId, isProcessing, processingLabel  } = action.payload;
            const index = draft.list.findIndex(item => item.name === entityId);

            if (index >= 0) {
                draft.list[index] = {
                    ...draft.list[index],
                    processingLabel,
                    isProcessing
                };
            }
            break;
        }

        case SET_MARKET_SERVICES_SEARCH_QUERY:
            draft.searchQuery = action.payload.searchQuery;
            break;

        case SET_MARKET_SERVICES_SORT_ORDER:
            draft.sortOrder = action.payload.sortOrder;
            break;

        case SET_MARKET_SERVICES_CURRENT_PAGE:
            draft.currentPage = action.payload.currentPage;
            break;

        default:
            break;
    }
}, INITIAL_STATE);
