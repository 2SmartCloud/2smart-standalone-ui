import React from 'react';
import { shallow } from 'enzyme';
import LastActivity from './LastActivity';


describe('LastActivity', () => {
    let wrapper;
    let instance;

    beforeEach(() => {
        const mockProps = getMockProps();
        wrapper = shallow(<LastActivity  {...mockProps} />);

        instance = wrapper.instance();
    });

    it('should be created', () => {
        expect(instance).toBeTruthy();
    });

    it('should render label', () => {
        const status = wrapper.find('.LastActivity').text();

        expect(status).toEqual('now');
    });

    it('should render "1 minute ago" label', () => {
        wrapper.setProps({
            lastActivity:Date.now() - 60000
        })
        const status = wrapper.find('.LastActivity').text();

        expect(status).toEqual('1 minute ago');
    });

    it('should render nothing', () => {
        wrapper.setProps({
            lastActivity:undefined
        })
        const status = wrapper.find('.LastActivity').isEmpty();

        expect(status).toBeTruthy()
    });

    function getMockProps() {
        return {
           lastActivity: Date.now()
        };
    }
});
