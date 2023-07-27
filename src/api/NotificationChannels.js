import Base from './Base.js';

class NotificationChannels extends Base {
    getChannelsList() {
        return this.apiClient.get('notificationChannels');
    }
}

export default NotificationChannels;
