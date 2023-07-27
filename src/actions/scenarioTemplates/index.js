import { mapScenarioTemplate } from '../../utils/mapper/scenarioTemplates';
import api from '../../apiSingleton';

export const GET_SCENARIO_TEMPLATES_REQUEST = 'GET_SCENARIO_TEMPLATES_REQUEST';
export const GET_SCENARIO_TEMPLATES_SUCCESS = 'GET_SCENARIO_TEMPLATES_SUCCESS';
export const GET_SCENARIO_TEMPLATES_FAILURE = 'GET_SCENARIO_TEMPLATES_FAILURE';


export function getScenarioTemplates() {
    return async dispatch => {
        dispatch({ type: GET_SCENARIO_TEMPLATES_REQUEST });

        try {
            const scenarioTemplates = await api.scenarioTemplates.list();
            const scenarioTemplatesMapped = scenarioTemplates.map(mapScenarioTemplate);

            dispatch({ type: GET_SCENARIO_TEMPLATES_SUCCESS, payload: { scenarioTemplates: scenarioTemplatesMapped } });
        } catch {
            dispatch({ type: GET_SCENARIO_TEMPLATES_FAILURE });
        }
    };
}
