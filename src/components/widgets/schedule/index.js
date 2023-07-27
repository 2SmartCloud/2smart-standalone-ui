import icon         from '../../../assets/icons/widgets/schedule-option.svg';
import component    from './ScheduleWidget';

export default {
    component,
    icon,
    type      : 'schedule',
    label     : 'Schedule',
    dataTypes : [ 'string' ],
    scales    : { w: 2, h: 2 },
    isMulti   : true,
    editable  : true
};
