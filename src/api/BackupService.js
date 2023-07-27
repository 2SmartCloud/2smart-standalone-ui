import Base from './Base';

class BackupService extends Base {
    list(params) {
        return this.apiClient.get('backups/list', params);
    }

    restore(body) {
        return this.apiClient.post('backups/restore', body);
    }

    create(body) {
        return this.apiClient.post('backups/create', body);
    }
}

export default BackupService;
