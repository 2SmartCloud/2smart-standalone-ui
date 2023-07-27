import React from 'react';
import { shallow } from 'enzyme';
import LogLevels from './LogLevels';

describe('LogLevels component', () => {
    let wrapper;
    let instance;

    beforeEach(() => {
        const mockProps = getMockProps();

        wrapper = shallow(<LogLevels {...mockProps}  />);
        instance = wrapper.instance();
    });

    it('should be created', () => {
        expect(instance).toBeDefined();
    });

    it('should render buttons', () => {
        const buttons = wrapper.find('.level');

        expect(buttons).toHaveLength(4);
    });

    it('should set active classname', () => {
        const active = wrapper.find('.level.active');

        expect(active).toHaveLength(1);
    });

    it('should call click handler', () => {
        spyOn(instance, 'handleChangeLevel').and.stub();

        const buttons = wrapper.find('.level');

        buttons.at(1).simulate('click');

        expect(instance.handleChangeLevel).toHaveBeenCalledWith('error');
    });

    it('handleChangeLevel() should call onChangeLogLevel prop', () => {
        instance.handleChangeLevel('warning');

        expect(instance.props.onChangeLogLevel).toHaveBeenCalledWith('warning');
    });

    function getMockProps() {
        return {
            logLevel         : '',
            onChangeLogLevel : jest.fn()
        };
    }
});
