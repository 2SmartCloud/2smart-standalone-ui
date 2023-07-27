/* eslint-disable react/jsx-no-bind, react/no-multi-comp*/

import React, { PureComponent } from 'react';
import {  Switch }              from 'react-router';
import { Router }               from 'react-router-dom';
import config                   from '../config';
import history                  from './history.js';
import {
    HOME,
    NOT_FOUND,
    ADMIN,
    SCREEN,
    SCENARIOS,
    SCENARIO_CREATE,
    SCENARIO_EDIT,
    ADMIN_LOGIN,
    SETTINGS,
    SERVICES,
    SERVICE_CREATE,
    SERVICE_EDIT,
    GET_SMART,
    MARKET,
    SYSTEM_LOGS,
    NOTIFICATION_CHANNELS,
    NOTIFICATION_CHANNEL_CREATE,
    NOTIFICATION_CHANNEL_EDIT,
    DOCUMENTATION
} from './assets/constants/routes';
import Dashboard                 from './components/pages/admin/Dashboard';
import Scenarios                 from './components/pages/admin/ScenariosContainer';
import Settings                  from './components/pages/admin/Settings';
import ScenarioCreate            from './components/pages/admin/ScenarioCreateContainer';
import ScenarioEdit              from './components/pages/admin/ScenarioEditContainer';
import Services                  from './components/pages/admin/ServicesContainer';
import NotificationChannels      from './components/pages/admin/NotificationChannelsContainer';
import NotificationChannelCreate from './components/pages/admin/NotificationChannelCreateContainer';
import NotificationChannelEdit   from './components/pages/admin/NotificationChannelEditContainer';
import ServiceCreate             from './components/pages/admin/ServiceCreateContainer';
import ServiceEdit               from './components/pages/admin/ServiceEditContainer';
import Market                    from './components/pages/admin/MarketContainer';
import NotFound                  from './components/pages/NotFound';
import CommandPage               from './components/pages/CommandPage';
import SystemLogsPage            from './components/pages/admin/SystemLogsContainer';
import DocumentationPage         from './components/pages/DocumentationPage';
import AppRoute                  from './routes/AppRoute';
import LoginRoute                from './routes/LoginRoute';
import ClientDashboard           from './components/pages/client/Dashboard';

import 'react-toastify/dist/ReactToastify.css';

import AdminLayout               from './components/layouts/admin/Layout';
import ClientLayout              from './components/layouts/client/Layout';
import StaticLayout              from './components/layouts/StaticLayout';


class App extends PureComponent {
    render() {
        return (
            <Router history={history}>
                <Switch>
                    <AppRoute
                        path={HOME} component={ClientDashboard} layout={ClientLayout}
                        exact
                    />
                    <LoginRoute  path={ADMIN_LOGIN}  exact />
                    <AppRoute
                        path={ADMIN} component={Dashboard} layout={AdminLayout}
                        exact
                    />
                    <AppRoute
                        path={SCENARIOS} component={Scenarios} layout={AdminLayout}
                        exact
                    />
                    <AppRoute
                        path={SETTINGS} component={Settings} layout={AdminLayout}
                        exact
                    />
                    <AppRoute
                        path={SCENARIO_CREATE} component={ScenarioCreate} layout={AdminLayout}
                        exact
                    />
                    <AppRoute
                        path={SCENARIO_EDIT} component={ScenarioEdit} layout={AdminLayout}
                        exact
                    />
                    <AppRoute
                        path={SERVICES} component={Services} layout={AdminLayout}
                        exact
                    />
                    <AppRoute
                        path={SERVICE_CREATE} component={ServiceCreate} layout={AdminLayout}
                        exact
                    />
                    <AppRoute
                        path={SERVICE_EDIT} component={ServiceEdit} layout={AdminLayout}
                        exact
                    />
                    <AppRoute
                        path={MARKET} component={Market} layout={AdminLayout}
                        exact
                    />
                    <AppRoute
                        path={SYSTEM_LOGS} component={SystemLogsPage} layout={AdminLayout}
                        exact
                    />
                    <AppRoute
                        path={NOTIFICATION_CHANNELS} component={NotificationChannels} layout={AdminLayout}
                        exact
                    />
                    <AppRoute
                        path={NOTIFICATION_CHANNEL_CREATE} component={NotificationChannelCreate} layout={AdminLayout}
                        exact
                    />
                    <AppRoute
                        path={NOTIFICATION_CHANNEL_EDIT} component={NotificationChannelEdit} layout={AdminLayout}
                        exact
                    />
                    {config.env === 'demo' && <AppRoute
                        path={GET_SMART}
                        layout={StaticLayout}
                        component={CommandPage}
                    />
                    }
                    {config.env === 'demo' && <AppRoute
                        path={DOCUMENTATION}
                        layout={StaticLayout}
                        component={DocumentationPage}
                    />}
                    <AppRoute
                        path={NOT_FOUND}
                        layout={StaticLayout}
                        component={NotFound}
                    />
                    <AppRoute
                        path={SCREEN} component={ClientDashboard} layout={ClientLayout}
                        exact
                    />

                    <AppRoute
                        path='*'
                        component={NotFound}
                        layout={StaticLayout}
                    />
                </Switch>
            </Router>
        );
    }
}

export default App;
