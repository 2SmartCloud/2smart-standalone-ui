import React from 'react';
import { shallow } from 'enzyme';
import getMockStore from '../../../__mocks__/storeMock';
import NoDataMessage from '../../widgets/etc/NoDataMessage';
import Base from './BaseWidget';

jest.mock('../../../actions/homie');
jest.mock('../../../utils/theme/widget/getColors');
jest.mock('../../../utils/homie/dispatcherSingleton');
jest.mock('../../../utils/theme');

describe('BaseWidget component', () => {
    let wrapper;
    let instance;

    beforeEach(() => {
        const mockStore = getMockStore();
        const mockProps = getMockProps();
        const mockBoundActions = getMockBoundActions();

        wrapper = shallow(<Base {...mockProps} store={mockStore} />).dive();
        wrapper.setProps(mockBoundActions);

        instance = wrapper.instance();
        instance.widget = getMockWidgetRef();
    });

    it('should be created', () => {
        expect(instance).toBeTruthy();
    });

    it('should call setAsyncAttribute dispatcher on value change', () => {
        instance.handleSetValue('test');

        expect(instance.currentValue).toBe('previous');
        expect(instance.props.setAsyncAttributeDispatcher).toHaveBeenCalled();
        expect(instance.widget.onValueChanged).toHaveBeenCalled();
    });

    it('should call updateAttribute before setAsyncAttribute while doing optimistic update', () => {
        instance.handleSetValue('test', true);

        expect(instance.optimistic).toBe(true);
        expect(instance.props.updateAttributeDispatcher).toHaveBeenCalled();
        expect(instance.props.setAsyncAttributeDispatcher).toHaveBeenCalled();
    });

    it('should handle processing start', () => {
        jest.useFakeTimers();

        spyOn(instance, 'handleStartProcessing').and.stub();

        wrapper.setProps({ isProcessing: true });
        wrapper.update();
        jest.runAllTimers();

        expect(instance.handleStartProcessing).toHaveBeenCalled();
    });

    it('should handle processing stop', () => {
        spyOn(instance, 'handleSuccess').and.stub();

        wrapper.setProps({ isProcessing: true });
        wrapper.setProps({ isProcessing: false });

        expect(wrapper.state('isProcessing')).toBe(false);
        expect(instance.handleSuccess).toHaveBeenCalled();
    });


    it('should handle processing stop and call error', () => {
        spyOn(instance, 'handleError').and.stub();

        wrapper.setProps({ isProcessing: true });
        wrapper.setProps({ isProcessing: false, isError: true, error: { message: 'validation' } });

        expect(wrapper.state('isProcessing')).toBe(false);
        expect(instance.handleError).toHaveBeenCalledWith({ message: 'validation' });
    });


    it('should render No data message if there is no property', () => {
        wrapper.setProps({ propertyNotFound: true });

        expect(wrapper.find(NoDataMessage)).toHaveLength(1);
    });

    function getMockWidgetRef() {
        return {
            onValueChanged : jest.fn(),
            onProcessing   : jest.fn(),
            onSuccess      : jest.fn(),
            onError        : jest.fn(),
            setValue       : jest.fn()
        };
    }

    function getMockProps() {
        return {
            value            : 'previous',
            widget           : props => <div {...props} />,
            widgetProps      : {},
            bgColor          : '#FFF',
            isEditMode       : false,
            isEditable       : true,
            topic            : 'topic',
            propertyNotFound : false,
            hardwareType     : 'device',
            propertyType     : 'options',
            screenId         : '1',
            widgetId         : '2',
            isProcessing     : false,
            iserror          : false,
            onMenuSelect     : jest.fn()
        };
    }

    function getMockBoundActions() {
        return {
            setAsyncAttributeDispatcher : jest.fn(),
            updateAttributeDispatcher   : jest.fn(),
            onErrorRemove               : jest.fn()
        };
    }
});
