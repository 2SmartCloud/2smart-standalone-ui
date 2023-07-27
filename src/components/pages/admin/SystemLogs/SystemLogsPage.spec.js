import React from 'react';
import { shallow } from 'enzyme';
import SystemLogsPage from './SystemLogsPage';
import LoadingNotification from '../../../base/LoadingNotification';
import NothingToShowNotification from '../../../base/nothingToShowNotification/Base';
import LogsList from './components/LogsList';

describe('SystemLogsPage component', () => {
    let wrapper;
    let instance;

    beforeEach(() => {
        const mockProps = getMockProps();

        wrapper = shallow(<SystemLogsPage {...mockProps} />);
        instance = wrapper.instance();
    });

    it('should be created', () => {
        expect(instance).toBeDefined();
    });

    it('should render loader', () => {
        wrapper.setProps({
            systemLogs : {
                ...instance.props.systemLogs,
                initFetched : false,
                isFetching  : true
            }
        });

        const loader = wrapper.find(LoadingNotification);

        expect(loader).toHaveLength(1);
    });

    it('should render nothing to show notification', () => {
        wrapper.setProps({
            systemLogs : {
                ...instance.props.systemLogs,
                initFetched : true,
                hasEntries  : false
            }
        });

        const notification = wrapper.find(NothingToShowNotification);

        expect(notification).toHaveLength(1);
    });

    it('should render logs list component', () => {
        wrapper.setProps({
            systemLogs : {
                ...instance.props.systemLogs,
                initFetched : true,
                hasEntries  : true
            }
        });

        const list = wrapper.find(LogsList);

        expect(list).toHaveLength(1);
    });

    it('should fetch logs on mount', () => {
        spyOn(instance, 'handleFetchLogs').and.stub();

        instance.componentDidMount();

        expect(instance.handleFetchLogs).toHaveBeenCalled();
    });

    it('should reset limit on unmount', () => {
        instance.componentWillUnmount();

        expect(instance.props.resetLogsLimit).toHaveBeenCalled();
    });

    it('handleFetchLogs() should call getSystemLogs prop', () => {
        instance.handleFetchLogs();

        expect(instance.props.getSystemLogs).toHaveBeenCalled();
    });

    it('handleChangeSearchQuery() should call setLogsSearchQuery prop and scroll', () => {
        spyOn(instance, 'scrollListToTop');

        instance.handleChangeSearchQuery('test');

        expect(instance.props.setLogsSearchQuery).toHaveBeenCalledWith('test');
        expect(instance.scrollListToTop).toHaveBeenCalled();
    });

    it('handleChangeLogLevel() should call setLogsLevel prop and scroll', () => {
        spyOn(instance, 'scrollListToTop');

        instance.handleChangeLogLevel('info');

        expect(instance.props.setLogsLevel).toHaveBeenCalledWith('info');
        expect(instance.scrollListToTop).toHaveBeenCalled();
    });

    it('handleChangeOrder() should call setLogsSortOrder prop and scroll', () => {
        spyOn(instance, 'scrollListToTop');

        instance.handleChangeOrder('asc');

        expect(instance.props.setLogsSortOrder).toHaveBeenCalledWith('asc');
        expect(instance.scrollListToTop).toHaveBeenCalled();
    });

    it('scrollListToTop() should call list scrollToTop method', () => {
        const spy = jest.fn();

        instance.list = {
            scrollToTop : spy
        };

        jest.useFakeTimers();

        instance.scrollListToTop();

        jest.runAllTimers();

        expect(spy).toHaveBeenCalled();
    });

    function getMockProps() {
        return {
            location   : {},
            systemLogs : {
                list        : [],
                total       : 0,
                initFetched : false,
                hasEntries  : false,
                isFetching  : false,
                searchQuery : '',
                sortOrder   : 'desc',
                logLevel    : undefined,
                limit       : 20
            },
            getSystemLogs      : jest.fn(),
            getMoreLogs        : jest.fn(),
            setLogsSearchQuery : jest.fn(),
            setLogsSortOrder   : jest.fn(),
            setLogsLevel       : jest.fn(),
            resetLogsLimit     : jest.fn()
        };
    }
});
