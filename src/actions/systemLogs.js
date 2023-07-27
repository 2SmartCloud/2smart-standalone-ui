import { debounce }                 from 'throttle-debounce';
import {
    mapSystemLogsQuery,
    mapSystemLogTOToSystemLog
}                                   from '../utils/mapper/logs';
import api                          from '../apiSingleton';

export const DEFAULT_LOGS_LIMIT = 50;

export const GET_SYSTEM_LOGS_REQUEST      = 'GET_SYSTEM_LOGS_REQUEST';
export const GET_SYSTEM_LOGS_SUCCESS      = 'GET_SYSTEM_LOGS_SUCCESS';
export const GET_SYSTEM_LOGS_FAILURE      = 'GET_SYSTEM_LOGS_FAILURE';
export const SET_SYSTEM_LOGS_SEARCH_QUERY = 'SET_SYSTEM_LOGS_SEARCH_QUERY';
export const SET_SYSTEM_LOGS_SORT_ORDER   = 'SET_SYSTEM_LOGS_SORT_ORDER';
export const SET_SYSTEM_LOGS_LEVEL        = 'SET_SYSTEM_LOGS_LEVEL';
export const SET_SYSTEM_LOGS_LIMIT        = 'SET_SYSTEM_LOGS_LIMIT';

export function getSystemLogs() {
    return async (dispatch, getState) => {
        dispatch({ type: GET_SYSTEM_LOGS_REQUEST });

        const params = mapSystemLogsQuery(getState().systemLogs);

        try {
            const { list: systemLogsTO, total } = await api.systemLogs.list(params);

            const systemLogs = systemLogsTO.map(mapSystemLogTOToSystemLog);

            dispatch({ type: GET_SYSTEM_LOGS_SUCCESS, payload: { list: systemLogs, total } });
        } catch {
            dispatch({ type: GET_SYSTEM_LOGS_FAILURE });
        }
    };
}

export function getMoreLogs() {
    return (dispatch, getState) => {
        const currentLimit = getState().systemLogs.limit;

        dispatch(setLogsLimit(currentLimit + DEFAULT_LOGS_LIMIT));

        // debouncedFetchSystemLogs(dispatch);
        dispatch(getSystemLogs());
    };
}

export function setLogsSearchQuery(searchQuery) {
    return dispatch => {
        dispatch({
            type    : SET_SYSTEM_LOGS_SEARCH_QUERY,
            payload : { searchQuery }
        });
        dispatch(resetLogsLimit());

        debouncedFetchSystemLogs(dispatch);
    };
}

export function setLogsSortOrder(sortOrder) {
    return dispatch => {
        dispatch({
            type    : SET_SYSTEM_LOGS_SORT_ORDER,
            payload : { sortOrder }
        });
        dispatch(resetLogsLimit());

        debouncedFetchSystemLogs(dispatch);
    };
}

export function setLogsLevel(logLevel) {
    return dispatch => {
        dispatch({
            type    : SET_SYSTEM_LOGS_LEVEL,
            payload : { logLevel }
        });
        dispatch(resetLogsLimit());

        debouncedFetchSystemLogs(dispatch);
    };
}

export function setLogsLimit(limit) {
    return {
        type    : SET_SYSTEM_LOGS_LIMIT,
        payload : { limit }
    };
}

export function resetLogsLimit() {
    return setLogsLimit(DEFAULT_LOGS_LIMIT);
}

const debouncedFetchSystemLogs = debounce(250, dispatch => dispatch(getSystemLogs()));
