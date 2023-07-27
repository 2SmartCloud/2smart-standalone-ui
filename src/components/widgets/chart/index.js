import { greaterThan, lessThan } from '../../../utils/validation/widget/settings/customRules';
import icon from '../../../assets/icons/widgets/chart-option.svg';
import component from './ChartWidget';

export default {
    component,
    icon,
    type             : 'chart',
    label            : 'Chart',
    dataTypes        : [ 'integer', 'float' ],
    scales           : { w: 2, h: 2 },
    advancedSettings : {
        fields : [
            {
                name         : 'chartType',
                label        : 'Chart type',
                type         : 'select',
                defaultValue : 'bar',
                fieldOptions : {
                    placeholder : 'Select chart type',
                    options     : [
                        { value: 'bar', label: 'Bar' },
                        { value: 'line', label: 'Linear' }
                    ]
                }
            },
            {
                name         : 'interval',
                label        : 'Interval(sec)',
                type         : 'integer',
                defaultValue : 15,
                fieldOptions : {
                    maxLength : 6
                },
                validationRules    : [ 'required', 'positive_integer', 'not_empty' ],
                validationMessages : {
                    'REQUIRED'             : 'Interval is required',
                    'CANNOT_BE_EMPTY'      : 'Cannot be empty',
                    'NOT_POSITIVE_INTEGER' : 'Value must be greater than 0'
                }
            },
            {
                name         : 'minValue',
                label        : 'Min value',
                type         : 'integer',
                defaultValue : 0,
                fieldOptions : {
                    maxLength : 8
                },
                validationRules    : [ 'required', 'integer', { 'less_than': 'maxValue' } ],
                validationMessages : {
                    'REQUIRED'    : 'Min value is required',
                    'NOT_INTEGER' : 'Value must be integer',
                    'TOO_HIGH'    : 'Should be less than max value'
                }
            },
            {
                name         : 'maxValue',
                label        : 'Max value',
                type         : 'integer',
                defaultValue : 100,
                fieldOptions : {
                    maxLength : 8
                },
                validationRules    : [ 'required',  'integer', { 'greater_than': 'minValue' } ],
                validationMessages : {
                    'REQUIRED'    : 'Max value is required',
                    'NOT_INTEGER' : 'Value must be integer',
                    'TOO_LOW'     : 'Should be greater than min value'
                }
            },
            {
                name         : 'chartColor',
                label        : 'Bar color',
                type         : 'color',
                fieldOptions : {
                    placeholder : 'Select color'
                }
            }
        ],
        customValidatorRules : {
            'less_than'    : lessThan,
            'greater_than' : greaterThan
        }
    }
};
