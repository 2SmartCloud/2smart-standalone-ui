import Base from './Base';

class SystemLogs extends Base {
    list(params) {
        return this.apiClient.get('logs', params);
    }
}

export default SystemLogs;
