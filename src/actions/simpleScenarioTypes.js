import { mapScenarioTypeTOToScenarioType } from '../utils/mapper/service';
import api from '../apiSingleton';

export const GET_SIMPLE_SCENARIO_TYPES_REQUEST = 'GET_SIMPLE_SCENARIO_TYPES_REQUEST';
export const GET_SIMPLE_SCENARIO_TYPES_SUCCESS = 'GET_SIMPLE_SCENARIO_TYPES_SUCCESS';
export const GET_SIMPLE_SCENARIO_TYPES_FAILURE = 'GET_SIMPLE_SCENARIO_TYPES_FAILURE';

export function getSimpleScenarioTypes() {
    return async dispatch => {
        dispatch({ type: GET_SIMPLE_SCENARIO_TYPES_REQUEST });

        try {
            const scenarioTypesTO = await api.simpleScenarioTypes.list();
            const scenarioTypes = scenarioTypesTO.map(mapScenarioTypeTOToScenarioType);

            dispatch({ type: GET_SIMPLE_SCENARIO_TYPES_SUCCESS, payload: { scenarioTypes } });
        } catch {
            dispatch({ type: GET_SIMPLE_SCENARIO_TYPES_FAILURE });
        }
    };
}
