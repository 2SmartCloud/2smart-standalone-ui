import React from 'react';
import { shallow } from 'enzyme';
import LogsListRow from './LogsListRow';

describe('LogsListRow component', () => {
    let wrapper;
    let instance;

    beforeEach(() => {
        const mockProps = getMockProps();

        wrapper = shallow(<LogsListRow {...mockProps}  />);
        instance = wrapper.instance();
    });

    it('should be created', () => {
        expect(instance).toBeDefined();
    });

    it('handleRowClick() should change expanded state', () => {
        instance.handleRowClick();
        expect(instance.state.expanded).toBeTruthy();

        instance.handleRowClick();
        expect(instance.state.expanded).toBeFalsy();
    });

    it('should render collapsible row', () => {
        wrapper.setState({ expanded: true });

        const collapsible = wrapper.find('.collapsible');

        expect(collapsible).toHaveLength(1);
        expect(collapsible.text()).toBe('error message');
    });

    function getMockProps() {
        return {
            item : {
                container : 'container-1',
                message   : 'error message',
                time      : '2019-10-10 12:00',
                level     : 'error'
            }
        };
    }
});
