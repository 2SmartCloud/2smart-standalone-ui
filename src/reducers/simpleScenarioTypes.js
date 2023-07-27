import produce from 'immer';
import {
    GET_SIMPLE_SCENARIO_TYPES_REQUEST,
    GET_SIMPLE_SCENARIO_TYPES_SUCCESS,
    GET_SIMPLE_SCENARIO_TYPES_FAILURE
} from '../actions/simpleScenarioTypes';

const INITIAL_STATE = {
    list       : [],
    isFetching : true,
    isUpdating : false
};

export default produce((draft, action) => {
    switch (action.type) {
        case GET_SIMPLE_SCENARIO_TYPES_REQUEST:
            if (draft.list.length) {
                draft.isUpdating  = true;
            } else {
                draft.isFetching = true;
            }
            break;

        case GET_SIMPLE_SCENARIO_TYPES_SUCCESS:
            draft.list = action.payload.scenarioTypes;
            draft.isFetching = false;
            draft.isUpdating = false;
            break;

        case GET_SIMPLE_SCENARIO_TYPES_FAILURE:
            draft.isFetching = false;
            draft.isUpdating = false;
            break;

        default:
            break;
    }
}, INITIAL_STATE);
