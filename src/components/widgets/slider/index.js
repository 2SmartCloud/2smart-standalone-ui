import { greaterThan, lessThan } from '../../../utils/validation/widget/settings/customRules';
import icon from '../../../assets/icons/widgets/slider-option.svg';
import component from './SliderWidget';

function stepRules(dataType) {
    const type = dataType === 'integer' ? 'positive_integer' : 'positive_decimal';

    return [ type, 'required', { 'less_than': 'maxValue' } ];
}

export default {
    component,
    icon,
    type             : 'slider',
    label            : 'Slider',
    dataTypes        : [ 'integer', 'float' ],
    scales           : { w: 2, h: 1 },
    editable         : true,
    advancedSettings : {
        fields : [
            {
                name         : 'step',
                label        : 'Step',
                type         : dataType => dataType || 'integer',
                defaultValue : dataType => dataType === 'integer' ? 1 : 0.1,
                fieldOptions : {
                    maxLength : 8
                },
                validationRules    : stepRules,
                validationMessages : {
                    'REQUIRED'             : 'Step is required',
                    'NOT_POSITIVE_INTEGER' : 'Value should be greater than 0',
                    'NOT_POSITIVE_DECIMAL' : 'Value should be greater than 0',
                    'TOO_HIGH'             : 'Step should be less than max value'
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
                validationRules    : [ 'required', 'integer', { 'greater_than': 'minValue' } ],
                validationMessages : {
                    'REQUIRED'    : 'Max value is required',
                    'NOT_INTEGER' : 'Value must be integer',
                    'TOO_LOW'     : 'Should be greater than min value'
                }
            }
        ],
        customValidatorRules : {
            'less_than'    : lessThan,
            'greater_than' : greaterThan
        }
    }
};
