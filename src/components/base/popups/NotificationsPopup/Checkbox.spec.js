import React       from 'react';
import { shallow } from 'enzyme';   
import Checkbox    from './Checkbox.js';
import Tooltip     from '@material-ui/core/Tooltip';


describe('NotificationsPopup/Checkbox', () => {
    let wrapper;
    let instance;

    beforeEach(() => {
        const mockBoundActions = getMockBoundActions();

        wrapper = shallow(<Checkbox {...mockBoundActions} />);
    });

    it('should be created', () => {
        expect(wrapper).toBeTruthy();
    });

    it('should render Tooltip if props.tooltip exist', () => {
        wrapper.setProps({ tooltip: 'tooltip' });

        expect(wrapper.find(Tooltip)).toHaveLength(1);

        wrapper.setProps({ tooltip: null });

        expect(wrapper.find(Tooltip)).toHaveLength(0);
    });

    xit('Checkbox click should trigger props.onChange', () => {
        wrapper.setProps({ onChange: jest.fn() });
        const checkboxes = wrapper.find('.Checkbox');

        checkboxes.at(0).simulate('click');

        expect(wrapper.props().onChange).toHaveBeenCalled();
    });

    function getMockBoundActions() {
        return {
            value    : false,
            name     : 'name',
            onChange : jest.fn()
        };
    }
});
