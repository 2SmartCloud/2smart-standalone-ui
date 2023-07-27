import React                             from 'react';
import { shallow }                       from 'enzyme';
import getMockStore                      from '../../../__mocks__/storeMock';
import LoadingNotification               from '../../base/LoadingNotification';
import history                           from '../../../history';
import { SCENARIOS }                     from '../../../assets/constants/routes';
import { DEVICES_MOCK }                  from '../../../__mocks__/deviceMock';
import { EXTENSIONS_ENTITIES_MOCK_LIST } from '../../../__mocks__/extensionServiceMock';
import { ALIASES }                       from '../../../__mocks__/aliasesMock';
import ScenarioCreateContainer           from './ScenarioCreateContainer';
import CustomForm                        from './shared/CustomForm';

jest.mock('../../../actions/scenarios');
jest.mock('../../../history');
jest.mock('homie-sdk/lib/utils', () => {
    return {
        getRandomId : jest.fn().mockImplementation(() => 'mock-id'),
    };
});

describe('ScenarioCreateContainer', () => {
    let wrapper;
    let instance;

    beforeEach(() => {
        history.push.mockClear();

        const mockProps = getMockProps();
        const mockStore = getMockStore(getMockAppState);
        const mockBoundActions = getMockBoundActions();

        wrapper = shallow(<ScenarioCreateContainer {...mockProps} store={mockStore} />).dive().dive();
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

    it('should render form', () => {
        const form = wrapper.find(CustomForm);

        expect(form).toBeTruthy();
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

    describe('handleAddScenario()', () => {
        it('should call create request and handle processing', async () => {
            spyOn(instance, 'handleStartProcessing').and.stub();
            spyOn(instance, 'handleSuccess').and.stub();

            const expectedPayload = {
                mode   : 'SIMPLE',
                name   : 'ertyuiop',
                params : {
                    HYSTERESIS   : 'gfhjkl',
                    SWITCH_TOPIC : 'gfhjkl;',
                    TEMP_TOPIC   : 'fghjkl;'
                },
                title  : 'qwertyuio',
                script : '',
                typeId : '1'
            };

            await instance.handleAddScenario({
                name         : 'ertyuiop',
                HYSTERESIS   : 'gfhjkl',
                SWITCH_TOPIC : 'gfhjkl;',
                TEMP_TOPIC   : 'fghjkl;',
                title        : 'qwertyuio',
                script       : ''
            });

            expect(instance.handleStartProcessing).toHaveBeenCalled();
            expect(instance.props.createScenario).toHaveBeenCalledWith(expectedPayload);
            expect(instance.handleSuccess).toHaveBeenCalled();
        });

        it('should handle error if create request failed', async () => {
            wrapper.setProps({
                createScenario : jest.fn().mockReturnValue(Promise.reject({ code: 'error' }))
            });
            spyOn(instance, 'handleError').and.stub();

            await instance.handleAddScenario({
                name   : 'ertyuiop',
                title  : 'qwertyuio',
                scripy : ''
            });

            expect(instance.props.createScenario).toHaveBeenCalled();
            expect(instance.handleError).toHaveBeenCalledWith({ code: 'error' });
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
        const result = instance.getScenarioConfiguration('b31fbd8f7f2d835d613c5be963301f0e');

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
                    disabled    : false
                }
            ]
        });
    });

    describe('getPrefilledData()', () => {
        it('should call getScenarioUniqueName() prop', async () => {
            wrapper.setProps({getScenarioUniqueName: jest.fn(), location: { query: { type: 'b31fbd8f7f2d835d613c5be963301f0e', mode: 'SIMPLE'}}});
            wrapper.setState = jest.fn();

            await instance.getPrefilledData();

            expect(instance.props.getScenarioUniqueName).toBeCalledWith('SIMPLE', "@2smart/test-module");
            expect(wrapper.state().prefilledData).toBeFalsy();
            expect(wrapper.setState).toBeCalledTimes(2);
        });

        it('should call getScenarioUniqueName() prop in ADVANCED mode', async () => {
            wrapper.setProps({getScenarioUniqueName: jest.fn(), location: { query: { type: '1', mode: 'ADVANCED'}}});
            wrapper.setState = jest.fn();

            await instance.getPrefilledData();

            expect(instance.props.getScenarioUniqueName).toBeCalledWith("ADVANCED", "@2smart/pro-scenario");
            expect(wrapper.state().prefilledData).toBeFalsy();
            expect(wrapper.setState).toBeCalledTimes(2);
        });
    })

    function getMockProps() {
        return { location: { query: { type: '1', mode: 'SIMPLE' } } };
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
                list       : [],
                isFetching : true
            }
        };
    }

    function getMockBoundActions() {
        return {
            createScenario : jest.fn()
        };
    }
});
