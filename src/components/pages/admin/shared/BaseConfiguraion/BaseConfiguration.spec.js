import React             from 'react';
import { shallow }       from 'enzyme';

import BaseConfiguration from './BaseConfiguration';
import EntityControl     from '../../../../base/controls/Entity';
import StringInput       from '../../../../base/inputs/String';

describe('BaseConfiguration component', () => {
    let wrapper;
    let instance;

    beforeEach(() => {
        const mockProps = getMockProps();
        wrapper = shallow(<BaseConfiguration {...mockProps} />);
        instance = wrapper.instance();
    });

    it('should be created', () => {
        expect(instance).toBeTruthy();
    });

    describe('componentDidMount()', () => {
        const expectedState = [{ topic: '', message: '' }];

        it('should change state if !initialState', () => {
            wrapper.setProps({
                initialState : null,
                field : { default: expectedState }
            });

            instance.componentDidMount();

            expect(instance.state.fields).toEqual(expectedState);
        });

        it('should change state if initialState exsists', () => {
            instance.componentDidMount();

            expect(instance.state.fields).toEqual(expectedState);
        });
    });

    it('should handleChangeEntity() call onChange prop', () => {
        const value = 'test';
        instance.handleChangeEntity(1)({value});

        expect(instance.props.onChange).toHaveBeenCalled();
    });

    it('should handleChangeField() call onChange prop', () => {
        const value = 'test';
        instance.handleChangeField(1)({value});

        expect(instance.props.onChange).toHaveBeenCalled();
    });

    describe('handleAddField()', () => {
        it('should handleAddField() add field', () => {
            wrapper.setState({ fields : [ { topic: '', messageOn: '', messageOff: '' } ] });

            const expectedState = [{
                topic: '',
                messageOn: '',
                messageOff: ''
            }, {
                topic: '',
                messageOn: '',
                messageOff: ''
            }];

            instance.handleAddField();

            expect(instance.state.fields).toEqual(expectedState);
        });

        it('should call onChange prop', () => {
            instance.handleAddField();

            expect(instance.props.onChange).toHaveBeenCalled();
        });

        it('should call onInteract()', () => {
            spyOn(instance, 'onInteract');

            instance.handleAddField();

            expect(instance.onInteract).toHaveBeenCalled();
        });
    });

    describe('handleRemoveField()', () => {
        it('should change state', () => {
            const state = [ {
                topic: '',
                message: ''
            }, {
                topic: '',
                message: ''
            } ];

            wrapper.setState({ fields: state });

            instance.handleRemoveField(1)();

            expect(instance.state.fields.length).toBe(1);
        });

        it('should call onChange prop', () => {
            instance.handleRemoveField(0)();

            expect(instance.props.onChange).toHaveBeenCalled();
        });

        it('should call onInteract()', () => {
            spyOn(instance, 'onInteract');

            instance.handleRemoveField(0)();

            expect(instance.onInteract).toHaveBeenCalled();
        });
    });

    it('should onInteract call onInteract prop', () => {
        wrapper.setProps({ errors: {
            test : [{topic: 'invalid', message: 'invalid'}]
        } });

        instance.onInteract();

        expect(instance.props.onInteract).toHaveBeenCalledWith(instance.props.field.name);
    });

    describe('renderField', () => {
        it('should render TopicSelect, StringInput components on init', () => {
            const entityElement = wrapper.find(EntityControl);
            const inputElement  = wrapper.find(StringInput)

            instance.renderField();

            expect(entityElement.length).toBe(1);
            expect(inputElement.length).toBe(2);
        });
    });


    function getMockProps() {
        return {
            field: {
                name : 'test',
            },
            initialState : [ { topic: '', message: '' } ],
            onInteract   : jest.fn(),
            onChange     : jest.fn()
        };
    }
});