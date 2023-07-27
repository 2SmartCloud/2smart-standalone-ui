import React                       from 'react';
import ReactDOM                    from 'react-dom';
import { shallow }                 from 'enzyme';
import CustomForm                  from './CustomForm';

import TopicConfiguration          from '../Scenarios/TopicConfiguration';
import StringInput                 from '../../../base/inputs/String';
import IntegerInput                from '../../../base/inputs/Integer';
import FloatInput                  from '../../../base/inputs/Float';
import PasswordInput                from '../../../base/inputs/Password';
import GenericToggle               from '../../../base/GenericToggle';
import BaseSelect                  from '../../../base/select/BaseSelect';
import CitySelect                  from '../../../base/select/CitiesSelect';
import AsyncSelect                 from '../../../base/select/AsyncSelect';
import NotificationConfiguration   from './NotificationConfiguration';
import BaseConfiguration           from './BaseConfiguraion';

import {MARKET_SERVICES_MOCK_LIST} from '../../../../__mocks__/marketServicesMock';
import {TOPICS_MOCK}               from '../../../../__mocks__/deviceMock';

import * as detect                 from '../../../../utils/detect';

jest.mock('../../../../history');
jest.mock('../../../../utils/detect');

describe('CustomForm component', () => {
    let wrapper;
    let instance;

    beforeEach(() => {
        const mockProps = getMockProps();

        wrapper = shallow(<CustomForm {...mockProps} />);
        instance = wrapper.instance();
    });

    it('should be created', () => {
        expect(instance).toBeTruthy();
    });

    it('should map initialState to state', () => {
        expect(wrapper.state().fields).toEqual(instance.props.initialState);
    });

    it('handleBackButtonClick() should return to Services page', () => {
        const button = wrapper.find('.button');

        button.simulate('click');

        expect(instance.props.onClickBack).toHaveBeenCalled();
    });

    describe('getError()', () => {
        it('should map error code to the human-readable text', () => {
            const result = instance.getError('REQUIRED');

            expect(result).toBe('Value is required');
        });

        it('should humanize error code if it has not found in mapper', () => {
            const result = instance.getError('UNKNOWN_ERROR');

            expect(result).toBe('Unknown error');
        });

        it('should return undefined if there is no error code provided', () => {
            const result = instance.getError(undefined);

            expect(result).toBeUndefined();
        });

        it('should return object if error code is an object', () => {
            const code = {};
            const result = instance.getError(code);

            expect(result).toEqual(code);
        });
    });

    it('handleChangeToogle() should change state and call onInteract', () => {
        instance.handleChangeToogle('test')({value:'value'});

        expect(wrapper.state().fields['test']).toBe('value');
        expect(instance.props.onInteract).toHaveBeenCalledWith('test');
    });

    it('handleChangeSelect() should change state and call onInteract', () => {
        instance.handleChangeSelect('test')({value:'value'});

        expect(wrapper.state().fields['test']).toBe('value');
        expect(instance.props.onInteract).toHaveBeenCalledWith('test');
    });


    it('handleChangeMultipleSelect() should change state and call onInteract', () => {
        instance.handleChangeMultipleSelect('multiple')([{value:'value'}]);

        expect(wrapper.state().fields['multiple']).toEqual(['value']);

        expect(instance.props.onInteract).toHaveBeenCalledWith('multiple');
    });

    it('handleChangeField() should change state and call onInteract', () => {
        instance.handleChangeField('test')('value');

        expect(wrapper.state().fields['test']).toBe('value');
        expect(instance.props.onInteract).toHaveBeenCalledWith('test');
    });

    it('handleValueDelete() should delete topic from array of selected ', () => {

        wrapper.setState({
            fields:{
                'multiple':['value','value1']
            }
        })
        instance.handleValueDelete('multiple')({id:'value'});

        expect(wrapper.state().fields['multiple']).toEqual(['value1']);
    });

    it('handleChangeJsonField() should change state', () => {
        instance.handleChangeJsonField('test')('"value"');

        expect(wrapper.state().fields['test']).toBe('value');
    });

    it('handleChangeEditorField() should change сall handler, depend on filed type(type:json)', () => {
        spyOn(instance, 'handleChangeJsonField');

        instance.handleChangeEditorField({type:'json', name:'test'} );

        expect(instance.handleChangeJsonField).toHaveBeenCalled();
    });

    it('handleChangeEditorField() should change сall handler, depend on filed type(type:javascript)', () => {
        spyOn(instance, 'handleChangeField');

        instance.handleChangeEditorField({type:'javascript', name:'test'} );

        expect(instance.handleChangeField).toHaveBeenCalled();
    });

    describe('renderField()', () => {
        it('should render topic configuration', () => {
            wrapper.setProps({
                configuration:{
                    fields:[
                        {
                            type           : 'topic',
                            topicDataTypes : ['string'],
                            name           : 'name',
                            label          : 'label'
                        }
                    ]
                }
            })

            wrapper.update();

            expect((wrapper).find(TopicConfiguration)).toHaveLength(1)
        });

        it('should render toogle', () => {
            wrapper.setProps({
                configuration:{
                    fields:[
                        {
                            type: 'boolean',
                            name:'name',
                            label:'label'
                        }
                    ]
                }
            })

            wrapper.update();

            expect((wrapper).find(GenericToggle)).toHaveLength(1)
        });

        it('should render topic configuration with multiple choice', () => {
            wrapper.setProps({
                configuration:{
                    fields:[
                        {
                            type: 'topics',
                            topicDataTypes:['string'],
                            name:'name',
                            label:'label'
                        }
                    ]
                }
            })

            wrapper.update();

            expect((wrapper).find(TopicConfiguration)).toHaveLength(1)
        });

        it('should render stringInput', () => {
            wrapper.setProps({
                configuration:{
                    fields:[
                        {
                            type: 'string',
                            name:'name',
                            label:'label'
                        }
                    ]
                }
            })

            wrapper.update();

            expect((wrapper).find(StringInput)).toHaveLength(1)
        });

        it('should render floatInput', () => {
            wrapper.setProps({
                configuration:{
                    fields:[
                        {
                            type: 'number',
                            name:'name',
                            label:'label'
                        }
                    ]
                }
            })

            wrapper.update();

            expect((wrapper).find(FloatInput)).toHaveLength(1)
        });

        it('should render integerInput', () => {
            wrapper.setProps({
                configuration:{
                    fields:[
                        {
                            type: 'integer',
                            name:'name',
                            label:'label'
                        }
                    ]
                }
            })

            wrapper.update();

            expect((wrapper).find(IntegerInput)).toHaveLength(1)
        });

        it('should render BaseSelect', () => {
            wrapper.setProps({
                configuration:{
                    fields:[
                        {
                            type: 'enum',
                            name: 'name',
                            label: 'label',
                            format: [{value: '1', label: '1'}]
                        }
                    ]
                }
            })

            wrapper.update();

            expect((wrapper).find(BaseSelect)).toHaveLength(1)
        });

        it('should render CitiesSelect by enum-async type and basePath /cities', () => {
            wrapper.setProps({
                configuration:{
                    fields:[
                        {
                            type: 'enum-async',
                            name: 'name',
                            label: 'label',
                            basePath: '/cities'
                        }
                    ]
                }
            })

            wrapper.update();

            expect((wrapper).find(CitySelect)).toHaveLength(1)
        });

        it('should render AsyncSelect by enum-async type', () => {
            wrapper.setProps({
                configuration:{
                    fields:[
                        {
                            type: 'enum-async',
                            name: 'name',
                            label: 'label',
                            basePath: '/test'
                        }
                    ]
                }
            })

            wrapper.update();

            expect((wrapper).find(AsyncSelect)).toHaveLength(1)
        });

        it('should render password input', () => {
            wrapper.setProps({
                configuration:{
                    fields:[
                        {
                            type: 'password',
                            name:'name',
                            label:'label'
                        }
                    ]
                }
            })

            wrapper.update();

            expect((wrapper).find(PasswordInput)).toHaveLength(1)
        });

        it('should render NotificationConfiguration', () => {
            wrapper.setProps({
                configuration:{
                    fields:[
                        {
                            type: 'notification-config',
                            name: 'name',
                            label: 'label'
                        }
                    ]
                }
            })

            wrapper.update();

            expect((wrapper).find(NotificationConfiguration)).toHaveLength(1)
        });

        it('should render BaseConfiguration', () => {
            wrapper.setProps({
                configuration:{
                    fields:[
                        {
                            type: 'action-topics-config',
                            topicDataTypes:['string'],
                            name:'name',
                            label:'label'
                        }
                    ]
                }
            })

            wrapper.update();

            expect((wrapper).find(BaseConfiguration)).toHaveLength(1)
        });
    });

    describe('setFocusOnFirstField()', () => {
        it('should set focus on the first input', () => {
            spyOn(ReactDOM, 'findDOMNode');
            detect.isTouchDevice = jest.fn().mockReturnValue(false);

            instance.setFocusOnFirstField();

            expect(ReactDOM.findDOMNode).toHaveBeenCalled();
        });

        it('should not set focus if mobile device has been detected', () => {
            spyOn(ReactDOM, 'findDOMNode');
            detect.isTouchDevice = jest.fn().mockReturnValue(true);

            instance.setFocusOnFirstField();

            expect(ReactDOM.findDOMNode).not.toHaveBeenCalled();
        });
    });

    function getMockProps() {
        return {
            configuration : MARKET_SERVICES_MOCK_LIST[0],
            initialState  : {
                'KNX_CONNECTION_IP_ADDR' : '192.168.1.1',
                'KNX_CONNECTION_IP_PORT' : 502,
                'multiple':[],
                'name':[]

            },
            topics:TOPICS_MOCK,
            isProcessing  : false,
            onSave: jest.fn(),
            onInteract    : jest.fn(),
            onSaveService : jest.fn(),
            onClickBack   : jest.fn()
        };
    }
});
