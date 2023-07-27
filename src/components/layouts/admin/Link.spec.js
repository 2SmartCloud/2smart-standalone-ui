import React from 'react';
import { shallow } from 'enzyme';
import { Router } from 'react-router';
import history from '../../../history';
import Link from './Link';
import SidebarListItem from '../../base/sidebar/list/Item';

jest.mock('../../../history');

describe('Link component', () => {
    let wrapper;
    let instance;

    beforeEach(() => {
        const mockProps = getMockProps();

        wrapper = shallow(<Router history={history}><Link {...mockProps} /></Router>).dive().dive().dive().dive();
        instance = wrapper.instance();
    });

    it('should be created', () => {
        expect(instance).toBeTruthy();
    });

    it('isActive() should return true if path matches', () => {
        wrapper.setProps({ currentPathname: '/test/path/2' });
        expect(instance.isActive()).toBeTruthy();
    });

    it('isActive() should return false if path does not match', () => {
        wrapper.setProps({ currentPathname: '/test/path2' });

        expect(instance.isActive()).toBeFalsy();
    });

    it('isActive() special case for scenarios', () => {
        wrapper.setProps({ path: '/scenario/2', currentPathname: '/scenarios' });
        expect(instance.isActive()).toBeTruthy();

        wrapper.setProps({ path: '/scenario/2', currentPathname: '/scenario' });
        expect(instance.isActive()).toBeTruthy();

        wrapper.setProps({ path: '/scenario/2', currentPathname: '/scenario/1' });
        expect(instance.isActive()).toBeTruthy();

        wrapper.setProps({ path: '/scenarios', currentPathname: '/scenario/1' });
        expect(instance.isActive()).toBeTruthy();

        wrapper.setProps({ path: '/scenarios', currentPathname: '/scenario' });
        expect(instance.isActive()).toBeTruthy();
    });

    it('isActive() special case for services', () => {
        wrapper.setProps({ path: '/service/2', currentPathname: '/services' });
        expect(instance.isActive()).toBeTruthy();

        wrapper.setProps({ path: '/service/2', currentPathname: '/service' });
        expect(instance.isActive()).toBeTruthy();

        wrapper.setProps({ path: '/service/2', currentPathname: '/service/1' });
        expect(instance.isActive()).toBeTruthy();

        wrapper.setProps({ path: '/services', currentPathname: '/service/1' });
        expect(instance.isActive()).toBeTruthy();

        wrapper.setProps({ path: '/services', currentPathname: '/service' });
        expect(instance.isActive()).toBeTruthy();
    });

    it('should call onClick callback and push to history on click', () => {
        const button = wrapper.find(SidebarListItem);

        button.simulate('click');

        expect(instance.props.onClick).toHaveBeenCalled();
        expect(history.push).toHaveBeenCalledWith('/test/path/2');
    });

    function getMockProps() {
        return {
            title           : 'Test Path',
            path            : '/test/path/2',
            currentPathname : '/test/path',
            onClick         : jest.fn()
        };
    }
});
