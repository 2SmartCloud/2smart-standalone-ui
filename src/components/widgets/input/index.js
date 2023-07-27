import icon from '../../../assets/icons/widgets/input-option.svg';
import component from './InputWidget';

export default {
    component,
    icon,
    type      : 'input',
    label     : 'Input',
    dataTypes : [ 'string', 'integer', 'float' ],
    scales    : { w: 2, h: 1 },
    editable  : true
};
