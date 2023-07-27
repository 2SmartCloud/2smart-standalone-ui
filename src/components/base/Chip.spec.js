import React from 'react';
import { shallow } from 'enzyme';
import Chip from './Chip';


describe('Chip', () => {
    let wrapper;
    let instance;

    beforeEach(() => {
        const mockProps=getMockProps();
        wrapper = shallow(<Chip  {...mockProps} />);

        instance = wrapper.instance();
    });

    it('should be created', () => {
        expect(instance).toBeTruthy();
    });

    it('should set initial classes with default props', () => {
        const chipElements = wrapper.find('.Chip.sizeM.primary');

        expect(chipElements.length).toBe(1);
    });

    it('should set classes with props', () => {
        wrapper.setProps({
            size: 'S',
            color: 'secondary',
            disabled: true
        });

        const chipElements = wrapper.find('.Chip.sizeS.secondary.disabled');

        expect(chipElements.length).toBe(1);
    });

    it('should chip unattach', () => {
        instance.handleUnattach();

        expect(instance.props.onDeleteIconClick).toBeCalled();
    });

    it('should render custom tooltip if props.renderTooltipExist', () => {
        wrapper.setProps({
            renderTooltip: jest.fn()
        });

        expect(instance.props.renderTooltip).toBeCalled();
    });

    function getMockProps() {
        return {
            data : {
                id: "4",
                rootTopic: "groups-of-properties/4",
                label: "Fouth group",
                value:''
            },
            onDeleteIconClick : jest.fn(),
        };
    }
});
