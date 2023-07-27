import produce from 'immer';
import {
    GET_SCENARIO_TEMPLATES_REQUEST,
    GET_SCENARIO_TEMPLATES_SUCCESS,
    GET_SCENARIO_TEMPLATES_FAILURE
} from '../../actions/scenarioTemplates/';

const INITIAL_STATE = {
    list       : [],
    isFetching : true,
    isUpdating : false
};

export default produce((draft, action) => {
    switch (action.type) {
        case GET_SCENARIO_TEMPLATES_REQUEST:
            if (draft.list.length) {
                draft.isUpdating  = true;
            } else {
                draft.isFetching = true;
            }
            break;

        case GET_SCENARIO_TEMPLATES_SUCCESS:
            draft.list = action.payload.scenarioTemplates;
            draft.isFetching = false;
            draft.isUpdating = false;
            break;

        case GET_SCENARIO_TEMPLATES_FAILURE:
            draft.isFetching = false;
            draft.isUpdating = false;
            break;

        default:
            break;
    }
}, INITIAL_STATE);
