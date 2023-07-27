import React from 'react';
import { shallow } from 'enzyme';
import ColorSelect from './ColorSelect';

jest.mock('../../../../../utils/theme/widget/getColors', () => ({
    getChartColor: jest.fn().mockImplementation(color => `#${color}`)
}));
jest.mock('../../../../../assets/constants/widget', () => ({
    WIDGET_COLORS: require('../../../../../__mocks__/widgetMock').WIDGET_COLORS_MOCK,
    DEFAULT_WIDGET_COLOR_VALUE: 'blue-green'
}));

describe('ColorSelect component', () => {
    let wrapper;
    let instance;

    beforeEach(() => {
        const mockProps = getMockProps();

        wrapper = shallow(<ColorSelect {...mockProps} />);
        instance = wrapper.instance();
    });

    it('should be created', () => {
        expect(instance).toBeTruthy();
    });

    it('handleChange() should call onChange', () => {
        instance.handleChange({ value: 'blue-green' });

        expect(instance.props.onChange).toHaveBeenCalledWith('blue-green');
    });

    it('getOptions() should return color options array', () => {
        const result = instance.getOptions();
        const expected = [
            { color: '#blue-green', value: 'blue-green' },
            { color: '#white', value: 'white' },
            { color: '#blue', value: 'blue' },
            { color: '#green', value: 'green' }
        ];

        expect(result).toEqual(expected);
    });

    it('getDefaultColor() should return default color option', () => {
        const result = instance.getDefaultColor();
        const expected = { color: '#blue-green', value: 'blue-green' };

        expect(result).toEqual(expected);
    });

    function getMockProps() {
        return {
            onChange : jest.fn()
        };
    }
});
