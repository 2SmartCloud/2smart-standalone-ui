import api                      from '../apiSingleton';
import { mapBackupTO }          from '../utils/mapper/backups';
import { sortBackups } from '../utils/sort';
import meta                     from '../components/base/toast/meta';
import {
    callToastNotification,
    callValErrNotification
}                               from './interface';

export const GET_BACKUP_LIST_REQUEST = 'GET_BACKUP_LIST_REQUEST';
export const GET_BACKUP_LIST_SUCCESS = 'GET_BACKUP_LIST_SUCCESS';
export const GET_BACKUP_LIST_FAILURE = 'GET_BACKUP_LIST_FAILURE';

export const RESTORE_BACKUP_REQUEST  = 'RESTORE_BACKUP_REQUEST';
export const RESTORE_BACKUP_SUCCESS  = 'RESTORE_BACKUP_SUCCESS';
export const RESTORE_BACKUP_FAILURE  = 'RESTORE_BACKUP_FAILURE';

export const START_BACKUP_CREATE = 'START_BACKUP_CREATE';
export const STOP_BACKUP_CREATE  = 'STOP_BACKUP_CREATE';

export const TOGGLE_BACKUP_RESTORE = 'TOGGLE_BACKUP_RESTORE';

export const CREATE_BACKUP_NAME_FAILURE = 'CREATE_BACKUP_NAME_FAILURE';
export const CREATE_BACKUP_FAILURE = 'CREATE_BACKUP_FAILURE';


const ERROR_CODE_MAP = {
    RESTORE_ERROR           : 'Some error occurred during restore process',
    NOT_FOUND               : 'Data to restore not found',
    OVER_MEMORY_LIMIT_ERROR : 'Memory limit allocated for backups has been reached'
};

export function getBackupList() {
    return async dispatch => {
        dispatch({ type: GET_BACKUP_LIST_REQUEST });

        try {
            const backupListTO = await api.backupService.list();
            const backupList = backupListTO.map(mapBackupTO);
            const sortedList = sortBackups(backupList);

            dispatch({ type: GET_BACKUP_LIST_SUCCESS, payload: { list: sortedList } });
        } catch {
            dispatch({ type: GET_BACKUP_LIST_FAILURE });
        }
    };
}

export function restoreBackup(name) {
    return async dispatch => {
        dispatch({ type: RESTORE_BACKUP_REQUEST, payload: { name } });
        dispatch({ type: TOGGLE_BACKUP_RESTORE, payload: true });

        try {
            await api.backupService.restore({ backupName: name });

            dispatch({ type: RESTORE_BACKUP_SUCCESS });
            dispatch(callToastNotification({
                meta    : meta.BACKUP_RESTORE_SUCCESS,
                title   : 'Backup restored',
                message : `Data from ${name} has been restored successfully`
            }));
            dispatch(getBackupList());
        } catch (err) {
            dispatch({ type: RESTORE_BACKUP_FAILURE });
            dispatch(callValErrNotification({
                meta    : meta.BACKUP_RESTORE_ERROR,
                title   : 'Backup restore error',
                message : ERROR_CODE_MAP[err.code] || err.message
            }));

            if (err.code === 'RESTORE_ERROR') {
                dispatch({ type: TOGGLE_BACKUP_RESTORE, payload: false });
            } else {
                setTimeout(() => {
                    window.location.reload();
                }, 3 * 60 * 1000);
            }
        }
    };
}

export function createBackup(name) {
    return async dispatch => {
        try {
            dispatch({ type: START_BACKUP_CREATE });

            await api.backupService.create({ backupBaseName: name });
            dispatch(getBackupList());
            dispatch(callToastNotification({
                meta    : meta.BACKUP_CREATE_SUCCESS,
                title   : 'Backup created',
                message : 'All data has been backuped successfully'
            }));
        } catch (err) {
            switch (err.code) {
                case 'FORMAT_ERROR':
                    throw err;
                case 'OVER_MEMORY_LIMIT_ERROR':
                    dispatch(callValErrNotification({
                        meta    : meta.BACKUP_CREATE_ERROR,
                        title   : 'Backup create error',
                        message : ERROR_CODE_MAP[err.code] || err.message
                    }));
                    break;
                case 'CREATE_ERROR':
                    dispatch(callValErrNotification({
                        meta    : meta.BACKUP_CREATE_ERROR,
                        title   : 'Something went wrong',
                        message : 'Something went wrong. Please try again later'
                    }));
                    break;
                default:
                    break;
            }
        } finally {
            dispatch({ type: STOP_BACKUP_CREATE });
        }
    };
}
