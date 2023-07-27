import produce from 'immer';
import {
    CHECK_SYSTEM_UPDATES_REQUEST,
    CHECK_SYSTEM_UPDATES_SUCCESS,
    CHECK_SYSTEM_UPDATES_ERROR,
    RUN_ACTION_START,
    RUN_ACTION_END,
    UPDATE_SYSTEM_UPDATES

} from '../actions/systemUpdates';

const INITIAL_STATE = {
    status          : null,
    lastUpdate      : null,
    availableUpdate : null,
    runningActions  : [],
    isLoading       : true
};

export default produce((draft, action) => {
    const { type, payload = {} } = action;

    switch (type) {
        case CHECK_SYSTEM_UPDATES_REQUEST:
            draft.isLoading = true;
            break;
        case CHECK_SYSTEM_UPDATES_SUCCESS:
            return {
                ...draft,
                ...payload.systemUpdates,
                isLoading : false
            };
        case UPDATE_SYSTEM_UPDATES:
            return {
                ...draft,
                ...payload.updated
            };
        case CHECK_SYSTEM_UPDATES_ERROR:
            draft.isLoading = false;
            break;
        case RUN_ACTION_START:
            draft.runningActions = [ ...draft.runningActions, payload.actionType ];
            break;
        case RUN_ACTION_END:
            draft.runningActions = draft.runningActions.filter(actionType => actionType !== payload.actionType);
            break;
        default:
            break;
    }
}, INITIAL_STATE);
