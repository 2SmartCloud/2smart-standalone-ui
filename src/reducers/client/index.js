import { combineReducers } from 'redux';
import dashboard from './dashboard';
import widget from './widget';
import timeseries from './timeseries';

export default combineReducers({
    dashboard,
    widget,
    timeseries
});
