import React from 'react';
import { shallow } from 'enzyme';
import getMockStore from '../../../__mocks__/storeMock';
import LoadingNotification from '../../base/LoadingNotification';
import history from '../../../history';
import { DEVICES_MOCK } from '../../../__mocks__/deviceMock';
import { ALIASES } from '../../../__mocks__/aliasesMock';
import { NOT_FOUND, SCENARIOS } from '../../../assets/constants/routes';
import { EXTENSIONS_ENTITIES_MOCK_LIST } from '../../../__mocks__/extensionServiceMock';

import ScenarioEditContainer from './ScenarioEditContainer';
import CustomForm from './shared/CustomForm';


jest.mock('../../../actions/scenarios');
jest.mock('../../../history');

describe('ScenarioEditContainer', () => {
    let wrapper;
    let instance;

    beforeEach(() => {
        history.push.mockClear();

        const mockProps = getMockProps();
        const mockStore = getMockStore(getMockAppState);
        const mockBoundActions = getMockBoundActions();

        wrapper = shallow(<ScenarioEditContainer {...mockProps} store={mockStore} />).dive().dive();
        wrapper.setProps(mockBoundActions);

        instance = wrapper.instance();
    });

    it('should be created', () => {
        expect(instance).toBeTruthy();
    });

    it('should render loader', () => {
        wrapper.setProps({
            installedExtensions : { isFetching: true }
        });

        const loader = wrapper.find(LoadingNotification);

        expect(loader).toBeTruthy();
    });

    it('should render loader', () => {
        wrapper.setState({ isFetching: true });

        const loader = wrapper.find(LoadingNotification);

        expect(loader).toBeTruthy();
    });

    it('should render form', () => {
        const form = wrapper.find(CustomForm);

        expect(form).toBeTruthy();
    });

    it('should do redirect if configuration is not found', () => {
        wrapper.setProps({
            installedExtensions : { list: [] }
        });

        expect(history.push).toHaveBeenCalledWith(NOT_FOUND);
    });


    describe('handleUpdateScenario', () => {
        it('should call update request and handle processing', async () => {
            spyOn(instance, 'handleStartProcessing').and.stub();
            spyOn(instance, 'handleSuccess').and.stub();
            const payload = {
                name   : '',
                script : '',
                title  : 'New Title'
            };

            await instance.handleUpdateScenario(payload);

            expect(instance.handleStartProcessing).toHaveBeenCalled();
            expect(instance.props.updateScenario).toHaveBeenCalledWith('2', { ...payload, params: {} });
            expect(instance.handleSuccess).toHaveBeenCalled();
        });

        it('should handle error if update request failed', async () => {
            wrapper.setProps({
                updateScenario : jest.fn().mockReturnValue(Promise.reject({ code: 'error' }))
            });
            spyOn(instance, 'handleError').and.stub();

            await instance.handleUpdateScenario({   name: 'scenario-2' });

            expect(instance.props.updateScenario).toHaveBeenCalled();
            expect(instance.handleError).toHaveBeenCalledWith({ code: 'error' });
        });
    });

    describe('fetch() should call initEnumAsyncOptions', () => {
        it('should call initEnumAsyncOptions if scenario.params.CITY', async () => {
            wrapper.setProps({
                getScenario : jest.fn().mockReturnValue(Promise.resolve({ params: { CITY: 'test' } }))
            });

            spyOn(instance, 'initEnumAsyncOptions');

            instance.fetchData();

            const scenario = await instance.props.getScenario();

            expect(instance.initEnumAsyncOptions).toHaveBeenCalledWith(scenario.params.CITY);
        });

        it('should not call initEnumAsyncOptions if !scenario.params.CITY', async () => {
            wrapper.setProps({
                getScenario : jest.fn().mockReturnValue(Promise.resolve({ params: { CITY: '' } }))
            });

            spyOn(instance, 'initEnumAsyncOptions');

            instance.fetchData();

            const scenario = await instance.props.getScenario();

            expect(instance.initEnumAsyncOptions).not.toHaveBeenCalledWith(scenario.params.CITY);
        });
    });

    describe('handleGetEnumAsyncOptions()', () => {
        let value = 'test';
        const path = '/test';

        it('schould call getEnumAsyncOptions prop', async  () => {
            wrapper.setProps({ getEnumAsyncOptions: jest.fn() });

            await instance.handleGetEnumAsyncOptions(path, value);

            expect(instance.props.getEnumAsyncOptions).toBeCalledWith(path, { search: value });
        });

        it('should not call getEnumAsyncOptions prop if !value', () => {
            wrapper.setProps({ getEnumAsyncOptions: jest.fn() });

            value = undefined;

            expect(instance.props.getEnumAsyncOptions).toBeCalledTimes(0);
        });
    });

    describe('initEnumAsyncOptions()', () => {
        let value = 'test';
        const path = '/cities';

        it('schould call getEnumAsyncOptions prop', async  () => {
            wrapper.setProps({ getEnumAsyncOptions: jest.fn() });

            await instance.initEnumAsyncOptions(value);

            expect(instance.props.getEnumAsyncOptions).toBeCalledWith(path, { latlng: value });
        });

        it('should not call getEnumAsyncOptions prop if !value', () => {
            wrapper.setProps({ getEnumAsyncOptions: jest.fn() });

            value = undefined;

            expect(instance.props.getEnumAsyncOptions).toBeCalledTimes(0);
        });
    });

    it('handlePushBack() should do navigation back ', () => {
        instance.handlePushBack();

        expect(history.push).toHaveBeenCalledWith(SCENARIOS);
    });

    it('handleStartProcessing() should set processing state', () => {
        wrapper.setState({
            isProcessing : false,
            errors       : { test: 'test' }
        });

        instance.handleStartProcessing();

        expect(wrapper.state().isProcessing).toBeTruthy();
        expect(wrapper.state().errors).toBeNull();
    });

    it('handleSuccess() should set success state and navigate back', () => {
        spyOn(instance, 'handlePushBack').and.stub();

        wrapper.setState({ isProcessing: true });

        instance.handleSuccess();

        expect(wrapper.state().isProcessing).toBeFalsy();
        expect(instance.handlePushBack).toHaveBeenCalled();
    });

    it('handleError() should set error state', () => {
        wrapper.setState({ isProcessing: true });

        try {
            instance.handleError({ fields : { data : {
                name : 'error'
            } } });
        } catch(error) {
            // pass
        }

        expect(wrapper.state().isProcessing).toBeFalsy();
        expect(wrapper.state().errors).toEqual({ name: 'error' });
    });


    it('handleInteract() should clear error for given field name', () => {
        const givenErrors = {
            field1 : 'value1',
            field2 : 'value2',
            field3 : 'value3'
        };
        const expectedErrors = {
            field1 : 'value1',
            field2 : null,
            field3 : 'value3'
        };

        wrapper.setState({ errors: givenErrors });

        instance.handleInteract('field2');

        expect(wrapper.state().errors).toEqual(expectedErrors);
    });


    it('getScenarioConfiguration() should return configuration for given service type', () => {
        const mockScenario =  {
            title      : 'Test module',
            name       : '@2smart/test-module',
            
            id : 'b31fbd8f7f2d835d613c5be963301f0e',
            type   : '@2smart/test-module',
            mode   : 'SIMPLE',
            status : 'ACTIVE'
        };

        const result = instance.getScenarioConfiguration(mockScenario);

        expect(result).toEqual({

            id          : 'b31fbd8f7f2d835d613c5be963301f0e',
            entityTopic : 'extensions/b31fbd8f7f2d835d613c5be963301f0e',
            description : '2smart test package',
            title       : 'Test module',
            link        : 'https://www.npmjs.com/package/2smart-test-module',
            name        : '@2smart/test-module',
            state       : 'installed',
            type        : 'simple-scenario',
            version     : '0.4.0',

            fields : [
                {
                    name : 'description',
                    type : 'description'
                },
                {
                    name        : 'title',
                    label       : 'Scenario\'s title*',
                    placeholder : 'Scenario\'s title',
                    type        : 'string'
                },
                {
                    name        : 'name',
                    label       : 'Scenario\'s name*',
                    placeholder : 'Scenario\'s name',
                    type        : 'string',
                    disabled    : true
                }
            ]
        });
    });

    function getMockProps() {
        return { match: { params: { id: '2' } } };
    }

    function getMockAppState() {
        return {
            aliases : {
                list : ALIASES
            },
            homie : {
                devices    : DEVICES_MOCK,
                thresholds : {}
            },
            extensions : {
                installedEntities : {
                    list       : EXTENSIONS_ENTITIES_MOCK_LIST,
                    isFetching : true
                }
            },
            groups : {
                list: [],
                isFetching : true
            }  
        };
    }

    function getMockBoundActions() {
        return {
            getScenario    : jest.fn(),
            updateScenario : jest.fn()

        };
    }
});
