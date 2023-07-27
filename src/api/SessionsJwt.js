import Base from './Base.js';

class SessionsJwt extends Base {
    login(payload) {
        return this.apiClient.post('sessions', payload);
    }

    update(payload) {
        return this.apiClient.post('sessions', payload);
    }
}

export default SessionsJwt;
