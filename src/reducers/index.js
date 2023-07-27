import { combineReducers }  from 'redux';
import homie                from './homie';
import applicationInterface from './interface';
import client               from './client/index';
import scenarios            from './scenarios';
import session              from './session';
import user                 from './user';
import marketServices       from './marketServices';
import userServices         from './userServices';
import groups               from './groups';
import discovery            from './discovery';
import simpleScenarioTypes  from './simpleScenarioTypes';
import systemLogs           from './systemLogs';
import notificationChannels from './notificationChannels';
import scenarioTemplates    from './scenarioTemplates';
import backup               from './backup';
import systemUpdates        from './systemUpdates';
import aliases              from './aliases';
import extensions           from './extensions';
import notifications        from './notifications';

export default combineReducers({
    homie,
    applicationInterface,
    client,
    scenarios,
    simpleScenarioTypes,
    marketServices,
    userServices,
    session,
    user,
    groups,
    discovery,
    systemLogs,
    notificationChannels,
    backup,
    systemUpdates,
    aliases,
    scenarioTemplates,
    extensions,
    notifications
});
