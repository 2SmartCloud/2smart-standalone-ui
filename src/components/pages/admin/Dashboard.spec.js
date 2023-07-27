import React                  from 'react';
import { shallow }            from 'enzyme';
import getMockStore           from '../../../__mocks__/storeMock';
import { getData }            from '../../../utils/localStorage';
import { DEVICES_SORT_ORDER } from '../../../assets/constants/localStorage';
import Dashboard              from './Dashboard';

jest.mock('../../../utils/localStorage');

describe('Dashboard component', () => {
    let wrapper;
    let instance;

    beforeEach(() => {
        const mockStore = getMockStore(getMockAppState);
        const mockBoundActions = getMockBoundActions();

        wrapper = shallow(<Dashboard store={mockStore} />).dive().dive();
        wrapper.setProps(mockBoundActions);

        instance = wrapper.instance();
    });

    it('should be created', () => {
        expect(instance).toBeTruthy();
    });

    it('handleChangeSortOrder()', () => {
        instance.handleChangeSortOrder('ASC');

        expect(instance.props.setDevicesOrder).toHaveBeenCalledWith('ASC');
    });

    function getMockAppState() {
        return {
            homie: {
                devices    : [],
                isFetching : false
            },
            aliases:{
                list:[]
            },
            applicationInterface: {
                devicesSortOrder: 'ASC'
            }
        };
    }

    function getMockBoundActions() {
        return {
            getDevices      : jest.fn(),
            checkSession    : jest.fn(),
            setDevicesOrder : jest.fn()
        };
    }
});
