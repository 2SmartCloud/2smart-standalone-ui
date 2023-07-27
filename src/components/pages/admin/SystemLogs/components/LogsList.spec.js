import React from 'react';
import { shallow } from 'enzyme';
import ProcessingIndicator from '../../../../base/ProcessingIndicator';
import LogsList from './LogsList';
import LogsListRow from './LogsListRow';

describe('LogsList component', () => {
    let wrapper;
    let instance;

    beforeEach(() => {
        const mockProps = getMockProps();

        wrapper = shallow(<LogsList {...mockProps}  />);
        instance = wrapper.instance();
    });

    it('should be created', () => {
        expect(instance).toBeDefined();
    });

    it('should render loader', () => {
        wrapper.setProps({ isLoading: true });

        const loader = wrapper.find(ProcessingIndicator);

        expect(loader).toHaveLength(1);
    });

    it('should render no results message', () => {
        wrapper.setProps({ list: [] });

        const message = wrapper.find('.noLogsMessage');

        expect(message).toHaveLength(1);
    });

    it('should render list', () => {
        wrapper.setProps({
            list: [
                { id: '1' },
                { id: '2' },
                { id: '3' }
            ]
        });

        const list = wrapper.find(LogsListRow);

        expect(list).toHaveLength(3);
    });

    it('handleChangeOrder() should call onChangeOrder prop', () => {
        instance.handleChangeOrder();

        expect(instance.props.onChangeOrder).toHaveBeenCalledWith('asc');
    });

    it('handleLoadMore() should call onLoadMore prop', () => {
        instance.handleLoadMore();

        expect(instance.props.onLoadMore).toHaveBeenCalled();
    });

    it('scrollToTop should call scrollTo method on wrapper', () => {
        instance.wrapper = {
            scrollTo : jest.fn()
        };

        instance.scrollToTop();

        expect(instance.wrapper.scrollTo).toHaveBeenCalledWith(0, 0);
    });

    function getMockProps() {
        return {
            list          : [],
            sortOrder     : 'desc',
            onChangeOrder : jest.fn(),
            onLoadMore    : jest.fn()
        };
    }
});
