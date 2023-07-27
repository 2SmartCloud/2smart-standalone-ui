import icon from '../../../assets/icons/widgets/led-option.svg';
import component from './LedWidget';

export default {
    component,
    icon,
    type             : 'led',
    label            : 'LED',
    dataTypes        : [ 'boolean' ],
    editable         : false,
    advancedSettings : {
        fields : [
            {
                name         : 'ledColor',
                label        : 'Choose the design of the LED widget',
                type         : 'color',
                fieldOptions : {
                    placeholder : 'Select color'
                }
            }
        ]
    }
};
