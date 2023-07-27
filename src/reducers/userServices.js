import produce                      from 'immer';
import { USER_SERVICES_SORT_ORDER } from '../assets/constants/localStorage';
import { getData }                  from '../utils/localStorage';
import {
    GET_BRIDGE_ENTITIES,
    ADD_BRIDGE_ENTITY,
    UPDATE_BRIDGE_ATTRIBUTE,
    DELETE_BRIDGE_ENTITY,
    SET_USER_SERVICES_SEARCH_QUERY,
    SET_USER_SERVICES_SORT_ORDER,
    SET_USER_SERVICES_CURRENT_PAGE
} from '../actions/userServices';

const INITIAL_STATE = {
    list        : [],
    isFetching  : true,
    searchQuery : '',
    sortOrder   : getData(USER_SERVICES_SORT_ORDER) || 'ASC',
    currentPage : 1
};

export default produce((draft, action) => {
    switch (action.type) {
        case GET_BRIDGE_ENTITIES:
            draft.list = action.payload.services;
            draft.isFetching = false;
            break;

        case ADD_BRIDGE_ENTITY: {
            const { service } = action.payload;
            const index = draft.list.findIndex(item => item.id === service.id);

            if (index >= 0) {
                draft.list[index] = service;
            } else {
                draft.list.push(service);
            }
            break;
        }

        case UPDATE_BRIDGE_ATTRIBUTE: {
            const { id, updated } = action.payload;
            const index = draft.list.findIndex(item => item.id === id);

            if (index >= 0) {
                draft.list[index] = {
                    ...draft.list[index],
                    ...updated
                };
            }
            break;
        }

        case DELETE_BRIDGE_ENTITY:
            draft.list = draft.list.filter(item => item.id !== action.payload.id);
            break;

        case SET_USER_SERVICES_SEARCH_QUERY:
            draft.searchQuery = action.payload.searchQuery;
            break;

        case SET_USER_SERVICES_SORT_ORDER:
            draft.sortOrder = action.payload.sortOrder;
            break;

        case SET_USER_SERVICES_CURRENT_PAGE:
            draft.currentPage = action.payload.currentPage;
            break;

        default:
            break;
    }
}, INITIAL_STATE);
