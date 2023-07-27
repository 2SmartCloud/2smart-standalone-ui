import { greaterThan, lessThan } from '../../../utils/validation/widget/settings/customRules';
import icon from '../../../assets/icons/widgets/signal-option.svg';
import component from './SignalLevelWidget';

export default {
    component,
    icon,
    type             : 'signalLevel',
    label            : 'Signal level',
    dataTypes        : [ 'integer', 'float', 'string' ],
    editable         : false,
    advancedSettings : {
        fields : [
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
