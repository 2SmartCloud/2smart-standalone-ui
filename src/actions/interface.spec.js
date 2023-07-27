import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import * as localStorage from '../utils/localStorage';
import { DEVICES_SORT_ORDER, SHOW_NODES_AND_DEVICES_GROUPS } from '../assets/constants/localStorage';
import * as actions from './interface';

jest.mock('../utils/localStorage');

const mockStore = configureMockStore([ thunk ]);

describe('interface actions', () => {
    let store;

    beforeEach(() => {
        store = mockStore({});
    });

    it('setGroupsVisibility(true) should set isGroupsVisible intro true', () => {
        const expectedActions = [
            { type: actions.SET_GROUPS_VISIBILITY, payload: { isGroupsVisible: true } }
        ];

        store.dispatch(actions.setGroupsVisibility(true));

        expect(store.getActions()).toEqual(expectedActions);
        expect(localStorage.saveData).toHaveBeenCalledWith(SHOW_NODES_AND_DEVICES_GROUPS, true);
    });

    it('setGroupsVisibility(false) should set isGroupsVisible intro false', () => {
        const expectedActions = [
            { type: actions.SET_GROUPS_VISIBILITY, payload: { isGroupsVisible: false } }
        ];

        store.dispatch(actions.setGroupsVisibility(false));

        expect(store.getActions()).toEqual(expectedActions);
        expect(localStorage.saveData).toHaveBeenCalledWith(SHOW_NODES_AND_DEVICES_GROUPS, false);
    });

    it('setDevicesOrder()', () => {
        const order = 'ASC';
        const expected = [
            { type: actions.SET_DEVICES_ORDER, payload: { order } }
        ];

        store.dispatch(actions.setDevicesOrder(order));

        expect(store.getActions()).toEqual(expected);
        expect(localStorage.saveData).toHaveBeenCalledWith(DEVICES_SORT_ORDER, order);
    });
});
