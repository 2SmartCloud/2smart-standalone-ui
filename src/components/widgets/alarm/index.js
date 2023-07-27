import icon from '../../../assets/icons/widgets/alarm-option.svg';
import component from './AlarmWidget';

export default {
    component,
    icon,
    type      : 'alarm',
    label     : 'Alarm',
    dataTypes : [ 'boolean' ],
    scales    : { w: 2, h: 3 },
    isMulti   : true
};
