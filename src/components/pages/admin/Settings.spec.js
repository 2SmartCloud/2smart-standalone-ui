import React                  from 'react';
import { shallow }            from 'enzyme';
import SettingsPage           from './Settings'
import history                from '../../../history';
import { NAVIGATION_OPTIONS } from '../../../assets/constants/settings';
import * as ROUTES            from '../../../assets/constants/routes';
import getMockStore           from '../../../__mocks__/storeMock';

jest.mock('../../../actions/user');
jest.mock('../../../history');

describe('SettingsPage component', () => {
    let wrapper;
    let instance;

    beforeEach(() => {
        
        const mockStore = getMockStore(getMockAppState);
        const mockBoundActions = getMockBoundActions();

        wrapper = shallow(<SettingsPage store={mockStore} />).dive().dive();
        wrapper.setProps(mockBoundActions);

        instance = wrapper.instance();
    });

    it('should be created', () => {
        expect(instance).toBeTruthy();
    });

    it('should get data ', () => {
        instance.componentDidMount();

        expect(instance.props.getSettings).toHaveBeenCalled();
        expect(instance.props.getInfo).toHaveBeenCalled();
    });

    it('handleTabChange() should call history.push', () => {
        NAVIGATION_OPTIONS.forEach((o, index) => {
            instance.handleTabChange(index);
            const tabData = NAVIGATION_OPTIONS[index];
    
            expect(history.push).toHaveBeenCalledWith(`${ROUTES.SETTINGS}${tabData.hash}`);
        });
    });

    xit('should render tab by hash on init', () => {
        const mockStore = getMockStore(getMockAppState);
        const mockBoundActions = getMockBoundActions();

        NAVIGATION_OPTIONS.forEach((o, index) => {
            const tabData = NAVIGATION_OPTIONS[index];

            history.push(`${ROUTES.SETTINGS}${tabData.hash}`);

            wrapper = shallow(<SettingsPage store={mockStore} />).dive().dive();
            wrapper.setProps(mockBoundActions);
            instance = wrapper.instance();

            expect(instance.state.activeTab).toBe(index);
        });
    });

    function getMockAppState() {
        return {
            user: {
                    settings : {
                    isFetching : false,
                    isSecureModeEnabled : {
                        isUpdating : false,
                        value      : false
                    },
                    isAutoBlockingEnabled : {
                        isUpdating : false,
                        value      : false
                    },
                    info : {
                        pincode : {
                            isExists   : false,
                            isUpdating : false,
                            error      : {}
                        },
                        username   : '',
                        isFetching : false
                    }
                }
            },
            applicationInterface : {
                modal:{
                    isOpen:false
                }
            }
        };
    }

    function getMockBoundActions() {
        return {
            getSettings:jest.fn(),
            getInfo: jest.fn()
        };
    }
});
