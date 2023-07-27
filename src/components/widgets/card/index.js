import icon from '../../../assets/icons/widgets/card-option.svg';
import component from './CardWidget';

export default {
    component,
    icon,
    type      : 'card',
    label     : 'Card',
    dataTypes : [ 'integer', 'float', 'boolean', 'string', 'enum', 'color' ],
    scales    : { w: 2, h: 1 },
    isMulti   : true
};
