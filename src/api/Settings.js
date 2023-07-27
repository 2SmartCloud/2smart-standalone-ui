import Base from './Base.js';

class Settings extends Base {
    show() {
        return this.apiClient.get('settings');
    }

    update(payload) {
        return this.apiClient.post('/settings', payload);
    }
}

export default Settings;
