import icon from '../../../assets/icons/widgets/thermostat-option.svg';
import component from './ThermostatWidget';

function stepRules(dataType) {
    const type = dataType === 'integer' ? 'positive_integer' : 'positive_decimal';

    return [ type, 'required' ];
}

export default {
    component,
    icon,
    type             : 'thermostat',
    label            : 'Thermostat',
    dataTypes        : [ 'integer', 'float' ],
    scales           : { w: 2, h: 1 },
    editable         : true,
    advancedSettings : {
        fields : [
            {
                name         : 'step',
                label        : 'Step',
                type         : dataType => dataType || 'integer',
                defaultValue : dataType => dataType === 'integer' ? 1 : 0.5,
                fieldOptions : {
                    maxLength : 8
                },
                validationRules    : stepRules,
                validationMessages : {
                    'REQUIRED'             : 'Step is required',
                    'NOT_POSITIVE_INTEGER' : 'Value should be greater than 0',
                    'NOT_POSITIVE_DECIMAL' : 'Value should be greater than 0'
                }
            }
        ]
    }
};
