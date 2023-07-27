import * as actions from '../actions/interface';
import reducer from './interface';

import * as localStorage from '../utils/localStorage';
import { DEVICES_SORT_ORDER } from '../assets/constants/localStorage';

jest.mock('../utils/localStorage', () => ({
    getData : jest.fn().mockImplementation(() => undefined)
}));

describe('interface reducer', () => {
    let initialState;

    beforeEach(() => {
        initialState = {
            activeToasts : [],
            openedPopups : [  ],
            popupClasses : {},
            popupParams  : {
                propertyId   : null,
                nodeId       : null,
                deviceId     : null,
                propertyType : '',
                hardwareType : ''
            },
            lastToastMeta : '',
            modal         : {
                isOpen : false
            },
            pinForm : {
                isOpen : false,
                props  : {}
            },
            deleteModal : {
                isOpen : false
            },
            isGroupsVisible : typeof isGroupsVisible === 'boolean'  // should be true as default if user do not set this var
                ? isGroupsVisible
                : true,
            isAdminSideBarOpen : true,
            isGroupsVisible  : true,
            devicesSortOrder : 'ASC'
        };
    });

    it('should return initial state', () => {
        const result = reducer(undefined, {});

        expect(result).toEqual(initialState);
    });

    it('TOGGLE_ADMIN_SIDEBAR', () => {
        const action = { 
            type: actions.TOGGLE_ADMIN_SIDEBAR,
           
        };
        const result = reducer(initialState, action);

        expect(result.isAdminSideBarOpen).toBeFalsy();
    });

    it('should get device order from localStorage', () => {
        reducer(undefined, {});

        expect(localStorage.getData).toHaveBeenCalledWith(DEVICES_SORT_ORDER);
    });

    it('SET_DEVICES_ORDER', () => {
        const action = { type: actions.SET_DEVICES_ORDER, payload: { order: 'DESC' } };
        const result = reducer(initialState, action);

        expect(result.devicesSortOrder).toEqual('DESC');
    });
});
