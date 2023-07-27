/* eslint-disable default-case */

import produce from 'immer';
import {
    GET_BACKUP_LIST_REQUEST,
    GET_BACKUP_LIST_SUCCESS,
    GET_BACKUP_LIST_FAILURE,
    RESTORE_BACKUP_REQUEST,
    RESTORE_BACKUP_SUCCESS,
    RESTORE_BACKUP_FAILURE,
    START_BACKUP_CREATE,
    STOP_BACKUP_CREATE,
    TOGGLE_BACKUP_RESTORE
} from '../actions/backup';

const INITIAL_STATE = {
    list        : [],
    isFetching  : true,
    isUpdating  : false,
    isCreating  : false,
    isRestoring : false,
    restoring   : undefined,
    isRestored  : false
};

export default produce((draft, { type, payload }) => {
    switch (type) {
        case GET_BACKUP_LIST_REQUEST:
            if (draft.list.length) {
                draft.isUpdating = true;
            } else {
                draft.isFetching = true;
            }
            break;

        case GET_BACKUP_LIST_SUCCESS:
            draft.list = payload.list;
            draft.isFetching = false;
            draft.isUpdating = false;
            break;

        case GET_BACKUP_LIST_FAILURE:
            draft.isFetching = false;
            draft.isUpdating = false;
            break;

        case RESTORE_BACKUP_REQUEST:
            draft.restoring = payload.name;
            draft.isRestored = false;
            break;

        case RESTORE_BACKUP_SUCCESS:
            draft.isRestored = true;
            draft.restoring = undefined;
            break;

        case RESTORE_BACKUP_FAILURE:
            draft.restoring = undefined;
            break;

        case START_BACKUP_CREATE:
            draft.isCreating = true;
            break;
        case STOP_BACKUP_CREATE:
            draft.isCreating = false;
            break;
        case TOGGLE_BACKUP_RESTORE:
            draft.isRestoring = payload;
            break;
    }
}, INITIAL_STATE);
