import React from 'react';
import { shallow } from 'enzyme';
import getMockStore from '../../../__mocks__/storeMock';
import Layout from './Layout';

window.loadingSpinner = {
    stop : jest.fn()
};

describe('Layout admin component', () => {
    let wrapper;
    let instance;

    beforeEach(() => {
        const mockStore = getMockStore(getMockAppState);
        const mockProps = getMockProps();
        const mockBoundActions = getMockBoundActions();

        wrapper = shallow(<Layout {...mockProps} store={mockStore} />).dive().dive();
        wrapper.setProps(mockBoundActions);

        instance = wrapper.instance();
    });

    it('should be created', () => {
        expect(instance).toBeDefined();
    });

    it('should call intervalCheckSession on mount', () => {
        instance.componentDidMount();

        expect(instance.props.intervalCheckSession).toHaveBeenCalled();
    });


    it('fetchData() should call subscribeWithIntervalAndGetMarketServices and fetch data', async () => {
        await instance.fetchData();

        expect(instance.props.subscribeWithIntervalAndGetMarketServices).toHaveBeenCalled();
        expect(instance.props.getBridgeEntities).toHaveBeenCalled();
    });

    function getMockProps() {
        return {
            children : (<div>test</div>),
            location : { pathname: 'foo/bar' },
            route    : 'foo/bar'
        };
    }

    function getMockAppState() {
        return {
            session : {
                isUserAuthorized : true
            },
            applicationInterface : {
                isAdminSideBarOpen : true
            }
        };
    }

    function getMockBoundActions() {
        return {
            intervalCheckSession                     : jest.fn(),
            subscribeWithIntervalAndGetMarketServices: jest.fn(),
            unsubscribeFromMarketServices            : jest.fn(),
            getBridgeEntities                        : jest.fn(),
            getMarketServices                        : jest.fn()

        };
    }
});
