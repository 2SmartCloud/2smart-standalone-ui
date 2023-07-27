import React from 'react';
import { shallow } from 'enzyme';
import LogsHeader from './LogsHeader';

describe('LogsHeader component', () => {
    let wrapper;
    let instance;

    beforeEach(() => {
        const mockProps = getMockProps();

        wrapper = shallow(<LogsHeader {...mockProps}  />);
        instance = wrapper.instance();
    });

    it('should be created', () => {
        expect(instance).toBeDefined();
    });

    it('handleChangeSearch() should call onChangeSearchQuery prop', () => {
        instance.handleChangeSearch('query');

        expect(instance.props.onChangeSearchQuery).toHaveBeenCalledWith('query');
    });

    it('handleRefreshClick should call onRefresh prop', () => {
        instance.handleRefreshClick();

        expect(instance.props.onRefresh).toHaveBeenCalled();
    });

    function getMockProps() {
        return {
            onChangeSearchQuery : jest.fn(),
            onChangeLogLevel    : jest.fn(),
            onRefresh           : jest.fn()
        };
    }
});

