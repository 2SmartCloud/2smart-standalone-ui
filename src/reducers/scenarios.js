import produce                  from 'immer';
import { SCENARIOS_SORT_ORDER } from '../assets/constants/localStorage';
import { getData }              from '../utils/localStorage';
import {
    GET_SCENARIOS_REQUEST,
    GET_SCENARIOS_SUCCESS,
    GET_SCENARIOS_FAILURE,
    GET_SCENARIO_REQUEST,
    GET_SCENARIO_SUCCESS,
    GET_SCENARIO_FAILURE,
    SET_SCENARIOS_SEARCH_QUERY,
    SET_SCENARIOS_SORT_ORDER,
    SET_SCENARIOS_CURRENT_PAGE
} from '../actions/scenarios';

function getInitialSortOrder() {
    const savedOrder = getData(SCENARIOS_SORT_ORDER);
    const AVAILABLE_LIST = [ 'NAME_ASC', 'NAME_DESC', 'DATE_ASC', 'DATE_DESC' ];

    if ([ 'ASC', 'DESC' ].includes(savedOrder)) {
        return `NAME_${savedOrder}`;
    }

    if (!AVAILABLE_LIST?.includes(savedOrder)) {
        return 'NAME_ASC';
    }

    return savedOrder;
}


const initialState = {
    list        : [],
    isFetching  : true,
    isUpdating  : false,
    searchQuery : '',
    sortOrder   : getInitialSortOrder(),
    currentPage : 1
};

export default produce((draft, action) => {
    switch (action.type) {
        case GET_SCENARIOS_REQUEST:
        case GET_SCENARIO_REQUEST:
            if (draft.list.length) {
                draft.isUpdating = true;
            } else {
                draft.isFetching = true;
            }
            break;

        case GET_SCENARIOS_SUCCESS:
            draft.list = action.payload.scenarios;
            draft.isFetching = false;
            draft.isUpdating = false;
            break;

        case GET_SCENARIO_SUCCESS: {
            const { scenario } = action.payload;
            const index = draft.list.findIndex(item => item.id === scenario.id);

            if (index >= 0) {
                draft.list[index] = scenario;
            } else {
                draft.list.push(scenario);
            }

            draft.isFetching = false;
            draft.isUpdating = false;
            break;
        }
        case GET_SCENARIOS_FAILURE:
        case GET_SCENARIO_FAILURE:
            draft.isFetching = false;
            draft.isUpdating = false;
            break;

        case SET_SCENARIOS_SEARCH_QUERY:
            draft.searchQuery = action.payload.searchQuery;
            break;

        case SET_SCENARIOS_SORT_ORDER:
            draft.sortOrder = action.payload.sortOrder;
            break;

        case SET_SCENARIOS_CURRENT_PAGE:
            draft.currentPage = action.payload.currentPage;
            break;

        default:
            break;
    }
}, initialState);
