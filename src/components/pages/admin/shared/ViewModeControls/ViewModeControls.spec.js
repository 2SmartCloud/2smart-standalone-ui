import React            from 'react';
import { shallow }      from 'enzyme';
import ViewModeControls from './ViewModeControls';

describe('ViewModeControls component', () => {
    let wrapper;
    let instance;

    beforeEach(() => {
        const mockProps = getMockProps();

        wrapper = shallow(<ViewModeControls {...mockProps} />);
        instance = wrapper.instance();
        instance.onInteract = jest.fn();
    });

    it('should be created', () => {
        expect(instance).toBeTruthy();
    });

    it('should render controls', () => {
        expect(wrapper.find('.control').length).toBe(2);
    });

    it('should render active control by viewMode', () => {
        wrapper.setProps({ viewMode: 'form' });

        expect(wrapper.find('.control.active').length).toBe(1);
    });

    it('should render disabled control(s) if isDisabled === true', () => {
        wrapper.setProps({ controls : [ {
            id         : 'form',
            label      : 'Form',
            isDisabled : true
        }, {
            id         : 'json',
            label      : 'JSON',
            isDisabled : true
        } ] });

        expect(wrapper.find('.control.disabled').length).toBe(2);
    });

    describe('props.onChangeViewMode', () => {
        it('should be called if viewMode change', () => {
            wrapper.setProps({ controls : [ {
                id         : 'form',
                label      : 'Form',
                isDisabled : false
            }, {
                id         : 'json',
                label      : 'JSON',
                isDisabled : false
            } ], viewMode: 'json' });
    
            const consrols = wrapper.find('.control');
    
            consrols.at(0).simulate('click');
    
            expect(instance.props.onChangeViewMode).toHaveBeenLastCalledWith('form');
        });

        it('shouldn\'t be called if viewMode not change', () => {
            wrapper.setProps({ controls : [ {
                id         : 'form',
                label      : 'Form',
                isDisabled : false
            }, {
                id         : 'json',
                label      : 'JSON',
                isDisabled : false
            } ], viewMode: 'json' });
    
            const consrols = wrapper.find('.control');
    
            consrols.at(1).simulate('click');
    
            expect(instance.props.onChangeViewMode).not.toHaveBeenCalled();
        });
    })

    function getMockProps() {
        return {
            onChangeViewMode : jest.fn(),
            viewMode         : 'form',
            controls         : [ {
                id         : 'form',
                label      : 'Form',
                isDisabled : false
            }, {
                id         : 'json',
                label      : 'JSON',
                isDisabled : false
            } ]
        };
    }
});
