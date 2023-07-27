import Base from './Base.js';

class Sessions extends Base {
    create(body) {
        return this.apiClient.post('sessions', body);
    }

    update(token) {
        return this.apiClient.post('sessions', { token });
    }
}

export default Sessions;
