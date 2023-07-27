import icon from '../../../assets/icons/widgets/color-option.svg';
import component from './ColorWidget';

export default {
    component,
    icon,
    type            : 'color',
    label           : 'Color',
    dataTypes       : [ 'color' ],
    scales          : { w: 2, h: 2 },
    editable        : true,
    processingDelay : 250
};
