import api                        from '../apiSingleton';
import history                    from '../history.js';
import { NOT_FOUND }              from '../assets/constants/routes';
import { getExtensionTitle }      from '../utils/mapper/extensions';
import { callValErrNotification } from './interface';

export const GET_SCENARIOS_REQUEST = 'GET_SCENARIOS_REQUEST';
export const GET_SCENARIOS_SUCCESS = 'GET_SCENARIOS_SUCCESS';
export const GET_SCENARIOS_FAILURE = 'GET_SCENARIOS_FAILURE';

export const GET_SCENARIO_REQUEST = 'GET_SCENARIO_REQUEST';
export const GET_SCENARIO_SUCCESS = 'GET_SCENARIO_SUCCESS';
export const GET_SCENARIO_FAILURE = 'GET_SCENARIO_FAILURE';

export const SET_SCENARIOS_SEARCH_QUERY = 'SET_SCENARIOS_SEARCH_QUERY';
export const SET_SCENARIOS_SORT_ORDER = 'SET_SCENARIOS_SORT_ORDER';
export const SET_SCENARIOS_CURRENT_PAGE = 'SET_SCENARIOS_CURRENT_PAGE';


export function getScenarios() {
    return async dispatch => {
        dispatch({ type: GET_SCENARIOS_REQUEST });

        try {
            const scenarios = await api.scenarios.list();

            dispatch({
                type    : GET_SCENARIOS_SUCCESS,
                payload : { scenarios }
            });
        } catch (err) {
            dispatch({ type: GET_SCENARIOS_FAILURE });
        }
    };
}

export function getScenario(id) {
    return async () => {
        return api.scenarios.show(id);
    };
}

export function getScenarioUniqueName(mode, type) {
    return async () => api.scenarios.getUniqueName({ mode, type });
}

export function createScenario(payload) {
    return async dispatch => {
        try {
            await api.scenarios.create(payload);

            dispatch(getScenarios());
        } catch (err) {
            throw err;
        }
    };
}

export function updateScenario(id, payload, type = undefined) {
    return async dispatch => {
        try {
            await api.scenarios.update(id, payload);

            dispatch(getScenarios());
        } catch (err) {
            if (err.code === 'NOT_FOUND') {
                history.push(NOT_FOUND);
            } else if (err.code === 'EXTENSION_NOT_FOUND') {
                dispatch(callExtensionNotExistNotification({ type, id }));
            }

            throw err;
        }
    };
}

export function callExtensionNotExistNotification({ type, id }) {
    return dispatch => {
        const entityType = getExtensionTitle(type) || '';

        dispatch(callValErrNotification({
            meta    : `${entityType} ${id}`,
            title   : 'Error',
            message : `Extension ${entityType} is not installed.`
        }
        ));
    };
}

export function deleteScenario(id) {
    return async dispatch => {
        try {
            await api.scenarios.delete(id);

            dispatch(getScenarios());
        } catch (err) {
            throw err;
        }
    };
}

export function setScenariosSearchQuery(value) {
    return {
        type    : SET_SCENARIOS_SEARCH_QUERY,
        payload : { searchQuery: value }
    };
}

export function setScenariosSortOrder(value) {
    return {
        type    : SET_SCENARIOS_SORT_ORDER,
        payload : { sortOrder: value }
    };
}

export function setScenariosCurrentPage(value) {
    return {
        type    : SET_SCENARIOS_CURRENT_PAGE,
        payload : { currentPage: value }
    };
}
