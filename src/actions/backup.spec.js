import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import api from '../apiSingleton';
import * as actions from './backup';

jest.mock('../apiSingleton');
jest.mock('../utils/mapper/backups', () => ({
    mapBackupTO : jest.fn().mockImplementation(item => item)
}));
jest.mock('./interface', () => ({
    callToastNotification  : jest.fn(() => ({ type: 'STUB_NOTIFICATION' })),
    callValErrNotification : jest.fn(() => ({ type: 'STUB_ERROR_NOTIFICATION' }))
}));

const mockStore = configureMockStore([ thunk ]);

describe('backup actions', () => {
    let store;

    beforeEach(() => {
        store = mockStore({});

        api.backupService.list.mockReset();
        api.backupService.restore.mockReset();
    });

    describe('getBackupList()', () => {
        it('success', async () => {
            const mockBackups = [{ test: 'test' }, { test: 'test2' }];

            api.backupService.list = jest.fn().mockReturnValue(Promise.resolve(mockBackups));

            const expectedActions = [
                { type: actions.GET_BACKUP_LIST_REQUEST },
                { type: actions.GET_BACKUP_LIST_SUCCESS, payload: { list: mockBackups } }
            ];

            await store.dispatch(actions.getBackupList());

            expect(api.backupService.list).toHaveBeenCalled();
            expect(store.getActions()).toEqual(expectedActions);
        });

        it('failed', async () => {
            api.backupService.list = jest.fn().mockReturnValue(Promise.reject());

            const expectedActions = [
                { type: actions.GET_BACKUP_LIST_REQUEST },
                { type: actions.GET_BACKUP_LIST_FAILURE }
            ];

            await store.dispatch(actions.getBackupList());

            expect(store.getActions()).toEqual(expectedActions);
        });
    });

    describe('restoreBackup()', () => {
        it('success', async () => {
            api.backupService.list    = jest.fn().mockReturnValue(Promise.resolve([]));
            api.backupService.restore = jest.fn().mockReturnValue(Promise.resolve());

            const expectedActions = [
                { type: actions.RESTORE_BACKUP_REQUEST, payload: { name: 'test' } },
                { type: actions.TOGGLE_BACKUP_RESTORE, payload: true },
                { type: actions.RESTORE_BACKUP_SUCCESS },
                { type: 'STUB_NOTIFICATION' },
                { type: actions.GET_BACKUP_LIST_REQUEST },
                { type: actions.GET_BACKUP_LIST_SUCCESS, payload: { list: [] } }
            ];

            await store.dispatch(actions.restoreBackup('test'));

            expect(api.backupService.restore).toHaveBeenCalledWith({ backupName: 'test' });
            expect(store.getActions()).toEqual(expectedActions);
        });

        it('failed', async () => {
            api.backupService.restore = jest.fn().mockReturnValue(Promise.reject({ code: 'ERROR' }));

            const expectedActions = [
                { type: actions.RESTORE_BACKUP_REQUEST, payload: { name: 'test' } },
                { type: actions.TOGGLE_BACKUP_RESTORE, payload: true },
                { type: actions.RESTORE_BACKUP_FAILURE },
                { type: 'STUB_ERROR_NOTIFICATION' }
            ];

            await store.dispatch(actions.restoreBackup('test'));

            expect(store.getActions()).toEqual(expectedActions);
        });
    });

    describe('createBackup()', () => {
        it('success', async () => {
            api.backupService.list    = jest.fn().mockReturnValue(Promise.resolve([]));
            api.backupService.create = jest.fn().mockReturnValue(Promise.resolve());

            const expectedActions = [
                { type: actions.START_BACKUP_CREATE },
                { type: actions.GET_BACKUP_LIST_REQUEST },
                { type: 'STUB_NOTIFICATION' },
                { type: actions.STOP_BACKUP_CREATE },
                { type: actions.GET_BACKUP_LIST_SUCCESS, payload: { list: [] }  },

            ];

            await store.dispatch(actions.createBackup('name'));

            expect(api.backupService.create).toHaveBeenCalledWith({ backupBaseName: 'name' });
            expect(store.getActions()).toEqual(expectedActions);
        });

        it('failed', async () => {
            api.backupService.create = jest.fn().mockReturnValue(Promise.reject({ code: 'CREATE_ERROR' }));

            const expectedActions = [
                { type: actions.START_BACKUP_CREATE },
                { type: 'STUB_ERROR_NOTIFICATION' },
                { type: actions.STOP_BACKUP_CREATE }
            ];

            await store.dispatch(actions.createBackup('name'));

            expect(store.getActions()).toEqual(expectedActions);
        });

        it('failed with name format error', async () => {
            api.backupService.create = jest.fn().mockReturnValue(Promise.reject({ code: 'FORMAT_ERROR' }));

            const expectedActions = [
                { type: actions.START_BACKUP_CREATE },
                { type: actions.STOP_BACKUP_CREATE }
            ];

            try {
                await store.dispatch(actions.createBackup('name'));
            } catch (err){
                
            }

            expect(store.getActions()).toEqual(expectedActions);
        });
    });
    
});
