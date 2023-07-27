import React from 'react';
import { shallow } from 'enzyme';
import Tabs from './Tabs';


describe('Tabs', () => {
    let wrapper;
    let instance;

    beforeEach(() => {
        const mockProps = getMockProps();

        wrapper = shallow(<Tabs {...mockProps} />);
        instance = wrapper.instance();
    });


    it('should be created', () => {
        expect(instance).toBeTruthy();
    });

    it('should render controls if renderControl prop exist', () => {
        wrapper.setProps({
            renderControls: () => {
                return (
                    <div>
                        controls
                    </div>
                )
            }
        });

        expect(wrapper.find('.controlsWrapper').length).toBe(1);
    });

    it('shouldn\'t render controls if renderControl prop not exist', () => {
        wrapper.setProps({
            renderControls: null
        });

        expect(wrapper.find('.controlsWrapper').length).toBe(0);
    });

    function getMockProps() {
        return {
            tabs: [ {
                id: 0,
                label: 'options',
                content: null
            }, {
                id: 1,
                label: 'options',
                content: null
            } ]
        }
    };
});
