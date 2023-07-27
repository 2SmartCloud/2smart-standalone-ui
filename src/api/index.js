import ApiClient               from './ApiClient.js';
import ApiAdmin                from './ApiAdmin.js';
import ScreensAPI              from './Screens.js';
import WidgetsAPI              from './Widgets.js';
import ScenariosAPI            from './Scenarios.js';
import SettingsAPI             from './Settings.js';
import UsersAPI                from './Users.js';
import SessionsAPI             from './Sessions';
import SessionsJwtAPI          from './SessionsJwt';
import SimpleScenarioTypes     from './SimpleScenarioTypes';
import SystemLogsAPI           from './SystemLogs';
import NotificationChannelsAPI from './NotificationChannels';
import BackupServiceAPI        from './BackupService';
import EnumAsyncAPI            from './EnumAsync';
import ScenarioTemplates       from './ScenarioTemplates';
import ExtensionsAPI           from './Extensions';
import ChangelogAPI            from './Changelog';

export default function ({ apiUrl, apiPrefix, backupApiUrl, backupApiPrefix } = {}) {
    if (!apiUrl) {
        throw new Error('[apiUrl] required');
    }
    if (!apiPrefix) {
        throw new Error('[apiPrefix] required');
    }
    if (!backupApiUrl) {
        throw new Error('[backupApiUrl] required');
    }
    if (!backupApiPrefix) {
        throw new Error('[backupApiPrefix] required');
    }

    const apiClient = new ApiClient({
        url    : apiUrl,
        prefix : apiPrefix,
        token  : localStorage.getItem('clientPanelAccessToken')
    });
    const apiAdmin = new ApiAdmin({
        url    : apiUrl,
        prefix : apiPrefix,
        token  : localStorage.getItem('jwt')
    });

    const apiBackup = new ApiAdmin({
        url    : backupApiUrl,
        prefix : backupApiPrefix,
        token  : localStorage.getItem('jwt')
    });

    return {
        apiClient,
        apiAdmin,
        screens              : new ScreensAPI({ apiClient }),
        widgets              : new WidgetsAPI({ apiClient }),
        scenarios            : new ScenariosAPI({ apiClient: apiAdmin }),
        simpleScenarioTypes  : new SimpleScenarioTypes({ apiClient: apiAdmin }),
        settings             : new SettingsAPI({ apiClient: apiAdmin }),
        users                : new UsersAPI({ apiClient: apiAdmin }),
        sessionsjwt          : new SessionsJwtAPI({ apiClient: apiAdmin }),
        sessions             : new SessionsAPI({ apiClient }),
        systemLogs           : new SystemLogsAPI({ apiClient: apiAdmin }),
        notificationChannels : new NotificationChannelsAPI({ apiClient: apiAdmin }),
        backupService        : new BackupServiceAPI({ apiClient: apiBackup }),
        enumAsync            : new EnumAsyncAPI({ apiClient: apiAdmin }),
        scenarioTemplates    : new ScenarioTemplates({ apiClient: apiAdmin }),
        extensions           : new ExtensionsAPI({ apiClient: apiAdmin }),
        changelog            : new ChangelogAPI({ apiClient: apiAdmin })
    };
}
