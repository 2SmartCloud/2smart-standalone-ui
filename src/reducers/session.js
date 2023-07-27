import produce from 'immer';
import {
    UPDATE_SESSION_SUCCESS,
    UPDATE_SESSION_FAILURE
} from '../actions/session';

const initialState = {
    isUserAuthorized : null
};

export default produce((draft, action) => {
    switch (action.type) {
        case UPDATE_SESSION_SUCCESS: {
            draft.isUserAuthorized = true;
            break;
        }
        case UPDATE_SESSION_FAILURE: {
            draft.isUserAuthorized = false;
            break;
        }
        default:
            break;
    }
}, initialState);
